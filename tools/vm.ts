import { type ChildProcess, spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { once } from 'node:events'
import { createWriteStream } from 'node:fs'
import { mkdir, readdir, readFile, rm, statfs, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { parseArgs } from 'node:util'
import { assertScenarioEnabled } from '../src/admin/scenario-activation.ts'
import { sha256 } from '../src/catalogue/catalogue.ts'
import { GUEST_WAIT_MS, RELAY_MS, SCENARIO_RUN_MS } from '../src/qa/budgets.ts'
import { failureCode, ScenarioFailure } from '../src/scenarios/failure.ts'
import { isJourneyId, RANDOM_ID } from '../src/scenarios/identity.ts'
import { cycle } from '../src/vm/lifecycle.ts'
import {
  isManagedName,
  isPreparedReference,
  readRecord,
  stateDir,
  VM_PREFIX,
  type VmRecord,
} from '../src/vm/ownership.ts'
import { cancelActiveCommands, command, quote, sshConfigValue } from '../src/vm/process.ts'
import { exportQaAttempt, exportRunFolder } from '../src/vm/report-folder.ts'
import { beginSnapshots, SNAPSHOT, saveSnapshot } from '../src/vm/snapshots.ts'
import { listLocalVmNames } from '../src/vm/tart.ts'
import { freezeJourneyPayload } from './guest-payload.ts'

const root = resolve(import.meta.dirname, '..')
const state = stateDir(root)
const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    source: { type: 'string' },
    base: { type: 'string' },
    name: { type: 'string' },
    scenario: { type: 'boolean', default: false },
    journey: { type: 'string' },
    session: { type: 'boolean', default: false },
  },
})
const mode = positionals[0]
const owned = (name: string) => readRecord(name, root, state)
/** Guest executables, kept with the report; no `guest` means delivery over ssh stdin. */
const guestScripts = [
  {
    source: 'tools/vm/window-view.ts',
    local: 'window-view.ts',
    guest: 'source/window-view.ts',
  },
  {
    source: 'tools/vm/studio-launch.ts',
    local: 'studio-launch.ts',
    guest: 'source/studio-launch.ts',
  },
  {
    source: 'tools/vm/startup.mjs',
    local: 'startup.mjs',
    guest: 'source/.ft-startup.mjs',
  },
  {
    source: 'tools/vm/scenarios/client.mjs',
    local: 'client.mjs',
    guest: 'source/client.mjs',
    scenarioOnly: true,
  },
  { source: 'tools/vm/build.sh', local: 'build.sh' },
  {
    source: 'src/scenarios/runner.ts',
    local: 'runner.ts',
    guest: 'source/runner.ts',
    scenarioOnly: true,
  },
  {
    source: 'src/scenarios/failure.ts',
    local: 'failure.ts',
    guest: 'source/failure.ts',
    scenarioOnly: true,
  },
  {
    source: 'src/vm/scenario-consent.ts',
    local: 'scenario-consent.ts',
    guest: 'source/scenario-consent.ts',
    scenarioOnly: true,
  },
  {
    source: values.journey
      ? 'tools/vm/scenarios/declarative.mjs'
      : 'tools/vm/scenarios/project.mjs',
    local: 'project.mjs',
    guest: 'source/.ft-project.mjs',
    scenarioOnly: true,
  },
]
async function main() {
  // Freeze guest executables before the asynchronous VM preparation starts.
  const frozen = new Map<string, string>()
  if (values.journey) {
    if (!values.scenario || !isJourneyId(values.journey))
      throw new Error('Journey requires --scenario and a valid journey id')
    await assertScenarioEnabled(root, values.journey)
    const payload = await freezeJourneyPayload(root, values.journey)
    frozen.set('scenario-spec.json', payload.spec)
    frozen.set('seed-media.json', payload.media)
    frozen.set('bench.mjs', payload.engine)
  }
  if (mode === 'build')
    for (const script of guestScripts)
      if (values.scenario || values.session || !script.scenarioOnly)
        frozen.set(script.local, await readFile(join(root, script.source), 'utf8'))
  const buildScript = frozen.get('build.sh') ?? ''
  if (!['prepare', 'build', 'cleanup', 'check'].includes(mode ?? ''))
    throw new Error(
      'Usage: vm check | prepare --source LOCAL_VM | build --base PREPARED_VM | cleanup --name OWNED_VM',
    )
  if (process.platform !== 'darwin' || process.arch !== 'arm64')
    throw new Error('Tart requires an Apple Silicon Mac')
  await mkdir(state, { recursive: true, mode: 0o700 })
  if (mode === 'prepare' && !process.stdin.isTTY)
    throw new Error('Run prepare in an interactive terminal for the first VM password prompt.')
  if (mode === 'check') {
    console.log(await command('tart', ['--version']))
    console.log((await listLocalVmNames()).join('\n'))
    return
  }
  const lock = join(state, 'active.lock')
  await mkdir(lock) // Exclusive; a stale lock requires deliberate recovery.
  let interrupted = false
  const interrupt = () => {
    interrupted = true
    cancelActiveCommands()
  }
  process.on('SIGINT', interrupt)
  process.on('SIGTERM', interrupt)
  try {
    if (mode === 'cleanup') {
      const name = values.name ?? ''
      const previous = await owned(name)
      // A copy left stopped is a normal cleanup input; delete reports a missing VM.
      await command('tart', ['stop', name]).catch(() => {})
      await command('tart', ['delete', name])
      await writeFile(
        join(state, name, 'record.json'),
        JSON.stringify({ ...previous, status: 'removed' } satisfies VmRecord, null, 2),
      )
      console.log(`Removed owned VM ${name}; reports retained.`)
      return
    }
    for (const entry of await readdir(state)) {
      if (!isManagedName(entry)) continue
      const previous = await owned(entry)
      if (previous.status === 'failed-retained')
        throw new Error(`Clean up retained failed VM ${entry} before another run.`)
    }
    const reference = mode === 'build' ? await owned(values.base ?? '') : undefined
    if (reference && !isPreparedReference(reference))
      throw new Error('Base is not a prepared reference')
    const source = reference?.name ?? values.source ?? ''
    const locals = await listLocalVmNames()
    if (!source || !locals.includes(source))
      throw new Error('Source VM must already exist locally; no implicit image download')
    const disk = await statfs(state)
    if (disk.bavail * disk.bsize < 30 * 1024 ** 3)
      throw new Error(
        'At least 30 GiB free required for preparation (disk usage is workload-dependent)',
      )
    const name = VM_PREFIX + randomUUID()
    const dir = join(state, name)
    await mkdir(dir, { mode: 0o700 })
    const key = reference?.key ?? join(dir, 'id_ed25519')
    const record: VmRecord & {
      source: string
      revision: string
      createdAt: string
    } = {
      owner: root,
      name,
      source,
      mode: reference ? 'build' : 'prepare',
      key,
      status: 'created',
      revision: '',
      createdAt: new Date().toISOString(),
    }
    const save = () =>
      writeFile(join(dir, 'record.json'), JSON.stringify(record, null, 2), {
        mode: 0o600,
      })
    await save()
    process.send?.({ type: 'vm-run', name })
    await beginSnapshots(root, name)
    const activity = createWriteStream(join(dir, 'activity.log'), {
      flags: 'a',
      mode: 0o600,
    })
    const journal = (message: string) => {
      activity.write(`[${new Date().toLocaleTimeString('fr-FR')}] ${message}\n`)
    }
    let imageQueue = Promise.resolve()
    let outputLine = ''
    let captureScenario = ''
    let activeRequestId = ''
    /** Writes one line to the guest run in progress; absent while no scenario is running. */
    let toGuest: ((line: string) => void) | undefined
    /** At most one question is in flight, so the request in flight is the whole state. */
    let asking: { id: string; settle: (response: unknown) => void } | undefined
    // The guest keeps one source folder across a campaign: only bytes it does not hold travel.
    const delivered = new Map<string, string>()
    const relayModel = async (line: string) => {
      const request = JSON.parse(line.slice(15))
      if (!activeRequestId || asking || !RANDOM_ID.test(request.modelRequestId ?? '')) return
      const requestId = request.modelRequestId
      try {
        const response = await new Promise<unknown>((resolve, reject) => {
          const timer = setTimeout(
            () => reject(new ScenarioFailure('timeout', 'Model relay timed out')),
            RELAY_MS,
          )
          asking = {
            id: requestId,
            settle: value => {
              clearTimeout(timer)
              resolve(value)
            },
          }
          process.send?.({
            type: 'model-request',
            id: activeRequestId,
            modelRequestId: requestId,
            context: request.context,
          })
        })
        // The answer goes back down the connection that asked for it. A second session, whose
        // only job was to write a file the guest then polled, could fail on its own.
        if (!toGuest) throw new Error('Aucun parcours invité en cours pour recevoir la réponse')
        toGuest(JSON.stringify(response))
      } catch (error) {
        // One question, exactly one answer. Staying silent here leaves the guest to wait out its
        // own budget and report its deadline instead of the reason this side already knows —
        // which is the whole guarantee the budget chain is ordered to provide.
        const code = failureCode(error)
        journal(String(error))
        toGuest?.(
          JSON.stringify({
            modelRequestId: requestId,
            error: String(error),
            ...(code ? { code } : {}),
          }),
        )
      } finally {
        asking = undefined
      }
    }

    const output = (chunk: Buffer) => {
      activity.write(chunk)
      outputLine += chunk.toString('utf8')
      const lines = outputLine.split('\n')
      outputLine = (lines.pop() ?? '').slice(-262144)
      for (const line of lines) {
        if (line.startsWith('[ModelRequest] ')) {
          void relayModel(line).catch(error => journal(String(error)))
          continue
        }
        if (!line.startsWith('[Capture] ')) continue
        try {
          const event = JSON.parse(line.slice(10))
          if (
            typeof event.file !== 'string' ||
            !SNAPSHOT.test(event.file) ||
            typeof event.activity !== 'string' ||
            event.activity.length > 300
          )
            continue
          // Bind the attempt now: the queue drains later, when another attempt may own the run.
          const scenario = captureScenario
          const label = scenario ? `${scenario} · ${event.activity}` : event.activity
          imageQueue = imageQueue
            .then(async () => {
              const local = join(dir, 'action-image.jpg')
              try {
                await transfer(`admin@${ip}:studio-vm/action-images/${event.file}`, local)
                await saveSnapshot(
                  root,
                  name,
                  await readFile(local),
                  label,
                  Number(event.file.slice(0, 13)),
                  scenario,
                )
              } finally {
                await rm(local, { force: true })
              }
            })
            .catch(() => journal('Une capture d’action n’a pas pu être rapatriée.'))
        } catch {
          /* Unstructured application output is only a log, never an instruction. */
        }
      }
    }
    journal('Exécution créée. Aucun modèle en apprentissage.')
    let vm: ChildProcess | undefined
    let ip = ''
    // Shared hardening; only the host-key policy and authentication differ per transport.
    const transport = [
      '-F',
      '/dev/null',
      '-o',
      'ForwardAgent=no',
      '-o',
      'ClearAllForwardings=yes',
      '-o',
      'IdentitiesOnly=yes',
      '-o',
      `UserKnownHostsFile=${sshConfigValue(join(dir, 'known_hosts'))}`,
    ]
    /** `live` streams the guest output into the journal; `channel` keeps a line back open. */
    const ssh = (
      script: string,
      options: {
        password?: boolean
        timeout?: number
        live?: boolean
        channel?: (send: (line: string) => void) => void
      } = {},
    ) =>
      command(
        'ssh',
        [
          ...transport,
          '-o',
          'StrictHostKeyChecking=accept-new',
          '-o',
          'ConnectTimeout=10',
          ...(options.password
            ? ['-o', 'PubkeyAuthentication=no']
            : ['-o', 'BatchMode=yes', '-i', key]),
          `admin@${ip}`,
          `/bin/bash -lc ${quote(script)}`,
        ],
        {
          interactive: options.password ?? false,
          timeout: options.timeout ?? 3_600_000,
          ...(options.live ? { onOutput: output } : {}),
          ...(options.channel ? { channel: options.channel } : {}),
        },
      )
    // Transfer over the isolated connection; no host folder mounts or credentials in the guest.
    const transfer = (from: string, to: string, recursive = false) =>
      command(
        'scp',
        [
          ...transport,
          '-o',
          'BatchMode=yes',
          '-o',
          'StrictHostKeyChecking=yes',
          '-i',
          key,
          ...(recursive ? ['-r'] : []),
          from,
          to,
        ],
        { timeout: 600_000 },
      )
    const provision = async () => {
      await command('ssh-keygen', ['-t', 'ed25519', '-N', '', '-f', key, '-C', 'studio-vm-only'])
      const pub = (await readFile(`${key}.pub`, 'utf8')).trim()
      console.log('One-time VM SSH password required. No personal SSH keys will be transferred.')
      await ssh(
        `mkdir -p ~/.ssh && chmod 700 ~/.ssh && printf '%s\n' ${quote(pub)} >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys`,
        { password: true },
      )
      console.log(await ssh(await readFile(join(root, 'tools/vm/provision.sh'), 'utf8')))
    }
    const buildRelease = async () => {
      await ssh('true', { timeout: 30_000 })
      journal('VM démarrée — première capture du bureau.')
      const captureScript = join(dir, 'window-view.ts')
      await writeFile(captureScript, frozen.get('window-view.ts') ?? '')
      await transfer(captureScript, `admin@${ip}:studio-vm/window-view.ts`)
      await ssh(
        `export PATH="/opt/homebrew/opt/node@24/bin:/opt/homebrew/bin:$PATH"; cd ~/studio-vm; node --input-type=module -e 'import {captureScreen} from "./window-view.ts"; await captureScreen(process.env.HOME+"/studio-vm", "VM démarrée · bureau avant préparation Studio")'`,
        { timeout: 90_000, live: true },
      )
      journal('Récupération de Studio et préparation du catalogue.')
      // Read the remote into an isolated clone; do not touch the user's checkout.
      const checkout = join(dir, 'source')
      await command(
        'git',
        [
          'clone',
          '--depth',
          '1',
          '--no-tags',
          '--single-branch',
          '--branch',
          'develop',
          'git@github.com:pasquelin/AIDesktopStudio.git',
          checkout,
        ],
        { timeout: 600_000 },
      )
      // Imported here so check, prepare and cleanup never load the bundler.
      const { buildCatalogue } = await import('../src/catalogue/build.ts')
      const catalogue = await buildCatalogue(checkout)
      record.revision = catalogue.appRevision
      await save()
      const catalogueText = JSON.stringify(catalogue, null, 2)
      await writeFile(join(dir, 'catalogue.json'), catalogueText)
      const tree = await command('git', ['-C', checkout, 'ls-tree', '-r', 'HEAD'])
      const attributes = await command('git', [
        '-C',
        checkout,
        'grep',
        '-l',
        'filter=lfs',
        '--',
        ':(glob)**/.gitattributes',
        '.gitattributes',
      ]).catch(() => '')
      if (/^160000 /m.test(tree) || attributes)
        throw new Error(
          'Source now requires submodule/LFS support; refusing an incomplete archive.',
        )
      const archive = join(dir, 'source.tar')
      await command('git', [
        '-C',
        checkout,
        'archive',
        '--format=tar',
        `--output=${archive}`,
        record.revision,
      ])
      journal('Transfert de la révision figée vers la VM.')
      await ssh('mkdir -p ~/studio-vm/source')
      await transfer(archive, `admin@${ip}:studio-vm/source.tar`)
      await ssh('tar -xf ~/studio-vm/source.tar -C ~/studio-vm/source && rm ~/studio-vm/source.tar')
      await rm(archive)
      await rm(checkout, { recursive: true })
      for (const script of guestScripts) {
        const content = frozen.get(script.local)
        if (content === undefined) continue
        await writeFile(join(dir, script.local), content)
        if (script.guest)
          await transfer(join(dir, script.local), `admin@${ip}:studio-vm/${script.guest}`)
      }
      if (values.journey) {
        for (const file of ['bench.mjs', 'scenario-spec.json', 'seed-media.json']) {
          await writeFile(join(dir, file), frozen.get(file) ?? '')
          await transfer(join(dir, file), `admin@${ip}:studio-vm/source/${file}`)
        }
        await transfer(
          join(dir, 'catalogue.json'),
          `admin@${ip}:studio-vm/source/scenario-catalogue.json`,
        )
      }
      if (values.scenario) {
        // In journey mode the scenario is exactly the transferred spec; one hash, one field.
        const provenance = {
          runId: record.name,
          studioRevision: record.revision,
          catalogueHash: sha256(catalogueText),
          scenarioHash: sha256(
            values.journey ? (frozen.get('scenario-spec.json') ?? '') : JSON.stringify([...frozen]),
          ),
          engineHash: values.journey ? sha256(frozen.get('bench.mjs') ?? '') : undefined,
          mediaHash: values.journey ? sha256(frozen.get('seed-media.json') ?? '') : undefined,
          kind: 'real-vm',
        }
        await writeFile(join(dir, 'provenance.json'), JSON.stringify(provenance, null, 2))
        await transfer(join(dir, 'provenance.json'), `admin@${ip}:studio-vm/source/provenance.json`)
      }
      try {
        console.log(
          await ssh(
            `${values.session ? 'export STUDIO_FT_SESSION=1\n' : ''}${values.scenario ? 'export STUDIO_FT_SCENARIO=1\n' : ''}${buildScript}`,
            { live: true },
          ),
        )
      } finally {
        await imageQueue
        // Reports and logs are what a failed build leaves behind; fetch them either way.
        await transfer(`admin@${ip}:studio-vm/results`, dir, true).catch(() => {})
      }
    }
    const serveSession = async () => {
      if (!process.send) throw new Error('Session requires its local controller')
      record.status = 'ready'
      await save()
      journal('VM prête. Aucun scénario ni entraînement lancé automatiquement.')
      process.send({ type: 'ready', name })
      let active: Promise<void> | undefined
      let closing = false
      await new Promise<void>((finish, reject) => {
        const shutdown = (failure?: Error) => {
          if (closing) return
          closing = true
          process.off('message', receive)
          cancelActiveCommands()
          asking?.settle({ error: 'Session arrêtée' })
          void (active ?? Promise.resolve()).finally(() => (failure ? reject(failure) : finish()))
        }
        const receive = (value: unknown) => {
          if (!value || typeof value !== 'object') return
          const request = value as {
            type?: string
            id?: string
            journey?: string
            model?: string
            modelRequestId?: string
          }
          if (
            request.type === 'model-response' &&
            request.id === activeRequestId &&
            request.modelRequestId
          ) {
            if (asking?.id === request.modelRequestId) asking.settle(value)
            return
          }
          if (request.type !== 'qa' || active || closing) return
          activeRequestId = request.id ?? ''
          active = executeRequest(request)
            .then(
              result => {
                if (process.connected) process.send?.({ type: 'result', id: request.id, ...result })
              },
              error => {
                if (process.connected)
                  process.send?.({
                    type: 'result',
                    id: request.id,
                    code: 1,
                    error: String(error),
                    ...(failureCode(error) ? { errorCode: failureCode(error) } : {}),
                  })
              },
            )
            .finally(() => {
              active = undefined
              activeRequestId = ''
            })
        }
        process.on('message', receive)
        process.once('disconnect', () => shutdown())
        process.once('SIGINT', () => shutdown())
        process.once('SIGTERM', () => shutdown())
        vm?.once('exit', () => shutdown(new Error('La VM s’est arrêtée pendant la session')))
      })
    }
    const executeRequest = async (request: { id?: string; journey?: string; model?: string }) => {
      if (
        !request.id ||
        !/^[a-f0-9-]{36}$/.test(request.id) ||
        !isJourneyId(request.journey ?? '') ||
        !request.model
      )
        throw new Error('Invalid QA request')
      const startedAt = Date.now()
      const { plan, spec, media, engine } = await freezeJourneyPayload(root, request.journey ?? '')
      captureScenario = request.journey ?? ''
      const attempt = join(dir, 'qa', request.id)
      await mkdir(attempt, { recursive: true })
      const catalogue = await readFile(join(dir, 'catalogue.json'), 'utf8')
      const provenance = {
        runId: name,
        studioRevision: record.revision,
        catalogueHash: sha256(catalogue),
        scenarioHash: sha256(spec),
        engineHash: sha256(engine),
        mediaHash: sha256(media),
        kind: 'real-vm',
        qa: { model: request.model, provider: 'ollama', mode: 'guided-scenario' },
      }
      const files = new Map([
        ['.ft-reset-session.mjs', await readFile(join(root, 'tools/vm/reset-session.mjs'), 'utf8')],
        ['scenario-spec.json', spec],
        ['bench.mjs', engine],
        ['scenario-catalogue.json', catalogue],
        ['seed-media.json', media],
        ['provenance.json', JSON.stringify(provenance)],
        [
          '.ft-project.mjs',
          await readFile(join(root, 'tools/vm/scenarios/declarative.mjs'), 'utf8'),
        ],
      ])
      for (const [file, content] of files) {
        await writeFile(join(attempt, file), content)
        const digest = sha256(content)
        if (delivered.get(file) === digest) continue
        await transfer(join(attempt, file), `admin@${ip}:studio-vm/source/${file}`)
        delivered.set(file, digest)
      }
      // Each scenario receives a distinct confined project root, leaving failed evidence intact.
      const env = `export STUDIO_FT_CASE=${quote(request.id)}; export STUDIO_FT_MODEL_WAIT_MS=${GUEST_WAIT_MS}; export PATH="/opt/homebrew/opt/node@24/bin:/opt/homebrew/bin:$PATH"; cd ~/studio-vm/source; `
      let code = 0
      let error = ''
      let errorCode: string | undefined
      await ssh('rm -f ~/studio-vm/results/scenario.json')
      try {
        await ssh(`${env}node .ft-project.mjs`, {
          timeout: SCENARIO_RUN_MS,
          live: true,
          channel: send => {
            toGuest = send
          },
        })
      } catch (failure) {
        code = 1
        error = String(failure)
        errorCode = failureCode(failure)
      } finally {
        // A capture taken after the attempt belongs to no scenario; it must not inherit this one.
        captureScenario = ''
        toGuest = undefined
      }
      await imageQueue
      await transfer(`admin@${ip}:studio-vm/results/scenario.json`, join(attempt, 'scenario.json'))
      const report = JSON.parse(await readFile(join(attempt, 'scenario.json'), 'utf8'))
      if (
        report.scenario !== plan.id ||
        report.provenance?.scenarioHash !== provenance.scenarioHash ||
        report.provenance?.qa?.model !== request.model
      )
        throw new Error('Rapport invité incohérent avec cette tentative')
      if (report.status !== 'passed') code = 1
      await exportQaAttempt(root, name, request.id, report, startedAt)
      return {
        code,
        runId: name,
        reportPath: `rapports/debug/${request.id}/scenario.json`,
        report,
        ...(error ? { error } : {}),
        ...(errorCode ? { errorCode } : {}),
      }
    }
    try {
      await cycle(
        {
          clone: async () => {
            journal('Création de la copie jetable.')
            await command('tart', ['clone', source, name], {
              timeout: 600_000,
            })
          },
          start: async () => {
            journal('Démarrage de la VM : 4 cœurs, 16 Gio, écran 1920 × 1080.')
            await command('tart', [
              'set',
              name,
              '--cpu',
              '4',
              '--memory',
              '16384',
              '--display',
              '1920x1080pt',
              '--no-display-refit',
            ])
            vm = spawn('tart', ['run', name, '--no-graphics', '--no-audio', '--no-clipboard'], {
              stdio: 'ignore',
            })
            let bootError: Error | undefined
            vm.on('error', error => {
              bootError = error
            })
            for (let i = 0; i < 90; i++) {
              if (interrupted || bootError || vm.exitCode !== null)
                throw new Error('VM launch interrupted or failed')
              try {
                ip = await command('tart', ['ip', name], { timeout: 3000 })
              } catch {
                ip = ''
              }
              if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip)) return
              await delay(2000)
            }
            throw new Error('VM did not obtain an IP address')
          },
          execute: async () => {
            if (interrupted) throw new Error('Interrupted')
            await (mode === 'prepare' ? provision() : buildRelease())
            if (values.session) await serveSession()
            if (interrupted) throw new Error('Interrupted')
          },
          stop: async () => {
            journal('Arrêt de la VM.')
            if (ip) {
              // SSH disconnects when macOS shuts down; allow the guest to flush its disk first.
              await ssh('sync; sudo shutdown -h now', { timeout: 30_000 }).catch(() => {})
              if (vm?.exitCode === null) await Promise.race([once(vm, 'exit'), delay(30_000)])
            }
            if (vm?.exitCode === null) await command('tart', ['stop', name])
          },
          remove: async () => {
            journal('Suppression de la copie jetable ; conservation des rapports.')
            await owned(name)
            await command('tart', ['delete', name])
          },
        },
        mode === 'prepare',
      )
      record.status = mode === 'prepare' ? 'ready' : 'build-passed'
      journal('Exécution terminée avec succès.')
    } catch (error) {
      record.status = 'failed-retained'
      journal('Échec : copie conservée pour diagnostic.')
      throw error
    } finally {
      await new Promise<void>(resolve => activity.end(resolve))
      await save()
      try {
        console.log(`Rapports locaux : ${await exportRunFolder(root, name)}`)
      } catch (error) {
        console.error('Export du rapport local impossible :', error)
      }
      console.log(`VM report: ${join(dir, 'record.json')}`)
    }
  } finally {
    process.off('SIGINT', interrupt)
    process.off('SIGTERM', interrupt)
    await rm(lock, { recursive: true })
  }
}
main().catch(error => {
  console.error(error instanceof Error ? error.message : 'VM operation failed')
  process.exitCode = 1
})
