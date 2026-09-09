import { fileURLToPath } from 'node:url'
import { inspectRepository } from '../src/repository/inspect-repository.ts'
import { runCheck } from './run-check.ts'

await runCheck(
  () => inspectRepository(fileURLToPath(new URL('..', import.meta.url))),
  'Repository candidate files passed path and size checks.',
  'Repository check failed.',
)
