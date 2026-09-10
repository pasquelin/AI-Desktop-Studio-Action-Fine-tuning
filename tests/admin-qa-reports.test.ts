// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, expect, it, vi } from 'vitest'
import { QaReports } from '../src/admin/views/qa-reports.tsx'
import { Reports } from '../src/admin/views/reports.tsx'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
it('reads each scenario own report instead of the last shared VM report', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(
      async (url: string) =>
        new Response(
          JSON.stringify(
            url === '/api/qa/reports'
              ? [
                  {
                    id: 'campaign',
                    status: 'failed',
                    model: 'local',
                    steps: [
                      {
                        id: 'P003',
                        title: 'Ouverture',
                        status: 'failed',
                        runId: 'vm',
                        report: {
                          steps: [
                            {
                              id: 'open',
                              label: 'Ouvrir le document',
                              status: 'failed',
                              error: 'Erreur propre à P003',
                            },
                          ],
                        },
                      },
                    ],
                  },
                ]
              : {
                  snapshots: [
                    {
                      run: 'vm',
                      file: 'p3.jpg',
                      scenario: 'P003',
                      activity: 'P003 · ouverture',
                      capturedAt: '2026-09-10T08:00:00Z',
                    },
                    {
                      run: 'vm',
                      file: 'p4.jpg',
                      scenario: 'P004',
                      activity: 'P004 · copie',
                      capturedAt: '2026-09-10T08:01:00Z',
                    },
                  ],
                  report: { steps: [{ label: 'Autre scénario' }] },
                },
          ),
        ),
    ),
  )
  render(
    createElement(QaReports, { params: new URLSearchParams('campaign=campaign&scenario=P003') }),
  )
  await screen.findByText('Erreur propre à P003')
  await screen.findByText('P003 · ouverture')
  expect(screen.queryByText('P004 · copie')).toBeNull()
  expect(screen.queryByText('Autre scénario')).toBeNull()
  expect(screen.getByRole('link', { name: 'Ouvrir cette étape' }).getAttribute('href')).toBe(
    '#scenarios?id=P003&step=open',
  )
})
it('keeps training reports separate from QA reports', async () => {
  const fetcher = vi.fn(async (_url: string) => new Response(JSON.stringify([])))
  vi.stubGlobal('fetch', fetcher)
  render(createElement(Reports, { params: new URLSearchParams('mode=training') }))
  expect(screen.getByRole('heading', { name: 'Rapports d’entraînement' })).toBeTruthy()
  await screen.findByText('Aucun entraînement enregistré.')
  expect(fetcher.mock.calls[0]?.[0]).toBe('/api/training/reports')
})
