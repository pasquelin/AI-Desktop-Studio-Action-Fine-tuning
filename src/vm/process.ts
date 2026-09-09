import { type ChildProcess, spawn } from 'node:child_process'

const active = new Set<ChildProcess>()
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
    child.stdout?.on('data', (data: Buffer) => {
      output += data.toString()
      options.onOutput?.(data)
    })
    child.stderr?.on('data', (data: Buffer) => options.onOutput?.(data))
    child.stdin?.on('error', () => {})
    child.stdin?.end(options.input)
    const timer = setTimeout(() => {
      child.kill('SIGTERM')
    }, options.timeout ?? 120_000)
    child.on('error', error => {
      active.delete(child)
      clearTimeout(timer)
      reject(error)
    })
    child.on('close', code => {
      active.delete(child)
      clearTimeout(timer)
      if (code === 0) resolve(output.trim())
      else
        reject(
          new Error(
            `${executable} failed (${code ?? 'terminated'})${output ? `\n${output.slice(-6000)}` : ''}`,
          ),
        )
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
