#!/usr/bin/env node
// npm run new:component <layer> <Name> — scaffolds a new EJS partial,
// registered in the showcase. Per
// $KUIREACT_ROOT/docs/dev/phase-7-showcase-and-dx.md 7.6, mirroring
// kui-react's scripts/new-component.mjs.
//
// <layer> is one of: ui, app, domain/<vertical> (vertical must already
// have a NAV_GROUPS entry — see VERTICAL_LABELS below).
//
// Writes:
//   modules/<layer>/<Name>.ejs                        — the partial
//   src/data/sections/new-<id>.showcase.ts             — showcase entry
// Edits:
//   src/data/showcase.data.ts  — adds the import + spread
//   src/data/showcase.menu.ts  — adds a NAV_GROUPS entry
//
// Does NOT scaffold a `.locals.ts` file — that convention
// (docs/dev/phase-7-showcase-and-dx.md 7.1, "Point the existing editor
// at the .locals.ts schemas from phase 6.8") doesn't exist anywhere in
// this codebase yet (phase 6 hasn't happened), so there's no established
// shape to generate against.
//
// Does NOT run `npm run registry:snapshot` — prints a reminder instead,
// since the snapshot should reflect a component you've actually looked
// at, not the bare scaffold.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');

const [, , layerArg, nameArg, ...rest] = process.argv;
const categoryFlagIdx = rest.indexOf('--category');
const categoryArg = categoryFlagIdx !== -1 ? rest[categoryFlagIdx + 1] : undefined;

if (!layerArg || !nameArg) {
  console.error('Usage: npm run new:component <ui|app|domain/<vertical>> <Name> [--category Atom|Molecule|Organism]');
  console.error('Example: npm run new:component ui Callout');
  console.error('Example: npm run new:component domain/common PriceTag');
  process.exit(1);
}

if (!/^[A-Z][A-Za-z0-9]*$/.test(nameArg)) {
  console.error(`Name must be PascalCase (e.g. "Callout"), got: ${nameArg}`);
  process.exit(1);
}

// Vertical folder name (modules/domain/<vertical>) -> exact NAV_GROUPS
// label already in showcase.menu.ts.
const VERTICAL_LABELS = {
  common: 'Domain — Common',
  'api-doc': 'Domain — API Doc',
  modem: 'Domain — Modem',
  invoice: 'Domain — Invoice',
  ups: 'Domain — UPS',
};

let layer = layerArg;
let vertical = null;
if (layerArg.startsWith('domain/')) {
  vertical = layerArg.slice('domain/'.length);
  if (!VERTICAL_LABELS[vertical]) {
    console.error(`Unknown vertical "${vertical}". Known: ${Object.keys(VERTICAL_LABELS).join(', ')}`);
    console.error('A brand-new vertical needs its own showcase.menu.ts group added by hand first.');
    process.exit(1);
  }
  layer = 'domain';
} else if (layer !== 'ui' && layer !== 'app') {
  console.error(`<layer> must be "ui", "app", or "domain/<vertical>", got: ${layerArg}`);
  process.exit(1);
}

const category = categoryArg ?? (layer === 'ui' ? 'Atom' : layer === 'app' ? 'App' : 'Domain');
if (!['Atom', 'Molecule', 'Organism', 'App', 'Domain'].includes(category)) {
  console.error(`--category must be one of Atom, Molecule, Organism (got: ${category})`);
  process.exit(1);
}

const id = nameArg
  .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
  .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
  .toLowerCase();

const abbr = (nameArg.match(/[A-Z]/g) ?? [nameArg[0]]).slice(0, 2).join('');

const componentDir = vertical ? path.join('modules/domain', vertical) : path.join('modules', layer);
const componentRelPath = path.join(componentDir, `${nameArg}.ejs`);
const componentAbsPath = path.join(REPO_ROOT, componentRelPath);
const showcaseRelPath = path.join('src/data/sections', `new-${id}.showcase.ts`);
const showcaseAbsPath = path.join(REPO_ROOT, showcaseRelPath);

for (const p of [componentAbsPath, showcaseAbsPath]) {
  if (existsSync(p)) {
    console.error(`Refusing to overwrite existing file: ${path.relative(REPO_ROOT, p)}`);
    process.exit(1);
  }
}

// ── modules/<layer>/<Name>.ejs — mirrors modules/ui/Badge.ejs's shape ──
const componentSource = `<%
var _v  = locals.variant || 'primary';

var vc = {
  primary:   'bg-primary text-primary-fg hover:bg-primary-hover',
  secondary: 'bg-secondary text-secondary-fg hover:bg-secondary-hover',
}[_v] || 'bg-primary text-primary-fg hover:bg-primary-hover';
%>
<div
  class="rounded-md px-4 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus <%= vc %><%= locals.className ? ' ' + locals.className : '' %>"
>
  <%= locals.children %>
</div>
`;

mkdirSync(componentDir, { recursive: true });
writeFileSync(componentAbsPath, componentSource);

// ── src/data/sections/new-<id>.showcase.ts ──
// previewHtml is a hand-rolled HTML string, not ejs.render() of the
// real partial — the same pattern every other showcase section in this
// codebase uses (see tests/visual/showcase.spec.ts's own header comment
// on why that's a real, if imperfect, convention here).
const escapedSource = componentSource.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
const buildFnName = `build${nameArg}ScaffoldData`;
const includePath = componentRelPath.replace(/\\/g, '/').replace(/\.ejs$/, '');

const showcaseSource = `import type { ShowcaseItem } from '../../types';

// Scaffolded by scripts/new-component.mjs — fill in a real description
// and at least one more variant before shipping.
export function ${buildFnName}(): ShowcaseItem[] {
  const sourceCode = \`${escapedSource}\`;

  return [
    {
      id: '${id}',
      title: '${nameArg}',
      category: '${category}',
      abbr: '${abbr}',
      description: 'TODO: describe ${nameArg}.',
      filePath: '${componentRelPath.replace(/\\/g, '/')}',
      sourceCode,
      variants: [
        {
          title: 'Default',
          previewHtml: \`<div class="rounded-md px-4 py-2 font-medium bg-primary text-primary-fg">Hello</div>\`,
          code: \`<%- include('${includePath}', { children: 'Hello' }) %>\`,
        },
        {
          title: 'Secondary',
          previewHtml: \`<div class="rounded-md px-4 py-2 font-medium bg-secondary text-secondary-fg">Hello</div>\`,
          code: \`<%- include('${includePath}', { variant: 'secondary', children: 'Hello' }) %>\`,
        },
      ],
    },
  ];
}
`;
writeFileSync(showcaseAbsPath, showcaseSource);

// ── src/data/showcase.data.ts — add import + spread ──
const dataPath = path.join(REPO_ROOT, 'src/data/showcase.data.ts');
let dataSource = readFileSync(dataPath, 'utf8');
const importLine = `import { ${buildFnName} } from './sections/new-${id}.showcase';\n`;
const lastImportMatch = [...dataSource.matchAll(/^import .*;\n/gm)].pop();
if (!lastImportMatch) {
  console.error('Could not find an import line in showcase.data.ts to anchor the new import after.');
  process.exit(1);
}
const importInsertAt = lastImportMatch.index + lastImportMatch[0].length;
dataSource = dataSource.slice(0, importInsertAt) + importLine + dataSource.slice(importInsertAt);

const spreadLine = `  ...${buildFnName}(),\n`;
const arrayMatch = dataSource.match(/SHOWCASE_DATA: ShowcaseItem\[\] = \[\n/);
if (!arrayMatch) {
  console.error('Could not find "SHOWCASE_DATA: ShowcaseItem[] = [" in showcase.data.ts to anchor the new spread after.');
  process.exit(1);
}
const spreadInsertAt = arrayMatch.index + arrayMatch[0].length;
dataSource = dataSource.slice(0, spreadInsertAt) + spreadLine + dataSource.slice(spreadInsertAt);
writeFileSync(dataPath, dataSource);

// ── src/data/showcase.menu.ts — add a NAV_GROUPS entry ──
const menuPath = path.join(REPO_ROOT, 'src/data/showcase.menu.ts');
let menuSource = readFileSync(menuPath, 'utf8');
const groupLabel = layer === 'ui' ? (category === 'Molecule' ? 'Molecules' : category === 'Organism' ? 'Organisms' : 'Atoms')
  : layer === 'app' ? 'App Concepts'
  : VERTICAL_LABELS[vertical];

const groupHeaderRe = new RegExp(`label: '${groupLabel.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}'[\\s\\S]*?items: \\[\\n`);
const groupMatch = menuSource.match(groupHeaderRe);
if (!groupMatch) {
  console.error(`Could not find the "${groupLabel}" NAV_GROUPS entry in showcase.menu.ts.`);
  console.error('Add the component to the menu by hand.');
} else {
  const menuInsertAt = groupMatch.index + groupMatch[0].length;
  const menuLine = `      { id: '${id}', title: '${nameArg}', category: '${category}', abbr: '${abbr}', since: '${new Date().toISOString().slice(0, 7)}' },\n`;
  menuSource = menuSource.slice(0, menuInsertAt) + menuLine + menuSource.slice(menuInsertAt);
  writeFileSync(menuPath, menuSource);
}

console.log(`Scaffolded ${nameArg}:`);
console.log(`  ${componentRelPath}`);
console.log(`  ${showcaseRelPath}`);
console.log(`  + import/spread in src/data/showcase.data.ts`);
if (groupMatch) console.log(`  + nav entry in src/data/showcase.menu.ts ("${groupLabel}")`);
console.log('');
console.log('Next steps:');
console.log(`  1. Fill in the real description and a second meaningful variant in ${showcaseRelPath}.`);
console.log(`  2. Build the actual partial (the scaffold is a generic Badge.ejs-shaped template).`);
console.log('  3. Run `npm run registry:snapshot` once you\'re happy with it.');
