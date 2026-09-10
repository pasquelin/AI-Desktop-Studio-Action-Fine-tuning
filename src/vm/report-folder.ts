import { copyFile, lstat, mkdir, open, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { optionalJson } from '../files.ts'
import { absent, record as isRecord } from '../json.ts'
import { readRecord, stateDir } from './ownership.ts'
import { listSnapshots, readSnapshot, type Snapshot } from './snapshots.ts'

interface ScenarioReport {
  status?: string
  steps?: { label: string; status: string; error?: string }[]
}

/** The evidence a reader may need; SSH keys and the source checkout are never among them. */
const EXPORTED = [
  'activity.log',
  'provenance.json',
  'results/scenario.json',
  'results/build.json',
  'results/startup.json',
  'results/build.log',
  'results/startup.log',
]

/** Copies what exists and reports what the run never produced. */
async function copyEvidence(source: string, destination: string): Promise<string[]> {
  const missing: string[] = []
  for (const file of EXPORTED) {
    try {
      if (!(await lstat(join(source, file))).isFile())
        throw new Error(`Evidence is not a regular file: ${file}`)
      await copyFile(join(source, file), join(destination, basename(file)))
    } catch (error) {
      if (!absent(error)) throw error
      missing.push(file)
    }
  }
  return missing
}

function reportLines(
  status: string,
  scenario: ScenarioReport,
  missing: string[],
  captures: Snapshot[],
): string[] {
  const lines = [
    '# Rapport d’essai Studio',
    '',
    `État VM : ${status}`,
    `Scénario : ${scenario.status ?? 'non exécuté ou rapport indisponible'}`,
    '',
    '## Étapes',
    '',
  ]
  for (const step of scenario.steps ?? []) {
    lines.push(`- ${step.label} : ${step.status}`)
    if (step.error) lines.push('', '```text', step.error, '```', '')
  }
  lines.push(
    '',
    '## Pièces jointes',
    '',
    'Les journaux et rapports JSON disponibles sont dans ce dossier. Les clés SSH ne sont jamais exportées.',
    '',
    'Les captures disponibles de cet essai sont copiées dans captures/ avec leur date et leur étape. Les images des autres essais ne sont jamais associées à ce rapport.',
  )
  lines.push('', '## Captures de cet essai', '')
  if (!captures.length)
    lines.push('Aucune capture disponible pour cet essai au moment de l’export.')
  for (const capture of captures)
    lines.push(
      `### ${capture.capturedAt}`,
      '',
      capture.activity,
      '',
      `![Capture de l’essai](captures/${capture.file})`,
      '',
    )
  if (missing.length)
    lines.push('', 'Pièces non produites ou non récupérées :', ...missing.map(file => `- ${file}`))
  return lines
}

/** A small public-facing export; never copy SSH keys or the source checkout. */
export async function exportRunFolder(root: string, run: string): Promise<string> {
  const source = join(stateDir(root), run)
  const record = await readRecord(run, root, stateDir(root))
  const destination = await reportDestination(root, run)
  await writeReportIndex(root, run)
  const missing = await copyEvidence(source, destination)
  const captures = await copyCaptures(root, run, destination)
  const scenario = ((await optionalJson(join(source, 'results/scenario.json'))) ??
    {}) as ScenarioReport
  await writeFile(
    join(destination, 'rapport.md'),
    reportLines(record.status, scenario, missing, captures).join('\n'),
    { mode: 0o600 },
  )
  return destination
}

/** Associate images by owned run identity, never by whichever image is currently visible. */
async function copyCaptures(
  root: string,
  run: string,
  destination: string,
  startedAt = 0,
): Promise<Snapshot[]> {
  const captures = (await listSnapshots(root, startedAt)).filter(capture => capture.run === run)
  if (!captures.length) return []
  const folder = join(destination, 'captures')
  await mkdir(folder, { recursive: true, mode: 0o700 })
  for (const capture of captures) {
    const bytes = await readSnapshot(root, run, capture.file)
    await writeFile(join(folder, capture.file), bytes, { mode: 0o600 })
  }
  await writeFile(join(folder, 'index.json'), `${JSON.stringify(captures, null, 2)}\n`, {
    mode: 0o600,
  })
  return captures
}

async function reportDestination(root: string, run: string) {
  const destination = join(root, 'rapports', 'debug', run)
  await mkdir(destination, { recursive: true, mode: 0o700 })
  return destination
}

/** The reader's entry point names the latest complete run, never one QA attempt among many. */
async function writeReportIndex(root: string, run: string) {
  const reports = join(root, 'rapports')
  await Promise.all(
    ['debug', 'entrainement'].map(folder =>
      mkdir(join(reports, folder), { recursive: true, mode: 0o700 }),
    ),
  )
  await writeFile(
    join(reports, 'LISEZ-MOI.md'),
    `# Rapports locaux\n\n- [Debug / QA](./debug/) : essais de Studio, journaux et captures.\n- [Entraînement](./entrainement/) : résultats du modèle entraîné.\n\nDernier essai de debug : [ouvrir le rapport](./debug/${run}/rapport.md).\n\nChaque rapport de debug conserve les visuels disponibles de son propre essai pour pouvoir être partagé sans dépendre de l’aperçu live. Le dossier captures du suivi live reste limité à la dernière session ; les copies dans les rapports restent conservées jusqu’à suppression explicite de leur dossier. Les anciens rapports placés directement à la racine ne sont ni déplacés ni supprimés.\n\nCe dossier est local et ignoré par Git. Les clés SSH et le checkout source ne sont jamais exportés.\n`,
    { mode: 0o600 },
  )
}

function attemptReport(value: unknown): ScenarioReport {
  if (!isRecord(value) || typeof value.status !== 'string' || !Array.isArray(value.steps))
    throw new Error('Invalid QA attempt report')
  const steps = value.steps.map(step => {
    if (
      !isRecord(step) ||
      typeof step.label !== 'string' ||
      typeof step.status !== 'string' ||
      (step.error !== undefined && typeof step.error !== 'string')
    )
      throw new Error('Invalid QA attempt step')
    return {
      label: step.label,
      status: step.status,
      ...(typeof step.error === 'string' ? { error: step.error } : {}),
    }
  })
  return { status: value.status, steps }
}

/** Read only a bounded tail: a persistent VM log can span many earlier attempts. */
async function copyActivityTail(source: string, destination: string): Promise<string[]> {
  const path = join(source, 'activity.log')
  try {
    if (!(await lstat(path)).isFile()) throw new Error('Activity log is not a regular file')
    const handle = await open(path, 'r')
    try {
      const size = (await handle.stat()).size
      const buffer = Buffer.alloc(Math.min(size, 262144))
      const { bytesRead } = await handle.read(
        buffer,
        0,
        buffer.length,
        Math.max(0, size - buffer.length),
      )
      await writeFile(join(destination, 'activity.log'), buffer.subarray(0, bytesRead), {
        mode: 0o600,
      })
    } finally {
      await handle.close()
    }
    return []
  } catch (error) {
    if (!absent(error)) throw error
    return ['activity.log']
  }
}

/** A persistent VM can produce several attempts; each report owns only its time-scoped captures. */
export async function exportQaAttempt(
  root: string,
  run: string,
  attemptId: string,
  report: unknown,
  startedAt: number,
): Promise<string> {
  if (
    !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,119}$/.test(attemptId) ||
    !Number.isSafeInteger(startedAt) ||
    startedAt < 0
  )
    throw new Error('Invalid QA attempt identity or start time')
  const scenario = attemptReport(report)
  const record = await readRecord(run, root, stateDir(root))
  const destination = await reportDestination(root, attemptId)
  const missing = await copyActivityTail(join(stateDir(root), run), destination)
  const captures = await copyCaptures(root, run, destination, startedAt)
  await writeFile(join(destination, 'scenario.json'), `${JSON.stringify(report, null, 2)}\n`, {
    mode: 0o600,
  })
  await writeFile(
    join(destination, 'attempt.json'),
    `${JSON.stringify({ run, attemptId, startedAt, exportedAt: Date.now() }, null, 2)}\n`,
    { mode: 0o600 },
  )
  const lines = reportLines(record.status, scenario, missing, captures)
  lines.push(
    '',
    '## Contexte de la tentative',
    '',
    `Début : ${new Date(startedAt).toISOString()}`,
    '',
    'activity.log contient au maximum les derniers 256 Kio du journal de la session VM ; il peut inclure des étapes antérieures à cette tentative. Les captures sont filtrées à partir du début de cette tentative.',
  )
  await writeFile(join(destination, 'rapport.md'), lines.join('\n'), { mode: 0o600 })
  return destination
}
