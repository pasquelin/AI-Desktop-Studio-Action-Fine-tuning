import { execFileSync } from "node:child_process";
import { lstatSync } from "node:fs";
import { join } from "node:path";

const forbidden = [
  {
    pattern: /\.(gguf|safetensors|bin|pt|pth|onnx)$/i,
    reason: "prohibited model or weight format",
  },
  { pattern: /\.(pem|key)$/i, reason: "prohibited credential format" },
  {
    pattern: /(^|\/)(models|checkpoints|artifacts|node_modules|\.venv)(\/|$)/,
    reason: "prohibited directory",
  },
  { pattern: /(^|\/)\.env(?!\.example$)/, reason: "environment file" },
  {
    pattern: /(^|\/)id_(rsa|ed25519|ecdsa|dsa)$/,
    reason: "private key filename",
  },
];

/** Checks candidate paths and sizes only; this is not a content-based secret scanner. */
export function inspectRepository(
  root: string,
  maxBytes = 1_048_576,
): string[] {
  const names = execFileSync(
    "git",
    [
      "-C",
      root,
      "ls-files",
      "--cached",
      "--others",
      "--exclude-standard",
      "-z",
    ],
    { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 },
  );
  const errors: string[] = [];
  // Unmerged paths are listed once per stage, so collapse duplicates.
  for (const name of new Set(names.split("\0").filter(Boolean))) {
    const stat = lstatSync(join(root, name), { throwIfNoEntry: false });
    if (!stat) continue;
    const rule = forbidden.find((candidate) => candidate.pattern.test(name));
    if (rule) errors.push(`${name}: ${rule.reason}.`);
    if (stat.isSymbolicLink())
      errors.push(`${name}: symbolic link is not allowed.`);
    else if (!stat.isFile())
      errors.push(`${name}: only regular files are allowed.`);
    else if (stat.size > maxBytes)
      errors.push(`${name}: exceeds ${maxBytes} bytes.`);
  }
  return errors;
}
