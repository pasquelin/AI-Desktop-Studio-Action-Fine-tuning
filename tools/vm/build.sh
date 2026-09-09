#!/bin/bash
set -euo pipefail
[[ "$(uname -s)" == Darwin && "$(sysctl -n hw.model)" == VirtualMac* ]] || { echo 'Refusing non-VM host'; exit 1; }
[[ "$(cat "$HOME/studio-vm/prepared")" == studio-vm-v1 ]] || exit 1
export CI=1
export PATH="/opt/homebrew/opt/node@24/bin:/opt/homebrew/bin:$PATH"
results="$HOME/studio-vm/results"
mkdir -p "$results"
exec > >(tee "$results/build.log") 2>&1
cd "$HOME/studio-vm/source"
manager=$(node -p 'JSON.parse(require("node:fs").readFileSync("package.json","utf8")).packageManager')
[[ "$manager" =~ ^pnpm@[0-9]+\.[0-9]+\.[0-9]+(\+sha[0-9]+\.[a-f0-9]+)?$ ]] || { echo 'Unsupported package manager'; exit 1; }
# pnpm honors the project's declared packageManager; lockfile changes are refused.
command -v node-gyp >/dev/null || npm install --global --prefix /opt/homebrew node-gyp@13.0.2
pnpm install --frozen-lockfile
node scripts/fetch-engine.mjs --sources-only
pnpm build
node -e 'const fs=require("node:fs"); const crypto=require("node:crypto"); fs.writeFileSync(process.env.HOME+"/studio-vm/results/build.json",JSON.stringify({status:"build-passed",scenariosExecuted:false,node:process.version,lockfileHash:crypto.createHash("sha256").update(fs.readFileSync("pnpm-lock.yaml")).digest("hex")},null,2))'

# Smoke check: launch only inside the disposable VM, inspect the renderer, then exit.
node node_modules/electron/cli.js . --remote-debugging-port=9333 > "$results/startup.log" 2>&1 &
app_pid=$!
trap 'kill "$app_pid" 2>/dev/null || true' EXIT
node --input-type=module <<'JS'
import { writeFileSync } from 'node:fs';
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const mounted = value => value?.ready === 'complete' && value.children > 0;
let result;
for (let attempt = 0; attempt < 60; attempt++) {
  try {
    const response = await fetch('http://127.0.0.1:9333/json', {signal: AbortSignal.timeout(2000)});
    const targets = await response.json();
    const page = targets.find(page => page.type === 'page' && page.url.startsWith('file:') && page.webSocketDebuggerUrl);
    if (page) {
      result = await new Promise((resolve, reject) => {
        const ws = new WebSocket(page.webSocketDebuggerUrl);
        const timer = setTimeout(() => { ws.close(); reject(new Error('Renderer timeout')); }, 3000);
        ws.addEventListener('error', () => { clearTimeout(timer); reject(new Error('Renderer connection failed')); });
        ws.addEventListener('open', () => ws.send(JSON.stringify({id: 1, method: 'Runtime.evaluate', params: {expression: '({ready:document.readyState,children:document.getElementById("root")?.childElementCount ?? 0,title:document.title})', returnByValue: true}})));
        ws.addEventListener('message', event => {
          const answer = JSON.parse(String(event.data));
          if (answer.id !== 1) return;
          clearTimeout(timer); ws.close(); resolve(answer.result?.result?.value);
        });
      });
      if (mounted(result)) break;
    }
  } catch { /* Retry while the guest application is starting. */ }
  await wait(1000);
}
if (!mounted(result)) throw new Error('Studio did not mount its interface in the guest. Inspect startup.log in the retained VM report.');
writeFileSync(process.env.HOME+'/studio-vm/results/startup.json', JSON.stringify({status:'renderer-mounted', ...result, scenariosExecuted:false},null,2));
console.log('Studio renderer mounted inside the VM; business scenarios not executed.');
JS
