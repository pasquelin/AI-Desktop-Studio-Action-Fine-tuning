import { randomUUID } from 'node:crypto'
import { lstat, mkdir, readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { absent } from './json.ts'

/** Reads JSON that may legitimately not exist yet; null means absent. */
export async function optionalJson(path: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch (error) {
    if (absent(error)) return null
    throw error
  }
}

/** Refuses a symlinked target or parent rather than let a read or write escape the repository. */
export async function assertNoSymlink(
  root: string,
  path: string,
  fail: (text: string) => Error = message => new Error(message),
): Promise<void> {
  let current = root
  for (const part of path.split('/').filter(Boolean)) {
    current = join(current, part)
    try {
      if ((await lstat(current)).isSymbolicLink())
        throw fail(`Refusing a symlinked path component: ${path}`)
    } catch (error) {
      if (!absent(error)) throw error
    }
  }
}

/** Publishes a file in one step: a reader never observes a partial write. */
export async function atomicWrite(
  path: string,
  data: string | Uint8Array,
  mode?: number,
): Promise<void> {
  const temporary = `${path}.${randomUUID()}.tmp`
  try {
    await writeFile(temporary, data, { flag: 'wx', ...(mode === undefined ? {} : { mode }) })
    await rename(temporary, path)
  } finally {
    await rm(temporary, { force: true })
  }
}

/**
 * Report ids are random, so recency comes from the filesystem, never from their order. A tie on
 * the timestamp is broken by name, so the same folder always yields the same window; the QA
 * campaigns and the training runs both need exactly this, and two copies of a subtle sort drift.
 */
export async function recentEntries(
  directory: string,
  kind: 'file' | 'directory',
  pattern: RegExp,
  limit = 100,
): Promise<string[]> {
  await mkdir(directory, { recursive: true })
  const names = (await readdir(directory, { withFileTypes: true }))
    .filter(entry => (kind === 'file' ? entry.isFile() : entry.isDirectory()))
    .map(entry => entry.name)
    .filter(name => pattern.test(name))
  const dated = await Promise.all(
    names.map(async name => ({ name, time: (await stat(join(directory, name))).mtimeMs })),
  )
  return dated
    .sort((a, b) => a.time - b.time || a.name.localeCompare(b.name))
    .slice(-limit)
    .map(entry => entry.name)
}
