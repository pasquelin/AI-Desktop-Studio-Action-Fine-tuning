import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { absent, record } from '../json.ts'
import { isJourneyId } from '../scenarios/identity.ts'

/** Null means no administrative selection was recorded; callers choose legacy behavior explicitly. */
export async function readScenarioActivation(root: string, id: string): Promise<boolean | null> {
  if (!isJourneyId(id)) throw new Error('Invalid journey id')
  try {
    const value: unknown = JSON.parse(
      await readFile(join(root, `datasets/admin/activation/${id}.json`), 'utf8'),
    )
    if (!record(value) || value.id !== id || typeof value.active !== 'boolean')
      throw new Error('Invalid activation record')
    return value.active
  } catch (error) {
    if (absent(error)) return null
    throw error
  }
}

export async function assertScenarioEnabled(root: string, id: string): Promise<void> {
  if ((await readScenarioActivation(root, id)) === false)
    throw new Error(`Journey disabled in administration: ${id}`)
}
