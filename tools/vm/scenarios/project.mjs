import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join, relative, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { scenarioConsent } from "./scenario-consent.ts";

// This executable is transferred into the guest, never run against the host Studio.
assert.equal(process.platform, "darwin");
assert.match(
  execFileSync("sysctl", ["-n", "hw.model"], { encoding: "utf8" }),
  /^VirtualMac/,
);
const home = homedir(),
  base = join(home, "studio-vm"),
  source = join(base, "source"),
  results = join(base, "results");
assert.equal(resolve(process.cwd()), source);
const sandbox = join(base, "scenario-projects");
await mkdir(sandbox, { recursive: true });
const name = "Pilot Project",
  renamed = "Pilot Renamed",
  project = join(sandbox, name),
  renamedProject = join(sandbox, renamed);
const reports = [];
let requestId = 1,
  endpoint;
function within(path) {
  const rel = relative(sandbox, resolve(path));
  assert.ok(
    rel && !rel.startsWith("..") && !resolve(path).includes("\0"),
    "Path outside test sandbox",
  );
  return path;
}
/** The guest script stays self-contained; it cannot import the repository helpers. */
async function documentHash(folder) {
  return createHash("sha256")
    .update(await readFile(within(join(folder, documentPath))))
    .digest("hex");
}
async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}
async function connect() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      endpoint = JSON.parse(
        await readFile(join(base, "profile", "mcp.json"), "utf8"),
      );
      if (endpoint.port && endpoint.token) break;
    } catch {}
    await delay(500);
  }
  assert.ok(
    Number.isInteger(endpoint?.port) &&
      endpoint.port > 0 &&
      endpoint.port < 65536 &&
      typeof endpoint.token === "string",
    "MCP endpoint missing in isolated profile",
  );
  const targets = await (await fetch("http://127.0.0.1:9333/json")).json();
  const page = targets.find(
    (item) =>
      item.type === "page" &&
      item.url.startsWith("file:") &&
      !item.url.includes("splash"),
  );
  assert.ok(page?.webSocketDebuggerUrl, "Studio renderer missing");
}
async function rpc(method, params) {
  const response = await fetch(`http://127.0.0.1:${endpoint.port}/mcp`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${endpoint.token}`,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      "MCP-Protocol-Version": "2025-03-26",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: requestId++, method, params }),
    signal: AbortSignal.timeout(45000),
  });
  assert.ok(response.ok, `MCP HTTP ${response.status}`);
  const body = await response.json();
  assert.ok(!body.error, JSON.stringify(body.error));
  return body.result;
}
async function actionCapture(action, outcome) {
  const directory = join(base, "action-images");
  await mkdir(directory, { recursive: true });
  const file = `${Date.now()}-${randomUUID()}.jpg`;
  execFileSync(
    "/usr/sbin/screencapture",
    ["-x", "-t", "jpg", join(directory, file)],
    { timeout: 10000 },
  );
  console.log(
    `[Capture] ${JSON.stringify({ file, activity: `${action} · ${outcome}` })}`,
  );
}
const capture = (action, outcome) =>
  actionCapture(action, outcome).catch((error) =>
    console.error("Capture unavailable", String(error)),
  );
async function call(action, input = {}) {
  if (input.path?.startsWith("/")) within(input.path);
  if (input.folder?.startsWith("/")) assert.equal(input.folder, sandbox);
  const argumentsCopy = structuredClone(input);
  try {
    let result = await rpc("tools/call", {
      name: action.replace(".", "_"),
      arguments: argumentsCopy,
    });
    const consent = scenarioConsent(action, result);
    if (consent) {
      console.log(`[Étape] Confirmation du scénario jetable : ${action}`);
      result = await rpc("tools/call", {
        name: action.replace(".", "_"),
        arguments: { ...argumentsCopy, consent },
      });
    }
    assert.ok(!result.isError, `${action}: ${JSON.stringify(result.content)}`);
    const data = JSON.parse(
      result.content.find((item) => item.type === "text").text,
    );
    await capture(action, "terminée");
    return data;
  } catch (error) {
    await capture(action, "échec");
    throw error;
  }
}
async function step(label, body) {
  console.log(`[Étape] ${label}`);
  const startedAt = new Date().toISOString();
  try {
    await body();
    reports.push({ label, startedAt, status: "passed" });
  } catch (error) {
    reports.push({ label, startedAt, status: "failed", error: String(error) });
    throw error;
  } finally {
    await writeFile(
      join(results, "scenario.json"),
      JSON.stringify(
        { kind: "reference-actions", modelUsed: false, steps: reports },
        null,
        2,
      ),
    );
  }
}
function cube(state) {
  assert.ok(Array.isArray(state.nodes), "Scene nodes missing");
  const found = state.nodes.filter((node) => node.name === "Pilot Cube");
  assert.equal(found.length, 1, "Exactly one pilot cube expected");
  return found[0];
}
let documentId, documentPath, savedHash;
assert.equal(await exists(project), false, "Refusing an existing test project");
assert.equal(
  await exists(renamedProject),
  false,
  "Refusing an existing rename target",
);
await step("Connecter Studio dans le profil isolé", connect);
await step("Créer le projet jetable", async () => {
  await call("project.create", { name, folder: sandbox });
  assert.ok(await exists(project), "Project not created on disk");
});
await step("Créer une scène", async () => {
  const created = await call("workspace.open", {
    workspace: "3d",
    createDocument: true,
    title: "Pilot Scene",
  });
  assert.equal(typeof created.documentId, "string");
  documentId = created.documentId;
  const docs = await call("documents.list");
  const document = docs.find((item) => item.id === documentId);
  assert.ok(document?.path, "Scene path missing");
  documentPath = document.path;
  within(join(project, documentPath));
});
await step("Ajouter, renommer et déplacer un cube", async () => {
  await call("node.add", { kind: "box", name: "Initial Cube" });
  const state = await call("scene.state");
  const nodes = state.nodes.filter((node) => node.name === "Initial Cube");
  assert.equal(nodes.length, 1);
  await call("node.rename", { nodeId: nodes[0].id, name: "Pilot Cube" });
  await call("node.transform", {
    nodeId: nodes[0].id,
    positionX: 2,
    positionY: 1,
    positionZ: -3,
  });
  const node = cube(await call("scene.state"));
  assert.deepEqual(node.transform?.position, { x: 2, y: 1, z: -3 });
});
await step("Sauvegarder et contrôler le fichier", async () => {
  await call("document.save", { documentId });
  assert.ok((await readFile(within(join(project, documentPath)))).length > 0);
  savedHash = await documentHash(project);
});
await step("Fermer, rouvrir et vérifier la scène", async () => {
  await call("project.close");
  await call("project.open", { path: project });
  await call("document.open", { path: documentPath });
  assert.deepEqual(cube(await call("scene.state")).transform?.position, {
    x: 2,
    y: 1,
    z: -3,
  });
  assert.equal(await documentHash(project), savedHash);
});
await step("Renommer le projet sans perdre la scène", async () => {
  await call("project.rename", { path: project, name: renamed });
  assert.equal(await exists(project), false);
  assert.ok(await exists(renamedProject));
  assert.equal(await documentHash(renamedProject), savedHash);
});
await step("Retirer le projet des récents et le remettre", async () => {
  await call("project.close");
  await call("project.forget", { path: renamedProject });
  assert.ok(await exists(renamedProject));
  assert.ok(
    !JSON.stringify(await call("projects.list")).includes(renamedProject),
  );
  await call("project.open", { path: renamedProject });
  assert.ok(
    JSON.stringify(await call("projects.list")).includes(renamedProject),
  );
});
await step("Mettre le projet jetable à la corbeille", async () => {
  await call("project.trash", { path: renamedProject });
  assert.equal(await exists(renamedProject), false);
  assert.ok(
    !JSON.stringify(await call("projects.list")).includes(renamedProject),
  );
});
console.log(
  "[Étape] Parcours de référence terminé. Aucun apprentissage exécuté.",
);
