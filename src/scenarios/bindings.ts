import { record } from '../json.ts'
import type { DeclarativeScenario } from './declarative.ts'

/** Bindings must exist before use, including observation outputs within each step. */
export function validateScenarioBindings(plan: DeclarativeScenario): void {
  const bindings = new Set(['sandbox', 'projectPath', ...(plan.requiredBindings ?? [])])
  const references = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach(references)
      return
    }
    if (!record(value)) return
    if (typeof value.$ref === 'string' && !bindings.has(value.$ref.split('.')[0] ?? ''))
      throw new Error(`Unknown binding: ${value.$ref}`)
    Object.values(value).forEach(references)
  }
  for (const step of plan.steps) {
    references(step.input)
    if (step.saveAs) bindings.add(step.saveAs)
    for (const check of step.assertions) {
      references(check.actual)
      references(check.expected)
      if (check.saveAs) bindings.add(check.saveAs)
    }
  }
}
