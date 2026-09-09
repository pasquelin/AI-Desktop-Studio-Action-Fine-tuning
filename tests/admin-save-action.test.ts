// @vitest-environment jsdom
import { act, cleanup, render, screen } from '@testing-library/react'
import { createElement, Fragment } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { useSaveAction } from '../src/admin/hooks/use-save-action.ts'

function Probe({ work }: { work: () => Promise<void> }) {
  const { busy, error, run } = useSaveAction()
  return createElement(
    Fragment,
    null,
    createElement('span', { 'data-testid': 'state' }, busy ? 'en cours' : 'au repos'),
    createElement('span', { 'data-testid': 'error' }, error),
    createElement('button', { type: 'button', onClick: () => void run(work) }, 'Enregistrer'),
  )
}

const state = () => screen.getByTestId('state').textContent
const failure = () => screen.getByTestId('error').textContent
const click = () => screen.getByRole('button').click()

afterEach(cleanup)

describe('shared save action', () => {
  it('marks the work as busy while it runs and clears the flag when it succeeds', async () => {
    let release = () => {}
    const pending = new Promise<void>(resolve => {
      release = resolve
    })
    render(createElement(Probe, { work: () => pending }))
    expect(state()).toBe('au repos')
    act(click)
    expect(state()).toBe('en cours')
    await act(async () => {
      release()
      await pending
    })
    expect(state()).toBe('au repos')
    expect(failure()).toBe('')
  })
  it('reports the failure text and stops being busy', async () => {
    render(createElement(Probe, { work: () => Promise.reject(new Error('Source modifiée')) }))
    await act(async () => click())
    expect(failure()).toBe('Source modifiée')
    expect(state()).toBe('au repos')
  })
  it('clears a previous failure when the work is retried', async () => {
    let fail = true
    const work = () => {
      const attempt = fail ? Promise.reject(new Error('Échec')) : Promise.resolve()
      fail = false
      return attempt
    }
    render(createElement(Probe, { work }))
    await act(async () => click())
    expect(failure()).toBe('Échec')
    await act(async () => click())
    expect(failure()).toBe('')
  })
})
