import { describe, expect, it } from 'vitest'
import type { ScenarioEntry } from '../src/admin/scenario-repository.ts'
import { filterQuery, matches, readFilters, suggestId } from '../src/admin/views/scenario-filter.ts'

const entry = (over: Partial<ScenarioEntry> = {}): ScenarioEntry => ({
  id: 'P001',
  kind: 'journey',
  title: 'Créer un cube',
  source: 'datasets/bench/journeys/P001.json',
  revision: 'r1',
  scenarioHash: 'h1',
  active: false,
  ready: true,
  missing: [],
  blockers: [],
  languages: [],
  ...over,
})
const filters = (over: Partial<ReturnType<typeof readFilters>> = {}) => ({
  q: '',
  kind: '',
  language: '',
  status: '',
  ...over,
})

describe('scenario catalogue filters', () => {
  it('reads every filter from the address and writes back only those chosen', () => {
    const params = new URLSearchParams('q=cube&language=de&id=P003')
    expect(readFilters(params)).toEqual({ q: 'cube', kind: '', language: 'de', status: '' })
    expect(filterQuery(readFilters(params))).toBe('q=cube&language=de')
  })
  it('matches an entry on its identity and its request, ignoring case', () => {
    expect(matches(entry(), filters({ q: 'CUBE' }))).toBe(true)
    expect(matches(entry(), filters({ q: 'p001' }))).toBe(true)
    expect(matches(entry(), filters({ q: 'sphère' }))).toBe(false)
  })
  it('separates design cases from executable journeys', () => {
    expect(matches(entry({ kind: 'case' }), filters({ kind: 'journey' }))).toBe(false)
    expect(matches(entry(), filters({ kind: 'journey' }))).toBe(true)
  })
  it('reports a translation as missing or as a draft only against a chosen language', () => {
    const translated = entry({ languages: [{ language: 'de', text: 'Würfel', status: 'draft' }] })
    expect(matches(entry(), filters({ status: 'missing', language: 'de' }))).toBe(true)
    expect(matches(translated, filters({ status: 'missing', language: 'de' }))).toBe(false)
    expect(matches(translated, filters({ status: 'draft', language: 'de' }))).toBe(true)
    // Without a language the question has no answer, so nothing is reported.
    expect(matches(entry(), filters({ status: 'missing' }))).toBe(false)
  })
  it('keeps a reviewed translation out of the drafts to reread', () => {
    const reviewed = entry({ languages: [{ language: 'de', text: 'Würfel', status: 'reviewed' }] })
    expect(matches(reviewed, filters({ status: 'draft', language: 'de' }))).toBe(false)
  })
  it('selects on readiness and activation, and matches nothing for an unknown status', () => {
    expect(matches(entry({ ready: true }), filters({ status: 'ready' }))).toBe(true)
    expect(matches(entry({ ready: false }), filters({ status: 'blocked' }))).toBe(true)
    expect(matches(entry({ active: true }), filters({ status: 'active' }))).toBe(true)
    expect(matches(entry(), filters({ status: 'invented' }))).toBe(false)
  })
  it('suggests the first free identity, including inside a gap', () => {
    expect(suggestId([])).toBe('P001')
    expect(suggestId([entry({ id: 'P001' }), entry({ id: 'P003' })])).toBe('P002')
    expect(suggestId([entry({ id: 'P001' }), entry({ id: 'P002' })])).toBe('P003')
  })
})

it('keeps QA evidence independent of activation and readiness', () => {
  for (const status of ['not-tested', 'passed', 'failed', 'blocked', 'stale'] as const) {
    const item = entry({ active: true, ready: true, qa: { status } })
    expect(matches(item, filters({ status: `qa-${status}` }))).toBe(true)
    expect(matches(item, filters({ status: 'active' }))).toBe(true)
    expect(matches(item, filters({ status: 'ready' }))).toBe(true)
    expect(matches(item, filters({ status: status === 'passed' ? 'qa-stale' : 'qa-passed' }))).toBe(
      false,
    )
  }
  expect(matches(entry(), filters({ status: 'qa-not-tested' }))).toBe(true)
})
