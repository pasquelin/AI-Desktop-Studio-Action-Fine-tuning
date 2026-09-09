import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { assertObservation, parseScenario } from '../src/scenarios/declarative.ts'

const documentId = 'b341ec79-d36d-4b89-99af-17e43a681070'
const layerId = '70bca428-e7bd-43d7-a81b-c6d2b25837f9'

// The real failed reload returned this empty canvas, also present before the old
// test's save. Equality of two defaults falsely passed that persistence test.
const defaultCanvas = {
  documentId,
  width: 1024,
  height: 1024,
  layers: [{ id: 'layer-1', name: 'Background', kind: 'pixel' }],
}

function plan(id: string) {
  return parseScenario(
    JSON.parse(
      readFileSync(new URL(`../datasets/bench/journeys/${id}.json`, import.meta.url), 'utf8'),
    ),
  )
}

async function checkStep(id: string, stepId: string, bindings: Record<string, unknown>) {
  const step = plan(id).steps.find(entry => entry.id === stepId)
  if (!step?.assertions.length) throw new Error('Missing reload oracle')
  for (const assertion of step.assertions)
    await assertObservation(assertion, bindings, async () => {
      throw new Error('Reload-state oracle must not need filesystem fixtures')
    })
}

const variants = [
  {
    id: 'P003',
    name: 'P003 témoin persistant',
    text: 'P003 contenu vérifié',
    layerBinding: 'witnessLayer',
    reopenBinding: 'reopenDocument',
  },
  {
    id: 'P007',
    name: 'Titre',
    text: 'Témoin inchangé',
    layerBinding: 'text',
    reopenBinding: 'open',
  },
]

describe.each(variants)('$id persistence oracle', variant => {
  function bindings() {
    const canvas = {
      documentId,
      width: 640,
      height: 360,
      layers: [
        ...defaultCanvas.layers,
        { id: layerId, name: variant.name, kind: 'text', text: variant.text },
      ],
    }
    return {
      image: { documentId },
      [variant.layerBinding]: { layerId },
      before: canvas,
      after: structuredClone(canvas),
    }
  }

  it('accepts the distinct saved witness after a real reload', async () => {
    await expect(checkStep(variant.id, 'after', bindings())).resolves.toBeUndefined()
  })

  it('rejects equal default states even when their document identity matches', async () => {
    const held = {
      ...bindings(),
      before: structuredClone(defaultCanvas),
      after: structuredClone(defaultCanvas),
    }
    await expect(checkStep(variant.id, 'after', held)).rejects.toThrow('Assertion equal failed')
  })

  it('rejects a path returned as identity even if the content looks correct', async () => {
    const held = {
      ...bindings(),
      [variant.reopenBinding]: { documentId: 'Images/Témoin.ora' },
    }
    await expect(checkStep(variant.id, variant.reopenBinding, held)).rejects.toThrow(
      'Assertion equal failed',
    )
  })
})
