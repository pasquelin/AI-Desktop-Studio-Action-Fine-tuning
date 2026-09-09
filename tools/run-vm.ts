import { mkdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { assertScenarioEnabled } from '../src/admin/scenario-activation.ts'
import { ensureObserver } from '../src/vm/observer-process.ts'
import { stateDir } from '../src/vm/ownership.ts'
import { runPipeline } from '../src/vm/pipeline.ts'
import { command } from '../src/vm/process.ts'
import { findPreparedReference } from '../src/vm/reference.ts'
import { runCheck } from './run-check.ts'

const { values } = parseArgs({
  options: {
    scenario: { type: 'boolean', default: false },
    journey: { type: 'string' },
  },
})
const root = resolve(import.meta.dirname, '..')
const state = stateDir(root)
const vm = (...args: string[]) =>
  command(process.execPath, [join(root, 'tools/vm.ts'), ...args], {
    interactive: true,
    timeout: 7_200_000,
  })

await runCheck(
  async () => {
    await mkdir(state, { recursive: true, mode: 0o700 })
    console.log(`Suivre le test dans le navigateur : ${await ensureObserver(root)}`)
    await runPipeline({
      preflight: async () => {
        if (values.journey) await assertScenarioEnabled(root, values.journey)
      },
      findReference: () => findPreparedReference(root),
      prepare: async () => {
        await vm('prepare', '--source', 'sequoia-vanilla')
      },
      build: async reference => {
        await vm(
          'build',
          '--base',
          reference,
          ...(values.scenario || values.journey ? ['--scenario'] : []),
          ...(values.journey ? ['--journey', values.journey] : []),
        )
      },
    })
    return []
  },
  'VM pipeline finished; see the reports above.',
  'VM pipeline failed.',
)
