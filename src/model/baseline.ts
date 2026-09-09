import { isDeepStrictEqual } from 'node:util'
import { Ajv } from 'ajv'
import { record } from '../json.ts'

export const MODEL = 'qwen3.5:2b'
const ENDPOINT = 'http://127.0.0.1:11434'
const TOOL_NAMES = [
  'project_create',
  'workspace_open',
  'node_add',
  'node_rename',
  'node_transform',
  'document_save',
]
export type Proposal = { name: string; arguments: Record<string, unknown> }
export type Tool = {
  name: string
  description: string
  inputSchema: Record<string, unknown>
}
export function readTools(catalogue: unknown, names = TOOL_NAMES): Tool[] {
  if (!record(catalogue) || !Array.isArray(catalogue.mcpTools))
    throw new Error('Missing MCP catalogue')
  const entries: unknown[] = catalogue.mcpTools
  return names.map(name => {
    const matches = entries.filter(item => record(item) && item.name === name)
    const item = matches[0]
    if (
      matches.length !== 1 ||
      !record(item) ||
      typeof item.description !== 'string' ||
      !record(item.inputSchema)
    ) {
      throw new Error(`Missing, duplicate or invalid tool: ${name}`)
    }
    return {
      name,
      description: item.description,
      inputSchema: item.inputSchema,
    }
  })
}

export function grade(value: unknown, expected: Proposal, tools: Tool[]) {
  if (
    !record(value) ||
    !record(value.message) ||
    !Array.isArray(value.message.tool_calls) ||
    value.message.tool_calls.length !== 1
  ) {
    return { passed: false, reason: 'Expected exactly one tool call' }
  }
  const call: unknown = value.message.tool_calls[0]
  if (
    !record(call) ||
    !record(call.function) ||
    typeof call.function.name !== 'string' ||
    !record(call.function.arguments)
  ) {
    return { passed: false, reason: 'Malformed tool call' }
  }
  const proposed = call.function
  const tool = tools.find(item => item.name === proposed.name)
  if (!tool) return { passed: false, reason: 'Unknown tool' }
  if (!new Ajv({ strict: false }).validate(tool.inputSchema, proposed.arguments)) {
    return { passed: false, reason: 'Arguments violate the Studio schema' }
  }
  const passed =
    proposed.name === expected.name && isDeepStrictEqual(proposed.arguments, expected.arguments)
  return {
    passed,
    reason: passed
      ? 'Exact expected proposal'
      : 'Proposal differs from expected action or arguments',
  }
}

/** Only the local inference service is addressed. This module has no Studio executor. */
export async function localRequest(
  path: '/api/tags' | '/api/show' | '/api/chat' | '/api/version',
  body?: unknown,
): Promise<unknown> {
  const response = await fetch(`${ENDPOINT}${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    ...(body === undefined
      ? {}
      : {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }),
    redirect: 'error',
    signal: AbortSignal.timeout(120000),
  })
  if (!response.ok)
    throw new Error(
      `Local model service: HTTP ${response.status}: ${(await response.text()).slice(0, 500)}`,
    )
  return response.json()
}
