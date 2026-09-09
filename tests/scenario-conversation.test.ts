import { expect, it } from 'vitest'
import { makeConversationDraft } from '../src/scenarios/conversation.ts'
import { ActionRefusal, executeDeclarative, parseScenario } from '../src/scenarios/declarative.ts'
import {
  prepareApprovedExport,
  verifyRecordedConversation,
} from '../src/scenarios/export-approved.ts'

const scenario = parseScenario({
  id: 'P-test',
  request: 'Observe',
  requires: [],
  blockers: [],
  trainingApproved: false,
  steps: [
    {
      id: 'read',
      action: 'scene.state',
      input: {},
      saveAs: 'scene',
      assertions: [{ actual: { $ref: 'scene.nodes' }, op: 'length', expected: 0 }],
    },
  ],
})
const provenance = {
  kind: 'real-vm',
  runId: 'run',
  studioRevision: 'revision',
  catalogueHash: 'a'.repeat(64),
  scenarioHash: 'b'.repeat(64),
}
const tools = [
  {
    name: 'scene_state',
    description: 'Read scene',
    inputSchema: { type: 'object', additionalProperties: false },
  },
]
const report = {
  schemaVersion: 1 as const,
  kind: 'reference-actions' as const,
  modelUsed: false as const,
  scenario: scenario.id,
  status: 'passed' as const,
  steps: [{ id: 'read', label: 'scene.state', status: 'passed' as const }],
}
const calls = [{ stepId: 'read', action: 'scene.state', input: {}, result: { nodes: [] } }]
it('links exact recorded conversation but keeps semantic approval pending', () => {
  const { draft, link } = makeConversationDraft(scenario, report, calls, tools, provenance)
  expect(draft.review.decision).toBe('pending')
  expect(() =>
    verifyRecordedConversation(draft, {
      ...report,
      provenance,
      conversationEvidence: [link],
    }),
  ).not.toThrow()
  expect(() => prepareApprovedExport({ seed: 'seed', examples: [draft] }, {})).toThrow('unreviewed')
  expect(() =>
    verifyRecordedConversation(
      {
        ...draft,
        evidence: { ...draft.evidence, contentHash: 'c'.repeat(64) },
      },
      { ...report, provenance, conversationEvidence: [link] },
    ),
  ).toThrow('Missing or mismatched')
})
it('never creates a draft from incomplete or wrongly ordered execution', () => {
  expect(() => makeConversationDraft(scenario, report, [], tools, provenance)).toThrow('complete')
  expect(() =>
    makeConversationDraft(
      scenario,
      report,
      [
        {
          stepId: 'other',
          action: 'scene.state',
          input: {},
          result: { nodes: [] },
        },
      ],
      tools,
      provenance,
    ),
  ).toThrow('order')
})
it('only an actual typed refusal can satisfy a negative scenario', async () => {
  const negative = parseScenario({
    ...scenario,
    steps: [
      {
        id: 'refuse',
        action: 'scene.state',
        input: {},
        expectRefusal: { includes: 'denied' },
        assertions: [{ actual: true, op: 'equal', expected: true }],
      },
    ],
  })
  const execute = (call: () => Promise<unknown>) =>
    executeDeclarative(
      negative,
      {},
      {
        call,
        readFile: async () => null,
        validateInput: () => {},
        persist: async () => {},
      },
    )
  expect((await execute(async () => ({ refused: true }))).status).toBe('failed')
  expect(
    (
      await execute(async () => {
        throw new Error('denied network')
      })
    ).status,
  ).toBe('failed')
  expect(
    (
      await execute(async () => {
        throw new ActionRefusal('denied')
      })
    ).status,
  ).toBe('passed')
})
