import { Ajv, type ErrorObject } from "ajv";
import { record } from "../json.ts";
import type { DeclarativeScenario } from "./declarative.ts";

const pointerPart = (key: string) =>
  key.replaceAll("~", "~0").replaceAll("/", "~1");
/** Only a complete DSL expression is deferred; literal siblings remain checked. */
function deferredPaths(value: unknown, path = ""): string[] {
  if (Array.isArray(value))
    return value.flatMap((item, index) =>
      deferredPaths(item, `${path}/${index}`),
    );
  if (!record(value)) return [];
  if ("$ref" in value) {
    if (
      typeof value.$ref !== "string" ||
      !value.$ref.trim() ||
      Object.keys(value).some((key) => !["$ref", "find", "pick"].includes(key))
    )
      throw new Error("Invalid dynamic reference");
    return [path];
  }
  if ("$file" in value) {
    if (Object.keys(value).length !== 1 || !record(value.$file))
      throw new Error("Invalid dynamic file observation");
    return [path];
  }
  return Object.entries(value).flatMap(([key, child]) =>
    deferredPaths(child, `${path}/${pointerPart(key)}`),
  );
}
function below(path: string, parent: string): boolean {
  return path === parent || path.startsWith(`${parent}/`);
}
function relevant(error: ErrorObject, deferred: string[]): boolean {
  if (deferred.some((path) => below(error.instancePath, path))) return false;
  // Branch selection may depend on an unresolved child. Never turn a failed branch into a pass.
  if (
    ["anyOf", "oneOf", "not", "if"].includes(error.keyword) &&
    deferred.some((path) => below(path, error.instancePath))
  )
    throw new Error(
      "Cannot preflight a conditional schema with unresolved descendants",
    );
  return true;
}

const ajv = new Ajv({ strict: false, allErrors: true });
const catalogueValidators = new WeakMap<
  object,
  Map<string, ReturnType<Ajv["compile"]>>
>();

/** Root compilation preserves local $defs/$ref resolution; unsupported references fail closed. */
export function checkScenarioInputs(
  plan: DeclarativeScenario,
  tools: unknown,
): void {
  if (!Array.isArray(tools)) throw new Error("Invalid MCP catalogue");
  let validators = catalogueValidators.get(tools);
  if (!validators) {
    validators = new Map<string, ReturnType<typeof ajv.compile>>();
    for (const tool of tools) {
      if (
        !record(tool) ||
        typeof tool.name !== "string" ||
        !record(tool.inputSchema)
      )
        throw new Error("Invalid MCP tool schema");
      if (validators.has(tool.name))
        throw new Error(`Duplicate MCP tool: ${tool.name}`);
      try {
        validators.set(tool.name, ajv.compile(tool.inputSchema));
      } catch (error) {
        throw new Error(
          `Cannot preflight MCP schema ${tool.name}: ${String(error)}`,
        );
      }
    }
    catalogueValidators.set(tools, validators);
  }
  for (const step of plan.steps) {
    const validate = validators.get(step.action.replace(".", "_"));
    if (!validate)
      throw new Error(`${plan.id}/${step.id}: unknown action ${step.action}`);
    const deferred = deferredPaths(step.input);
    if (validate(step.input)) continue;
    const errors = (validate.errors ?? []).filter((error) =>
      relevant(error, deferred),
    );
    if (errors.length)
      throw new Error(
        `${plan.id}/${step.id}: invalid literal MCP arguments: ${ajv.errorsText(errors)}`,
      );
  }
}
