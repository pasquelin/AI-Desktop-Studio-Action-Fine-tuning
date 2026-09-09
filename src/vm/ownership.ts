import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const VM_STATUSES = ['created', 'ready', 'build-passed', 'failed-retained', 'removed'] as const
type VmStatus = (typeof VM_STATUSES)[number]

export interface VmRecord {
  name: string
  owner: string
  status: VmStatus
  mode: string
  key: string
}
export const VM_PREFIX = 'studio-ft-'
const MANAGED_NAME = new RegExp(`^${VM_PREFIX}[a-f0-9-]{36}$`)

export function isManagedName(value: string): boolean {
  return MANAGED_NAME.test(value)
}

export function validateOwnership(
  value: unknown,
  name: string,
  root: string,
  state: string,
): VmRecord {
  if (!isManagedName(name)) throw new Error('Refusing an unmanaged VM name')
  if (!value || typeof value !== 'object') throw new Error('Invalid VM record')
  const record = value as Record<string, unknown>
  if (
    record.name !== name ||
    record.owner !== root ||
    !['prepare', 'build'].includes(String(record.mode)) ||
    !VM_STATUSES.some(status => status === record.status) ||
    typeof record.key !== 'string'
  )
    throw new Error('VM ownership mismatch')
  if (record.mode === 'prepare' && record.key !== join(state, name, 'id_ed25519'))
    throw new Error('Unexpected VM key path')
  return record as unknown as VmRecord
}

/** Single definition of where this repository keeps its VM records and keys. */
export function stateDir(root: string): string {
  return join(root, 'artifacts', 'vm')
}

/** Read and validate a record; the name is checked before it is joined into a path. */
export async function readRecord(name: string, root: string, state: string): Promise<VmRecord> {
  if (!isManagedName(name)) throw new Error('Refusing an unmanaged VM name')
  return validateOwnership(
    JSON.parse(await readFile(join(state, name, 'record.json'), 'utf8')),
    name,
    root,
    state,
  )
}

/** A base usable by `vm build`: prepared by this repository and left ready. */
export function isPreparedReference(record: VmRecord): boolean {
  return record.mode === 'prepare' && record.status === 'ready'
}
