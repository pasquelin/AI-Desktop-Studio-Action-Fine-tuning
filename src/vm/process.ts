import { type ChildProcess, spawn } from 'node:child_process'
import { ScenarioFailure } from '../scenarios/failure.ts'

const active = new Set<ChildProcess>()
/**
 * A streamed command already handed every chunk to its caller, so only the tail is kept: with a
 * channel the connection can stay open for the whole of a journey, and the whole transcript
 * would otherwise accumulate in one string for the sake of the last few kilobytes of an error.
 */
const STREAMED_TAIL = 65_536
export function cancelActiveCommands(): void {
  for (const child of active) child.kill('SIGTERM')
}
export function command(
  executable: string,
  args: string[],
  options: {
    input?: string
    interactive?: boolean
    timeout?: number
    onOutput?: (chunk: Buffer) => void
    /**
     * Keeps stdin open for the life of the command and hands the caller a line writer, so a
     * conversation with the remote process travels on the connection already running it.
     * Mutually exclusive with `input`, which closes stdin with its content.
     */
    channel?: (send: (line: string) => void) => void
  } = {},
): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      stdio: options.interactive
        ? 'inherit'
        : ['pipe', 'pipe', options.onOutput ? 'pipe' : 'inherit'],
      env: {
        ...process.env,
        TART_NO_AUTO_PRUNE: '1',
        GIT_TERMINAL_PROMPT: '0',
      },
    })
    active.add(child)
    let output = ''
    const keep = options.onOutput
      ? (text: string) => text.slice(-STREAMED_TAIL)
      : (text: string) => text
    child.stdout?.on('data', (data: Buffer) => {
      output = keep(output + data.toString())
      options.onOutput?.(data)
    })
    child.stderr?.on('data', (data: Buffer) => options.onOutput?.(data))
    child.stdin?.on('error', () => {})
    if (options.channel)
      options.channel(line => {
        if (child.stdin?.writable) child.stdin.write(`${line}\n`)
      })
    else child.stdin?.end(options.input)
    // The deadline and a deliberate cancellation both send SIGTERM, so the reason has to be
    // remembered here: it is the last link of the budget chain, and the only one that would
    // otherwise reach the report as bare text.
    let expired = false
    const timeout = options.timeout ?? 120_000
    const timer = setTimeout(() => {
      expired = true
      child.kill('SIGTERM')
    }, timeout)
    child.on('error', error => {
      active.delete(child)
      clearTimeout(timer)
      reject(error)
    })
    child.on('close', code => {
      active.delete(child)
      clearTimeout(timer)
      const tail = output ? `\n${output.slice(-6000)}` : ''
      if (code === 0) resolve(output.trim())
      else if (expired)
        reject(new ScenarioFailure('timeout', `${executable} timed out after ${timeout} ms${tail}`))
      else reject(new Error(`${executable} failed (${code ?? 'terminated'})${tail}`))
    })
  })
}
export function quote(value: string): string {
  return `'${value.replaceAll("'", "'\\''")}'`
}

/** Quote a value for OpenSSH's `-o` parser, which re-splits option values on spaces. */
export function sshConfigValue(value: string): string {
  return `"${value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`
}
