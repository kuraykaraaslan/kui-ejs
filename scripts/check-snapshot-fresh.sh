#!/usr/bin/env bash
# check-snapshot-fresh.sh — regenerate the registry snapshot and fail (with
# instructions) if the working copy doesn't already include the result.
# Mirrors the CI snapshot-drift job's check; use it locally with:
#   npm run snapshot:check
#
# NOT wired into .lintstagedrc.json / the pre-commit hook. It was, during
# development of this hook, but lint-staged's stash-based handling of
# partially-staged files interacts with a task that both reads AND diffs
# git state in a way that produced inconsistent pass/fail results depending
# on unrelated unstaged changes elsewhere in the working tree — exactly the
# kind of flaky local gate that erodes trust in hooks. CI's snapshot-drift
# job (a clean checkout every time, no partial-staging ambiguity) is the
# real enforcement point for now; this script is a fast manual/CI-only
# check until that interaction is understood well enough to wire back in
# (see docs/dev/phase-1-ci-and-gates.md section 1.5, $KUIREACT_ROOT).
#
# Deliberately does NOT `git add` the regenerated files itself — same
# reasoning: let the caller decide, don't fight git's index from inside a
# task/hook.

set -euo pipefail
cd "$(dirname "$0")/.."

npm run registry:snapshot >/dev/null

if git diff --exit-code -I'"generatedAt"' -- public/registry public/components >/dev/null; then
  exit 0
fi

echo "❌  public/registry/** or public/components/** is now out of date with your change."
echo "    Run: git add public/registry public/components"
echo "    then commit again."
exit 1
