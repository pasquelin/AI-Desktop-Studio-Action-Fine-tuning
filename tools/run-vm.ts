import { mkdir, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { ensureObserver } from "../src/vm/observer-process.ts";
import {
  isManagedName,
  isPreparedReference,
  readRecord,
  stateDir,
} from "../src/vm/ownership.ts";
import { runPipeline } from "../src/vm/pipeline.ts";
import { command } from "../src/vm/process.ts";
import { listLocalVmNames } from "../src/vm/tart.ts";
import { runCheck } from "./run-check.ts";

const { values } = parseArgs({
  options: {
    scenario: { type: "boolean", default: false },
    journey: { type: "string" },
  },
});
const root = resolve(import.meta.dirname, "..");
const state = stateDir(root);
const vm = (...args: string[]) =>
  command(process.execPath, [join(root, "tools/vm.ts"), ...args], {
    interactive: true,
    timeout: 7_200_000,
  });

await runCheck(
  async () => {
    await mkdir(state, { recursive: true, mode: 0o700 });
    console.log(
      `Suivre le test dans le navigateur : ${await ensureObserver(root)}`,
    );
    await runPipeline({
      findReference: async () => {
        const [locals, entries] = await Promise.all([
          listLocalVmNames(),
          readdir(state),
        ]);
        const records = await Promise.all(
          entries
            .filter(isManagedName)
            .map((name) => readRecord(name, root, state)),
        );
        const ready = records.filter(
          (record) =>
            isPreparedReference(record) && locals.includes(record.name),
        );
        if (ready.length > 1)
          throw new Error(
            "Multiple prepared references: select explicitly with vm build --base",
          );
        return ready[0]?.name;
      },
      prepare: async () => {
        await vm("prepare", "--source", "sequoia-vanilla");
      },
      build: async (reference) => {
        await vm(
          "build",
          "--base",
          reference,
          ...(values.scenario || values.journey ? ["--scenario"] : []),
          ...(values.journey ? ["--journey", values.journey] : []),
        );
      },
    });
    return [];
  },
  "VM pipeline finished; see the reports above.",
  "VM pipeline failed.",
);
