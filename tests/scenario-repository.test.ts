import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { assertCurrentJourneySources } from '../src/admin/current-sources.ts'
import { assertScenarioEnabled } from '../src/admin/scenario-activation.ts'
import { ScenarioRepository } from '../src/admin/scenario-repository.ts'
import { runPipeline } from '../src/vm/pipeline.ts'

const roots: string[] = []
const plan = (id = 'P001') => ({
  id,
  request: 'Read scene',
  requires: [],
  blockers: [],
  trainingApproved: false,
  steps: [
    {
      id: 'state',
      action: 'scene.state',
      input: {},
      saveAs: 'state',
      assertions: [{ actual: { $ref: 'state' }, op: 'exists' }],
    },
  ],
})
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'scenario-admin-'))
  roots.push(root)
  for (const dir of ['docs/scenarios', 'datasets/bench/journeys', 'artifacts'])
    await mkdir(join(root, dir), { recursive: true })
  await writeFile(join(root, 'docs/scenarios/cases.md'), '| `scene.state/1` | Read state |\n')
  await writeFile(join(root, 'docs/scenarios/parcours.md'), '## P001 — Read scene\n')
  await writeFile(
    join(root, 'artifacts/catalogue.json'),
    JSON.stringify({
      mcpTools: [
        {
          name: 'scene_state',
          inputSchema: { type: 'object', additionalProperties: false },
        },
      ],
    }),
  )
  await writeFile(join(root, 'datasets/bench/journeys/P001.json'), JSON.stringify(plan()))
  return { root, repo: new ScenarioRepository(root) }
}
afterEach(async () => {
  await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})
describe('scenario source administration', () => {
  it('lists authored cases separately from executable journeys', async () => {
    const { repo } = await fixture()
    const all = await repo.list()
    expect(all.total).toBe(2)
    expect(all.items.filter(item => item.kind === 'case')).toHaveLength(1)
    expect((await repo.list({ query: 'P001' })).total).toBe(1)
    expect((await repo.list({ kind: 'journey', limit: 1 })).items.map(item => item.id)).toEqual([
      'P001',
    ])
    expect((await repo.list({ kind: 'case', limit: 1 })).items.map(item => item.id)).toEqual([
      'scene.state/1',
    ])
    expect((await repo.list({ kind: 'case', offset: 1 })).total).toBe(1)
    expect((await repo.list({ kind: 'case', offset: 1 })).items).toHaveLength(0)
  })
  it('changes exact scenario hash and rejects a stale editor', async () => {
    const { repo } = await fixture()
    const old = await repo.detail('P001')
    const changed = await repo.update('P001', old.revision, {
      ...plan(),
      request: 'Read current scene',
    })
    expect(changed.scenarioHash).not.toBe(old.scenarioHash)
    await expect(repo.update('P001', old.revision, plan())).rejects.toMatchObject({ status: 409 })
  })
  it('keeps activation distinct from content approval', async () => {
    const { repo } = await fixture()
    const old = await repo.detail('P001')
    const active = await repo.setActive('P001', old.revision, true)
    expect(active.active).toBe(true)
    expect(active.scenarioHash).toBe(old.scenarioHash)
    expect(active.plan?.trainingApproved).toBe(false)
    expect(active.revision).not.toBe(old.revision)
  })
  it('rejects unknown actions, approval bypasses and identity changes without writing', async () => {
    const { repo, root } = await fixture()
    const old = await repo.detail('P001')
    const raw = await readFile(join(root, old.source), 'utf8')
    await expect(
      repo.update('P001', old.revision, { ...plan(), trainingApproved: true }),
    ).rejects.toThrow()
    await expect(repo.update('P001', old.revision, plan('P002'))).rejects.toThrow()
    const bad = plan()
    const first = bad.steps[0]
    if (!first) throw new Error('Missing fixture step')
    first.action = 'fake.action'
    await expect(repo.update('P001', old.revision, bad)).rejects.toThrow()
    expect(await readFile(join(root, old.source), 'utf8')).toBe(raw)
  })
  it('creates only safe new journeys and refuses collisions', async () => {
    const { repo } = await fixture()
    expect((await repo.create(plan('P064'))).active).toBe(false)
    await expect(repo.create(plan('P064'))).rejects.toMatchObject({
      status: 409,
    })
    await expect(repo.create(plan('../../bad'))).rejects.toThrow()
  })
  it('serializes simultaneous edits and rejects activating blocked plans', async () => {
    const { repo } = await fixture()
    const old = await repo.detail('P001')
    const results = await Promise.allSettled([
      repo.update('P001', old.revision, { ...plan(), request: 'First' }),
      repo.update('P001', old.revision, { ...plan(), request: 'Second' }),
    ])
    expect(results.filter(result => result.status === 'fulfilled')).toHaveLength(1)
    const current = await repo.detail('P001')
    const blocked = await repo.update('P001', current.revision, {
      ...plan(),
      blockers: ['fixture missing'],
    })
    await expect(repo.setActive('P001', blocked.revision, true)).rejects.toThrow()
  })
  it('edits case source without promoting it to executable', async () => {
    const { repo } = await fixture()
    const old = await repo.detail('scene.state/1')
    const updated = await repo.updateCase(old.id, old.revision, 'Read the active scene state')
    expect(updated.title).toBe('Read the active scene state')
    expect(updated.ready).toBe(false)
    await expect(repo.updateCase(old.id, old.revision, 'Old edit')).rejects.toMatchObject({
      status: 409,
    })
    // The Markdown round trip is gone: a bar is ordinary text now, a line break still is not.
    const bar = await repo.updateCase(old.id, updated.revision, 'Read A | B state')
    expect(bar.title).toBe('Read A | B state')
    await expect(repo.updateCase(old.id, bar.revision, 'two\nlines')).rejects.toThrow()
  })
  it('rejects a stale manifest after source edits', async () => {
    const { repo, root } = await fixture()
    const old = await repo.detail('P001')
    await assertCurrentJourneySources(root, { P001: old.scenarioHash })
    await repo.update('P001', old.revision, {
      ...plan(),
      request: 'Changed request',
    })
    await expect(assertCurrentJourneySources(root, { P001: old.scenarioHash })).rejects.toThrow(
      'source changed',
    )
  })
  it('edits translations as drafts and rejects stale locale edits', async () => {
    const { repo, root } = await fixture()
    await mkdir(join(root, 'datasets/scenarios/journey-locales'), {
      recursive: true,
    })
    await writeFile(
      join(root, 'datasets/scenarios/journeys.fr.json'),
      JSON.stringify({ P001: 'Lire la scène' }),
    )
    await writeFile(
      join(root, 'datasets/scenarios/journey-locales/en.json'),
      JSON.stringify({ templates: { P001: 'Read scene' }, status: 'draft' }),
    )
    const before = await repo.detail('P001')
    const after = await repo.updateLanguage('P001', before.revision, 'en', 'Read current scene')
    expect(after.revision).not.toBe(before.revision)
    expect(after.languages.find(item => item.language === 'en')?.status).toBe(
      'manual-edit-review-required',
    )
    await expect(repo.updateLanguage('P001', before.revision, 'en', 'Stale')).rejects.toMatchObject(
      { status: 409 },
    )
    await expect(
      repo.updateLanguage('P001', after.revision, 'en', 'Changed {placeholder}'),
    ).rejects.toThrow()
  })
  it('refuses an explicitly disabled journey before any VM lookup or creation', async () => {
    const { repo, root } = await fixture()
    await assertScenarioEnabled(root, 'P001')
    const current = await repo.detail('P001')
    await repo.setActive('P001', current.revision, false)
    const operations: string[] = []
    await expect(
      runPipeline({
        preflight: () => assertScenarioEnabled(root, 'P001'),
        findReference: async () => {
          operations.push('find')
          return undefined
        },
        prepare: async () => {
          operations.push('create')
        },
        build: async () => {
          operations.push('build')
        },
      }),
    ).rejects.toThrow('disabled')
    expect(operations).toEqual([])
  })
  it('rejects unknown references before writing a plan', async () => {
    const { repo } = await fixture()
    const current = await repo.detail('P001')
    const invalid = plan()
    const step = invalid.steps[0]
    if (!step) throw new Error('Missing fixture')
    step.assertions[0] = { actual: { $ref: 'unknown' }, op: 'exists' }
    await expect(repo.update('P001', current.revision, invalid)).rejects.toThrow('Unknown binding')
  })
})

it('refreshes cached pages after external edits, additions and deletions without restarting', async () => {
  const { repo, root } = await fixture()
  expect((await repo.list({ kind: 'case' })).items[0]?.title).toBe('Read state')
  await writeFile(join(root, 'docs/scenarios/cases.md'), '| `scene.state/1` | Read other |\n')
  expect((await repo.list({ kind: 'case' })).items[0]?.title).toBe('Read other')
  expect((await repo.list({ kind: 'journey' })).total).toBe(1)
  await writeFile(join(root, 'datasets/bench/journeys/P002.json'), JSON.stringify(plan('P002')))
  expect((await repo.list({ kind: 'journey' })).total).toBe(2)
  await rm(join(root, 'datasets/bench/journeys/P002.json'))
  expect((await repo.list({ kind: 'journey' })).total).toBe(1)
  const current = await repo.detail('P001')
  await repo.setActive(current.id, current.revision, true)
  expect((await repo.list({ kind: 'journey' })).items[0]?.active).toBe(true)
})
