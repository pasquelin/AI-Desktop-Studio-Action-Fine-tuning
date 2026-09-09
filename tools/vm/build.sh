#!/bin/bash
set -euo pipefail
[[ "$(uname -s)" == Darwin && "$(sysctl -n hw.model)" == VirtualMac* ]] || { echo 'Refusing non-VM host'; exit 1; }
[[ "$(cat "$HOME/studio-vm/prepared")" == studio-vm-v1 ]] || exit 1
export CI=1
export PATH="/opt/homebrew/opt/node@24/bin:/opt/homebrew/bin:$PATH"
cd "$HOME/studio-vm/source"
manager=$(node -p 'JSON.parse(require("node:fs").readFileSync("package.json","utf8")).packageManager')
[[ "$manager" =~ ^pnpm@[0-9]+\.[0-9]+\.[0-9]+(\+sha[0-9]+\.[a-f0-9]+)?$ ]] || { echo 'Unsupported package manager'; exit 1; }
# pnpm honors the project's declared packageManager; lockfile changes are refused.
pnpm install --frozen-lockfile
node scripts/fetch-engine.mjs --sources-only
pnpm build
mkdir -p "$HOME/studio-vm/results"
node -e 'const fs=require("node:fs"); const crypto=require("node:crypto"); fs.writeFileSync(process.env.HOME+"/studio-vm/results/build.json",JSON.stringify({status:"build-passed",scenariosExecuted:false,node:process.version,lockfileHash:crypto.createHash("sha256").update(fs.readFileSync("pnpm-lock.yaml")).digest("hex")},null,2))'
