import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { join, resolve } from "node:path";
import { latestRun, logChunk } from "../src/vm/logs.ts";
import { stateDir } from "../src/vm/ownership.ts";
import { listSnapshots, readSnapshot } from "../src/vm/snapshots.ts";

const root = resolve(import.meta.dirname, "..");
const port = 4318;
const url = `http://127.0.0.1:${port}/`;

const server = createServer(async (request, response) => {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' blob:; script-src 'unsafe-inline'; style-src 'unsafe-inline'; frame-ancestors 'none'",
  );
  if (
    request.headers.host !== `127.0.0.1:${port}` ||
    (request.headers.origin && request.headers.origin !== url.slice(0, -1)) ||
    request.headers["sec-fetch-site"] === "cross-site"
  ) {
    response.writeHead(403).end("Local observer only.");
    return;
  }
  if (request.url === "/health") {
    response
      .writeHead(200, { "Content-Type": "application/json" })
      .end(JSON.stringify({ service: "studio-vm-observer", root }));
    return;
  }
  if (request.method !== "GET") {
    response.writeHead(405).end();
    return;
  }
  if (request.url === "/") {
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.end(await readFile(join(root, "src/vm/observer.html")));
    return;
  }
  const requested = new URL(request.url ?? "/", "http://localhost");
  if (
    requested.pathname === "/snapshots" ||
    requested.pathname === "/snapshot"
  ) {
    try {
      if (requested.pathname.endsWith("/snapshots")) {
        response
          .writeHead(200, { "Content-Type": "application/json" })
          .end(JSON.stringify(await listSnapshots(root)));
      } else {
        const bytes = await readSnapshot(
          root,
          requested.searchParams.get("run") ?? "",
          requested.searchParams.get("file") ?? "",
        );
        response.writeHead(200, { "Content-Type": "image/jpeg" }).end(bytes);
      }
    } catch {
      response.writeHead(404).end("Capture indisponible.");
    }
    return;
  }
  if (requested.pathname === "/logs") {
    try {
      const run = await latestRun(root);
      const offset =
        requested.searchParams.get("run") === run?.name
          ? Number(requested.searchParams.get("offset") ?? 0)
          : 0;
      const chunk = run ? await logChunk(root, run.name, offset) : undefined;
      response
        .writeHead(200, { "Content-Type": "application/json" })
        .end(JSON.stringify({ run: run?.name, status: run?.status, ...chunk }));
    } catch {
      response
        .writeHead(503, { "Content-Type": "text/plain; charset=utf-8" })
        .end("Journaux temporairement indisponibles.");
    }
    return;
  }
  response.writeHead(404).end();
});
server.on("error", (error) => {
  console.error("Observer cannot start on its fixed port:", error.message);
  process.exitCode = 1;
  process.disconnect?.();
});
server.listen({ port, host: "127.0.0.1", exclusive: true }, async () => {
  const address = server.address();
  if (!address || typeof address === "string") return;
  await mkdir(stateDir(root), { recursive: true, mode: 0o700 });
  await writeFile(
    join(stateDir(root), "observer.json"),
    JSON.stringify({ url, pid: process.pid }),
    { mode: 0o600 },
  );
  console.log(`Observation en lecture seule : ${url}`);
  process.send?.(url);
});
