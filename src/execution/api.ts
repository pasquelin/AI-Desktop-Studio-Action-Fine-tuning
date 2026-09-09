import type { IncomingMessage, ServerResponse } from 'node:http'
import { ScenarioRepository } from '../admin/scenario-repository.ts'
import { record } from '../json.ts'
import { findPreparedReference } from '../vm/reference.ts'
import { ExecutionController } from './controller.ts'
import { createVmRunner } from './vm-runner.ts'

async function selection(request: IncomingMessage): Promise<string[]> {
  let body = ''
  for await (const chunk of request) {
    body += String(chunk)
    if (Buffer.byteLength(body) > 16384) throw new Error('Sélection trop volumineuse')
  }
  const value: unknown = JSON.parse(body)
  if (!record(value) || !Array.isArray(value.ids)) throw new Error('Sélection invalide')
  const ids = value.ids
  if (!ids.length || ids.length > 63 || ids.some(id => typeof id !== 'string'))
    throw new Error('Sélection invalide')
  if (new Set(ids).size !== ids.length) throw new Error('Parcours en double')
  return ids as string[]
}
async function prepare(root: string, ids: string[]) {
  const repo = new ScenarioRepository(root)
  for (const id of ids) {
    const entry = await repo.detail(id)
    if (entry.kind !== 'journey' || !entry.active || !entry.ready)
      throw new Error(`${id} : activer un parcours prêt avant de le lancer`)
  }
  const reference = await findPreparedReference(root)
  if (!reference) throw new Error('Préparer la VM de référence avant le premier essai')
  return new ExecutionController(createVmRunner(root, reference))
}
function localMutation(request: IncomingMessage) {
  return (
    request.method === 'POST' &&
    request.headers.origin === `http://${request.headers.host}` &&
    request.headers['content-type']?.startsWith('application/json')
  )
}
class ExecutionEndpoint {
  private controller = new ExecutionController(async () => 1)
  private starting = false
  private root: string
  constructor(root: string) {
    this.root = root
  }
  async start(request: IncomingMessage) {
    if (this.starting || this.controller.snapshot().status === 'running')
      return { code: 409, value: { error: 'Un essai est déjà en cours' } }
    this.starting = true
    try {
      const ids = await selection(request)
      this.controller = await prepare(this.root, ids)
      return { code: 202, value: this.controller.start(ids) }
    } finally {
      this.starting = false
    }
  }
  async handle(request: IncomingMessage, response: ServerResponse): Promise<boolean> {
    const path = new URL(request.url ?? '/', 'http://localhost').pathname
    if (path !== '/api/execution' && path !== '/api/execution/stop') return false
    const reply = (code: number, value: unknown) => {
      response.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
      response.end(JSON.stringify(value))
    }
    if (request.method === 'GET' && path === '/api/execution')
      reply(200, this.controller.snapshot())
    else if (!localMutation(request)) reply(403, { error: 'Requête JSON locale requise' })
    else if (path.endsWith('/stop')) {
      this.controller.stop()
      reply(202, this.controller.snapshot())
    } else {
      try {
        const result = await this.start(request)
        reply(result.code, result.value)
      } catch (error) {
        reply(400, { error: error instanceof Error ? error.message : 'Lancement impossible' })
      }
    }
    return true
  }
}
export function executionApi(root: string) {
  const endpoint = new ExecutionEndpoint(root)
  return endpoint.handle.bind(endpoint)
}
