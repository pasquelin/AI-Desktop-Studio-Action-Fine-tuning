import { allScenarios, api, localeNames, outcomeLabel } from '../api.ts'
import { LanguageName } from '../components/language.tsx'
import { ContentPanel, PageHeading, Stack } from '../components/layout.tsx'
import { LoadingSkeleton } from '../components/loading-skeleton.tsx'
import { Link, Notice } from '../components/primitives.tsx'
import { useResource } from '../hooks/use-resource.ts'
import type { RunSummary } from '../run-repository.ts'

async function load(signal: AbortSignal) {
  const [items, runs] = await Promise.all([
    allScenarios(signal),
    api<RunSummary[]>('/api/runs', 'GET', undefined, signal),
  ])
  return { items, runs }
}
export function Overview() {
  const { data, error } = useResource(load)
  return (
    <>
      <PageHeading title="Vue d’ensemble">
        <p className="text-muted">État calculé depuis les fichiers actuels</p>
      </PageHeading>
      <ContentPanel>
        {data ? (
          <OverviewData data={data} />
        ) : error ? (
          <Notice error>{error}</Notice>
        ) : (
          <LoadingSkeleton label="Lecture des sources et des rapports…" />
        )}
      </ContentPanel>
    </>
  )
}
function OverviewData({ data }: { data: Awaited<ReturnType<typeof load>> }) {
  const journeys = data.items.filter(i => i.kind === 'journey')
  const metrics = [
    ['Fiches de conception', data.items.length - journeys.length, data.items.length, 'case'],
    ['Parcours structurés', journeys.length, data.items.length, 'journey'],
    [
      'Prêts à essayer',
      journeys.filter(i => i.ready).length,
      journeys.length,
      'journey&status=ready',
    ],
    ['Activés', journeys.filter(i => i.active).length, journeys.length, 'journey&status=active'],
  ] as const
  return (
    <Stack>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, count, total, query]) => (
          <a key={label} href={`#scenarios?kind=${query}`} className="stats bg-base-100">
            <div className="stat">
              <div className="stat-title">{label}</div>
              <div className="stat-value">{count}</div>
              <div className="stat-desc">
                sur {total}{' '}
                {label === 'Activés' || label === 'Prêts à essayer' ? 'parcours' : 'éléments'}
              </div>
            </div>
          </a>
        ))}
      </div>
      <p className="text-muted">
        Prêt à essayer ne signifie pas validé dans Studio. Activé ne signifie pas approuvé pour
        l’entraînement.
      </p>
      <h2 className="font-semibold">Derniers résultats enregistrés</h2>
      <div className="flex flex-wrap gap-2">
        {['passed', 'failed', 'running', 'not-executed'].map(status => (
          <Link key={status} href={`#reports?status=${status}`}>
            {outcomeLabel(status)} : {data.runs.filter(r => r.outcome === status).length} /{' '}
            {data.runs.length}
          </Link>
        ))}
      </div>
      <h2 className="font-semibold">Couverture des demandes par langue</h2>
      <p className="text-muted">
        Dénominateur : {journeys.length} parcours structurés. Les fiches de conception ne sont pas
        comptées comme conversations traduites. La présence d’un texte ne valide pas sa traduction.
      </p>
      <div className="overflow-auto">
        <table className="table table-sm">
          <thead>
            <tr>
              {['Langue', 'Textes présents', 'À relire', 'Manquants', 'Vérification'].map(label => (
                <th key={label}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(localeNames).map(language => {
              const present = journeys.filter(j =>
                j.languages.some(l => l.language === language),
              ).length
              return (
                <tr key={language}>
                  <td>
                    <LanguageName language={language} />
                  </td>
                  <td>
                    {present} / {journeys.length}
                  </td>
                  <td>
                    <a
                      className="link"
                      href={`#scenarios?kind=journey&language=${language}&status=draft`}
                    >
                      {present}
                    </a>
                  </td>
                  <td>
                    <a
                      className="link"
                      href={`#scenarios?kind=journey&language=${language}&status=missing`}
                    >
                      {journeys.length - present}
                    </a>
                  </td>
                  <td>Qualité non certifiée</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <Notice>
        Aucun indicateur d’apprentissage n’est déduit de ces compteurs. Les preuves métier et les
        conversations relues restent nécessaires avant export.
      </Notice>
    </Stack>
  )
}
