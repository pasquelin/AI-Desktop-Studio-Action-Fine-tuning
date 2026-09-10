import { join, resolve } from 'node:path'
import { publishApprovedExport } from '../src/scenarios/export-approved.ts'
import { approvedInputs } from '../src/training/approved-inputs.ts'
import { runCheck } from './run-check.ts'

await runCheck(
  async () => {
    const [bundleFile, scenarioManifest, ...extra] = process.argv.slice(2)
    if (!bundleFile || !scenarioManifest || extra.length)
      throw new Error(
        'Usage: export-approved <reviewed-bundle.json> <current-scenario-manifest.json>',
      )
    const root = resolve(import.meta.dirname, '..')
    const prepared = await approvedInputs(root, bundleFile, scenarioManifest)
    const destination = await publishApprovedExport(prepared, join(root, 'artifacts/dataset'))
    console.log(`Approved dataset: ${destination}`)
    return []
  },
  'Approved export published; training was not started.',
  'Approved export rejected',
)
