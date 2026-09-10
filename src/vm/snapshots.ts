import { randomUUID } from 'node:crypto'
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { record } from '../json.ts'
import { RANDOM_ID_PATTERN } from '../scenarios/identity.ts'
import { latestRun } from './logs.ts'
import { readRecord, stateDir } from './ownership.ts'

export const SNAPSHOT = new RegExp(`^\\d{13}-${RANDOM_ID_PATTERN}\\.jpg$`)
const UNRECORDED = 'Étape non enregistrée pour cette capture.'
const folderFor = (root: string) => join(stateDir(root), 'captures')
export interface Snapshot {
  run: string
  file: string
  capturedAt: string
  activity: string
  /** The journey this image belongs to, when one owned the attempt; a caption is only a caption. */
  scenario?: string
}
async function session(root: string): Promise<string | undefined> {
  try {
    const value: unknown = JSON.parse(await readFile(join(folderFor(root), 'session.json'), 'utf8'))
    if (!value || typeof value !== 'object' || !('run' in value) || typeof value.run !== 'string')
      throw new Error('Invalid snapshot session')
    await readRecord(value.run, root, stateDir(root))
    return value.run
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined
    throw error
  }
}
/** Start a new test session: only known generated images are removed, never logs or keys. */
export async function beginSnapshots(root: string, run: string): Promise<void> {
  await readRecord(run, root, stateDir(root))
  const folder = folderFor(root)
  await mkdir(folder, { recursive: true, mode: 0o700 })
  for (const file of await readdir(folder))
    if (SNAPSHOT.test(file) || (file.endsWith('.json') && SNAPSHOT.test(file.slice(0, -5))))
      await rm(join(folder, file))
  await writeFile(join(folder, 'session.json'), JSON.stringify({ run }), {
    mode: 0o600,
  })
}
export async function saveSnapshot(
  root: string,
  run: string,
  bytes: Buffer,
  activity = UNRECORDED,
  capturedAt = Date.now(),
  scenario = '',
): Promise<void> {
  await readRecord(run, root, stateDir(root))
  const current = await session(root)
  if (!current && (await latestRun(root))?.name === run) await beginSnapshots(root, run)
  if ((await session(root)) !== run) throw new Error('Capture belongs to an older session')
  if (
    !Number.isSafeInteger(capturedAt) ||
    capturedAt < 1_000_000_000_000 ||
    capturedAt > 9_999_999_999_999
  )
    throw new Error('Invalid capture time')
  const file = `${capturedAt}-${randomUUID()}.jpg`
  await writeFile(
    join(folderFor(root), `${file}.json`),
    JSON.stringify({ activity, ...(scenario ? { scenario } : {}) }),
    {
      flag: 'wx',
      mode: 0o600,
    },
  )
  await writeFile(join(folderFor(root), file), bytes, {
    flag: 'wx',
    mode: 0o600,
  })
}
/**
 * `since` filters on the timestamp the filename already carries, before any metadata is read:
 * a persistent session accumulates every attempt's images in one folder.
 */
export async function listSnapshots(root: string, since = 0): Promise<Snapshot[]> {
  const run = await session(root)
  if (!run) return []
  return Promise.all(
    (await readdir(folderFor(root)))
      .filter(file => SNAPSHOT.test(file) && Number(file.slice(0, 13)) >= since)
      .sort()
      .map(async file => {
        let activity = UNRECORDED
        let scenario = ''
        try {
          const metadata: unknown = JSON.parse(
            await readFile(join(folderFor(root), `${file}.json`), 'utf8'),
          )
          if (record(metadata)) {
            if (typeof metadata.activity === 'string') activity = metadata.activity
            if (typeof metadata.scenario === 'string') scenario = metadata.scenario
          }
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
        }
        return {
          run,
          file,
          capturedAt: new Date(Number(file.slice(0, 13))).toISOString(),
          activity,
          ...(scenario ? { scenario } : {}),
        }
      }),
  )
}
export async function readSnapshot(root: string, run: string, file: string): Promise<Buffer> {
  if (!SNAPSHOT.test(file) || (await session(root)) !== run) throw new Error('Invalid snapshot')
  return readFile(join(folderFor(root), file))
}
