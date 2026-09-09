import { describe, expect, it } from 'vitest'
import { parseScenario } from '../src/scenarios/declarative.ts'
import { checkScenarioInputs } from '../src/scenarios/preflight.ts'

const parameters = {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'config'],
  properties: {
    name: { type: 'string' },
    config: {
      type: 'object',
      additionalProperties: false,
      required: ['count', 'enabled'],
      properties: {
        count: { type: 'integer', minimum: 1 },
        enabled: { type: 'boolean' },
      },
    },
  },
}
const tools = (schema: unknown = parameters) => [{ name: 'node_add', inputSchema: schema }]
function plan(input: Record<string, unknown>, action = 'node.add') {
  return parseScenario({
    version: 1,
    id: 'P001',
    request: 'test',
    requires: [],
    requiredBindings: [],
    blockers: [],
    trainingApproved: false,
    steps: [
      {
        id: 'add',
        action,
        input,
        assertions: [{ actual: true, op: 'equal', expected: true }],
      },
    ],
  })
}
describe('scenario input preflight', () => {
  it('accepts valid literals', () =>
    expect(() =>
      checkScenarioInputs(plan({ name: 'Cube', config: { count: 1, enabled: true } }), tools()),
    ).not.toThrow())
  it('rejects unknown actions, fields and missing fields', () => {
    expect(() => checkScenarioInputs(plan({}, 'missing.action'), tools())).toThrow('unknown action')
    expect(() =>
      checkScenarioInputs(
        plan({ name: 'Cube', config: { count: 1, enabled: true }, unknown: 1 }),
        tools(),
      ),
    ).toThrow('additional properties')
    expect(() => checkScenarioInputs(plan({ name: 'Cube' }), tools())).toThrow('required property')
  })
  it('checks literal siblings inside objects containing dynamic values', () => {
    expect(() =>
      checkScenarioInputs(
        plan({
          name: { $ref: 'created.name' },
          config: { count: { $ref: 'settings.count' }, enabled: 'wrong' },
        }),
        tools(),
      ),
    ).toThrow('boolean')
    expect(() =>
      checkScenarioInputs(
        plan({
          name: { $ref: 'created.name' },
          config: { count: { $ref: 'settings.count' }, enabled: true },
        }),
        tools(),
      ),
    ).not.toThrow()
  })
  it('defers file reads while retaining missing nested-field checks', () => {
    expect(() =>
      checkScenarioInputs(
        plan({
          name: { $file: { path: 'name.txt', read: 'text' } },
          config: { count: 0, enabled: true },
        }),
        tools(),
      ),
    ).toThrow('>= 1')
    expect(() =>
      checkScenarioInputs(plan({ name: 'Cube', config: { count: { $ref: 'counter' } } }), tools()),
    ).toThrow('enabled')
  })
  it('resolves root-local schema references and refuses unavailable ones', () => {
    const schema = {
      ...parameters,
      $defs: { count: { type: 'integer', minimum: 2 } },
      properties: { ...parameters.properties, name: { $ref: '#/$defs/count' } },
    }
    expect(() =>
      checkScenarioInputs(plan({ name: 1, config: { count: 1, enabled: true } }), tools(schema)),
    ).toThrow('>= 2')
    expect(() =>
      checkScenarioInputs(plan({}), tools({ $ref: 'https://unavailable.invalid/schema' })),
    ).toThrow('Cannot preflight')
  })
  it('does not certify an unresolved conditional branch', () => {
    const schema = {
      type: 'object',
      anyOf: [
        { properties: { name: { const: 'one' } } },
        { properties: { name: { const: 'two' } } },
      ],
    }
    expect(() => checkScenarioInputs(plan({ name: { $ref: 'choice' } }), tools(schema))).toThrow(
      'conditional schema',
    )
  })
})
