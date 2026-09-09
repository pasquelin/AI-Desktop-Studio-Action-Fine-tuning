import { expect, it } from 'vitest'
import { grade, readTools } from '../src/model/baseline.ts'

const catalogue = {
  mcpTools: [
    {
      name: 'node_add',
      description: 'Add',
      inputSchema: {
        type: 'object',
        properties: { kind: { enum: ['box', 'sphere'] } },
        required: ['kind'],
        additionalProperties: false,
      },
    },
  ],
}
const expected = { name: 'node_add', arguments: { kind: 'box' } }
const response = (args: unknown, name = 'node_add') => ({
  message: { tool_calls: [{ function: { name, arguments: args } }] },
})
it('accepts the expected tool with schema-valid exact arguments', () => {
  expect(
    grade(response({ kind: 'box' }), expected, readTools(catalogue, ['node_add'])).passed,
  ).toBe(true)
})
it('rejects wrong arguments even when valid according to the tool schema', () => {
  expect(
    grade(response({ kind: 'sphere' }), expected, readTools(catalogue, ['node_add'])).passed,
  ).toBe(false)
})
it('rejects unknown parameters and tools', () => {
  const tools = readTools(catalogue, ['node_add'])
  expect(grade(response({ kind: 'box', consent: 'invented' }), expected, tools).passed).toBe(false)
  expect(grade(response({ kind: 'box' }, 'unknown'), expected, tools).passed).toBe(false)
})
it('rejects prose or malformed output instead of treating it as an action', () => {
  for (const value of [null, {}, { message: { content: 'Done' } }, response('box')]) {
    expect(grade(value, expected, readTools(catalogue, ['node_add'])).passed).toBe(false)
  }
})
it('rejects extra calls even when the first is correct', () => {
  const value = response({ kind: 'box' })
  value.message.tool_calls.push({
    function: { name: 'node_add', arguments: { kind: 'box' } },
  })
  expect(grade(value, expected, readTools(catalogue, ['node_add'])).passed).toBe(false)
})
it('requires every selected tool to exist once and have a schema', () => {
  expect(() => readTools(catalogue, ['missing'])).toThrow()
  expect(() =>
    readTools({ mcpTools: [...catalogue.mcpTools, ...catalogue.mcpTools] }, ['node_add']),
  ).toThrow()
  expect(() => readTools({ mcpTools: [{ name: 'node_add' }] }, ['node_add'])).toThrow()
})
