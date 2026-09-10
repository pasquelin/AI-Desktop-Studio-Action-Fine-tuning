import { useCallback } from 'react'
import type { QaState, QaStep } from '../../qa/service.ts'
import { api, object, outcomeLabel } from '../api.ts'
import { Captures } from '../components/captures.tsx'
import { ContentPanel, Stack } from '../components/layout.tsx'
import { Empty, Inspect, Link, Notice } from '../components/primitives.tsx'
import { ReportHeading } from '../components/report-heading.tsx'
import { Section } from '../components/section.tsx'
import { useResource } from '../hooks/use-resource.ts'
import type { RunRepository } from '../run-repository.ts'

const load = (signal: AbortSignal) => api<QaState[]>('/api/qa/reports', 'GET', undefined, signal)
export function QaReports({ params }: { params: URLSearchParams }) {
  const { data, error } = useResource(load)
  return (
    <>
      <ReportHeading title="Rapports Debug / QA" mode="debug" />
      <Notice error>{error}</Notice>
      <ContentPanel>
        {!data?.length && (
          <Empty>{data ? 'Aucune campagne QA enregistrée.' : 'Chargement des campagnes…'}</Empty>
        )}
        {data?.map(campaign => (
          <Section
            collapsible
            key={campaign.id}
            defaultOpen={params.get('campaign') === campaign.id}
            title={
              <>
                {campaign.model ?? 'Modèle non enregistré'} ·{' '}
                {campaign.steps.filter(step => step.status === 'passed').length}/
                {campaign.steps.length} réussis
              </>
            }
          >
            <Notice error>{campaign.error}</Notice>
            <Stack>
              {campaign.steps.map(step => (
                <Section
                  collapsible
                  inset
                  key={step.id}
                  defaultOpen={params.get('scenario') === step.id}
                  title={
                    <>
                      {step.title || step.id} · {outcomeLabel(step.status)}
                    </>
                  }
                >
                  <QaStepReport step={step} />
                </Section>
              ))}
            </Stack>
          </Section>
        ))}
      </ContentPanel>
    </>
  )
}
function QaStepReport({ step }: { step: QaStep }) {
  const report = object(step.report)
  const steps = Array.isArray(report.steps) ? report.steps.map(object) : []
  return (
    <Stack>
      <Notice error>{step.error}</Notice>
      <Link primary href={`#scenarios?id=${encodeURIComponent(step.id)}`}>
        Modifier le scénario
      </Link>
      {steps.map(item => (
        <Section key={String(item.id)}>
          <h3 className="card-title text-sm">
            {String(item.label ?? item.id)} · {outcomeLabel(String(item.status))}
          </h3>
          <Notice error>{item.error ? String(item.error) : ''}</Notice>
          <Link
            primary
            href={`#scenarios?id=${encodeURIComponent(step.id)}&step=${encodeURIComponent(String(item.id))}`}
          >
            Ouvrir cette étape
          </Link>
        </Section>
      ))}
      <Inspect label="Actions, résultats et preuves de ce scénario" value={step.report} />
      {step.runId && <ScenarioImages runId={step.runId} scenarioId={step.id} />}
    </Stack>
  )
}
function ScenarioImages({ runId, scenarioId }: { runId: string; scenarioId: string }) {
  const { data, error } = useResource(
    useCallback(
      (signal: AbortSignal) =>
        api<Awaited<ReturnType<RunRepository['detail']>>>(
          `/api/runs/${encodeURIComponent(runId)}`,
          'GET',
          undefined,
          signal,
        ),
      [runId],
    ),
  )
  // The capture records which journey owned the attempt; its caption is free to be reworded.
  const matching = data?.snapshots.filter(item => item.scenario === scenarioId) ?? []
  return (
    <>
      <Notice error>{error}</Notice>
      <h3 className="font-semibold">Captures du scénario</h3>
      <Captures items={matching} />
      <p className="text-xs text-muted">
        Les captures sont celles de la dernière session conservée.
      </p>
    </>
  )
}
