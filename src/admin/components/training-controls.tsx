import { useState } from 'react'
import { api, failureOf, NO_FAILURE } from '../api.ts'
import { usePolling } from '../hooks/use-polling.ts'
import { FilterBar } from './filter-bar.tsx'
import { LIVE_LABEL, PageHeading } from './layout.tsx'
import { Badge, Button, Field, Notice } from './primitives.tsx'
import { Section } from './section.tsx'
import { TrainingMetrics } from './training-metrics.tsx'

interface TrainingState {
  status: 'idle' | 'running' | 'completed-not-evaluated' | 'failed'
  error?: string
  reportPath?: string
}
interface Eligibility {
  eligibleCount: number
  token: string
  excludedCount: number
}
const STATUS_LABELS: Record<TrainingState['status'], string> = {
  idle: 'Non lancé',
  running: 'Entraînement en cours',
  'completed-not-evaluated': 'Calcul terminé · évaluation requise',
  failed: 'Entraînement en échec',
}
function TrainingBadge({ status }: { status: TrainingState['status'] }) {
  return (
    <Badge status={status === 'running' || status === 'failed' ? status : 'idle'}>
      {STATUS_LABELS[status]}
    </Badge>
  )
}
export function TrainingControls() {
  const [bundle, setBundle] = useState('')
  const [manifest, setManifest] = useState('')
  const [model, setModel] = useState('')
  const {
    data: polled,
    setData: setState,
    failure,
    setFailure,
  } = usePolling<TrainingState>('/api/training', 2000, 'keep')
  const [eligibility, setEligibility] = useState<Eligibility | null>(null)
  const [busy, setBusy] = useState(false)
  const state: TrainingState = polled ?? { status: 'idle' }
  const running = state.status === 'running'
  const noEligibleExamples = failure.code === 'no-eligible-examples'
  function change(setter: (value: string) => void, value: string) {
    setter(value)
    setEligibility(null)
  }
  async function prepare() {
    setBusy(true)
    setFailure(NO_FAILURE)
    try {
      const result = await api<Eligibility>('/api/training/prepare', 'POST', {
        bundle,
        manifest,
        model,
      })
      setEligibility(result)
    } catch (cause) {
      setEligibility(null)
      setFailure(failureOf(cause))
    } finally {
      setBusy(false)
    }
  }
  async function launch() {
    setBusy(true)
    setFailure(NO_FAILURE)
    try {
      setState(
        await api<TrainingState>('/api/training', 'POST', {
          token: eligibility?.token,
        }),
      )
    } catch (cause) {
      setFailure(failureOf(cause))
    } finally {
      setBusy(false)
    }
  }
  return (
    <>
      <PageHeading
        title={LIVE_LABEL}
        alert={
          <Notice error={Boolean(state.error || (failure.message && !noEligibleExamples))}>
            {failure.message ||
              state.error ||
              'Seuls les exemples approuvés avec preuves QA à jour sont admissibles. Un jeu de test séparé reste obligatoire.'}
          </Notice>
        }
      >
        <TrainingBadge status={state.status} />
        <Button
          primary
          disabled={busy || running || !eligibility?.eligibleCount}
          onClick={() => void launch()}
        >
          Lancer l’entraînement
        </Button>
      </PageHeading>
      <FilterBar label="Configuration de l’entraînement" medium>
        <Field
          label="Fichier des exemples approuvés"
          value={bundle}
          disabled={busy || running}
          onChange={event => change(setBundle, event.target.value)}
        />
        <Field
          label="Manifeste des scénarios"
          value={manifest}
          disabled={busy || running}
          onChange={event => change(setManifest, event.target.value)}
        />
        <Field
          label="Dossier des poids du modèle cible"
          value={model}
          disabled={busy || running}
          onChange={event => change(setModel, event.target.value)}
        />
        <Button
          primary
          disabled={busy || running || !bundle || !manifest || !model}
          onClick={() => void prepare()}
        >
          Vérifier les exemples
        </Button>
      </FilterBar>
      {eligibility && (
        <Section
          title={`${eligibility.eligibleCount} exemples admissibles`}
          collapsible
          defaultOpen
        >
          {!eligibility.eligibleCount && (
            <Notice>Aucun exemple admissible : lancement bloqué.</Notice>
          )}
          <p>
            {eligibility.excludedCount} exemples exclus. Seul le sous-ensemble admissible préparé
            sera utilisé.
          </p>
        </Section>
      )}
      {state.reportPath && (
        <Section title="Résultat de l’entraînement" collapsible>
          <p>{state.reportPath}</p>
          <TrainingMetrics />
        </Section>
      )}
    </>
  )
}
