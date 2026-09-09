import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { inspectRepository } from '../src/repository/inspect-repository.ts'

let root: string
beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'studio-foundation-'))
  execFileSync('git', ['init', '--quiet', root])
})
afterEach(() => {
  rmSync(root, { recursive: true, force: true })
})

describe('repository hygiene', () => {
  it('accepts small source files including names with spaces', () => {
    writeFileSync(join(root, 'source with spaces.ts'), 'export const answer = 42;\n')
    expect(inspectRepository(root)).toEqual([])
  })

  it.each(['weights.gguf', 'weights.safetensors', '.env', 'id_rsa', 'secret.pem'])(
    'rejects distributable files matching %s',
    name => {
      writeFileSync(join(root, name), 'not a real secret or model')
      expect(inspectRepository(root)).toContainEqual(expect.stringContaining(name))
    },
  )

  it('ignores untracked artifacts but rejects force-added ignored weights', () => {
    writeFileSync(join(root, '.gitignore'), 'models/\n')
    mkdirSync(join(root, 'models'))
    writeFileSync(join(root, 'models/model.gguf'), 'synthetic')
    expect(inspectRepository(root)).toEqual([])
    execFileSync('git', ['-C', root, 'add', '--force', 'models/model.gguf'])
    expect(inspectRepository(root)).toContainEqual(expect.stringContaining('model.gguf'))
  })

  it('rejects an oversized candidate before it enters Git', () => {
    writeFileSync(join(root, 'large.json'), 'x'.repeat(101))
    expect(inspectRepository(root, 100)).toHaveLength(1)
  })

  it.skipIf(process.platform === 'win32')('rejects symlinks without reading the target', () => {
    symlinkSync('/nonexistent/private-file', join(root, 'external'))
    expect(inspectRepository(root)).toContainEqual(expect.stringContaining('symbolic link'))
  })

  it('accepts removal of a previously tracked file', () => {
    writeFileSync(join(root, 'old.ts'), 'export {};\n')
    execFileSync('git', ['-C', root, 'add', 'old.ts'])
    rmSync(join(root, 'old.ts'))
    expect(inspectRepository(root)).toEqual([])
  })
})
