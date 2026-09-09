import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { RunRepository } from '../src/admin/run-repository.ts'
import { sha256 } from '../src/catalogue/catalogue.ts'

const roots: string[] = []
const id = 'studio-ft-11111111-1111-1111-1111-111111111111'
async function fixture(status = 'removed') {
  const root = await mkdtemp(join(tmpdir(), 'admin-reports-'))
  roots.push(root)
  const folder = join(root, 'artifacts/vm', id)
  await mkdir(join(folder, 'results'), { recursive: true })
  await writeFile(
    join(folder, 'record.json'),
    JSON.stringify({
      name: id,
      owner: root,
      status,
      mode: 'build',
      key: 'private-key-should-not-be-exposed',
    }),
  )
  return { root, folder, repo: new RunRepository(root) }
}
afterEach(async () => {
  await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})
describe('run reports for administration', () => {
  it('keeps lifecycle cleanup separate from passed business outcome and excludes keys', async () => {
    const { folder, repo } = await fixture()
    await writeFile(
      join(folder, 'results/scenario.json'),
      JSON.stringify({
        status: 'passed',
        scenario: 'P003',
        modelUsed: false,
        steps: [{ id: 'create', status: 'passed' }],
      }),
    )
    const rows = await repo.list()
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      lifecycle: 'removed',
      outcome: 'passed',
      passed: 1,
      modelUsed: false,
    })
    expect(JSON.stringify(rows)).not.toContain('private-key')
  })
  it('does not invent a successful scenario when only a VM build exists', async () => {
    const { repo } = await fixture('build-passed')
    expect((await repo.list())[0]).toMatchObject({
      outcome: 'not-executed',
      scenario: null,
      modelUsed: null,
    })
  })
  it('rejects unowned and traversal run requests before reading evidence', async () => {
    const { repo } = await fixture()
    await expect(repo.detail('../outside')).rejects.toThrow()
    await expect(repo.detail('studio-ft-22222222-2222-2222-2222-222222222222')).rejects.toThrow()
  })
  it('preserves old frozen plan and identifies modified source without retaining old images', async () => {
    const { root, folder, repo } = await fixture()
    const frozen = JSON.stringify({ id: 'P003', request: 'Old', steps: [] })
    await writeFile(join(folder, 'scenario-spec.json'), frozen)
    await writeFile(
      join(folder, 'provenance.json'),
      JSON.stringify({ scenarioHash: sha256(frozen), studioRevision: 'abc' }),
    )
    await mkdir(join(root, 'datasets/bench/journeys'), { recursive: true })
    await writeFile(
      join(root, 'datasets/bench/journeys/P003.json'),
      JSON.stringify({ id: 'P003', request: 'New' }),
    )
    const detail = await repo.detail(id)
    expect(detail.sourceMatches).toBe(false)
    expect(detail.plan).toMatchObject({ request: 'Old' })
    expect(detail.snapshots).toEqual([])
    expect(detail.snapshots).toEqual([])
    expect(JSON.stringify(detail)).not.toContain('private-key')
  })
  it('marks unreadable evidence rather than mislabelling it as success', async () => {
    const { folder, repo } = await fixture()
    await writeFile(join(folder, 'results/scenario.json'), 'broken')
    expect((await repo.list())[0]?.issue).toContain('illisible')
    await expect(repo.detail(id)).rejects.toThrow()
  })
  it('excludes prepared reference images from treatment counts', async () => {
    const { root, folder, repo } = await fixture('ready')
    await writeFile(
      join(folder, 'record.json'),
      JSON.stringify({
        name: id,
        owner: root,
        status: 'ready',
        mode: 'prepare',
        key: join(folder, 'id_ed25519'),
      }),
    )
    expect(await repo.list()).toEqual([])
  })
})
