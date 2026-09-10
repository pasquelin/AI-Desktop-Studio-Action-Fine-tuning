import { expect, it } from 'vitest'
import { command } from '../src/vm/process.ts'

/** Answers each line it is given, so the exchange proves stdin outlived the first write. */
const ECHO = `
  const { createInterface } = require('node:readline')
  createInterface({ input: process.stdin }).on('line', line => {
    const value = JSON.parse(line)
    if (value.done) process.exit(0)
    console.log('[Answer] ' + value.id)
  })
`

it('answers on the connection already running the command, with stdin kept open', async () => {
  let send: (line: string) => void = () => {}
  const output = await command(process.execPath, ['-e', ECHO], {
    timeout: 10_000,
    onOutput: chunk => {
      const text = chunk.toString()
      if (text.includes('[Answer] first')) send(JSON.stringify({ id: 'second' }))
      else if (text.includes('[Answer] second')) send(JSON.stringify({ done: true }))
    },
    channel: write => {
      send = write
      write(JSON.stringify({ id: 'first' }))
    },
  })
  expect(output).toContain('[Answer] first')
  expect(output).toContain('[Answer] second')
})

it('closes stdin with its content when no channel is opened', async () => {
  const read = `
    let body = ''
    process.stdin.on('data', chunk => { body += chunk })
    process.stdin.on('end', () => console.log('[Read] ' + body.trim()))
  `
  expect(await command(process.execPath, ['-e', read], { input: 'payload', timeout: 10_000 })).toBe(
    '[Read] payload',
  )
})

it('keeps only the tail of a streamed command, whose caller already saw every chunk', async () => {
  // A channel can hold the connection open for a whole journey; the transcript must not pile up.
  const flood = `
    for (let index = 0; index < 400; index++) console.log('x'.repeat(1000) + ' line' + index)
  `
  let streamed = 0
  const output = await command(process.execPath, ['-e', flood], {
    timeout: 10_000,
    onOutput: chunk => {
      streamed += chunk.length
    },
  })
  expect(streamed).toBeGreaterThan(400_000)
  expect(output.length).toBeLessThanOrEqual(65_536)
  expect(output).toContain('line399')
  expect(output).not.toContain('line0 ')
})

it('returns the whole output when the caller is not streaming it', async () => {
  const write = `for (let index = 0; index < 400; index++) console.log('y'.repeat(1000))`
  expect((await command(process.execPath, ['-e', write], { timeout: 10_000 })).length).toBe(400_399)
})
