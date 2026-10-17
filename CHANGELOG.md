# Changelog

All notable changes to this project will be documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the project uses 0-based versioning (`0.x.y`) while pre-1.0.

## [Unreleased]

### Added — extension surfaces (parity with kui-react, next-boilerplate phase 37)

- `modules/ui/UnavailableContribution.ejs`: the placeholder admins and editors see where a contributed piece of
  UI cannot be shown. Reasons `disabled`, `unentitled`, `blocked`, `retired`, `banned`, `quarantined`, `failed`,
  `missing`, `no-access` with the same icons, tones and English texts as kui-react; sizes `inline`, `card`, `tab`,
  `node`; optional `title`, `label`, `detail` (`null` hides it), `icon`, `tone`, `action` (`label` + `href` or an
  `onClick` JS string), `framed`. kui-react's `ContributionBoundary` has no EJS counterpart (server render): a
  host catches a failing contribution and renders this partial.
- TabGroup: tabs take `order` and a per-tab `lazy`; `isolate` (group or per tab) renders a function `content`
  inside try/catch, and a throwing tab shows `renderError({ tab, error })` or a "failed" placeholder with Retry
  (a reload) and is reported to `onTabError(tabId, error)`. An unknown `activeTab` falls back to the first tab.
- DropdownMenu items take `id`, `href` (a link), `order`, `group`, `hidden`, `disabledReason`; hidden items are
  left out and, when any item sets `group` or `order`, items are laid out by group with separators between
  groups. `portal` moves the open menu to `document.body` with fixed positioning.
- UserMenu: `items` (replaces the built-in items), `extraItems` and `mergeItems` (merge with Profile, Settings,
  Sign out by group and order), `labels`, `onProfile` / `onSettings` / `onSignOut`.
- AppTopBar: `start` and `end` regions taking HTML or ordered `{ id, node, order, hidden }` items.
- AppSidebar: `headerContent` above the nav groups (HTML or a function of `{ collapsed }`); a non-numeric `badge`
  renders as given.
- DataTable (`static` / `paginated`): `rowActions` with per-row `href`, `onClick`, `hidden`, `disabled`,
  `disabledReason` (values or functions of the row), `destructive`, `group`, `order`, in a trailing column of
  portalled menus; `rowActionsLabel`, `actionsColumnLabel`.
- CommandPalette: commands take `group` (`category` stays), `order`, `hidden`; `window.__KuiCmdStore.registerMany`
  and every palette now lists the commands registered at runtime when it opens.

### Added — UserMenu portal, className and a turning chevron (parity with kui-react)

- UserMenu: `portal` moves the open menu to `document.body` (DropdownMenu `portal`), so a sticky or clipping
  top bar cannot cut it off; `className` goes to the DropdownMenu root. The trigger is a Tailwind `group`, so the
  chevron turns over while the menu is open (`group-aria-expanded:rotate-180`). Without a name the email stands
  in, as in kui-react. These came from next-boilerplate's UserMenu fork, which now uses kui-react's.

### Fixed — AppSidebar

- An active item rendered `aria-current=&#34;page&#34;` and a collapsed one `title=&#34;…&#34;` (the attribute
  strings went through escaped output), so neither attribute had its intended value. Both are now real
  attributes, the title escaped.

### Changed — CommandPalette lists no sample commands by default

- Pass `demo: true` (or your own `items`) to get the twelve sample commands. With no commands at all the
  palette shows its empty state.

### Fixed — CommandPalette

- An item without `href` rendered `type=&#34;button&#34;` (the attribute string went through escaped output).
- ⌘K, Escape and suggestion clicks also matched the palette's own `-list` / `-empty` elements, so ⌘K could show
  the empty state over results.

### Added — TimeWindowSelect (parity with kui-react)

- `modules/ui/TimeWindowSelect.ejs`: a time window behind one button. The button names the window
  (`Realtime · Last 24h · avg 5m`) and opens a panel with **Realtime** (last N presets or any amount sliding with
  now, or the current calendar period, optionally so far) and **History** (last N anchored when Update is
  pressed, a fixed range typed as `datetime-local` in the window's zone with DST-correct offsets, or a past
  period); aggregation, interval with a bucket estimate (warning above `maxBuckets`, default 500) and time zone
  apply to both. Edits are a draft until Update; Cancel, Escape and an outside click drop them. Same
  `TimeWindowValue`, `kui:timewindow-change` event and `onChange` hook as TimeWindowPicker.
- The draft state is DOM-free (`TimeWindowSelect/scripts/time-window-logic.js`, server twin `_logic.ejs`).
- TimeWindowPicker's messages, calendar periods and zone list moved to `TimeWindowPicker/_shared.ejs`, shared by
  both; the picker's output is unchanged.

### Changed — Popover can be controlled

- `open` (boolean) makes the popover controlled: it renders in that state and the trigger, outside clicks and
  Escape only ask; the host opens and closes it with `openPopover(id)` / `closePopover(id)`. `onOpenChange` names
  a global function called with `(open, id)`. Every requested change dispatches `kui:popover-openchange`
  (`detail: { id, open }`). Without `open` it behaves as before.

### Added — TimeWindowPicker calendar periods, custom durations and time zone (parity with kui-react)

- `calendarPeriods` (default none; `true` = all 18) adds a **Calendar** segment with a period select
  (`current.*` / `previous.*` × hour, day, week, isoWeek, month, quarter, halfYear, year, plus
  `dayBeforeYesterday`, `thisDayLastWeek`) and a **So far** checkbox, disabled for a past period. The value
  gains `{ mode: 'calendar', period, soFar? }`.
- `allowDuration` adds a **Last** segment: an amount and a minutes / hours / days unit, emitting `<n>m|h|d`.
- `showTimezone` adds a zone select (`Zone: default` first, then every IANA zone, UTC first).
- New `messages` keys: `calendar`, `calendarPeriod`, `soFar`, `duration`, `durationAmount`, `durationUnit`,
  `durationUnits`, `timezone`, `timezoneDefault`, `periods`. All opt-in; existing markup is unchanged.

### Changed — Chart parity with kui-react's chart settings surface

- Value axes widen to round bounds with readable steps (`niceStep`, `niceTicks`, `resolveDomain`); `yTickCount`.
- Crowded category labels are thinned (`thinLabels`); time ticks read `HH:mm` / `d MMM`, with `timeZone`.
- Line / area / bar: right value axis (`yAxis: 'right'`, `y2Min` / `y2Max` / `y2Label` / `y2Format`, aligned grid),
  `yMin` / `yMax`, axis titles, `thresholds`, `gridStyle`, `gridColor`, `tickStyle`, `showXAxis` / `showYAxis`,
  legend position / values / toggling, tooltip mode / header / value format / total, `fill`, entrance animation.
- Line / area: curves (`smooth`, `linear`, `step`), per-series `lineStyle`, point marks (`pointShape`, `pointSize`),
  `fillGradient`, value labels, `yIncludeZero`. Bar: grouped stacks (`series[].stack`), horizontal bars, value
  labels, `barWidth` / `barGap` / `radius`, `categoryTicks`, `markers`, tooltips.
- Pie / donut: slice labels inside or outside, `sliceGap`, `startAngle`, centre caption, legend values and toggling.
- Gauge: arc / donut / bar / level layouts, outer or track bands, needle styles, ticks, HTML text.
- Heatmap: two-colour scale (`colorLow`), banded colours, cell values, legend position and banded legend.
- Line / area / bar / pie are drawn by `scripts/series.js`, `bar.js` and `pie.js` from a JSON config (the
  `_line` / `_area` / `_bar` / `_pie` / `_donut` partials and `time-series.js` are gone).

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
