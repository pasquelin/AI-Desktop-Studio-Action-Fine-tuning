import { createHash } from 'node:crypto'
import { Ajv, type ValidateFunction } from 'ajv'

type Snapshot = {
  language: string
  languages: string[]
  families: { name: string; actions: string[] }[]
  registryNames: string[]
  actions: (Record<string, unknown> & { name: string })[]
  mcpTools: (Record<string, unknown> & { name: string })[]
}
const strings = { type: 'array', items: { type: 'string' } }
const named = {
  type: 'object',
  required: ['name'],
  properties: { name: { type: 'string' } },
}
let compiled: ValidateFunction<Snapshot> | undefined

/** Compiled on first call so importing sha256 does not pay for the schema. */
function validator(): ValidateFunction<Snapshot> {
  compiled ??= new Ajv({ strict: true }).compile<Snapshot>({
    type: 'object',
    required: ['language', 'languages', 'families', 'registryNames', 'actions', 'mcpTools'],
    properties: {
      language: { const: 'en' },
      languages: strings,
      registryNames: strings,
      families: {
        type: 'array',
        items: {
          type: 'object',
          required: ['name', 'actions'],
          properties: { name: { type: 'string' }, actions: strings },
        },
      },
      actions: { type: 'array', minItems: 1, items: named },
      mcpTools: { type: 'array', items: named },
    },
  })
  return compiled
}

export function sha256(value: string | Buffer): string {
  return createHash('sha256').update(value).digest('hex')
}

export function makeCatalogue(
  snapshot: unknown,
  declaredNames: string[],
  revision: string,
  hashes: Record<string, string>,
) {
  const check = validator()
  if (!check(snapshot)) throw new Error('Invalid registry snapshot.')
  const names = snapshot.actions.map(action => action.name)
  for (const list of [names, declaredNames, snapshot.mcpTools.map(tool => tool.name)]) {
    if (new Set(list).size !== list.length) throw new Error('Duplicate catalogue names.')
  }
  if (names.length !== declaredNames.length || declaredNames.some(name => !names.includes(name))) {
    throw new Error('The declared action names and exported registry differ.')
  }
  if (
    JSON.stringify(names) !== JSON.stringify(snapshot.registryNames) ||
    JSON.stringify(names) !== JSON.stringify(snapshot.families.flatMap(family => family.actions))
  ) {
    throw new Error('The family order differs from the registry.')
  }
  const body = {
    schemaVersion: 1,
    appRevision: revision,
    sourceHashes: Object.fromEntries(
      Object.entries(hashes).sort(([a], [b]) => a.localeCompare(b, 'en')),
    ),
    ...snapshot,
  }
  return { ...body, catalogueHash: sha256(JSON.stringify(body)) }
}
