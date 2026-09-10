import { useState } from 'react'
import type { DeclarativeScenario } from '../../scenarios/declarative.ts'
import { api, message } from '../api.ts'
import { RunScenario } from '../components/execution-controls.tsx'
import { JsonEditor } from '../components/json-editor.tsx'
import { Stack } from '../components/layout.tsx'
import { Badge, Button, Choice, Notice, Tabs } from '../components/primitives.tsx'
import { ScenarioQaStatus } from '../components/scenario-qa-status.tsx'
import { useSaveAction } from '../hooks/use-save-action.ts'
import { parseStructuredJson } from '../json-validation.ts'
import type { ScenarioEntry } from '../scenario-repository.ts'
import { ScenarioOrigin } from './scenario-origin.tsx'
import { LanguagesTab, RequestTab, StepsTab } from './scenario-tabs.tsx'
import { draftSteps, materializeSteps, type StepDraft } from './step-fields.tsx'

const TABS = ['Demande', 'Étapes', 'Langues', 'JSON']
const emptyPlan = (id: string): DeclarativeScenario => ({
  id,
  request: '',
  requires: ['isolated-vm'],
  blockers: [],
  trainingApproved: false,
  steps: [],
})

export function ScenarioEditor({
  entry,
  suggestedId,
  params,
  onSaved,
}: {
  entry: ScenarioEntry | null
  suggestedId: string
  params: URLSearchParams
  onSaved: (entry: ScenarioEntry) => void
}) {
  const [current, setCurrent] = useState(entry)
  const [plan, setPlan] = useState<DeclarativeScenario>(() =>
    structuredClone(entry?.plan ?? emptyPlan(suggestedId)),
  )
  const [steps, setSteps] = useState<StepDraft[]>(() => draftSteps(plan.steps))
  const [tab, setTab] = useState(params.get('step') ? 'Étapes' : 'Demande')
  const [raw, setRaw] = useState('')
  const [notice, setNotice] = useState('')
  const { busy, error, setError, run } = useSaveAction()
  const origin = params.get('run')
  const materialize = () => ({ ...plan, steps: materializeSteps(steps) })

  /** The JSON tab owns the plan while it is open; leaving it parses the text back. */
  function changeTab(next: string) {
    try {
      if (tab === 'JSON' && next !== 'JSON') {
        const parsed = parseStructuredJson(raw, 'scenario')
        setPlan(parsed)
        setSteps(draftSteps(parsed.steps))
      }
      if (next === 'JSON' && tab !== 'JSON') setRaw(JSON.stringify(materialize(), null, 2))
      setError('')
      setTab(next)
    } catch (failure) {
      setError(message(failure))
    }
  }

  const applySaved = (result: ScenarioEntry) => {
    setCurrent(result)
    if (result.plan) {
      setPlan(structuredClone(result.plan))
      setSteps(draftSteps(result.plan.steps))
      setRaw(JSON.stringify(result.plan, null, 2))
    }
    onSaved(result)
  }

  const save = () =>
    run(async () => {
      setNotice('')
      const content: unknown = tab === 'JSON' ? parseStructuredJson(raw, 'scenario') : materialize()
      applySaved(
        await api<ScenarioEntry>(
          current ? `/api/scenarios/${encodeURIComponent(current.id)}` : '/api/scenarios',
          current ? 'PUT' : 'POST',
          current ? { expectedRevision: current.revision, plan: content } : content,
        ),
      )
      setNotice(
        'Scénario enregistré. Les anciennes preuves restent historiques ; aucune approbation d’entraînement créée.',
      )
    })

  const activate = (active: boolean) =>
    run(async () => {
      if (!current) return
      const result = await api<ScenarioEntry>(
        `/api/scenarios/${encodeURIComponent(current.id)}/activation`,
        'PUT',
        { expectedRevision: current.revision, active },
      )
      setCurrent(result)
      onSaved(result)
      setNotice('Activation enregistrée. Elle ne vaut ni réussite ni approbation d’entraînement.')
    })

  return (
    <Stack>
      {current && (
        <RunScenario id={current.id} enabled={current.active && current.ready && !busy} />
      )}
      <Notice error>{error}</Notice>
      <Notice>{notice}</Notice>
      {current && (
        <div className="flex flex-wrap items-center gap-3">
          <ScenarioQaStatus entry={entry?.revision === current.revision ? entry : current} />
          <Badge status={current.ready ? 'ready' : 'blocked'}>
            {current.ready ? 'Prêt à essayer' : 'Bloqué'}
          </Badge>
          <Choice
            variant="toggle"
            label="Activer ce parcours dans les prochains essais"
            checked={current.active}
            disabled={busy}
            onChange={e => void activate(e.target.checked)}
          />
        </div>
      )}
      {origin && <ScenarioOrigin id={origin} />}
      <Tabs labels={TABS} value={tab} onChange={changeTab} />
      <fieldset disabled={busy} className="min-w-0">
        {tab === 'Demande' && <RequestTab plan={plan} onChange={setPlan} withId={!current} />}
        {tab === 'Étapes' && (
          <StepsTab steps={steps} setSteps={setSteps} busy={busy} selected={params.get('step')} />
        )}
        {tab === 'Langues' && (
          <LanguagesTab
            entry={current}
            onSaved={value => {
              setCurrent(value)
              onSaved(value)
            }}
          />
        )}
        {tab === 'JSON' && (
          <JsonEditor
            label="Format avancé du scénario"
            kind="scenario"
            disabled={busy}
            large
            value={raw}
            onChange={setRaw}
          />
        )}
      </fieldset>
      <div className="card-actions sticky bottom-0 items-center bg-base-200 py-3">
        <Button primary disabled={busy} onClick={() => void save()}>
          {busy ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
        <p className="text-xs text-muted">
          Validation des actions, paramètres et références par le serveur. Aucune exécution
          déclenchée.
        </p>
      </div>
      {current && <p className="text-xs text-muted break-all">Source : {current.source}</p>}
    </Stack>
  )
}
