/**
 * Why a scenario step failed, named once. The cause is decided where the failure happens and
 * travels with it; every boundary between the guest and the interface turns an Error into text,
 * and text is not something a later reader can classify without guessing at its wording.
 *
 * Shipped to the guest beside the runner, so both sides name the same causes.
 */
export const QA_FAILURE_CAUSES = {
  proposal: 'le modèle a proposé une action ou des paramètres non acceptés par le scénario.',
  refusal: 'Studio a refusé l’action demandée.',
  timeout: 'le délai d’attente a été dépassé avant la fin de l’opération.',
  assertion: 'le résultat obtenu ne correspond pas au résultat attendu.',
} as const
export type QaFailureCode = keyof typeof QA_FAILURE_CAUSES

/** A failure that names its own cause, so no reader has to recognise it from its message. */
export class ScenarioFailure extends Error {
  readonly code: QaFailureCode
  constructor(code: QaFailureCode, message: string) {
    super(message)
    this.name = 'ScenarioFailure'
    this.code = code
  }
}

/** One spelling of « is this one of our causes », for everyone who has to ask. */
export function isFailureCode(value: unknown): value is QaFailureCode {
  return typeof value === 'string' && value in QA_FAILURE_CAUSES
}
/** Reads the cause an error declares. An error that declares none simply has no known cause. */
export function failureCode(error: unknown): QaFailureCode | undefined {
  const code: unknown = (error as { code?: unknown } | null)?.code
  return isFailureCode(code) ? code : undefined
}
