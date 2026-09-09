import { expect, it } from 'vitest'
import { runScenario, type ScenarioReport } from '../src/scenarios/runner.ts'

it('detects a false result and blocks dependent mutations', async () => {
  let later = false
  const reports: ScenarioReport[] = []
  const result = await runScenario(
    'probe',
    [
      { id: 'create', label: 'create', run: async () => {} },
      {
        id: 'verify',
        label: 'verify',
        run: async () => {
          throw new Error('Expected cube absent')
        },
      },
      {
        id: 'delete',
        label: 'delete',
        run: async () => {
          later = true
        },
      },
    ],
    async report => {
      reports.push(report)
    },
  )
  expect(result.status).toBe('failed')
  expect(result.steps.map(step => step.status)).toEqual(['passed', 'failed', 'blocked'])
  expect(later).toBe(false)
  expect(reports[0]?.steps).toEqual([])
})
it('accepts only fully completed checks and refuses lost evidence', async () => {
  const steps = [{ id: 'check', label: 'check', run: async () => {} }]
  expect((await runScenario('ok', steps, async () => {})).status).toBe('passed')
  let ran = false
  await expect(
    runScenario(
      'disk',
      [
        {
          id: 'effect',
          label: 'effect',
          run: async () => {
            ran = true
          },
        },
      ],
      async () => {
        throw new Error('disk full')
      },
    ),
  ).rejects.toThrow('disk full')
  expect(ran).toBe(false)
})
