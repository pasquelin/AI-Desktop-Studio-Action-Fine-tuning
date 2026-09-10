import { record } from '../json.ts'
import { isFailureCode, QA_FAILURE_CAUSES } from '../scenarios/failure.ts'

interface DiagnosticSource {
  status?: string
  error?: string
  errorCode?: string
  report?: unknown
}
/** The one step a reader cares about; the persisted report always keeps every step. */
export function failedStep(report: unknown): Record<string, unknown> | undefined {
  if (!record(report) || !Array.isArray(report.steps)) return undefined
  return report.steps.find((step: unknown) => record(step) && step.status === 'failed')
}
function location(step: Record<string, unknown> | undefined) {
  if (!step) return ''
  const label = [step.label, step.action, step.id].find(
    value => typeof value === 'string' && value.trim(),
  )
  if (typeof label !== 'string') return ''
  return `À l’étape « ${label.replace(/[\r\n\t]/g, ' ').slice(0, 120)} », `
}
/** The cause is read, never recognised: only the failure itself knew why it happened. */
function cause(...codes: unknown[]): string | undefined {
  for (const code of codes) if (isFailureCode(code)) return QA_FAILURE_CAUSES[code]
  return undefined
}

/**
 * Human summary only. The complete error and observations remain in the original report.
 * A failure that declared no cause is reported as one, rather than guessed at from its wording:
 * a message is written for a person to read, and is free to be reworded.
 */
export function qaDiagnostic(source: DiagnosticSource): string {
  const step = failedStep(source.report)
  const preparation = record(source.report) ? source.report.preparationErrorCode : undefined
  const reason = cause(step?.errorCode, source.errorCode, preparation)
  if (reason) {
    const sentence = `${location(step)}${reason}`
    return `${sentence.charAt(0).toUpperCase()}${sentence.slice(1)} Consulter le rapport pour les détails.`
  }
  if (source.status === 'blocked')
    return 'Ce scénario n’a pas été exécuté. Consulter le rapport pour connaître le prérequis manquant ou la raison de l’arrêt.'
  if (step)
    return `${location(step)}le scénario s’est arrêté. Consulter le rapport pour identifier la cause.`
  return 'Le scénario s’est arrêté sans diagnostic métier précis. Consulter le rapport pour les détails de l’échec.'
}
