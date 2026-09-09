import { spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { readScenarioActivation } from '../admin/scenario-activation.ts'
import { record as isRecord } from '../json.ts'
import { isManagedName, isPreparedReference, readRecord, stateDir } from '../vm/ownership.ts'
import type { ExecutionResult } from './result.ts'

/** Launch the owned VM command directly so cancellation reaches its cleanup handler. */
export function createVmRunner(root: string, reference: string) {
  return async (id: string, signal: AbortSignal): Promise<ExecutionResult> => {
    if (!/^P\d{3}$/.test(id)) throw new Error('Invalid journey id')
    if ((await readScenarioActivation(root, id)) !== true)
      throw new Error(`Journey is not explicitly enabled: ${id}`)
    const record = await readRecord(reference, root, stateDir(root))
    if (!isPreparedReference(record)) throw new Error('VM reference is not ready')
    if (signal.aborted) throw new Error('Execution cancelled')
    return await new Promise<ExecutionResult>((resolve, reject) => {
      const child = spawn(
        process.execPath,
        [join(root, 'tools/vm.ts'), 'build', '--base', reference, '--scenario', '--journey', id],
        { cwd: root, stdio: ['ignore', 'pipe', 'pipe', 'ipc'] },
      )
      let runId: string | undefined
      child.on('message', value => {
        if (
          isRecord(value) &&
          value.type === 'vm-run' &&
          typeof value.name === 'string' &&
          isManagedName(value.name)
        )
          runId = value.name
      })
      let output = ''
      const collect = (chunk: Buffer) => {
        output = (output + chunk.toString()).slice(-4000)
        process.stdout.write(chunk)
      }
      child.stdout?.on('data', collect)
      child.stderr?.on('data', collect)
      const cancel = () => {
        child.kill('SIGINT')
      }
      signal.addEventListener('abort', cancel, { once: true })
      const detach = () => signal.removeEventListener('abort', cancel)
      child.once('error', error => {
        detach()
        reject(error)
      })
      child.once('close', async code => {
        detach()
        resolve({
          code: code ?? 1,
          ...(runId ? { runId } : {}),
          ...(code === 0 ? {} : { error: await failureMessage(root, runId, output) }),
        })
      })
    })
  }
}

async function failureMessage(
  root: string,
  runId: string | undefined,
  output: string,
): Promise<string> {
  if (runId) {
    try {
      const report: unknown = JSON.parse(
        await readFile(join(stateDir(root), runId, 'results/scenario.json'), 'utf8'),
      )
      if (isRecord(report) && Array.isArray(report.steps)) {
        const failed = report.steps.find(step => isRecord(step) && step.status === 'failed')
        if (isRecord(failed))
          return `Étape ${String(failed.label ?? failed.id)} : ${String(failed.error ?? 'résultat attendu non obtenu')}`
      }
    } catch {
      /* A startup failure may not have a scenario report. */
    }
  }
  return output.trim() || 'Le lancement VM a échoué avant de produire un rapport'
}
