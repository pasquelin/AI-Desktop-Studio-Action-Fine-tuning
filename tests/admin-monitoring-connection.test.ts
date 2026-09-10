// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { Monitoring } from '../src/admin/views/live.tsx'

// useLive reports the unreachable observer once, as a flag; a business error keeps its own text.
const live = vi.hoisted(() => ({ offline: true, log: '', capture: '' }))
vi.mock('../src/admin/hooks/use-live.ts', () => ({
  logSummary: () => 'Dernières étapes',
  useLive: () => ({
    snapshots: [],
    text: 'Dernières étapes',
    offline: live.offline,
    logError: live.log,
    captureError: live.capture,
    capturesLoaded: true,
    loaded: true,
    file: 'activity.log',
    status: '',
    run: '',
  }),
}))
vi.mock('../src/admin/hooks/use-follow.ts', () => ({
  useFollow: () => ({
    hasSelection: () => false,
    align: () => {},
    scroller: { current: null },
    following: true,
    setFollowing: () => {},
    onScroll: () => {},
    pause: () => {},
  }),
}))
vi.mock('../src/admin/hooks/use-decoded-image.ts', () => ({
  useDecodedImage: () => ({ loaded: '/last.jpg', error: '' }),
}))
beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    },
  )
})
afterEach(() => {
  vi.unstubAllGlobals()
  cleanup()
  live.offline = true
  live.log = ''
  live.capture = ''
})
it('shows one French connection notice while keeping the latest image and logs', () => {
  render(createElement(Monitoring))
  expect(screen.getAllByText(/Connexion au serveur interrompue/)).toHaveLength(1)
  expect(screen.getByRole('img').getAttribute('src')).toBe('/last.jpg')
  expect(screen.getByText('Dernières étapes')).toBeTruthy()
})
it('lets the QA heading own the connection notice without masking a business error', () => {
  live.capture = 'Capture refusée pour ce scénario'
  render(createElement(Monitoring, { connectionUnavailable: true }))
  expect(screen.queryByText(/Connexion au serveur interrompue/)).toBeNull()
  expect(screen.getByText('Capture refusée pour ce scénario')).toBeTruthy()
})
