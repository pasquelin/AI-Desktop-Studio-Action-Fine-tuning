import { api } from '../api.ts'
import { ContentPanel } from '../components/layout.tsx'
import { Empty, Notice } from '../components/primitives.tsx'
import { ReportHeading } from '../components/report-heading.tsx'
import { Section } from '../components/section.tsx'
import { TrainingMetrics } from '../components/training-metrics.tsx'
import { useResource } from '../hooks/use-resource.ts'

interface TrainingReport {
  status: string
  error?: string
  reportPath?: string
}
const load = (signal: AbortSignal) =>
  api<TrainingReport[]>('/api/training/reports', 'GET', undefined, signal)
export function TrainingReports() {
  const { data, error } = useResource(load)
  return (
    <>
      <ReportHeading title="Rapports d’entraînement" mode="training" />
      <Notice error>{error}</Notice>
      <ContentPanel>
        {!data?.length && (
          <Empty>{data ? 'Aucun entraînement enregistré.' : 'Chargement des rapports…'}</Empty>
        )}
        {data?.map((report, index) => (
          <Section
            key={report.reportPath ?? index}
            title={
              report.status === 'failed'
                ? 'Entraînement en échec'
                : 'Entraînement terminé · évaluation requise'
            }
            collapsible
          >
            <Notice error>{report.error}</Notice>
            <p>{report.reportPath}</p>
            <TrainingMetrics />
          </Section>
        ))}
      </ContentPanel>
    </>
  )
}
