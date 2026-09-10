import { useEffect, useRef } from 'react'
import type { DeclarativeScenario } from '../../scenarios/declarative.ts'
import { JsonEditor } from '../components/json-editor.tsx'
import { Button, Field } from '../components/primitives.tsx'
import { Section } from '../components/section.tsx'
import { parseStructuredJson } from '../json-validation.ts'

type Step = DeclarativeScenario['steps'][number]
export type StepDraft = Omit<Step, 'input' | 'assertions'> & {
  key: string
  input: string
  assertions: string
}
export function draftSteps(steps: Step[]): StepDraft[] {
  return steps.map(step => ({
    ...step,
    key: crypto.randomUUID(),
    input: JSON.stringify(step.input, null, 2),
    assertions: JSON.stringify(step.assertions, null, 2),
  }))
}
export function materializeSteps(steps: StepDraft[]): Step[] {
  return steps.map(({ key: _key, ...step }) => ({
    ...step,
    input: parseStructuredJson(step.input, 'input') as Step['input'],
    assertions: parseStructuredJson(step.assertions, 'assertions') as Step['assertions'],
  }))
}
export function StepFields({
  step,
  index,
  selected,
  disabled,
  onChange,
  onRemove,
  onUp,
}: {
  step: StepDraft
  index: number
  selected: boolean
  disabled: boolean
  onChange: (step: StepDraft) => void
  onRemove: () => void
  onUp: () => void
}) {
  const target = useRef<HTMLElement>(null)
  useEffect(() => {
    if (selected) target.current?.scrollIntoView?.({ block: 'center' })
  }, [selected])
  return (
    <Section ref={target} inset>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="card-title text-sm flex-1">
          Étape {index + 1} · {step.id}
          {selected && ' · Étape du rapport'}
        </h3>
        <Button disabled={index === 0} onClick={onUp}>
          Monter
        </Button>
        <Button onClick={onRemove}>Supprimer</Button>
      </div>
      <Field
        label="Identifiant de l’étape"
        value={step.id}
        onChange={e => onChange({ ...step, id: e.target.value })}
      />
      <Field
        label="Action Studio"
        value={step.action}
        onChange={e => onChange({ ...step, action: e.target.value })}
      />
      <JsonEditor
        label="Paramètres de l’action"
        kind="input"
        disabled={disabled}
        value={step.input}
        onChange={input => onChange({ ...step, input })}
      />
      <Field
        label="Nom du résultat réutilisable (facultatif)"
        value={step.saveAs ?? ''}
        onChange={e => {
          const next = { ...step }
          if (e.target.value) next.saveAs = e.target.value
          else delete next.saveAs
          onChange(next)
        }}
      />
      <JsonEditor
        label="Vérifications attendues"
        kind="assertions"
        disabled={disabled}
        value={step.assertions}
        onChange={assertions => onChange({ ...step, assertions })}
      />
      <Field
        label="Refus attendu contenant ce texte (facultatif)"
        value={step.expectRefusal?.includes ?? ''}
        onChange={e => {
          const next = { ...step }
          if (e.target.value) next.expectRefusal = { includes: e.target.value }
          else delete next.expectRefusal
          onChange(next)
        }}
      />
    </Section>
  )
}
