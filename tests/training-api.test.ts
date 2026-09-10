import type { ChildProcess } from 'node:child_process'
import { EventEmitter } from 'node:events'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, expect, it, vi } from 'vitest'
import { TrainingController } from '../src/training/api.ts'

const roots: string[] = []
afterEach(async () => {
  await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})
it('requires successful preparation and prevents a second training process', async () => {
  const root = await mkdtemp(join(tmpdir(), 'training-api-'))
  roots.push(root)
  const child = new EventEmitter() as ChildProcess
  const spawn = vi.fn((_args: string[]) => child)
  const controller = new TrainingController(root, {
    spawn,
    prepare: async () => ({
      token: 'token',
      eligibleCount: 3,
      excludedCount: 2,
      examples: [],
      bundle: '/local/reviewed.json',
      manifest: '/local/current.json',
      model: '/local/weights',
    }),
  })
  await expect(controller.start({ token: 'token' })).rejects.toThrow('Préparer')
  expect(spawn).not.toHaveBeenCalled()
  expect(await controller.prepare({})).toMatchObject({ eligibleCount: 3, excludedCount: 2 })
  expect(spawn).not.toHaveBeenCalled()
  expect((await controller.start({ token: 'token' })).status).toBe('running')
  await expect(controller.start({ token: 'token' })).rejects.toThrow('déjà en cours')
  expect(spawn).toHaveBeenCalledOnce()
  expect(spawn.mock.calls[0]?.[0]).toContain('--run')
  child.emit('close', 0)
  expect(controller.snapshot().status).toBe('completed-not-evaluated')
})
it('failed preparation never launches compute', async () => {
  const root = await mkdtemp(join(tmpdir(), 'training-api-'))
  roots.push(root)
  const spawn = vi.fn(() => new EventEmitter() as ChildProcess)
  const controller = new TrainingController(root, {
    spawn,
    prepare: async () => {
      throw new Error('No QA-validated examples')
    },
  })
  await expect(controller.prepare({})).rejects.toThrow('QA-validated')
  await expect(controller.start({ token: 'anything' })).rejects.toThrow('Préparer')
  expect(spawn).not.toHaveBeenCalled()
})
