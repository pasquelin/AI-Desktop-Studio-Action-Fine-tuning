import { lstat, readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { absent, record } from '../json.ts'
import type { QaStatus } from '../qa/status.ts'
import { RANDOM_ID, RANDOM_ID_JSON } from '../scenarios/identity.ts'
import { cataloguePath } from '../studio/checkout.ts'

export interface ScenarioQaStatus {
  status: QaStatus
  reportId?: string
  reportPath?: string
  reason?: string
}
interface Evidence {
  id: string
  outcome: 'passed' | 'failed' | 'blocked'
  hash?: string
  revision?: string
  catalogue?: string
  verified: boolean
  reportId: string
  reportPath: string
  time: number
}
const cache = new Map<string, { signature: string; evidence: Evidence[] }>()

async function reportFiles(root: string) {
  const base = join(root, 'rapports/debug')
  let folders: string[]
  try {
    folders = await readdir(base)
  } catch (error) {
    if (absent(error)) return []
    throw error
  }
  const files = folders
    .filter(name => RANDOM_ID.test(name))
    .map(name => join(base, name, 'scenario.json'))
  try {
    files.push(
      ...(await readdir(join(base, 'campagnes')))
        .filter(name => RANDOM_ID_JSON.test(name))
        .map(name => join(base, 'campagnes', name)),
    )
  } catch (error) {
    if (!absent(error)) throw error
  }
  return files
}
async function fileVersion(path: string) {
  try {
    const stat = await lstat(path)
    if (!stat.isFile() || stat.size > 16 * 1024 * 1024)
      throw new Error('QA evidence is not a bounded regular file')
    return { path, time: stat.mtimeMs, key: `${path}:${stat.size}:${stat.mtimeMs}:${stat.ctimeMs}` }
  } catch (error) {
    if (absent(error)) return null
    throw error
  }
}
function evidenceOf(
  step: unknown,
  reportId: string,
  reportPath: string,
  time: number,
): Evidence | undefined {
  if (
    !record(step) ||
    typeof step.id !== 'string' ||
    !['passed', 'failed', 'blocked'].includes(String(step.status))
  )
    return undefined
  const report = record(step.report) ? step.report : {}
  const provenance = record(report.provenance) ? report.provenance : {}
  const steps = Array.isArray(report.steps) ? report.steps : []
  const verified =
    report.scenario === step.id &&
    report.status === step.status &&
    provenance.kind === 'real-vm' &&
    steps.length > 0 &&
    steps.every(item => record(item) && typeof item.status === 'string') &&
    (step.status !== 'passed' || steps.every(item => record(item) && item.status === 'passed'))
  return {
    id: step.id,
    outcome: step.status as Evidence['outcome'],
    verified,
    reportId,
    reportPath,
    time,
    ...(typeof provenance.scenarioHash === 'string' ? { hash: provenance.scenarioHash } : {}),
    ...(typeof provenance.studioRevision === 'string'
      ? { revision: provenance.studioRevision }
      : {}),
    ...(typeof provenance.catalogueHash === 'string'
      ? { catalogue: provenance.catalogueHash }
      : {}),
  }
}
async function readEvidence(root: string): Promise<Evidence[]> {
  const files = (await Promise.all((await reportFiles(root)).map(fileVersion)))
    .filter(item => item !== null)
    .sort((a, b) => a.path.localeCompare(b.path))
  const signature = files.map(file => file.key).join('\n')
  const previous = cache.get(root)
  if (previous?.signature === signature) return previous.evidence
  const evidence: Evidence[] = []
  for (const file of files) evidence.push(...(await entriesInFile(root, file)))

  evidence.sort((a, b) => b.time - a.time || (a.outcome === 'passed' ? 1 : -1))
  cache.set(root, { signature, evidence })
  return evidence
}

/**
 * The catalogue is megabytes but only two of its fields matter here, and a catalogue export
 * rewrites the file: keep the parsed identity, keyed on the same metadata the evidence uses.
 */
interface CatalogueIdentity {
  key: string | undefined
  appRevision: string | undefined
  catalogueHash: string | undefined
}
const catalogues = new Map<string, CatalogueIdentity>()
async function catalogueIdentity(root: string): Promise<CatalogueIdentity> {
  const path = cataloguePath(root)
  const version = await fileVersion(path)
  if (!version) return { key: undefined, appRevision: undefined, catalogueHash: undefined }
  const hit = catalogues.get(root)
  if (hit?.key === version.key) return hit
  const parsed: unknown = JSON.parse(await readFile(path, 'utf8'))
  const current = record(parsed) ? parsed : {}
  const identity: CatalogueIdentity = {
    key: version.key,
    appRevision: typeof current.appRevision === 'string' ? current.appRevision : undefined,
    catalogueHash: typeof current.catalogueHash === 'string' ? current.catalogueHash : undefined,
  }
  catalogues.set(root, identity)
  return identity
}

/** Current QA display and eligibility use the same latest evidence; never a historical best score. */
export async function loadQaStatusIndex(root: string) {
  const evidence = await readEvidence(root)
  const current = await catalogueIdentity(root)
  const latest = new Map<string, Evidence>()
  for (const item of evidence) if (!latest.has(item.id)) latest.set(item.id, item)
  return {
    statusFor(id: string, scenarioHash: string, ready = true): ScenarioQaStatus {
      const item = latest.get(id)
      if (!item)
        return ready
          ? { status: 'not-tested' }
          : { status: 'blocked', reason: 'Prérequis du scénario incomplets ; aucun essai validé.' }
      const link = { reportId: item.reportId, reportPath: item.reportPath }
      if (item.outcome === 'blocked' && !item.hash)
        return {
          status: 'blocked',
          ...link,
          reason: 'Dernière tentative bloquée avant vérification.',
        }
      if (
        !item.verified ||
        item.hash !== scenarioHash ||
        !item.revision ||
        item.revision !== current.appRevision ||
        !item.catalogue ||
        item.catalogue !== current.catalogueHash
      )
        return {
          status: 'stale',
          ...link,
          reason:
            'La dernière preuve ne correspond pas au scénario et à la version du catalogue actuels, ou est incomplète.',
        }
      return { status: item.outcome, ...link }
    },
  }
}

async function entriesInFile(
  root: string,
  file: { path: string; time: number },
): Promise<Evidence[]> {
  const value: unknown = JSON.parse(await readFile(file.path, 'utf8'))
  if (!record(value)) return []
  const direct = file.path.endsWith('scenario.json')
  const reportId = direct ? (file.path.split('/').at(-2) ?? '') : String(value.id ?? '')
  const candidates = direct
    ? [{ id: value.scenario, status: value.status, report: value }]
    : Array.isArray(value.steps)
      ? value.steps
      : []
  return candidates
    .map(step => evidenceOf(step, reportId, file.path.slice(root.length + 1), file.time))
    .filter((item): item is Evidence => item !== undefined)
}
