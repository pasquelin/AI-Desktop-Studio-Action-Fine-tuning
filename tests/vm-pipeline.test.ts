import { expect, it } from 'vitest'
import { runPipeline } from '../src/vm/pipeline.ts'

it('reuses an existing reference without provisioning again', async () => {
  const events: string[] = []
  await runPipeline({
    findReference: async () => 'base',
    prepare: async () => {
      events.push('prepare')
    },
    build: async name => {
      events.push(name)
    },
  })
  expect(events).toEqual(['base'])
})
it('prepares then builds a newly discovered reference', async () => {
  const events: string[] = []
  let ready = false
  await runPipeline({
    findReference: async () => (ready ? 'new' : undefined),
    prepare: async () => {
      ready = true
      events.push('prepare')
    },
    build: async name => {
      events.push(name)
    },
  })
  expect(events).toEqual(['prepare', 'new'])
})
it('refuses to build if preparation produced no reference', async () => {
  let built = false
  await expect(
    runPipeline({
      findReference: async () => undefined,
      prepare: async () => {},
      build: async () => {
        built = true
      },
    }),
  ).rejects.toThrow('reference')
  expect(built).toBe(false)
})
