import { mkdir, mkdtemp, rm } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { adminRoute, runsRoute, snapshotsRoute } from '../src/admin/observer-routes.ts'

const roots: string[] = []
async function root() {
  const created = await mkdtemp(join(tmpdir(), 'observer-routes-'))
  roots.push(created)
  return created
}
afterEach(async () => {
  await Promise.all(roots.splice(0).map(path => rm(path, { recursive: true, force: true })))
})

/** Collects what a route writes, without opening a socket. */
function capture() {
  const sent = { status: 0, headers: {} as Record<string, unknown>, body: '' }
  const response = {
    setHeader(name: string, value: unknown) {
      sent.headers[name.toLowerCase()] = value
    },
    writeHead(status: number, headers?: Record<string, unknown>) {
      sent.status = status
      Object.assign(sent.headers, headers ?? {})
      return response
    },
    end(chunk?: unknown) {
      if (chunk !== undefined) sent.body = String(chunk)
      return response
    },
  }
  return { sent, response: response as unknown as ServerResponse }
}
const call = (route: typeof runsRoute, path: string, projectRoot: string, method = 'GET') =>
  route(
    { method } as IncomingMessage,
    capture().response,
    new URL(path, 'http://127.0.0.1'),
    projectRoot,
  )

describe('observer routes', () => {
  it('declines a path it does not own, so the next route sees it', async () => {
    const path = await root()
    expect(await call(runsRoute, '/logs', path)).toBe(false)
    expect(await call(adminRoute, '/', path)).toBe(false)
    expect(await call(snapshotsRoute, '/api/runs', path)).toBe(false)
  })
  it('declines a write to the read-only report listing', async () => {
    expect(await call(runsRoute, '/api/runs', await root(), 'POST')).toBe(false)
  })
  it('answers an unknown report path with a report-not-found reply', async () => {
    const { sent, response } = capture()
    const handled = await runsRoute(
      { method: 'GET' } as IncomingMessage,
      response,
      new URL('/api/runs/a/b/c', 'http://127.0.0.1'),
      await root(),
    )
    expect(handled).toBe(true)
    expect(sent.status).toBe(404)
    expect(JSON.parse(sent.body)).toEqual({ error: 'Rapport introuvable' })
  })
  it('redirects the former /admin entry point while keeping its query', async () => {
    const { sent, response } = capture()
    await adminRoute(
      { method: 'GET' } as IncomingMessage,
      response,
      new URL('/admin?id=P001', 'http://127.0.0.1'),
      await root(),
    )
    expect(sent.status).toBe(302)
    expect(sent.headers.Location).toBe('/?id=P001')
  })
  it('serves only hashed bundle assets, refusing any other name under /admin', async () => {
    for (const path of ['/admin/secret.txt', '/admin/assets/../package.json', '/admin/../.env']) {
      const { sent, response } = capture()
      const handled = await adminRoute(
        { method: 'GET' } as IncomingMessage,
        response,
        new URL(path, 'http://127.0.0.1'),
        await root(),
      )
      // A traversal is normalised out of /admin by the URL itself; what remains must 404.
      expect(handled ? sent.status : 404).toBe(404)
    }
  })
  it('reports an unreadable capture as missing rather than failing the request', async () => {
    const path = await root()
    await mkdir(join(path, 'artifacts/vm'), { recursive: true })
    const { sent, response } = capture()
    const handled = await snapshotsRoute(
      { method: 'GET' } as IncomingMessage,
      response,
      new URL('/snapshot?run=absent&file=absent.jpg', 'http://127.0.0.1'),
      path,
    )
    expect(handled).toBe(true)
    expect(sent.status).toBe(404)
  })
  it('answers an empty capture listing before any run has produced one', async () => {
    const { sent, response } = capture()
    await snapshotsRoute(
      { method: 'GET' } as IncomingMessage,
      response,
      new URL('/snapshots', 'http://127.0.0.1'),
      await root(),
    )
    expect(sent.status).toBe(200)
    expect(JSON.parse(sent.body)).toEqual([])
  })
})
