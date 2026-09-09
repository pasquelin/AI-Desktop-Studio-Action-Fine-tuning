import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, expect, it } from 'vitest'
import { beginSnapshots, listSnapshots, readSnapshot, saveSnapshot } from '../src/vm/snapshots.ts'

let root = ''
afterEach(async () => {
  if (root) await rm(root, { recursive: true, force: true })
})
async function fixture() {
  root = await mkdtemp(join(tmpdir(), 'snapshots-'))
  const run = 'studio-ft-00000000-0000-0000-0000-000000000000'
  const folder = join(root, 'artifacts/vm', run)
  await mkdir(folder, { recursive: true })
  await writeFile(
    join(folder, 'record.json'),
    JSON.stringify({
      name: run,
      owner: root,
      mode: 'build',
      key: 'unused',
      status: 'removed',
    }),
  )
  return { run, folder }
}
it('retains separate captures and reads them after VM removal', async () => {
  const { run } = await fixture()
  await saveSnapshot(root, run, Buffer.from('one'))
  await saveSnapshot(root, run, Buffer.from('two'))
  const items = await listSnapshots(root)
  expect(items).toHaveLength(2)
  expect(
    new Set(
      await Promise.all(
        items.map(async item => (await readSnapshot(root, item.run, item.file)).toString()),
      ),
    ),
  ).toEqual(new Set(['one', 'two']))
})
it('replaces the previous session while preserving logs', async () => {
  const { run, folder } = await fixture()
  await beginSnapshots(root, run)
  await saveSnapshot(root, run, Buffer.from('old'))
  await writeFile(join(folder, 'activity.log'), 'keep')
  await beginSnapshots(root, run)
  expect(await listSnapshots(root)).toHaveLength(0)
  expect(await readFile(join(folder, 'activity.log'), 'utf8')).toBe('keep')
})
it('rejects path traversal and unrelated files', async () => {
  const { run } = await fixture()
  await expect(readSnapshot(root, run, '../id_ed25519')).rejects.toThrow()
  await expect(readSnapshot(root, '../../outside', 'observation.jpg')).rejects.toThrow()
  await expect(readSnapshot(root, run, 'record.json')).rejects.toThrow()
})

it('freezes the recorded stage with the capture', async () => {
  const { run } = await fixture()
  await saveSnapshot(root, run, Buffer.from('image'), 'Construction de Studio')
  expect((await listSnapshots(root))[0]?.activity).toBe('Construction de Studio')
})

it('orders action captures chronologically and preserves their original time', async () => {
  const { run } = await fixture()
  await saveSnapshot(root, run, Buffer.from('late'), 'Deuxième action', 1800000002000)
  await saveSnapshot(root, run, Buffer.from('early'), 'Première action', 1800000001000)
  const items = await listSnapshots(root)
  expect(items.map(item => item.activity)).toEqual(['Première action', 'Deuxième action'])
  expect(items[0]?.capturedAt).toBe(new Date(1800000001000).toISOString())
})
