import { record } from '../json.ts'
import type { ScenarioEntry } from './scenario-repository.ts'
export const SERVER_UNAVAILABLE =
  'Connexion au serveur interrompue. Les dernières données restent affichées ; la reconnexion est automatique.'

/**
 * A failure the interface may reason about: the code names the case, the message only displays it.
 * Comparing displayed French would tie the behaviour to wording an editor is free to change.
 */
class ApiError extends Error {
  readonly code: string
  constructor(text: string, code = '') {
    super(text)
    this.name = 'ApiError'
    this.code = code
  }
}
export type Failure = { message: string; code: string }
export const NO_FAILURE: Failure = { message: '', code: '' }
export const failureOf = (cause: unknown): Failure => ({
  message: message(cause),
  code: cause instanceof ApiError ? cause.code : '',
})

export async function api<T>(
  path: string,
  method = 'GET',
  value?: unknown,
  signal?: AbortSignal,
): Promise<T> {
  let response: Response
  try {
    response = await fetch(path, {
      method,
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      ...(signal ? { signal } : {}),
      ...(value === undefined ? {} : { body: JSON.stringify(value) }),
    })
  } catch (cause) {
    // The one place that knows the observer is unreachable; every caller reads the code, not the
    // browser's own wording, which differs per engine and per locale.
    if (cause instanceof Error && cause.name === 'AbortError') throw cause
    throw new ApiError(SERVER_UNAVAILABLE, 'offline')
  }
  const content = await response.text()
  let payload: unknown
  try {
    payload = JSON.parse(content)
  } catch {
    throw new ApiError(content || `Erreur ${response.status}`)
  }
  if (!response.ok) {
    const body = object(payload)
    throw new ApiError(
      'error' in body ? String(body.error) : `Erreur ${response.status}`,
      typeof body.code === 'string' ? body.code : '',
    )
  }
  return payload as T
}
const PAGE = 500
/**
 * Fetch the remaining pages together rather than one after another: the server rechecks every
 * source file per request, and concurrent pages collapse into a single check.
 */
export async function allScenarios(signal?: AbortSignal, filter = '') {
  const prefix = `/api/scenarios?${filter}${filter ? '&' : ''}`
  const page = (offset: number) =>
    api<{ total: number; items: ScenarioEntry[] }>(
      `${prefix}offset=${offset}&limit=${PAGE}`,
      'GET',
      undefined,
      signal,
    )
  const first = await page(0)
  if (first.items.length >= first.total) return first.items
  const offsets: number[] = []
  for (let offset = first.items.length; offset < first.total; offset += PAGE) offsets.push(offset)
  const rest = await Promise.all(offsets.map(page))
  return [...first.items, ...rest.flatMap(item => item.items)]
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
/** One label per outcome, so a step reads the same in the campaign view and in its report. */
export const outcomeLabel = (value: string) =>
  ({
    passed: 'Réussi',
    failed: 'Échec',
    blocked: 'Bloqué',
    queued: 'En attente',
    running: 'En cours ou interrompu',
    'not-executed': 'Aucun résultat métier',
  })[value] ?? value
