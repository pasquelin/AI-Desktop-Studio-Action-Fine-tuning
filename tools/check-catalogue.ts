import { existsSync, readFileSync } from "node:fs";
import { Ajv } from "ajv";
import { sha256 } from "../src/catalogue/catalogue.ts";
import { assertFresh, inspectSource } from "../src/catalogue/source.ts";
import { runCheck } from "./run-check.ts";

const ajv = new Ajv({ strict: true });
const linkValid = ajv.compile<{ sourceRoot: string; output: string }>({
  type: "object",
  required: ["sourceRoot", "output"],
  additionalProperties: false,
  properties: { sourceRoot: { type: "string" }, output: { type: "string" } },
});
const catalogueValid = ajv.compile<{
  appRevision: string;
  sourceHashes: Record<string, string>;
  catalogueHash: string;
}>({
  type: "object",
  required: ["appRevision", "sourceHashes", "catalogueHash"],
  properties: {
    appRevision: { type: "string" },
    sourceHashes: { type: "object", additionalProperties: { type: "string" } },
    catalogueHash: { type: "string" },
  },
});

const configured = existsSync(".studio-source.json");
await runCheck(
  () => {
    if (configured) {
      const link: unknown = JSON.parse(
        readFileSync(".studio-source.json", "utf8"),
      );
      if (!linkValid(link))
        throw new Error("Invalid local Studio source configuration.");
      const saved: unknown = JSON.parse(readFileSync(link.output, "utf8"));
      if (!catalogueValid(saved)) throw new Error("Invalid catalogue export.");
      const { catalogueHash, ...body } = saved;
      if (sha256(JSON.stringify(body)) !== catalogueHash)
        throw new Error("Catalogue content hash does not match.");
      assertFresh(saved, inspectSource(link.sourceRoot));
    }
    return [];
  },
  configured
    ? "Catalogue matches the current clean Studio revision and source files."
    : "Studio source not configured: freshness check not run (foundation-only validation).",
  "Catalogue freshness check failed.",
);
