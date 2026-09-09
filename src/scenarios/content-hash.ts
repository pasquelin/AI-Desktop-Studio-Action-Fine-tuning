import { createHash } from "node:crypto";
import { record } from "../json.ts";

/** Stable JSON hashing binds semantic approval and runtime evidence to exact content. */
export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (record(value))
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`)
      .join(",")}}`;
  const encoded = JSON.stringify(value);
  if (encoded === undefined) throw new Error("Non-JSON content");
  return encoded;
}
export function approvedContentHash(value: unknown): string {
  if (!record(value)) throw new Error("Invalid example content");
  const content = Object.fromEntries(
    [
      "scenarioId",
      "scenarioHash",
      "group",
      "relatedGroups",
      "messages",
      "tools",
    ].map((key) => [key, value[key]]),
  );
  return createHash("sha256").update(canonical(content)).digest("hex");
}
