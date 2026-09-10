import { describe, expect, it, vi } from 'vitest'
import { createLocalModelClient, QaProposalError } from '../src/qa/local-model.ts'

const context = {
  request: 'Crée un cube',
  history: [],
  tools: [
    {
      name: 'node_add',
      description: 'Add a node',
      inputSchema: {
        type: 'object',
        required: ['kind'],
        additionalProperties: false,
        properties: { kind: { const: 'cube' } },
      },
    },
  ],
}
const tags = () => Response.json({ models: [{ name: 'small:latest' }, { name: 'other:2b' }] })
function clientReturning(value: unknown) {
  const fetcher = vi
    .fn<typeof fetch>()
    .mockResolvedValueOnce(tags())
    .mockResolvedValueOnce(Response.json(value))
  return { client: createLocalModelClient(fetcher), fetcher }
}

describe('local QA model boundary', () => {
  it('lists exact local choices and excludes cloud entries without pulling weights', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        models: [
          { name: 'b:2b' },
          { name: 'a:latest' },
          { name: 'a:latest' },
          { name: 'remote:cloud' },
          { name: 'remote-alias', remote_host: 'https://ollama.com' },
        ],
      }),
    )
    expect(await createLocalModelClient(fetcher).localModels()).toEqual({
      status: 'ready',
      models: ['a:latest', 'b:2b'],
    })
    expect(fetcher).toHaveBeenCalledOnce()
    expect(fetcher.mock.calls[0]?.[0]).toBe('http://127.0.0.1:11434/api/tags')
    expect(fetcher.mock.calls[0]?.[1]?.redirect).toBe('error')
    expect(fetcher.mock.calls[0]?.[1]?.signal).toBeInstanceOf(AbortSignal)
  })
  it('reports unavailable without claiming the app is uninstalled', async () => {
    const fetcher = vi.fn<typeof fetch>().mockRejectedValue(new TypeError('connection refused'))
    const value = await createLocalModelClient(fetcher).localModels()
    expect(value.status).toBe('unavailable')
    expect(value.error).toContain('ne permet pas de distinguer')
  })
  it('keeps an empty installation ready but refuses generation without the selected model', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockImplementation(async () => Response.json({ models: [] }))
    const client = createLocalModelClient(fetcher)
    expect(await client.localModels()).toEqual({ status: 'ready', models: [] })
    await expect(client.proposeAction('small', context)).rejects.toThrow('modèle installé')
    expect(fetcher.mock.calls.every(call => String(call[0]).endsWith('/api/tags'))).toBe(true)
  })
  it('accepts one declared tool call and sends the exact chosen model', async () => {
    const { client, fetcher } = clientReturning({
      message: { tool_calls: [{ function: { name: 'node_add', arguments: { kind: 'cube' } } }] },
    })
    expect(await client.proposeAction('small:latest', context)).toEqual({
      action: 'node_add',
      input: { kind: 'cube' },
    })
    const body = JSON.parse(String(fetcher.mock.calls[1]?.[1]?.body))
    expect(body).toMatchObject({ model: 'small:latest', stream: false, format: 'json' })
    expect(fetcher.mock.calls[1]?.[0]).toBe('http://127.0.0.1:11434/api/chat')
  })
  it('accepts the structured JSON fallback', async () => {
    const { client } = clientReturning({
      message: { content: JSON.stringify({ action: 'node_add', input: { kind: 'cube' } }) },
    })
    expect(await client.proposeAction('other:2b', context)).toEqual({
      action: 'node_add',
      input: { kind: 'cube' },
    })
  })
  it.each([
    [{ action: 'shell_exec', input: {} }, 'inconnue'],
    [{ action: 'node_add', input: { kind: 'sphere' } }, 'schéma'],
    [{ action: 'node_add', input: [] }, 'invalide'],
  ])('rejects unknown or malformed proposals', async (proposal, error) => {
    const { client } = clientReturning({ message: { content: JSON.stringify(proposal) } })
    await expect(client.proposeAction('small:latest', context)).rejects.toThrow(String(error))
  })
  it('rejects multiple actions rather than silently executing the first', async () => {
    const call = { function: { name: 'node_add', arguments: { kind: 'cube' } } }
    const { client } = clientReturning({ message: { tool_calls: [call, call] } })
    await expect(client.proposeAction('small:latest', context)).rejects.toThrow('Une seule')
  })
  it('rejects oversized outgoing context before generation', async () => {
    const { client, fetcher } = clientReturning({})
    await expect(
      client.proposeAction('small:latest', { ...context, request: 'x'.repeat(1024 * 1024) }),
    ).rejects.toThrow('trop volumineux')
    expect(fetcher).toHaveBeenCalledOnce()
  })
  it('bounds incoming response even without a content-length header', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(tags())
      .mockResolvedValueOnce(new Response('x'.repeat(1024 * 1024 + 1)))
    await expect(
      createLocalModelClient(fetcher).proposeAction('small:latest', context),
    ).rejects.toThrow('trop volumineuse')
  })
  it('propagates cancellation rather than marking it as missing Ollama', async () => {
    const controller = new AbortController()
    controller.abort(new Error('user stop'))
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async (_url, options) => {
      options?.signal?.throwIfAborted()
      return tags()
    })
    await expect(
      createLocalModelClient(fetcher).proposeAction('small:latest', context, controller.signal),
    ).rejects.toThrow('user stop')
  })
})

it('preserves the rejected action and arguments for a diagnostic report', async () => {
  const { client } = clientReturning({
    message: {
      content: JSON.stringify({
        action: 'layer.add',
        input: { name: 'Foreground', password: 'private-value', apiKey: 'secret-value' },
      }),
    },
  })
  const error = await client.proposeAction('small:latest', context).catch(value => value)
  expect(error).toBeInstanceOf(QaProposalError)
  expect(error.message).toContain('layer.add')
  expect(error.message).toContain('Foreground')
  expect(error.proposal).not.toContain('private-value')
  expect(error.proposal).not.toContain('secret-value')
  expect(error.message).toContain('[redacted]')
})
it('bounds rejected diagnostics by bytes and retains malformed JSON as data', async () => {
  const { client } = clientReturning({ message: { content: 'é'.repeat(10000) } })
  const error = await client.proposeAction('small:latest', context).catch(value => value)
  expect(error).toBeInstanceOf(QaProposalError)
  expect(error.message).toContain('JSON de proposition invalide')
  expect(new TextEncoder().encode(error.message).byteLength).toBeLessThan(8192)
  expect(error.proposal).toContain('[tronqué]')
})
