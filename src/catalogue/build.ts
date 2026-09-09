import { makeCatalogue } from "./catalogue.ts";
import { loadSnapshot } from "./load-snapshot.ts";
import { assertFresh, inspectSource } from "./source.ts";

/** Export a clean checkout, refusing a source that changed while it was loaded. */
export async function buildCatalogue(root: string, revision?: string) {
  const before = inspectSource(root, revision);
  const snapshot = await loadSnapshot(root);
  assertFresh(
    { appRevision: before.revision, sourceHashes: before.hashes },
    inspectSource(root, before.revision),
  );
  return makeCatalogue(snapshot, before.names, before.revision, before.hashes);
}
