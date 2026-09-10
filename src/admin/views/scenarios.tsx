import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../api.ts'
import { FilterBar } from '../components/filter-bar.tsx'
import { languageOptions } from '../components/language.tsx'
import { Columns, PageHeading, Panel, Stack } from '../components/layout.tsx'
import { LoadingSkeleton } from '../components/loading-skeleton.tsx'
import { Button, Empty, Field, Link, Notice, Select } from '../components/primitives.tsx'
import { qaStatusOptions, ScenarioQaStatus } from '../components/scenario-qa-status.tsx'
import { useDebouncedEffect } from '../hooks/use-debounced-effect.ts'
import { useResource } from '../hooks/use-resource.ts'
import { useSaveAction } from '../hooks/use-save-action.ts'
import { useScenarioCatalogue } from '../hooks/use-scenario-catalogue.ts'
import { useWideLayout } from '../hooks/use-wide-layout.ts'
import type { ScenarioEntry } from '../scenario-repository.ts'
import { ScenarioEditor } from './scenario-editor.tsx'
import {
  filterQuery,
  matches,
  readFilters,
  type ScenarioFilters,
  suggestId,
} from './scenario-filter.ts'

export function Scenarios({
  params,
  active = true,
}: {
  params: URLSearchParams
  active?: boolean
}) {
  // The address is the single source of truth for the filters; only the search box, which is
  // debounced before it writes back, holds its own text.
  const { q: appliedQuery, kind, language, status } = readFilters(params)
  const [q, setQ] = useState(appliedQuery)
  const [shown, setShown] = useState(100)
  const [updates, setUpdates] = useState<Record<string, ScenarioEntry>>({})
  const { data, error } = useScenarioCatalogue(active)
  const id = params.get('id')
  const all = useMemo(
    () =>
      data
        ? [
            ...data.map(item => {
              const updated = updates[item.id]
              return updated
                ? {
                    ...updated,
                    ...(updated.revision === item.revision && item.qa ? { qa: item.qa } : {}),
                  }
                : item
            }),
            ...Object.values(updates).filter(item => !data.some(source => source.id === item.id)),
          ]
        : [],
    [data, updates],
  )
  const applied = useMemo(
    () => ({ q: appliedQuery, kind, language, status }),
    [appliedQuery, kind, language, status],
  )
  const items = useMemo(() => all.filter(item => matches(item, applied)), [all, applied])
  const suggested = useMemo(() => suggestId(all), [all])
  // The catalogue already carries every entry; only an id outside it needs its own request.
  const known = id ? (all.find(item => item.id === id) ?? updates[id] ?? null) : null
  const detail = useResource(
    useCallback(
      async (signal: AbortSignal) =>
        id && !known
          ? api<ScenarioEntry>(`/api/scenarios/${encodeURIComponent(id)}`, 'GET', undefined, signal)
          : null,
      [id, known],
    ),
  )
  const selected = known ?? (detail.data?.id === id ? detail.data : null)
  const find = useCallback(
    (changed: Partial<ScenarioFilters> = {}) => {
      location.hash = `scenarios?${filterQuery({ q, kind, language, status, ...changed })}`
    },
    [q, kind, language, status],
  )
  const saved = useCallback(
    (entry: ScenarioEntry) => {
      setUpdates(previous => ({ ...previous, [entry.id]: entry }))
      if (!id) location.hash = `scenarios?id=${encodeURIComponent(entry.id)}`
    },
    [id],
  )
  // A change of filter restarts the page count; the three selects are read straight from the
  // address, so they trigger this effect without being read inside it.
  // biome-ignore lint/correctness/useExhaustiveDependencies: kind, language and status are triggers.
  useEffect(() => {
    setQ(appliedQuery)
    setShown(100)
  }, [appliedQuery, kind, language, status])
  useDebouncedEffect(
    useCallback(() => {
      if (active && q !== appliedQuery) find()
    }, [active, q, appliedQuery, find]),
    500,
  )
  const wide = useWideLayout()
  const filters = (
    <ScenarioFilterBar
      values={{ q, kind, language, status }}
      onQuery={setQ}
      onKind={value => find({ kind: value })}
      onLanguage={value => find({ language: value })}
      onStatus={value => find({ status: value })}
    />
  )
  return (
    <>
      <PageHeading title="Scénarios">
        <Link primary href="#scenarios?new=1">
          Nouveau parcours
        </Link>
      </PageHeading>
      <Notice error>{error}</Notice>
      {wide && filters}
      <Columns>
        <Panel title="Catalogue des scénarios">
          <Stack>
            {!wide && filters}
            <p className="text-xs text-muted">
              {data
                ? `${items.length} / ${all.length} éléments · une fiche n’est pas un test exécuté`
                : 'Lecture du catalogue…'}
            </p>
            {!data && !error ? (
              <LoadingSkeleton variant="list" label="Chargement des sources…" />
            ) : (
              <ScenarioList items={items.slice(0, shown)} params={params} selectedId={id} />
            )}
            {data && !items.length && (
              <Empty>
                Aucun scénario pour ces filtres. Sélectionne une langue pour filtrer les
                traductions.
              </Empty>
            )}
            {shown < items.length && (
              <Button onClick={() => setShown(shown + 100)}>Afficher les suivants</Button>
            )}
          </Stack>
        </Panel>
        <Panel title={detailTitle(params, selected)}>
          <Notice error>{detail.error}</Notice>
          <ScenarioDetail
            params={params}
            selected={selected}
            suggested={suggested}
            loaded={Boolean(data)}
            pending={Boolean(id) && !detail.error}
            onSaved={saved}
          />
        </Panel>
      </Columns>
    </>
  )
}

const detailTitle = (params: URLSearchParams, selected: ScenarioEntry | null) =>
  params.has('new')
    ? 'Nouveau parcours'
    : selected
      ? `${selected.id} · ${selected.kind === 'case' ? 'Fiche de conception' : 'Parcours'}`
      : 'Détail du scénario'

function ScenarioFilterBar({
  values,
  onQuery,
  onKind,
  onLanguage,
  onStatus,
}: {
  values: { q: string; kind: string; language: string; status: string }
  onQuery: (value: string) => void
  onKind: (value: string) => void
  onLanguage: (value: string) => void
  onStatus: (value: string) => void
}) {
  return (
    <FilterBar>
      <Field
        label="Rechercher les scénarios"
        placeholder="Demande, identifiant…"
        value={values.q}
        onChange={e => onQuery(e.target.value)}
      />
      <Select
        label="Type de scénario"
        value={values.kind}
        options={[
          ['', 'Tous les types'],
          ['journey', 'Parcours exécutables'],
          ['case', 'Fiches de conception'],
        ]}
        onChange={e => onKind(e.target.value)}
      />
      <Select
        label="Langue"
        value={values.language}
        options={[['', 'Toutes les langues'], ...languageOptions]}
        onChange={e => onLanguage(e.target.value)}
      />
      <Select
        label="État"
        value={values.status}
        options={[
          ['', 'Tous les états'],
          ...qaStatusOptions,
          ['ready', 'Prêt à essayer'],
          ['blocked', 'Prérequis manquants'],
          ['active', 'Activé'],
          ['missing', 'Traduction manquante'],
          ['draft', 'Traduction à relire'],
        ]}
        onChange={e => onStatus(e.target.value)}
      />
    </FilterBar>
  )
}

function ScenarioList({
  items,
  params,
  selectedId,
}: {
  items: ScenarioEntry[]
  params: URLSearchParams
  selectedId: string | null
}) {
  return (
    <ul className="menu w-full gap-2 p-0">
      {items.map(item => {
        const next = new URLSearchParams(params)
        next.delete('new')
        next.set('id', item.id)
        const current = selectedId === item.id
        return (
          <li key={item.id}>
            <a
              className={`grid-flow-row grid-cols-1 items-start ${current ? 'menu-active' : ''}`}
              aria-current={current ? 'true' : undefined}
              href={`#scenarios?${next}`}
            >
              <span className="font-medium">
                <ScenarioQaStatus entry={item} size="xs" /> {item.id} · {item.title}
              </span>
              <span className="text-xs">
                {item.kind === 'case'
                  ? 'Fiche de conception · non exécutable'
                  : `${item.active ? 'Activé' : 'Désactivé'} · ${item.ready ? 'Prêt à essayer' : 'Prérequis à compléter'}`}
              </span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function ScenarioDetail({
  params,
  selected,
  suggested,
  loaded,
  pending,
  onSaved,
}: {
  params: URLSearchParams
  selected: ScenarioEntry | null
  suggested: string
  loaded: boolean
  pending: boolean
  onSaved: (entry: ScenarioEntry) => void
}) {
  if (params.has('new'))
    return (
      loaded && (
        <ScenarioEditor entry={null} suggestedId={suggested} params={params} onSaved={onSaved} />
      )
    )
  if (selected)
    return selected.kind === 'case' ? (
      <Specification key={selected.id} entry={selected} onSaved={onSaved} />
    ) : (
      <ScenarioEditor
        key={selected.id}
        entry={selected}
        suggestedId={suggested}
        params={params}
        onSaved={onSaved}
      />
    )
  if (pending) return <LoadingSkeleton variant="detail" label="Chargement du scénario…" />
  return (
    <Empty>
      Choisis un scénario pour comprendre sa demande, corriger ses étapes ou consulter ses
      traductions.
    </Empty>
  )
}

function Specification({
  entry,
  onSaved,
}: {
  entry: ScenarioEntry
  onSaved: (entry: ScenarioEntry) => void
}) {
  const [text, setText] = useState(entry.title)
  const [notice, setNotice] = useState('')
  const { busy, error, run } = useSaveAction()
  const save = () =>
    run(async () => {
      onSaved(
        await api<ScenarioEntry>(
          `/api/scenarios/${encodeURIComponent(entry.id)}/specification`,
          'PUT',
          { expectedRevision: entry.revision, specification: text },
        ),
      )
      setNotice('Fiche enregistrée dans sa source. Aucune preuve d’entraînement approuvée.')
    })
  return (
    <Stack>
      <Notice error>{error}</Notice>
      <Notice>{notice}</Notice>
      <ScenarioQaStatus entry={entry} />
      <Field
        label="Instruction de conception"
        multiline
        rows={6}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <p className="text-muted">
        Cette fiche prépare le test. Elle ne contient pas encore les étapes et contrôles exécutables
        d’un parcours.
      </p>
      <Button primary disabled={busy} onClick={() => void save()}>
        Enregistrer la fiche
      </Button>
      <p className="text-xs text-muted">Source : {entry.source}</p>
    </Stack>
  )
}
