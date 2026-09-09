export type InventoryCase = {
  id: string;
  action: string;
  source: string;
  specification: string;
};
export type InventoryJourney = {
  id: string;
  source: string;
  specification: string;
};

/** Keep authored prose intact; extraction must never manufacture a verified fixture. */
export function parseInventory(sources: Record<string, string>) {
  const cases: InventoryCase[] = [];
  const journeys: InventoryJourney[] = [];
  const ids = new Set<string>();
  function reserve(id: string) {
    if (ids.has(id)) throw new Error(`Duplicate scenario identifier: ${id}`);
    ids.add(id);
  }
  for (const [source, text] of Object.entries(sources).sort(([a], [b]) =>
    a.localeCompare(b, "en"),
  )) {
    for (const match of text.matchAll(
      /^\| `([^`|]+)\/(\d+)` \| (.+) \|\s*$/gm,
    )) {
      const [, action, number, specification] = match;
      if (!action || !number || !specification)
        throw new Error("Incomplete scenario row");
      const id = `${action}/${number}`;
      reserve(id);
      cases.push({ id, action, source, specification });
    }
    if (source === "parcours.md") {
      for (const match of text.matchAll(
        /^## (P\d+) — ([\s\S]*?)(?=^## P\d+ — |$(?![\s\S]))/gm,
      )) {
        const [, id, specification] = match;
        if (!id || !specification) throw new Error("Incomplete journey");
        reserve(id);
        journeys.push({ id, source, specification: specification.trim() });
      }
    }
  }
  if (cases.length === 0 || journeys.length === 0)
    throw new Error("Empty scenario inventory or journeys");
  return { cases, journeys };
}
