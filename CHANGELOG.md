# Changelog

All notable changes to this project will be documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the project uses 0-based versioning (`0.x.y`) while pre-1.0.

## [Unreleased]

### Added — AI-discoverability layer

- **Machine-readable component registry** at [`src/registry/registry.ts`](src/registry/registry.ts), exposed via:
  - `GET /api/registry` — full registry JSON (every partial, theme, design token, convention; full EJS source inlined).
  - `GET /api/registry?index=1` — index-only variant without source code (~5x smaller).
  - `GET /llms-full.txt` — long-form markdown dump of the entire catalog.
- **`public/llms.txt`** — concise [llms.txt convention](https://llmstxt.org/) overview pointing AI agents at the registry and conventions.
- **AGENTS.md upgrade** — top-of-file "AI agent quick reference" section with the registry URLs and search recipe.
- **Extended `ShowcaseItem` schema** ([`src/types/index.ts`](src/types/index.ts)) with:
  - `status`, `since` — were previously only on `ShowcaseNavItem`; now also on items for direct consumption by the registry.
  - Optional AI fields: `whenToUse`, `whenNotToUse`, `composes`, `relatedTo`, `a11y`, `designTokens`, `dependencies`. All optional — backward compatible.
- **Express router** [`src/routes/api.ts`](src/routes/api.ts) mounted before the showcase catch-all so `/api/registry` and `/llms-full.txt` resolve correctly.

### Removed

- Stray duplicate file `ui-atom-avatar.showcase.ts` at the project root (the canonical version lives at `src/data/sections/ui-atom-avatar.showcase.ts`).

## [0.1.0]

Initial public version. See `git log` for history prior to this changelog.
