import { failureCode } from './failure.ts'

export type ScenarioStep = {
  id: string
  label: string
  run: () => Promise<void>
}
type StepResult = {
  id: string
  label: string
  status: 'passed' | 'failed' | 'blocked'
  error?: string
  /** The cause the failure declared; absent when it declared none. */
  errorCode?: string
}
export type ScenarioReport = {
  schemaVersion: 1
  kind: 'reference-actions'
  modelUsed: false
  scenario: string
  status: 'running' | 'passed' | 'failed'
  steps: StepResult[]
}
/** A failed prerequisite blocks the rest; persistence errors also stop execution. */
export async function runScenario(
  scenario: string,
  steps: ScenarioStep[],
  persist: (report: ScenarioReport) => Promise<void>,
): Promise<ScenarioReport> {
  if (!scenario || !steps.length || new Set(steps.map(step => step.id)).size !== steps.length)
    throw new Error('Scenario requires distinct steps')
  const report: ScenarioReport = {
    schemaVersion: 1,
    kind: 'reference-actions',
    modelUsed: false,
    scenario,
    status: 'running',
    steps: [],
  }
  await persist(structuredClone(report))
  let failed = false
  for (const step of steps) {
    if (failed)
      report.steps.push({
        id: step.id,
        label: step.label,
        status: 'blocked',
        error: 'Previous step failed',
      })
    else {
      try {
        await step.run()
        report.steps.push({ id: step.id, label: step.label, status: 'passed' })
      } catch (error) {
        failed = true
        const code = failureCode(error)
        report.steps.push({
          id: step.id,
          label: step.label,
          status: 'failed',
          error: String(error),
          ...(code ? { errorCode: code } : {}),
        })
      }
    }
    await persist(structuredClone(report))
  }
  report.status = failed ? 'failed' : 'passed'
  await persist(structuredClone(report))
  return report
}
