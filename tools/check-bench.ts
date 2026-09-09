import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { sha256 } from "../src/catalogue/catalogue.ts";
import { record } from "../src/json.ts";
import { benchReadiness } from "../src/scenarios/capabilities.ts";
import { parseScenario } from "../src/scenarios/declarative.ts";
import { checkScenarioInputs } from "../src/scenarios/preflight.ts";
import { cataloguePath } from "../src/studio/checkout.ts";
import { runCheck } from "./run-check.ts";

const root = join(import.meta.dirname, "..");
await runCheck(
  async () => {
    const catalogue: unknown = JSON.parse(
      await readFile(cataloguePath(root), "utf8"),
    );
    if (!record(catalogue) || !Array.isArray(catalogue.actions))
      throw new Error("Missing catalogue");
    const actions = new Set(
      catalogue.actions.map((action) => (record(action) ? action.name : null)),
    );
    const directory = join(root, "datasets/bench/journeys");
    const files = (await readdir(directory))
      .filter((file) => /^P\d{3}\.json$/.test(file))
      .sort();
    const rows = [];
    const scenarioHashes: Record<string, string> = {};
    for (let i = 1; i <= 63; i++)
      if (!files.includes(`P${String(i).padStart(3, "0")}.json`))
        throw new Error(`Missing journey ${i}`);
    for (const file of files) {
      const raw = await readFile(join(directory, file), "utf8");
      const plan = parseScenario(JSON.parse(raw));
      checkScenarioInputs(plan, catalogue.mcpTools);
      scenarioHashes[plan.id] = sha256(raw);
      if (`${plan.id}.json` !== file)
        throw new Error(`Journey identity mismatch ${file}`);
      const bindings = new Set([
        "sandbox",
        "projectPath",
        ...(plan.requiredBindings ?? []),
      ]);
      const refs = (value: unknown): void => {
        if (Array.isArray(value)) {
          value.forEach(refs);
          return;
        }
        if (!record(value)) return;
        if (
          typeof value.$ref === "string" &&
          !bindings.has(value.$ref.split(".")[0] ?? "")
        )
          throw new Error(`${file}: unknown binding ${value.$ref}`);
        Object.values(value).forEach(refs);
      };
      for (const step of plan.steps) {
        if (!actions.has(step.action))
          throw new Error(`${file}: unknown action ${step.action}`);
        refs(step.input);
        if (step.saveAs) bindings.add(step.saveAs);
        for (const check of step.assertions) {
          refs(check.actual);
          refs(check.expected);
          if (check.saveAs) bindings.add(check.saveAs);
        }
      }
      const { ready, missing, unbound } = benchReadiness(plan);
      rows.push({
        id: plan.id,
        steps: plan.steps.length,
        readyForAttempt: ready,
        missing,
        requiredBindings: unbound,
        blockers: plan.blockers,
        executionVerified: false,
      });
    }
    await mkdir(join(root, "artifacts/bench"), { recursive: true });
    await writeFile(
      join(root, "artifacts/bench/preparation.json"),
      JSON.stringify(
        {
          scenarioHashes,
          journeys: rows.length,
          steps: rows.reduce((sum, row) => sum + row.steps, 0),
          readyForAttempt: rows.filter((row) => row.readyForAttempt).length,
          plans: rows,
        },
        null,
        2,
      ),
    );
    console.log(
      `${rows.length} journeys checked; ${rows.filter((row) => row.readyForAttempt).length} ready for VM attempt; others retain explicit blockers.`,
    );
    return [];
  },
  "Bench preparation checked; no execution success inferred.",
  "Bench check failed",
);
