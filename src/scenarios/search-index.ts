import { randomUUID } from 'node:crypto'
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import {
  listAllScenarios,
  type ScenarioEntry,
  ScenarioRepository,
} from '../admin/scenario-repository.ts'
import { sha256 } from '../catalogue/catalogue.ts'
import { assertNoSymlink, atomicWrite } from '../files.ts'
import { record } from '../json.ts'
import { RANDOM_ID } from './identity.ts'

export interface ScenarioSearchEntry {
  id: string
  kind: 'case' | 'journey'
  title: string
  source: string
  hash: string
  revision: string
  family: string
  families: string[]
  tags: string[]
  actions: string[]
  languages: string[]
  ready: boolean
  active: boolean
  detailHash: string
}
export interface ScenarioSearchOptions {
  query?: string
  family?: string
  action?: string
  tag?: string
  language?: string
  limit?: number
}
interface SearchIndex {
  version: 1
  generatedAt: string
  generation: string
  entries: ScenarioSearchEntry[]
}
const unique = (values: string[]) => [...new Set(values)].sort()
const safeFamily = (value: string) => (/^[a-z][a-z0-9-]*$/.test(value) ? value : 'other')

function summary(
  entry: ScenarioEntry,
  families: Map<string, string>,
  raw: string,
): ScenarioSearchEntry {
  const actions = unique(
    entry.plan ? entry.plan.steps.map(step => step.action) : [entry.id.split('/')[0] ?? ''],
  )
  const related = unique(
    actions.map(action => families.get(action) ?? safeFamily(action.split('.')[0] ?? 'other')),
  )
  const family =
    entry.kind === 'case'
      ? safeFamily(entry.family ?? basename(entry.source, '.md'))
      : related.length === 1
        ? (related[0] ?? 'journeys')
        : 'journeys'
  return {
    id: entry.id,
    kind: entry.kind,
    title: entry.title.slice(0, 240),
    source: entry.source,
    hash: entry.scenarioHash,
    revision: entry.revision,
    family,
    families: unique([family, ...related]),
    tags: unique([entry.kind, family, ...related, ...actions, ...(entry.tags ?? [])]),
    actions,
    languages: unique(['fr', ...entry.languages.map(locale => locale.language)]),
    ready: entry.ready,
    active: entry.active,
    detailHash: sha256(raw),
  }
}

/** Generated projection only: source files and proof identities remain authoritative. */
export async function buildScenarioIndex(root: string) {
  const directory = join(root, 'artifacts/scenario-index')
  await assertNoSymlink(root, 'artifacts/scenario-index')
  await mkdir(directory, { recursive: true })
  const generation = randomUUID()
  const records = join(directory, generation)
  await mkdir(records)
  const repository = new ScenarioRepository(root)
  const entries: ScenarioSearchEntry[] = []
  try {
    const catalogue = await listAllScenarios(options => repository.list(options))
    // The catalogue already carries every case with its family, and a case id starts with its
    // action: reading the inventory again here would re-read the whole canonical store for it.
    const families = new Map(
      catalogue
        .filter(entry => entry.kind === 'case')
        .map(entry => [entry.id.split('/')[0] ?? '', safeFamily(entry.family ?? '')]),
    )
    const documents = catalogue.map(entry => {
      const raw = `${JSON.stringify({ generated: true, editSource: entry.source, scenario: entry }, null, 2)}\n`
      return { row: summary(entry, families, raw), raw }
    })
    // One directory per family, not one per entry, and the files go out in batches: the walk
    // is thousands of independent writes, and awaiting each one serialises the whole index.
    await Promise.all(
      [...new Set(documents.map(item => item.row.family))].map(family =>
        mkdir(join(records, family), { recursive: true }),
      ),
    )
    for (let offset = 0; offset < documents.length; offset += 64)
      await Promise.all(
        documents.slice(offset, offset + 64).map(item =>
          writeFile(join(records, item.row.family, `${sha256(item.row.id)}.json`), item.raw, {
            flag: 'wx',
          }),
        ),
      )
    entries.push(...documents.map(item => item.row))
    const index: SearchIndex = {
      version: 1,
      generatedAt: new Date().toISOString(),
      generation,
      entries,
    }
    await atomicWrite(join(directory, 'index.json'), `${JSON.stringify(index)}\n`)
    // Only index.json names a generation; earlier ones are unreachable, so do not keep them.
    for (const stale of await readdir(directory, { withFileTypes: true }))
      if (stale.isDirectory() && stale.name !== generation)
        await rm(join(directory, stale.name), { recursive: true, force: true })
    return { count: entries.length, path: join(directory, 'index.json') }
  } catch (error) {
    await rm(records, { recursive: true, force: true })
    throw error
  }
}

const strings = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(item => typeof item === 'string')
function isEntry(value: unknown): value is ScenarioSearchEntry {
  if (!record(value)) return false
  return (
    ['id', 'title', 'source', 'hash', 'revision', 'detailHash'].every(
      key => typeof value[key] === 'string',
    ) &&
    (value.kind === 'case' || value.kind === 'journey') &&
    typeof value.ready === 'boolean' &&
    typeof value.active === 'boolean' &&
    strings(value.families) &&
    strings(value.tags) &&
    strings(value.actions) &&
    strings(value.languages) &&
    typeof value.family === 'string' &&
    safeFamily(value.family) === value.family
  )
}
async function readIndex(root: string): Promise<SearchIndex> {
  const value: unknown = JSON.parse(
    await readFile(join(root, 'artifacts/scenario-index/index.json'), 'utf8'),
  )
  if (
    !record(value) ||
    value.version !== 1 ||
    typeof value.generatedAt !== 'string' ||
    typeof value.generation !== 'string' ||
    !RANDOM_ID.test(value.generation) ||
    !Array.isArray(value.entries) ||
    !value.entries.every(isEntry)
  )
    throw new Error('Invalid scenario index; rebuild it')
  return {
    version: 1,
    generatedAt: value.generatedAt,
    generation: value.generation,
    entries: value.entries,
  }
}

export async function searchScenarios(root: string, options: ScenarioSearchOptions = {}) {
  const limit = options.limit ?? 20
  if (!Number.isInteger(limit) || limit < 1 || limit > 100)
    throw new Error('Search limit must be between 1 and 100')
  const index = await readIndex(root)
  const query = options.query?.toLocaleLowerCase() ?? ''
  const matches = index.entries.filter(
    entry =>
      (!options.family || entry.families.includes(options.family)) &&
      (!options.action || entry.actions.includes(options.action)) &&
      (!options.tag || entry.tags.includes(options.tag)) &&
      (!options.language || entry.languages.includes(options.language)) &&
      `${entry.id} ${entry.title} ${entry.tags.join(' ')}`.toLocaleLowerCase().includes(query),
  )
  return { generatedAt: index.generatedAt, total: matches.length, items: matches.slice(0, limit) }
}

export async function readScenarioProjection(root: string, id: string) {
  const index = await readIndex(root)
  const entry = index.entries.find(item => item.id === id)
  if (!entry) throw new Error('Scenario not found in index')
  const current = await new ScenarioRepository(root).detail(id)
  if (current.revision !== entry.revision)
    throw new Error('Scenario changed since indexing; rebuild the index')
  await assertNoSymlink(
    root,
    `artifacts/scenario-index/${index.generation}/${entry.family}/${sha256(id)}.json`,
  )
  const raw = await readFile(
    join(root, 'artifacts/scenario-index', index.generation, entry.family, `${sha256(id)}.json`),
    'utf8',
  )
  if (sha256(raw) !== entry.detailHash)
    throw new Error('Projection changed; edit the authoritative source and rebuild')
  const value: unknown = JSON.parse(raw)
  return value
}
