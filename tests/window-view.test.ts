import { expect, it } from 'vitest'
import { isVisibleState } from '../tools/vm/window-view.ts'

it('refuses a mounted renderer whose window is hidden', () => {
  expect(isVisibleState({ ready: true, mounted: true, visible: false })).toBe(false)
  expect(isVisibleState({ ready: true, mounted: true, visible: true })).toBe(true)
})
it('refuses a visible but unfinished window', () => {
  expect(isVisibleState({ ready: false, mounted: true, visible: true })).toBe(false)
  expect(isVisibleState({ ready: true, mounted: false, visible: true })).toBe(false)
})
