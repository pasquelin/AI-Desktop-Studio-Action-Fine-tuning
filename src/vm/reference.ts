import { readdir } from 'node:fs/promises'
import { isManagedName, isPreparedReference, readRecord, stateDir } from './ownership.ts'
import { listLocalVmNames } from './tart.ts'

export async function findPreparedReference(root: string): Promise<string | undefined> {
  const state = stateDir(root)
  const [locals, entries] = await Promise.all([listLocalVmNames(), readdir(state)])
  const records = await Promise.all(
    entries.filter(isManagedName).map(name => readRecord(name, root, state)),
  )
  const ready = records.filter(
    record => isPreparedReference(record) && locals.includes(record.name),
  )
  if (ready.length > 1)
    throw new Error('Multiple prepared references: select explicitly with vm build --base')
  return ready[0]?.name
}
