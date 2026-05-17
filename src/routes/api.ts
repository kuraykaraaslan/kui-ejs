// AI-discoverability endpoints.
//
//   GET /api/registry          → full machine-readable component catalog (JSON)
//   GET /api/registry?index=1  → lightweight index (no source code), ~5x smaller
//   GET /llms-full.txt         → flattened markdown of the entire catalog
//
// The static llms.txt overview is served from public/llms.txt by the
// express.static middleware in src/app.ts.

import { Router } from 'express';
import { buildRegistry, buildRegistryIndex } from '../registry/registry';
import type { Registry, RegistryComponent } from '../registry/registry.types';

const router = Router();

router.get('/api/registry', (req, res) => {
  const indexOnly = req.query.index === '1';
  const payload = indexOnly ? buildRegistryIndex() : buildRegistry();
  res.set('Cache-Control', 'public, max-age=3600');
  res.set('Access-Control-Allow-Origin', '*');
  res.json(payload);
});

function renderComponent(c: RegistryComponent): string {
  const lines: string[] = [];
  lines.push(`### ${c.name}  (\`${c.id}\`)`);
  lines.push('');
  lines.push(`- **Layer:** ${c.layer}`);
  lines.push(`- **Category:** ${c.category}`);
  lines.push(`- **File:** \`${c.filePath}\``);
  lines.push(`- **Status:** ${c.status}${c.since ? ` (since ${c.since})` : ''}`);
  if (c.description) lines.push(`- **Description:** ${c.description}`);
  if (c.whenToUse) lines.push(`- **When to use:** ${c.whenToUse}`);
  if (c.whenNotToUse) lines.push(`- **When not to use:** ${c.whenNotToUse}`);
  if (c.composes?.length) lines.push(`- **Composes:** ${c.composes.join(', ')}`);
  if (c.relatedTo?.length) lines.push(`- **Related to:** ${c.relatedTo.join(', ')}`);
  if (c.usedBy?.length) lines.push(`- **Used by:** ${c.usedBy.join(', ')}`);
  if (c.designTokens?.length) lines.push(`- **Design tokens:** ${c.designTokens.join(', ')}`);
  if (c.dependencies?.length) lines.push(`- **Dependencies:** ${c.dependencies.join(', ')}`);
  if (c.a11y) {
    const a = c.a11y;
    const bits: string[] = [];
    if (a.wcagLevel) bits.push(`WCAG ${a.wcagLevel}`);
    if (a.ariaPatterns?.length) bits.push(`ARIA: ${a.ariaPatterns.join(', ')}`);
    if (a.keyboardInteractions?.length) {
      bits.push(
        'Keys: ' + a.keyboardInteractions.map((k) => `${k.keys} → ${k.action}`).join('; '),
      );
    }
    if (a.notes) bits.push(a.notes);
    if (bits.length) lines.push(`- **A11y:** ${bits.join(' · ')}`);
  }
  lines.push('');
  lines.push('**Variants:**');
  for (const v of c.variants) {
    lines.push('');
    lines.push(`*${v.title}*`);
    lines.push('```ejs');
    lines.push(v.code);
    lines.push('```');
  }
  lines.push('');
  return lines.join('\n');
}

function renderLlmsFull(reg: Registry): string {
  const out: string[] = [];

  out.push(`# ${reg.name} v${reg.version} — Full component catalog`);
  out.push('');
  out.push(`Generated ${reg.generatedAt}.`);
  out.push('');
  out.push(reg.description);
  out.push('');

  out.push('## Layers');
  for (const [layer, desc] of Object.entries(reg.layers)) {
    out.push(`- **${layer}** — ${desc}`);
  }
  out.push('');

  out.push('## Conventions');
  for (const [k, v] of Object.entries(reg.conventions)) {
    out.push(`- **${k}** — ${v}`);
  }
  out.push('');

  out.push('## Design tokens');
  out.push('| Token | Light value | Purpose |');
  out.push('|---|---|---|');
  for (const t of reg.designTokens) {
    out.push(`| \`${t.name}\` | \`${t.light}\` | ${t.purpose} |`);
  }
  out.push('');

  const groups = new Map<string, RegistryComponent[]>();
  for (const c of reg.components) {
    const key = `${c.layer} / ${c.category}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(c);
  }
  const sortedKeys = [...groups.keys()].sort();
  for (const key of sortedKeys) {
    out.push(`## Components — ${key}`);
    out.push('');
    for (const c of groups.get(key)!) {
      out.push(renderComponent(c));
    }
  }

  out.push('## Themes');
  out.push('| ID | Title | Route | Status | Since |');
  out.push('|---|---|---|---|---|');
  for (const t of reg.themes) {
    out.push(`| \`${t.id}\` | ${t.title} | \`${t.route}\` | ${t.status} | ${t.since ?? '—'} |`);
  }
  out.push('');

  return out.join('\n');
}

router.get('/llms-full.txt', (_req, res) => {
  const reg = buildRegistry();
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=3600');
  res.set('Access-Control-Allow-Origin', '*');
  res.send(renderLlmsFull(reg));
});

export default router;
