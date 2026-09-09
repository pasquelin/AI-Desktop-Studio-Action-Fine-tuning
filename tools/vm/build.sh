#!/bin/bash
set -euo pipefail
[[ "$(uname -s)" == Darwin && "$(sysctl -n hw.model)" == VirtualMac* ]] || { echo 'Refusing non-VM host'; exit 1; }
[[ "$(cat "$HOME/studio-vm/prepared")" == studio-vm-v1 ]] || exit 1
export CI=1
export GIT_AUTHOR_NAME="Studio Test" GIT_AUTHOR_EMAIL="studio-test@example.invalid"
export GIT_COMMITTER_NAME="$GIT_AUTHOR_NAME" GIT_COMMITTER_EMAIL="$GIT_AUTHOR_EMAIL"
export PATH="/opt/homebrew/opt/node@24/bin:/opt/homebrew/bin:$PATH"
results="$HOME/studio-vm/results"
mkdir -p "$results"
exec > >(tee "$results/build.log") 2>&1
cd "$HOME/studio-vm/source"
manager=$(node -p 'JSON.parse(require("node:fs").readFileSync("package.json","utf8")).packageManager')
[[ "$manager" =~ ^pnpm@[0-9]+\.[0-9]+\.[0-9]+(\+sha[0-9]+\.[a-f0-9]+)?$ ]] || { echo 'Unsupported package manager'; exit 1; }
# pnpm honors the project's declared packageManager; lockfile changes are refused.
command -v node-gyp >/dev/null || npm install --global --prefix /opt/homebrew node-gyp@13.0.2
echo "[Étape] Installation des dépendances dans la VM"
# Keep each test installation independent of the reference image package cache.
pnpm install --frozen-lockfile --store-dir "$HOME/studio-vm/dependency-store" --package-import-method=copy
node scripts/fetch-engine.mjs --sources-only
echo "[Étape] Construction et vérification de Studio"
pnpm build
node -e 'const fs=require("node:fs"); const crypto=require("node:crypto"); fs.writeFileSync(process.env.HOME+"/studio-vm/results/build.json",JSON.stringify({status:"build-passed",scenariosExecuted:false,node:process.version,lockfileHash:crypto.createHash("sha256").update(fs.readFileSync("pnpm-lock.yaml")).digest("hex")},null,2))'

# Apply the guest display mode persistently; Tart configuration alone keeps the old guest mode.
xcrun swift - <<'DISPLAY'
import CoreGraphics
let display = CGMainDisplayID()
let modes = CGDisplayCopyAllDisplayModes(display, nil) as! [CGDisplayMode]
guard let mode = modes.first(where: { $0.width == 1920 && $0.height == 1080 }) else { fatalError("1080 display mode unavailable") }
var config: CGDisplayConfigRef?
precondition(CGBeginDisplayConfiguration(&config) == .success)
precondition(CGConfigureDisplayWithDisplayMode(config, display, mode, nil) == .success)
precondition(CGCompleteDisplayConfiguration(config, .permanently) == .success)
DISPLAY

# Smoke check: launch only inside the disposable VM, inspect the renderer, then exit.
# Prepare the isolated test profile before Studio reads it. MCP stays guest-local.
mkdir -p "$HOME/studio-vm/profile"
node --input-type=module <<'PROFILE'
import {existsSync,readFileSync,writeFileSync} from 'node:fs';
const path=process.env.HOME+'/studio-vm/profile/settings.json';
const stored=existsSync(path)?JSON.parse(readFileSync(path,'utf8')):{};
stored.settings={...stored.settings,onboarding:stored.settings?.onboarding??{version:0},mcp:{...stored.settings?.mcp,enabled:true}};
writeFileSync(path,JSON.stringify(stored));
PROFILE
# CI deliberately skips Studio's macOS identity postinstall; apply its own script after download.
node -e 'require("electron")'
env -u CI node scripts/dev-app-identity.mjs
echo "[Étape] Ouverture de Studio et contrôle de son interface"
node node_modules/electron/cli.js . --user-data-dir="$HOME/studio-vm/profile" --remote-debugging-port=9333 > "$results/startup.log" 2>&1 &
app_pid=$!
tail -n +1 -F "$results/startup.log" &
log_pid=$!
trap 'kill "$app_pid" "$log_pid" 2>/dev/null || true' EXIT
node .ft-startup.mjs

if [[ "${STUDIO_FT_SCENARIO:-0}" == 1 ]]; then
  echo "[Étape] Exécution du parcours projet, scène et cube"
  node .ft-project.mjs
fi
