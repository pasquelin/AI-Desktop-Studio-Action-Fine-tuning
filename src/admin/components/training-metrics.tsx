import { Notice } from './primitives.tsx'

/**
 * One wording for the absent-comparison case, wherever a training result is displayed. No run
 * records compared measurements yet — `completed-not-evaluated` is the contract — so this says
 * so plainly instead of plumbing a field nothing writes.
 */
export function TrainingMetrics() {
  return <Notice>Comparaison avant/après indisponible : aucune mesure comparée enregistrée.</Notice>
}
