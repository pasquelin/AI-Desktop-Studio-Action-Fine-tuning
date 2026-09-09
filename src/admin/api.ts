import { record } from '../json.ts'
import type { ScenarioEntry } from './scenario-repository.ts'
export async function api<T>(
  path: string,
  method = 'GET',
  value?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(path, {
    method,
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    ...(signal ? { signal } : {}),
    ...(value === undefined ? {} : { body: JSON.stringify(value) }),
  })
  const content = await response.text()
  let payload: unknown
  try {
    payload = JSON.parse(content)
  } catch {
    throw new Error(content || `Erreur ${response.status}`)
  }
  if (!response.ok)
    throw new Error(
      typeof payload === 'object' && payload && 'error' in payload
        ? String(payload.error)
        : `Erreur ${response.status}`,
    )
  return payload as T
}
export async function allScenarios(signal?: AbortSignal) {
  const items: ScenarioEntry[] = []
  let total = Infinity
  while (items.length < total) {
    const page = await api<{ total: number; items: ScenarioEntry[] }>(
      `/api/scenarios?offset=${items.length}&limit=500`,
      'GET',
      undefined,
      signal,
    )
    total = page.total
    if (!page.items.length) break
    items.push(...page.items)
  }
  return items
}
export const localeNames: Record<string, string> = {
  fr: 'Français',
  en: 'Anglais',
  de: 'Allemand',
  es: 'Espagnol',
  it: 'Italien',
  pt: 'Portugais',
  ru: 'Russe',
  zh: 'Chinois',
  ja: 'Japonais',
  ko: 'Coréen',
  ar: 'Arabe',
  hi: 'Hindi',
  tr: 'Turc',
  id: 'Indonésien',
  vi: 'Vietnamien',
}
export const date = (value: string) => new Date(value).toLocaleString('fr-FR')
export const message = (error: unknown) => (error instanceof Error ? error.message : String(error))
export const object = (value: unknown): Record<string, unknown> => (record(value) ? value : {})
export const outcomeLabel = (value: string) =>
  ({
    passed: 'Réussi',
    failed: 'Échec',
    running: 'En cours ou interrompu',
    'not-executed': 'Aucun résultat métier',
  })[value] ?? value
