import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { sha256 } from '../src/catalogue/catalogue.ts'
import { record } from '../src/json.ts'
import { designCase } from '../src/scenarios/case-design.ts'
import { inventorySourceHashes, readInventory } from '../src/scenarios/inventory.ts'
import { validateTemplates } from '../src/scenarios/locales.ts'
import { cataloguePath } from '../src/studio/checkout.ts'
import { runCheck } from './run-check.ts'

const root = fileURLToPath(new URL('../', import.meta.url))
interface BenchEntry {
  rank: string
  source: string
  line: number
  setupExpression: string
  oracleExpression: string
}
const fixtureReferences = (entries: BenchEntry[]) =>
  entries.map(({ rank, source, line, setupExpression }) => ({
    rank,
    source,
    line,
    setupExpression,
  }))
const oracleReferences = (entries: BenchEntry[]) =>
  entries.map(({ rank, oracleExpression }) => ({ rank, oracleExpression }))
await runCheck(
  async () => {
    const inventory = await readInventory(root)
    const { sources } = inventory
    const sourceHashes = inventorySourceHashes(sources, inventory.cases)
    const catalogue: unknown = JSON.parse(await readFile(cataloguePath(root), 'utf8'))
    if (
      !record(catalogue) ||
      !Array.isArray(catalogue.actions) ||
      !Array.isArray(catalogue.languages)
    )
      throw new Error('Invalid catalogue')
    const languages: unknown[] = catalogue.languages
    if (!languages.every((language): language is string => typeof language === 'string'))
      throw new Error('Invalid languages')
    const actions: unknown[] = catalogue.actions
    const actionMap = new Map<string, Record<string, unknown>>()
    for (const action of actions) {
      if (!record(action) || typeof action.name !== 'string' || !record(action.translations))
        throw new Error('Invalid action')
      if (actionMap.has(action.name)) throw new Error(`Duplicate action ${action.name}`)
      actionMap.set(action.name, action)
    }
    const covered = new Set(inventory.cases.map(item => item.action))
    for (const name of actionMap.keys())
      if (!covered.has(name)) throw new Error(`Action has no scenario: ${name}`)
    const output = join(root, 'artifacts/scenarios')
    await mkdir(output, { recursive: true })
    const authored = join(root, 'datasets/scenarios')
    const bindings = JSON.parse(await readFile(join(authored, 'bindings.json'), 'utf8'))
    const french = JSON.parse(await readFile(join(authored, 'templates.fr.json'), 'utf8'))
    const benchLinks = JSON.parse(await readFile(join(authored, 'action-bench-links.json'), 'utf8'))
    const bench = (await readFile(join(authored, 'studio-bench.jsonl'), 'utf8'))
      .trim()
      .split('\n')
      .map(line => JSON.parse(line))
    const journeyFrench = JSON.parse(await readFile(join(authored, 'journeys.fr.json'), 'utf8'))
    /** A missing locale file is an untranslated language, not a preparation failure. */
    const loadLocales = async (folder: string, source: Record<string, string>) => {
      const templates: Record<string, Record<string, string>> = { fr: source }
      for (const language of languages) {
        if (language === 'fr') continue
        try {
          const locale = JSON.parse(
            await readFile(join(authored, folder, `${language}.json`), 'utf8'),
          )
          templates[language] = locale.templates
        } catch (error) {
          if (!record(error) || error.code !== 'ENOENT') throw error
        }
      }
      return templates
    }
    const localeTemplates = await loadLocales('locales', french)
    const journeyLocales = await loadLocales('journey-locales', journeyFrench)
    for (const language of languages) {
      for (const [name, source, translated] of [
        ['instructions', french, localeTemplates[language]],
        ['journeys', journeyFrench, journeyLocales[language]],
      ] as const) {
        const errors = validateTemplates(source, translated)
        if (errors.length) throw new Error(`${language}/${name}: ${errors.join('; ')}`)
      }
    }
    const referencesByAction = new Map<string, BenchEntry[]>()
    const files: Record<string, string[]> = {}
    const localizationSlots = inventory.cases.length * languages.length
    for (const item of inventory.cases) {
      const action = actionMap.get(item.action)
      if (!action || !record(action.translations))
        throw new Error(`Unknown scenario action: ${item.action}`)
      const translations = action.translations
      const binding = bindings[item.id]
      if (!binding || typeof binding.template !== 'string')
        throw new Error(`Missing template binding: ${item.id}`)
      const localizedInstruction = (language: string, title: string) => {
        const template = localeTemplates[language]?.[binding.template]
        if (!template) return null
        return template.replace(/\{([^{}]+)\}/g, (_match, key: string) => {
          if (key === 'action') return title
          if (!record(binding.values) || !(key in binding.values))
            throw new Error(`Missing placeholder: ${item.id}/${key}`)
          return String(binding.values[key])
        })
      }
      if (!record(action.inputSchema)) throw new Error(`Missing action schema: ${item.action}`)
      const design = designCase(item, action, action.inputSchema)
      let references = referencesByAction.get(item.action)
      if (!references) {
        const ranks = new Set<unknown>(benchLinks[item.action] ?? [])
        references = bench.filter((entry: { rank: string }) => ranks.has(entry.rank))
        referencesByAction.set(item.action, references)
      }
      const localized = Object.fromEntries(
        languages.map(language => {
          const text: unknown = translations[language]
          if (
            !record(text) ||
            typeof text.title !== 'string' ||
            typeof text.description !== 'string'
          )
            throw new Error(`Missing action translation: ${item.action}/${language}`)
          const instruction = localizedInstruction(language, text.title)
          return [
            language,
            {
              actionTitle: text.title,
              actionDescription: text.description,
              testInstruction: instruction,
              scenarioPrompt: null,
              status: instruction
                ? 'test-instruction-draft-user-dialogue-required'
                : 'scenario-wording-required',
            },
          ]
        }),
      )
      const entry = {
        ...item,
        groupId: item.action,
        sourceHash: sourceHashes[item.source] ?? sha256(''),
        catalogueRevision: catalogue.appRevision,
        declaredPreconditions: {
          capabilities: action.capabilities ?? {},
          requirements: action.requires ?? {},
        },
        inputSchema: action.inputSchema,
        localized,
        fixture: {
          ...design.fixture,
          studioBenchReferences: fixtureReferences(references),
        },
        expectedResult: design.expectedResult,
        oracle: {
          ...design.oracle,
          studioBenchReferences: oracleReferences(references),
        },
        preparationStatus: design.preparationStatus,
        split: 'unassigned',
        executionStatus: 'not-run',
        trainingApproved: false,
        missing: [
          'runtime-fixture-binding-and-review',
          'action-specific-oracle-review',
          'natural-user-dialogue-for-conversational-cases',
          'review',
          'execution',
        ],
      }
      const file = item.source.replace(/\.md$/, '.jsonl')
      const rows = files[file] ?? []
      rows.push(JSON.stringify(entry))
      files[file] = rows
    }
    for (const [file, rows] of Object.entries(files))
      await writeFile(join(output, file), `${rows.join('\n')}\n`)
    const journeys = inventory.journeys.map(item => {
      const actionLine = item.specification.match(/Actions candidates : (.*)/)?.[1] ?? ''
      const names = [...actionLine.matchAll(/`([^`]+)`/g)]
        .map(match => match[1])
        .filter((name): name is string => Boolean(name))
      for (const name of names)
        if (!actionMap.has(name)) throw new Error(`Unknown journey action ${name}`)
      const ranks = new Set(names.flatMap(name => benchLinks[name] ?? []))
      const references = bench.filter((entry: { rank: string }) => ranks.has(entry.rank))
      return {
        ...item,
        sourceHash: sourceHashes[item.source] ?? sha256(''),
        localized: Object.fromEntries(
          languages.map(language => [
            language,
            {
              scenarioPrompt: journeyLocales[language]?.[item.id] ?? null,
              status: journeyLocales[language]?.[item.id]
                ? 'draft-semantic-review-required'
                : 'translation-pending',
            },
          ]),
        ),
        fixture: {
          isolation: 'disposable-vm-only',
          studioBenchCandidates: fixtureReferences(references),
          selectionAndRuntimeBindingRequired: true,
        },
        candidateSteps: names.map(name => ({
          action: name,
          inputSchema: actionMap.get(name)?.inputSchema,
          argumentsAndDependenciesRequireReview: true,
        })),
        expectedResult:
          item.specification.match(/^- Contrôle : (.*)$/m)?.[1] ?? 'Missing authored control',
        oracle: {
          studioBenchCandidates: oracleReferences(references),
          composedOracleRequired: true,
        },
        executionStatus: 'not-run',
        trainingApproved: false,
      }
    })
    await writeFile(
      join(output, 'journeys.jsonl'),
      `${journeys.map(item => JSON.stringify(item)).join('\n')}\n`,
    )
    const summary = {
      cases: inventory.cases.length,
      journeys: inventory.journeys.length,
      actions: actionMap.size,
      languages,
      localizationSlots,
      journeyLocalizationSlots: inventory.journeys.length * languages.length,
      localizedInstructionLanguages: Object.keys(localeTemplates),
      localizedJourneyLanguages: Object.keys(journeyLocales),
      benchReferences: bench.length,
      readyForTraining: 0,
      catalogueRevision: catalogue.appRevision,
      sourceHashes,
      files: [...Object.keys(files), 'journeys.jsonl'],
    }
    await writeFile(join(output, 'manifest.json'), JSON.stringify(summary, null, 2))
    await writeFile(
      join(output, 'README.md'),
      `# Inventaire structuré complet\n\n${summary.cases} cas, ${summary.journeys} parcours, ${summary.actions} actions, ${languages.length} langues.\n\nLes fiches conservent les spécifications existantes et les traductions des actions issues de Studio. Les instructions de test sont déclinées par langue ; les variantes de paramètres et références aux fixtures/oracles Studio sont renseignées. Les bindings réels, dialogues utilisateur spécifiques et relectures métier restent obligatoires : aucun enregistrement n’est autorisé pour l’entraînement.\n\nCette sortie générée est remplaçable : ne pas la modifier à la main. Les rédactions futures doivent vivre dans des fichiers sources versionnés distincts.\n\n${summary.files.map(file => `- [${file}](${file})`).join('\n')}\n`,
    )
    console.log(
      `${summary.cases} cases; ${summary.journeys} journeys; ${localizationSlots} case-language slots; 0 training-approved records.`,
    )
    return []
  },
  'Complete inventory extracted; missing authored content remains explicit.',
  'Scenario preparation failed',
)
