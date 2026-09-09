import { expect, it } from 'vitest'
import { scenarioConsent } from '../src/vm/scenario-consent.ts'

const token = '00000000-0000-0000-0000-000000000000'
const refusal = {
  isError: true,
  content: [
    {
      type: 'text',
      text: `Nothing engaged: that call needs a consent token. Ask whoever you are acting for, then send this same call again, its consent parameter set to ${token}.`,
    },
  ],
}
it('recognizes the expected consent for the fixed test actions', () =>
  expect(scenarioConsent('project.create', refusal)).toBe(token))
it('does not authorize an unrelated action or ordinary failure', () => {
  expect(scenarioConsent('generation.submit', refusal)).toBeUndefined()
  expect(scenarioConsent('project.create', { ...refusal, isError: false })).toBeUndefined()
  expect(
    scenarioConsent('project.create', {
      isError: true,
      content: [{ type: 'text', text: `Unknown failure ${token}` }],
    }),
  ).toBeUndefined()
})
