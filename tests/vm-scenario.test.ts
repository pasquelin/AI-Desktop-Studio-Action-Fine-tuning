import { spawnSync } from 'node:child_process'
import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { expect, it } from 'vitest'

it('refuses the guest scenario from an unrelated directory without writing projects', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'studio-scenario-'))
  try {
    await writeFile(join(directory, 'witness.txt'), 'untouched')
    await writeFile(
      join(directory, 'project.mjs'),
      await readFile(resolve('tools/vm/scenarios/project.mjs')),
    )
    await writeFile(
      join(directory, 'scenario-consent.ts'),
      await readFile(resolve('src/vm/scenario-consent.ts')),
    )
    await writeFile(
      join(directory, 'runner.ts'),
      await readFile(resolve('src/scenarios/runner.ts')),
    )
    await writeFile(
      join(directory, 'failure.ts'),
      await readFile(resolve('src/scenarios/failure.ts')),
    )
    await writeFile(
      join(directory, 'client.mjs'),
      await readFile(resolve('tools/vm/scenarios/client.mjs')),
    )
    await writeFile(
      join(directory, 'window-view.ts'),
      await readFile(resolve('tools/vm/window-view.ts')),
    )
    await writeFile(
      join(directory, 'studio-launch.ts'),
      await readFile(resolve('tools/vm/studio-launch.ts')),
    )
    const result = spawnSync(process.execPath, [join(directory, 'project.mjs')], {
      cwd: directory,
      encoding: 'utf8',
      timeout: 5000,
    })
    expect(result.status).not.toBe(0)
    expect(result.stderr).toContain('AssertionError')
    expect(await readFile(join(directory, 'witness.txt'), 'utf8')).toBe('untouched')
    expect(await readdir(directory)).toEqual([
      'client.mjs',
      'failure.ts',
      'project.mjs',
      'runner.ts',
      'scenario-consent.ts',
      'studio-launch.ts',
      'window-view.ts',
      'witness.txt',
    ])
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
