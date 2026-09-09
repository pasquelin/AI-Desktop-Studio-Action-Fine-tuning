// @vitest-environment jsdom

import { EditorView } from '@codemirror/view'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import type { ScenarioEntry } from '../src/admin/scenario-repository.ts'
import { ScenarioEditor } from '../src/admin/views/scenario-editor.tsx'

// jsdom has no text layout; exercise editor transactions without measuring glyphs.
beforeAll(() => {
  Object.defineProperty(Range.prototype, 'getClientRects', {
    configurable: true,
    value: () => [],
  })
  Object.defineProperty(Range.prototype, 'getBoundingClientRect', {
    configurable: true,
    value: () => new DOMRect(),
  })
})
const entry: ScenarioEntry = {
  id: 'P001',
  kind: 'journey',
  title: 'Créer un cube',
  source: 'source.json',
  revision: 'revision-1',
  scenarioHash: 'hash',
  active: false,
  ready: true,
  missing: [],
  blockers: [],
  languages: [],
  plan: {
    id: 'P001',
    request: 'Créer un cube',
    requires: ['isolated-vm'],
    blockers: [],
    trainingApproved: false,
    steps: [{ id: 'step-1', action: 'createCube', input: {}, assertions: [] }],
  },
}
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
function editJson(label: string, value: string) {
  const view = EditorView.findFromDOM(screen.getByLabelText(label))
  if (!view) throw new Error('Code editor missing')
  act(() =>
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: value },
    }),
  )
}
function mount() {
  render(
    createElement(ScenarioEditor, {
      entry,
      suggestedId: 'P002',
      params: new URLSearchParams(),
      onSaved: vi.fn(),
    }),
  )
}
describe('React scenario editor', () => {
  it('saves nested JSON editor changes with the current revision and unchanged surrounding contract', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify(entry)))
    vi.stubGlobal('fetch', fetcher)
    mount()
    fireEvent.click(screen.getByRole('tab', { name: 'Étapes' }))
    const input = { nested: { list: [1, true, null] } }
    const assertions = [{ actual: { $ref: 'cube.position' }, op: 'equal', expected: { x: 2 } }]
    editJson('Paramètres de l’action', JSON.stringify(input))
    editJson('Vérifications attendues', JSON.stringify(assertions))
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))
    await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1))
    const body = JSON.parse(fetcher.mock.calls[0]?.[1].body)
    expect(body.expectedRevision).toBe(entry.revision)
    expect(body.plan).toEqual({
      ...entry.plan,
      steps: [{ ...entry.plan?.steps[0], input, assertions }],
    })
  })

  it('retains invalid parameter drafts between tabs and rejects a wrong assertion type before sending', async () => {
    const fetcher = vi.fn()
    vi.stubGlobal('fetch', fetcher)
    mount()
    fireEvent.click(screen.getByRole('tab', { name: 'Étapes' }))
    editJson('Paramètres de l’action', '{invalid')
    fireEvent.click(screen.getByRole('tab', { name: 'Demande' }))
    fireEvent.click(screen.getByRole('tab', { name: 'Étapes' }))
    expect(screen.getByLabelText('Paramètres de l’action').textContent).toBe('{invalid')
    editJson('Paramètres de l’action', '{"nested":{"enabled":true}}')
    editJson('Vérifications attendues', '{}')
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))
    await screen.findAllByRole('alert')
    expect(fetcher).not.toHaveBeenCalled()
    expect(screen.getByLabelText('Vérifications attendues').textContent).toBe('{}')
  })

  it('retains the request across tabs and sends the original revision with the complete contract', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify(entry)))
    vi.stubGlobal('fetch', fetcher)
    mount()
    fireEvent.change(screen.getByLabelText('Ce que l’utilisateur demande'), {
      target: { value: 'Créer deux cubes' },
    })
    fireEvent.click(screen.getByRole('tab', { name: 'Étapes' }))
    fireEvent.click(screen.getByRole('tab', { name: 'Demande' }))
    expect(
      (screen.getByLabelText('Ce que l’utilisateur demande') as HTMLTextAreaElement).value,
    ).toBe('Créer deux cubes')
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))
    await waitFor(() => expect(fetcher).toHaveBeenCalled())
    const body = JSON.parse(fetcher.mock.calls[0]?.[1].body)
    expect(body.expectedRevision).toBe('revision-1')
    expect(body.plan).toEqual({ ...entry.plan, request: 'Créer deux cubes' })
  })
  it('returns from valid JSON to the form without requiring a save', () => {
    mount()
    fireEvent.click(screen.getByRole('tab', { name: 'JSON' }))
    editJson(
      'Format avancé du scénario',
      JSON.stringify({ ...entry.plan, request: 'Demande depuis JSON' }),
    )
    fireEvent.click(screen.getByRole('tab', { name: 'Demande' }))
    expect(
      (screen.getByLabelText('Ce que l’utilisateur demande') as HTMLTextAreaElement).value,
    ).toBe('Demande depuis JSON')
  })
  it('rejects malformed JSON without sending a mutation or losing the draft', async () => {
    const fetcher = vi.fn()
    vi.stubGlobal('fetch', fetcher)
    mount()
    fireEvent.click(screen.getByRole('tab', { name: 'JSON' }))
    editJson('Format avancé du scénario', '{invalid')
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))
    await screen.findAllByRole('alert')
    expect(fetcher).not.toHaveBeenCalled()
    expect(screen.getByLabelText('Format avancé du scénario').textContent).toBe('{invalid')
  })
  it('shows revision conflicts and retains unsaved input', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: 'Source modifiée : recharge le scénario' }), {
          status: 409,
        }),
      ),
    )
    mount()
    fireEvent.change(screen.getByLabelText('Ce que l’utilisateur demande'), {
      target: { value: 'Mon brouillon' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))
    expect((await screen.findByRole('alert')).textContent).toContain('Source modifiée')
    expect(
      (screen.getByLabelText('Ce que l’utilisateur demande') as HTMLTextAreaElement).value,
    ).toBe('Mon brouillon')
  })
})
