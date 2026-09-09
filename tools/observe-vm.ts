import { mkdir, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { join, resolve } from 'node:path'
import {
  adminRoute,
  logsRoute,
  type Route,
  runsRoute,
  snapshotsRoute,
} from '../src/admin/observer-routes.ts'
import { handleScenarioRequest } from '../src/admin/scenario-api.ts'
import { executionApi } from '../src/execution/api.ts'
import { stateDir } from '../src/vm/ownership.ts'
import { indexPage } from './build-admin.ts'

const root = resolve(import.meta.dirname, '..')
const port = 4328
const url = `http://127.0.0.1:${port}/`

/** Only the local browser may reach the observer; it exposes the whole report tree. */
function forbidden(request: import('node:http').IncomingMessage): boolean {
  return (
    request.headers.host !== `127.0.0.1:${port}` ||
    (request.headers.origin !== undefined && request.headers.origin !== url.slice(0, -1)) ||
    request.headers['sec-fetch-site'] === 'cross-site'
  )
}

const homeRoute: Route = async (request, response, target, projectRoot) => {
  if (request.method !== 'GET' || target.pathname !== '/') return false
  response.setHeader('Content-Type', 'text/html; charset=utf-8')
  response.end(await indexPage(projectRoot))
  return true
}

const routes: Route[] = [runsRoute, adminRoute, homeRoute, snapshotsRoute, logsRoute]

const handleExecution = executionApi(root)
const server = createServer(async (request, response) => {
  try {
    response.setHeader('Cache-Control', 'no-store')
    response.setHeader('X-Content-Type-Options', 'nosniff')
    response.setHeader('Referrer-Policy', 'no-referrer')
    response.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; img-src 'self' blob:; script-src 'self'; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'",
    )
    if (forbidden(request)) {
      response.writeHead(403).end('Local observer only.')
      return
    }
    if (request.url === '/health') {
      response
        .writeHead(200, { 'Content-Type': 'application/json' })
        .end(JSON.stringify({ service: 'studio-vm-observer', root }))
      return
    }
    if (await handleExecution(request, response)) return
    if (await handleScenarioRequest(request, response, root)) return
    const target = new URL(request.url ?? '/', 'http://localhost')
    for (const route of routes) if (await route(request, response, target, root)) return
    response.writeHead(request.method === 'GET' ? 404 : 405).end()
  } catch (error) {
    if (!response.headersSent) response.writeHead(500, { 'Content-Type': 'application/json' })
    response.end(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Observer unavailable',
      }),
    )
  }
})
server.on('error', error => {
  console.error('Observer cannot start on its fixed port:', error.message)
  process.exitCode = 1
  process.disconnect?.()
})
server.listen({ port, host: '127.0.0.1', exclusive: true }, async () => {
  const address = server.address()
  if (!address || typeof address === 'string') return
  await mkdir(stateDir(root), { recursive: true, mode: 0o700 })
  await writeFile(
    join(stateDir(root), 'observer.json'),
    JSON.stringify({ url, pid: process.pid }),
    { mode: 0o600 },
  )
  console.log(`Observation en lecture seule : ${url}`)
  process.send?.(url)
})
