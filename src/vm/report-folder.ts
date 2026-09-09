import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { optionalJson } from '../files.ts'
import { absent } from '../json.ts'
import { readRecord, stateDir } from './ownership.ts'

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
      await copyFile(join(source, file), join(destination, basename(file)))
    } catch (error) {
      if (!absent(error)) throw error
      missing.push(file)
    }
  }
  return missing
}

function reportLines(status: string, scenario: ScenarioReport, missing: string[]): string[] {
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
    'Les captures de la dernière session restent dans ../../artifacts/vm/captures/ ; elles sont remplacées au prochain essai pour ne pas multiplier les archives d’images.',
  )
  if (missing.length)
    lines.push('', 'Pièces non produites ou non récupérées :', ...missing.map(file => `- ${file}`))
  return lines
}

/** A small public-facing export; never copy SSH keys or the source checkout. */
export async function exportRunFolder(root: string, run: string): Promise<string> {
  const source = join(stateDir(root), run)
  const record = await readRecord(run, root, stateDir(root))
  const destination = join(root, 'rapports', run)
  await mkdir(destination, { recursive: true, mode: 0o700 })
  const missing = await copyEvidence(source, destination)
  const scenario = ((await optionalJson(join(source, 'results/scenario.json'))) ??
    {}) as ScenarioReport
  await writeFile(
    join(destination, 'rapport.md'),
    reportLines(record.status, scenario, missing).join('\n'),
    { mode: 0o600 },
  )
  await writeFile(
    join(root, 'rapports', 'LISEZ-MOI.md'),
    `# Rapports locaux\n\nDernier essai : [ouvrir le rapport](./${run}/rapport.md).\n\nUn dossier par essai. Ce dossier est ignoré par Git et peut être supprimé lorsque les rapports ne sont plus utiles. Les images ne sont pas dupliquées ici.\n`,
    { mode: 0o600 },
  )
  return destination
}
