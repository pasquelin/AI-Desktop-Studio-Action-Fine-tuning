import type { ChildProcess } from 'node:child_process'
import { EventEmitter } from 'node:events'
import { expect, it, vi } from 'vitest'
import type { proposeAction } from '../src/qa/local-model.ts'
import { VmSession } from '../src/qa/session.ts'

function worker() {
  return Object.assign(new EventEmitter(), {
    connected: true,
    stdout: null,
    stderr: null,
    send: vi.fn(),
    kill: vi.fn(),
  })
}
function setup() {
  const children = [worker(), worker()]
  let index = 0
  const propose = vi.fn<typeof proposeAction>(async () => ({ action: 'node_add', input: {} }))
  const session = new VmSession('/test', {
    reference: async () => 'reference',
    spawnWorker: () => children[index++] as unknown as ChildProcess,
    propose,
  })
  return { session, children, propose }
}
const context = { request: 'Cube', tools: [{ name: 'node_add', inputSchema: {} }], history: [] }
const requestId = '11111111-1111-4111-8111-111111111111'

it('ignores old worker callbacks after a restart', async () => {
  const { session, children } = setup()
  await session.start()
  children[0]?.emit('error', new Error('old failure'))
  await session.start()
  children[1]?.emit('message', { type: 'ready' })
  children[0]?.emit('close', 1)
  children[0]?.emit('message', { type: 'ready' })
  expect(session.snapshot().status).toBe('ready')
})
it('relays only during the matching pending request using the pinned model', async () => {
  const { session, children, propose } = setup()
  await session.start()
  const child = children[0]
  child?.emit('message', { type: 'ready' })
  child?.emit('message', {
    type: 'model-request',
    id: 'unknown',
    modelRequestId: requestId,
    context,
  })
  expect(propose).not.toHaveBeenCalled()
  const run = session.run('P001', 'chosen:2b')
  const id = child?.send.mock.calls[0]?.[0].id
  child?.emit('message', {
    type: 'model-request',
    id,
    modelRequestId: requestId,
    model: 'ignored-other',
    context,
  })
  await vi.waitFor(() => expect(child?.send).toHaveBeenCalledTimes(2))
  expect(propose.mock.calls[0]?.[0]).toBe('chosen:2b')
  expect(child?.send.mock.calls[1]?.[0]).toMatchObject({
    type: 'model-response',
    id,
    modelRequestId: requestId,
    result: { action: 'node_add' },
  })
  child?.emit('message', { type: 'result', id, code: 0 })
  await run
})
it('refuses malformed context without querying the local model', async () => {
  const { session, children, propose } = setup()
  await session.start()
  const child = children[0]
  child?.emit('message', { type: 'ready' })
  const run = session.run('P001', 'chosen:2b')
  const id = child?.send.mock.calls[0]?.[0].id
  child?.emit('message', {
    type: 'model-request',
    id,
    modelRequestId: requestId,
    context: { ...context, tools: Array(2).fill({}) },
  })
  expect(propose).not.toHaveBeenCalled()
  expect(child?.send.mock.calls[1]?.[0].error).toContain('Contexte')
  child?.emit('message', { type: 'result', id, code: 1 })
  await run
})
it('rejects parallel inference and cancels pending inference when the worker dies', async () => {
  const { session, children, propose } = setup()
  let signal: AbortSignal | undefined
  propose.mockImplementation(
    (_model, _context, cancel) =>
      new Promise((_resolve, reject) => {
        signal = cancel
        cancel?.addEventListener('abort', () => reject(new Error('aborted')), { once: true })
      }),
  )
  await session.start()
  const child = children[0]
  child?.emit('message', { type: 'ready' })
  const run = session.run('P001', 'chosen:2b').catch(error => error)
  const id = child?.send.mock.calls[0]?.[0].id
  child?.emit('message', { type: 'model-request', id, modelRequestId: requestId, context })
  child?.emit('message', {
    type: 'model-request',
    id,
    modelRequestId: '22222222-2222-4222-8222-222222222222',
    context,
  })
  expect(propose).toHaveBeenCalledOnce()
  expect(child?.send.mock.calls[1]?.[0].error).toContain('déjà en cours')
  child?.emit('close', 1)
  await run
  expect(signal?.aborted).toBe(true)
})

it('rejects aggregate context larger than 64 KiB including multibyte histories', async () => {
  const { session, children, propose } = setup()
  await session.start()
  const child = children[0]
  child?.emit('message', { type: 'ready' })
  const run = session.run('P001', 'chosen:2b')
  const id = child?.send.mock.calls[0]?.[0].id
  child?.emit('message', {
    type: 'model-request',
    id,
    modelRequestId: requestId,
    context: { ...context, history: Array(8).fill('é'.repeat(5000)) },
  })
  expect(propose).not.toHaveBeenCalled()
  expect(child?.send.mock.calls[1]?.[0].error).toContain('64 Kio')
  child?.emit('message', { type: 'result', id, code: 1 })
  await run
})
it('rejects pending work immediately on IPC disconnect even before process close', async () => {
  const { session, children } = setup()
  await session.start()
  const child = children[0]
  child?.emit('message', { type: 'ready' })
  const run = session.run('P001', 'chosen:2b').catch(error => error)
  child?.emit('disconnect')
  expect((await run).message).toContain('Connexion')
  expect(session.snapshot().status).toBe('error')
})
