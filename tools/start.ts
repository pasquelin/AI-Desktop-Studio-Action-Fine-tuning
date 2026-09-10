import { mkdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { ensureObserver } from '../src/vm/observer-process.ts'

const root = resolve(import.meta.dirname, '..')
await Promise.all(
  ['debug', 'entrainement'].map(mode => mkdir(join(root, 'rapports', mode), { recursive: true })),
)
const url = await ensureObserver(root)
const response = await fetch(`${url}api/qa/boot`, {
  method: 'POST',
  headers: { Origin: url.slice(0, -1), 'Content-Type': 'application/json' },
  body: '{}',
})
if (!response.ok) throw new Error(await response.text())
console.log(
  `Application : ${url} — VM en préparation. Choisir Entraînement ou Debug / QA pour lancer un traitement.`,
)
