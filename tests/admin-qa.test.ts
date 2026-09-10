// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { Qa } from '../src/admin/views/qa.tsx'

vi.mock('../src/admin/views/live.tsx', () => ({
  Monitoring: () => createElement('div', null, 'Aperçu partagé'),
}))
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
beforeEach(() => {
  localStorage.clear()
  window.history.replaceState(null, '', '/#qa')
})
const ready = {
  status: 'idle',
  vm: { status: 'ready' },
  provider: { status: 'ready', models: ['local-tools'] },
  steps: [],
}
it('blocks QA when the local provider is unavailable and links to installation', async () => {
  const fetcher = vi.fn().mockResolvedValue(
    new Response(
      JSON.stringify({
        ...ready,
        provider: { status: 'unavailable', models: [], error: 'Ollama absent' },
      }),
    ),
  )
  vi.stubGlobal('fetch', fetcher)
  render(createElement(Qa, { params: new URLSearchParams() }))
  await screen.findByText('Ollama absent')
  expect((screen.getByRole('button', { name: 'Lancer la QA' }) as HTMLButtonElement).disabled).toBe(
    true,
  )
  expect(screen.getByRole('link', { name: 'Télécharger Ollama' }).getAttribute('href')).toBe(
    'https://ollama.com/download',
  )
  expect(fetcher.mock.calls.every(call => call[1].method === 'GET')).toBe(true)
})
it('requires an installed model and explicitly launches the selected scenario, then allows stop', async () => {
  let running = false
  const fetcher = vi.fn(async (_url: string, options: RequestInit) => {
    if (_url.startsWith('/api/scenarios?'))
      return new Response(
        JSON.stringify({
          total: 1,
          items: [{ id: 'P003', title: 'Fermer et rouvrir', kind: 'journey', ready: true }],
        }),
      )
    if (options.method === 'POST') running = !running
    return new Response(JSON.stringify({ ...ready, status: running ? 'running' : 'idle' }))
  })
  vi.stubGlobal('fetch', fetcher)
  render(createElement(Qa, { params: new URLSearchParams('scenario=P003') }))
  await screen.findByRole('option', { name: 'P003 · Fermer et rouvrir' })
  await screen.findByRole('option', { name: 'local-tools' })
  expect((screen.getByRole('button', { name: 'Lancer la QA' }) as HTMLButtonElement).disabled).toBe(
    true,
  )
  fireEvent.change(screen.getByLabelText('Modèle'), { target: { value: 'local-tools' } })
  fireEvent.click(screen.getByRole('button', { name: 'Lancer la QA' }))
  await screen.findByRole('button', { name: 'Arrêter après ce scénario' })
  const launch = fetcher.mock.calls.find(call => call[1].method === 'POST')
  expect(JSON.parse(String(launch?.[1].body))).toEqual({
    model: 'local-tools',
    selection: 'single',
    scenarioId: 'P003',
    stopOnFailure: false,
  })
  fireEvent.click(screen.getByRole('button', { name: 'Arrêter après ce scénario' }))
  await waitFor(() =>
    expect(fetcher.mock.calls.some(call => call[0] === '/api/qa/stop')).toBe(true),
  )
})
it('refuses a launch when the VM is not ready even with an installed model', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify({ ...ready, vm: { status: 'starting' } }))),
  )
  render(createElement(Qa, { params: new URLSearchParams() }))
  await screen.findByRole('option', { name: 'local-tools' })
  fireEvent.change(screen.getByLabelText('Modèle'), { target: { value: 'local-tools' } })
  expect((screen.getByRole('button', { name: 'Lancer la QA' }) as HTMLButtonElement).disabled).toBe(
    true,
  )
})

it('remembers the explicitly selected model across navigation and reload', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify(ready))),
  )
  const page = render(createElement(Qa, { params: new URLSearchParams() }))
  await screen.findByRole('option', { name: 'local-tools' })
  fireEvent.change(screen.getByLabelText('Modèle'), { target: { value: 'local-tools' } })
  expect(localStorage.getItem('studio-ft.qa.local-model')).toBe('local-tools')
  page.unmount()
  render(createElement(Qa, { params: new URLSearchParams() }))
  expect((screen.getByLabelText('Modèle') as HTMLSelectElement).value).toBe('local-tools')
  await waitFor(() =>
    expect(
      (screen.getByRole('button', { name: 'Lancer la QA' }) as HTMLButtonElement).disabled,
    ).toBe(false),
  )
})
it('retains a missing saved model during loading and refuses launching it after discovery', async () => {
  localStorage.setItem('studio-ft.qa.local-model', 'removed-model')
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify(ready))),
  )
  render(createElement(Qa, { params: new URLSearchParams() }))
  expect((screen.getByLabelText('Modèle') as HTMLSelectElement).value).toBe('removed-model')
  await screen.findByText(/Le modèle mémorisé n’est plus disponible/)
  expect((screen.getByRole('button', { name: 'Lancer la QA' }) as HTMLButtonElement).disabled).toBe(
    true,
  )
  expect(localStorage.getItem('studio-ft.qa.local-model')).toBe('removed-model')
  fireEvent.change(screen.getByLabelText('Modèle'), { target: { value: 'local-tools' } })
  expect((screen.getByRole('button', { name: 'Lancer la QA' }) as HTMLButtonElement).disabled).toBe(
    false,
  )
})
it('still allows selection when browser storage is unavailable', async () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('Unavailable')
  })
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('Unavailable')
  })
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify(ready))),
  )
  try {
    render(createElement(Qa, { params: new URLSearchParams() }))
    await screen.findByRole('option', { name: 'local-tools' })
    fireEvent.change(screen.getByLabelText('Modèle'), { target: { value: 'local-tools' } })
    expect(
      (screen.getByRole('button', { name: 'Lancer la QA' }) as HTMLButtonElement).disabled,
    ).toBe(false)
  } finally {
    vi.restoreAllMocks()
  }
})

it.each(['', 'preferred-local-model'])(
  'shows the actual running model without overwriting saved preference %s',
  async preference => {
    if (preference) localStorage.setItem('studio-ft.qa.local-model', preference)
    const fetcher = vi.fn(
      async (_url: string, _options?: RequestInit) =>
        new Response(
          JSON.stringify({
            ...ready,
            status: 'running',
            model: 'actual-running-model',
            provider: {
              status: 'ready',
              models: ['actual-running-model', 'preferred-local-model'],
            },
          }),
        ),
    )
    vi.stubGlobal('fetch', fetcher)
    render(createElement(Qa, { params: new URLSearchParams() }))
    await screen.findByRole('button', { name: 'Arrêter après ce scénario' })
    const select = screen.getByLabelText('Modèle') as HTMLSelectElement
    expect(select.value).toBe('actual-running-model')
    expect(select.disabled).toBe(true)
    expect(localStorage.getItem('studio-ft.qa.local-model')).toBe(preference || null)
    expect(fetcher.mock.calls.every(([, options]) => options?.method !== 'POST')).toBe(true)
  },
)
