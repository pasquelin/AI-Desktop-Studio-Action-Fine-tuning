// @vitest-environment jsdom

import { act, cleanup, render, renderHook, screen } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, expect, it, vi } from 'vitest'
import { useFollow } from '../src/admin/hooks/use-follow.ts'
import { useResource } from '../src/admin/hooks/use-resource.ts'
import { Overview } from '../src/admin/views/overview.tsx'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})
it('keeps the overview title and content surface while loading', () => {
  vi.stubGlobal('fetch', () => new Promise(() => {}))
  render(createElement(Overview))
  expect(screen.getByRole('heading', { name: 'Vue d’ensemble' })).toBeTruthy()
  const loading = screen.getByRole('status', {
    name: 'Lecture des sources et des rapports…',
  })
  expect(loading.closest('section')).not.toBeNull()
})
it('ignores stale asynchronous results after navigation', async () => {
  let finishOld: ((value: string) => void) | undefined
  const first = () =>
    new Promise<string>(resolve => {
      finishOld = resolve
    })
  const second = () => Promise.resolve('Current report')
  const { result, rerender } = renderHook(({ loader }) => useResource(loader), {
    initialProps: { loader: first },
  })
  rerender({ loader: second })
  await act(async () => {
    await Promise.resolve()
  })
  expect(result.current.data).toBe('Current report')
  await act(async () => {
    finishOld?.('Old report')
  })
  expect(result.current.data).toBe('Current report')
})
it('resumes follow after thirty seconds and restarts the delay on manual movement', () => {
  vi.useFakeTimers()
  const { result } = renderHook(useFollow)
  act(() => result.current.pause())
  expect(result.current.following).toBe(false)
  act(() => vi.advanceTimersByTime(20000))
  act(() => result.current.pause())
  act(() => vi.advanceTimersByTime(29999))
  expect(result.current.following).toBe(false)
  act(() => vi.advanceTimersByTime(1))
  expect(result.current.following).toBe(true)
})
