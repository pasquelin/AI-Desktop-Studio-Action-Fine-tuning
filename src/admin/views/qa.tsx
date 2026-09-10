import { useState } from 'react'
import { qaDiagnostic } from '../../qa/diagnostic.ts'
import type { QaState as CampaignState } from '../../qa/service.ts'
import { isJourneyId } from '../../scenarios/identity.ts'
import { api, type Failure, failureOf, NO_FAILURE, outcomeLabel } from '../api.ts'
import { FilterBar } from '../components/filter-bar.tsx'
import { PageHeading } from '../components/layout.tsx'
import { Badge, Button, Choice, Link, Notice, Select } from '../components/primitives.tsx'
import { QaScenarioSelect } from '../components/qa-scenario-select.tsx'
import { Section } from '../components/section.tsx'
import { usePolling } from '../hooks/use-polling.ts'
import { Monitoring } from './live.tsx'

interface QaState extends CampaignState {
  vm: { status: 'starting' | 'ready' | 'error' | 'stopped'; error?: string }
  provider: { status: 'ready' | 'unavailable'; models: string[]; error?: string }
}
const labels = {
  idle: 'Prêt à configurer',
  running: 'Recette en cours',
  passed: 'Recette réussie',
  failed: 'Recette en échec',
  cancelled: 'Recette arrêtée',
}

export function Qa({ params }: { params: URLSearchParams }) {
  const scenario = params.get('scenario') ?? ''
  const { state, setState, failure: polled } = useQa()
  const [failure, setFailure] = useState<Failure>(NO_FAILURE)
  const [model, setModel] = useQaModel()
  const [selection, setSelection] = useState(scenario ? 'single' : 'all')
  const [scenarioId, setScenarioId] = useState(scenario)
  const [stopOnFailure, setStopOnFailure] = useState(false)
  const [busy, setBusy] = useState(false)
  const running = state?.status === 'running'
  const displayedModel = running && state.model ? state.model : model
  const ready = qaReady(state, model, selection, scenarioId)
  const shown = failure.message ? failure : polled
  const warning = qaWarning(state, shown) || missingModelMessage(state, model)
  async function send(stop = false) {
    setBusy(true)
    setFailure(NO_FAILURE)
    try {
      await api(
        stop ? '/api/qa/stop' : '/api/qa',
        'POST',
        stop
          ? {}
          : { model, selection, ...(selection === 'single' ? { scenarioId } : {}), stopOnFailure },
      )
      setState(await api<QaState>('/api/qa'))
    } catch (cause) {
      setFailure(failureOf(cause))
    } finally {
      setBusy(false)
    }
  }
  return (
    <>
      <QaHeading
        state={state}
        warning={warning}
        busy={busy}
        running={running}
        ready={Boolean(ready)}
        send={send}
      />
      <FilterBar label="Configuration Debug / QA" medium>
        <Select
          label="Modèle"
          value={displayedModel}
          disabled={running || busy}
          onChange={event => setModel(event.target.value)}
          options={[
            ['', 'Choisir un modèle installé'],
            ...retainedModelOption(state, displayedModel),
            ...(state?.provider.models ?? []).map(value => [value, value] as [string, string]),
          ]}
        />
        <Select
          label="Scénarios à tester"
          value={selection}
          disabled={running || busy}
          onChange={event => setSelection(event.target.value)}
          options={[
            ['all', 'Tous les scénarios'],
            ['active', 'Parcours activés'],
            ['smoke', 'Recette courte'],
            ['single', 'Un parcours précis'],
          ]}
        />
        {selection === 'single' ? (
          <QaScenarioSelect
            value={scenarioId}
            disabled={running || busy}
            onChange={setScenarioId}
          />
        ) : null}
        <Choice
          label="Arrêter au premier échec"
          checked={stopOnFailure}
          disabled={running || busy}
          onChange={event => setStopOnFailure(event.target.checked)}
        />
      </FilterBar>
      <CampaignSteps state={state} />
      <Monitoring connectionUnavailable={shown.code === 'offline'} />
    </>
  )
}

function qaWarning(state: QaState | null, failure: Failure) {
  return (
    failure.message ||
    state?.error ||
    state?.vm.error ||
    state?.provider.error ||
    (state && state.vm.status !== 'ready'
      ? 'La VM doit être prête avant le lancement.'
      : state?.provider.status === 'unavailable'
        ? 'Ollama est indisponible. Installe ou démarre Ollama sur cette machine.'
        : state?.provider.models.length === 0
          ? 'Aucun modèle local disponible. Installe un modèle dans Ollama.'
          : '')
  )
}

function CampaignSteps({ state }: { state: QaState | null }) {
  if (!state?.steps.length) return null
  return (
    <Section
      collapsible
      title={
        <>
          Bilan des scénarios · {state.steps.filter(step => step.status === 'passed').length}/
          {state.steps.length} réussis
        </>
      }
    >
      <div className="max-h-48 overflow-auto">
        <ul className="list">
          {state.steps.map(step => (
            <li
              key={step.id}
              className="list-row grid-cols-1 items-start md:grid-cols-[minmax(0,1fr)_auto]"
            >
              <div className="min-w-0 space-y-2">
                <div className="flex items-start gap-3">
                  <Badge className="shrink-0" status={step.status}>
                    {/* A live campaign knows a running step is not an interrupted one. */}
                    {step.status === 'running' ? 'En cours' : outcomeLabel(step.status)}
                  </Badge>
                  <span className="line-clamp-2 min-w-0 flex-1 break-words">
                    {step.title || step.id}
                  </span>
                </div>
                {step.error && (
                  <p className="line-clamp-2 break-words text-sm text-muted">
                    {qaDiagnostic(step)}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link primary href={`#scenarios?id=${encodeURIComponent(step.id)}`}>
                  Ouvrir le scénario
                </Link>
                {step.runId && (
                  <Link
                    primary
                    href={`#reports?mode=debug&campaign=${encodeURIComponent(state.id ?? '')}&scenario=${encodeURIComponent(step.id)}`}
                  >
                    Rapport de cet essai
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

function useQa() {
  const { data, setData, failure } = usePolling<QaState>('/api/qa', 1000, 'reset')
  return { state: data, setState: setData, failure }
}

function qaReady(state: QaState | null, model: string, selection: string, scenarioId: string) {
  return (
    state?.vm.status === 'ready' &&
    state.provider.status === 'ready' &&
    state.provider.models.includes(model) &&
    (selection !== 'single' || isJourneyId(scenarioId))
  )
}

function QaHeading({
  state,
  warning,
  busy,
  running,
  ready,
  send,
}: {
  state: QaState | null
  warning: string
  busy: boolean
  running: boolean
  ready: boolean
  send: (stop?: boolean) => Promise<void>
}) {
  return (
    <PageHeading
      title="Debug / QA"
      alert={
        warning ? (
          <Notice error={state?.status === 'failed'} warning={state?.status !== 'failed'}>
            {warning}
            {state?.provider.status === 'unavailable' && (
              <a
                className="link link-primary ml-2"
                href="https://ollama.com/download"
                target="_blank"
                rel="noreferrer"
              >
                Télécharger Ollama
              </a>
            )}
          </Notice>
        ) : undefined
      }
    >
      <Badge status={state?.status ?? 'starting'}>
        {state ? labels[state.status] : 'Connexion…'}
      </Badge>
      <Button primary disabled={busy || (!running && !ready)} onClick={() => void send(running)}>
        {running ? 'Arrêter après ce scénario' : busy ? 'Lancement…' : 'Lancer la QA'}
      </Button>
    </PageHeading>
  )
}

const QA_MODEL_KEY = 'studio-ft.qa.local-model'
function useQaModel() {
  const [model, update] = useState(() => {
    try {
      return localStorage.getItem(QA_MODEL_KEY) ?? ''
    } catch {
      return ''
    }
  })
  function select(value: string) {
    update(value)
    try {
      localStorage.setItem(QA_MODEL_KEY, value)
    } catch {
      /* Storage may be disabled; selection still works for this page. */
    }
  }
  return [model, select] as const
}
function missingModelMessage(state: QaState | null, model: string) {
  return model && state?.provider.status === 'ready' && !state.provider.models.includes(model)
    ? 'Le modèle mémorisé n’est plus disponible. Choisis un modèle installé avant de lancer la QA.'
    : ''
}
function retainedModelOption(state: QaState | null, model: string): [string, string][] {
  if (!model || state?.provider.models.includes(model)) return []
  return [[model, `${model} · ${state ? 'indisponible' : 'vérification…'}`]]
}
