import { lstat, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { sha256 } from '../catalogue/catalogue.ts'
import { absent } from '../json.ts'
import type { ScenarioEntry } from './scenario-repository.ts'

type Kind = 'case' | 'journey' | undefined
const cache = new Map<string, { signature: string; entries: ScenarioEntry[] }>()
const pending = new Map<string, Promise<ScenarioEntry[]>>()

async function filesAt(root: string, directory: string, recursive = false): Promise<string[]> {
  try {
    return (await readdir(join(root, directory), { withFileTypes: true, recursive }))
      .filter(entry => entry.isFile() || entry.isSymbolicLink())
      .filter(entry => /\.(json|md)$/.test(entry.name))
      .map(entry => join(entry.parentPath, entry.name))
  } catch (error) {
    if (absent(error)) return []
    throw error
  }
}
async function signature(root: string, kind: Kind) {
  const lists: Promise<string[]>[] = []
  if (kind !== 'journey')
    lists.push(filesAt(root, 'docs/scenarios'), filesAt(root, 'datasets/scenario-cases', true))
  if (kind !== 'case')
    lists.push(
      filesAt(root, 'datasets/bench/journeys'),
      filesAt(root, 'datasets/scenarios/journey-locales'),
      filesAt(root, 'datasets/admin/activation'),
      Promise.resolve([join(root, 'datasets/scenarios/journeys.fr.json')]),
    )
  const files = (await Promise.all(lists)).flat().sort()
  const versions: string[] = []
  for (let offset = 0; offset < files.length; offset += 128) {
    versions.push(
      ...(await Promise.all(
        files.slice(offset, offset + 128).map(async file => {
          try {
            const stat = await lstat(file, { bigint: true })
            return `${file}:${stat.size}:${stat.mtimeNs}:${stat.ctimeNs}:${stat.ino}:${stat.isSymbolicLink()}`
          } catch (error) {
            if (absent(error)) return `${file}:missing`
            throw error
          }
        }),
      )),
    )
  }
  return sha256(versions.join('\n'))
}

/**
 * Recheck filesystem metadata on every request; only unchanged content parsing is reused.
 * The sweep is the cost of seeing an external edit at once, so callers that need the whole
 * catalogue should issue their pages concurrently: `pending` then collapses them into one sweep.
 */
export async function scenarioSourceSnapshot(
  root: string,
  kind: Kind,
  load: () => Promise<ScenarioEntry[]>,
): Promise<ScenarioEntry[]> {
  const key = `${root}\0${kind ?? 'all'}`
  const existing = pending.get(key)
  if (existing) return existing
  const work = (async () => {
    const before = await signature(root, kind)
    const hit = cache.get(key)
    if (hit?.signature === before) return hit.entries
    const entries = await load()
    const after = await signature(root, kind)
    if (before !== after) throw new Error('Scenario sources changed during reading; retry')
    cache.set(key, { signature: after, entries })
    return entries
  })()
  pending.set(key, work)
  try {
    return await work
  } finally {
    if (pending.get(key) === work) pending.delete(key)
  }
}
