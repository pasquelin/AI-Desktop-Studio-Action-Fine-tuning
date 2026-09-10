import type { IncomingMessage } from 'node:http'
import { jsonEndpoint, LOCAL_JSON_REQUIRED, localMutation, readJsonBody } from '../http.ts'
import { QaService } from './service.ts'

const paths = ['/api/qa', '/api/qa/boot', '/api/qa/stop', '/api/qa/reports']
async function mutate(service: QaService, path: string, request: IncomingMessage) {
  if (path.endsWith('/boot')) {
    await service.boot()
    return service.snapshot()
  }
  if (path.endsWith('/stop')) {
    service.stop()
    return service.snapshot()
  }
  return service.start(await readJsonBody(request))
}
async function result(service: QaService, path: string, request: IncomingMessage) {
  if (request.method === 'GET') {
    if (path === '/api/qa/reports') return { code: 200, value: await service.reports() }
    if (path === '/api/qa') return { code: 200, value: await service.snapshot() }
  }
  if (!localMutation(request)) return { code: 403, value: { error: LOCAL_JSON_REQUIRED } }
  if (path === '/api/qa/reports') return { code: 405, value: { error: 'Méthode non autorisée' } }
  return { code: 202, value: await mutate(service, path, request) }
}
export function qaApi(root: string, service = new QaService(root)) {
  return jsonEndpoint(
    paths,
    (path, request) => result(service, path, request),
    'Requête QA impossible',
  )
}
