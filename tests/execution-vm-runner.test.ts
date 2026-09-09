import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, it } from 'vitest'
import { createVmRunner } from '../src/execution/vm-runner.ts'

it('does not launch unselected or invalid journeys', async () => {
  const root = await mkdtemp(join(tmpdir(), 'execution-'))
  try {
    const run = createVmRunner(root, 'invalid-reference')
    await expect(run('../P001', new AbortController().signal)).rejects.toThrow('Invalid journey')
    await expect(run('P001', new AbortController().signal)).rejects.toThrow(
      'not explicitly enabled',
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
