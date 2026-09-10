import { record } from '../json.ts'

interface QaIndex {
  statusFor(id: string, scenarioHash: string): { status: string; reason?: string }
}
/** Selection aid only: QA eligibility never replaces content review or execution evidence. */
export function selectQaEligibleExamples(bundle: unknown, index: QaIndex) {
  if (!record(bundle) || !Array.isArray(bundle.examples)) throw new Error('Invalid examples')
  const included: unknown[] = []
  const excluded: { scenarioId: string; reason: string }[] = []
  for (const example of bundle.examples) {
    if (
      !record(example) ||
      typeof example.scenarioId !== 'string' ||
      typeof example.scenarioHash !== 'string'
    )
      throw new Error('Missing scenario identity for QA validation')
    const result = index.statusFor(example.scenarioId, example.scenarioHash)
    if (result.status === 'passed') included.push(example)
    else excluded.push({ scenarioId: example.scenarioId, reason: result.reason ?? result.status })
  }
  return { included, excluded }
}
/** Explicit export bundles must never silently drop unvalidated examples. */
export function assertQaEligibleExamples(bundle: unknown, index: QaIndex): void {
  const { included, excluded } = selectQaEligibleExamples(bundle, index)
  if (excluded.length)
    throw new Error(
      `QA validation required: ${excluded.length} example(s) excluded; ${excluded[0]?.scenarioId}: ${excluded[0]?.reason}`,
    )
  if (!included.length) throw new Error('No QA-validated example available for training')
}
