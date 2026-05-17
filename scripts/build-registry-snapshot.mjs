#!/usr/bin/env node
// Builds offline AI-discoverable artifacts for kui-ejs.
//
//   1. public/registry/components.json           — full registry JSON
//   2. public/registry/components.index.json     — lightweight index (no source)
//   3. public/components/<id>.md                 — one markdown file per partial
//   4. public/components/_index.json             — { id → filename } map
//
// Strategy: directly invoke src/registry/registry.ts via tsx. No server,
// no headless browser — EJS is server-rendered so the registry is pure TS.

import { spawn } from 'node:child_process';
import { mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const OUT_REGISTRY_DIR   = path.join(REPO_ROOT, 'public/registry');
const OUT_COMPONENTS_DIR = path.join(REPO_ROOT, 'public/components');
const REGISTRY_FILE      = path.join(OUT_REGISTRY_DIR, 'components.json');
const INDEX_FILE         = path.join(OUT_REGISTRY_DIR, 'components.index.json');
const COMPONENTS_INDEX_FILE = path.join(OUT_COMPONENTS_DIR, '_index.json');

function buildIndex(reg) {
  return {
    ...reg,
    components: reg.components.map(({ source, variants, ...rest }) => ({
      ...rest,
      variantCount: variants?.length ?? 0,
    })),
  };
}

function markdownForComponent(c) {
  const lines = [];
  lines.push(`# ${c.name}`);
  lines.push('');
  lines.push(`- **id:** \`${c.id}\``);
  lines.push(`- **layer:** ${c.layer}`);
  lines.push(`- **category:** ${c.category}`);
  lines.push(`- **filePath:** \`${c.filePath}\``);
  lines.push(`- **status:** ${c.status}`);
  if (c.since) lines.push(`- **since:** ${c.since}`);
  lines.push('');
  if (c.description) { lines.push(c.description); lines.push(''); }

  if (c.whenToUse)    { lines.push('## When to use', '', c.whenToUse, ''); }
  if (c.whenNotToUse) { lines.push('## When NOT to use', '', c.whenNotToUse, ''); }
  if (c.composes?.length) {
    lines.push('## Depends on (include order)', '');
    for (const id of c.composes) lines.push(`- \`${id}\``);
    lines.push('');
  }
  if (c.usedBy?.length) {
    lines.push('## Used by', '');
    for (const id of c.usedBy) lines.push(`- \`${id}\``);
    lines.push('');
  }
  if (c.a11y) {
    lines.push('## Accessibility', '');
    if (c.a11y.wcagLevel) lines.push(`- WCAG: ${c.a11y.wcagLevel}`);
    if (c.a11y.ariaPatterns?.length) lines.push(`- ARIA patterns: ${c.a11y.ariaPatterns.join(', ')}`);
    if (c.a11y.keyboardInteractions?.length) {
      lines.push('- Keyboard:');
      for (const ki of c.a11y.keyboardInteractions) lines.push(`  - \`${ki.keys}\` — ${ki.action}`);
    }
    if (c.a11y.notes) { lines.push('', c.a11y.notes); }
    lines.push('');
  }
  if (c.designTokens?.length) {
    lines.push('## Design tokens consumed', '');
    for (const t of c.designTokens) lines.push(`- \`${t}\``);
    lines.push('');
  }
  if (c.variants?.length) {
    lines.push('## Variants', '');
    for (const v of c.variants) {
      lines.push(`### ${v.title}`, '', '```ejs', v.code, '```', '');
    }
  }
  if (c.source) {
    lines.push('## Full EJS source', '', '```ejs', c.source, '```', '');
  }
  return lines.join('\n');
}

async function captureRegistryViaTsx() {
  // Write a tiny harness script that imports the registry and prints JSON
  // to stdout. We use tsx because src/registry/registry.ts is TypeScript.
  const harness = `
import { buildRegistry } from '${path.join(REPO_ROOT, 'src/registry/registry').replace(/\\/g, '/')}';
const reg = buildRegistry();
process.stdout.write('::REG_BEGIN::' + JSON.stringify(reg) + '::REG_END::');
`;
  const harnessPath = path.join(os.tmpdir(), `kui-ejs-snapshot-${process.pid}.ts`);
  await writeFile(harnessPath, harness, 'utf8');

  const out = await new Promise((resolve, reject) => {
    const child = spawn('npx', ['tsx', harnessPath], {
      cwd: REPO_ROOT,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (b) => { stdout += b.toString(); });
    child.stderr.on('data', (b) => { stderr += b.toString(); });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code !== 0) reject(new Error(`tsx exited ${code}: ${stderr}`));
      else resolve(stdout);
    });
  }).finally(async () => {
    try { await rm(harnessPath, { force: true }); } catch { /* ignore */ }
  });

  const m = out.match(/::REG_BEGIN::([\s\S]+?)::REG_END::/);
  if (!m) throw new Error(`Harness did not emit registry markers. stdout: ${out.slice(0, 400)}`);
  const reg = JSON.parse(m[1]);
  if (!Array.isArray(reg.components)) throw new Error('Registry did not contain components[]');
  return reg;
}

async function writeArtifacts(reg) {
  await rm(OUT_REGISTRY_DIR, { recursive: true, force: true });
  await rm(OUT_COMPONENTS_DIR, { recursive: true, force: true });
  await mkdir(OUT_REGISTRY_DIR, { recursive: true });
  await mkdir(OUT_COMPONENTS_DIR, { recursive: true });

  await writeFile(REGISTRY_FILE, JSON.stringify(reg, null, 2) + '\n', 'utf8');
  await writeFile(INDEX_FILE, JSON.stringify(buildIndex(reg), null, 2) + '\n', 'utf8');

  const indexMap = {};
  for (const c of reg.components) {
    const filename = `${c.id}.md`;
    await writeFile(path.join(OUT_COMPONENTS_DIR, filename), markdownForComponent(c), 'utf8');
    indexMap[c.id] = { name: c.name, layer: c.layer, category: c.category, file: filename };
  }
  await writeFile(COMPONENTS_INDEX_FILE, JSON.stringify(indexMap, null, 2) + '\n', 'utf8');
  return { components: reg.components.length, themes: reg.themes.length };
}

async function main() {
  console.log('[snapshot] building registry via tsx…');
  const reg = await captureRegistryViaTsx();
  console.log(`[snapshot] built: ${reg.components.length} components, ${reg.themes.length} themes`);
  const stats = await writeArtifacts(reg);
  console.log(`[snapshot] wrote ${stats.components} component .md files + JSON snapshots`);
}

main().catch((err) => {
  console.error('[snapshot] failed:', err.message);
  process.exit(1);
});
