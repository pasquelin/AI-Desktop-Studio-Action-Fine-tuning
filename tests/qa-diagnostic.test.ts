import { expect, it } from 'vitest'
import { qaDiagnostic } from '../src/qa/diagnostic.ts'

it('prioritizes the real failed report step over raw SSH output', () => {
  const error = 'Error: ssh failed (1)\n[Capture] {"file":"raw.jpg"}\nlogs'
  const report = {
    steps: [
      { label: 'Créer le projet', status: 'passed' },
      {
        label: 'Ajouter une couche',
        status: 'failed',
        errorCode: 'proposal',
        error: 'QaProposalError: Action QA inconnue — Proposition rejetée : {"action":"layer.add"}',
      },
    ],
  }
  const result = qaDiagnostic({ error, report })
  expect(result).toContain('Ajouter une couche')
  expect(result).toContain('modèle a proposé')
  expect(result).not.toContain('ssh')
  expect(result).not.toContain('layer.add')
  expect(result).not.toContain('raw.jpg')
})
it('does not invent a connection error from an SSH nonzero exit', () => {
  const result = qaDiagnostic({
    error: 'Error: ssh failed (1)\n[Capture] {"activity":"timeout in unrelated log"}',
  })
  expect(result).toContain('sans diagnostic métier précis')
  expect(result).not.toMatch(/connexion|délai/i)
})
it.each([
  ['refusal', 'Studio a refusé'],
  ['timeout', 'délai d’attente'],
  ['proposal', 'modèle a proposé'],
  ['assertion', 'résultat obtenu'],
])('names the cause the failure declared, whatever its wording', (errorCode, expected) => {
  const source = {
    report: {
      steps: [{ status: 'failed', action: 'document.open', errorCode, error: 'reworded' }],
    },
  }
  const raw = JSON.stringify(source)
  expect(qaDiagnostic(source)).toContain(expected)
  expect(qaDiagnostic(source)).toContain('document.open')
  expect(JSON.stringify(source)).toBe(raw)
})
it('reports an undeclared cause as unknown instead of guessing from the message', () => {
  // The wording alone once decided the category; a message mentioning a delay is not a timeout.
  const source = {
    report: { steps: [{ status: 'failed', action: 'document.open', error: 'timed out' }] },
  }
  expect(qaDiagnostic(source)).not.toContain('délai d’attente')
  expect(qaDiagnostic(source)).toContain('le scénario s’est arrêté')
})
it('falls back to the cause a preparation failure declared', () => {
  expect(qaDiagnostic({ report: { steps: [], preparationErrorCode: 'timeout' } })).toContain(
    'délai d’attente',
  )
})
it('reads the cause the campaign step itself declared', () => {
  expect(qaDiagnostic({ errorCode: 'refusal', error: 'peu importe' })).toContain('Studio a refusé')
})
it('handles incomplete reports and blocked cases without exposing diagnostic payloads', () => {
  expect(
    qaDiagnostic({
      report: { steps: [null, 'wrong'] },
      status: 'blocked',
      error: 'Executable plan required',
    }),
  ).toContain('n’a pas été exécuté')
  expect(
    qaDiagnostic({
      report: { steps: [{ status: 'failed', id: 'open', error: 'Unhandled internal error' }] },
    }),
  ).toContain('open')
})
