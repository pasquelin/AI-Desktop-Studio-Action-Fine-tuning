import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { migrateCaseSources } from '../src/scenarios/inventory.ts'
import {
  buildScenarioIndex,
  readScenarioProjection,
  searchScenarios,
} from '../src/scenarios/search-index.ts'

const { values } = parseArgs({
  options: {
    build: { type: 'boolean' },
    migrate: { type: 'boolean' },
    id: { type: 'string' },
    query: { type: 'string' },
    family: { type: 'string' },
    action: { type: 'string' },
    tag: { type: 'string' },
    language: { type: 'string' },
    limit: { type: 'string' },
  },
})
const root = join(import.meta.dirname, '..')
try {
  if ([values.build, values.migrate, values.id].filter(Boolean).length > 1)
    throw new Error('Choose one of --build, --migrate or --id')
  let result: unknown
  if (values.migrate) result = await migrateCaseSources(root)
  else if (values.build) result = await buildScenarioIndex(root)
  else if (values.id) result = await readScenarioProjection(root, values.id)
  else {
    const { build: _build, migrate: _migrate, id: _id, limit, ...filters } = values
    result = await searchScenarios(root, {
      ...filters,
      ...(limit === undefined ? {} : { limit: Number(limit) }),
    })
  }
  console.log(JSON.stringify(result, null, 2))
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
}
