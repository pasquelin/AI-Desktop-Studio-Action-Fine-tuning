import { once } from 'node:events'
import { createServer } from 'node:http'
import { expect, it } from 'vitest'
import { executionApi } from '../src/execution/api.ts'

it('serves state and rejects cross-origin, empty and missing scenario launches', async () => {
  const handle = executionApi('/tmp/no-execution-scenarios')
  const server = createServer((req, res) => {
    void handle(req, res)
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('Missing address')
  const url = `http://127.0.0.1:${address.port}`
  try {
    expect((await (await fetch(`${url}/api/execution`)).json()).status).toBe('idle')
    for (const [origin, ids, status] of [
      ['https://other.example', ['P001'], 403],
      [url, [], 400],
      [url, ['P001'], 400],
    ] as const) {
      const response = await fetch(`${url}/api/execution`, {
        method: 'POST',
        headers: { origin, 'content-type': 'application/json' },
        body: JSON.stringify({ ids }),
      })
      expect(response.status).toBe(status)
    }
    expect((await (await fetch(`${url}/api/execution`)).json()).status).toBe('idle')
  } finally {
    server.close()
    await once(server, 'close')
  }
})
