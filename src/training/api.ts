import { type ChildProcess, spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import type { IncomingMessage } from 'node:http'
import { join, resolve } from 'node:path'
import { loadQaStatusIndex } from '../admin/scenario-qa-state.ts'
import { optionalJson, recentEntries } from '../files.ts'
import {
  CodedError,
  jsonEndpoint,
  LOCAL_JSON_REQUIRED,
  localMutation,
  readJsonBody,
} from '../http.ts'
import { record } from '../json.ts'
import { RANDOM_ID } from '../scenarios/identity.ts'
import { approvedInputs } from './approved-inputs.ts'
import { assertApprovedSplits, assertLocalModel } from './config.ts'
import { selectQaEligibleExamples } from './qa-eligibility.ts'

interface Prepared {
  token: string
  eligibleCount: number
  excludedCount: number
  examples: { id: string; title: string }[]
  bundle: string
  manifest: string
  model: string
}
interface State {
  status: 'idle' | 'running' | 'completed-not-evaluated' | 'failed'
  error?: string
  reportPath?: string
}
interface Options {
  prepare: (value: unknown) => Promise<Prepared>
  spawn: (args: string[]) => ChildProcess
}
function paths(root: string, value: unknown) {
  if (!record(value)) throw new Error('Configuration entraînement invalide')
  const local = (key: string) => {
    const path = value[key]
    if (
      typeof path !== 'string' ||
      !path.trim() ||
      path.length > 4096 ||
      path.includes('\0') ||
      /^[a-z]+:\/\//i.test(path)
    )
      throw new Error('Trois chemins locaux sont requis : exemples relus, manifeste et modèle MLX')
    return resolve(root, path)
  }
  return { bundle: local('bundle'), manifest: local('manifest'), model: local('model') }
}
async function prepare(root: string, value: unknown): Promise<Prepared> {
  const inputs = paths(root, value)
  await assertLocalModel(inputs.model)
  const raw: unknown = JSON.parse(await readFile(inputs.bundle, 'utf8'))
  const selection = selectQaEligibleExamples(raw, await loadQaStatusIndex(root))
  if (!selection.included.length)
    throw new CodedError('no-eligible-examples', 'Aucun exemple avec QA courante validée')
  if (!record(raw)) throw new Error('Bundle invalide')
  const token = randomUUID()
  const folder = join(root, 'artifacts/training/prepared', token)
  await mkdir(folder, { recursive: true })
  const bundle = join(folder, 'reviewed.json')
  await writeFile(bundle, JSON.stringify({ ...raw, examples: selection.included }), { mode: 0o600 })
  const checked = await approvedInputs(root, bundle, inputs.manifest)
  assertApprovedSplits(checked.rows)
  return {
    token,
    bundle,
    manifest: inputs.manifest,
    model: inputs.model,
    eligibleCount: selection.included.length,
    excludedCount: selection.excluded.length,
    examples: selection.included
      .filter(record)
      .map(example => ({ id: String(example.id), title: String(example.scenarioId) })),
  }
}
async function subset(root: string, prepared: Prepared, ids: unknown): Promise<string> {
  if (ids === undefined) return prepared.bundle
  if (
    !Array.isArray(ids) ||
    !ids.length ||
    ids.length > 10000 ||
    new Set(ids).size !== ids.length ||
    ids.some(id => typeof id !== 'string' || !prepared.examples.some(example => example.id === id))
  )
    throw new Error('Sélection d’exemples admissibles invalide')
  const raw: unknown = JSON.parse(await readFile(prepared.bundle, 'utf8'))
  if (!record(raw) || !Array.isArray(raw.examples)) throw new Error('Bundle invalide')
  const path = join(root, 'artifacts/training/prepared', prepared.token, `${randomUUID()}.json`)
  await writeFile(
    path,
    JSON.stringify({
      ...raw,
      examples: raw.examples.filter(example => record(example) && ids.includes(example.id)),
    }),
    { mode: 0o600 },
  )
  const checked = await approvedInputs(root, path, prepared.manifest)
  assertApprovedSplits(checked.rows)
  return path
}
async function persistResult(folder: string, state: State) {
  const previous = await optionalJson(join(folder, 'result.json'))
  await writeFile(
    join(folder, 'result.json'),
    JSON.stringify({ ...(record(previous) ? previous : {}), ...state }, null, 2),
  )
}
async function reports(root: string) {
  const folder = join(root, 'rapports/entrainement')
  const names = await recentEntries(folder, 'directory', RANDOM_ID)
  const results = await Promise.all(
    names.map(name => optionalJson(join(folder, name, 'result.json'))),
  )
  return results.filter(item => item !== null)
}
export class TrainingController {
  private state: State = { status: 'idle' }
  private prepared: Prepared | undefined
  private busy = false
  private root: string
  private options: Options
  constructor(root: string, options: Partial<Options> = {}) {
    this.root = root
    this.options = {
      prepare: options.prepare ?? (value => prepare(root, value)),
      spawn:
        options.spawn ??
        (args => spawn(process.execPath, args, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] })),
    }
  }
  snapshot() {
    return {
      ...this.state,
      ...(this.prepared
        ? {
            prepared: {
              token: this.prepared.token,
              eligibleCount: this.prepared.eligibleCount,
              excludedCount: this.prepared.excludedCount,
              examples: this.prepared.examples,
            },
          }
        : {}),
    }
  }
  async prepare(value: unknown) {
    if (this.busy || this.state.status === 'running')
      throw new Error('Un entraînement ou une préparation est déjà en cours')
    this.busy = true
    this.prepared = undefined
    try {
      this.prepared = await this.options.prepare(value)
      return this.snapshot().prepared
    } finally {
      this.busy = false
    }
  }
  async start(value: unknown) {
    if (this.busy || this.state.status === 'running')
      throw new Error('Un entraînement est déjà en cours')
    const prepared = this.prepared
    if (!record(value) || !prepared || value.token !== prepared.token)
      throw new Error('Préparer les données avant de lancer')
    this.busy = true
    try {
      const bundle = await subset(this.root, prepared, value.exampleIds)
      const reportPath = `rapports/entrainement/${randomUUID()}`
      const folder = join(this.root, reportPath)
      await mkdir(folder, { recursive: true })
      const log = createWriteStream(join(folder, 'training.log'), { mode: 0o600 })
      const running: State = { status: 'running', reportPath }
      this.state = running
      let tail = ''
      const collect = (chunk: Buffer) => {
        log.write(chunk)
        tail = (tail + chunk.toString()).slice(-4000)
      }
      const child = this.options.spawn([
        join(this.root, 'tools/train-lora.ts'),
        '--bundle',
        bundle,
        '--manifest',
        prepared.manifest,
        '--model',
        prepared.model,
        '--report-dir',
        folder,
        '--run',
      ])
      child.stdout?.on('data', collect)
      child.stderr?.on('data', collect)
      const finish = (code: number, error?: string) => {
        if (this.state !== running) return
        this.state = {
          status: code === 0 ? 'completed-not-evaluated' : 'failed',
          reportPath,
          ...(code !== 0
            ? { error: error || tail || 'Entraînement arrêté ; consulter le rapport' }
            : {}),
        }
        log.end()
        void persistResult(folder, this.state).catch(console.error)
      }
      child.once('error', error => finish(1, error.message))
      child.once('close', code => finish(code ?? 1))
      return this.snapshot()
    } catch (error) {
      this.state = { status: 'failed', error: String(error) }
      throw error
    } finally {
      this.busy = false
    }
  }
}
async function responseFor(
  root: string,
  controller: TrainingController,
  path: string,
  request: IncomingMessage,
) {
  if (request.method === 'GET') {
    if (path === '/api/training') return { code: 200, value: controller.snapshot() }
    if (path.endsWith('/reports')) return { code: 200, value: await reports(root) }
  }
  if (!localMutation(request)) return { code: 403, value: { error: LOCAL_JSON_REQUIRED } }
  if (path.endsWith('/reports')) return { code: 405, value: { error: 'Lecture seulement' } }
  const value = await readJsonBody(request)
  return {
    code: 202,
    value: path.endsWith('/prepare')
      ? await controller.prepare(value)
      : await controller.start(value),
  }
}
export function trainingApi(root: string, controller = new TrainingController(root)) {
  return jsonEndpoint(
    ['/api/training', '/api/training/prepare', '/api/training/reports'],
    (path, request) => responseFor(root, controller, path, request),
    'Lancement refusé',
  )
}
