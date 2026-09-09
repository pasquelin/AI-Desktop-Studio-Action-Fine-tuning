import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { call, connect, exists, results, sandbox, source, within } from './client.mjs'
import { runScenario } from './runner.ts'

const name = 'Pilot Project',
  renamed = 'Pilot Renamed',
  project = join(sandbox, name),
  renamedProject = join(sandbox, renamed)
const steps = []
/** The guest script stays self-contained; it cannot import the repository helpers. */
async function documentHash(folder) {
  return createHash('sha256')
    .update(await readFile(within(join(folder, documentPath))))
    .digest('hex')
}
async function step(label, body) {
  steps.push({
    id: `step-${steps.length + 1}`,
    label,
    run: async () => {
      console.log(`[Étape] ${label}`)
      await body()
    },
  })
}

function cube(state) {
  assert.ok(Array.isArray(state.nodes), 'Scene nodes missing')
  const found = state.nodes.filter(node => node.name === 'Pilot Cube')
  assert.equal(found.length, 1, 'Exactly one pilot cube expected')
  return found[0]
}
let documentId, documentPath, savedHash
assert.equal(await exists(project), false, 'Refusing an existing test project')
assert.equal(await exists(renamedProject), false, 'Refusing an existing rename target')
await step('Connecter Studio dans le profil isolé', connect)
await step('Créer le projet jetable', async () => {
  await call('project.create', { name, folder: sandbox })
  assert.ok(await exists(project), 'Project not created on disk')
})
await step('Créer une scène', async () => {
  const created = await call('workspace.open', {
    workspace: '3d',
    createDocument: true,
    title: 'Pilot Scene',
  })
  assert.equal(typeof created.documentId, 'string')
  documentId = created.documentId
  const docs = await call('documents.list')
  const document = docs.find(item => item.id === documentId)
  assert.ok(document?.path, 'Scene path missing')
  documentPath = document.path
  within(join(project, documentPath))
})
await step('Ajouter, renommer et déplacer un cube', async () => {
  await call('node.add', { kind: 'box', name: 'Initial Cube' })
  const state = await call('scene.state')
  const nodes = state.nodes.filter(node => node.name === 'Initial Cube')
  assert.equal(nodes.length, 1)
  await call('node.rename', { nodeId: nodes[0].id, name: 'Pilot Cube' })
  await call('node.transform', {
    nodeId: nodes[0].id,
    positionX: 2,
    positionY: 1,
    positionZ: -3,
  })
  const node = cube(await call('scene.state'))
  assert.deepEqual(node.transform?.position, { x: 2, y: 1, z: -3 })
})
await step('Sauvegarder et contrôler le fichier', async () => {
  await call('document.save', { documentId })
  assert.ok((await readFile(within(join(project, documentPath)))).length > 0)
  savedHash = await documentHash(project)
})
await step('Fermer, rouvrir et vérifier la scène', async () => {
  await call('project.close')
  await call('project.open', { path: project })
  await call('document.open', { path: documentPath })
  assert.deepEqual(cube(await call('scene.state')).transform?.position, {
    x: 2,
    y: 1,
    z: -3,
  })
  assert.equal(await documentHash(project), savedHash)
})
await step('Renommer le projet sans perdre la scène', async () => {
  await call('project.rename', { path: project, name: renamed })
  assert.equal(await exists(project), false)
  assert.ok(await exists(renamedProject))
  assert.equal(await documentHash(renamedProject), savedHash)
})
await step('Retirer le projet des récents et le remettre', async () => {
  await call('project.close')
  await call('project.forget', { path: renamedProject })
  assert.ok(await exists(renamedProject))
  assert.ok(!JSON.stringify(await call('projects.list')).includes(renamedProject))
  await call('project.open', { path: renamedProject })
  assert.ok(JSON.stringify(await call('projects.list')).includes(renamedProject))
})
await step('Mettre le projet jetable à la corbeille', async () => {
  await call('project.trash', { path: renamedProject })
  assert.equal(await exists(renamedProject), false)
  assert.ok(!JSON.stringify(await call('projects.list')).includes(renamedProject))
})
const provenance = JSON.parse(await readFile(join(source, 'provenance.json'), 'utf8'))
const report = await runScenario('project-scene-cube', steps, async report => {
  await writeFile(
    join(results, 'scenario.json'),
    JSON.stringify({ ...report, provenance }, null, 2),
  )
})
assert.equal(
  report.status,
  'passed',
  JSON.stringify(report.steps.filter(step => step.status === 'failed')),
)
console.log('[Étape] Parcours de référence terminé. Aucun apprentissage exécuté.')
