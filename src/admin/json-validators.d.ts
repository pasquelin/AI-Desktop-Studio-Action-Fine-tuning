import type { ValidateFunction } from "ajv";
import type { DeclarativeScenario } from "../scenarios/declarative.ts";
export const scenario: ValidateFunction<DeclarativeScenario>;
export const input: ValidateFunction;
export const assertions: ValidateFunction;
