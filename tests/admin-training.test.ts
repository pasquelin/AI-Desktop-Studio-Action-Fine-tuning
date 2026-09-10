// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, expect, it, vi } from 'vitest'
import { TrainingControls } from '../src/admin/components/training-controls.tsx'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
it('requires approved preparation and launches only with its server token', async () => {
  const fetcher = vi.fn(
    async (url: string, options: RequestInit) =>
      new Response(
        JSON.stringify(
          url.endsWith('/prepare')
            ? { eligibleCount: 3, excludedCount: 2, token: 'approved-token' }
            : { status: options.method === 'POST' ? 'running' : 'idle' },
        ),
      ),
  )
  vi.stubGlobal('fetch', fetcher)
  render(createElement(TrainingControls))
  expect(
    (screen.getByRole('button', { name: 'Lancer l’entraînement' }) as HTMLButtonElement).disabled,
  ).toBe(true)
  for (const label of [
    'Fichier des exemples approuvés',
    'Manifeste des scénarios',
    'Dossier des poids du modèle cible',
  ])
    fireEvent.change(screen.getByLabelText(label), { target: { value: '/local/path' } })
  fireEvent.click(screen.getByRole('button', { name: 'Vérifier les exemples' }))
  await screen.findByText('3 exemples admissibles')
  fireEvent.click(screen.getByRole('button', { name: 'Lancer l’entraînement' }))
  await waitFor(() =>
    expect(
      fetcher.mock.calls.some(
        ([url, options]) => url === '/api/training' && options.method === 'POST',
      ),
    ).toBe(true),
  )
  expect(
    JSON.parse(
      String(
        fetcher.mock.calls.find(
          ([url, options]) => url === '/api/training' && options.method === 'POST',
        )?.[1].body,
      ),
    ),
  ).toEqual({ token: 'approved-token' })
})
it('keeps launch disabled after zero admissible examples', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(
      async (url: string) =>
        new Response(
          JSON.stringify(
            url.endsWith('/prepare')
              ? { eligibleCount: 0, excludedCount: 5, token: 'empty' }
              : { status: 'idle' },
          ),
        ),
    ),
  )
  render(createElement(TrainingControls))
  for (const label of [
    'Fichier des exemples approuvés',
    'Manifeste des scénarios',
    'Dossier des poids du modèle cible',
  ])
    fireEvent.change(screen.getByLabelText(label), { target: { value: '/local/path' } })
  fireEvent.click(screen.getByRole('button', { name: 'Vérifier les exemples' }))
  await screen.findByText('Aucun exemple admissible : lancement bloqué.')
  expect(
    (screen.getByRole('button', { name: 'Lancer l’entraînement' }) as HTMLButtonElement).disabled,
  ).toBe(true)
})

it('shows an informational notice when preparation finds no current QA example', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) =>
      url.endsWith('/prepare')
        ? new Response(
            JSON.stringify({
              error: 'Aucun exemple avec QA courante validée',
              code: 'no-eligible-examples',
            }),
            { status: 400 },
          )
        : new Response(JSON.stringify({ status: 'idle' })),
    ),
  )
  render(createElement(TrainingControls))
  for (const label of [
    'Fichier des exemples approuvés',
    'Manifeste des scénarios',
    'Dossier des poids du modèle cible',
  ])
    fireEvent.change(screen.getByLabelText(label), { target: { value: '/local/path' } })
  fireEvent.click(screen.getByRole('button', { name: 'Vérifier les exemples' }))
  const text = await screen.findByText('Aucun exemple avec QA courante validée')
  expect(text.closest('[role="status"]')?.classList.contains('alert-info')).toBe(true)
  expect(screen.queryByRole('alert')).toBeNull()
  expect(
    (screen.getByRole('button', { name: 'Lancer l’entraînement' }) as HTMLButtonElement).disabled,
  ).toBe(true)
})
