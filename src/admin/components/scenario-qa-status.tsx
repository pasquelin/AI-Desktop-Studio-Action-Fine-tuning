import { QA_STATUS_LABELS } from '../../qa/status.ts'
import type { ScenarioEntry } from '../scenario-repository.ts'
import { Badge } from './primitives.tsx'
/** The status filter reads `qa-<verdict>`, so the option values stay derived from the vocabulary. */
export const qaStatusOptions: [string, string][] = Object.entries(QA_STATUS_LABELS).map(
  ([status, label]) => [`qa-${status}`, label],
)
export function ScenarioQaStatus({
  entry,
  size = 'xl',
}: {
  entry: ScenarioEntry
  size?: 'xs' | 'xl'
}) {
  const status = entry.qa?.status
  if (!status) return null
  const label = QA_STATUS_LABELS[status] ?? 'État QA inconnu'
  return (
    <Badge
      size={size}
      className={size === 'xs' ? 'mr-2' : undefined}
      status={status === 'stale' ? 'draft' : status}
      title={
        entry.qa?.reason ?? 'La validation QA ne constitue pas une approbation d’entraînement.'
      }
    >
      {label}
    </Badge>
  )
}
