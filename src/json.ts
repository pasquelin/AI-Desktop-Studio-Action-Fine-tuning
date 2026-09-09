/** Shared JSON shape guard; parsing untrusted files is not specific to any layer. */
export function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
