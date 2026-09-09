import { describe, expect, it } from "vitest";
import { assertDisjoint, splitFor } from "../src/scenarios/split.ts";

describe("semantic partitions", () => {
  it("keeps the same family stable regardless of translation or dataset order", () => {
    const forward: [string, string][] = [
      "project.create",
      "node.add",
      "document.open",
    ].map((group) => [group, splitFor(group, "v1")]);
    const backward = [...forward]
      .reverse()
      .map(([group]) => [group, splitFor(group, "v1")])
      .reverse();
    expect(backward).toEqual(forward);
  });
  it("rejects leakage across partitions", () => {
    expect(() =>
      assertDisjoint([
        { group: "same", split: "train" },
        { group: "same", split: "test" },
      ]),
    ).toThrow("Split leakage");
    expect(() =>
      assertDisjoint([
        { group: "same", split: "train" },
        { group: "same", split: "train" },
      ]),
    ).not.toThrow();
  });
});
