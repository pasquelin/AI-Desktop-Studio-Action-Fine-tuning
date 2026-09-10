import { execFile } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { promisify } from 'node:util'
import { DEBUG_ORIGIN } from './studio-launch.ts'

export interface WindowPage {
  url: string
  webSocketDebuggerUrl: string
}
export async function cdp(
  page: WindowPage,
  method: string,
  params: Record<string, unknown> = {},
): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(page.webSocketDebuggerUrl)
    const finish = (error?: Error, result?: Record<string, unknown>) => {
      clearTimeout(timer)
      socket.close()
      error ? reject(error) : resolve(result ?? {})
    }
    const timer = setTimeout(() => finish(new Error(`Window command timed out: ${method}`)), 10000)
    socket.addEventListener('error', () => finish(new Error('Window connection failed')))
    socket.addEventListener('open', () => socket.send(JSON.stringify({ id: 1, method, params })))
    socket.addEventListener('message', event => {
      try {
        const message = JSON.parse(String(event.data))
        if (message.id !== 1) return
        if (message.error) finish(new Error(JSON.stringify(message.error)))
        else finish(undefined, message.result)
      } catch (error) {
        finish(new Error(String(error)))
      }
    })
  })
}
export async function evaluate(page: WindowPage, expression: string): Promise<unknown> {
  const response = await cdp(page, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
  })
  if (response.exceptionDetails) throw new Error('Window inspection failed')
  const result = response.result
  if (!result || typeof result !== 'object' || !('value' in result))
    throw new Error('Missing window observation')
  return result.value
}
export async function visibleWindows(): Promise<WindowPage[]> {
  const response = await fetch(`${DEBUG_ORIGIN}/json`, {
    signal: AbortSignal.timeout(3000),
  })
  const targets: unknown = await response.json()
  if (!Array.isArray(targets)) throw new Error('Invalid window list')
  const pages: WindowPage[] = targets.filter(
    (target): target is WindowPage =>
      target &&
      typeof target.url === 'string' &&
      target.url.startsWith('file:') &&
      !target.url.includes('splash') &&
      typeof target.webSocketDebuggerUrl === 'string',
  )
  const visible: WindowPage[] = []
  for (const page of pages) {
    const state = await evaluate(
      page,
      '({visible:document.visibilityState === "visible",ready:document.readyState === "complete",mounted:!!document.getElementById("root")?.childElementCount})',
    )
    if (isVisibleState(state)) visible.push(page)
  }
  return visible.sort(
    (a, b) => Number(b.url.endsWith('#welcome')) - Number(a.url.endsWith('#welcome')),
  )
}
export function isVisibleState(value: unknown): boolean {
  return (
    value !== null &&
    typeof value === 'object' &&
    'visible' in value &&
    value.visible === true &&
    'ready' in value &&
    value.ready === true &&
    'mounted' in value &&
    value.mounted === true
  )
}
export async function captureWindow(
  base: string,
  activity: string,
  page?: WindowPage,
): Promise<void> {
  const target = page ?? (await visibleWindows())[0]
  if (!target) throw new Error('No visible Studio or Welcome window')
  await cdp(target, 'Page.bringToFront')
  const settled = await cdp(target, 'Runtime.evaluate', {
    expression: `(async()=>{
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      const animations=document.getAnimations().filter(animation=>animation.playState==="running" && Number.isFinite(animation.effect?.getComputedTiming().endTime));
      await Promise.all(animations.map(animation=>animation.finished.catch(()=>{})));
      await new Promise(resolve=>requestAnimationFrame(resolve));
      return true;
    })()`,
    awaitPromise: true,
    returnByValue: true,
  })
  if (settled.exceptionDetails) throw new Error('Visual stabilization failed')
  await captureScreen(base, activity)
}

export async function captureScreen(base: string, activity: string): Promise<void> {
  const directory = join(base, 'action-images')
  await mkdir(directory, { recursive: true })
  const file = `${Date.now()}-${randomUUID()}.jpg`
  await captureDesktop(join(directory, file))
  console.log(`[Capture] ${JSON.stringify({ file, activity })}`)
}

const execute = promisify(execFile)
function xml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
// Launch in the Aqua session: SSH inherits a different TCC responsible process.
// The screencapture permission must have been granted in the reference VM.
async function captureDesktop(destination: string): Promise<void> {
  const label = `studio-ft.capture.${randomUUID()}`
  const plist = `${destination}.plist`
  const domain = `gui/${process.getuid?.()}`
  await writeFile(
    plist,
    `<?xml version="1.0" encoding="UTF-8"?><plist version="1.0"><dict><key>Label</key><string>${label}</string><key>ProgramArguments</key><array><string>/usr/sbin/screencapture</string><string>-x</string><string>-t</string><string>jpg</string><string>${xml(destination)}</string></array><key>RunAtLoad</key><true/><key>KeepAlive</key><false/></dict></plist>`,
    { mode: 0o600 },
  )
  try {
    const sessionDeadline = Date.now() + 60000
    while (true) {
      try {
        await execute('/bin/launchctl', ['bootstrap', domain, plist], { timeout: 10000 })
        break
      } catch (error) {
        const failure = error as Error & { code?: number; stderr?: string }
        if (
          failure.code !== 125 ||
          !failure.stderr?.includes('Domain does not support specified action') ||
          Date.now() >= sessionDeadline
        )
          throw error
        // SSH can be ready before the Aqua login domain accepts jobs.
        await delay(250)
      }
    }
    const deadline = Date.now() + 10000
    while (Date.now() < deadline) {
      const data = await readFile(destination).catch((error: NodeJS.ErrnoException) => {
        if (error.code === 'ENOENT') return undefined
        throw error
      })
      if (
        data &&
        data.length > 4 &&
        data[0] === 0xff &&
        data[1] === 0xd8 &&
        data.at(-2) === 0xff &&
        data.at(-1) === 0xd9
      )
        return
      await delay(100)
    }
    throw new Error('Full desktop capture did not complete in the graphical session')
  } finally {
    await execute('/bin/launchctl', ['bootout', `${domain}/${label}`], {
      timeout: 10000,
    }).catch(() => {})
    await rm(plist, { force: true })
  }
}
