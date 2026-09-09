import type { ErrorObject } from 'ajv'
import type { DeclarativeScenario } from '../scenarios/declarative.ts'
import { message } from './api.ts'
import { assertions, input, scenario } from './json-validators.js'

const validators = { scenario, input, assertions }
export type JsonKind = 'scenario' | 'input' | 'assertions'
const TYPE_NAMES: Record<string, string> = {
  object: 'un objet',
  array: 'un tableau',
  string: 'un texte',
  boolean: 'un booléen',
  number: 'un nombre',
}
/** Ajv keywords the form can explain in French; anything else keeps Ajv's own message. */
const EXPLAIN: Record<string, (params: ErrorObject['params']) => string> = {
  type: params => `doit être ${TYPE_NAMES[params.type] ?? params.type}`,
  required: params => `champ obligatoire : ${params.missingProperty}`,
  enum: params => `valeurs autorisées : ${params.allowedValues.join(', ')}`,
  additionalProperties: params => `champ inconnu : ${params.additionalProperty}`,
  minLength: () => 'le texte ne peut pas être vide',
}
function describeError(error: ErrorObject): string {
  const explain = EXPLAIN[error.keyword]
  return `${error.instancePath || '/'} : ${explain ? explain(error.params) : error.message}`
}
export function parseStructuredJson(raw: string, kind: 'scenario'): DeclarativeScenario
export function parseStructuredJson(raw: string, kind: JsonKind): unknown
export function parseStructuredJson(raw: string, kind: JsonKind): unknown {
  let value: unknown
  try {
    value = JSON.parse(raw)
  } catch (error) {
    throw new Error(`JSON invalide : ${message(error)}`)
  }
  const validate = validators[kind]
  if (!validate(value)) throw new Error((validate.errors ?? []).map(describeError).join(' · '))
  return value
}
export function jsonError(raw: string, kind: JsonKind): string {
  try {
    parseStructuredJson(raw, kind)
    return ''
  } catch (error) {
    return message(error)
  }
}
