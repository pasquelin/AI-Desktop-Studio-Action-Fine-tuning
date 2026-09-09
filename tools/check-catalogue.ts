import { readFileSync } from 'node:fs'
import { Ajv } from 'ajv'
import { sha256 } from '../src/catalogue/catalogue.ts'
import { assertFresh, inspectSource } from '../src/catalogue/source.ts'
import { readStudioLink } from '../src/studio/checkout.ts'
import { runCheck } from './run-check.ts'

const ajv = new Ajv({ strict: true })
const catalogueValid = ajv.compile<{
  appRevision: string
  sourceHashes: Record<string, string>
  catalogueHash: string
}>({
  type: 'object',
  required: ['appRevision', 'sourceHashes', 'catalogueHash'],
  properties: {
    appRevision: { type: 'string' },
    sourceHashes: { type: 'object', additionalProperties: { type: 'string' } },
    catalogueHash: { type: 'string' },
  },
})

let linked = false
await runCheck(
  () => {
    const link = readStudioLink('.studio-source.json')
    if (link) {
      linked = true
      const saved: unknown = JSON.parse(readFileSync(link.output, 'utf8'))
      if (!catalogueValid(saved)) throw new Error('Invalid catalogue export.')
      const { catalogueHash, ...body } = saved
      if (sha256(JSON.stringify(body)) !== catalogueHash)
        throw new Error('Catalogue content hash does not match.')
      assertFresh(saved, inspectSource(link.sourceRoot))
    }
    return []
  },
  () =>
    linked
      ? 'Catalogue matches the current clean Studio revision and source files.'
      : 'Studio source not configured: freshness check not run (foundation-only validation).',
  'Catalogue freshness check failed.',
)
