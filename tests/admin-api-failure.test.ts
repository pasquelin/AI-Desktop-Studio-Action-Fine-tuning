import { afterEach, expect, it, vi } from 'vitest'
import { api, failureOf, SERVER_UNAVAILABLE } from '../src/admin/api.ts'

afterEach(() => {
  vi.unstubAllGlobals()
})

it('reports an unreachable observer as a code, never as the browser wording', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => {
      throw new TypeError('Failed to fetch')
    }),
  )
  const failure = failureOf(await api('/api/qa').catch(cause => cause))
  expect(failure).toEqual({ message: SERVER_UNAVAILABLE, code: 'offline' })
})

it('carries the refusal code the server sends beside its displayed message', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(
      async () =>
        new Response(JSON.stringify({ error: 'Aucun exemple', code: 'no-eligible-examples' }), {
          status: 400,
        }),
    ),
  )
  const failure = failureOf(await api('/api/training/prepare', 'POST', {}).catch(cause => cause))
  expect(failure).toEqual({ message: 'Aucun exemple', code: 'no-eligible-examples' })
})

it('leaves an aborted request as an abort, so a navigation is not shown as a failure', async () => {
  const controller = new AbortController()
  controller.abort()
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => controller.signal.throwIfAborted()),
  )
  const cause = await api('/api/qa', 'GET', undefined, controller.signal).catch(error => error)
  expect((cause as Error).name).toBe('AbortError')
})

it('keeps a business refusal without a code distinguishable from a lost connection', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(
      async () => new Response(JSON.stringify({ error: 'Sélection invalide' }), { status: 400 }),
    ),
  )
  const failure = failureOf(await api('/api/qa', 'POST', {}).catch(cause => cause))
  expect(failure).toEqual({ message: 'Sélection invalide', code: '' })
})
