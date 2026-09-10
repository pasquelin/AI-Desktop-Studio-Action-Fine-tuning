import { expect, it } from 'vitest'
import {
  assertQaEligibleExamples,
  selectQaEligibleExamples,
} from '../src/training/qa-eligibility.ts'

const example = { scenarioId: 'P003', scenarioHash: 'current-hash' }
it('accepts the currently passed scenario without requiring unrelated scenarios to pass', () => {
  const index = {
    statusFor: (id: string, hash: string) => ({
      status: id === 'P003' && hash === 'current-hash' ? 'passed' : 'failed',
    }),
  }
  expect(() => assertQaEligibleExamples({ examples: [example] }, index)).not.toThrow()
})
it.each(['not-tested', 'failed', 'blocked', 'stale'])(
  'rejects %s QA in an explicit export bundle',
  status => {
    expect(() =>
      assertQaEligibleExamples({ examples: [example] }, { statusFor: () => ({ status }) }),
    ).toThrow('QA validation required')
  },
)
it('passes the exact example hash to the QA proof lookup', () => {
  const index = {
    statusFor: (_id: string, hash: string) => ({
      status: hash === 'current-hash' ? 'passed' : 'stale',
    }),
  }
  expect(() =>
    assertQaEligibleExamples({ examples: [{ ...example, scenarioHash: 'edited-hash' }] }, index),
  ).toThrow('stale')
})
it('selection keeps the admissible subset and reports exclusions without mutating the input', () => {
  const bundle = { examples: [example, { ...example, scenarioId: 'P002' }] }
  const result = selectQaEligibleExamples(bundle, {
    statusFor: id => ({ status: id === 'P003' ? 'passed' : 'failed' }),
  })
  expect(result.included).toEqual([example])
  expect(result.excluded).toEqual([{ scenarioId: 'P002', reason: 'failed' }])
  expect(bundle.examples).toHaveLength(2)
  expect(() =>
    assertQaEligibleExamples({ examples: [] }, { statusFor: () => ({ status: 'passed' }) }),
  ).toThrow('No QA-validated')
})
