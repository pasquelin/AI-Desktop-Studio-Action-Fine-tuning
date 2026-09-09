import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, it } from 'vitest'
import { exportRunFolder } from '../src/vm/report-folder.ts'

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
    const destination = await exportRunFolder(root, run)
    const report = await readFile(join(destination, 'rapport.md'), 'utf8')
    expect(report).toContain('Réouverture : failed')
    expect(report).toContain('Invalid input')
    expect(report).toContain('Pièces non produites')
    expect(await readdir(destination)).not.toContain('id_ed25519')
    expect(await readFile(join(root, 'rapports/LISEZ-MOI.md'), 'utf8')).toContain(run)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
