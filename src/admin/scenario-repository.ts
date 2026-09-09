import { randomUUID } from 'node:crypto'
import { lstat, mkdir, readdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { sha256 } from '../catalogue/catalogue.ts'
import { absent, record } from '../json.ts'
import { validateScenarioBindings } from '../scenarios/bindings.ts'
import { benchReadiness } from '../scenarios/capabilities.ts'
import { type DeclarativeScenario, parseScenario } from '../scenarios/declarative.ts'
import {
  isJourneyFile,
  isJourneyId,
  JOURNEYS_DIRECTORY,
  journeySource,
} from '../scenarios/identity.ts'
import { parseInventory, readScenarioSources } from '../scenarios/inventory.ts'
import { validateTemplates } from '../scenarios/locales.ts'
import { checkScenarioInputs } from '../scenarios/preflight.ts'
import { cataloguePath } from '../studio/checkout.ts'
import { readScenarioActivation } from './scenario-activation.ts'

export class ScenarioRepositoryError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}
interface LocaleTable {
  french: Record<string, unknown>
  locales: { language: string; templates: Record<string, unknown>; status: string }[]
}
export interface ScenarioEntry {
  id: string
  kind: 'case' | 'journey'
  title: string
  source: string
  revision: string
  scenarioHash: string
  active: boolean
  ready: boolean
  missing: string[]
  blockers: string[]
  languages: { language: string; text: string; status: string }[]
  plan?: DeclarativeScenario
}
const queues = new Map<string, Promise<unknown>>()

/** A design case is a Markdown row, not an executable plan; it reads the same from every route. */
function caseEntry(id: string, specification: string, source: string): ScenarioEntry {
  const hash = sha256(specification)
  return {
    id,
    kind: 'case',
    title: specification,
    source: `docs/scenarios/${source}`,
    revision: hash,
    scenarioHash: hash,
    active: false,
    ready: false,
    missing: [],
    blockers: ['Executable plan required'],
    languages: [],
  }
}

/** Authored sources only. Generated artifacts and recorded evidence are never mutated here. */
export class ScenarioRepository {
  readonly root: string
  constructor(root: string) {
    this.root = resolve(root)
  }
  /** Every edit is based on a revision; a stale one means someone else saved first. */
  private async currentAt(id: string, expectedRevision: string): Promise<ScenarioEntry> {
    const current = await this.detail(id)
    if (current.revision !== expectedRevision)
      throw new ScenarioRepositoryError(409, 'Scenario changed; reload before saving')
    return current
  }
  private async read(path: string): Promise<string> {
    return readFile(join(this.root, path), 'utf8')
  }
  private async active(id: string): Promise<boolean> {
    return (await readScenarioActivation(this.root, id)) ?? false
  }
  /**
   * Every translation source, read once. Listing the catalogue asks the same question for each
   * journey, so the table is loaded per request instead of per entry.
   */
  private async readLocales(): Promise<LocaleTable> {
    const directory = 'datasets/scenarios/journey-locales'
    const table: LocaleTable = { french: {}, locales: [] }
    try {
      const french: unknown = JSON.parse(await this.read('datasets/scenarios/journeys.fr.json'))
      if (record(french)) table.french = french
      const files = (await readdir(join(this.root, directory))).sort()
      const loaded = await Promise.all(
        files
          .filter(file => /^[a-zA-Z-]+\.json$/.test(file))
          .map(async file => ({
            language: file.slice(0, -5),
            value: JSON.parse(await this.read(`${directory}/${file}`)) as unknown,
          })),
      )
      for (const { language, value } of loaded)
        if (record(value) && record(value.templates))
          table.locales.push({
            language,
            templates: value.templates,
            status: typeof value.status === 'string' ? value.status : 'review-required',
          })
    } catch (error) {
      if (!absent(error)) throw error
    }
    return table
  }

  /** The French text is the authored source; every other language is a translation of it. */
  private languagesOf(id: string, table: LocaleTable): ScenarioEntry['languages'] {
    const result: ScenarioEntry['languages'] = []
    const french = table.french[id]
    if (typeof french === 'string')
      result.push({ language: 'fr', text: french, status: 'authored-review-required' })
    for (const locale of table.locales) {
      const text = locale.templates[id]
      if (typeof text === 'string')
        result.push({ language: locale.language, text, status: locale.status })
    }
    return result
  }

  async detail(id: string, table?: LocaleTable): Promise<ScenarioEntry> {
    if (!isJourneyId(id)) {
      const inventory = parseInventory(await readScenarioSources(this.root))
      const item = inventory.cases.find(entry => entry.id === id)
      if (!item) throw new ScenarioRepositoryError(404, 'Scenario not found')
      return caseEntry(id, item.specification, item.source)
    }
    const source = journeySource(id)
    let raw: string
    try {
      raw = await this.read(source)
    } catch (error) {
      if (absent(error)) throw new ScenarioRepositoryError(404, 'Scenario not found')
      throw error
    }
    const plan = parseScenario(JSON.parse(raw))
    if (plan.id !== id) throw new ScenarioRepositoryError(400, 'Scenario identity mismatch')
    const active = await this.active(id)
    const readiness = benchReadiness(plan)
    const languages = this.languagesOf(id, table ?? (await this.readLocales()))
    return {
      id,
      kind: 'journey',
      title: plan.request,
      source,
      revision: sha256(`${raw}\0${active}\0${JSON.stringify(languages)}`),
      scenarioHash: sha256(raw),
      active,
      ready: readiness.ready,
      missing: [...readiness.missing, ...readiness.unbound],
      blockers: readiness.blockers,
      languages,
      plan,
    }
  }
  async list(options: { query?: string; offset?: number; limit?: number } = {}) {
    const offset = options.offset ?? 0,
      limit = options.limit ?? 100
    if (
      !Number.isInteger(offset) ||
      offset < 0 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 500
    )
      throw new ScenarioRepositoryError(400, 'Invalid pagination')
    const inventory = parseInventory(await readScenarioSources(this.root))
    const cases = inventory.cases.map(item => caseEntry(item.id, item.specification, item.source))
    const files = (await readdir(join(this.root, JOURNEYS_DIRECTORY))).filter(isJourneyFile).sort()
    const locales = await this.readLocales()
    const journeys = await Promise.all(files.map(file => this.detail(file.slice(0, -5), locales)))
    const query = (options.query ?? '').toLocaleLowerCase()
    const all = [...journeys, ...cases].filter(item =>
      `${item.id} ${item.title}`.toLocaleLowerCase().includes(query),
    )
    return { total: all.length, items: all.slice(offset, offset + limit) }
  }
  private async serialize<T>(work: () => Promise<T>): Promise<T> {
    const previous = queues.get(this.root) ?? Promise.resolve()
    const next = previous.catch(() => {}).then(work)
    queues.set(this.root, next)
    try {
      return await next
    } finally {
      if (queues.get(this.root) === next) queues.delete(this.root)
    }
  }
  private async write(path: string, text: string) {
    // Reject symlinked parents/targets rather than allow source writes to escape the repository.
    const target = join(this.root, path)
    let current = this.root
    for (const part of relative(this.root, target).split('/')) {
      current = join(current, part)
      try {
        if ((await lstat(current)).isSymbolicLink())
          throw new ScenarioRepositoryError(400, 'Symlinked source is not writable')
      } catch (error) {
        if (!absent(error)) throw error
      }
    }
    const parent = resolve(target, '..')
    await mkdir(parent, { recursive: true })
    const temp = join(parent, `.${randomUUID()}.tmp`)
    try {
      await writeFile(temp, text, { flag: 'wx', mode: 0o600 })
      await rename(temp, target)
    } finally {
      await rm(temp, { force: true })
    }
  }
  private async validate(value: unknown) {
    const plan = parseScenario(value)
    if (!isJourneyId(plan.id))
      throw new ScenarioRepositoryError(400, 'Journey id must be P followed by three digits')
    const catalogue: unknown = JSON.parse(await readFile(cataloguePath(this.root), 'utf8'))
    if (!record(catalogue)) throw new ScenarioRepositoryError(400, 'Invalid catalogue')
    checkScenarioInputs(plan, catalogue.mcpTools)
    validateScenarioBindings(plan)
    return plan
  }
  async create(value: unknown) {
    return this.serialize(async () => {
      const plan = await this.validate(value)
      try {
        await this.detail(plan.id)
        throw new ScenarioRepositoryError(409, 'Scenario already exists')
      } catch (error) {
        if (!(error instanceof ScenarioRepositoryError) || error.status !== 404) throw error
      }
      await this.write(journeySource(plan.id), `${JSON.stringify(plan, null, 2)}\n`)
      return this.detail(plan.id)
    })
  }
  async update(id: string, expectedRevision: string, value: unknown) {
    return this.serialize(async () => {
      if (!isJourneyId(id)) throw new ScenarioRepositoryError(400, 'Design cases are read-only')
      const current = await this.currentAt(id, expectedRevision)
      const plan = await this.validate(value)
      if (plan.id !== id) throw new ScenarioRepositoryError(400, 'Scenario identity cannot change')
      await this.write(current.source, `${JSON.stringify(plan, null, 2)}\n`)
      return this.detail(id)
    })
  }
  /** Writes one translation into its locale file; the French source is the reference. */
  private async writeTranslation(id: string, language: string, text: string): Promise<void> {
    const path =
      language === 'fr'
        ? 'datasets/scenarios/journeys.fr.json'
        : `datasets/scenarios/journey-locales/${language}.json`
    const value: unknown = JSON.parse(await this.read(path))
    if (!record(value)) throw new Error('Invalid locale source')
    if (language === 'fr') value[id] = text
    else {
      if (!record(value.templates)) throw new Error('Invalid locale templates')
      value.templates[id] = text
      value.status = 'manual-edit-review-required'
    }
    await this.write(path, `${JSON.stringify(value, null, 2)}\n`)
  }

  /** A translation may not invent or drop a placeholder the French source defines. */
  private async assertTranslatable(
    id: string,
    expectedRevision: string,
    language: string,
    text: string,
  ): Promise<void> {
    if (!isJourneyId(id) || !/^[a-z]{2}$/.test(language) || !text.trim())
      throw new ScenarioRepositoryError(400, 'Invalid journey translation')
    const current = await this.currentAt(id, expectedRevision)
    if (!current.languages.some(item => item.language === language))
      throw new ScenarioRepositoryError(400, 'Translation language not configured')
    const french: unknown = JSON.parse(await this.read('datasets/scenarios/journeys.fr.json'))
    if (!record(french) || typeof french[id] !== 'string') throw new Error('Missing French source')
    if (validateTemplates({ [id]: french[id] }, { [id]: text }).length)
      throw new ScenarioRepositoryError(400, 'Translation placeholders must match the source')
  }

  async updateLanguage(id: string, expectedRevision: string, language: string, text: string) {
    return this.serialize(async () => {
      await this.assertTranslatable(id, expectedRevision, language, text)
      await this.writeTranslation(id, language, text)
      return this.detail(id)
    })
  }
  async updateCase(id: string, expectedRevision: string, specification: string) {
    return this.serialize(async () => {
      if (
        typeof specification !== 'string' ||
        !specification.trim() ||
        /[\r\n|]/.test(specification)
      )
        throw new ScenarioRepositoryError(
          400,
          'A case specification must be one nonempty Markdown table cell',
        )
      const current = await this.currentAt(id, expectedRevision)
      if (current.kind !== 'case') throw new ScenarioRepositoryError(400, 'Not a design case')
      const raw = await this.read(current.source)
      const prefix = `| \`${id}\` | `
      const lines = raw.split('\n')
      const matches = lines.flatMap((line, index) => (line.startsWith(prefix) ? [index] : []))
      const index = matches[0]
      if (matches.length !== 1 || index === undefined)
        throw new ScenarioRepositoryError(409, 'Source row no longer matches')
      lines[index] = `${prefix}${specification.trim()} |`
      await this.write(current.source, lines.join('\n'))
      return this.detail(id)
    })
  }
  async setActive(id: string, expectedRevision: string, active: boolean) {
    return this.serialize(async () => {
      if (!isJourneyId(id) || typeof active !== 'boolean')
        throw new ScenarioRepositoryError(400, 'Invalid activation')
      const current = await this.currentAt(id, expectedRevision)
      if (active && !current.ready)
        throw new ScenarioRepositoryError(400, 'Scenario prerequisites are incomplete')
      await this.write(
        `datasets/admin/activation/${id}.json`,
        `${JSON.stringify({ id, active }, null, 2)}\n`,
      )
      return this.detail(id)
    })
  }
}
