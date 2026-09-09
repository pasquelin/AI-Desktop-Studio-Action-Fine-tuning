import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { validatePilot } from "../src/config/validate-pilot.ts";

const fixture = (): Record<string, unknown> =>
  JSON.parse(
    readFileSync(new URL("../configs/pilot.json", import.meta.url), "utf8"),
  );

const model = (id: string, role: "primary" | "comparison") => ({
  id,
  role,
  license: "Apache-2.0",
  status: "candidate",
});

describe("pilot configuration boundary", () => {
  it("accepts the repository's multilingual candidate configuration", () => {
    expect(validatePilot(fixture())).toEqual([]);
  });

  it.each([
    { schemaVersion: 99 },
    { unexpected: true },
    { languages: ["en", "en"] },
    { languages: ["english"] },
    { languages: [] },
    { actions: ["node.add", "node.add"] },
    { actions: [] },
    { models: [] },
    { limits: { maxTurns: 0, timeoutMs: 5000 } },
    { limits: { maxTurns: 3, timeoutMs: -1 } },
    { network: "automatic" },
  ])("rejects invalid configuration %j", (patch) => {
    expect(validatePilot({ ...fixture(), ...patch }).length).toBeGreaterThan(0);
  });

  it("rejects duplicate model identifiers even if roles differ", () => {
    const models = [
      model("test/same", "primary"),
      model("test/same", "comparison"),
    ];
    expect(validatePilot({ ...fixture(), models })).toContain(
      "Model identifiers must be unique.",
    );
  });

  it("requires exactly one primary candidate", () => {
    const models = [model("test/one", "primary"), model("test/two", "primary")];
    expect(validatePilot({ ...fixture(), models })).toContain(
      "Exactly one primary candidate is required.",
    );
  });

  it("rejects null without throwing", () => {
    expect(validatePilot(null).length).toBeGreaterThan(0);
  });
});
