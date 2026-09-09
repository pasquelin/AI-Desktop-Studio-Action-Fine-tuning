import { describe, expect, it } from "vitest";
import { makeCatalogue } from "../src/catalogue/catalogue.ts";

const snapshot = () => ({
  language: "en",
  languages: ["en", "fr"],
  families: [{ name: "scene", actions: ["node.add"] }],
  registryNames: ["node.add"],
  actions: [
    {
      name: "node.add",
      fields: [],
      inputSchema: { type: "object" },
      raises: { runtimeFunction: true },
    },
  ],
  mcpTools: [
    {
      name: "node_add",
      inputSchema: { properties: { consent: { type: "string" } } },
    },
  ],
});
const revision = "a".repeat(40);

describe("catalogue export contract", () => {
  it("preserves internal metadata and the separate MCP schema", () => {
    const data = snapshot();
    const result = makeCatalogue(data, ["node.add"], revision, {
      "source.ts": "b".repeat(64),
    });
    expect(result.actions).toEqual(data.actions);
    expect(result.mcpTools).toEqual(data.mcpTools);
    expect(result.appRevision).toBe(revision);
    expect(result.catalogueHash).toMatch(/^[a-f0-9]{64}$/);
  });
  it("produces the same hash for equivalent source hash order", () => {
    const a = makeCatalogue(snapshot(), ["node.add"], revision, {
      b: "2",
      a: "1",
    });
    const b = makeCatalogue(snapshot(), ["node.add"], revision, {
      a: "1",
      b: "2",
    });
    expect(a).toEqual(b);
  });
  it("detects a changed field in the catalogue hash", () => {
    const before = makeCatalogue(snapshot(), ["node.add"], revision, {});
    const changed = snapshot();
    const after = makeCatalogue(
      {
        ...changed,
        actions: [
          { ...changed.actions[0], fields: [{ key: "name", required: true }] },
        ],
      },
      ["node.add"],
      revision,
      {},
    );
    expect(before.catalogueHash).not.toBe(after.catalogueHash);
  });
  it("rejects a declared action absent from the registry", () => {
    expect(() =>
      makeCatalogue(snapshot(), ["node.add", "node.remove"], revision, {}),
    ).toThrow(/declared/i);
  });
  it("rejects duplicate registered actions", () => {
    const data = snapshot();
    expect(() =>
      makeCatalogue(
        { ...data, actions: [...data.actions, ...data.actions] },
        ["node.add"],
        revision,
        {},
      ),
    ).toThrow(/duplicate/i);
  });
  it("rejects family order inconsistent with the registry", () => {
    expect(() =>
      makeCatalogue(
        { ...snapshot(), registryNames: [] },
        ["node.add"],
        revision,
        {},
      ),
    ).toThrow(/registry/i);
  });
  it("rejects malformed module output", () => {
    expect(() => makeCatalogue(null, [], revision, {})).toThrow(/snapshot/i);
  });
});
