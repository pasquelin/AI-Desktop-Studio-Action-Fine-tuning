/** Shared JSON shape guard; parsing untrusted files is not specific to any layer. */
export function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/** A missing file is an expected outcome; every other read failure is a real fault. */
export function absent(error: unknown): boolean {
  return record(error) && error.code === 'ENOENT'
}
