import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdir, readFile, realpath, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import {
  ActionRefusal,
  BENCH_REQUIREMENTS,
  executeDeclarative,
  makeConversationDraft,
  makeInputValidator,
  parseScenario,
} from './bench.mjs'
import { ClientRefusal, call, connect, results, sandbox, source, within } from './client.mjs'

async function main() {
  const observations = []
  const provenance = JSON.parse(await readFile(join(source, 'provenance.json'), 'utf8'))
  // Every transferred file is read once, verified against its provenance hash, then parsed.
  const transferred = new Map(
    await Promise.all(
      [
        ['scenario-spec.json', 'scenarioHash'],
        ['bench.mjs', 'engineHash'],
        ['scenario-catalogue.json', 'catalogueHash'],
        ['seed-media.json', 'mediaHash'],
      ].map(async ([name, key]) => {
        const bytes = await readFile(join(source, name))
        assert.equal(
          createHash('sha256').update(bytes).digest('hex'),
          provenance[key],
          `${name} changed during transfer`,
        )
        return [name, bytes]
      }),
    ),
  )
  const parsed = name => JSON.parse(transferred.get(name).toString('utf8'))
  const scenario = parseScenario(parsed('scenario-spec.json'))
  const catalogue = parsed('scenario-catalogue.json')
  const media = parsed('seed-media.json')
  const projectPath = join(sandbox, 'Bench Project')
  await connect()
  const report = await executeDeclarative(
    scenario,
    { sandbox, projectPath },
    {
      availableRequirements: [...BENCH_REQUIREMENTS],
      validateInput: makeInputValidator(catalogue.mcpTools),
      call: async (action, input, options) => {
        try {
          const result = await call(action, input, options)
          if (action === 'project.create' && scenario.requires.includes('local-media-fixtures')) {
            assert.equal(result.path, projectPath)
            const destination = join(projectPath, 'Fixtures')
            within(await realpath(projectPath))
            await mkdir(destination, { recursive: false })
            for (const name of ['checker.png', 'tone-220.wav', 'tone-440.wav', 'triangle.glb']) {
              assert.equal(typeof media[name], 'string')
              await writeFile(join(destination, name), Buffer.from(media[name], 'base64'), {
                flag: 'wx',
              })
            }
          }
          observations.push({
            stepId: options.stepId,
            action,
            input: structuredClone(input),
            result: structuredClone(result),
          })
          return result
        } catch (error) {
          if (error instanceof ClientRefusal) throw new ActionRefusal(error.message)
          throw error
        }
      },
      readFile: async (path, mode) => {
        const target = resolve(projectPath, path)
        within(target)
        let physical
        try {
          physical = await realpath(target)
        } catch (error) {
          if (mode === 'exists' && error.code === 'ENOENT') return false
          throw error
        }
        within(physical)
        if (mode === 'exists') return true
        const bytes = await readFile(physical)
        if (mode === 'sha256') return createHash('sha256').update(bytes).digest('hex')
        return mode === 'json' ? JSON.parse(bytes.toString('utf8')) : bytes.toString('utf8')
      },
      persist: async report => {
        console.log(`[Étape] ${scenario.id}: ${report.steps.at(-1)?.label ?? 'préparation'}`)
        let conversationEvidence = []
        if (report.status === 'passed' && !scenario.steps.some(step => step.expectRefusal)) {
          const { draft, link } = makeConversationDraft(
            scenario,
            report,
            observations,
            catalogue.mcpTools,
            provenance,
          )
          await writeFile(join(results, 'conversation-draft.json'), JSON.stringify(draft, null, 2))
          conversationEvidence = [link]
        }
        await writeFile(
          join(results, 'scenario.json'),
          JSON.stringify({ ...report, provenance, observations, conversationEvidence }, null, 2),
        )
      },
    },
  )
  assert.equal(
    report.status,
    'passed',
    JSON.stringify(report.steps.filter(step => step.status === 'failed')),
  )
}
await main().catch(async error => {
  let previous = {}
  try {
    previous = JSON.parse(await readFile(join(results, 'scenario.json'), 'utf8'))
  } catch {}
  await writeFile(
    join(results, 'scenario.json'),
    JSON.stringify(
      {
        ...previous,
        status: 'failed',
        preparationError: String(error),
        conversationEvidence: [],
      },
      null,
      2,
    ),
  )
  throw error
})
