import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Ajv } from 'ajv'
import {
  type Baseline,
  type FreshnessWarning,
  freshnessWarnings,
} from '../src/scenarios/freshness.ts'
import { execGit, readCheckoutState, readStudioLink } from '../src/studio/checkout.ts'
import { runCheck } from './run-check.ts'

const root = resolve(import.meta.dirname, '..')
const ajv = new Ajv({ strict: true })
const revision = { type: 'string', pattern: '^[a-f0-9]{40}$' }
const valid = ajv.compile<Baseline>({
  type: 'object',
  required: ['schemaVersion', 'scenariosRevision', 'trainedRevision'],
  additionalProperties: false,
  properties: {
    schemaVersion: { const: 1 },
    scenariosRevision: revision,
    trainedRevision: { anyOf: [revision, { type: 'null' }] },
  },
})

const messages: Record<FreshnessWarning, string> = {
  scenariosStale:
    'ATTENTION : Studio a changé depuis la rédaction des scénarios. Des informations peuvent manquer ; demander leur revue et leur mise à jour avant de préparer un entraînement.',
  sourceDirty:
    'ATTENTION : Studio contient des modifications non enregistrées. La correspondance avec les données de référence ne peut pas être garantie.',
  trainingStale:
    'ATTENTION : le modèle entraîné ne correspond pas à la version actuelle de Studio. Des fonctionnalités ou informations peuvent manquer ; demander une revue des données et du besoin de réentraînement.',
}

/** Names what moved in Studio since the baseline; that revision may be gone from the checkout. */
function describeChanges(sourceRoot: string, from: string, to: string): string {
  let files: string[]
  try {
    files = execGit(sourceRoot, 'diff', '--name-only', from, to).split('\n').filter(Boolean)
  } catch {
    return 'Détail des changements indisponible : ancienne révision absente du checkout.'
  }
  return `Changements depuis la référence : ${files.length} fichiers. ${files.slice(0, 12).join(', ')}${files.length > 12 ? ', …' : ''}`
}

let linked = false
await runCheck(
  () => {
    const saved: unknown = JSON.parse(readFileSync(resolve(root, 'configs/freshness.json'), 'utf8'))
    if (!valid(saved)) throw new Error('Invalid scenario/training freshness reference.')
    const link = readStudioLink(resolve(root, '.studio-source.json'))
    if (!link) return []
    linked = true
    const { revision: current, dirty } = readCheckoutState(link.sourceRoot)
    const warnings = freshnessWarnings(saved, current, dirty)
    for (const warning of warnings) console.warn(messages[warning])
    if (warnings.length === 0)
      console.log(
        'Scénarios : même révision que le checkout Studio configuré (cela ne prouve pas leur réussite).',
      )
    if (saved.trainedRevision === null)
      console.log('Entraînement : aucun modèle entraîné enregistré pour le moment.')
    if (saved.scenariosRevision !== current)
      console.warn(describeChanges(link.sourceRoot, saved.scenariosRevision, current))
    return []
  },
  () =>
    linked
      ? 'Contrôle de fraîcheur terminé ; les avertissements éventuels demandent une revue, sans mise à jour automatique.'
      : 'Checkout Studio non configuré : fraîcheur des scénarios et de l’entraînement non vérifiée.',
  'Unable to verify scenario/training freshness.',
)
