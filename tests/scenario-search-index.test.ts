import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, expect, it } from 'vitest'
import { ScenarioRepository } from '../src/admin/scenario-repository.ts'
import { caseSourcePath, parseCaseSource } from '../src/scenarios/case-source.ts'
import { migrateCaseSources, readInventory } from '../src/scenarios/inventory.ts'
import {
  buildScenarioIndex,
  readScenarioProjection,
  searchScenarios,
} from '../src/scenarios/search-index.ts'

const roots: string[] = []
async function fixture(count = 1) {
  const root = await mkdtemp(join(tmpdir(), 'scenario-index-'))
  roots.push(root)
  for (const directory of ['docs/scenarios', 'datasets/bench/journeys'])
    await mkdir(join(root, directory), { recursive: true })
  await writeFile(
    join(root, 'docs/scenarios/file.md'),
    Array.from(
      { length: count },
      (_, i) => `| \`file.open/${i + 1}\` | Open document ${i + 1} |`,
    ).join('\n'),
  )
  await writeFile(join(root, 'docs/scenarios/parcours.md'), '## P001 — Open scene\n')
  await writeFile(
    join(root, 'datasets/bench/journeys/P001.json'),
    JSON.stringify({
      id: 'P001',
      request: 'Open scene',
      requires: [],
      blockers: [],
      trainingApproved: false,
      steps: [
        {
          id: 'open',
          action: 'file.open',
          input: {},
          saveAs: 'opened',
          assertions: [{ actual: { $ref: 'opened' }, op: 'exists' }],
        },
      ],
    }),
  )
  return root
}
afterEach(async () => {
  await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})

it('searches bounded summaries by family, action, tag, language and text without embedding plans', async () => {
  const root = await fixture(501)
  expect((await buildScenarioIndex(root)).count).toBe(502)
  const result = await searchScenarios(root, {
    family: 'file',
    action: 'file.open',
    tag: 'case',
    language: 'fr',
    query: 'document',
    limit: 3,
  })
  expect(result.total).toBe(501)
  expect(result.items).toHaveLength(3)
  expect(result.items[0]).not.toHaveProperty('plan')
  await expect(searchScenarios(root, { limit: 101 })).rejects.toThrow('limit')
  await expect(searchScenarios(root, { limit: 0 })).rejects.toThrow('limit')
  expect((await searchScenarios(root, { tag: 'unknown' })).total).toBe(0)
})

it('provides one complete selected projection with authoritative source and never changes source files', async () => {
  const root = await fixture()
  const source = join(root, 'datasets/bench/journeys/P001.json')
  const before = await readFile(source, 'utf8')
  await buildScenarioIndex(root)
  expect(await readScenarioProjection(root, 'P001')).toMatchObject({
    generated: true,
    editSource: 'datasets/bench/journeys/P001.json',
    scenario: { id: 'P001', plan: { trainingApproved: false } },
  })
  expect(await readFile(source, 'utf8')).toBe(before)
  await expect(readScenarioProjection(root, '../../secret')).rejects.toThrow('not found')
})

it('rejects detail access after authored source changed until index is rebuilt', async () => {
  const root = await fixture()
  await buildScenarioIndex(root)
  await writeFile(join(root, 'docs/scenarios/file.md'), '| `file.open/1` | Updated request |\n')
  await expect(readScenarioProjection(root, 'file.open/1')).rejects.toThrow(
    'changed since indexing',
  )
  await buildScenarioIndex(root)
  expect(await readScenarioProjection(root, 'file.open/1')).toMatchObject({
    scenario: { title: 'Updated request' },
  })
})

it('rejects malformed index paths rather than reading arbitrary files', async () => {
  const root = await fixture()
  await buildScenarioIndex(root)
  const path = join(root, 'artifacts/scenario-index/index.json')
  const index = JSON.parse(await readFile(path, 'utf8'))
  index.generation = '../../outside'
  await writeFile(path, JSON.stringify(index))
  await expect(readScenarioProjection(root, 'P001')).rejects.toThrow('Invalid scenario index')
})

it.skipIf(process.platform === 'win32')(
  'refuses generated output redirected through a symlink',
  async () => {
    const root = await fixture()
    const outside = await mkdtemp(join(tmpdir(), 'scenario-outside-'))
    roots.push(outside)
    await symlink(outside, join(root, 'artifacts'))
    await expect(buildScenarioIndex(root)).rejects.toThrow('symlinked')
  },
)

it('refuses a modified generated detail instead of treating it as an authored update', async () => {
  const root = await fixture()
  await buildScenarioIndex(root)
  const path = join(root, 'artifacts/scenario-index/index.json')
  const index = JSON.parse(await readFile(path, 'utf8'))
  index.entries[0].detailHash = 'wrong'
  await writeFile(path, JSON.stringify(index))
  await expect(readScenarioProjection(root, 'P001')).rejects.toThrow('Projection changed')
})

it('migrates all cases losslessly then reads edits from canonical files across every consumer', async () => {
  const root = await fixture(3)
  const before = await readInventory(root)
  expect(await migrateCaseSources(root)).toEqual({ created: 3, total: 3 })
  // Lossless means the inventory consumers read is unchanged; which files now back it is not.
  const after = await readInventory(root)
  expect(after.cases).toEqual(before.cases)
  expect(after.journeys).toEqual(before.journeys)
  expect(after.overlays.size).toBe(before.cases.length)
  expect(await migrateCaseSources(root)).toEqual({ created: 0, total: 3 })
  const path = join(root, caseSourcePath('file.open/1', 'file.md'))
  const value = JSON.parse(await readFile(path, 'utf8'))
  value.specification = 'Open the updated document'
  value.tags = ['regression', 'files']
  await writeFile(path, JSON.stringify(value))
  const repo = new ScenarioRepository(root)
  const entry = await repo.detail('file.open/1')
  expect(entry.source).toBe('datasets/scenario-cases/file/file.open--1.json')
  expect(entry.title).toBe(value.specification)
  expect((await readInventory(root)).cases[0]?.specification).toBe(value.specification)
  await buildScenarioIndex(root)
  expect((await searchScenarios(root, { tag: 'regression' })).items.map(row => row.id)).toEqual([
    'file.open/1',
  ])
  const changed = await repo.updateCase(entry.id, entry.revision, 'Edited in UI')
  expect(changed.title).toBe('Edited in UI')
  expect(changed.tags).toEqual(['files', 'regression'])
  expect(await readFile(join(root, 'docs/scenarios/file.md'), 'utf8')).not.toContain('Edited in UI')
})

it('rejects malformed canonical data and changed identity instead of silently using old Markdown', async () => {
  const root = await fixture()
  await migrateCaseSources(root)
  const path = join(root, caseSourcePath('file.open/1', 'file.md'))
  const value = JSON.parse(await readFile(path, 'utf8'))
  expect(() => parseCaseSource({ ...value, tags: ['../unsafe'] })).toThrow()
  expect(() => parseCaseSource({ ...value, specification: 'line\nline' })).toThrow()
  // The Markdown round trip is gone, and with it the reason a specification could not hold a bar.
  expect(parseCaseSource({ ...value, specification: 'Ouvrir A | B' }).specification).toBe(
    'Ouvrir A | B',
  )
  await writeFile(path, JSON.stringify({ ...value, id: 'file.open/2' }))
  await expect(readInventory(root)).rejects.toThrow('identity mismatch')
})

it('follows a case whose row moves to another document, keeping one file and its edit', async () => {
  const root = await fixture()
  await migrateCaseSources(root)
  const repo = new ScenarioRepository(root)
  const before = await repo.detail('file.open/1')
  const edited = await repo.updateCase(before.id, before.revision, 'Edited before the move')
  expect(edited.source).toBe('datasets/scenario-cases/file/file.open--1.json')

  // The author moves the row from file.md to another document, as only a human can.
  await writeFile(join(root, 'docs/scenarios/file.md'), '')
  await writeFile(join(root, 'docs/scenarios/archive.md'), '| `file.open/1` | Open document 1 |')

  // The edit survives the move: a case is its identity, not the document listing it.
  const moved = await repo.detail('file.open/1')
  expect(moved.title).toBe('Edited before the move')
  expect(moved.family).toBe('archive')

  // The next edit refiles it, and leaves exactly one file claiming the identity.
  const refiled = await repo.updateCase(moved.id, moved.revision, 'Edited after the move')
  expect(refiled.source).toBe('datasets/scenario-cases/archive/file.open--1.json')
  const homes = await Promise.all(
    ['file', 'archive'].map(family =>
      readFile(join(root, `datasets/scenario-cases/${family}/file.open--1.json`), 'utf8').then(
        () => family,
        () => '',
      ),
    ),
  )
  expect(homes.filter(Boolean)).toEqual(['archive'])
  // Every reader still loads the store; a second file would refuse it for all of them.
  expect((await readInventory(root)).cases[0]?.specification).toBe('Edited after the move')
})
