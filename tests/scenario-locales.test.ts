import { expect, it } from 'vitest'
import { validateTemplates } from '../src/scenarios/locales.ts'

it('accepts a complete translation with unchanged placeholders', () => {
  expect(
    validateTemplates(
      { T001: 'Do {action} with {field}.' },
      { T001: 'Faire {action} avec {field}.' },
    ),
  ).toEqual([])
})
it('rejects missing keys, extra keys, empty text and changed placeholders', () => {
  const source = { T001: 'Do {action}.' }
  for (const value of [
    null,
    {},
    { T001: '' },
    { T001: 'Do it.' },
    { T001: 'Do {aktion}.' },
    { T001: 'Do {action}.', extra: 'x' },
  ])
    expect(validateTemplates(source, value).length).toBeGreaterThan(0)
})
it('preserves repeated placeholders rather than comparing only sets', () => {
  expect(
    validateTemplates({ T001: '{field} then {field}' }, { T001: '{field}' }).length,
  ).toBeGreaterThan(0)
})
