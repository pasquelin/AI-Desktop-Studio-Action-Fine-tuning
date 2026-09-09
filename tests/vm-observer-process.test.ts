import { EventEmitter } from "node:events";
import { afterEach, expect, it, vi } from "vitest";

const { fork } = vi.hoisted(() => ({ fork: vi.fn() }));
vi.mock("node:child_process", () => ({ fork }));

import { ensureObserver, OBSERVER_URL } from "../src/vm/observer-process.ts";

afterEach(() => {
  vi.restoreAllMocks();
  fork.mockReset();
});
it("reuses the same verified local observer without spawning", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(
      JSON.stringify({ service: "studio-vm-observer", root: "/project" }),
    ),
  );
  expect(await ensureObserver("/project")).toBe(OBSERVER_URL);
  expect(fork).not.toHaveBeenCalled();
});
it("starts the observer when absent and returns only the fixed address", async () => {
  vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
  const child = Object.assign(new EventEmitter(), {
    kill: vi.fn(),
    disconnect: vi.fn(),
    unref: vi.fn(),
  });
  fork.mockImplementation(() => {
    queueMicrotask(() => child.emit("message", OBSERVER_URL));
    return child;
  });
  expect(await ensureObserver("/project")).toBe(OBSERVER_URL);
  expect(fork).toHaveBeenCalledTimes(1);
  expect(child.disconnect).toHaveBeenCalled();
});
