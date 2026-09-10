import type { IncomingMessage, ServerResponse } from 'node:http'

/** A JSON request from the local observer page; the method it is allowed to carry is the caller's. */
export function localJson(request: IncomingMessage): boolean {
  return (
    request.headers.origin === `http://${request.headers.host}` &&
    (request.headers['content-type']?.startsWith('application/json') ?? false)
  )
}

/** Mutations are JSON-only and must come from the local observer origin. */
export function localMutation(request: IncomingMessage): boolean {
  return request.method === 'POST' && localJson(request)
}

/** Reads a bounded JSON body; an oversized request is refused before it is parsed. */
export async function readJsonBody(request: IncomingMessage, limit = 16384): Promise<unknown> {
  request.setEncoding('utf8')
  let body = ''
  for await (const chunk of request) {
    body += String(chunk)
    if (Buffer.byteLength(body) > limit) throw new Error('Requête trop volumineuse')
  }
  return JSON.parse(body)
}

/** Local observer replies are never cached: the admin polls the same paths continuously. */
export function jsonReply(response: ServerResponse, code: number, value: unknown): void {
  response
    .writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
    .end(JSON.stringify(value))
}

export const LOCAL_JSON_REQUIRED = 'Requête JSON locale requise'

/** A refusal the interface must branch on: the code travels, the message is only displayed. */
export class CodedError extends Error {
  readonly code: string
  constructor(code: string, text: string) {
    super(text)
    this.name = 'CodedError'
    this.code = code
  }
}

/**
 * One shape for the observer's JSON endpoints: a fixed path list, a handler that returns the
 * status alongside its body, and a single place where a thrown error becomes a 400. Without it
 * each endpoint restates the routing, the reply and the catch, and they drift apart.
 */
export function jsonEndpoint(
  paths: readonly string[],
  respond: (path: string, request: IncomingMessage) => Promise<{ code: number; value: unknown }>,
  fallback: string,
) {
  return async (request: IncomingMessage, response: ServerResponse): Promise<boolean> => {
    const path = new URL(request.url ?? '/', 'http://localhost').pathname
    if (!paths.includes(path)) return false
    try {
      const result = await respond(path, request)
      jsonReply(response, result.code, result.value)
    } catch (error) {
      jsonReply(response, 400, {
        error: error instanceof Error ? error.message : fallback,
        ...(error instanceof CodedError ? { code: error.code } : {}),
      })
    }
    return true
  }
}
