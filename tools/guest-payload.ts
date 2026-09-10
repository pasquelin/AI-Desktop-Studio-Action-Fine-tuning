import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { benchReadiness } from '../src/scenarios/capabilities.ts'
import { journeySource } from '../src/scenarios/identity.ts'

async function buildGuestEngine(root: string) {
  const { buildMediaFixtures } = await import('./prepare-media-fixtures.ts')
  const media = JSON.stringify(
    Object.fromEntries(
      Object.entries(buildMediaFixtures()).map(([name, bytes]) => [name, bytes.toString('base64')]),
    ),
  )
  const { build } = await import('vite')
  const bundled = await build({
    configFile: false,
    logLevel: 'error',
    build: {
      write: false,
      minify: false,
      lib: { entry: join(root, 'src/scenarios/declarative.ts'), formats: ['es'] },
      rollupOptions: { external: id => id.startsWith('node:') },
    },
  })
  const outputs = Array.isArray(bundled) ? bundled : [bundled]
  const chunks = outputs
    .flatMap(output => ('output' in output ? output.output : []))
    .filter(output => output.type === 'chunk')
  if (chunks.length !== 1 || !chunks[0]) throw new Error('Expected one guest engine bundle')
  return { media, engine: chunks[0].code }
}

/**
 * Neither the engine nor the media depend on the journey: a campaign builds them once.
 * A failed build is not cached, so a transient fault does not condemn the whole campaign.
 */
const engines = new Map<string, Promise<{ media: string; engine: string }>>()
function guestEngine(root: string) {
  const existing = engines.get(root)
  if (existing) return existing
  const work = buildGuestEngine(root).catch(error => {
    if (engines.get(root) === work) engines.delete(root)
    throw error
  })
  engines.set(root, work)
  return work
}

/**
 * One definition of what a journey ships to the guest: the same spec, engine and media whichever
 * caller asks. Provenance hashes are computed over these bytes, so a second recipe would silently
 * break the verification that ties a report back to its scenario.
 */
export async function freezeJourneyPayload(root: string, journey: string) {
  const { parseScenario } = await import('../src/scenarios/declarative.ts')
  const spec = await readFile(join(root, journeySource(journey)), 'utf8')
  const plan = parseScenario(JSON.parse(spec))
  const { ready, missing, unbound, blockers } = benchReadiness(plan)
  if (!ready)
    throw new Error(`Journey not ready: ${[...missing, ...unbound, ...blockers].join('; ')}`)
  const { media, engine } = await guestEngine(root)
  return { plan, spec, media, engine }
}
