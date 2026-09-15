#!/usr/bin/env node
// debt-ratchet.mjs — Freeze the known pre-existing debt counts and only
// allow them to go down. See docs/dev/phase-1-ci-and-gates.md ($KUIREACT_ROOT)
// section 1.6.
//
// Each metric's definition matches the exact command documented in
// $KUIREACT_ROOT/docs/dev/audit-2026-09-15.md's "Commands to reproduce"
// section, so the baseline stays reproducible by hand, not just by this
// script.
//
// Usage:
//   node scripts/debt-ratchet.mjs            # check against the baseline
//   node scripts/debt-ratchet.mjs --update   # print an updated baseline
//                                             # JSON (only ever paste this
//                                             # back in for counts that fell)

import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { walkSourceFiles } from './lib/walk-source-files.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const BASELINE_FILE = path.join(REPO_ROOT, 'scripts/debt-baseline.json');

function countMatchingFiles(dirs, pattern) {
  let count = 0;
  for (const relPath of walkSourceFiles(REPO_ROOT, dirs)) {
    const content = readFileSync(path.join(REPO_ROOT, relPath), 'utf8');
    if (pattern.test(content)) count++;
  }
  return count;
}

function countOccurrences(dirs, pattern) {
  let count = 0;
  for (const relPath of walkSourceFiles(REPO_ROOT, dirs)) {
    const content = readFileSync(path.join(REPO_ROOT, relPath), 'utf8');
    const matches = content.match(new RegExp(pattern.source, 'g'));
    if (matches) count += matches.length;
  }
  return count;
}

function runAndCapture(cmd, args) {
  try {
    return execFileSync(cmd, args, { cwd: REPO_ROOT, encoding: 'utf8' });
  } catch (err) {
    // Non-zero exit is expected — these scripts fail when they find
    // problems, which is exactly the count we want. Output is still there.
    return (err.stdout ?? '') + (err.stderr ?? '');
  }
}

// Both audit-tokens.sh and audit-raw-output.sh print prose explaining the
// rule, then one violation per line as `path:lineNumber:content`, then more
// prose. Rather than re-deriving each script's own filter/allowlist logic a
// second time in Node (and risking the two definitions drifting apart),
// just count lines that look like a `path:N:` violation — every real
// violation line matches this shape and no prose line does.
const VIOLATION_LINE = /^[^\s:][^:]*:\d+:/;

function countBashScriptViolations(output) {
  return output.split('\n').filter((l) => VIOLATION_LINE.test(l)).length;
}

function measure() {
  const rawOutputOutput = runAndCapture('bash', [path.join(REPO_ROOT, 'scripts/audit-raw-output.sh')]);
  const tokensOutput = runAndCapture('bash', [path.join(REPO_ROOT, 'scripts/audit-tokens.sh')]);

  return {
    // .ejs only — the point of this metric is partials with an inline
    // <script> that phase 5.2 hasn't extracted yet. A raw `grep -rl` over
    // all of modules/ (no extension filter) also matches the .js files
    // those extractions already produced (12 of them) plus two README.md
    // mentions in prose — neither is a violation, so it overcounts.
    inlineScriptPartials: countMatchingFiles(['modules'], /<script/),
    onclickAttributes: countOccurrences(['modules', 'views'], /onclick=/),
    unapprovedRawOutput: countBashScriptViolations(rawOutputOutput),
    rawHexOutsideAllowlist: countBashScriptViolations(tokensOutput),
  };
}

function main() {
  const current = measure();
  const update = process.argv.includes('--update');

  if (update) {
    console.log(JSON.stringify(current, null, 2));
    return;
  }

  if (!existsSync(BASELINE_FILE)) {
    console.error(`No baseline file at ${path.relative(REPO_ROOT, BASELINE_FILE)}.`);
    console.error('Run `node scripts/debt-ratchet.mjs --update` and save the output there to seed one.');
    process.exitCode = 1;
    return;
  }

  const baseline = JSON.parse(readFileSync(BASELINE_FILE, 'utf8'));
  let regressed = false;
  let improved = false;

  console.log('Debt ratchet — current vs. baseline (lower is better):');
  console.log('');
  for (const key of Object.keys(current)) {
    const cur = current[key];
    const base = baseline[key] ?? 0;
    let status = '=';
    if (cur > base) {
      status = `▲ REGRESSION (+${cur - base})`;
      regressed = true;
    } else if (cur < base) {
      status = `▼ improved (-${base - cur})`;
      improved = true;
    }
    console.log(`  ${key.padEnd(24)} ${String(cur).padStart(5)}  (baseline ${base})  ${status}`);
  }
  console.log('');

  if (regressed) {
    console.log('❌  One or more debt counts rose above the baseline. Fix the regression, or if the');
    console.log('    rise is deliberate and reviewed, update scripts/debt-baseline.json in the same PR.');
    process.exitCode = 1;
    return;
  }

  if (improved) {
    console.log('✅  No regressions — and some counts fell! Consider lowering the baseline:');
    console.log('    node scripts/debt-ratchet.mjs --update > scripts/debt-baseline.json');
  } else {
    console.log('✅  No regressions.');
  }
}

main();
