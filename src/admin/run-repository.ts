import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { sha256 } from '../catalogue/catalogue.ts'
import { optionalJson } from '../files.ts'
import { absent, record } from '../json.ts'
import { isJourneyId, journeySource } from '../scenarios/identity.ts'
import { isManagedName, readRecord, stateDir } from '../vm/ownership.ts'
import { listSnapshots } from '../vm/snapshots.ts'

export interface RunSummary {
  id: string
  createdAt: string
  lifecycle: string
  outcome: string
  scenario: string | null
  modelUsed: boolean | null
  passed: number
  failed: number
  blocked: number
  revision: string | null
  issue?: string
}
function summary(id: string, createdAt: string, lifecycle: string, value: unknown): RunSummary {
  const report = record(value) ? value : {}
  const steps = Array.isArray(report.steps) ? report.steps.filter(record) : []
  const provenance = record(report.provenance) ? report.provenance : {}
  return {
    id,
    createdAt,
    lifecycle,
    outcome: ['running', 'passed', 'failed'].includes(String(report.status))
      ? String(report.status)
      : 'not-executed',
    scenario: typeof report.scenario === 'string' ? report.scenario : null,
    modelUsed: typeof report.modelUsed === 'boolean' ? report.modelUsed : null,
    passed: steps.filter(s => s.status === 'passed').length,
    failed: steps.filter(s => s.status === 'failed').length,
    blocked: steps.filter(s => s.status === 'blocked').length,
    revision: typeof provenance.studioRevision === 'string' ? provenance.studioRevision : null,
  }
}
/** Only public evidence from owned builds; never expose VM keys or arbitrary files. */
export class RunRepository {
  readonly root: string
  constructor(root: string) {
    this.root = root
  }
  async list(): Promise<RunSummary[]> {
    let names: string[]
    try {
      names = await readdir(stateDir(this.root))
    } catch (error) {
      if (absent(error)) return []
      throw error
    }
    const results = await Promise.all(
      names.filter(isManagedName).map(async id => {
        const vm = await readRecord(id, this.root, stateDir(this.root))
        if (vm.mode !== 'build') return null
        const folder = join(stateDir(this.root), id)
        const createdAt = new Date((await stat(folder)).birthtimeMs).toISOString()
        try {
          return summary(
            id,
            createdAt,
            vm.status,
            await optionalJson(join(folder, 'results/scenario.json')),
          )
        } catch {
          return {
            ...summary(id, createdAt, vm.status, null),
            issue: 'Rapport illisible : les résultats ne sont pas vérifiables.',
          }
        }
      }),
    )
    return results
      .filter((item): item is RunSummary => item !== null)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
  async detail(id: string) {
    const vm = await readRecord(id, this.root, stateDir(this.root))
    if (vm.mode !== 'build') throw new Error('Not a test run')
    const folder = join(stateDir(this.root), id)
    const [report, startup, build, plan, provenance, snapshots] = await Promise.all([
      optionalJson(join(folder, 'results/scenario.json')),
      optionalJson(join(folder, 'results/startup.json')),
      optionalJson(join(folder, 'results/build.json')),
      optionalJson(join(folder, 'scenario-spec.json')),
      optionalJson(join(folder, 'provenance.json')),
      listSnapshots(this.root),
    ])
    const frozen = record(plan) ? plan : null
    let currentHash: string | null = null
    if (frozen && typeof frozen.id === 'string' && isJourneyId(frozen.id)) {
      try {
        currentHash = sha256(await readFile(join(this.root, journeySource(frozen.id)), 'utf8'))
      } catch (error) {
        if (!absent(error)) throw error
      }
    }
    const p = record(provenance)
      ? provenance
      : record(report) && record(report.provenance)
        ? report.provenance
        : {}
    return {
      ...summary(id, new Date((await stat(folder)).birthtimeMs).toISOString(), vm.status, report),
      report,
      startup,
      build,
      plan,
      provenance: p,
      snapshots: snapshots.filter(item => item.run === id),
      currentHash,
      sourceMatches:
        currentHash !== null && typeof p.scenarioHash === 'string'
          ? currentHash === p.scenarioHash
          : null,
    }
  }
}
