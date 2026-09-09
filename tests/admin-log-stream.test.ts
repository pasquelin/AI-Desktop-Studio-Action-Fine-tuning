// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { LogStream } from '../src/admin/log-stream.ts'

const chunk = (text: string, over: Record<string, unknown> = {}) => {
  const data = btoa(String.fromCharCode(...new TextEncoder().encode(text)))
  return { data, next: text.length, size: text.length, ...over }
}

describe('log stream decoding', () => {
  it('accumulates successive chunks and tracks how far it has read', () => {
    const stream = new LogStream()
    expect(stream.append(chunk('début\n', { run: 'vm-1', next: 6, size: 12 }))).toBe('début\n')
    expect(stream.offset).toBe(6)
    expect(stream.append(chunk('suite\n', { run: 'vm-1', next: 12, size: 12 }))).toBe(
      'début\nsuite\n',
    )
    expect(stream.behind({ data: '', next: 12, size: 12 })).toBe(false)
    expect(stream.behind({ data: '', next: 12, size: 99 })).toBe(true)
  })
  it('restarts on a new run and on a rotated file', () => {
    const stream = new LogStream()
    stream.append(chunk('ancien\n', { run: 'vm-1' }))
    expect(stream.append(chunk('neuf\n', { run: 'vm-2' }))).toBe('neuf\n')
    expect(stream.run).toBe('vm-2')
    expect(stream.append(chunk('reparti\n', { run: 'vm-2', reset: true }))).toBe('reparti\n')
    expect(stream.offset).toBe(8)
  })
  it('joins a multi-byte character split across two chunks', () => {
    const bytes = new TextEncoder().encode('é')
    const half = (part: Uint8Array) => btoa(String.fromCharCode(...part))
    const stream = new LogStream()
    expect(stream.append({ data: half(bytes.slice(0, 1)), next: 1, size: 2 })).toBe('')
    expect(stream.append({ data: half(bytes.slice(1)), next: 2, size: 2 })).toBe('é')
  })
  it('drops terminal colouring but keeps the text it wrapped', () => {
    const stream = new LogStream()
    const coloured = `${String.fromCharCode(27)}[32m[Étape] Prêt${String.fromCharCode(27)}[0m\n`
    expect(stream.append(chunk(coloured))).toBe('[Étape] Prêt\n')
  })
})
