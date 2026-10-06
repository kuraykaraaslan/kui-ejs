# Changelog

All notable changes to this project will be documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the project uses 0-based versioning (`0.x.y`) while pre-1.0.

## [Unreleased]

### Added — phase-9 data and realtime components (parity with kui-react)

- **Chart** (`modules/ui/Chart/Chart.ejs`, now with a showcase entry):
  - `type: 'gauge'` — server-rendered half-donut, `role="meter"`, threshold `bands`, optional needle, `stale`.
  - `type: 'heatmap'` — matrix of `cells`, token colour at variable opacity, hover tooltip, gradient legend; a missing value is an empty cell.
  - `xAxis: 'time'` (alias `xScale`) on line / area — points placed by timestamp, drag-to-zoom, double-click or `resetZoomLabel` button to leave, y rescales to the visible points.
  - `stacked` on bar / area; shared axis / grid / crosshair / tooltip primitives in `scripts/chart-helpers.js`.
  - Chart.ejs now inlines its helper scripts (idempotent; `loadHelpers: false` to opt out) — the band partials previously bailed out when the host page had not loaded them.
- **TimeWindowPicker** (`modules/ui/TimeWindowPicker.ejs`) — relative presets, absolute UTC range, interval / aggregation; emits `kui:timewindow-change`.
- **MapCanvas** (`modules/ui/MapView/MapCanvas.ejs`) — card-less map filling its parent; `tiles` (`{ url, attribution }` or `{ light, dark }`) and an English `loadingLabel` also on MapView.
- **ControlTile** (`modules/ui/ControlTile/`) — `ControlSwitch`, `ControlSlider`, `ControlSetpoint`, `ControlButton` over one `createAsyncControl` state machine (idle / pending / confirmed / mismatch / failed).
- **Toggle** `pending` / `mismatch` / `describedBy`; **RangeSlider** (single) `pending` and commit-on-release (`kui:rangeslider-commit`).

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
