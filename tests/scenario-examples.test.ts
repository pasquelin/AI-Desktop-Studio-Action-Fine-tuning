import { describe, expect, it } from 'vitest'
import { compileCaseExample, compileJourneyExample } from '../src/scenarios/examples.ts'

const internal = {
  type: 'object',
  properties: { name: { type: 'string' } },
  required: ['name'],
  additionalProperties: false,
}
const action = { inputSchema: internal }

describe('example preparation safety', () => {
  it('uses the published MCP contract rather than assuming internal acceptance', () => {
    const wire = {
      ...internal,
      required: ['name', 'consent'],
      properties: { ...internal.properties, consent: { type: 'string' } },
    }
    const result = compileCaseExample(
      {
        id: 'project.create/001',
        action: 'project.create',
        source: 'project.md',
        specification: 'Nominal minimal',
      },
      action,
      wire,
      [],
    )
    expect(result.variants[0]?.expectedWireResult.accepted).toBe(false)
    expect(result.variants[0]?.expectedWireResult.errors[0]?.params).toEqual({
      missingProperty: 'consent',
    })
    expect(result.trainingApproved).toBe(false)
    expect(result.dialogue).toBeNull()
  })
  it('keeps accepted schema samples blocked for business validation', () => {
    const result = compileCaseExample(
      {
        id: 'project.create/001',
        action: 'project.create',
        source: 'project.md',
        specification: 'Nominal minimal',
      },
      action,
      internal,
      ['1.1'],
    )
    expect(result.variants[0]?.executionClass).toBe('studio-integration-required')
    expect(result.variants[0]?.runtimeBindings).toEqual(['name'])
    expect(result.context.setupStatus).toBe('not-bound')
  })
  it('rejects an unknown journey action instead of fabricating a plan', () => {
    expect(() =>
      compileJourneyExample(
        {
          id: 'P001',
          source: 'parcours.md',
          specification: 'Actions candidates : `missing.action`',
        },
        new Set(),
      ),
    ).toThrow('Unknown journey action')
  })
})
