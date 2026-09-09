import { isDeepStrictEqual } from 'node:util'
import { Ajv } from 'ajv'
import { record } from '../json.ts'
import { benchReadiness } from './capabilities.ts'
import { declarativeScenarioSchema } from './declarative-schema.ts'
import { runScenario, type ScenarioReport } from './runner.ts'

export interface Assertion {
  saveAs?: string
  actual: unknown
  op: 'equal' | 'notEqual' | 'exists' | 'length' | 'includes'
  expected?: unknown
}
export interface DeclarativeScenario {
  id: string
  request: string
  requires: string[]
  requiredBindings?: string[]
  blockers: string[]
  trainingApproved: false
  steps: {
    id: string
    action: string
    input: Record<string, unknown>
    saveAs?: string
    expectRefusal?: { includes: string }
    assertions: Assertion[]
  }[]
}
const valid = new Ajv({
  strict: false,
  allErrors: true,
}).compile<DeclarativeScenario>(declarativeScenarioSchema)
export function parseScenario(value: unknown): DeclarativeScenario {
  if (!valid(value)) throw new Error(`Invalid scenario: ${JSON.stringify(valid.errors)}`)
  const ids = value.steps.map(step => step.id)
  const names = value.steps.flatMap(step => [
    ...(step.saveAs ? [step.saveAs] : []),
    ...step.assertions.flatMap(check => (check.saveAs ? [check.saveAs] : [])),
  ])
  if (new Set(ids).size !== ids.length || new Set(names).size !== names.length)
    throw new Error('Duplicate step or binding')
  if (
    names.some(
      name =>
        ['sandbox', 'projectPath', '__proto__', 'constructor', 'prototype'].includes(name) ||
        name.includes('.'),
    )
  )
    throw new Error('Reserved binding')
  if (
    !value.blockers.length &&
    (!value.steps.length || !value.steps.some(step => step.assertions.length))
  )
    throw new Error('Executable scenario requires a real assertion')
  for (const step of value.steps)
    for (const check of step.assertions)
      if (check.op !== 'exists' && !('expected' in check))
        throw new Error('Missing expected result')
  return value
}
function readPath(value: unknown, path: string): unknown {
  if (!path) return value
  for (const part of path.split('.')) {
    if (['__proto__', 'constructor', 'prototype'].includes(part))
      throw new Error('Forbidden reference path')
    if ((!record(value) && !Array.isArray(value)) || !Object.hasOwn(value, part))
      throw new Error(`Missing reference: ${path}`)
    value = Reflect.get(value, part)
  }
  return value
}
export type FileReader = (
  path: string,
  read: 'exists' | 'text' | 'json' | 'sha256',
) => Promise<unknown>
export async function resolveValue(
  value: unknown,
  bindings: Record<string, unknown>,
  readFile: FileReader,
): Promise<unknown> {
  if (Array.isArray(value))
    return Promise.all(value.map(item => resolveValue(item, bindings, readFile)))
  if (!record(value)) return value
  if ('$ref' in value) {
    if (
      typeof value.$ref !== 'string' ||
      Object.keys(value).some(key => !['$ref', 'find', 'pick'].includes(key))
    )
      throw new Error('Invalid reference')
    let found = readPath(bindings, value.$ref)
    if ('find' in value) {
      if (!Array.isArray(found) || !record(value.find)) throw new Error('Invalid selector')
      const criteria = await resolveValue(value.find, bindings, readFile)
      if (!record(criteria)) throw new Error('Invalid selector criteria')
      const matches = found.filter(
        item =>
          record(item) &&
          Object.entries(criteria).every(
            ([key, expected]) => Object.hasOwn(item, key) && isDeepStrictEqual(item[key], expected),
          ),
      )
      if (matches.length !== 1) throw new Error('Selector must match exactly one target')
      found = matches[0]
    }
    if ('pick' in value) {
      if (typeof value.pick !== 'string') throw new Error('Invalid pick')
      found = readPath(found, value.pick)
    }
    return structuredClone(found)
  }
  if ('$file' in value) {
    if (Object.keys(value).length !== 1 || !record(value.$file))
      throw new Error('Invalid file observation')
    const { path, read } = value.$file
    const resolved = await resolveValue(path, bindings, readFile)
    if (
      typeof resolved !== 'string' ||
      !['exists', 'text', 'json', 'sha256'].includes(String(read))
    )
      throw new Error('Invalid file observation')
    // The allowed read values were checked above; the adapter enforces the filesystem boundary.
    return readFile(resolved, read as 'exists' | 'text' | 'json' | 'sha256')
  }
  const pairs = await Promise.all(
    Object.entries(value).map(async ([key, item]) => [
      key,
      await resolveValue(item, bindings, readFile),
    ]),
  )
  return Object.fromEntries(pairs)
}
export async function assertObservation(
  check: Assertion,
  bindings: Record<string, unknown>,
  readFile: FileReader,
): Promise<void> {
  const actual = await resolveValue(check.actual, bindings, readFile)
  const expected = await resolveValue(check.expected, bindings, readFile)
  let passed = false
  switch (check.op) {
    case 'equal':
      passed = isDeepStrictEqual(actual, expected)
      break
    case 'notEqual':
      passed = !isDeepStrictEqual(actual, expected)
      break
    case 'exists':
      passed = actual !== undefined && actual !== null
      break
    case 'length':
      passed = (Array.isArray(actual) || typeof actual === 'string') && actual.length === expected
      break
    case 'includes':
      passed =
        typeof actual === 'string' && typeof expected === 'string'
          ? actual.includes(expected)
          : Array.isArray(actual) && actual.some(item => isDeepStrictEqual(item, expected))
      break
  }
  if (!passed)
    throw new Error(`Assertion ${check.op} failed: ${JSON.stringify({ actual, expected })}`)
  if (check.saveAs) bindings[check.saveAs] = structuredClone(actual)
}
export class ActionRefusal extends Error {}

export interface ScenarioAdapter {
  availableRequirements?: string[]
  call: (
    action: string,
    input: Record<string, unknown>,
    options: { allowConsent: boolean; stepId: string },
  ) => Promise<unknown>
  readFile: FileReader
  persist: (report: ScenarioReport) => Promise<void>
  validateInput: (action: string, input: Record<string, unknown>) => void
}
export async function executeDeclarative(
  scenario: DeclarativeScenario,
  variables: Record<string, unknown>,
  adapter: ScenarioAdapter,
): Promise<ScenarioReport> {
  const { missing } = benchReadiness(scenario, adapter.availableRequirements ?? [])
  if (scenario.blockers.length || missing.length)
    throw new Error(
      `Scenario prerequisites unresolved: ${[...missing, ...scenario.blockers].join('; ')}`,
    )
  for (const key of scenario.requiredBindings ?? [])
    if (!Object.hasOwn(variables, key)) throw new Error(`Missing fixture binding: ${key}`)
  const bindings = structuredClone(variables)
  return runScenario(
    scenario.id,
    scenario.steps.map(step => ({
      id: step.id,
      label: step.action,
      run: async () => {
        const input = await resolveValue(step.input, bindings, adapter.readFile)
        if (!record(input)) throw new Error('Action input must be an object')
        adapter.validateInput(step.action, input)
        let result: unknown
        let refused = false
        try {
          result = await adapter.call(step.action, input, {
            allowConsent: !step.expectRefusal,
            stepId: step.id,
          })
        } catch (error) {
          if (
            !step.expectRefusal ||
            !(error instanceof ActionRefusal) ||
            !error.message.includes(step.expectRefusal.includes)
          )
            throw error
          refused = true
          result = { refused: true, message: error.message }
        }
        if (step.expectRefusal && !refused) throw new Error('Expected refusal did not occur')
        if (step.saveAs) bindings[step.saveAs] = result
        for (const check of step.assertions)
          await assertObservation(check, bindings, adapter.readFile)
      },
    })),
    adapter.persist,
  )
}

export function makeInputValidator(
  tools: unknown,
): (action: string, input: Record<string, unknown>) => void {
  if (!Array.isArray(tools)) throw new Error('Missing MCP catalogue')
  const ajv = new Ajv({ strict: false })
  const validators = new Map<string, ReturnType<typeof ajv.compile>>()
  for (const tool of tools) {
    if (!record(tool) || typeof tool.name !== 'string' || !record(tool.inputSchema))
      throw new Error('Invalid MCP tool')
    validators.set(tool.name, ajv.compile(tool.inputSchema))
  }
  return (action, input) => {
    const check = validators.get(action.replace('.', '_'))
    if (!check?.(input)) throw new Error(`Invalid MCP arguments for ${action}`)
  }
}

export { BENCH_REQUIREMENTS } from './capabilities.ts'
export { makeConversationDraft } from './conversation.ts'
