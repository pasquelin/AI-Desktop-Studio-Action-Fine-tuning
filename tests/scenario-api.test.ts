import { once } from 'node:events'
import { createServer } from 'node:http'
import { describe, expect, it } from 'vitest'
import { handleScenarioRequest } from '../src/admin/scenario-api.ts'

describe('scenario API mutation boundary', () => {
  it('rejects requests from another origin before any source mutation', async () => {
    const server = createServer((request, response) => {
      void handleScenarioRequest(request, response, '/tmp/missing-scenario-fixture')
    })
    server.listen(0, '127.0.0.1')
    await once(server, 'listening')
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('Missing server')
    try {
      const response = await fetch(`http://127.0.0.1:${address.port}/api/scenarios`, {
        method: 'POST',
        headers: {
          origin: 'http://other.example',
          'content-type': 'application/json',
        },
        body: '{}',
      })
      expect(response.status).toBe(403)
    } finally {
      server.close()
      await once(server, 'close')
    }
  })
})
