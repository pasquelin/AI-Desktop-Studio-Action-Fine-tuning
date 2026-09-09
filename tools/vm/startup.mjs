import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { captureWindow, cdp, evaluate, visibleWindows } from './window-view.ts'

const base = join(homedir(), 'studio-vm')
const settings = JSON.parse(await readFile(join(base, 'profile/settings.json'), 'utf8'))
const expectsWelcome = !settings.settings?.onboarding?.completedAt
async function waitFor(read, description) {
  const deadline = Date.now() + 60000
  while (Date.now() < deadline) {
    const value = await read()
    if (value) return value
    await delay(200)
  }
  throw new Error(`Visible window condition not met: ${description}`)
}
const first = await waitFor(async () => {
  try {
    return (await visibleWindows()).find(page => !expectsWelcome || page.url.endsWith('#welcome'))
  } catch {
    return undefined
  }
}, 'first application window')
let welcomeSteps = 0
if (expectsWelcome) {
  assert.ok(first.url.endsWith('#welcome'), 'First launch must show Welcome')
  const observation =
    '(()=>{const nav=document.querySelector("footer nav");const buttons=Array.from(nav?.querySelectorAll("button")??[]);return {count:buttons.length,index:buttons.findIndex(b=>b.getAttribute("aria-current")==="step")};})()'
  const state = await evaluate(first, observation)
  assert.ok(state.count > 0 && state.index === 0, 'Welcome must start on its first step')
  for (let i = 0; i < state.count; i++) {
    await waitFor(
      async () => (await evaluate(first, observation)).index === i,
      `Welcome step ${i + 1}`,
    )
    await captureWindow(base, `Welcome · étape ${i + 1}/${state.count}`, first)
    const button = await evaluate(
      first,
      '(()=>{const b=document.querySelector("footer button.btn-primary");if(!b||b.disabled)return null;const r=b.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()',
    )
    assert.ok(button, 'Welcome Continue/Finish button missing')
    await cdp(first, 'Input.dispatchMouseEvent', {
      type: 'mousePressed',
      button: 'left',
      clickCount: 1,
      ...button,
    })
    await cdp(first, 'Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      button: 'left',
      clickCount: 1,
      ...button,
    })
    welcomeSteps++
  }
}
const main = await waitFor(
  async () => (await visibleWindows()).find(page => !page.url.endsWith('#welcome')),
  'main Studio visible after Welcome',
)
await cdp(main, 'Runtime.evaluate', {
  expression:
    '(async()=>{const state=await window.studio.window.state(); if(!state.fullScreen) await window.studio.window.toggleFullScreen();})()',
  awaitPromise: true,
})
await waitFor(async () => {
  return await evaluate(main, 'screen.height >= 1080 && innerHeight >= 1080 && innerWidth >= 1920')
}, 'Studio fullscreen at 1920 by 1080')
await captureWindow(base, 'Studio · plein écran 1920 × 1080', main)
if (expectsWelcome) {
  const stored = JSON.parse(await readFile(join(base, 'profile/settings.json'), 'utf8'))
  assert.ok(stored.settings?.onboarding?.completedAt, 'Welcome completion not persisted')
}
await writeFile(
  join(base, 'results/startup.json'),
  JSON.stringify(
    {
      status: 'studio-visible',
      welcomeSteps,
      welcomeRequired: expectsWelcome,
      scenariosExecuted: false,
    },
    null,
    2,
  ),
)
console.log('[Étape] Welcome terminé et fenêtre Studio visible')
