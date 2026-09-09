import { randomUUID } from 'node:crypto'
import type { ExecutionResult } from './result.ts'

type Status = 'idle' | 'running' | 'passed' | 'failed' | 'cancelled'
type StepStatus = 'queued' | 'running' | 'passed' | 'failed' | 'blocked'
export interface ExecutionState {
  id: string | null
  status: Status
  steps: { id: string; status: StepStatus; error?: string; runId?: string }[]
}
export class ExecutionController {
  private state: ExecutionState = { id: null, status: 'idle', steps: [] }
  private abort = new AbortController()
  private completion: Promise<void> = Promise.resolve()
  private readonly execute: (id: string, signal: AbortSignal) => Promise<number | ExecutionResult>
  constructor(execute: (id: string, signal: AbortSignal) => Promise<number | ExecutionResult>) {
    this.execute = execute
  }
  snapshot(): ExecutionState {
    return structuredClone(this.state)
  }
  wait(): Promise<void> {
    return this.completion
  }
  start(ids: string[]): ExecutionState {
    if (this.state.status === 'running') throw new Error('An execution is already running')
    if (
      !ids.length ||
      ids.length > 63 ||
      new Set(ids).size !== ids.length ||
      ids.some(id => !/^P\d{3}$/.test(id))
    )
      throw new Error('Invalid scenario selection')
    this.abort = new AbortController()
    this.state = {
      id: randomUUID(),
      status: 'running',
      steps: ids.map(id => ({ id, status: 'queued' })),
    }
    this.completion = this.run()
    return this.snapshot()
  }
  stop(): void {
    if (this.state.status === 'running') this.abort.abort()
  }
  private async run(): Promise<void> {
    for (const step of this.state.steps) {
      if (this.abort.signal.aborted || this.state.status !== 'running') {
        step.status = 'blocked'
        continue
      }
      await this.runStep(step)
    }
    if (this.state.status === 'running')
      this.state.status = this.abort.signal.aborted ? 'cancelled' : 'passed'
  }
  private async runStep(step: ExecutionState['steps'][number]): Promise<void> {
    step.status = 'running'
    try {
      const outcome = await this.execute(step.id, this.abort.signal)
      const result = typeof outcome === 'number' ? { code: outcome } : outcome
      if (result.runId) step.runId = result.runId
      if (this.abort.signal.aborted) {
        step.status = 'blocked'
        this.state.status = 'cancelled'
      } else if (result.code === 0) step.status = 'passed'
      else {
        step.status = 'failed'
        step.error = result.error ?? 'Le parcours a échoué ; consulter son rapport'
        this.state.status = 'failed'
      }
    } catch (error) {
      step.status = this.abort.signal.aborted ? 'blocked' : 'failed'
      step.error = error instanceof Error ? error.message : 'Execution failed'
      this.state.status = this.abort.signal.aborted ? 'cancelled' : 'failed'
    }
  }
}
