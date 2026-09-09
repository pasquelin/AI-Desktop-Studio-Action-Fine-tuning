import { mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { parseArgs } from "node:util";
import { buildCatalogue } from "../src/catalogue/build.ts";
import { runCheck } from "./run-check.ts";

let summary = "";
await runCheck(
  async () => {
    const { values } = parseArgs({
      options: {
        source: { type: "string" },
        output: { type: "string", default: "artifacts/catalogue.json" },
        revision: { type: "string" },
      },
    });
    if (!values.source)
      throw new Error(
        "Usage: catalogue:export --source <Studio checkout> [--revision <full SHA>] [--output <file>]",
      );
    const root = resolve(values.source);
    const output = resolve(values.output);
    const fromSource = relative(root, output);
    if (
      fromSource === "" ||
      (!fromSource.startsWith("..") && !isAbsolute(fromSource))
    )
      throw new Error("Export output must be outside the Studio checkout.");
    const catalogue = await buildCatalogue(root, values.revision);
    mkdirSync(dirname(output), { recursive: true });
    const temp = `${output}.${process.pid}.tmp`;
    try {
      writeFileSync(temp, `${JSON.stringify(catalogue, null, 2)}\n`, {
        flag: "wx",
      });
      renameSync(temp, output);
    } finally {
      rmSync(temp, { force: true });
    }
    writeFileSync(
      ".studio-source.json",
      `${JSON.stringify({ sourceRoot: root, output }, null, 2)}\n`,
    );
    summary = `Exported ${catalogue.actions.length} actions, ${catalogue.mcpTools.length} MCP tools and ${catalogue.languages.length} languages to ${output}.`;
    return [];
  },
  () => summary,
  "Catalogue export failed.",
);
