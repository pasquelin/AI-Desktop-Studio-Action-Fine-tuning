import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cycle, type Operations } from "../src/vm/lifecycle.ts";
import { validateOwnership } from "../src/vm/ownership.ts";
import { command, quote } from "../src/vm/process.ts";

function fixture(fail?: string) {
  const events: string[] = [];
  const action = (name: string) => async () => {
    events.push(name);
    if (name === fail) throw new Error(name);
  };
  const operations: Operations = {
    clone: action("clone"),
    start: action("start"),
    execute: action("execute"),
    stop: action("stop"),
    remove: action("remove"),
  };
  return { events, operations };
}
describe("VM lifecycle", () => {
  it("stops before deleting a successful disposable VM", async () => {
    const f = fixture();
    await cycle(f.operations, false);
    expect(f.events).toEqual(["clone", "start", "execute", "stop", "remove"]);
  });
  it("retains the stopped prepared reference", async () => {
    const f = fixture();
    await cycle(f.operations, true);
    expect(f.events).toEqual(["clone", "start", "execute", "stop"]);
  });
  it("stops and preserves a failed build for diagnosis", async () => {
    const f = fixture("execute");
    await expect(cycle(f.operations, false)).rejects.toThrow("execute");
    expect(f.events).toEqual(["clone", "start", "execute", "stop"]);
  });
  it("does not delete when stopping fails", async () => {
    const f = fixture("stop");
    await expect(cycle(f.operations, false)).rejects.toThrow("stop");
    expect(f.events).not.toContain("remove");
  });
  it("does not operate on a VM when cloning fails", async () => {
    const f = fixture("clone");
    await expect(cycle(f.operations, false)).rejects.toThrow("clone");
    expect(f.events).toEqual(["clone"]);
  });
});

describe("VM command transport", () => {
  it.skipIf(process.platform === "win32")(
    "preserves quotes and shell metacharacters literally",
    async () => {
      const value = "Pasquelin's $(echo unwanted) `echo no` ; end";
      expect(
        await command("/bin/sh", ["-c", `printf '%s' ${quote(value)}`]),
      ).toBe(value);
    },
  );
  it("rejects a failed external command", async () => {
    await expect(
      command(process.execPath, ["-e", "process.exit(3)"]),
    ).rejects.toThrow("failed (3)");
  });
  it("terminates a command that exceeds its deadline", async () => {
    await expect(
      command(process.execPath, ["-e", "setInterval(() => {}, 1000)"], {
        timeout: 50,
      }),
    ).rejects.toThrow("terminated");
  });
});

describe("VM ownership", () => {
  it("refuses foreign names, ownership and personal keys", async () => {
    const name = "studio-ft-00000000-0000-4000-8000-000000000000";
    const record = {
      name,
      owner: "/repo",
      mode: "prepare",
      status: "ready",
      key: join("/state", name, "id_ed25519"),
    };
    expect(validateOwnership(record, name, "/repo", "/state")).toEqual(record);
    expect(() =>
      validateOwnership(record, "my-personal-vm", "/repo", "/state"),
    ).toThrow();
    expect(() => validateOwnership(record, name, "/other", "/state")).toThrow();
    expect(() =>
      validateOwnership(
        { ...record, key: "/home/.ssh/id_ed25519" },
        name,
        "/repo",
        "/state",
      ),
    ).toThrow();
  });
});
