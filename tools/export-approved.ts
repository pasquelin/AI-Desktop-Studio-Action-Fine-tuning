import { readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { assertCurrentJourneySources } from '../src/admin/current-sources.ts'
import { sha256 } from '../src/catalogue/catalogue.ts'
import { assertFresh, inspectSource } from '../src/catalogue/source.ts'
import { record } from '../src/json.ts'
import {
  prepareApprovedExport,
  publishApprovedExport,
  verifyRecordedConversation,
} from '../src/scenarios/export-approved.ts'
import { readStudioLink } from '../src/studio/checkout.ts'
import { readRecord, stateDir } from '../src/vm/ownership.ts'
import { runCheck } from './run-check.ts'

const USAGE =
  'Usage: node tools/export-approved.ts <reviewed-bundle.json> <current-scenario-manifest.json>'

/** The catalogue must be self-consistent and still match the Studio checkout it describes. */
async function readCatalogue(root: string) {
  const link = readStudioLink(join(root, '.studio-source.json'))
  if (!link) throw new Error('Studio source required for approved export')
  const text = await readFile(link.output, 'utf8')
  const catalogue: unknown = JSON.parse(text)
  if (
    !record(catalogue) ||
    typeof catalogue.appRevision !== 'string' ||
    typeof catalogue.catalogueHash !== 'string' ||
    !record(catalogue.sourceHashes)
  )
    throw new Error('Invalid catalogue')
  const hashes: Record<string, string> = {}
  for (const [key, value] of Object.entries(catalogue.sourceHashes)) {
    if (typeof value !== 'string') throw new Error('Invalid source hash')
    hashes[key] = value
  }
  const { catalogueHash, ...body } = catalogue
  if (sha256(JSON.stringify(body)) !== catalogueHash) throw new Error('Catalogue hash mismatch')
  assertFresh(
    { appRevision: catalogue.appRevision, sourceHashes: hashes },
    inspectSource(link.sourceRoot),
  )
  return { appRevision: catalogue.appRevision, catalogueHash: sha256(text) }
}

/** Each example must name a VM run this repository owns, and that run's own report must agree. */
async function verifyExamples(root: string, bundle: unknown): Promise<void> {
  if (!record(bundle) || !Array.isArray(bundle.examples)) throw new Error('Invalid examples')
  const state = stateDir(root)
  for (const example of bundle.examples) {
    if (!record(example) || !record(example.evidence) || typeof example.evidence.runId !== 'string')
      throw new Error('Missing VM run identity')
    const name = example.evidence.runId
    const owned = await readRecord(name, root, state)
    if (owned.mode !== 'build' || !['build-passed', 'removed'].includes(owned.status))
      throw new Error('VM run ownership/status does not permit export')
    const report: unknown = JSON.parse(
      await readFile(join(state, name, 'results', 'scenario.json'), 'utf8'),
    )
    verifyRecordedConversation(example, report)
  }
}

await runCheck(
  async () => {
    const [bundleFile, scenarioManifest, ...extra] = process.argv.slice(2)
    if (!bundleFile || !scenarioManifest || extra.length) throw new Error(USAGE)
    const root = resolve(import.meta.dirname, '..')
    const { appRevision, catalogueHash } = await readCatalogue(root)
    const manifest: unknown = JSON.parse(await readFile(scenarioManifest, 'utf8'))
    if (!record(manifest) || !record(manifest.scenarioHashes))
      throw new Error('Current manifest requires scenarioHashes')
    await assertCurrentJourneySources(root, manifest.scenarioHashes)
    const bundle: unknown = JSON.parse(await readFile(bundleFile, 'utf8'))
    const prepared = prepareApprovedExport(bundle, {
      studioRevision: appRevision,
      catalogueHash,
      scenarioHashes: manifest.scenarioHashes,
    })
    await verifyExamples(root, bundle)
    const destination = await publishApprovedExport(prepared, join(root, 'artifacts/dataset'))
    console.log(`Approved dataset: ${destination}`)
    return []
  },
  'Approved export published; training was not started.',
  'Approved export rejected',
)
