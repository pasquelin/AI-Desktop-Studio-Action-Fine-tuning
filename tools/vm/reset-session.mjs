import assert from 'node:assert/strict'
import { execFile, spawn } from 'node:child_process'
import { lstat, mkdir, open, readFile, realpath, rename, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { promisify } from 'node:util'
import { DEBUG_ORIGIN, DEBUG_PORT, electronArgv } from './studio-launch.ts'

const exec = promisify(execFile)
const base = join(homedir(), 'studio-vm')
const source = join(base, 'source')
const profile = join(base, 'profile')
const caseId = process.env.STUDIO_FT_CASE
assert.equal(process.platform, 'darwin', 'Refusing non-macOS host')
assert.match(
  (await exec('/usr/sbin/sysctl', ['-n', 'hw.model'])).stdout.trim(),
  /^VirtualMac/,
  'Refusing non-VM host',
)
assert.equal(
  (await readFile(join(base, 'prepared'), 'utf8')).trim(),
  'studio-vm-v1',
  'Unprepared VM',
)
assert.match(
  caseId ?? '',
  /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i,
  'Invalid QA case identity',
)
for (const path of [base, source, profile])
  assert.equal((await lstat(path)).isSymbolicLink(), false, 'Refusing symlinked session path')
const require = createRequire(join(source, 'package.json'))
const electron = require(join(source, 'node_modules/electron'))
assert.equal(typeof electron, 'string', 'Electron executable missing')
const listener = await listenerPid()
assert.ok(listener, 'Studio debugging listener missing before reset')
const command = (await exec('/bin/ps', ['-p', String(listener), '-o', 'command='])).stdout.trim()
assert.ok(
  command.startsWith(`${electron} `),
  'Debugging listener is not the expected Studio executable',
)
// The very argv this script would produce: one contract, asserted against the running process.
for (const argument of electronArgv(profile).slice(2))
  assert.ok(hasArgument(command, argument), `Unexpected Studio argument: ${argument}`)
const response = await fetch(`${DEBUG_ORIGIN}/json/version`, {
  signal: AbortSignal.timeout(3000),
})
assert.ok(response.ok, 'Studio browser endpoint unavailable')
const version = await response.json()
const address = new URL(version.webSocketDebuggerUrl)
assert.equal(address.protocol, 'ws:')
assert.equal(address.hostname, '127.0.0.1')
assert.equal(address.port, String(DEBUG_PORT))
assert.ok(address.pathname.startsWith('/devtools/browser/'))
const diagnostics = join(base, 'diagnostics')
await mkdir(diagnostics, { recursive: true })
assert.equal(
  await realpath(diagnostics),
  join(await realpath(base), 'diagnostics'),
  'Refusing redirected diagnostics',
)
const archive = join(diagnostics, caseId)
await mkdir(archive)
console.log('[Étape] Fermeture de Studio et préparation indépendante du scénario')
await closeBrowser(address.href)
const deadline = Date.now() + 30000
while ((await processAlive(listener)) || (await listenerPid())) {
  assert.ok(Date.now() < deadline, 'Studio did not terminate; profile left untouched')
  await delay(100)
}
const stored = JSON.parse(await readFile(join(profile, 'settings.json'), 'utf8'))
const onboarding = stored.settings?.onboarding
assert.ok(onboarding?.completedAt, 'Completed onboarding missing; refusing implicit Welcome bypass')
await rename(profile, join(archive, 'profile'))
await mkdir(profile)
await writeFile(
  join(profile, 'settings.json'),
  JSON.stringify({ settings: { onboarding, mcp: { enabled: true } } }),
)
await writeFile(
  join(archive, 'reset.json'),
  JSON.stringify({
    caseId,
    previousPid: listener,
    profileArchived: true,
    startedAt: new Date().toISOString(),
  }),
)
const log = await open(join(archive, 'startup.log'), 'wx')
try {
  const child = spawn(
    process.execPath,
    electronArgv(profile).map((argument, index) =>
      index === 0 ? join(source, argument) : argument,
    ),
    { cwd: source, detached: true, stdio: ['ignore', log.fd, log.fd], env: process.env },
  )
  await new Promise((resolve, reject) => {
    child.once('spawn', resolve)
    child.once('error', reject)
  })
  child.unref()
} finally {
  await log.close()
}
await new Promise((resolve, reject) => {
  const startup = spawn(process.execPath, [join(source, '.ft-startup.mjs')], {
    cwd: source,
    stdio: 'inherit',
    env: process.env,
  })
  startup.once('error', reject)
  startup.once('exit', code =>
    code === 0 ? resolve() : reject(new Error(`Studio startup verification failed (${code})`)),
  )
})
console.log('[Étape] Nouveau profil et fenêtre Studio vérifiés ; VM conservée active')

async function listenerPid() {
  try {
    const output = (
      await exec('/usr/sbin/lsof', ['-nP', '-t', `-iTCP:${DEBUG_PORT}`, '-sTCP:LISTEN'])
    ).stdout.trim()
    if (!output) return null
    const pids = [...new Set(output.split(/\s+/))]
    assert.equal(pids.length, 1, 'Multiple debugging listeners')
    const pid = Number(pids[0])
    assert.ok(Number.isInteger(pid) && pid > 1, 'Invalid debugging process')
    return pid
  } catch (error) {
    if (error.code === 1 && !error.stdout) return null
    throw error
  }
}
async function processAlive(pid) {
  try {
    const state = (await exec('/bin/ps', ['-p', String(pid), '-o', 'stat='])).stdout.trim()
    return Boolean(state && !state.startsWith('Z'))
  } catch (error) {
    if (error.code === 1) return false
    throw error
  }
}
function closeBrowser(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url)
    let sent = false
    const timer = setTimeout(() => finish(new Error('Browser.close timed out')), 10000)
    function finish(error) {
      clearTimeout(timer)
      socket.close()
      error ? reject(error) : resolve()
    }
    socket.addEventListener('open', () => {
      sent = true
      socket.send(JSON.stringify({ id: 1, method: 'Browser.close' }))
    })
    socket.addEventListener('message', event => {
      const reply = JSON.parse(String(event.data))
      if (reply.id === 1) finish(reply.error ? new Error(JSON.stringify(reply.error)) : undefined)
    })
    socket.addEventListener('close', () => {
      if (sent) finish()
      else finish(new Error('Browser connection closed before command'))
    })
    socket.addEventListener('error', () =>
      finish(sent ? undefined : new Error('Browser.close connection error')),
    )
  })
}

function hasArgument(command, value) {
  return command.includes(` ${value} `) || command.endsWith(` ${value}`)
}
