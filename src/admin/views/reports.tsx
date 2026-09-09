import { useCallback, useState } from 'react'
import { isJourneyId } from '../../scenarios/identity.ts'
import { api, date, object, outcomeLabel } from '../api.ts'
import { Captures } from '../components/captures.tsx'
import { Columns, PageHeading, Panel, Stack } from '../components/layout.tsx'
import { LoadingSkeleton } from '../components/loading-skeleton.tsx'
import {
  Badge,
  Button,
  Code,
  Empty,
  Inspect,
  Link,
  Notice,
  Tabs,
} from '../components/primitives.tsx'
import { useResource } from '../hooks/use-resource.ts'
import { type LogChunk, LogStream } from '../log-stream.ts'
import type { RunRepository, RunSummary } from '../run-repository.ts'

type RunDetail = Awaited<ReturnType<RunRepository['detail']>>
const load = (signal: AbortSignal) => api<RunSummary[]>('/api/runs', 'GET', undefined, signal)
export function Reports({ params }: { params: URLSearchParams }) {
  const { data: runs, error } = useResource(load)
  const id = params.get('id')
  const detail = useResource(
    useCallback(
      (signal: AbortSignal) =>
        id
          ? api<RunDetail>(`/api/runs/${encodeURIComponent(id)}`, 'GET', undefined, signal)
          : Promise.resolve(null),
      [id],
    ),
  )
  const visible =
    runs?.filter(run => !params.get('status') || run.outcome === params.get('status')) ?? []
  return (
    <>
      <PageHeading title="Rapports des traitements">
        <p className="text-muted">
          {visible.length} / {runs?.length ?? 0} essais
        </p>
        <Link href="#reports">Tous les rapports</Link>
      </PageHeading>
      <Notice error>{error}</Notice>
      <Columns>
        <Panel title="Liste des rapports">
          <ul className="menu w-full gap-2 p-0">
            {visible.map(run => (
              <li key={run.id}>
                <a
                  href={`#reports?id=${encodeURIComponent(run.id)}`}
                  aria-current={id === run.id ? 'true' : undefined}
                  className={`grid-flow-row grid-cols-1 items-start ${id === run.id ? 'menu-active' : ''}`}
                >
                  <span>
                    {run.scenario ?? 'Préparation'} · {date(run.createdAt)}
                  </span>
                  <span className="text-xs">
                    {outcomeLabel(run.outcome)} · {run.passed} réussies · {run.failed} en échec ·{' '}
                    {run.blocked} bloquées
                  </span>
                  {run.issue && <span>{run.issue}</span>}
                </a>
              </li>
            ))}
          </ul>
          {!runs && !error && <LoadingSkeleton variant="list" label="Chargement des rapports…" />}
          {runs && !visible.length && <Empty>Aucun essai enregistré pour ce filtre.</Empty>}
        </Panel>
        <Panel title={detail.data?.scenario ?? 'Rapport détaillé'}>
          <Notice error>{detail.error}</Notice>
          {detail.data ? (
            <Report key={detail.data.id} run={detail.data} />
          ) : id ? (
            !detail.error && <LoadingSkeleton variant="detail" label="Chargement du rapport…" />
          ) : (
            <Empty>Choisis un essai pour consulter ses actions, résultats et preuves.</Empty>
          )}
        </Panel>
      </Columns>
    </>
  )
}
function Report({ run }: { run: RunDetail }) {
  const [tab, setTab] = useState('Étapes')
  const report = object(run.report),
    plan = object(run.plan)
  function download() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(run, null, 2)], { type: 'application/json' }),
    )
    const a = document.createElement('a')
    a.href = url
    a.download = `rapport-${run.scenario ?? 'essai'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <Stack>
      <Badge error={run.outcome === 'failed'}>{outcomeLabel(run.outcome)}</Badge>
      <p>
        {date(run.createdAt)} ·{' '}
        {run.modelUsed === false
          ? 'Actions de référence · aucun modèle utilisé'
          : run.modelUsed
            ? 'Exécution avec modèle'
            : 'Utilisation d’un modèle non enregistrée'}
      </p>
      <p className="text-xs text-muted">
        État de la VM : {run.lifecycle}. Cet état ne remplace pas le résultat métier.
      </p>
      {run.sourceMatches === false && (
        <Notice>
          Le scénario a été modifié depuis cet essai. Ce rapport conserve sa version historique ;
          l’éditeur ouvrira la version actuelle.
        </Notice>
      )}
      {typeof plan.request === 'string' && (
        <>
          <h3 className="font-semibold">Demande prévue</h3>
          <p>{plan.request}</p>
        </>
      )}
      {!!report.preparationError && <Notice error>{String(report.preparationError)}</Notice>}
      <Tabs labels={['Étapes', 'Captures', 'Preuves', 'Logs']} value={tab} onChange={setTab} />
      {tab === 'Étapes' && <ReportSteps run={run} />}
      {tab === 'Captures' && <Captures items={run.snapshots} />}
      {tab === 'Preuves' && (
        <Stack>
          <Inspect label="Version Studio et empreintes" value={run.provenance} />
          <Inspect label="Démarrage de Studio" value={run.startup} />
          <Inspect label="Construction" value={run.build} />
          <Inspect label="Conversation et preuve associée" value={report.conversationEvidence} />
          <Notice>
            Un essai réussi n’autorise pas l’entraînement. L’export vérifie aussi la fraîcheur et la
            relecture sémantique des conversations.
          </Notice>
        </Stack>
      )}
      {tab === 'Logs' && <ReportLogs id={run.id} />}
      <Button onClick={download}>Télécharger ce rapport JSON</Button>
    </Stack>
  )
}
function ReportSteps({ run }: { run: RunDetail }) {
  const report = object(run.report),
    plan = object(run.plan)
  const steps = Array.isArray(report.steps) ? report.steps.map(object) : []
  const planned = Array.isArray(plan.steps) ? plan.steps.map(object) : []
  const observations = Array.isArray(report.observations) ? report.observations.map(object) : []
  const scenario =
    typeof plan.id === 'string'
      ? plan.id
      : run.scenario && isJourneyId(run.scenario)
        ? run.scenario
        : null
  return (
    <Stack>
      {!steps.length && (
        <Empty>Aucune étape métier enregistrée. Consulte le démarrage et les journaux.</Empty>
      )}
      {steps.map(step => {
        const authored = planned.find(s => s.id === step.id),
          observed = observations.filter(o => o.stepId === step.id)
        return (
          <article key={String(step.id)} className="card bg-base-100">
            <div className="card-body p-3">
              <h3 className="card-title text-sm">{String(step.label ?? step.id)}</h3>
              <Badge error={step.status === 'failed'}>
                {step.status === 'passed'
                  ? 'Réussie'
                  : step.status === 'blocked'
                    ? 'Bloquée'
                    : 'Échec'}
              </Badge>
              {authored && (
                <>
                  <Inspect
                    label={`Action prévue · ${String(authored.action)}`}
                    value={authored.input}
                  />
                  <Inspect label="Contrôles attendus" value={authored.assertions} />
                </>
              )}
              {observed.length > 0 && (
                <Inspect label="Appels et résultats enregistrés" value={observed} />
              )}
              {!!step.error && <Code value={String(step.error)} />}
              {(step.status === 'failed' || step.status === 'blocked') && (
                <>
                  {scenario ? (
                    <Link
                      href={`#scenarios?id=${encodeURIComponent(scenario)}&step=${encodeURIComponent(String(step.id))}&run=${encodeURIComponent(run.id)}`}
                    >
                      Ouvrir cette étape dans le scénario
                    </Link>
                  ) : (
                    <p>Ce rapport ancien n’identifie pas un scénario éditable.</p>
                  )}
                  <p className="text-xs text-muted">
                    {step.status === 'blocked'
                      ? 'Étape non exécutée à cause d’un échec précédent.'
                      : 'Cause à diagnostiquer : Studio, scénario, environnement ou proposition du modèle. Modifier un résultat attendu ne corrige pas un bug de l’application.'}
                  </p>
                </>
              )}
            </div>
          </article>
        )
      })}
    </Stack>
  )
}
function ReportLogs({ id }: { id: string }) {
  const { data, error } = useResource(
    useCallback(
      async (signal: AbortSignal) => {
        const stream = new LogStream()
        let text = ''
        while (!signal.aborted) {
          const previous = stream.offset
          const chunk = await api<LogChunk>(
            `/api/runs/${encodeURIComponent(id)}/logs?offset=${stream.offset}`,
            'GET',
            undefined,
            signal,
          )
          text = stream.append(chunk)
          if (chunk.next === previous || !stream.behind(chunk)) break
        }
        return text
      },
      [id],
    ),
  )
  return (
    <>
      <Notice error>{error}</Notice>
      {data === undefined ? (
        !error && <LoadingSkeleton variant="logs" label="Chargement du journal…" />
      ) : (
        <Code value={data || 'Aucun journal disponible.'} />
      )}
    </>
  )
}
