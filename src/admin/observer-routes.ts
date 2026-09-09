import { readFile } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { join } from 'node:path'
import { latestRun, logChunk } from '../vm/logs.ts'
import { listSnapshots, readSnapshot } from '../vm/snapshots.ts'
import { RunRepository } from './run-repository.ts'

export type Route = (
  request: IncomingMessage,
  response: ServerResponse,
  url: URL,
  root: string,
) => Promise<boolean>

const json = (response: ServerResponse, value: unknown, status = 200) => {
  response.writeHead(status, { 'Content-Type': 'application/json' }).end(JSON.stringify(value))
}

/** Recorded evidence of past runs: the listing, one report, and its log by offset. */
export const runsRoute: Route = async (request, response, url, root) => {
  if (request.method !== 'GET' || !url.pathname.startsWith('/api/runs')) return false
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  const parts = url.pathname.split('/').filter(Boolean)
  const runs = new RunRepository(root)
  const [, , id, operation] = parts
  if (parts.length === 2) response.end(JSON.stringify(await runs.list()))
  else if (parts.length === 3 && id) response.end(JSON.stringify(await runs.detail(id)))
  else if (parts.length === 4 && id && operation === 'logs')
    response.end(
      JSON.stringify(await logChunk(root, id, Number(url.searchParams.get('offset') ?? 0))),
    )
  else json(response, { error: 'Rapport introuvable' }, 404)
  return true
}

/** Serves the built interface; old deep links to /admin keep their fragment through a redirect. */
export const adminRoute: Route = async (request, response, url, root) => {
  if (
    request.method !== 'GET' ||
    !(url.pathname === '/admin' || url.pathname.startsWith('/admin/'))
  )
    return false
  const asset = url.pathname.slice(7)
  if (url.pathname === '/admin' || asset === '' || asset === 'index.html')
    response.writeHead(302, { Location: `/${url.search}` }).end()
  else if (asset === 'logo.svg') {
    response.setHeader('Content-Type', 'image/svg+xml')
    response.end(await readFile(join(root, 'docs/assets/logo.svg')))
  } else if (/^assets\/[a-zA-Z0-9_-]+\.(js|css)$/.test(asset)) {
    response.setHeader(
      'Content-Type',
      asset.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/css; charset=utf-8',
    )
    response.end(await readFile(join(root, 'dist/admin', asset)))
  } else response.writeHead(404).end()
  return true
}

export const snapshotsRoute: Route = async (_request, response, url, root) => {
  if (url.pathname !== '/snapshots' && url.pathname !== '/snapshot') return false
  try {
    if (url.pathname === '/snapshots') json(response, await listSnapshots(root))
    else {
      const bytes = await readSnapshot(
        root,
        url.searchParams.get('run') ?? '',
        url.searchParams.get('file') ?? '',
      )
      response.writeHead(200, { 'Content-Type': 'image/jpeg' }).end(bytes)
    }
  } catch {
    response.writeHead(404).end('Capture indisponible.')
  }
  return true
}

/** The live log of the current run; an offset for another run restarts from the beginning. */
export const logsRoute: Route = async (_request, response, url, root) => {
  if (url.pathname !== '/logs') return false
  try {
    const run = await latestRun(root)
    const offset =
      url.searchParams.get('run') === run?.name ? Number(url.searchParams.get('offset') ?? 0) : 0
    const chunk = run ? await logChunk(root, run.name, offset) : undefined
    json(response, { run: run?.name, status: run?.status, ...chunk })
  } catch {
    response
      .writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' })
      .end('Journaux temporairement indisponibles.')
  }
  return true
}
