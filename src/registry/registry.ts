// Builds the machine-readable component registry from the showcase data + menu.
//
// Consumed by:
//   1. /api/registry        → JSON over HTTP
//   2. /api/registry?index=1 → lightweight JSON, no source
//   3. /llms-full.txt        → flattened markdown for AI agents
//
// Deterministic and side-effect-free — safe to call from any Express handler.

import { SHOWCASE_DATA } from '../data/showcase.data';
import NAV_GROUPS from '../data/showcase.menu';
import type { ComponentStatus, ShowcaseNavItem } from '../types';
import type {
  Registry,
  RegistryComponent,
  RegistryLayer,
  RegistryTheme,
  RegistryToken,
} from './registry.types';

const REGISTRY_VERSION = '1.0.0';
const LIB_NAME = 'kui-ejs';
const LIB_VERSION = '0.1.0';

const LAYER_DESCRIPTIONS: Record<RegistryLayer, string> = {
  ui:
    'modules/ui/ — Primitive EJS partials (atoms + molecules). Stateless presentational HTML; no business logic. Included via <%- include(\'modules/ui/<Name>\', { ...locals }) %>.',
  app:
    'modules/app/ — Application-level patterns (shells, navigation, drawers, search, state placeholders). Compose ui/ partials and own page-level structure.',
  domain:
    'modules/domain/<vertical>/ — Industry-vertical partials (auth, payment, address, modem, invoice, ups, api-doc, …). Compose ui/ + app/. modules/domain/modem/ also exports a TypeScript types.ts.',
  theme:
    'views/theme/<vertical>/ — Full multi-page server-rendered demos. Each theme has its own Express router under src/routes/themes/<vertical>.ts.',
};

const CONVENTIONS = {
  templating:
    'EJS 3 server-rendered. All data passed via res.render(view, locals). Use <%= value %> for escaped output; reserve <%- html %> for trusted EJS includes only (audited in docs/raw-output-allowlist.md).',
  icons:
    'Font Awesome 6 Free via CDN. Decorative icons require aria-hidden="true"; icon-only interactive elements require aria-label. No inline SVG; no other icon libraries.',
  styling:
    'Tailwind CSS 4 + CSS-variable design tokens defined in public/assets/css/input.css. Use token names (bg-primary, text-text-secondary, border-border-focus) — never raw hex. scripts/audit-tokens.sh enforces this in CI.',
  includes:
    'Include partials with relative paths: <%- include(\'../../partials/_head\') %>. Use modules/ui|app|domain partials by referencing their repo-relative paths from the consuming view.',
  accessibility:
    'Semantic HTML. Apply aria-busy / aria-invalid / aria-describedby / aria-pressed / aria-expanded where applicable. Always include focus-visible:ring-2 focus-visible:ring-border-focus on interactive elements. Standard disabled pattern: disabled:opacity-50 disabled:cursor-not-allowed.',
  rawOutput:
    'Unescaped EJS output (<%- %>) is restricted; every site is enumerated in docs/raw-output-allowlist.md and validated by scripts/audit-raw-output.sh. Adding a new raw-output site requires a justification entry in that doc.',
  fileNaming:
    'EJS partials: PascalCase .ejs in modules/{ui,app,domain}/. Shared partials: underscore-prefixed camelCase .ejs in views/partials/. Routes: camelCase .ts. Data: camelCase .data.ts. Theme directories: lowercase.',
};

const DESIGN_TOKENS: RegistryToken[] = [
  { name: '--primary',         light: '#3b82f6', purpose: 'Primary actions' },
  { name: '--primary-hover',   light: '#2563eb', purpose: 'Hover state' },
  { name: '--primary-active',  light: '#1d4ed8', purpose: 'Active/pressed' },
  { name: '--primary-subtle',  light: '#eff6ff', purpose: 'Tinted backgrounds' },
  { name: '--primary-fg',      light: '#ffffff', purpose: 'Text on primary' },
  { name: '--secondary',       light: '#8b5cf6', purpose: 'Secondary actions' },
  { name: '--secondary-hover', light: '#7c3aed', purpose: 'Secondary hover' },
  { name: '--secondary-active',light: '#6d28d9', purpose: 'Secondary active' },
  { name: '--secondary-subtle',light: '#f3f0ff', purpose: 'Secondary tint' },
  { name: '--secondary-fg',    light: '#ffffff', purpose: 'Text on secondary' },
  { name: '--surface-base',    light: '#ffffff', purpose: 'Page background' },
  { name: '--surface-raised',  light: '#f9fafb', purpose: 'Cards' },
  { name: '--surface-overlay', light: '#f3f4f6', purpose: 'Hover overlays' },
  { name: '--surface-sunken',  light: '#e5e7eb', purpose: 'Inset areas' },
  { name: '--text-primary',    light: '#111827', purpose: 'Body text' },
  { name: '--text-secondary',  light: '#6b7280', purpose: 'Muted text' },
  { name: '--text-disabled',   light: '#9ca3af', purpose: 'Disabled text' },
  { name: '--text-inverse',    light: '#ffffff', purpose: 'Text on dark bg' },
  { name: '--border',          light: '#e5e7eb', purpose: 'Default borders' },
  { name: '--border-strong',   light: '#d1d5db', purpose: 'Emphasized borders' },
  { name: '--border-focus',    light: '#3b82f6', purpose: 'Focus rings' },
  { name: '--success',         light: '#22c55e', purpose: 'Success state' },
  { name: '--success-subtle',  light: '#f0fdf4', purpose: 'Success background' },
  { name: '--success-fg',      light: '#14532d', purpose: 'Text on success' },
  { name: '--warning',         light: '#f59e0b', purpose: 'Warning state' },
  { name: '--warning-subtle',  light: '#fffbeb', purpose: 'Warning background' },
  { name: '--warning-fg',      light: '#78350f', purpose: 'Text on warning' },
  { name: '--error',           light: '#ef4444', purpose: 'Error/danger state' },
  { name: '--error-subtle',    light: '#fef2f2', purpose: 'Error background' },
  { name: '--error-fg',        light: '#7f1d1d', purpose: 'Text on error' },
  { name: '--info',            light: '#06b6d4', purpose: 'Informational state' },
  { name: '--info-subtle',     light: '#ecfeff', purpose: 'Info background' },
  { name: '--info-fg',         light: '#164e63', purpose: 'Text on info' },
];

function inferLayer(filePath: string): RegistryLayer {
  if (filePath.startsWith('modules/ui/')) return 'ui';
  if (filePath.startsWith('modules/app/')) return 'app';
  if (filePath.startsWith('modules/domain/')) return 'domain';
  if (filePath.startsWith('views/theme/')) return 'theme';
  return 'ui';
}

function inferDesignTokens(source: string): string[] {
  const set = new Set<string>();
  for (const tok of DESIGN_TOKENS) {
    const tail = tok.name.replace(/^--/, '');
    if (source.includes(`bg-${tail}`) ||
        source.includes(`text-${tail}`) ||
        source.includes(`border-${tail}`) ||
        source.includes(`from-${tail}`) ||
        source.includes(`to-${tail}`) ||
        source.includes(`ring-${tail}`) ||
        source.includes(tok.name)) {
      set.add(tok.name);
    }
  }
  return [...set].sort();
}

function findMenuEntry(id: string): ShowcaseNavItem | undefined {
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (item.id === id) return item;
    }
  }
  return undefined;
}

export function buildRegistry(): Registry {
  const components: RegistryComponent[] = SHOWCASE_DATA.map((c) => {
    const menu = findMenuEntry(c.id);
    const layer = inferLayer(c.filePath);
    return {
      id: c.id,
      name: c.title,
      layer,
      category: c.category,
      filePath: c.filePath,
      abbr: c.abbr || menu?.abbr || '??',
      description: c.description,
      source: c.sourceCode,
      variants: c.variants.map((v) => ({ title: v.title, code: v.code })),
      status: c.status ?? menu?.status ?? 'stable',
      since: c.since ?? menu?.since,
      whenToUse: c.whenToUse,
      whenNotToUse: c.whenNotToUse,
      composes: c.composes,
      relatedTo: c.relatedTo,
      a11y: c.a11y,
      designTokens: c.designTokens ?? inferDesignTokens(c.sourceCode),
      dependencies: c.dependencies,
    };
  });

  // Compute usedBy from composes[] (inverse index).
  const usedByMap = new Map<string, Set<string>>();
  for (const c of components) {
    for (const dep of c.composes ?? []) {
      if (!usedByMap.has(dep)) usedByMap.set(dep, new Set());
      usedByMap.get(dep)!.add(c.id);
    }
  }
  for (const c of components) {
    const set = usedByMap.get(c.id);
    if (set && set.size > 0) c.usedBy = [...set].sort();
  }

  // Derive themes from the menu's Theme entries (items with an href).
  const themes: RegistryTheme[] = [];
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (item.href && item.href.startsWith('/theme/')) {
        themes.push({
          id: item.id,
          title: item.title,
          route: item.href,
          status: (item.status as ComponentStatus | undefined) ?? 'stable',
          since: item.since,
        });
      }
    }
  }

  return {
    $schema: 'https://kui-ejs.dev/schemas/registry-v1.json',
    name: LIB_NAME,
    version: LIB_VERSION,
    registryVersion: REGISTRY_VERSION,
    generatedAt: new Date().toISOString(),
    description:
      'Machine-readable catalog of every EJS partial, theme, design token, and convention in the kui-ejs library. Consume this from an AI assistant to know what exists, where it lives, and how to use it.',
    layers: LAYER_DESCRIPTIONS,
    conventions: CONVENTIONS,
    designTokens: DESIGN_TOKENS,
    components,
    themes,
  };
}

/** Lightweight registry without source code — ~5x smaller for AI search. */
export function buildRegistryIndex() {
  const full = buildRegistry();
  return {
    ...full,
    components: full.components.map(({ source, variants, ...rest }) => ({
      ...rest,
      variantCount: variants.length,
    })),
  };
}
