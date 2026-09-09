import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { sha256 } from '../catalogue/catalogue.ts'
import { record } from '../json.ts'
import { isJourneyId, journeySource } from '../scenarios/identity.ts'

/** A saved manifest cannot authorize an older version of an edited authored journey. */
export async function assertCurrentJourneySources(root: string, hashes: unknown): Promise<void> {
  if (!record(hashes)) throw new Error('Invalid scenario manifest')
  for (const [id, hash] of Object.entries(hashes)) {
    if (!isJourneyId(id)) continue
    const source = await readFile(join(root, journeySource(id)), 'utf8')
    if (sha256(source) !== hash) throw new Error(`Scenario source changed since manifest: ${id}`)
  }
}
