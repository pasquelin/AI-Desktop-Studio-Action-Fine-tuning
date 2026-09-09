import { open, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { isManagedName, readRecord, stateDir } from "./ownership.ts";

export async function latestRun(root: string) {
  const state = stateDir(root);
  const entries = await Promise.all(
    (await readdir(state)).filter(isManagedName).map(async (name) => ({
      record: await readRecord(name, root, state),
      created: (await stat(join(state, name))).birthtimeMs,
    })),
  );
  return entries.sort((a, b) => b.created - a.created)[0]?.record;
}

/** Fixed allowlist of log files; callers cannot supply a filesystem path. */
export async function logChunk(root: string, name: string, offset: number) {
  await readRecord(name, root, stateDir(root));
  if (!Number.isSafeInteger(offset) || offset < 0)
    throw new Error("Invalid log offset");
  const folder = join(stateDir(root), name);
  for (const file of ["activity.log", "results/build.log"]) {
    let handle: Awaited<ReturnType<typeof open>>;
    try {
      handle = await open(join(folder, file), "r");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
      throw error;
    }
    try {
      const size = (await handle.stat()).size;
      const start = offset > size ? 0 : offset;
      const buffer = Buffer.alloc(65536);
      const { bytesRead } = await handle.read(buffer, 0, buffer.length, start);
      return {
        data: buffer.subarray(0, bytesRead).toString("base64"),
        next: start + bytesRead,
        size,
        reset: start !== offset,
        file,
      };
    } finally {
      await handle.close();
    }
  }
  return { data: "", next: 0, size: 0, reset: offset !== 0, file: "" };
}
