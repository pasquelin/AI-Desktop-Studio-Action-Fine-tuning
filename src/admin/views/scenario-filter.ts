import type { ScenarioEntry } from '../scenario-repository.ts'

export type ScenarioFilters = { q: string; kind: string; language: string; status: string }
const FILTER_KEYS = ['q', 'kind', 'language', 'status'] as const

export const readFilters = (params: URLSearchParams): ScenarioFilters => ({
  q: params.get('q') ?? '',
  kind: params.get('kind') ?? '',
  language: params.get('language') ?? '',
  status: params.get('status') ?? '',
})

/** Empty filters stay out of the address, so a shared link carries only what was chosen. */
export function filterQuery(filters: ScenarioFilters): string {
  const next = new URLSearchParams()
  for (const key of FILTER_KEYS) if (filters[key]) next.set(key, filters[key])
  return String(next)
}

/** An unknown status matches nothing; the address may hold anything a link put there. */
function matchesStatus(item: ScenarioEntry, status: string, language: string): boolean {
  const locale = item.languages.find(entry => entry.language === language)
  switch (status) {
    case '':
      return true
    case 'ready':
      return item.kind === 'journey' && item.ready
    case 'blocked':
      return item.kind === 'journey' && !item.ready
    case 'active':
      return item.active
    case 'missing':
      return Boolean(language) && !locale
    case 'draft':
      return Boolean(language) && Boolean(locale) && locale?.status !== 'reviewed'
    default:
      return false
  }
}

export function matches(item: ScenarioEntry, filters: ScenarioFilters): boolean {
  const query = filters.q.toLocaleLowerCase()
  return (
    (!filters.kind || item.kind === filters.kind) &&
    (!query || `${item.id} ${item.title}`.toLocaleLowerCase().includes(query)) &&
    matchesStatus(item, filters.status, filters.language)
  )
}

/** The first identity no scenario holds; ids are dense, so a set scan is enough. */
export function suggestId(items: readonly ScenarioEntry[]): string {
  const taken = new Set(items.map(item => item.id))
  for (let index = 1; index <= 999; index++) {
    const candidate = `P${String(index).padStart(3, '0')}`
    if (!taken.has(candidate)) return candidate
  }
  return ''
}
