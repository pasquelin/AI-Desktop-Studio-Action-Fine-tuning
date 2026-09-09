import { expect, it } from "vitest";
import { designCase } from "../src/scenarios/case-design.ts";

const schema = {
  type: "object",
  properties: { name: { type: "string" }, enabled: { type: "boolean" } },
  required: ["name"],
  additionalProperties: false,
};
const item = (specification: string) => ({
  id: "test/1",
  action: "test",
  source: "test.md",
  specification,
});
it("does not demand rejection for an omitted optional field", () => {
  expect(
    designCase(item("Paramètre enabled absent : conserver."), {}, schema)
      .fixture.requests[0]?.internalSchemaAccepts,
  ).toBe(true);
  expect(
    designCase(item("Paramètre name absent : refuser."), {}, schema).fixture
      .requests[0]?.internalSchemaAccepts,
  ).toBe(false);
});
it("rejects unknown fields and generates both boolean cases", () => {
  expect(
    designCase(item("Champ inconnu : refuser."), {}, schema).fixture.requests[0]
      ?.internalSchemaAccepts,
  ).toBe(false);
  expect(
    designCase(
      item("Booléen enabled : vrai puis faux."),
      {},
      schema,
    ).fixture.requests.map((x) => x.input.enabled),
  ).toEqual([true, false]);
});
