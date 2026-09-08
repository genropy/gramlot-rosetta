#!/usr/bin/env bash
# Fetch the immutable Genro preview used by all four Rosetta variants.
set -euo pipefail
repo_root="$(cd "$(dirname "$0")/.." && pwd)"
dependency_root="$repo_root/.local/dependencies"
mkdir -p "$dependency_root/client"
checkout() {
  local repository="$1" revision="$2" destination="$3"
  if [[ -e "$destination" ]]; then
    if [[ "$(git -C "$destination" rev-parse HEAD)" != "$revision" ]] ||
       [[ -n "$(git -C "$destination" status --porcelain)" ]]; then
      echo "Existing checkout differs from preview: $destination. Preserve it before retrying." >&2
      exit 1
    fi
  else
    git clone "https://github.com/genropy/$repository.git" "$destination"
    git -C "$destination" checkout --detach "$revision"
  fi
}
checkout genro-pages 0683f5dca8ea04b7047fed56e68317b27b9aa745 "$dependency_root/genro-pages"
checkout genro-builders 25ae61950717afae10e1d43d8318f272122202ac "$dependency_root/genro-builders"
checkout genro-dom-js d888cefbb4dfb65868148afb2e00cabe84b4de08 "$dependency_root/client/genro-dom-js"
npm ci --prefix "$dependency_root/client/genro-dom-js" --ignore-scripts --no-audit --no-fund
for entry in node_modules genro-bag-js genro-tytx; do
  case "$entry" in
    node_modules) target="$dependency_root/client/genro-dom-js/node_modules" ;;
    *) target="$dependency_root/client/genro-dom-js/node_modules/$entry" ;;
  esac
  link="$dependency_root/client/$entry"
  if [[ ! -e "$link" && ! -L "$link" ]]; then ln -s "$target" "$link"; fi
done
