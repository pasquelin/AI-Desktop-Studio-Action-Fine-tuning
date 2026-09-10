import { lstat, mkdir, readdir, readFile, rm } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { assertNoSymlink, atomicWrite } from '../files.ts'
import { absent, record } from '../json.ts'

export interface CaseSource {
  version: 1
  id: string
  source: string
  specification: string
  tags: string[]
}
export function caseSourcePath(id: string, source: string) {
  if (!/^[a-zA-Z][a-zA-Z0-9.]*\/\d+$/.test(id) || !/^[a-z][a-z0-9-]*\.md$/.test(source))
    throw new Error('Invalid case identity or family')
  return `datasets/scenario-cases/${basename(source, '.md')}/${id.replace('/', '--')}.json`
}
/**
 * A specification is a one-line summary, so a line break is refused. A vertical bar is not:
 * it was only ever forbidden because the value used to be rendered into a Markdown table row
 * before being read back, and nothing renders it any more.
 */
export function parseCaseSource(value: unknown): CaseSource {
  if (
    !record(value) ||
    value.version !== 1 ||
    typeof value.id !== 'string' ||
    typeof value.source !== 'string' ||
    typeof value.specification !== 'string' ||
    !value.specification.trim() ||
    /[\r\n]/.test(value.specification) ||
    !Array.isArray(value.tags) ||
    value.tags.length > 32 ||
    !value.tags.every(
      (tag: unknown) => typeof tag === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,63}$/.test(tag),
    )
  )
    throw new Error('Invalid canonical case')
  if (
    Object.keys(value).some(
      key => !['version', 'id', 'source', 'specification', 'tags'].includes(key),
    )
  )
    throw new Error('Unknown canonical case property')
  caseSourcePath(value.id, value.source)
  return {
    version: 1,
    id: value.id,
    source: value.source,
    specification: value.specification,
    tags: [...new Set(value.tags as string[])].sort(),
  }
}
export async function readCaseSources(root: string): Promise<Map<string, CaseSource>> {
  const directory = 'datasets/scenario-cases'
  await assertNoSymlink(root, directory)
  const result = new Map<string, CaseSource>()
  let families: string[]
  try {
    families = await readdir(join(root, directory))
  } catch (error) {
    if (absent(error)) return result
    throw error
  }
  for (const family of families.sort()) {
    if (!/^[a-z][a-z0-9-]*$/.test(family)) throw new Error('Invalid case family directory')
    await assertNoSymlink(root, `${directory}/${family}`)
    const filenames = (await readdir(join(root, directory, family)))
      .filter(file => file.endsWith('.json'))
      .sort()
    for (let offset = 0; offset < filenames.length; offset += 64) {
      const loaded = await Promise.all(
        filenames.slice(offset, offset + 64).map(async filename => {
          const path = `${directory}/${family}/${filename}`
          if ((await lstat(join(root, path))).isSymbolicLink())
            throw new Error('Symlinked canonical case is forbidden')
          const item = parseCaseSource(JSON.parse(await readFile(join(root, path), 'utf8')))
          if (path !== caseSourcePath(item.id, item.source))
            throw new Error('Canonical case identity mismatch')
          return item
        }),
      )
      for (const item of loaded) {
        if (result.has(item.id)) throw new Error('Duplicate canonical case')
        result.set(item.id, item)
      }
    }
  }
  return result
}
/**
 * Match the repository JSON layout: short tag arrays stay on one line. `JSON.stringify` cannot
 * do this — it always expands an array — and these files are formatted by the same gate as the
 * rest of the repository, so the width below must track `formatter.lineWidth` in biome.json.
 */
const LINE_WIDTH = 100
function formatCaseSource(item: CaseSource) {
  const compact = `[${item.tags.map(tag => JSON.stringify(tag)).join(', ')}]`
  const tags =
    `  "tags": ${compact}`.length <= LINE_WIDTH
      ? compact
      : JSON.stringify(item.tags, null, 2).replaceAll('\n', '\n  ')
  return `{
  "version": 1,
  "id": ${JSON.stringify(item.id)},
  "source": ${JSON.stringify(item.source)},
  "specification": ${JSON.stringify(item.specification)},
  "tags": ${tags}
}
`
}
/**
 * A case is filed under the family whose Markdown declares it, so a row moved from one document
 * to another changes where its file belongs. Publishing the new one while the old one stays
 * would leave two files claiming a single identity, and every reader refuses the whole store
 * from that point on. Retiring comes first: interrupted, the case falls back to its authored
 * row, where leaving both would break the catalogue for everyone.
 */
async function retireOtherHomes(root: string, id: string, keep: string) {
  const directory = 'datasets/scenario-cases'
  let families: string[]
  try {
    families = await readdir(join(root, directory))
  } catch (error) {
    if (absent(error)) return
    throw error
  }
  const filename = `${id.replace('/', '--')}.json`
  await Promise.all(
    families.map(async family => {
      const path = `${directory}/${family}/${filename}`
      if (path === keep) return
      // Only a file that really holds this identity is retired; a name collision is not consent.
      const held = await readFile(join(root, path), 'utf8').catch(error => {
        if (absent(error)) return ''
        throw error
      })
      if (held && parseCaseSource(JSON.parse(held)).id === id)
        await rm(join(root, path), { force: true })
    }),
  )
}

export async function writeCaseSource(root: string, value: CaseSource) {
  const item = parseCaseSource(value)
  const path = caseSourcePath(item.id, item.source)
  await assertNoSymlink(root, path)
  await retireOtherHomes(root, item.id, path)
  const target = join(root, path)
  await mkdir(join(target, '..'), { recursive: true })
  await atomicWrite(target, formatCaseSource(item))
}
