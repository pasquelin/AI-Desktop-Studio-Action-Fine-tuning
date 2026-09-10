import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { basename, join, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { publishApprovedExport } from '../src/scenarios/export-approved.ts'
import { approvedInputs } from '../src/training/approved-inputs.ts'
import { assertApprovedSplits, assertLocalModel, loraConfig } from '../src/training/config.ts'
import { runCheck } from './run-check.ts'

function train(root: string, config: string) {
  return new Promise<number>((done, reject) => {
    const child = spawn(
      join(root, '.venv/bin/python'),
      ['-m', 'mlx_lm.lora', '--config', config, '--train'],
      { cwd: root, stdio: 'inherit' },
    )
    child.once('error', reject)
    child.once('close', code => done(code ?? 1))
  })
}

await runCheck(
  async () => {
    const { values } = parseArgs({
      options: {
        bundle: { type: 'string' },
        manifest: { type: 'string' },
        model: { type: 'string' },
        'report-dir': { type: 'string' },
        run: { type: 'boolean', default: false },
      },
    })
    if (!values.bundle || !values.manifest || !values.model)
      throw new Error(
        'Required: --bundle reviewed.json --manifest current.json --model LOCAL_MLX_MODEL [--run]',
      )
    const root = resolve(import.meta.dirname, '..')
    const model = resolve(values.model)
    await assertLocalModel(model)
    const prepared = await approvedInputs(root, values.bundle, values.manifest)
    assertApprovedSplits(prepared.rows)
    const data = await publishApprovedExport(prepared, join(root, 'artifacts/dataset'))
    const parent = join(root, 'artifacts/training')
    await mkdir(parent, { recursive: true })
    const folder = await mkdtemp(join(parent, 'lora-'))
    const reportFolder = values['report-dir']
      ? resolve(values['report-dir'])
      : join(root, 'rapports/entrainement', basename(folder))
    if (!reportFolder.startsWith(`${join(root, 'rapports/entrainement')}/`))
      throw new Error('Report directory must belong to rapports/entrainement')
    await mkdir(reportFolder, { recursive: true })
    const config = join(reportFolder, 'config.json')
    await writeFile(
      config,
      JSON.stringify(loraConfig(prepared.rows, model, data, join(folder, 'adapter')), null, 2),
    )
    await writeFile(
      join(reportFolder, 'provenance.json'),
      JSON.stringify(prepared.manifest, null, 2),
    )
    console.log(`Training configuration: ${config}`)
    if (!values.run) return []
    const code = await train(root, config)
    await writeFile(
      join(reportFolder, 'result.json'),
      JSON.stringify({
        status: code === 0 ? 'completed-not-evaluated' : 'failed',
        code,
        adapterPath: join(folder, 'adapter'),
        configPath: config,
        provenancePath: join(reportFolder, 'provenance.json'),
      }),
    )
    if (code !== 0) throw new Error('LoRA failed; adapter is not approved')
    return []
  },
  'LoRA preparation finished; no adapter is automatically promoted.',
  'LoRA refused',
)
