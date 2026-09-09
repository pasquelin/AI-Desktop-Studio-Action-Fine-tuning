import { type ChildProcess, spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import {
  mkdir,
  readdir,
  readFile,
  rm,
  statfs,
  writeFile,
} from "node:fs/promises";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { cycle } from "../src/vm/lifecycle.ts";
import {
  isManagedName,
  VM_PREFIX,
  type VmRecord,
  validateOwnership,
} from "../src/vm/ownership.ts";
import { cancelActiveCommands, command, quote } from "../src/vm/process.ts";

const root = resolve(import.meta.dirname, "..");
const state = join(root, "artifacts", "vm");
const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    source: { type: "string" },
    base: { type: "string" },
    name: { type: "string" },
  },
});
const mode = positionals[0];
async function owned(name: string) {
  // Guard before joining the name into a path; validateOwnership only sees parsed data.
  if (!isManagedName(name)) throw new Error("Refusing an unmanaged VM name");
  const record = JSON.parse(
    await readFile(join(state, name, "record.json"), "utf8"),
  );
  return validateOwnership(record, name, root, state);
}
async function main() {
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
    console.log(
      await command("tart", ["list", "--source", "local", "--quiet"]),
    );
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
      await command("tart", ["stop", name]);
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
    if (
      reference &&
      (reference.status !== "ready" || reference.mode !== "prepare")
    )
      throw new Error("Base is not a prepared reference");
    const source = reference?.name ?? values.source ?? "";
    const locals = (
      await command("tart", ["list", "--source", "local", "--quiet"])
    ).split("\n");
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
      `UserKnownHostsFile=${join(dir, "known_hosts")}`,
    ];
    const ssh = (script: string, password = false) =>
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
        { interactive: password, timeout: 3_600_000 },
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
      await ssh("mkdir -p ~/studio-vm/source");
      // Transfer over the isolated connection; no host folder mounts or credentials in the guest.
      await command(
        "scp",
        [
          ...transport,
          "-o",
          "BatchMode=yes",
          "-o",
          "StrictHostKeyChecking=yes",
          "-i",
          key,
          archive,
          `admin@${ip}:studio-vm/source.tar`,
        ],
        { timeout: 600_000 },
      );
      await ssh(
        "tar -xf ~/studio-vm/source.tar -C ~/studio-vm/source && rm ~/studio-vm/source.tar",
      );
      await rm(archive);
      await rm(checkout, { recursive: true });
      console.log(
        await ssh(await readFile(join(root, "tools/vm/build.sh"), "utf8")),
      );
      await writeFile(
        join(dir, "build.json"),
        await ssh("cat ~/studio-vm/results/build.json"),
      );
    };
    try {
      await cycle(
        {
          clone: async () => {
            await command("tart", ["clone", source, name], {
              timeout: 600_000,
            });
          },
          start: async () => {
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
              await new Promise((resolve) => setTimeout(resolve, 2000));
            }
            throw new Error("VM did not obtain an IP address");
          },
          execute: async () => {
            if (interrupted) throw new Error("Interrupted");
            await (mode === "prepare" ? provision() : buildRelease());
            if (interrupted) throw new Error("Interrupted");
          },
          stop: async () => {
            await command("tart", ["stop", name]);
            vm?.kill("SIGTERM");
          },
          remove: async () => {
            await owned(name);
            await command("tart", ["delete", name]);
          },
        },
        mode === "prepare",
      );
      record.status = mode === "prepare" ? "ready" : "build-passed";
    } catch (error) {
      record.status = "failed-retained";
      throw error;
    } finally {
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
