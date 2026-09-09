import { expect, it } from 'vitest'
import { ExecutionController } from '../src/execution/controller.ts'

it('refuses a concurrent launch and stops the campaign after failure', async () => {
  let finish: ((code: number) => void) | undefined
  const calls: string[] = []
  const controller = new ExecutionController(async id => {
    calls.push(id)
    return await new Promise<number>(resolve => {
      finish = resolve
    })
  })
  controller.start(['P001', 'P003'])
  expect(() => controller.start(['P004'])).toThrow('already running')
  finish?.(1)
  await controller.wait()
  expect(calls).toEqual(['P001'])
  expect(controller.snapshot().steps.map(s => s.status)).toEqual(['failed', 'blocked'])
})
it('cancellation prevents subsequent scenarios and never reports success', async () => {
  const controller = new ExecutionController(
    async (_id, signal) =>
      await new Promise<number>(resolve => signal.addEventListener('abort', () => resolve(1))),
  )
  controller.start(['P001', 'P003'])
  controller.stop()
  await controller.wait()
  expect(controller.snapshot().status).toBe('cancelled')
  expect(controller.snapshot().steps[1]?.status).toBe('blocked')
})
it('rejects empty, duplicate or invalid scenario selections', () => {
  const controller = new ExecutionController(async () => 0)
  for (const ids of [[], ['P001', 'P001'], ['../P001']])
    expect(() => controller.start(ids)).toThrow()
})

it('keeps the exact VM report identity and business failure with its scenario', async () => {
  const controller = new ExecutionController(async () => ({
    code: 1,
    runId: 'owned-run',
    error: 'document.open: rejected',
  }))
  controller.start(['P003'])
  await controller.wait()
  expect(controller.snapshot().steps[0]).toEqual({
    id: 'P003',
    status: 'failed',
    runId: 'owned-run',
    error: 'document.open: rejected',
  })
})
