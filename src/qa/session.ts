import { type ChildProcess, spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import { record } from '../json.ts'
import { failureCode } from '../scenarios/failure.ts'
import { RANDOM_ID } from '../scenarios/identity.ts'
import { findPreparedReference } from '../vm/reference.ts'
import { proposeAction } from './local-model.ts'

export interface VmSessionState {
  status: 'starting' | 'ready' | 'error' | 'stopped'
  error?: string
}
interface Dependencies {
  reference: typeof findPreparedReference
  spawnWorker: (root: string, reference: string) => ChildProcess
  propose: typeof proposeAction
}
interface Pending {
  resolve: (value: Record<string, unknown>) => void
  reject: (error: Error) => void
  id: string
  model: string
}
function modelContext(value: unknown): Parameters<typeof proposeAction>[1] {
  if (Buffer.byteLength(JSON.stringify(value) ?? '') > 65536)
    throw new Error('Contexte de proposition QA trop volumineux (64 Kio maximum)')
  if (
    !record(value) ||
    typeof value.request !== 'string' ||
    value.request.length > 16384 ||
    !Array.isArray(value.tools) ||
    value.tools.length !== 1 ||
    !Array.isArray(value.history) ||
    value.history.length > 8 ||
    (value.instruction !== undefined &&
      (typeof value.instruction !== 'string' || value.instruction.length > 16384))
  )
    throw new Error('Contexte de proposition QA invalide')
  return {
    request: value.request,
    tools: value.tools,
    history: value.history,
    ...(typeof value.instruction === 'string' ? { instruction: value.instruction } : {}),
  }
}
function spawnWorker(root: string, reference: string) {
  return spawn(
    process.execPath,
    [join(root, 'tools/vm.ts'), 'build', '--base', reference, '--session'],
    { cwd: root, stdio: ['ignore', 'pipe', 'pipe', 'ipc'] },
  )
}
export class VmSession {
  private child: ChildProcess | undefined
  private state: VmSessionState = { status: 'stopped' }
  private pending: Pending | undefined
  private inference: AbortController | undefined
  private root: string
  private dependencies: Dependencies
  constructor(root: string, dependencies: Partial<Dependencies> = {}) {
    this.root = root
    this.dependencies = {
      reference: dependencies.reference ?? findPreparedReference,
      spawnWorker: dependencies.spawnWorker ?? spawnWorker,
      propose: dependencies.propose ?? proposeAction,
    }
  }
  snapshot() {
    return { ...this.state }
  }
  async start() {
    if (this.state.status === 'ready' || this.state.status === 'starting') return
    this.state = { status: 'starting' }
    // A worker still alive owns a tart VM; dropping the reference would strand it.
    this.child?.kill('SIGINT')
    this.child = undefined
    try {
      const reference = await this.dependencies.reference(this.root)
      if (!reference)
        throw new Error(
          'VM de référence absente. Préparer la VM depuis le terminal avant le premier démarrage.',
        )
      const child = this.dependencies.spawnWorker(this.root, reference)
      this.child = child
      let output = ''
      const collect = (chunk: Buffer) => {
        output = (output + chunk.toString()).slice(-3000)
      }
      child.stdout?.on('data', collect)
      child.stderr?.on('data', collect)
      child.on('message', value => this.receive(child, value))
      child.once('error', error => {
        if (this.child === child) this.fail(error.message)
      })
      child.once('disconnect', () => {
        if (this.child === child) this.fail('Connexion au contrôleur VM perdue')
      })
      child.once('close', code => {
        if (this.child === child) this.fail(output.trim() || `La VM s’est arrêtée (${code})`)
      })
    } catch (error) {
      this.fail(String(error))
    }
  }
  private receive(child: ChildProcess, value: unknown) {
    if (this.child !== child || !record(value)) return
    if (value.type === 'ready' && this.state.status === 'starting') this.state = { status: 'ready' }
    if (value.type === 'model-request') {
      void this.relay(child, value)
      return
    }
    const pending = this.pending
    if (value.type === 'result' && pending && pending.id === value.id) {
      this.inference?.abort()
      this.inference = undefined
      pending.resolve(value)
      this.pending = undefined
    }
  }
  private async relay(child: ChildProcess, value: Record<string, unknown>) {
    const pending = this.pending
    if (
      !pending ||
      value.id !== pending.id ||
      typeof value.modelRequestId !== 'string' ||
      !RANDOM_ID.test(value.modelRequestId)
    )
      return
    const response = {
      type: 'model-response',
      id: pending.id,
      modelRequestId: value.modelRequestId,
    }
    // One way back to the guest, so the answer and the refusal cannot drift apart: a reply that
    // arrives after the attempt moved on belongs to nobody and is dropped.
    const reply = (payload: Record<string, unknown>) => {
      if (this.child !== child || this.pending !== pending || !child.connected) return
      child.send({ ...response, ...payload }, error => {
        if (error && this.child === child) this.fail(error.message)
      })
    }
    let controller: AbortController | undefined
    try {
      if (this.inference) throw new Error('Une proposition QA est déjà en cours')
      const context = modelContext(value.context)
      controller = new AbortController()
      this.inference = controller
      const result = await this.dependencies.propose(pending.model, context, controller.signal)
      if (Buffer.byteLength(JSON.stringify(result)) > 65536)
        throw new Error('Proposition QA trop volumineuse pour le relais VM')
      reply({ result })
    } catch (error) {
      // The cause travels beside the message: past this boundary the error is only text.
      const code = failureCode(error)
      reply({ error: String(error).slice(0, 8000), ...(code ? { code } : {}) })
    } finally {
      if (controller && this.inference === controller) this.inference = undefined
    }
  }
  private fail(error: string) {
    this.state = { status: 'error', error }
    this.inference?.abort()
    this.inference = undefined
    this.pending?.reject(new Error(error))
    this.pending = undefined
  }
  async run(journey: string, model: string) {
    const child = this.child
    if (this.state.status !== 'ready' || !child?.connected) throw new Error('VM indisponible')
    if (this.pending) throw new Error('Une action VM est déjà en cours')
    const id = randomUUID()
    return new Promise<Record<string, unknown>>((resolve, reject) => {
      this.pending = { id, model, resolve, reject }
      child.send({ type: 'qa', id, journey, model }, error => {
        if (error && this.child === child) this.fail(error.message)
      })
    })
  }
  stop() {
    this.child?.kill('SIGINT')
  }
}
