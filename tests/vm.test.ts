import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { cycle, type Operations } from '../src/vm/lifecycle.ts'
import { isPreparedReference, type VmRecord, validateOwnership } from '../src/vm/ownership.ts'
import { command, quote, sshConfigValue } from '../src/vm/process.ts'

function fixture(fail?: string) {
  const events: string[] = []
  const action = (name: string) => async () => {
    events.push(name)
    if (name === fail) throw new Error(name)
  }
  const operations: Operations = {
    clone: action('clone'),
    start: action('start'),
    execute: action('execute'),
    stop: action('stop'),
    remove: action('remove'),
  }
  return { events, operations }
}
describe('VM lifecycle', () => {
  it('stops before deleting a successful disposable VM', async () => {
    const f = fixture()
    await cycle(f.operations, false)
    expect(f.events).toEqual(['clone', 'start', 'execute', 'stop', 'remove'])
  })
  it('retains the stopped prepared reference', async () => {
    const f = fixture()
    await cycle(f.operations, true)
    expect(f.events).toEqual(['clone', 'start', 'execute', 'stop'])
  })
  it('stops and preserves a failed build for diagnosis', async () => {
    const f = fixture('execute')
    await expect(cycle(f.operations, false)).rejects.toThrow('execute')
    expect(f.events).toEqual(['clone', 'start', 'execute', 'stop'])
  })
  it('does not delete when stopping fails', async () => {
    const f = fixture('stop')
    await expect(cycle(f.operations, false)).rejects.toThrow('stop')
    expect(f.events).not.toContain('remove')
  })
  it('does not operate on a VM when cloning fails', async () => {
    const f = fixture('clone')
    await expect(cycle(f.operations, false)).rejects.toThrow('clone')
    expect(f.events).toEqual(['clone'])
  })
})

describe('VM command transport', () => {
  it.skipIf(process.platform === 'win32')(
    'preserves quotes and shell metacharacters literally',
    async () => {
      const value = "Pasquelin's $(echo unwanted) `echo no` ; end"
      expect(await command('/bin/sh', ['-c', `printf '%s' ${quote(value)}`])).toBe(value)
    },
  )
  it('rejects a failed external command', async () => {
    await expect(command(process.execPath, ['-e', 'process.exit(3)'])).rejects.toThrow('failed (3)')
  })
  it('terminates a command that exceeds its deadline', async () => {
    await expect(
      command(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], {
        timeout: 50,
      }),
    ).rejects.toThrow('terminated')
  })
})

describe('VM ownership', () => {
  it.each(['created', 'ready', 'build-passed', 'failed-retained', 'removed'])(
    'accepts the emitted status %s',
    status => {
      const name = 'studio-ft-00000000-0000-4000-8000-000000000000'
      const record = {
        name,
        owner: '/repo',
        mode: 'prepare',
        status,
        key: join('/state', name, 'id_ed25519'),
      }
      expect(validateOwnership(record, name, '/repo', '/state').status).toBe(status)
    },
  )
  it.each(['unknown', '', undefined, null, 0, ['ready']])(
    'rejects an invalid status %j',
    status => {
      const name = 'studio-ft-00000000-0000-4000-8000-000000000000'
      const record = {
        name,
        owner: '/repo',
        mode: 'prepare',
        status,
        key: join('/state', name, 'id_ed25519'),
      }
      expect(() => validateOwnership(record, name, '/repo', '/state')).toThrow()
    },
  )

  it('refuses foreign names, ownership and personal keys', async () => {
    const name = 'studio-ft-00000000-0000-4000-8000-000000000000'
    const record = {
      name,
      owner: '/repo',
      mode: 'prepare',
      status: 'ready',
      key: join('/state', name, 'id_ed25519'),
    }
    expect(validateOwnership(record, name, '/repo', '/state')).toEqual(record)
    expect(() => validateOwnership(record, 'my-personal-vm', '/repo', '/state')).toThrow()
    expect(() => validateOwnership(record, name, '/other', '/state')).toThrow()
    expect(() =>
      validateOwnership({ ...record, key: '/home/.ssh/id_ed25519' }, name, '/repo', '/state'),
    ).toThrow()
  })
})

describe('VM reference selection', () => {
  const base: VmRecord = {
    name: 'studio-ft-00000000-0000-4000-8000-000000000000',
    owner: '/repo',
    mode: 'prepare',
    status: 'ready',
    key: '/state/key',
  }
  it('accepts only a prepared reference left ready', () => {
    expect(isPreparedReference(base)).toBe(true)
    expect(isPreparedReference({ ...base, status: 'created' })).toBe(false)
    expect(isPreparedReference({ ...base, status: 'build-passed' })).toBe(false)
    expect(isPreparedReference({ ...base, mode: 'build' })).toBe(false)
  })
})

describe('SSH option quoting', () => {
  it('wraps a value the option parser would otherwise split on spaces', () => {
    expect(sshConfigValue('/AI Desktop Studio/known_hosts')).toBe(
      '"/AI Desktop Studio/known_hosts"',
    )
  })
  it('escapes quotes and backslashes rather than ending the value', () => {
    expect(sshConfigValue('a"b\\c')).toBe('"a\\"b\\\\c"')
  })
})
