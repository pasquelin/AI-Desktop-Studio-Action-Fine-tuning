import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, it } from "vitest";
import { logChunk } from "../src/vm/logs.ts";
import { command } from "../src/vm/process.ts";

let root = "";
afterEach(async () => {
  if (root) await rm(root, { recursive: true, force: true });
});
async function fixture() {
  root = await mkdtemp(join(tmpdir(), "vm-logs-"));
  const name = "studio-ft-00000000-0000-0000-0000-000000000000";
  const dir = join(root, "artifacts/vm", name);
  await mkdir(join(dir, "results"), { recursive: true });
  await writeFile(
    join(dir, "record.json"),
    JSON.stringify({
      name,
      owner: root,
      mode: "build",
      key: "unused",
      status: "build-passed",
    }),
  );
  return { name, dir };
}
it("reconstructs all log bytes across bounded pages", async () => {
  const { name, dir } = await fixture();
  const expected = "étape\n".repeat(20000);
  await writeFile(join(dir, "activity.log"), expected);
  let offset = 0;
  const chunks: Buffer[] = [];
  do {
    const part = await logChunk(root, name, offset);
    chunks.push(Buffer.from(part.data, "base64"));
    offset = part.next;
    if (offset === part.size) break;
  } while (offset < Buffer.byteLength(expected));
  expect(Buffer.concat(chunks).toString()).toBe(expected);
});
it("uses retained build logs for older executions", async () => {
  const { name, dir } = await fixture();
  await writeFile(join(dir, "results/build.log"), "saved");
  expect(
    Buffer.from((await logChunk(root, name, 0)).data, "base64").toString(),
  ).toBe("saved");
  await expect(logChunk(root, name, -1)).rejects.toThrow();
  await expect(logChunk(root, "../../foreign", 0)).rejects.toThrow();
});
it("streams both output channels while preserving stdout return contract", async () => {
  const chunks: Buffer[] = [];
  const output = await command(
    process.execPath,
    ["-e", "process.stdout.write('out');process.stderr.write('err')"],
    { onOutput: (chunk) => chunks.push(chunk) },
  );
  expect(output).toBe("out");
  expect(Buffer.concat(chunks).toString()).toContain("err");
});
