import { randomUUID } from 'node:crypto'
import { mkdir, open } from 'node:fs/promises'
import { join } from 'node:path'
import {
  listAllScenarios,
  type ScenarioEntry,
  ScenarioRepository,
} from '../admin/scenario-repository.ts'
import { atomicWrite, recentEntries } from '../files.ts'
import { record } from '../json.ts'
import { failureCode, isFailureCode } from '../scenarios/failure.ts'
import { RANDOM_ID_JSON } from '../scenarios/identity.ts'
import { failedStep } from './diagnostic.ts'
import { localModels } from './local-model.ts'
import { VmSession } from './session.ts'

export interface QaStep {
  id: string
  title: string
  status: 'queued' | 'running' | 'passed' | 'failed' | 'blocked'
  error?: string
  /** The cause the failure declared, when it declared one; never inferred from `error`. */
  errorCode?: string
  runId?: string
  reportPath?: string
  report?: unknown
}
export interface QaState {
  id?: string
  status: 'idle' | 'running' | 'passed' | 'failed' | 'cancelled'
  model?: string
  steps: QaStep[]
  error?: string
}
interface Dependencies {
  vm: Pick<VmSession, 'start' | 'snapshot' | 'run'>
  models: typeof localModels
  repository: Pick<ScenarioRepository, 'list'>
}
interface Selection {
  model: string
  selection: 'all' | 'active' | 'smoke' | 'single'
  stopOnFailure: boolean
  scenarioId?: string
}
const MAX_REPORT_BYTES = 16 * 1024 * 1024
const PROVIDER_TTL_MS = 5000
/** Keep only the step the live diagnostic inspects; the persisted report keeps everything. */
function failureOnly(report: unknown): unknown {
  if (!record(report) || !Array.isArray(report.steps)) return report
  const failed = failedStep(report)
  return { ...report, steps: failed ? [failed] : [] }
}
function selectionOf(value: unknown): Selection {
  if (
    !record(value) ||
    typeof value.model !== 'string' ||
    !value.model.trim() ||
    !['all', 'active', 'smoke', 'single'].includes(String(value.selection)) ||
    typeof value.stopOnFailure !== 'boolean'
  )
    throw new Error('Sélection QA invalide')
  if (value.selection === 'single' && (typeof value.scenarioId !== 'string' || !value.scenarioId))
    throw new Error('Identifiant de scénario requis')
  return value as unknown as Selection
}
function selected(entry: ScenarioEntry, value: Selection) {
  switch (value.selection) {
    case 'single':
      return entry.id === value.scenarioId
    case 'smoke':
      return ['P001', 'P003'].includes(entry.id)
    case 'active':
      return entry.active
    default:
      return true
  }
}
function stepOf(entry: ScenarioEntry): QaStep {
  const ready = entry.kind === 'journey' && entry.ready
  return {
    id: entry.id,
    title: entry.title,
    status: ready ? 'queued' : 'blocked',
    ...(!ready
      ? { error: [...entry.blockers, ...entry.missing].join('; ') || 'Scénario non exécutable' }
      : {}),
  }
}
async function readReport(path: string): Promise<{ report: QaState; bytes: number }> {
  const file = await open(path, 'r')
  try {
    const info = await file.stat()
    if (!info.isFile() || info.size > MAX_REPORT_BYTES)
      throw new Error('Rapport QA trop volumineux')
    const bytes = Buffer.alloc(info.size + 1)
    const { bytesRead } = await file.read(bytes, 0, bytes.length, 0)
    if (bytesRead > info.size) throw new Error('Rapport QA modifié pendant la lecture')
    const value: unknown = JSON.parse(bytes.subarray(0, bytesRead).toString('utf8'))
    if (
      !record(value) ||
      !Array.isArray(value.steps) ||
      value.steps.length > 10000 ||
      !['idle', 'running', 'passed', 'failed', 'cancelled'].includes(String(value.status))
    )
      throw new Error('Rapport QA invalide')
    return { report: value as unknown as QaState, bytes: bytesRead }
  } finally {
    await file.close()
  }
}
export class QaService {
  private root: string
  private dependencies: Dependencies
  private state: QaState = { status: 'idle', steps: [] }
  private cancelled = false
  private probe: { at: number; value: Awaited<ReturnType<typeof localModels>> } | undefined
  private starting = false
  private work: Promise<void> = Promise.resolve()
  constructor(root: string, dependencies: Partial<Dependencies> = {}) {
    this.root = root
    this.dependencies = {
      vm: dependencies.vm ?? new VmSession(root),
      models: dependencies.models ?? localModels,
      repository: dependencies.repository ?? new ScenarioRepository(root),
    }
  }
  async boot() {
    await this.dependencies.vm.start()
  }
  /**
   * Polled once a second while the page is open, so it carries no guest report: cloning
   * megabytes of evidence every tick is wasteful and `/api/qa/reports` already serves it.
   * Only the failed step travels, which is what the live diagnostic reads.
   */
  async snapshot() {
    const steps = this.state.steps.map(step => ({
      ...step,
      ...(step.status === 'failed' ? { report: failureOnly(step.report) } : { report: undefined }),
    }))
    return {
      ...this.state,
      steps: structuredClone(steps),
      vm: this.dependencies.vm.snapshot(),
      provider: await this.provider(),
    }
  }
  /** An installed-model list changes only when the operator pulls one; do not ask every tick. */
  private async provider() {
    const now = Date.now()
    if (this.probe && now - this.probe.at < PROVIDER_TTL_MS) return this.probe.value
    const value = await this.dependencies.models()
    this.probe = { at: now, value }
    return value
  }
  async reports() {
    const directory = join(this.root, 'rapports/debug/campagnes')
    const files = await recentEntries(directory, 'file', RANDOM_ID_JSON)
    const result: QaState[] = []
    let bytes = 0
    for (const name of files) {
      const entry = await readReport(join(directory, name))
      bytes += entry.bytes
      if (bytes > MAX_REPORT_BYTES)
        throw new Error('Trop de rapports QA : consulter le dossier local')
      result.push(entry.report)
    }
    return result
  }
  async start(value: unknown) {
    if (this.starting || this.state.status === 'running')
      throw new Error('Une recette est déjà en cours')
    this.starting = true
    try {
      const selection = selectionOf(value)
      // The launch gate probes for real: a cached list must never authorise an absent model.
      const provider = await this.dependencies.models()
      this.probe = { at: Date.now(), value: provider }
      if (provider.status !== 'ready' || !provider.models.includes(selection.model))
        throw new Error(provider.error || 'Choisir un modèle local installé')
      if (this.dependencies.vm.snapshot().status !== 'ready')
        throw new Error('Attendre que la VM soit prête')
      const entries = (
        await listAllScenarios(options => this.dependencies.repository.list(options))
      ).filter(entry => selected(entry, selection))
      if (!entries.length) throw new Error('Aucun scénario sélectionné')
      this.cancelled = false
      this.state = {
        id: randomUUID(),
        status: 'running',
        model: selection.model,
        steps: entries.map(stepOf),
      }
      await this.persist()
      this.work = this.run(selection.stopOnFailure).catch(async error => {
        this.state.status = 'failed'
        this.state.error = String(error)
        await this.persist().catch(console.error)
      })
      return structuredClone(this.state)
    } catch (error) {
      if (this.state.status === 'running') {
        this.state.status = 'failed'
        this.state.error = String(error)
      }
      throw error
    } finally {
      this.starting = false
    }
  }
  /** Cooperative stop: never abandons the in-flight VM action or starts its successor. */
  stop() {
    if (this.state.status !== 'running') return
    this.cancelled = true
    this.state.error = 'Arrêt demandé : attente de la fin du scénario courant'
  }
  async settled() {
    await this.work
  }
  private async execute(step: QaStep) {
    step.status = 'running'
    await this.persist()
    try {
      const result = await this.dependencies.vm.run(step.id, this.state.model ?? '')
      step.status = result.code === 0 ? 'passed' : 'failed'
      if (typeof result.runId === 'string') step.runId = result.runId
      if (typeof result.reportPath === 'string') step.reportPath = result.reportPath
      step.report = result.report
      if (step.status === 'failed') {
        step.error = typeof result.error === 'string' ? result.error : 'Résultat attendu non obtenu'
        // A host-side failure carries its cause too: without this the step reads as undiagnosed
        // whenever the guest produced no report of its own.
        if (isFailureCode(result.errorCode)) step.errorCode = result.errorCode
      }
    } catch (error) {
      step.status = 'failed'
      step.error = String(error)
      const code = failureCode(error)
      if (code) step.errorCode = code
    }
    await this.persist()
  }
  private async run(stopOnFailure: boolean) {
    let failed = false
    for (const step of this.state.steps) {
      if (step.status === 'blocked') continue
      if (this.cancelled || (failed && stopOnFailure)) {
        step.status = 'blocked'
        step.error = this.cancelled
          ? 'Recette arrêtée avant ce scénario'
          : 'Arrêt après le premier échec'
        continue
      }
      await this.execute(step)
      failed ||= step.status === 'failed'
    }
    this.state.status = this.cancelled
      ? 'cancelled'
      : failed || this.state.steps.some(step => step.status === 'blocked')
        ? 'failed'
        : 'passed'
    if (this.cancelled) this.state.error = 'Recette arrêtée à la fin du scénario courant'
    await this.persist()
  }
  private async persist() {
    if (!this.state.id) return
    const dir = join(this.root, 'rapports/debug/campagnes')
    await mkdir(dir, { recursive: true })
    const json = JSON.stringify(this.state, null, 2)
    if (Buffer.byteLength(json) > MAX_REPORT_BYTES) throw new Error('Rapport QA trop volumineux')
    await atomicWrite(join(dir, `${this.state.id}.json`), json, 0o600)
    await atomicWrite(join(dir, 'latest.json'), json, 0o600)
    // The readable summary describes a finished campaign; rebuilding it after every step is waste.
    if (this.state.status === 'running') return
    const lines = this.state.steps.map(
      step =>
        `- ${step.id} — ${step.status} — ${step.title.replaceAll('\n', ' ')}${step.error ? ` : ${step.error}` : ''}`,
    )
    await atomicWrite(
      join(dir, `${this.state.id}.md`),
      `# Recette Debug / QA\n\nModèle local : ${this.state.model}\n\n${lines.join('\n')}\n`,
      0o600,
    )
  }
}
