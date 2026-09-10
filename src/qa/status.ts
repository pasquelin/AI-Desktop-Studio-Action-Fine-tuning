/**
 * The QA verdict vocabulary, with no runtime dependency: the observer and the browser bundle both
 * read it, and the type is derived from the labels so a new verdict cannot be half-declared.
 */
export const QA_STATUS_LABELS = {
  'not-tested': 'Non testé en QA',
  passed: 'Validé QA',
  failed: 'Échec QA',
  blocked: 'Bloqué en QA',
  stale: 'Validation QA périmée',
} as const
export type QaStatus = keyof typeof QA_STATUS_LABELS
