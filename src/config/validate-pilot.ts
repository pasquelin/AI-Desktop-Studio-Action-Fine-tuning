import { readFileSync } from "node:fs";
import { Ajv, type ValidateFunction } from "ajv";

interface Pilot {
  models: { id: string; role: "primary" | "comparison" }[];
}

let compiled: ValidateFunction<Pilot> | undefined;

/** Compiled on first call so callers can catch a missing or malformed schema. */
function validator(): ValidateFunction<Pilot> {
  compiled ??= new Ajv({ allErrors: true, strict: true }).compile<Pilot>(
    JSON.parse(
      readFileSync(
        new URL("../../schemas/pilot.schema.json", import.meta.url),
        "utf8",
      ),
    ),
  );
  return compiled;
}

export function validatePilot(value: unknown): string[] {
  const check = validator();
  if (!check(value)) {
    return (check.errors ?? []).map(
      (error) =>
        `${error.instancePath || "/"}: ${error.message ?? "Invalid value"}`,
    );
  }
  const errors: string[] = [];
  if (
    new Set(value.models.map((model) => model.id)).size !== value.models.length
  ) {
    errors.push("Model identifiers must be unique.");
  }
  if (value.models.filter((model) => model.role === "primary").length !== 1) {
    errors.push("Exactly one primary candidate is required.");
  }
  return errors;
}
