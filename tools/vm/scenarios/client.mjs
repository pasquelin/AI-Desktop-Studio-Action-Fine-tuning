import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdir, readFile, realpath, stat } from 'node:fs/promises'
import { homedir } from 'node:os'
import { isAbsolute, join, relative, resolve, sep } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { scenarioConsent } from './scenario-consent.ts'
import { captureWindow } from './window-view.ts'

// This executable is transferred into the guest, never run against the host Studio.
assert.equal(process.platform, 'darwin')
assert.match(execFileSync('sysctl', ['-n', 'hw.model'], { encoding: 'utf8' }), /^VirtualMac/)
const home = homedir(),
  base = join(home, 'studio-vm'),
  source = join(base, 'source'),
  results = join(base, 'results')
assert.equal(resolve(process.cwd()), source)
const sandbox = join(base, 'scenario-projects')
await mkdir(sandbox, { recursive: true })
// Both spellings denote the same directory; a symlinked home must not defeat confinement.
const sandboxRoots = [sandbox, await realpath(sandbox)]
let requestId = 1,
  endpoint
/** The single confinement rule for every guest scenario, symlink-resolved paths included. */
function within(path) {
  const target = resolve(path)
  const contained = sandboxRoots.some(root => {
    const rel = relative(root, target)
    return Boolean(rel) && rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel)
  })
  assert.ok(contained && !target.includes('\0'), 'Path outside test sandbox')
  return path
}
async function exists(path) {
  try {
    await stat(path)
    return true
  } catch (error) {
    if (error.code === 'ENOENT') return false
    throw error
  }
}
async function connect() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      endpoint = JSON.parse(await readFile(join(base, 'profile', 'mcp.json'), 'utf8'))
      if (endpoint.port && endpoint.token) break
    } catch {}
    await delay(500)
  }
  assert.ok(
    Number.isInteger(endpoint?.port) &&
      endpoint.port > 0 &&
      endpoint.port < 65536 &&
      typeof endpoint.token === 'string',
    'MCP endpoint missing in isolated profile',
  )
  const targets = await (await fetch('http://127.0.0.1:9333/json')).json()
  const page = targets.find(
    item => item.type === 'page' && item.url.startsWith('file:') && !item.url.includes('splash'),
  )
  assert.ok(page?.webSocketDebuggerUrl, 'Studio renderer missing')
}
async function rpc(method, params) {
  const response = await fetch(`http://127.0.0.1:${endpoint.port}/mcp`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${endpoint.token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
      'MCP-Protocol-Version': '2025-03-26',
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: requestId++, method, params }),
    signal: AbortSignal.timeout(45000),
  })
  assert.ok(response.ok, `MCP HTTP ${response.status}`)
  const body = await response.json()
  assert.ok(!body.error, JSON.stringify(body.error))
  return body.result
}
const capture = (action, outcome) =>
  captureWindow(base, `${action} · ${outcome}`).catch(error =>
    console.error('Capture unavailable', String(error)),
  )
async function call(action, input = {}, options = { allowConsent: true }) {
  if (input.path?.startsWith('/')) within(input.path)
  if (input.folder?.startsWith('/')) assert.equal(input.folder, sandbox)
  const argumentsCopy = structuredClone(input)
  try {
    await capture(action, 'avant action')
    let result = await rpc('tools/call', {
      name: action.replace('.', '_'),
      arguments: argumentsCopy,
    })
    const consent = options.allowConsent ? scenarioConsent(action, result) : undefined
    if (consent) {
      console.log(`[Étape] Confirmation du scénario jetable : ${action}`)
      await capture(action, 'avant confirmation')
      result = await rpc('tools/call', {
        name: action.replace('.', '_'),
        arguments: { ...argumentsCopy, consent },
      })
    }
    if (result.isError) throw new ClientRefusal(`${action}: ${JSON.stringify(result.content)}`)
    const data = JSON.parse(result.content.find(item => item.type === 'text').text)
    return data
  } catch (error) {
    await capture(action, 'échec')
    throw error
  }
}

export class ClientRefusal extends Error {}
export { base, call, connect, exists, results, sandbox, source, within }
