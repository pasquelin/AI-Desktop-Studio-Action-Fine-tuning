import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { sha256 } from '../src/catalogue/catalogue.ts'
import { record } from '../src/json.ts'
import {
  type BenchExample,
  compileCaseExample,
  compileJourneyExample,
} from '../src/scenarios/examples.ts'
import { parseInventory, readScenarioSources } from '../src/scenarios/inventory.ts'
import { cataloguePath } from '../src/studio/checkout.ts'
import { runCheck } from './run-check.ts'

const root = fileURLToPath(new URL('../', import.meta.url))
async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, 'utf8'))
}
await runCheck(
  async () => {
    const sources = await readScenarioSources(root)
    const inventory = parseInventory(sources)
    const catalogue = await readJson(cataloguePath(root))
    if (
      !record(catalogue) ||
      !Array.isArray(catalogue.actions) ||
      !Array.isArray(catalogue.mcpTools)
    )
      throw new Error('Invalid catalogue')
    const actions = new Map<string, Record<string, unknown>>()
    for (const action of catalogue.actions) {
      if (!record(action) || typeof action.name !== 'string') throw new Error('Invalid action')
      if (actions.has(action.name)) throw new Error('Duplicate action')
      actions.set(action.name, action)
    }
    const tools = new Map<string, Record<string, unknown>>()
    for (const tool of catalogue.mcpTools) {
      if (!record(tool) || typeof tool.name !== 'string' || !record(tool.inputSchema))
        throw new Error('Invalid MCP schema')
      tools.set(tool.name, tool.inputSchema)
    }
    const links = await readJson(join(root, 'datasets/scenarios/action-bench-links.json'))
    if (!record(links)) throw new Error('Invalid bench links')
    const bench = (await readFile(join(root, 'datasets/scenarios/studio-bench.jsonl'), 'utf8'))
      .trim()
      .split('\n')
      .map((line): BenchExample => {
        const value: unknown = JSON.parse(line)
        if (!record(value)) throw new Error('Invalid bench entry')
        for (const key of [
          'rank',
          'source',
          'sourceHash',
          'setupExpression',
          'oracleExpression',
          'saidExpression',
        ])
          if (typeof value[key] !== 'string') throw new Error(`Invalid bench ${key}`)
        return value as unknown as BenchExample
      })
    const knownRanks = new Set(bench.map(item => item.rank))
    const cases = inventory.cases.map(item => {
      const action = actions.get(item.action)
      const wire = tools.get(item.action.replace('.', '_'))
      const ranks: unknown = links[item.action]
      if (
        !action ||
        !wire ||
        !Array.isArray(ranks) ||
        !ranks.every((rank): rank is string => typeof rank === 'string' && knownRanks.has(rank))
      )
        throw new Error(`Unresolved contract/reference: ${item.id}`)
      return compileCaseExample(item, action, wire, ranks)
    })
    const journeys = inventory.journeys.map(item =>
      compileJourneyExample(item, new Set(actions.keys())),
    )
    const output = join(root, 'artifacts/examples')
    await mkdir(output, { recursive: true })
    const files: string[] = []
    for (let offset = 0; offset < cases.length; offset += 100) {
      const file = `cases-${String(offset / 100 + 1).padStart(3, '0')}.jsonl`
      await writeFile(
        join(output, file),
        `${cases
          .slice(offset, offset + 100)
          .map(item => JSON.stringify(item))
          .join('\n')}\n`,
      )
      files.push(file)
    }
    await writeFile(
      join(output, 'journeys.jsonl'),
      `${journeys.map(item => JSON.stringify(item)).join('\n')}\n`,
    )
    const variants = cases.flatMap(item => item.variants)
    const summary = {
      cases: cases.length,
      journeys: journeys.length,
      actions: actions.size,
      concreteWireRequests: variants.length,
      schemaRejectedVariants: variants.filter(item => !item.expectedWireResult.accepted).length,
      schemaAcceptedVariants: variants.filter(item => item.expectedWireResult.accepted).length,
      businessCasesBlocked: cases.length,
      businessJourneysBlocked: journeys.length,
      trainingApproved: 0,
      studioExecutionVerified: 0,
      catalogueRevision: catalogue.appRevision,
      sourceHashes: Object.fromEntries(
        Object.entries(sources).map(([file, text]) => [file, sha256(text)]),
      ),
      benchSnapshotHashes: Object.fromEntries(bench.map(item => [item.source, item.sourceHash])),
      files: [...files, 'journeys.jsonl'],
    }
    await writeFile(join(output, 'manifest.json'), `${JSON.stringify(summary, null, 2)}\n`)
    console.log(
      JSON.stringify({
        cases: summary.cases,
        journeys: summary.journeys,
        concreteWireRequests: summary.concreteWireRequests,
        schemaRejectedVariants: summary.schemaRejectedVariants,
        businessCasesBlocked: summary.businessCasesBlocked,
        trainingApproved: 0,
      }),
    )
    return []
  },
  'Examples specified; runtime and translation approval remain separate.',
  'Example preparation failed',
)
