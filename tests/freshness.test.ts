import { describe, expect, it } from "vitest";
import { freshnessWarnings } from "../src/scenarios/freshness.ts";

const baseline = {
  schemaVersion: 1 as const,
  scenariosRevision: "a".repeat(40),
  trainedRevision: null,
};
describe("scenario and training freshness warnings", () => {
  it("reports no drift for an unchanged clean source", () => {
    expect(
      freshnessWarnings(baseline, baseline.scenariosRevision, false),
    ).toEqual([]);
  });
  it("warns when Studio changes even if the MCP schema stays the same", () => {
    expect(freshnessWarnings(baseline, "b".repeat(40), false)).toEqual([
      "scenariosStale",
    ]);
  });
  it("warns about uncommitted changes", () => {
    expect(
      freshnessWarnings(baseline, baseline.scenariosRevision, true),
    ).toEqual(["sourceDirty"]);
  });
  it("does not invent a stale trained model before the first training", () => {
    expect(freshnessWarnings(baseline, "b".repeat(40), false)).not.toContain(
      "trainingStale",
    );
  });
  it("keeps warning about training after scenarios have been updated", () => {
    const source = "b".repeat(40);
    expect(
      freshnessWarnings(
        {
          ...baseline,
          scenariosRevision: source,
          trainedRevision: "a".repeat(40),
        },
        source,
        false,
      ),
    ).toEqual(["trainingStale"]);
  });
});
