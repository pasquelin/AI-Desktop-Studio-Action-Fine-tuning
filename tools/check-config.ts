import { readFileSync } from 'node:fs'
import { validatePilot } from '../src/config/validate-pilot.ts'
import { runCheck } from './run-check.ts'

await runCheck(
  () => {
    const path = process.argv[2] ?? new URL('../configs/pilot.json', import.meta.url)
    return validatePilot(JSON.parse(readFileSync(path, 'utf8')))
  },
  'Pilot configuration valid. This check does not load or download models.',
  'Configuration check failed.',
)
