import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Ajv } from "ajv";

export interface StudioLink {
  sourceRoot: string;
  output: string;
}

const linkValid = new Ajv({ strict: true }).compile<StudioLink>({
  type: "object",
  required: ["sourceRoot", "output"],
  additionalProperties: false,
  properties: { sourceRoot: { type: "string" }, output: { type: "string" } },
});

/** Reads the gitignored local Studio binding; null when no checkout is configured. */
export function readStudioLink(path: string): StudioLink | null {
  if (!existsSync(path)) return null;
  const link: unknown = JSON.parse(readFileSync(path, "utf8"));
  if (!linkValid(link))
    throw new Error("Invalid local Studio source configuration.");
  return link;
}

/** Where catalogue:export wrote its output; the default only applies with no binding. */
export function cataloguePath(root: string): string {
  return (
    readStudioLink(resolve(root, ".studio-source.json"))?.output ??
    resolve(root, "artifacts/catalogue.json")
  );
}

export function execGit(root: string, ...args: string[]): string {
  return execFileSync("git", ["-C", root, ...args], {
    encoding: "utf8",
  }).trim();
}

/** Revision and working-tree state of a Studio checkout; policy on staleness lives in callers. */
export function readCheckoutState(root: string): {
  revision: string;
  dirty: boolean;
} {
  return {
    revision: execGit(root, "rev-parse", "HEAD"),
    dirty: execGit(root, "status", "--porcelain").length > 0,
  };
}
