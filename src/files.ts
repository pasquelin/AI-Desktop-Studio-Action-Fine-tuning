import { readFile } from 'node:fs/promises'
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
