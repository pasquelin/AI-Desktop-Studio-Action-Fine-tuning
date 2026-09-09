export interface Baseline {
  schemaVersion: 1;
  scenariosRevision: string;
  trainedRevision: string | null;
}

/** Drift reasons; their user-facing wording belongs to the tool that prints them. */
export type FreshnessWarning =
  | "scenariosStale"
  | "sourceDirty"
  | "trainingStale";

export function freshnessWarnings(
  baseline: Baseline,
  revision: string,
  dirty: boolean,
): FreshnessWarning[] {
  const warnings: FreshnessWarning[] = [];
  if (baseline.scenariosRevision !== revision) warnings.push("scenariosStale");
  if (dirty) warnings.push("sourceDirty");
  if (
    baseline.trainedRevision !== null &&
    (baseline.trainedRevision !== revision || dirty)
  )
    warnings.push("trainingStale");
  return warnings;
}
