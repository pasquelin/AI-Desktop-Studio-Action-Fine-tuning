import { Ajv, type ValidateFunction } from 'ajv'
import { record } from '../json.ts'
import type { InventoryCase } from './inventory.ts'

const ajv = new Ajv({ strict: false })
/** One validator per action schema; designCase runs once per authored case. */
const validators = new WeakMap<Record<string, unknown>, ValidateFunction>()
function validatorFor(schema: Record<string, unknown>): ValidateFunction {
  const known = validators.get(schema)
  if (known) return known
  const compiled = ajv.compile(schema)
  validators.set(schema, compiled)
  return compiled
}

function example(schema: unknown, key: string): unknown {
  if (!record(schema)) throw new Error(`Missing schema for ${key}`)
  if (Array.isArray(schema.enum) && schema.enum.length) return schema.enum[0]
  if (schema.type === undefined) return null // Unconstrained JSON sample, not a verified runtime fixture.
  switch (schema.type) {
    case 'boolean':
      return false
    case 'integer':
    case 'number':
      return typeof schema.minimum === 'number' ? schema.minimum : 1
    case 'array':
      return [example(schema.items, key)]
    case 'string':
      return key.toLowerCase().includes('path') || key === 'folder'
        ? `fixture/${key}`
        : `fixture-${key}`
    case 'object':
      return {}
    default:
      throw new Error(`Unsupported fixture schema: ${key}`)
  }
}

export function designCase(
  item: InventoryCase,
  action: Record<string, unknown>,
  schema: Record<string, unknown>,
) {
  if (!record(schema.properties) || !Array.isArray(schema.required))
    throw new Error(`Invalid tool schema: ${item.action}`)
  const properties = schema.properties
  const required: unknown[] = schema.required
  const base: Record<string, unknown> = {}
  for (const key of required) {
    if (typeof key !== 'string') throw new Error('Invalid required field')
    base[key] = example(properties[key], key)
  }
  const text = item.specification
  const field =
    text.match(
      /^(?:Paramètre|Texte|Cible|Booléen|Liste|Option de|Option inconnue de|Valeur de) (\S+)/,
    )?.[1] ?? text.match(/^Borne (?:min|max) de (\S+)/)?.[1]
  const candidates: { label: string; input: Record<string, unknown> }[] = []
  const add = (label: string, value?: unknown) =>
    candidates.push({
      label,
      input: field ? { ...base, [field]: value } : { ...base },
    })
  let kind = 'integration'
  if (text.startsWith('Nominal minimal')) {
    kind = 'nominal'
    add('required-only')
  } else if (text.startsWith('Nominal complet')) {
    kind = 'nominal'
    add('required-only')
    for (const [key, property] of Object.entries(properties))
      if (key !== 'consent')
        candidates.push({
          label: `with-${key}`,
          input: { ...base, [key]: example(property, key) },
        })
  } else if (text.startsWith('Champ inconnu')) {
    kind = 'wire-contract'
    candidates.push({
      label: 'unknown-field',
      input: { ...base, unexpectedFixtureField: true },
    })
  } else if (field && text.startsWith('Paramètre') && text.includes(' absent')) {
    kind = 'wire-contract'
    const input = { ...base }
    delete input[field]
    candidates.push({ label: 'omitted', input })
  } else if (field && text.includes('avec null et type incompatible')) {
    kind = 'wire-contract'
    add('null', null)
    const property = properties[field]
    add('wrong-type', record(property) && property.type === 'object' ? [] : {})
  } else if (field && text.startsWith('Option inconnue')) {
    kind = 'wire-contract'
    add('unknown-choice', '__unknown_fixture_option__')
  } else if (field && text.startsWith('Option de')) {
    kind = 'option'
    const raw = text.match(/ : (.*?) ;/)?.[1]
    if (raw === undefined) throw new Error('Missing option')
    add('declared-choice', JSON.parse(raw))
  } else if (field && text.startsWith('Booléen')) {
    kind = 'boolean'
    add('true', true)
    add('false', false)
  } else if (field && text.startsWith('Texte')) {
    kind = 'text'
    for (const value of ['', '   ', 'Été_日本_عربي', 'name with spaces', 'x'.repeat(256), 'name?!'])
      add(`text-${candidates.length}`, value)
  } else if (field && text.startsWith('Valeur de')) {
    kind = 'number'
    for (const value of [0, -1, 0.5, 1000000]) add(`number-${value}`, value)
  } else if (field && text.startsWith('Borne')) {
    kind = 'boundary'
    const match = text.match(/= (\S+) :/)
    const boundary = Number(match?.[1])
    if (!Number.isFinite(boundary)) throw new Error('Invalid boundary')
    for (const value of [boundary - 0.01, boundary, boundary + 0.01])
      add(`boundary-${value}`, value)
  } else if (field && text.startsWith('Liste')) {
    kind = 'list'
    const p = properties[field]
    const one = record(p) ? example(p.items, field) : 'fixture-item'
    for (const value of [[], [one], [one, one], [one, null]])
      add(`list-${candidates.length}`, value)
  } else if (field && text.startsWith('Cible')) {
    kind = 'target'
    for (const value of [
      'fixture-valid-target',
      'fixture-removed-target',
      'fixture-other-project-target',
    ])
      add(value, value)
  } else add('reference-request')
  const check = validatorFor(schema)
  return {
    kind,
    fixture: {
      isolation: 'disposable-vm-only',
      resourceBindings: Object.keys(properties).filter(key => /Id$|Ids$|path|folder/i.test(key)),
      initialState: action.capabilities ?? {},
      requirements: action.requires ?? {},
      requests: candidates.map(candidate => ({
        ...candidate,
        internalSchemaAccepts: Boolean(check(candidate.input)),
      })),
      runtimeBindingRequired: true,
    },
    expectedResult: {
      instruction: item.specification,
      actionContractReference: item.action,
      scope: 'contract-and-state',
      schemaVerdictsAreNotBusinessVerdicts: true,
    },
    oracle: {
      checks: [
        'validate-internal-action-contract',
        'observe-real-state-before-and-after',
        'preserve-unrelated-witness',
        'report-error-without-false-success',
      ],
      persistenceRequiredWhenWriting: true,
      sourceReviewRequired: true,
    },
    preparationStatus: 'specified-draft-runtime-bindings-required',
  }
}
