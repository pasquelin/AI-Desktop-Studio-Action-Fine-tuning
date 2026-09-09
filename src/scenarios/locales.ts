import { record } from "../json.ts";

/** Structural checks only: matching placeholders does not certify translation meaning. */
export function validateTemplates(
  source: Record<string, string>,
  translated: unknown,
): string[] {
  if (!record(translated)) return ["Invalid translation object"];
  const errors: string[] = [];
  for (const key of Object.keys(translated))
    if (!(key in source)) errors.push(`Unknown key: ${key}`);
  for (const [key, text] of Object.entries(source)) {
    const value = translated[key];
    if (typeof value !== "string" || !value.trim()) {
      errors.push(`Missing text: ${key}`);
      continue;
    }
    const tokens = (input: string) =>
      JSON.stringify((input.match(/\{[^{}]+\}/g) ?? []).sort());
    if (tokens(text) !== tokens(value))
      errors.push(`Changed placeholders: ${key}`);
  }
  return errors;
}
