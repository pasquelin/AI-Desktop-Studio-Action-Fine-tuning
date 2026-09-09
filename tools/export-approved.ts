import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { sha256 } from "../src/catalogue/catalogue.ts";
import { assertFresh, inspectSource } from "../src/catalogue/source.ts";
import { record } from "../src/json.ts";
import {
  prepareApprovedExport,
  publishApprovedExport,
  verifyRecordedConversation,
} from "../src/scenarios/export-approved.ts";
import { readStudioLink } from "../src/studio/checkout.ts";
import { readRecord, stateDir } from "../src/vm/ownership.ts";
import { runCheck } from "./run-check.ts";

await runCheck(
  async () => {
    const [bundleFile, scenarioManifest, ...extra] = process.argv.slice(2);
    if (!bundleFile || !scenarioManifest || extra.length)
      throw new Error(
        "Usage: node tools/export-approved.ts <reviewed-bundle.json> <current-scenario-manifest.json>",
      );
    const root = resolve(import.meta.dirname, "..");
    const link = readStudioLink(join(root, ".studio-source.json"));
    if (!link) throw new Error("Studio source required for approved export");
    const catalogueText = await readFile(link.output, "utf8");
    const catalogue: unknown = JSON.parse(catalogueText);
    if (
      !record(catalogue) ||
      typeof catalogue.appRevision !== "string" ||
      typeof catalogue.catalogueHash !== "string" ||
      !record(catalogue.sourceHashes)
    )
      throw new Error("Invalid catalogue");
    const hashes: Record<string, string> = {};
    for (const [key, value] of Object.entries(catalogue.sourceHashes)) {
      if (typeof value !== "string") throw new Error("Invalid source hash");
      hashes[key] = value;
    }
    const { catalogueHash, ...body } = catalogue;
    if (sha256(JSON.stringify(body)) !== catalogueHash)
      throw new Error("Catalogue hash mismatch");
    const current = inspectSource(link.sourceRoot);
    assertFresh(
      { appRevision: catalogue.appRevision, sourceHashes: hashes },
      current,
    );
    const manifest: unknown = JSON.parse(
      await readFile(scenarioManifest, "utf8"),
    );
    if (!record(manifest) || !record(manifest.scenarioHashes))
      throw new Error("Current manifest requires scenarioHashes");
    const bundle: unknown = JSON.parse(await readFile(bundleFile, "utf8"));
    const context = {
      studioRevision: catalogue.appRevision,
      catalogueHash: sha256(catalogueText),
      scenarioHashes: manifest.scenarioHashes,
    };
    const prepared = prepareApprovedExport(bundle, context);
    if (!record(bundle) || !Array.isArray(bundle.examples))
      throw new Error("Invalid examples");
    for (const example of bundle.examples) {
      if (
        !record(example) ||
        !record(example.evidence) ||
        typeof example.evidence.runId !== "string"
      )
        throw new Error("Missing VM run identity");
      const name = example.evidence.runId;
      const state = stateDir(root);
      const owned = await readRecord(name, root, state);
      if (
        owned.mode !== "build" ||
        !["build-passed", "removed"].includes(owned.status)
      )
        throw new Error("VM run ownership/status does not permit export");
      const report: unknown = JSON.parse(
        await readFile(join(state, name, "results", "scenario.json"), "utf8"),
      );
      verifyRecordedConversation(example, report);
    }
    const destination = await publishApprovedExport(
      prepared,
      join(root, "artifacts/dataset"),
    );
    console.log(`Approved dataset: ${destination}`);
    return [];
  },
  "Approved export published; training was not started.",
  "Approved export rejected",
);
