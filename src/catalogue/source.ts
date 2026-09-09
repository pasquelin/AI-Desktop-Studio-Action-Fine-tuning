import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { execGit, readCheckoutState } from '../studio/checkout.ts'
import { sha256 } from './catalogue.ts'

export function inspectSource(root: string, expectedRevision?: string) {
  const { revision, dirty } = readCheckoutState(root)
  if (expectedRevision !== undefined && revision !== expectedRevision)
    throw new Error('Unexpected Studio revision.')
  if (dirty) throw new Error('Studio checkout must be clean before export.')
  const files = execGit(root, 'ls-files', '-z', 'src/shared', 'src/main/mcp/tools.ts')
    .split('\0')
    .filter(Boolean)
    .sort()
  const hashes = Object.fromEntries(
    files.map(file => [file, sha256(readFileSync(join(root, file)))]),
  )
  const source = readFileSync(join(root, 'src/shared/domain/assistantActionNames.ts'), 'utf8')
  // Fail closed if Studio changes this explicit literal-union contract.
  if (!/^export type ActionName\s*=\s*(?:\|\s*'[^']+'\s*)+;?\s*$/.test(source)) {
    throw new Error('Unsupported ActionName declaration; update the exporter.')
  }
  const names = Array.from(source.matchAll(/\|\s*'([^']+)'/g), match => match[1] ?? '')
  return { revision, hashes, names }
}

export function assertFresh(
  previous: { appRevision: string; sourceHashes: Record<string, string> },
  current: ReturnType<typeof inspectSource>,
): void {
  if (
    previous.appRevision !== current.revision ||
    Object.keys(previous.sourceHashes).length !== Object.keys(current.hashes).length ||
    Object.entries(current.hashes).some(([file, hash]) => previous.sourceHashes[file] !== hash)
  ) {
    throw new Error('Catalogue is stale: run catalogue:export to regenerate it from Studio.')
  }
}
