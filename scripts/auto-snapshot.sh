#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/.."

OUT="public/registry/components.json"
SRC_DIRS=(src/registry views modules)

if [ -f "$OUT" ] && [ -z "$(find "${SRC_DIRS[@]}" -newer "$OUT" -type f -print -quit 2>/dev/null)" ]; then
  exit 0
fi

npm run registry:snapshot --silent
