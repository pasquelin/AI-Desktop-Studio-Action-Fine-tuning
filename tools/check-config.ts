import { readFileSync } from "node:fs";
import { validatePilot } from "../src/config/validate-pilot.ts";
import { runCheck } from "./run-check.ts";

runCheck(
  () => {
    const path =
      process.argv[2] ?? new URL("../configs/pilot.json", import.meta.url);
    return validatePilot(JSON.parse(readFileSync(path, "utf8")));
  },
  "Pilot configuration valid. No model loaded or downloaded.",
  "Configuration check failed.",
);
