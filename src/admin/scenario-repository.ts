import { mkdir, readdir, readFile } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { sha256 } from '../catalogue/catalogue.ts'
import { assertNoSymlink, atomicWrite } from '../files.ts'
import { absent, record } from '../json.ts'
import { validateScenarioBindings } from '../scenarios/bindings.ts'
import { benchReadiness } from '../scenarios/capabilities.ts'
import { type CaseSource, caseSourcePath, writeCaseSource } from '../scenarios/case-source.ts'
import { type DeclarativeScenario, parseScenario } from '../scenarios/declarative.ts'
import {
  isJourneyFile,
  isJourneyId,
  JOURNEYS_DIRECTORY,
  journeySource,
} from '../scenarios/identity.ts'
import { type InventoryCase, readInventory } from '../scenarios/inventory.ts'
import { validateTemplates } from '../scenarios/locales.ts'
import { checkScenarioInputs } from '../scenarios/preflight.ts'
import { cataloguePath } from '../studio/checkout.ts'
import { readScenarioActivation } from './scenario-activation.ts'
import { loadQaStatusIndex, type ScenarioQaStatus } from './scenario-qa-state.ts'
import { scenarioSourceSnapshot } from './scenario-source-cache.ts'

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
  qa?: ScenarioQaStatus
  family?: string
  tags?: string[]
  plan?: DeclarativeScenario
}
const queues = new Map<string, Promise<unknown>>()

/**
 * A design case is a Markdown row, not an executable plan; it reads the same from every route.
 * The inventory has already decided which specification applies; the canonical file is passed
 * only for what it alone knows — where it lives, its tags, and the revision it is edited against.
 */
function caseEntry(item: InventoryCase, canonical?: CaseSource): ScenarioEntry {
  const { id, source, specification } = item
  const hash = sha256(specification)
  return {
    id,
    kind: 'case',
    title: specification,
    // Where the file actually is, which after a moved row is not yet where its family points.
    source: canonical ? caseSourcePath(id, canonical.source) : `docs/scenarios/${source}`,
    family: source.replace(/\.md$/, ''),
    tags: canonical?.tags ?? [],
    revision: canonical ? sha256(JSON.stringify(canonical)) : hash,
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
    const entry = await this.sourceDetail(id, table)
    if (table) return entry
    const qa = await loadQaStatusIndex(this.root)
    return { ...entry, qa: qa.statusFor(entry.id, entry.scenarioHash, entry.ready) }
  }
  private async sourceDetail(id: string, table?: LocaleTable): Promise<ScenarioEntry> {
    if (!isJourneyId(id)) {
      const entries = await scenarioSourceSnapshot(this.root, 'case', () => this.readCases())
      const item = entries.find(entry => entry.id === id)
      if (!item) throw new ScenarioRepositoryError(404, 'Scenario not found')
      return structuredClone(item)
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
  async list(
    options: { query?: string; offset?: number; limit?: number; kind?: 'case' | 'journey' } = {},
  ): Promise<{ total: number; items: ScenarioEntry[] }> {
    if (options.kind !== undefined && options.kind !== 'case' && options.kind !== 'journey')
      throw new ScenarioRepositoryError(400, 'Invalid scenario kind')
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
    const entries = await scenarioSourceSnapshot(this.root, options.kind, async () => {
      const [cases, journeys] = await Promise.all([
        options.kind === 'journey' ? [] : this.readCases(),
        options.kind === 'case' ? [] : this.readJourneys(),
      ])
      return [...journeys, ...cases]
    })
    const qa = await loadQaStatusIndex(this.root)
    const query = (options.query ?? '').toLocaleLowerCase()
    // QA is a verdict on an executed journey; a design case has no plan to run, so it has none.
    const all = entries
      .map(item =>
        item.kind === 'journey'
          ? { ...item, qa: qa.statusFor(item.id, item.scenarioHash, item.ready) }
          : item,
      )
      .filter(item => `${item.id} ${item.title}`.toLocaleLowerCase().includes(query))
    return { total: all.length, items: structuredClone(all.slice(offset, offset + limit)) }
  }
  private async readCases(): Promise<ScenarioEntry[]> {
    // The inventory reads the canonical store once and says which files it accepted; asking the
    // raw map again would let this reader keep an overlay the inventory has already dropped.
    const { cases, overlays } = await readInventory(this.root)
    return cases.map(item => caseEntry(item, overlays.get(item.id)))
  }
  private async readJourneys(): Promise<ScenarioEntry[]> {
    const files = (await readdir(join(this.root, JOURNEYS_DIRECTORY))).filter(isJourneyFile).sort()
    const locales = await this.readLocales()
    return Promise.all(files.map(file => this.detail(file.slice(0, -5), locales)))
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
    await assertNoSymlink(
      this.root,
      relative(this.root, target),
      () => new ScenarioRepositoryError(400, 'Symlinked source is not writable'),
    )
    await mkdir(resolve(target, '..'), { recursive: true })
    await atomicWrite(target, text, 0o600)
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
        /[\r\n]/.test(specification)
      )
        throw new ScenarioRepositoryError(
          400,
          'A case specification must be a single nonempty line',
        )
      const current = await this.currentAt(id, expectedRevision)
      if (current.kind !== 'case') throw new ScenarioRepositoryError(400, 'Not a design case')
      // `detail` already resolved the entry from the inventory, and a case entry carries the
      // family its source file is named after; re-reading every canonical file buys nothing.
      if (!current.family) throw new ScenarioRepositoryError(409, 'Case disappeared from inventory')
      await writeCaseSource(this.root, {
        version: 1,
        id,
        source: `${current.family}.md`,
        specification: specification.trim(),
        tags: current.tags ?? [],
      })
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

const PAGE = 500
/**
 * One pagination walk for every reader that needs the whole catalogue, with the guards a
 * partial or shifting page requires. Callers inject `list` so a double stays a double.
 * The remaining pages are asked for together: the source snapshot rechecks every file per
 * request and collapses concurrent pages into one sweep, so a walk in series pays it once
 * per page for nothing.
 */
export async function listAllScenarios(
  list: (options: { offset: number; limit: number }) => Promise<{
    total: number
    items: ScenarioEntry[]
  }>,
  maximum = 10000,
): Promise<ScenarioEntry[]> {
  const invalid = () => new Error('Pagination des scénarios invalide')
  const first = await list({ offset: 0, limit: PAGE })
  if (first.total > maximum) throw new Error('Catalogue de scénarios trop volumineux')
  if (!first.items.length && first.total) throw invalid()
  const offsets: number[] = []
  for (let offset = first.items.length; offset < first.total; offset += PAGE) offsets.push(offset)
  const rest = await Promise.all(offsets.map(offset => list({ offset, limit: PAGE })))
  // A page from a shifted catalogue reports a different total; the walk is then not one read.
  if (rest.some(page => page.total !== first.total || !page.items.length)) throw invalid()
  const entries = [...first.items, ...rest.flatMap(page => page.items)]
  if (entries.length !== first.total) throw invalid()
  if (new Set(entries.map(entry => entry.id)).size !== entries.length)
    throw new Error('Scénarios dupliqués dans le catalogue')
  return entries
}
