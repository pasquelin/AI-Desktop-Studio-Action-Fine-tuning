// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { parseStructuredJson } from '../src/admin/json-validation.ts'

describe('structured JSON drafts', () => {
  it('preserves nested action parameters and all assertion value types', () => {
    const input = { nested: { enabled: true, list: [1, null, 'texte'] } }
    expect(parseStructuredJson(JSON.stringify(input), 'input')).toEqual(input)
    const assertions = [{ actual: { $ref: 'cube.position' }, op: 'equal', expected: input }]
    expect(parseStructuredJson(JSON.stringify(assertions), 'assertions')).toEqual(assertions)
  })
  it('rejects malformed text, incorrect roots and invalid assertion operations', () => {
    expect(() => parseStructuredJson('{', 'input')).toThrow('JSON invalide')
    expect(() => parseStructuredJson('[]', 'input')).toThrow('objet')
    expect(() => parseStructuredJson('{}', 'assertions')).toThrow('tableau')
    expect(() => parseStructuredJson('[{"actual":1,"op":"wrong"}]', 'assertions')).toThrow('equal')
    expect(() => parseStructuredJson('[{"op":"exists"}]', 'assertions')).toThrow('actual')
  })
})
