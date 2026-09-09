import { command } from "./process.ts";

/** The single listing form used by this repository; Tart prints one name per line. */
export async function listLocalVmNames(): Promise<string[]> {
  const listing = await command("tart", [
    "list",
    "--source",
    "local",
    "--quiet",
  ]);
  return listing.split("\n").filter((name) => name !== "");
}
