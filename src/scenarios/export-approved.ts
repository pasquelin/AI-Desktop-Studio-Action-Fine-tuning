import { createHash } from "node:crypto";
import { mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Ajv } from "ajv";
import { approvedContentHash, canonical } from "./content-hash.ts";

export { approvedContentHash } from "./content-hash.ts";

import { record } from "../json.ts";
import { assertDisjoint, type Split, splitFor } from "./split.ts";

interface Tool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}
interface Call {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}
interface Message {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: Call[];
  tool_call_id?: string;
}
interface Example {
  id: string;
  scenarioId: string;
  scenarioHash: string;
  group: string;
  relatedGroups: string[];
  split?: Split;
  messages: Message[];
  tools: Tool[];
  review: {
    decision: "approved";
    kind: "semantic-review";
    reviewer: string;
    contentHash: string;
  };
  evidence: {
    kind: "real-vm";
    status: "passed";
    runId: string;
    scenarioId: string;
    scenarioHash: string;
    contentHash: string;
    studioRevision: string;
    catalogueHash: string;
    checks: { name: string; passed: true }[];
  };
}
interface Bundle {
  seed: string;
  examples: Example[];
}
export interface ExportContext {
  studioRevision: string;
  catalogueHash: string;
  scenarioHashes: Record<string, string>;
}
const text = { type: "string", minLength: 1, pattern: "\\S" };
const hash = { type: "string", pattern: "^[a-f0-9]{64}$" };
const object = (
  properties: Record<string, unknown>,
  required = Object.keys(properties),
) => ({ type: "object", additionalProperties: false, properties, required });
const callSchema = object({
  id: text,
  type: { const: "function" },
  function: object({ name: text, arguments: text }),
});
const ajv = new Ajv({ strict: false, allErrors: true });
const valid = ajv.compile<Bundle>(
  object({
    seed: text,
    examples: {
      type: "array",
      minItems: 1,
      items: object(
        {
          id: text,
          scenarioId: text,
          scenarioHash: hash,
          group: text,
          relatedGroups: { type: "array", uniqueItems: true, items: text },
          split: { enum: ["train", "valid", "test"] },
          messages: {
            type: "array",
            minItems: 2,
            items: object(
              {
                role: { enum: ["system", "user", "assistant", "tool"] },
                content: { type: ["string", "null"] },
                tool_calls: { type: "array", minItems: 1, items: callSchema },
                tool_call_id: text,
              },
              ["role", "content"],
            ),
          },
          tools: {
            type: "array",
            minItems: 1,
            items: object({
              type: { const: "function" },
              function: object({
                name: text,
                description: text,
                parameters: { type: "object" },
              }),
            }),
          },
          review: object({
            decision: { const: "approved" },
            kind: { const: "semantic-review" },
            reviewer: text,
            contentHash: hash,
          }),
          evidence: object({
            kind: { const: "real-vm" },
            status: { const: "passed" },
            runId: text,
            scenarioId: text,
            scenarioHash: hash,
            contentHash: hash,
            studioRevision: text,
            catalogueHash: hash,
            checks: {
              type: "array",
              minItems: 1,
              items: object({ name: text, passed: { const: true } }),
            },
          }),
        },
        [
          "id",
          "scenarioId",
          "scenarioHash",
          "group",
          "relatedGroups",
          "messages",
          "tools",
          "review",
          "evidence",
        ],
      ),
    },
  }),
);
const contextValid = ajv.compile<ExportContext>(
  object({
    studioRevision: text,
    catalogueHash: hash,
    scenarioHashes: {
      type: "object",
      minProperties: 1,
      additionalProperties: hash,
    },
  }),
);

function checkConversation(example: Example): void {
  const tools = new Map(
    example.tools.map((tool) => [
      tool.function.name,
      ajv.compile(tool.function.parameters),
    ]),
  );
  if (tools.size !== example.tools.length) throw new Error("Duplicate tool");
  const pending = new Set<string>();
  const seen = new Set<string>();
  let hasCall = false;
  if (
    !example.messages.some(
      (message) => message.role === "user" && message.content?.trim(),
    ) ||
    example.messages.at(-1)?.role !== "assistant"
  )
    throw new Error("Incomplete conversation");
  for (const message of example.messages) {
    if (message.role !== "assistant" && message.tool_calls)
      throw new Error("Tool calls require assistant role");
    if (message.role !== "tool" && message.tool_call_id)
      throw new Error("Unexpected tool result id");
    if (message.role === "tool") {
      if (
        !message.tool_call_id ||
        !pending.delete(message.tool_call_id) ||
        !message.content?.trim()
      )
        throw new Error("Unmatched tool result");
    } else {
      if (pending.size) throw new Error("Missing tool result");
      if (!message.tool_calls && !message.content?.trim())
        throw new Error("Empty message");
    }
    for (const call of message.tool_calls ?? []) {
      const validate = tools.get(call.function.name);
      const args: unknown = JSON.parse(call.function.arguments);
      if (!validate?.(args) || seen.has(call.id))
        throw new Error("Invalid tool call");
      seen.add(call.id);
      pending.add(call.id);
      hasCall = true;
    }
  }
  if (!hasCall || pending.size) throw new Error("Incomplete tool execution");
}

export function prepareApprovedExport(input: unknown, context: unknown) {
  if (!valid(input))
    throw new Error(
      `Invalid or unreviewed export bundle: ${ajv.errorsText(valid.errors)}`,
    );
  if (!contextValid(context)) throw new Error("Invalid current export context");
  const rows: Record<Split, { messages: Message[]; tools: Tool[] }[]> = {
    train: [],
    valid: [],
    test: [],
  };
  const identities = new Set<string>();
  const fingerprints = new Map<string, string>();
  const partitions: { group: string; split: Split }[] = [];
  const provenance: {
    id: string;
    group: string;
    split: Split;
    contentHash: string;
    runId: string;
  }[] = [];
  for (const example of input.examples) {
    if (identities.has(example.id)) throw new Error("Duplicate example id");
    identities.add(example.id);
    const contentHash = approvedContentHash(example);
    const evidence = example.evidence;
    if (
      example.review.contentHash !== contentHash ||
      evidence.contentHash !== contentHash
    )
      throw new Error("Stale content approval/evidence");
    if (
      evidence.scenarioId !== example.scenarioId ||
      evidence.scenarioHash !== example.scenarioHash ||
      context.scenarioHashes[example.scenarioId] !== example.scenarioHash
    )
      throw new Error("Stale scenario evidence");
    if (
      evidence.studioRevision !== context.studioRevision ||
      evidence.catalogueHash !== context.catalogueHash
    )
      throw new Error("Stale Studio/catalogue evidence");
    const split = splitFor(example.group, input.seed);
    if (example.split && example.split !== split)
      throw new Error("Split conflicts with stable group assignment");
    for (const group of [example.group, ...example.relatedGroups]) {
      if (splitFor(group, input.seed) !== split)
        throw new Error("Related semantic group crosses partitions");
      partitions.push({ group, split });
    }
    const fingerprint = canonical({
      messages: example.messages,
      tools: example.tools,
    });
    const oldGroup = fingerprints.get(fingerprint);
    if (oldGroup && oldGroup !== example.group)
      throw new Error("Duplicate content across semantic groups");
    fingerprints.set(fingerprint, example.group);
    checkConversation(example);
    rows[split].push({ messages: example.messages, tools: example.tools });
    provenance.push({
      id: example.id,
      group: example.group,
      split,
      contentHash,
      runId: evidence.runId,
    });
  }
  assertDisjoint(partitions);
  return {
    rows,
    manifest: {
      seed: input.seed,
      studioRevision: context.studioRevision,
      catalogueHash: context.catalogueHash,
      provenance,
    },
  };
}

/** Immutable directory published by one rename; no partial train/valid/test replacement. */
export async function publishApprovedExport(
  prepared: ReturnType<typeof prepareApprovedExport>,
  parent: string,
): Promise<string> {
  const identity = createHash("sha256")
    .update(canonical(prepared))
    .digest("hex");
  await mkdir(parent, { recursive: true });
  const temporary = await mkdtemp(join(parent, ".approved-"));
  const destination = join(parent, `approved-${identity}`);
  try {
    for (const split of ["train", "valid", "test"] as const)
      await writeFile(
        join(temporary, `${split}.jsonl`),
        prepared.rows[split].map((row) => JSON.stringify(row)).join("\n") +
          (prepared.rows[split].length ? "\n" : ""),
      );
    await writeFile(
      join(temporary, "manifest.json"),
      `${JSON.stringify(prepared.manifest, null, 2)}\n`,
    );
    await rename(temporary, destination);
    return destination;
  } catch (error) {
    await rm(temporary, { recursive: true, force: true });
    throw error;
  }
}

/** A copied evidence object is insufficient: require a conversation link in the saved run. */
export function verifyRecordedConversation(
  example: unknown,
  report: unknown,
): void {
  if (!record(example) || !record(example.evidence))
    throw new Error("Missing example evidence");
  const evidence = example.evidence;
  if (
    !record(report) ||
    report.status !== "passed" ||
    !record(report.provenance) ||
    !Array.isArray(report.steps) ||
    report.steps.length === 0 ||
    !report.steps.every((step) => record(step) && step.status === "passed")
  )
    throw new Error("Recorded VM run did not pass completely");
  const provenance = report.provenance;
  for (const key of [
    "runId",
    "studioRevision",
    "catalogueHash",
    "scenarioHash",
    "kind",
  ])
    if (provenance[key] !== evidence[key])
      throw new Error(`Recorded VM provenance mismatch: ${key}`);
  if (!Array.isArray(report.conversationEvidence))
    throw new Error(
      "VM report has no evidence linked to exact conversation content; reference actions cannot approve LoRA data",
    );
  const link = report.conversationEvidence.find(
    (item) =>
      record(item) &&
      item.contentHash === evidence.contentHash &&
      item.scenarioId === evidence.scenarioId &&
      item.scenarioHash === evidence.scenarioHash,
  );
  if (
    !record(link) ||
    !Array.isArray(link.checks) ||
    link.checks.length === 0 ||
    !link.checks.every(
      (check) =>
        record(check) &&
        typeof check.name === "string" &&
        check.name.trim() &&
        check.passed === true,
    ) ||
    canonical(link.checks) !== canonical(evidence.checks)
  )
    throw new Error("Missing or mismatched recorded conversation checks");
}
