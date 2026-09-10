import { useState } from 'react'
import type { DeclarativeScenario } from '../../scenarios/declarative.ts'
import { api, localeNames } from '../api.ts'
import { LanguageName } from '../components/language.tsx'
import { Stack } from '../components/layout.tsx'
import { Badge, Button, Field, Notice } from '../components/primitives.tsx'
import { Section } from '../components/section.tsx'
import { useSaveAction } from '../hooks/use-save-action.ts'
import type { ScenarioEntry } from '../scenario-repository.ts'
import { draftSteps, type StepDraft, StepFields } from './step-fields.tsx'

/** One requirement per line; blank lines are how a user clears the list. */
const lines = (value: string) =>
  value
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean)

export function RequestTab({
  plan,
  onChange,
  withId,
}: {
  plan: DeclarativeScenario
  onChange: (plan: DeclarativeScenario) => void
  withId: boolean
}) {
  return (
    <Stack>
      {withId && (
        <Field
          label="Identifiant unique · P suivi de trois chiffres"
          value={plan.id}
          onChange={e => onChange({ ...plan, id: e.target.value })}
        />
      )}
      <Field
        label="Ce que l’utilisateur demande"
        multiline
        rows={4}
        value={plan.request}
        onChange={e => onChange({ ...plan, request: e.target.value })}
      />
      <Field
        label="Environnement nécessaire · une exigence par ligne"
        multiline
        defaultValue={plan.requires.join('\n')}
        onChange={e => onChange({ ...plan, requires: lines(e.target.value) })}
      />
      <Field
        label="Blocages à lever · un par ligne"
        multiline
        defaultValue={plan.blockers.join('\n')}
        onChange={e => onChange({ ...plan, blockers: lines(e.target.value) })}
      />
      <Field
        label="Références à fournir avant exécution"
        multiline
        defaultValue={(plan.requiredBindings ?? []).join('\n')}
        onChange={e => onChange({ ...plan, requiredBindings: lines(e.target.value) })}
      />
      <p className="text-muted">
        Les étapes indiquent les actions de référence que le banc exécutera. Elles ne décrivent pas
        le raisonnement d’un modèle.
      </p>
    </Stack>
  )
}

export function StepsTab({
  steps,
  setSteps,
  busy,
  selected,
}: {
  steps: StepDraft[]
  setSteps: (update: (previous: StepDraft[]) => StepDraft[]) => void
  busy: boolean
  selected: string | null
}) {
  const swapUp = (index: number) => () =>
    setSteps(previous => {
      const next = [...previous]
      const before = next[index - 1]
      const current = next[index]
      if (before && current) {
        next[index - 1] = current
        next[index] = before
      }
      return next
    })
  const add = () =>
    setSteps(previous => [
      ...previous,
      ...draftSteps([{ id: `step-${previous.length + 1}`, action: '', input: {}, assertions: [] }]),
    ])
  return (
    <Stack>
      {selected && !steps.some(step => step.id === selected) && (
        <Notice>
          L’étape du rapport n’existe plus dans cette version. Consulte le rapport historique avant
          de modifier le parcours.
        </Notice>
      )}
      {steps.map((step, index) => (
        <StepFields
          key={step.key}
          step={step}
          index={index}
          disabled={busy}
          selected={step.id === selected}
          onChange={value =>
            setSteps(previous => previous.map((s, i) => (i === index ? value : s)))
          }
          onRemove={() => setSteps(previous => previous.filter((_, i) => i !== index))}
          onUp={swapUp(index)}
        />
      ))}
      <Button onClick={add}>Ajouter une étape</Button>
    </Stack>
  )
}

export function LanguagesTab({
  entry,
  onSaved,
}: {
  entry: ScenarioEntry | null
  onSaved: (entry: ScenarioEntry) => void
}) {
  return (
    <Stack>
      <p className="text-muted">
        La présence du texte ne certifie pas sa qualité. Les traductions restent à relire.
      </p>
      {Object.entries(localeNames).map(([language, name]) => (
        <Translation
          key={language}
          language={language}
          name={name}
          entry={entry}
          onSaved={onSaved}
        />
      ))}
      {!entry && <Notice>Enregistre d’abord le parcours pour ajouter ses traductions.</Notice>}
    </Stack>
  )
}

function Translation({
  language,
  name,
  entry,
  onSaved,
}: {
  language: string
  name: string
  entry: ScenarioEntry | null
  onSaved: (entry: ScenarioEntry) => void
}) {
  const item = entry?.languages.find(locale => locale.language === language)
  const [text, setText] = useState(item?.text ?? '')
  const [notice, setNotice] = useState('')
  const { busy, error, run } = useSaveAction()
  const save = () =>
    run(async () => {
      if (!entry) return
      setNotice('')
      onSaved(
        await api<ScenarioEntry>(`/api/scenarios/${encodeURIComponent(entry.id)}/language`, 'PUT', {
          expectedRevision: entry.revision,
          language,
          text,
        }),
      )
      setNotice('Traduction enregistrée comme brouillon à relire.')
    })
  return (
    <Section inset>
      <h3 className="card-title text-sm">
        <LanguageName language={language} />
      </h3>
      <Badge status={item ? 'draft' : 'missing'}>
        {item ? 'Brouillon · relecture requise' : 'Manquant'}
      </Badge>
      <Field
        label={`Demande en ${name.toLowerCase()}`}
        multiline
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <Notice error>{error}</Notice>
      <Notice>{notice}</Notice>
      {entry && (
        <div className="card-actions">
          <Button disabled={busy} onClick={() => void save()}>
            Enregistrer cette traduction
          </Button>
        </div>
      )}
    </Section>
  )
}
