// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { App } from '../src/admin/app.tsx'

beforeEach(() => {
  vi.useFakeTimers()
  window.history.replaceState(null, '', '/admin/#scenarios')
  vi.stubGlobal('matchMedia', () => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(new Response(JSON.stringify({ items: [], total: 0 }))),
  )
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})
it('filters text after 500 ms without a search button or losing focus', async () => {
  render(createElement(App))
  await act(async () => {
    await Promise.resolve()
  })
  expect(screen.queryByRole('button', { name: 'Rechercher' })).toBeNull()
  const input = screen.getByLabelText('Rechercher les scénarios')
  input.focus()
  fireEvent.change(input, { target: { value: 'cube' } })
  await act(async () => {
    vi.advanceTimersByTime(499)
  })
  expect(location.hash).toBe('#scenarios')
  await act(async () => {
    vi.advanceTimersByTime(1)
  })
  expect(location.hash).toContain('q=cube')
  await act(async () => {
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  })
  expect(document.activeElement).toBe(input)
  expect((input as HTMLInputElement).value).toBe('cube')
})
it('applies a select change immediately', async () => {
  render(createElement(App))
  await act(async () => {
    await Promise.resolve()
  })
  fireEvent.change(screen.getByLabelText('Type de scénario'), {
    target: { value: 'journey' },
  })
  expect(location.hash).toContain('kind=journey')
})

it.each(['/', '/#', '/#unknown', '/#?q=cube', '/#live'])(
  'opens VM monitoring by default at %s independently of menu order',
  url => {
    window.history.replaceState(null, '', url)
    vi.stubGlobal('fetch', () => new Promise(() => {}))
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    )
    vi.stubGlobal('requestAnimationFrame', () => 0)
    render(createElement(App))
    expect(screen.getByRole('heading', { name: 'Live' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Studio dans la VM' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Déroulé et journaux' })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Vue d’ensemble' })).toBeNull()
  },
)
it('keeps statistics available only through their explicit route', () => {
  window.history.replaceState(null, '', '/admin/#overview')
  vi.stubGlobal('fetch', () => new Promise(() => {}))
  render(createElement(App))
  expect(screen.getByRole('heading', { name: 'Vue d’ensemble' })).toBeTruthy()
  expect(screen.queryByRole('heading', { name: 'Live' })).toBeNull()
})

it('returns home without a hash or a document reload and retains a scenario filter', async () => {
  window.history.replaceState(null, '', '/#scenarios')
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    },
  )
  vi.stubGlobal('requestAnimationFrame', () => 0)
  vi.stubGlobal('fetch', () => new Promise(() => {}))
  render(createElement(App))
  const input = screen.getByLabelText('Rechercher les scénarios')
  fireEvent.change(input, { target: { value: 'brouillon' } })
  const home = screen.getAllByRole('link', { name: 'Live' })[0]
  expect(home?.getAttribute('href')).toBe('/')
  if (!home) throw new Error('Missing home link')
  fireEvent.click(home)
  expect(location.pathname).toBe('/')
  expect(location.hash).toBe('')
  expect(screen.getByRole('heading', { name: 'Live' })).toBeTruthy()
  expect((input as HTMLInputElement).value).toBe('brouillon')
  expect(input.isConnected).toBe(true)
  await act(async () => {
    vi.advanceTimersByTime(1000)
  })
  expect(location.hash).toBe('')
})
