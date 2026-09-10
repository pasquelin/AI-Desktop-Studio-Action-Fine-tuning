import { allScenarios } from '../api.ts'
import { useResource } from '../hooks/use-resource.ts'
import { Notice, Select } from './primitives.tsx'

const journeys = (signal: AbortSignal) => allScenarios(signal, 'kind=journey')
export function QaScenarioSelect({
  value,
  disabled,
  onChange,
}: {
  value: string
  disabled: boolean
  onChange: (value: string) => void
}) {
  const { data, error } = useResource(journeys)
  return (
    <div>
      <Select
        label="Parcours à tester"
        value={value}
        disabled={disabled || !data}
        onChange={event => onChange(event.target.value)}
        options={[
          ['', data ? 'Choisir un parcours' : 'Chargement des parcours…'],
          ...(data ?? []).map(
            item =>
              [
                item.id,
                `${item.id} · ${item.title}${item.ready ? '' : ' · Prérequis manquants'}`,
              ] as [string, string],
          ),
        ]}
      />
      <Notice error>{error}</Notice>
    </div>
  )
}
