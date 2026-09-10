import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { sha256 } from '../catalogue/catalogue.ts'
import { type CaseSource, readCaseSources, writeCaseSource } from './case-source.ts'

export type InventoryCase = {
  id: string
  action: string
  source: string
  specification: string
}
export type InventoryJourney = {
  id: string
  source: string
  specification: string
}

/** Keep authored prose intact; extraction must never manufacture a verified fixture. */
export function parseInventory(sources: Record<string, string>) {
  const cases: InventoryCase[] = []
  const journeys: InventoryJourney[] = []
  const ids = new Set<string>()
  function reserve(id: string) {
    if (ids.has(id)) throw new Error(`Duplicate scenario identifier: ${id}`)
    ids.add(id)
  }
  for (const [source, text] of Object.entries(sources).sort(([a], [b]) =>
    a.localeCompare(b, 'en'),
  )) {
    for (const match of text.matchAll(/^\| `([^`|]+)\/(\d+)` \| (.+) \|\s*$/gm)) {
      const [, action, number, specification] = match
      if (!action || !number || !specification) throw new Error('Incomplete scenario row')
      const id = `${action}/${number}`
      reserve(id)
      cases.push({ id, action, source, specification })
    }
    if (source === 'parcours.md') {
      for (const match of text.matchAll(/^## (P\d+) — ([\s\S]*?)(?=^## P\d+ — |$(?![\s\S]))/gm)) {
        const [, id, specification] = match
        if (!id || !specification) throw new Error('Incomplete journey')
        reserve(id)
        journeys.push({ id, source, specification: specification.trim() })
      }
    }
  }
  if (cases.length === 0 || journeys.length === 0)
    throw new Error('Empty scenario inventory or journeys')
  return { cases, journeys }
}

/** The authored Markdown, as written. It decides which scenarios exist. */
export async function readScenarioSources(root: string): Promise<Record<string, string>> {
  const directory = join(root, 'docs/scenarios')
  const sources: Record<string, string> = {}
  for (const file of (await readdir(directory)).filter(file => file.endsWith('.md')).sort())
    sources[file] = await readFile(join(directory, file), 'utf8')
  return sources
}

/**
 * The inventory every reader wants: the authored Markdown, with each canonical file replacing
 * the specification of the case it names. The merge happens on the parsed objects. Rendering a
 * canonical value back into a table row only to split it out again made the row syntax a
 * constraint on the stored data, and put two regular expressions in charge of agreeing.
 *
 * A canonical file whose row was removed or renamed is orphaned: its value is dropped, and it
 * never affects the other cases.
 */
export async function readInventory(root: string, canonical?: Map<string, CaseSource>) {
  const sources = await readScenarioSources(root)
  const { cases, journeys } = parseInventory(sources)
  const stored = canonical ?? (await readCaseSources(root))
  // Which canonical files actually apply is decided once, here. A second reader deciding it
  // again from the same map is free to answer differently for the very same case.
  //
  // The identity is the case id, not the document it is currently listed in: a row moved from
  // one Markdown file to another is the same case, and refusing its stored specification there
  // would silently discard an edit. A case whose row is gone from every document simply is not
  // in `cases`, so its file is never consulted.
  const overlays = new Map<string, CaseSource>()
  const merged = cases.map(item => {
    const overlay = stored.get(item.id)
    if (!overlay) return item
    overlays.set(item.id, overlay)
    return { ...item, specification: overlay.specification }
  })
  return { sources, journeys, overlays, cases: merged }
}

/** Idempotent migration: retain edited canonical files, seed only absent cases. */
export async function migrateCaseSources(root: string) {
  const existing = await readCaseSources(root)
  const inventory = await readInventory(root, existing)
  let created = 0
  for (const item of inventory.cases) {
    if (existing.has(item.id)) continue
    await writeCaseSource(root, {
      version: 1,
      id: item.id,
      source: item.source,
      specification: item.specification,
      tags: [item.action],
    })
    created++
  }
  return { created, total: inventory.cases.length }
}

/**
 * Provenance for the prepared artifacts. The canonical specifications used to be folded into the
 * Markdown before it was hashed, so an edited case changed its file's hash; recording them beside
 * the authored text keeps that guarantee without rendering anything.
 */
export function inventorySourceHashes(
  sources: Record<string, string>,
  cases: readonly InventoryCase[],
): Record<string, string> {
  const specifications = new Map<string, string[]>()
  for (const item of cases) {
    const rows = specifications.get(item.source) ?? []
    if (!rows.length) specifications.set(item.source, rows)
    rows.push(`${item.id}\t${item.specification}`)
  }
  return Object.fromEntries(
    Object.entries(sources).map(([file, text]) => [
      file,
      sha256([text, ...(specifications.get(file) ?? [])].join('\n')),
    ]),
  )
}
