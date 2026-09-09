import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { makeCatalogue } from '../src/catalogue/catalogue.ts'
import { loadSnapshot } from '../src/catalogue/load-snapshot.ts'
import { assertFresh, inspectSource } from '../src/catalogue/source.ts'

// Windows and macOS reach the same directory through several spellings.
const caseInsensitive = existsSync(tmpdir().toUpperCase())

const roots: string[] = []
function source(): string {
  const root = mkdtempSync(join(tmpdir(), 'studio-export-test-'))
  roots.push(root)
  const files = {
    'src/shared/domain/assistantActionNames.ts': "export type ActionName = | 'node.add'\n",
    'src/shared/domain/assistant.ts': `const action = { name: 'node.add', titleKey: 'title', descriptionKey: 'description', fields: [], raises: () => 'files' }; export const ACTION_FAMILIES = [{name: 'scene', actions: [action]}]; export const ACTION_REGISTRY = [action];`,
    'src/shared/i18n/index.ts': `export const TRANSLATIONS = {en: {title:'Add', description:'Add node'}, fr: {title:'Ajouter', description:'Ajouter un objet'}}; export const textAt = (bundle, key) => bundle[key];`,
    'src/main/mcp/tools.ts': `export const schemaOfFields = fields => ({type:'object', properties:{}, required: []}); export const mcpTools = () => [{name:'node_add',inputSchema:{type:'object',properties:{consent:{type:'string'}}}}];`,
  }
  for (const [name, content] of Object.entries(files)) {
    const path = join(root, name)
    mkdirSync(join(path, '..'), { recursive: true })
    writeFileSync(path, content)
  }
  execFileSync('git', ['init', '--quiet', root])
  execFileSync('git', ['-C', root, 'add', '.'])
  execFileSync('git', [
    '-C',
    root,
    '-c',
    'user.name=Test',
    '-c',
    'user.email=test@example.invalid',
    '-c',
    'commit.gpgsign=false',
    'commit',
    '-qm',
    'fixture',
  ])
  return root
}
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe('source binding and freshness', () => {
  it('rejects the wrong revision before loading code', () => {
    expect(() => inspectSource(source(), '0'.repeat(40))).toThrow(/revision/i)
  })
  it('rejects uncommitted Studio changes', () => {
    const root = source()
    writeFileSync(join(root, 'new.ts'), 'changed')
    expect(() => inspectSource(root)).toThrow(/clean/i)
  })
  it('detects a new revision or changed source hash', () => {
    const current = inspectSource(source())
    const saved = {
      appRevision: current.revision,
      sourceHashes: current.hashes,
    }
    expect(() => assertFresh(saved, current)).not.toThrow()
    expect(() => assertFresh(saved, { ...current, revision: 'new' })).toThrow(/stale/i)
    expect(() =>
      assertFresh(saved, {
        ...current,
        hashes: { ...current.hashes, extra: 'new' },
      }),
    ).toThrow(/stale/i)
  })
  it('loads real source modules and preserves translations and runtime markers', async () => {
    const root = source()
    const info = inspectSource(root)
    const result = makeCatalogue(await loadSnapshot(root), info.names, info.revision, info.hashes)
    expect(result.actions[0]).toMatchObject({
      name: 'node.add',
      raises: { runtimeFunction: true },
      translations: { fr: { title: 'Ajouter' } },
    })
    expect(result.mcpTools[0]).toMatchObject({
      inputSchema: { properties: { consent: { type: 'string' } } },
    })
  })
  it.skipIf(!caseInsensitive)(
    'loads modules when the root is spelled non-canonically',
    async () => {
      const root = source()
      const disguised = join(dirname(root), basename(root).toUpperCase())
      const info = inspectSource(root)
      const result = makeCatalogue(
        await loadSnapshot(disguised),
        info.names,
        info.revision,
        info.hashes,
      )
      expect(result.actions[0]).toMatchObject({ name: 'node.add' })
    },
  )
})
