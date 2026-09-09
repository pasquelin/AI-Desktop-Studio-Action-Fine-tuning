import { type ChildProcess, spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import { createWriteStream } from "node:fs";
import {
  mkdir,
  readdir,
  readFile,
  rm,
  statfs,
  writeFile,
} from "node:fs/promises";
import { join, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { parseArgs } from "node:util";
import { cycle } from "../src/vm/lifecycle.ts";
import {
  isManagedName,
  isPreparedReference,
  readRecord,
  stateDir,
  VM_PREFIX,
  type VmRecord,
} from "../src/vm/ownership.ts";
import {
  cancelActiveCommands,
  command,
  quote,
  sshConfigValue,
} from "../src/vm/process.ts";
import { beginSnapshots, SNAPSHOT, saveSnapshot } from "../src/vm/snapshots.ts";
import { listLocalVmNames } from "../src/vm/tart.ts";

const root = resolve(import.meta.dirname, "..");
const state = stateDir(root);
const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    source: { type: "string" },
    base: { type: "string" },
    name: { type: "string" },
    scenario: { type: "boolean", default: false },
  },
});
const mode = positionals[0];
const owned = (name: string) => readRecord(name, root, state);
/** Guest executables, kept with the report; no `guest` means delivery over ssh stdin. */
const guestScripts = [
  { source: "tools/vm/build.sh", local: "build.sh" },
  {
    source: "src/vm/scenario-consent.ts",
    local: "scenario-consent.ts",
    guest: "source/scenario-consent.ts",
    scenarioOnly: true,
  },
  {
    source: "tools/vm/scenarios/project.mjs",
    local: "project.mjs",
    guest: "source/.ft-project.mjs",
    scenarioOnly: true,
  },
];
async function main() {
  // Freeze guest executables before the asynchronous VM preparation starts.
  const frozen = new Map<string, string>();
  if (mode === "build")
    for (const script of guestScripts)
      if (values.scenario || !script.scenarioOnly)
        frozen.set(
          script.local,
          await readFile(join(root, script.source), "utf8"),
        );
  const buildScript = frozen.get("build.sh") ?? "";
  if (!["prepare", "build", "cleanup", "check"].includes(mode ?? ""))
    throw new Error(
      "Usage: vm check | prepare --source LOCAL_VM | build --base PREPARED_VM | cleanup --name OWNED_VM",
    );
  if (process.platform !== "darwin" || process.arch !== "arm64")
    throw new Error("Tart requires an Apple Silicon Mac");
  await mkdir(state, { recursive: true, mode: 0o700 });
  if (mode === "prepare" && !process.stdin.isTTY)
    throw new Error(
      "Run prepare in an interactive terminal for the first VM password prompt.",
    );
  if (mode === "check") {
    console.log(await command("tart", ["--version"]));
    console.log((await listLocalVmNames()).join("\n"));
    return;
  }
  const lock = join(state, "active.lock");
  await mkdir(lock); // Exclusive; a stale lock requires deliberate recovery.
  let interrupted = false;
  const interrupt = () => {
    interrupted = true;
    cancelActiveCommands();
  };
  process.on("SIGINT", interrupt);
  process.on("SIGTERM", interrupt);
  try {
    if (mode === "cleanup") {
      const name = values.name ?? "";
      const previous = await owned(name);
      // A copy left stopped is a normal cleanup input; delete reports a missing VM.
      await command("tart", ["stop", name]).catch(() => {});
      await command("tart", ["delete", name]);
      await writeFile(
        join(state, name, "record.json"),
        JSON.stringify(
          { ...previous, status: "removed" } satisfies VmRecord,
          null,
          2,
        ),
      );
      console.log(`Removed owned VM ${name}; reports retained.`);
      return;
    }
    for (const entry of await readdir(state)) {
      if (!isManagedName(entry)) continue;
      const previous = await owned(entry);
      if (previous.status === "failed-retained")
        throw new Error(
          `Clean up retained failed VM ${entry} before another run.`,
        );
    }
    const reference =
      mode === "build" ? await owned(values.base ?? "") : undefined;
    if (reference && !isPreparedReference(reference))
      throw new Error("Base is not a prepared reference");
    const source = reference?.name ?? values.source ?? "";
    const locals = await listLocalVmNames();
    if (!source || !locals.includes(source))
      throw new Error(
        "Source VM must already exist locally; no implicit image download",
      );
    const disk = await statfs(state);
    if (disk.bavail * disk.bsize < 30 * 1024 ** 3)
      throw new Error(
        "At least 30 GiB free required for preparation (disk usage is workload-dependent)",
      );
    const name = VM_PREFIX + randomUUID();
    const dir = join(state, name);
    await mkdir(dir, { mode: 0o700 });
    const key = reference?.key ?? join(dir, "id_ed25519");
    const record: VmRecord & {
      source: string;
      revision: string;
      createdAt: string;
    } = {
      owner: root,
      name,
      source,
      mode: reference ? "build" : "prepare",
      key,
      status: "created",
      revision: "",
      createdAt: new Date().toISOString(),
    };
    const save = () =>
      writeFile(join(dir, "record.json"), JSON.stringify(record, null, 2), {
        mode: 0o600,
      });
    await save();
    await beginSnapshots(root, name);
    const activity = createWriteStream(join(dir, "activity.log"), {
      flags: "a",
      mode: 0o600,
    });
    const journal = (message: string) => {
      activity.write(
        `[${new Date().toLocaleTimeString("fr-FR")}] ${message}\n`,
      );
    };
    let imageQueue = Promise.resolve();
    let outputLine = "";
    const output = (chunk: Buffer) => {
      activity.write(chunk);
      outputLine += chunk.toString("utf8");
      const lines = outputLine.split("\n");
      outputLine = (lines.pop() ?? "").slice(-65536);
      for (const line of lines) {
        if (!line.startsWith("[Capture] ")) continue;
        try {
          const event = JSON.parse(line.slice(10));
          if (
            typeof event.file !== "string" ||
            !SNAPSHOT.test(event.file) ||
            typeof event.activity !== "string" ||
            event.activity.length > 300
          )
            continue;
          imageQueue = imageQueue
            .then(async () => {
              const local = join(dir, "action-image.jpg");
              try {
                await transfer(
                  `admin@${ip}:studio-vm/action-images/${event.file}`,
                  local,
                );
                await saveSnapshot(
                  root,
                  name,
                  await readFile(local),
                  event.activity,
                  Number(event.file.slice(0, 13)),
                );
              } finally {
                await rm(local, { force: true });
              }
            })
            .catch(() =>
              journal("Une capture d’action n’a pas pu être rapatriée."),
            );
        } catch {
          /* Unstructured application output is only a log, never an instruction. */
        }
      }
    };
    journal("Exécution créée. Aucun modèle en apprentissage.");
    let vm: ChildProcess | undefined;
    let ip = "";
    // Shared hardening; only the host-key policy and authentication differ per transport.
    const transport = [
      "-F",
      "/dev/null",
      "-o",
      "ForwardAgent=no",
      "-o",
      "ClearAllForwardings=yes",
      "-o",
      "IdentitiesOnly=yes",
      "-o",
      `UserKnownHostsFile=${sshConfigValue(join(dir, "known_hosts"))}`,
    ];
    const ssh = (
      script: string,
      password = false,
      timeout = 3_600_000,
      live = false,
    ) =>
      command(
        "ssh",
        [
          ...transport,
          "-o",
          "StrictHostKeyChecking=accept-new",
          "-o",
          "ConnectTimeout=10",
          ...(password
            ? ["-o", "PubkeyAuthentication=no"]
            : ["-o", "BatchMode=yes", "-i", key]),
          `admin@${ip}`,
          `/bin/bash -lc ${quote(script)}`,
        ],
        {
          interactive: password,
          timeout,
          ...(live ? { onOutput: output } : {}),
        },
      );
    // Transfer over the isolated connection; no host folder mounts or credentials in the guest.
    const transfer = (from: string, to: string, recursive = false) =>
      command(
        "scp",
        [
          ...transport,
          "-o",
          "BatchMode=yes",
          "-o",
          "StrictHostKeyChecking=yes",
          "-i",
          key,
          ...(recursive ? ["-r"] : []),
          from,
          to,
        ],
        { timeout: 600_000 },
      );
    const provision = async () => {
      await command("ssh-keygen", [
        "-t",
        "ed25519",
        "-N",
        "",
        "-f",
        key,
        "-C",
        "studio-vm-only",
      ]);
      const pub = (await readFile(`${key}.pub`, "utf8")).trim();
      console.log(
        "One-time VM SSH password required. No personal SSH keys will be transferred.",
      );
      await ssh(
        `mkdir -p ~/.ssh && chmod 700 ~/.ssh && printf '%s\n' ${quote(pub)} >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys`,
        true,
      );
      console.log(
        await ssh(await readFile(join(root, "tools/vm/provision.sh"), "utf8")),
      );
    };
    const buildRelease = async () => {
      journal("Récupération de Studio et préparation du catalogue.");
      // Read the remote into an isolated clone; do not touch the user's checkout.
      const checkout = join(dir, "source");
      await command(
        "git",
        [
          "clone",
          "--depth",
          "1",
          "--no-tags",
          "--single-branch",
          "--branch",
          "develop",
          "git@github.com:pasquelin/AIDesktopStudio.git",
          checkout,
        ],
        { timeout: 600_000 },
      );
      // Imported here so check, prepare and cleanup never load the bundler.
      const { buildCatalogue } = await import("../src/catalogue/build.ts");
      const catalogue = await buildCatalogue(checkout);
      record.revision = catalogue.appRevision;
      await save();
      await writeFile(
        join(dir, "catalogue.json"),
        JSON.stringify(catalogue, null, 2),
      );
      const tree = await command("git", [
        "-C",
        checkout,
        "ls-tree",
        "-r",
        "HEAD",
      ]);
      const attributes = await command("git", [
        "-C",
        checkout,
        "grep",
        "-l",
        "filter=lfs",
        "--",
        ":(glob)**/.gitattributes",
        ".gitattributes",
      ]).catch(() => "");
      if (/^160000 /m.test(tree) || attributes)
        throw new Error(
          "Source now requires submodule/LFS support; refusing an incomplete archive.",
        );
      const archive = join(dir, "source.tar");
      await command("git", [
        "-C",
        checkout,
        "archive",
        "--format=tar",
        `--output=${archive}`,
        record.revision,
      ]);
      journal("Transfert de la révision figée vers la VM.");
      await ssh("mkdir -p ~/studio-vm/source");
      await transfer(archive, `admin@${ip}:studio-vm/source.tar`);
      await ssh(
        "tar -xf ~/studio-vm/source.tar -C ~/studio-vm/source && rm ~/studio-vm/source.tar",
      );
      await rm(archive);
      await rm(checkout, { recursive: true });
      for (const script of guestScripts) {
        const content = frozen.get(script.local);
        if (content === undefined) continue;
        await writeFile(join(dir, script.local), content);
        if (script.guest)
          await transfer(
            join(dir, script.local),
            `admin@${ip}:studio-vm/${script.guest}`,
          );
      }
      try {
        console.log(
          await ssh(
            `${values.scenario ? "export STUDIO_FT_SCENARIO=1\n" : ""}${buildScript}`,
            false,
            3_600_000,
            true,
          ),
        );
      } finally {
        await imageQueue;
        // Reports and logs are what a failed build leaves behind; fetch them either way.
        await transfer(`admin@${ip}:studio-vm/results`, dir, true).catch(
          () => {},
        );
      }
    };
    try {
      await cycle(
        {
          clone: async () => {
            journal("Création de la copie jetable.");
            await command("tart", ["clone", source, name], {
              timeout: 600_000,
            });
          },
          start: async () => {
            journal("Démarrage de la VM : 4 cœurs, 16 Gio de mémoire invitée.");
            await command("tart", [
              "set",
              name,
              "--cpu",
              "4",
              "--memory",
              "16384",
            ]);
            vm = spawn(
              "tart",
              ["run", name, "--no-graphics", "--no-audio", "--no-clipboard"],
              { stdio: "ignore" },
            );
            let bootError: Error | undefined;
            vm.on("error", (error) => {
              bootError = error;
            });
            for (let i = 0; i < 90; i++) {
              if (interrupted || bootError || vm.exitCode !== null)
                throw new Error("VM launch interrupted or failed");
              try {
                ip = await command("tart", ["ip", name], { timeout: 3000 });
              } catch {
                ip = "";
              }
              if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip)) return;
              await delay(2000);
            }
            throw new Error("VM did not obtain an IP address");
          },
          execute: async () => {
            if (interrupted) throw new Error("Interrupted");
            await (mode === "prepare" ? provision() : buildRelease());
            if (interrupted) throw new Error("Interrupted");
          },
          stop: async () => {
            journal("Arrêt de la VM.");
            if (ip) {
              // SSH disconnects when macOS shuts down; allow the guest to flush its disk first.
              await ssh("sync; sudo shutdown -h now", false, 30_000).catch(
                () => {},
              );
              if (vm?.exitCode === null)
                await Promise.race([once(vm, "exit"), delay(30_000)]);
            }
            if (vm?.exitCode === null) await command("tart", ["stop", name]);
          },
          remove: async () => {
            journal(
              "Suppression de la copie jetable ; conservation des rapports.",
            );
            await owned(name);
            await command("tart", ["delete", name]);
          },
        },
        mode === "prepare",
      );
      record.status = mode === "prepare" ? "ready" : "build-passed";
      journal("Exécution terminée avec succès.");
    } catch (error) {
      record.status = "failed-retained";
      journal("Échec : copie conservée pour diagnostic.");
      throw error;
    } finally {
      activity.end();
      await save();
      console.log(`VM report: ${join(dir, "record.json")}`);
    }
  } finally {
    process.off("SIGINT", interrupt);
    process.off("SIGTERM", interrupt);
    await rm(lock, { recursive: true });
  }
}
main().catch((error) => {
  console.error(error instanceof Error ? error.message : "VM operation failed");
  process.exitCode = 1;
});
