import { expect, it } from 'vitest'
import { GUEST_WAIT_MS, MODEL_INFERENCE_MS, RELAY_MS, SCENARIO_RUN_MS } from '../src/qa/budgets.ts'

it('nests every wait of a model round trip, so the innermost failure is the one reported', () => {
  expect(RELAY_MS).toBeGreaterThan(MODEL_INFERENCE_MS)
  expect(GUEST_WAIT_MS).toBeGreaterThan(RELAY_MS)
  expect(SCENARIO_RUN_MS).toBeGreaterThan(GUEST_WAIT_MS)
})
