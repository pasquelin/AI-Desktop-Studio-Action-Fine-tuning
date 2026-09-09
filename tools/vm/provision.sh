#!/bin/bash
set -euo pipefail
[[ "$(uname -s)" == Darwin && "$(sysctl -n hw.model)" == VirtualMac* ]] || { echo 'Refusing non-VM host'; exit 1; }
if [[ ! -x /opt/homebrew/bin/brew ]]; then
  NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi
eval "$(/opt/homebrew/bin/brew shellenv)"
xcode-select -p >/dev/null
brew install node@24 cmake python@3.13
export PATH="/opt/homebrew/opt/node@24/bin:$PATH"
npm install --global --prefix /opt/homebrew pnpm@12.3.4 node-gyp@13.0.2
mkdir -p "$HOME/studio-vm"
printf '%s\n' 'studio-vm-v1' > "$HOME/studio-vm/prepared"
node --version
pnpm --version

sync
