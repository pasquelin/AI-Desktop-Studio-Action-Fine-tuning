import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, expect, it } from 'vitest'
import { loadQaStatusIndex } from '../src/admin/scenario-qa-state.ts'

const roots: string[] = []
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'qa-status-'))
  roots.push(root)
  await mkdir(join(root, 'artifacts'), { recursive: true })
  await writeFile(
    join(root, 'artifacts/catalogue.json'),
    JSON.stringify({ appRevision: 'studio-1', catalogueHash: 'catalogue-1' }),
  )
  const folder = join(root, 'rapports/debug/00000000-0000-0000-0000-000000000001')
  await mkdir(folder, { recursive: true })
  return { root, path: join(folder, 'scenario.json') }
}
function report(status = 'passed', hash = 'scenario-1') {
  return {
    scenario: 'P003',
    kind: 'guided-model-qa',
    status,
    modelUsed: true,
    steps: [{ label: 'Read', status }],
    provenance: {
      kind: 'real-vm',
      scenarioHash: hash,
      studioRevision: 'studio-1',
      catalogueHash: 'catalogue-1',
    },
  }
}
afterEach(async () => {
  await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})
it('requires explicit complete matching proof and marks scenario or catalogue changes stale', async () => {
  const { root, path } = await fixture()
  expect((await loadQaStatusIndex(root)).statusFor('P003', 'scenario-1').status).toBe('not-tested')
  await writeFile(path, JSON.stringify(report()))
  expect((await loadQaStatusIndex(root)).statusFor('P003', 'scenario-1').status).toBe('passed')
  expect((await loadQaStatusIndex(root)).statusFor('P003', 'changed').status).toBe('stale')
  await writeFile(
    join(root, 'artifacts/catalogue.json'),
    JSON.stringify({ appRevision: 'studio-2', catalogueHash: 'catalogue-1' }),
  )
  expect((await loadQaStatusIndex(root)).statusFor('P003', 'scenario-1').status).toBe('stale')
})
it('latest failure supersedes success and deleting evidence removes approval', async () => {
  const { root, path } = await fixture()
  await writeFile(path, JSON.stringify(report()))
  expect((await loadQaStatusIndex(root)).statusFor('P003', 'scenario-1').status).toBe('passed')
  await writeFile(path, JSON.stringify(report('failed')))
  expect((await loadQaStatusIndex(root)).statusFor('P003', 'scenario-1').status).toBe('failed')
  await rm(path)
  expect((await loadQaStatusIndex(root)).statusFor('P003', 'scenario-1').status).toBe('not-tested')
})
it('never treats a success label with failed steps or missing provenance as valid', async () => {
  const { root, path } = await fixture()
  await writeFile(path, JSON.stringify({ ...report(), steps: [{ status: 'failed' }] }))
  expect((await loadQaStatusIndex(root)).statusFor('P003', 'scenario-1').status).toBe('stale')
  await writeFile(path, JSON.stringify({ ...report(), provenance: {} }))
  expect((await loadQaStatusIndex(root)).statusFor('P003', 'scenario-1').status).toBe('stale')
  expect((await loadQaStatusIndex(root)).statusFor('P004', 'missing', false).status).toBe('blocked')
})
