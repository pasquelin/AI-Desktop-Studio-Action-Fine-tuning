import { Ajv } from "ajv";
import { record } from "../json.ts";
import { designCase } from "./case-design.ts";
import type { InventoryCase, InventoryJourney } from "./inventory.ts";

export interface BenchExample {
  rank: string;
  source: string;
  sourceHash: string;
  setupExpression: string;
  oracleExpression: string;
  saidExpression: string;
}

/** The wire contract differs from the internal action contract (notably consent). */
export function compileCaseExample(
  item: InventoryCase,
  action: Record<string, unknown>,
  wireSchema: Record<string, unknown>,
  references: string[],
) {
  if (!record(action.inputSchema))
    throw new Error(`Missing internal schema: ${item.action}`);
  const design = designCase(item, action, action.inputSchema);
  const validate = wireValidator(wireSchema);
  const variants = design.fixture.requests.map(({ label, input }) => {
    const accepted = Boolean(validate(input));
    const errors = (validate.errors ?? []).map(
      ({ instancePath, keyword, params }) => ({
        instancePath,
        keyword,
        params,
      }),
    );
    return {
      id: `${item.id}/${label}`,
      request: {
        transport: "mcp",
        name: item.action.replace(".", "_"),
        arguments: input,
      },
      expectedWireResult: { accepted, errors },
      // Rejection can be checked without creating fake runtime resources.
      executionClass: accepted
        ? "studio-integration-required"
        : "offline-schema-contract",
      runtimeBindings: Object.entries(input)
        .filter(([, value]) => JSON.stringify(value).includes("fixture"))
        .map(([field]) => field),
      trainingEligible: false,
    };
  });
  return {
    id: item.id,
    action: item.action,
    source: item.source,
    specification: item.specification,
    kind: design.kind,
    context: {
      isolation: "disposable-vm",
      declaredCapabilities: action.capabilities ?? {},
      declaredRequirements: action.requires ?? {},
      studioBenchRanks: references,
      setupStatus: "not-bound",
    },
    variants,
    expectedBusinessResult: {
      specification: item.specification,
      verified: false,
    },
    languageReferences: {
      binding: `datasets/scenarios/bindings.json#${item.id}`,
      templates: "datasets/scenarios/locales",
      status: "review-required",
    },
    dialogue: null,
    blockers: [
      "bind-real-fixture",
      "author-case-specific-business-oracle",
      "author-natural-dialogue",
      "review-translations",
      "execute-in-studio",
    ],
    purpose: "test-specification-not-lora-dialogue",
    executionStatus: "not-run",
    trainingApproved: false,
  };
}

const ajv = new Ajv({ strict: false, allErrors: true });
const validators = new WeakMap<
  Record<string, unknown>,
  ReturnType<typeof ajv.compile>
>();
function wireValidator(schema: Record<string, unknown>) {
  let validate = validators.get(schema);
  if (!validate) {
    validate = ajv.compile(schema);
    validators.set(schema, validate);
  }
  return validate;
}

export function compileJourneyExample(
  item: InventoryJourney,
  actions: Set<string>,
) {
  const names = [
    ...(
      item.specification.match(/Actions candidates : (.*)/)?.[1] ?? ""
    ).matchAll(/`([^`]+)`/g),
  ].map((match) => match[1]);
  if (names.some((name) => !name || !actions.has(name)))
    throw new Error(`Unknown journey action: ${item.id}`);
  return {
    id: item.id,
    source: item.source,
    request: item.specification.match(/^- Demande : « (.*) »/m)?.[1] ?? null,
    candidateActions: names,
    expectedBusinessResult:
      item.specification.match(/^- Contrôle : (.*)$/m)?.[1] ?? null,
    languageReference: `datasets/scenarios/journey-locales/{language}.json#${item.id}`,
    steps: [],
    blockers: [
      "choose-fixture",
      "bind-ordered-actions-and-arguments",
      "compose-independent-oracle",
      "review-translations",
      "execute-in-studio",
    ],
    executionStatus: "not-run",
    trainingApproved: false,
  };
}
