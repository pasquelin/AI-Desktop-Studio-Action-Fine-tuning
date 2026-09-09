import { readdir, readFile, stat } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { build } from 'vite'
import { absent } from '../src/json.ts'
import { buildAdminValidators } from './build-admin-validators.ts'

const SOURCES = 'src/admin'
const OUTPUT = 'dist/admin'

async function newestSource(directory: string): Promise<number> {
  let newest = 0
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, item.name)
    const time = item.isDirectory() ? await newestSource(path) : (await stat(path)).mtimeMs
    if (time > newest) newest = time
  }
  return newest
}

/** True when the built page is missing or older than any source it was built from. */
async function stale(root: string): Promise<boolean> {
  try {
    const built = await stat(join(root, OUTPUT, 'index.html'))
    return (await newestSource(join(root, SOURCES))) > built.mtimeMs
  } catch (error) {
    if (absent(error)) return true
    throw error
  }
}

export async function buildAdmin(root: string): Promise<void> {
  await buildAdminValidators(root)
  await build({
    configFile: false,
    root: resolve(root, SOURCES),
    base: '/admin/',
    plugins: [tailwindcss()],
    build: { outDir: resolve(root, OUTPUT), emptyOutDir: true },
    logLevel: 'warn',
  })
}

/**
 * The page the observer serves, rebuilt only when a source changed. Starting a server should not
 * pay for a production build, and an unchanged tree should not be rewritten.
 */
export async function indexPage(root: string): Promise<Buffer> {
  if (await stale(root)) await buildAdmin(root)
  return readFile(join(root, OUTPUT, 'index.html'))
}

if (process.argv[1] === import.meta.filename) await buildAdmin(resolve(import.meta.dirname, '..'))
