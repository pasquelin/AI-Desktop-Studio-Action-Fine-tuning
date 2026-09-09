import { record } from '../json.ts'
import { approvedContentHash } from './content-hash.ts'
import type { DeclarativeScenario } from './declarative.ts'
import type { ScenarioReport } from './runner.ts'

export interface ObservedCall {
  stepId: string
  action: string
  input: Record<string, unknown>
  result: unknown
}
/** Observed reference execution is a draft, never semantic approval. */
export function makeConversationDraft(
  scenario: DeclarativeScenario,
  report: ScenarioReport,
  calls: ObservedCall[],
  tools: unknown,
  provenance: {
    scenarioHash: string
    runId: string
    studioRevision: string
    catalogueHash: string
    kind: string
  },
) {
  if (
    report.status !== 'passed' ||
    report.steps.length !== scenario.steps.length ||
    report.steps.some(step => step.status !== 'passed') ||
    calls.length !== scenario.steps.length ||
    scenario.steps.some(step => step.expectRefusal)
  )
    throw new Error('Only complete successful observed calls can produce a conversation draft')
  if (!Array.isArray(tools)) throw new Error('Missing tools')
  const messages: Record<string, unknown>[] = [{ role: 'user', content: scenario.request }]
  for (const [index, call] of calls.entries()) {
    const expected = scenario.steps[index]
    if (call.stepId !== expected?.id || call.action !== expected.action)
      throw new Error('Observed calls do not match scenario order')
    const id = `call_${index + 1}`
    messages.push(
      {
        role: 'assistant',
        content: null,
        tool_calls: [
          {
            id,
            type: 'function',
            function: {
              name: call.action.replace('.', '_'),
              arguments: JSON.stringify(call.input),
            },
          },
        ],
      },
      { role: 'tool', tool_call_id: id, content: JSON.stringify(call.result) },
    )
  }
  messages.push({
    role: 'assistant',
    content: 'Les vérifications prévues pour ce parcours ont réussi.',
  })
  const names = new Set(calls.map(call => call.action.replace('.', '_')))
  const selected = tools
    .filter(tool => record(tool) && names.has(String(tool.name)))
    .map(tool => {
      if (
        !record(tool) ||
        typeof tool.name !== 'string' ||
        typeof tool.description !== 'string' ||
        !record(tool.inputSchema)
      )
        throw new Error('Invalid tool descriptor')
      return {
        type: 'function',
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.inputSchema,
        },
      }
    })
  if (selected.length !== names.size) throw new Error('Missing tool descriptor')
  const groups = [...new Set(calls.map(call => call.action))].sort()
  const content = {
    scenarioId: scenario.id,
    scenarioHash: provenance.scenarioHash,
    group: groups[0],
    relatedGroups: groups.slice(1),
    messages,
    tools: selected,
  }
  const checks = scenario.steps.flatMap(step =>
    step.assertions.map((_, index) => ({
      name: `${step.id}/assertion-${index + 1}`,
      passed: true,
    })),
  )
  if (!checks.length) throw new Error('No business checks')
  const contentHash = approvedContentHash(content)
  return {
    draft: {
      id: `${scenario.id}-${provenance.runId}`,
      ...content,
      review: {
        decision: 'pending',
        reason:
          'Reference script output requires semantic review of request, actions and final answer.',
      },
      evidence: {
        ...provenance,
        kind: 'real-vm',
        status: 'passed',
        scenarioId: scenario.id,
        contentHash,
        checks,
      },
    },
    link: {
      scenarioId: scenario.id,
      scenarioHash: provenance.scenarioHash,
      contentHash,
      checks,
    },
  }
}
