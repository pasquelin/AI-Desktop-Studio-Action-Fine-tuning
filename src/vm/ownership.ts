import { join } from "node:path";
export interface VmRecord {
  name: string;
  owner: string;
  status: string;
  mode: string;
  key: string;
}
export const VM_PREFIX = "studio-ft-";
const MANAGED_NAME = new RegExp(`^${VM_PREFIX}[a-f0-9-]{36}$`);

export function isManagedName(value: string): boolean {
  return MANAGED_NAME.test(value);
}

export function validateOwnership(
  value: unknown,
  name: string,
  root: string,
  state: string,
): VmRecord {
  if (!isManagedName(name)) throw new Error("Refusing an unmanaged VM name");
  if (!value || typeof value !== "object") throw new Error("Invalid VM record");
  const record = value as Record<string, unknown>;
  if (
    record.name !== name ||
    record.owner !== root ||
    !["prepare", "build"].includes(String(record.mode)) ||
    typeof record.status !== "string" ||
    typeof record.key !== "string"
  )
    throw new Error("VM ownership mismatch");
  if (
    record.mode === "prepare" &&
    record.key !== join(state, name, "id_ed25519")
  )
    throw new Error("Unexpected VM key path");
  return record as unknown as VmRecord;
}
