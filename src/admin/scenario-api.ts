import type { IncomingMessage, ServerResponse } from 'node:http'
import { record } from '../json.ts'
import type { ScenarioEntry } from './scenario-repository.ts'
import { ScenarioRepository, ScenarioRepositoryError } from './scenario-repository.ts'

const PREFIX = '/api/scenarios'
const BODY_LIMIT = 1_048_576

/** Mutations are JSON-only and must come from the local observer origin. */
function assertLocalJson(request: IncomingMessage): void {
  if (
    request.headers.origin !== `http://${request.headers.host}` ||
    !request.headers['content-type']?.startsWith('application/json')
  )
    throw new ScenarioRepositoryError(403, 'Local JSON request required')
}

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  request.setEncoding('utf8')
  let body = ''
  for await (const chunk of request) {
    body += String(chunk)
    if (Buffer.byteLength(body) > BODY_LIMIT)
      throw new ScenarioRepositoryError(413, 'Scenario too large')
  }
  return JSON.parse(body)
}

async function read(
  repo: ScenarioRepository,
  id: string | undefined,
  search: URLSearchParams,
): Promise<unknown> {
  if (id) return repo.detail(id)
  return repo.list({
    query: search.get('query') ?? '',
    offset: Number(search.get('offset') ?? 0),
    limit: Number(search.get('limit') ?? 100),
  })
}

/** Every edit carries the revision it was based on; the repository rejects a stale one. */
async function write(
  repo: ScenarioRepository,
  id: string,
  operation: string | undefined,
  value: Record<string, unknown>,
): Promise<ScenarioEntry> {
  const revision = value.expectedRevision
  if (typeof revision !== 'string')
    throw new ScenarioRepositoryError(400, 'Invalid scenario request')
  if (!operation) return repo.update(id, revision, value.plan)
  if (operation === 'specification' && typeof value.specification === 'string')
    return repo.updateCase(id, revision, value.specification)
  if (
    operation === 'language' &&
    typeof value.language === 'string' &&
    typeof value.text === 'string'
  )
    return repo.updateLanguage(id, revision, value.language, value.text)
  if (operation === 'activation' && typeof value.active === 'boolean')
    return repo.setActive(id, revision, value.active)
  throw new ScenarioRepositoryError(400, 'Invalid scenario request')
}

/** Resolves the reply body for one request; routing faults surface as thrown errors. */
async function route(
  request: IncomingMessage,
  repo: ScenarioRepository,
  url: URL,
): Promise<{ status: number; body: unknown }> {
  const parts = url.pathname.slice(PREFIX.length).split('/').filter(Boolean).map(decodeURIComponent)
  if (parts.length > 2) throw new ScenarioRepositoryError(404, 'Unknown scenario route')
  const [id, operation] = parts
  if (request.method === 'GET') {
    if (operation) throw new ScenarioRepositoryError(404, 'Unknown scenario route')
    return { status: 200, body: await read(repo, id, url.searchParams) }
  }
  assertLocalJson(request)
  const value: unknown = await readJsonBody(request)
  if (request.method === 'POST' && !id) return { status: 201, body: await repo.create(value) }
  if (request.method === 'PUT' && id && record(value))
    return { status: 200, body: await write(repo, id, operation, value) }
  throw new ScenarioRepositoryError(400, 'Invalid scenario request')
}

export async function handleScenarioRequest(
  request: IncomingMessage,
  response: ServerResponse,
  root: string,
): Promise<boolean> {
  const url = new URL(request.url ?? '/', 'http://127.0.0.1')
  if (url.pathname !== PREFIX && !url.pathname.startsWith(`${PREFIX}/`)) return false
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  const reply = (status: number, value: unknown) => {
    response.writeHead(status)
    response.end(JSON.stringify(value))
  }
  try {
    const { status, body } = await route(request, new ScenarioRepository(root), url)
    reply(status, body)
  } catch (error) {
    reply(error instanceof ScenarioRepositoryError ? error.status : 400, {
      error: error instanceof Error ? error.message : 'Scenario request failed',
    })
  }
  return true
}
