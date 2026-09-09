import { expect, it } from 'vitest'
import {
  assertObservation,
  executeDeclarative,
  parseScenario,
  resolveValue,
} from '../src/scenarios/declarative.ts'

const noFile = async () => {
  throw new Error('Unexpected file read')
}
it('resolves a unique real identifier and refuses missing or ambiguous targets', async () => {
  const ref = { $ref: 'scene.nodes', find: { name: 'Cube' }, pick: 'id' }
  await expect(
    resolveValue(ref, { scene: { nodes: [{ id: 'real-id', name: 'Cube' }] } }, noFile),
  ).resolves.toBe('real-id')
  await expect(
    resolveValue(
      ref,
      {
        scene: {
          nodes: [
            { id: 'a', name: 'Cube' },
            { id: 'b', name: 'Cube' },
          ],
        },
      },
      noFile,
    ),
  ).rejects.toThrow('exactly one')
  await expect(resolveValue({ $ref: '__proto__.x' }, {}, noFile)).rejects.toThrow('Forbidden')
})
it('does not mistake a missing file boolean for file existence', async () => {
  await expect(
    assertObservation(
      {
        actual: { $file: { path: 'x', read: 'exists' } },
        op: 'equal',
        expected: true,
      },
      {},
      async () => false,
    ),
  ).rejects.toThrow('failed')
})
it('executes arguments from a prior response and blocks after a false observation', async () => {
  const calls: unknown[] = []
  const scenario = parseScenario({
    id: 'test',
    request: 'Rename Cube',
    requires: [],
    blockers: [],
    trainingApproved: false,
    steps: [
      {
        id: 'read',
        action: 'scene.state',
        input: {},
        saveAs: 'scene',
        assertions: [],
      },
      {
        id: 'rename',
        action: 'node.rename',
        input: {
          nodeId: { $ref: 'scene.nodes', find: { name: 'Cube' }, pick: 'id' },
          name: 'Base',
        },
        saveAs: 'changed',
        assertions: [{ actual: { $ref: 'changed.ok' }, op: 'equal', expected: true }],
      },
      { id: 'later', action: 'node.remove', input: {}, assertions: [] },
    ],
  })
  const result = await executeDeclarative(
    scenario,
    {},
    {
      readFile: noFile,
      validateInput: () => {},
      persist: async () => {},
      call: async (action, input) => {
        calls.push(input)
        return action === 'scene.state' ? { nodes: [{ id: 'real', name: 'Cube' }] } : { ok: false }
      },
    },
  )
  expect(calls).toEqual([{}, { nodeId: 'real', name: 'Base' }])
  expect(result.steps.at(-1)?.status).toBe('blocked')
})
it('refuses a scenario that merely executes without checking', () => {
  expect(() =>
    parseScenario({
      id: 'x',
      request: 'x',
      requires: [],
      blockers: [],
      trainingApproved: false,
      steps: [{ id: 'x', action: 'x', input: {}, assertions: [] }],
    }),
  ).toThrow('real assertion')
})
