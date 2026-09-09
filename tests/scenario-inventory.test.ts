import { expect, it } from 'vitest'
import { parseInventory } from '../src/scenarios/inventory.ts'

const sources = {
  'core.md': '## node.add — Ajouter\n| `node.add/001` | Ajouter un cube. |\n',
  'parcours.md':
    '## P001 — Un parcours\n- Demande : Créer.\n- Actions candidates : `node.add`.\n- Contrôle : Un cube.\n',
}
it('preserves the complete source specification and stable identifiers', () => {
  const result = parseInventory(sources)
  expect(result.cases).toEqual([
    {
      id: 'node.add/001',
      action: 'node.add',
      source: 'core.md',
      specification: 'Ajouter un cube.',
    },
  ])
  expect(result.journeys[0]?.id).toBe('P001')
  expect(result.journeys[0]?.specification).toContain('Un cube.')
})
it('rejects duplicated scenario identifiers instead of dropping coverage', () => {
  expect(() => parseInventory({ ...sources, 'second.md': sources['core.md'] })).toThrow('Duplicate')
})
it('rejects an empty inventory', () => {
  expect(() => parseInventory({})).toThrow()
})
