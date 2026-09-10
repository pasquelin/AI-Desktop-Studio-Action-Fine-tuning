import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parseInventory, readScenarioSources } from '../src/scenarios/inventory.ts'
import { assertDisjoint, splitFor } from '../src/scenarios/split.ts'
import { runCheck } from './run-check.ts'

const root = join(import.meta.dirname, '..')
await runCheck(
  async () => {
    // Splits key on the case identity and its action, which no canonical edit can change:
    // the authored Markdown alone decides them.
    const inventory = parseInventory(await readScenarioSources(root))
    const seed = 'studio-semantic-split-v1'
    const rows = inventory.cases.map(item => ({
      id: item.id,
      group: item.action,
      split: splitFor(item.action, seed),
      trainingApproved: false,
    }))
    assertDisjoint(rows)
    const directory = join(root, 'artifacts/dataset')
    await mkdir(directory, { recursive: true })
    await writeFile(
      join(directory, 'split-plan.json'),
      JSON.stringify(
        {
          seed,
          policy: 'entire-action-family',
          note: 'Planning only. No trainable rows exported. Journeys remain unassigned until dependency overlap is reviewed.',
          cases: rows,
          journeys: inventory.journeys.map(item => ({
            id: item.id,
            split: null,
            reason: 'cross-action-dependencies-require-review',
          })),
        },
        null,
        2,
      ),
    )
    console.log(`${rows.length} cases assigned by action family; journeys held for overlap review.`)
    return []
  },
  'Split plan prepared; no training data approved.',
  'Split planning failed',
)
