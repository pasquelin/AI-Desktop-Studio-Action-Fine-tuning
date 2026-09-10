import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, it } from 'vitest'
import { exportQaAttempt, exportRunFolder } from '../src/vm/report-folder.ts'
import { beginSnapshots, saveSnapshot } from '../src/vm/snapshots.ts'

it('exports a failed run without credentials and explicitly reports missing evidence', async () => {
  const root = await mkdtemp(join(tmpdir(), 'report-folder-'))
  const run = 'studio-ft-00000000-0000-0000-0000-000000000001'
  const dir = join(root, 'artifacts/vm', run)
  try {
    await mkdir(join(dir, 'results'), { recursive: true })
    await writeFile(
      join(dir, 'record.json'),
      JSON.stringify({
        owner: root,
        name: run,
        mode: 'build',
        status: 'failed-retained',
        key: 'private-key-path',
      }),
    )
    await writeFile(join(dir, 'id_ed25519'), 'secret')
    await writeFile(
      join(dir, 'results/scenario.json'),
      JSON.stringify({
        status: 'failed',
        steps: [{ label: 'Réouverture', status: 'failed', error: 'Invalid input' }],
      }),
    )
    await beginSnapshots(root, run)
    await saveSnapshot(root, run, Buffer.from('owned screenshot'), 'Avant réouverture')
    const destination = await exportRunFolder(root, run)
    expect(destination).toBe(join(root, 'rapports/debug', run))
    expect(await readdir(join(root, 'rapports'))).toContain('entrainement')
    const captures = await readdir(join(destination, 'captures'))
    const image = captures.find(file => file.endsWith('.jpg'))
    expect(image).toBeDefined()
    expect(await readFile(join(destination, 'captures', image ?? ''), 'utf8')).toBe(
      'owned screenshot',
    )
    const report = await readFile(join(destination, 'rapport.md'), 'utf8')
    expect(report).toContain('Réouverture : failed')
    expect(report).toContain('Invalid input')
    expect(report).toContain('Avant réouverture')
    expect(report).toContain(`captures/${image}`)
    expect(report).toContain('Pièces non produites')
    expect(await readdir(destination)).not.toContain('id_ed25519')
    expect(await readFile(join(root, 'rapports/LISEZ-MOI.md'), 'utf8')).toContain(run)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('does not attach images of another run or move historical reports', async () => {
  const root = await mkdtemp(join(tmpdir(), 'report-identity-'))
  const first = 'studio-ft-00000000-0000-0000-0000-000000000001'
  const second = 'studio-ft-00000000-0000-0000-0000-000000000002'
  try {
    for (const run of [first, second]) {
      const dir = join(root, 'artifacts/vm', run)
      await mkdir(dir, { recursive: true })
      await writeFile(
        join(dir, 'record.json'),
        JSON.stringify({
          owner: root,
          name: run,
          mode: 'build',
          status: 'failed-retained',
          key: 'private-key-path',
        }),
      )
    }
    const old = join(root, 'rapports', first)
    await mkdir(old, { recursive: true })
    await writeFile(join(old, 'rapport.md'), 'historical report')
    await beginSnapshots(root, second)
    await saveSnapshot(root, second, Buffer.from('different run'), 'Other step')
    const destination = await exportRunFolder(root, first)
    expect(await readdir(destination)).not.toContain('captures')
    expect(await readFile(join(destination, 'rapport.md'), 'utf8')).toContain(
      'Aucune capture disponible',
    )
    expect(await readFile(join(old, 'rapport.md'), 'utf8')).toBe('historical report')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

it('exports persistent attempts with time-scoped captures and a bounded contextual activity log', async () => {
  const root = await mkdtemp(join(tmpdir(), 'attempt-report-'))
  const run = 'studio-ft-00000000-0000-0000-0000-000000000001'
  try {
    const dir = join(root, 'artifacts/vm', run)
    await mkdir(dir, { recursive: true })
    await writeFile(
      join(dir, 'record.json'),
      JSON.stringify({
        owner: root,
        name: run,
        mode: 'build',
        status: 'build-passed',
        key: 'private-key-path',
      }),
    )
    await writeFile(join(dir, 'activity.log'), `${'a'.repeat(300000)}latest activity`)
    await beginSnapshots(root, run)
    await saveSnapshot(root, run, Buffer.from('old'), 'Previous attempt', 1700000000000)
    await saveSnapshot(root, run, Buffer.from('current'), 'Current attempt', 1700000000100)
    const report = {
      status: 'failed',
      steps: [{ label: 'Open file', status: 'failed', error: 'Failure' }],
      metadata: { scenario: 'P003' },
    }
    const destination = await exportQaAttempt(root, run, 'qa-attempt-1', report, 1700000000050)
    expect(destination).toBe(join(root, 'rapports/debug/qa-attempt-1'))
    const images = (await readdir(join(destination, 'captures'))).filter(file =>
      file.endsWith('.jpg'),
    )
    expect(images).toHaveLength(1)
    expect(await readFile(join(destination, 'captures', images[0] ?? ''), 'utf8')).toBe('current')
    expect(JSON.parse(await readFile(join(destination, 'scenario.json'), 'utf8'))).toEqual(report)
    const log = await readFile(join(destination, 'activity.log'))
    expect(log.length).toBe(262144)
    expect(log.toString()).toContain('latest activity')
    expect(await readFile(join(destination, 'rapport.md'), 'utf8')).toContain(
      'peut inclure des étapes antérieures',
    )
    await expect(exportQaAttempt(root, run, '../escape', report, 0)).rejects.toThrow('identity')
    await expect(exportQaAttempt(root, run, 'bad', {}, 0)).rejects.toThrow('report')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
