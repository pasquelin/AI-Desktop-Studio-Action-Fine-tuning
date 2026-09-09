import { fork } from 'node:child_process'
import { join } from 'node:path'

export const OBSERVER_URL = 'http://127.0.0.1:4328/'
async function runningObserver(root: string): Promise<boolean> {
  try {
    const response = await fetch(`${OBSERVER_URL}health`, {
      signal: AbortSignal.timeout(1500),
      redirect: 'error',
    })
    const value = await response.json()
    return response.ok && value.service === 'studio-vm-observer' && value.root === root
  } catch {
    return false
  }
}
/** Reuse a live local observer, otherwise start it independently of the test process. */
export async function ensureObserver(root: string): Promise<string> {
  if (await runningObserver(root)) return OBSERVER_URL
  return new Promise((resolve, reject) => {
    const child = fork(join(root, 'tools/observe-vm.ts'), [], {
      cwd: root,
      detached: true,
      stdio: ['ignore', 'ignore', 'ignore', 'ipc'],
    })
    const fail = (error: Error) => {
      clearTimeout(timer)
      child.kill()
      reject(error)
    }
    const timer = setTimeout(() => fail(new Error('Observer did not start')), 10000)
    child.once('error', fail)
    child.once('exit', () => fail(new Error('Observer exited before publishing its address')))
    child.on('message', message => {
      if (message !== OBSERVER_URL) return
      clearTimeout(timer)
      child.removeAllListeners('exit')
      child.removeAllListeners('error')
      child.disconnect()
      child.unref()
      resolve(OBSERVER_URL)
    })
  })
}
