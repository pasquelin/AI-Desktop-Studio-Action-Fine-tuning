export interface LogChunk {
  data: string
  next: number
  size: number
}
export interface LiveLog extends LogChunk {
  run: string
  status: string
  reset: boolean
  file: string
}

const bytes = (data: string) => Uint8Array.from(atob(data), character => character.charCodeAt(0))

/** Terminal colouring is noise in a web view; only the escape payload is dropped. */
const stripAnsi = (text: string): string =>
  text
    .split(String.fromCharCode(27))
    .map((segment, index) => (index ? segment.replace(/^\[[0-9;]*[a-zA-Z]/, '') : segment))
    .join('')

/**
 * Owns the decode state of one log file: which run it follows, how far it has read, and the
 * partial multi-byte character left by the previous chunk. A class rather than a closure, so
 * following a log never keeps an enclosing render scope alive.
 */
export class LogStream {
  run = ''
  offset = 0
  private text = ''
  private decoder = new TextDecoder()

  /** A new run, or a rotated file, restarts the decode from an empty buffer. */
  private restart(run: string): void {
    this.run = run
    this.offset = 0
    this.text = ''
    this.decoder = new TextDecoder()
  }

  append(chunk: LogChunk & { run?: string; reset?: boolean }): string {
    const run = chunk.run ?? this.run
    if (this.run !== run || chunk.reset) this.restart(run)
    this.text += this.decoder.decode(bytes(chunk.data), { stream: true })
    this.offset = chunk.next
    return stripAnsi(this.text)
  }

  /** True while the file holds more than what has been read, so polling should catch up. */
  behind(chunk: LogChunk): boolean {
    return this.offset < chunk.size
  }
}
