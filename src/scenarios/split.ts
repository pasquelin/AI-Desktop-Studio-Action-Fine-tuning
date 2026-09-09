import { createHash } from "node:crypto";

export type Split = "train" | "valid" | "test";
/** Assign semantic families together, including every translation and paraphrase. */
export function splitFor(group: string, seed: string): Split {
  if (!group.trim() || !seed.trim()) throw new Error("Missing split identity");
  const bucket =
    createHash("sha256").update(`${seed}\0${group}`).digest().readUInt32BE(0) %
    100;
  return bucket < 70 ? "train" : bucket < 85 ? "valid" : "test";
}
export function assertDisjoint(rows: { group: string; split: Split }[]): void {
  const seen = new Map<string, Split>();
  for (const row of rows) {
    const previous = seen.get(row.group);
    if (previous && previous !== row.split)
      throw new Error(`Split leakage: ${row.group}`);
    seen.set(row.group, row.split);
  }
}
