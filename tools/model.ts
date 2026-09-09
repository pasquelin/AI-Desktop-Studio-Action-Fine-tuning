import { execFileSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { sha256 } from '../src/catalogue/catalogue.ts'
import { record } from '../src/json.ts'
import { grade, localRequest, MODEL, readTools } from '../src/model/baseline.ts'
import { modelCases } from '../src/model/cases.ts'
import { cataloguePath } from '../src/studio/checkout.ts'
import { runCheck } from './run-check.ts'

const root = fileURLToPath(new URL('../', import.meta.url))
const mode = process.argv[2]
const directory = join(root, 'artifacts/model')
await runCheck(
  async () => {
    if (process.argv.length !== 3 || !['pull', 'check', 'evaluate'].includes(mode ?? ''))
      throw new Error('Usage: model pull | check | evaluate')
    if (mode === 'pull')
      execFileSync('ollama', ['pull', MODEL], {
        stdio: 'inherit',
        timeout: 1800000,
      })
    const tags = await localRequest('/api/tags')
    if (!record(tags) || !Array.isArray(tags.models))
      throw new Error('Invalid local model inventory')
    const models: unknown[] = tags.models
    const installed = models.find(item => record(item) && item.name === MODEL)
    if (!record(installed) || typeof installed.digest !== 'string')
      throw new Error('Qwen is not installed: run npm run model:pull')
    console.log(`Local model: ${MODEL}; digest: ${installed.digest}`)
    if (mode !== 'evaluate') return []
    const catalogueBytes = await readFile(cataloguePath(root), 'utf8')
    const catalogue: unknown = JSON.parse(catalogueBytes)
    const tools = readTools(catalogue)
    const metadata = await localRequest('/api/show', { model: MODEL })
    const version = await localRequest('/api/version')
    const results = []
    await mkdir(directory, { recursive: true })
    const startedAt = new Date().toISOString()
    const system =
      'You propose the next AI Desktop Studio tool call. This is an offline selection test; tools will NOT be executed. Use exactly one tool for the user request, with only specified or necessary arguments. Use the provided state and never invent identifiers or consent tokens. The tool descriptions are the source of truth.'
    for (const item of modelCases) {
      const started = performance.now()
      let response: unknown
      let verdict: { passed: boolean; reason: string }
      try {
        response = await localRequest('/api/chat', {
          model: MODEL,
          stream: false,
          think: false,
          keep_alive: '2m',
          options: {
            temperature: 0,
            seed: 42,
            num_ctx: 8192,
            num_predict: 256,
          },
          messages: [
            { role: 'system', content: system },
            {
              role: 'user',
              content: `State: ${item.context}\nRequest: ${item.prompt}`,
            },
          ],
          tools: tools.map(tool => ({
            type: 'function',
            function: {
              name: tool.name,
              description: tool.description,
              parameters: tool.inputSchema,
            },
          })),
        })
        verdict = grade(response, item.expected, tools)
      } catch (error) {
        verdict = {
          passed: false,
          reason: error instanceof Error ? error.message : 'Inference error',
        }
      }
      results.push({
        ...item,
        ...verdict,
        elapsedMs: Math.round(performance.now() - started),
        response,
      })
      console.log(`${item.id}: ${verdict.passed ? 'PASS' : 'FAIL'} — ${verdict.reason}`)
      await writeFile(
        join(directory, 'baseline.json'),
        JSON.stringify(
          {
            startedAt,
            model: MODEL,
            installed,
            metadata,
            version,
            catalogueFileHash: sha256(catalogueBytes),
            appRevision: record(catalogue) ? catalogue.appRevision : null,
            protocol: {
              system,
              think: false,
              temperature: 0,
              seed: 42,
              numCtx: 8192,
              numPredict: 256,
              toolNames: tools.map(t => t.name),
              syntheticCases: true,
              executedActions: false,
              trained: false,
            },
            results,
          },
          null,
          2,
        ),
      )
    }
    const passed = results.filter(item => item.passed).length
    await writeFile(
      join(directory, 'baseline.md'),
      `# Premier essai local Qwen\n\n${passed}/${results.length} propositions exactes. Aucun outil exécuté, aucun entraînement.\n\nÉchantillon synthétique : 2 demandes par langue sur 15 langues, puis 4 demandes françaises. Ce résultat ne mesure ni les 310 actions, ni les parcours complets, ni la fiabilité mondiale. Les traductions doivent encore être relues par des locuteurs.\n\n| Cas | Résultat | Durée (ms) |\n|---|---|---|\n${results.map(item => `| ${item.id} | ${item.passed ? 'Conforme' : 'À revoir'} | ${item.elapsedMs} |`).join('\n')}\n\nLes sorties et paramètres complets sont dans baseline.json. Le catalogue utilisé est figé par empreinte ; sa fraîcheur doit être contrôlée avant une exécution réelle.\n`,
    )
    console.log(`Result: ${passed}/${results.length}; report: ${join(directory, 'baseline.md')}`)
    return []
  },
  'Local model command completed. No Studio action executed.',
  'Model command failed',
)
