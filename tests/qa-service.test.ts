import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, expect, it, vi } from 'vitest'
import type { ScenarioEntry } from '../src/admin/scenario-repository.ts'
import { QaService } from '../src/qa/service.ts'
import type { VmSessionState } from '../src/qa/session.ts'

const roots: string[] = []
afterEach(async () => {
  await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})
const launch = { model: 'small:latest', selection: 'all', stopOnFailure: false }
function entry(id: string, ready = true): ScenarioEntry {
  return {
    id,
    ready,
    kind: 'journey',
    title: `Test ${id}`,
    source: '',
    revision: '',
    scenarioHash: '',
    active: true,
    missing: [],
    blockers: ready ? [] : ['fixture absente'],
    languages: [],
  }
}
async function setup(entries: ScenarioEntry[] = [entry('P001'), entry('P003')]) {
  const root = await mkdtemp(join(tmpdir(), 'qa-service-'))
  roots.push(root)
  const vm = {
    start: vi.fn(async () => {}),
    snapshot: vi.fn((): VmSessionState => ({ status: 'ready' })),
    run: vi.fn(
      async (_id: string, _model: string): Promise<Record<string, unknown>> => ({ code: 0 }),
    ),
  }
  const models = vi.fn(async () => ({ status: 'ready' as const, models: ['small:latest'] }))
  const repository = {
    list: vi.fn(async (options: { offset?: number; limit?: number } = {}) => ({
      total: entries.length,
      items: entries.slice(options.offset ?? 0, (options.offset ?? 0) + (options.limit ?? 100)),
    })),
  }
  return { root, vm, models, repository, service: new QaService(root, { vm, models, repository }) }
}
it('refuses absent model and unavailable VM before any scenario launch', async () => {
  const { service, vm } = await setup()
  await expect(service.start({ ...launch, model: 'missing' })).rejects.toThrow('modèle local')
  vm.snapshot.mockReturnValue({ status: 'stopped' })
  await expect(service.start(launch)).rejects.toThrow('VM soit prête')
  expect(vm.run).not.toHaveBeenCalled()
  expect(vm.start).not.toHaveBeenCalled()
})
it('serializes a campaign, continues after failure and persists exact reports', async () => {
  const { service, vm, root } = await setup()
  vm.run.mockResolvedValueOnce({
    code: 1,
    error: 'réouverture refusée',
    runId: 'run-one',
    reportPath: 'rapports/debug/run-one',
    report: { stage: 'open' },
  })
  const started = await service.start(launch)
  await service.settled()
  expect(vm.run.mock.calls.map(call => call[0])).toEqual(['P001', 'P003'])
  const state = await service.snapshot()
  expect(state.status).toBe('failed')
  expect(state.steps.map(step => step.status)).toEqual(['failed', 'passed'])
  const folder = join(root, 'rapports/debug/campagnes')
  const json = await readFile(join(folder, `${started.id}.json`), 'utf8')
  expect(JSON.parse(json).steps[0]).toMatchObject({
    runId: 'run-one',
    error: 'réouverture refusée',
    report: { stage: 'open' },
  })
  expect(await readFile(join(folder, 'latest.json'), 'utf8')).toBe(json)
  expect((await readdir(folder)).some(name => name.endsWith('.tmp'))).toBe(false)
  expect((await service.reports())[0]?.status).toBe('failed')
})
it('blocks successors on stop-on-failure', async () => {
  const { service, vm } = await setup()
  vm.run.mockResolvedValueOnce({ code: 1 })
  await service.start({ ...launch, stopOnFailure: true })
  await service.settled()
  expect(vm.run).toHaveBeenCalledOnce()
  expect((await service.snapshot()).steps[1]?.status).toBe('blocked')
})
it('keeps all 5228 cases visible and never runs a nonjourney plan', async () => {
  const entries = Array.from({ length: 5228 }, (_, index) => ({
    ...entry(`C${index}`),
    kind: 'case' as const,
  }))
  const { service, vm } = await setup(entries)
  await service.start(launch)
  await service.settled()
  const state = await service.snapshot()
  expect(state.steps).toHaveLength(5228)
  expect(state.status).toBe('failed')
  expect(state.steps.every(step => step.status === 'blocked')).toBe(true)
  expect(vm.run).not.toHaveBeenCalled()
})
it('rejects duplicate launch and stops after the in-flight scenario', async () => {
  const { service, vm } = await setup()
  let finish: ((value: Record<string, unknown>) => void) | undefined
  let entered: (() => void) | undefined
  const running = new Promise<void>(resolve => {
    entered = resolve
  })
  vm.run.mockImplementationOnce(
    () =>
      new Promise(resolve => {
        finish = resolve
        entered?.()
      }),
  )
  await service.start(launch)
  await running
  await expect(service.start(launch)).rejects.toThrow('déjà en cours')
  service.stop()
  expect((await service.snapshot()).status).toBe('running')
  finish?.({ code: 0 })
  await service.settled()
  expect((await service.snapshot()).status).toBe('cancelled')
  expect((await service.snapshot()).steps[1]?.status).toBe('blocked')
  expect(vm.run).toHaveBeenCalledOnce()
})
it('refuses pagination without progress rather than looping forever', async () => {
  const { service, repository } = await setup()
  repository.list.mockResolvedValue({ total: 5228, items: [] })
  await expect(service.start(launch)).rejects.toThrow('Pagination')
})
it('rejects oversized reports before parsing', async () => {
  const { service, root } = await setup([entry('P001', false)])
  const state = await service.start(launch)
  await service.settled()
  await writeFile(
    join(root, `rapports/debug/campagnes/${state.id}.json`),
    'x'.repeat(16 * 1024 * 1024 + 1),
  )
  await expect(service.reports()).rejects.toThrow('volumineux')
})
