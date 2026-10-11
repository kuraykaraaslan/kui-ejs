# Phase 10 (kui-ejs): Ecosystem gap closure

**Canonical plan:** `$KUIREACT_ROOT/docs/phases/phase-10-ecosystem-gap-closure.md`. Section numbers below match it. Read its "Placement and parity rules" first; this file lists only the kui-ejs tasks.
**Origin:** survey of 2026-10-11 of five reference libraries (shadcnspace, daisyUI, FlyonUI, Preline, Aceternity UI). Evidence ("seen in N/M sites") is quoted in the canonical file.
**Effort:** M for this repo. Every numbered section is an independent PR.

## What stays out of kui-ejs

Marketing and commerce blocks (CTA, contact, bento grid, integrations, product quick view) and the portfolio and agency themes are React-only verticals (ADR 0003; `AGENTS.md` parity section) and get no tasks here. A one-line exception record for each is written in kui-react (`parity.exceptions.json`), not here. If ADR 0008 widens kui-ejs's domain scope, the canonical phase gains mirrors and this file gains tasks.

## Mirror and demo rule (applies to every task)

- Locals, defaults and DOM identical to the kui-react component (same class names, token names and values); client behaviour in a small script following the existing pattern (for example `modules/ui/Slider/scripts/drag.js`).
- Showcase section in `src/data/sections/` named like its neighbours (`ui-atom-<name>.showcase.ts`, `ui-molecule-…`, `app-<name>.showcase.ts`), menu entry in the same group and with the same title and abbreviation as kui-react, then `npm run registry:snapshot`.
- `npm run test:visual:update` for the new baselines and `npm run ci` green (tokens, raw output, spacing, dead partials, route smoke).

## 10.0 Housekeeping: make the three repos agree

- [ ] Showcase sections and `showcase.menu.ts` entries for `MiniCalendar` and `NoAccessState` (the partials exist in `modules/app/` but are not in the demo). Neither exists in kui-react: record the exception there (ejs-only, with reason) instead of creating them.
- [ ] Port `Timeline` (`modules/ui/Timeline.ejs`): same locals and DOM as `modules/ui/Timeline.tsx` in kui-react, showcase entry in the Organisms group. KUInative already has it.
- [ ] Port `BulkActionTable` (`modules/ui/BulkActionTable.ejs`) the same way, Organisms group. KUInative already has it.
- [ ] In `AGENTS.md` ("Parity with kui-react"): fix "13 verticals" (the list names 16) and add the EJS-only Email Templates theme (`views/theme/common/email`) to the EJS-only list. Keep wording identical to the matching kui-react ADR 0003 update.

## 10.1 Palette presets `+native`

- [ ] Adopt the shared token-preset source from kui-react (canonical 10.1): named presets (first set proposed: `corporate`, `luxury`, `pastel`, `black`, `ocean`, `retro`) as `data-theme="<preset>"` overrides in `public/assets/css/input.css`, nestable on any element, composing with `.dark` and with the pre-paint bootstrap script in `views/showcase/index.ejs`. Token names and values identical to kui-react.
- [ ] `ThemeSwitcher.ejs` and `views/showcase/partials/theme-switcher.ejs` get a palette picker beside light / dark / system, persisted in `localStorage` like the mode.
- [ ] Showcase: "Palette" variant on the ThemeSwitcher page (App Concepts group) with the nested-preview card set.
- [ ] `tests/visual`: one snapshot per preset; axe contrast check per preset.

## 10.2 Primitives `+native`

Partials in `modules/ui/` (or `modules/app/` for 10.2.5), group names as in kui-react.

- [ ] 10.2.1 `Carousel.ejs` (Organisms): CSS scroll-snap track, arrows, dots, `loop`, `autoplay` (paused on hover and under reduced motion), keyboard and swipe; same locals as the React props.
- [ ] 10.2.2 `OtpInput.ejs` (Molecules): `length`, `value`, paste splitting, auto-advance, `autocomplete="one-time-code"`; use it in the Common theme `auth/two-factor` page (and any verify-email page that exists).
- [ ] 10.2.3 `List.ejs` and `ListItem` partial (Molecules): leading and trailing slots, divider, selectable, dense.
- [ ] 10.2.4 `Marquee.ejs` (Organisms): `speed`, `direction`, `pauseOnHover`, `gap`, reduced-motion fallback.
- [ ] 10.2.5 `SortableList.ejs` (App Concepts): extract the shared drag-to-reorder code from `modules/app/KanbanBoard/scripts/dnd.js` and the image gallery's `dnd.js`; keyboard reordering with live-region announcements; `KanbanBoard` moves onto it with no visual change (existing snapshots must not move).
- [ ] 10.2.6 `Kbd.ejs` and `Link.ejs` (Atoms): web-only, no KUInative copy.
- [ ] `CookieConsent.ejs` (Organisms, canonical 10.3): bottom bar plus settings popup, remembers the choice, nothing tracked before consent; keep `audit:raw` clean.

## Definition of done (this repo)

- Each partial above renders identical markup to its kui-react counterpart for the same inputs (compare in `tests/partials.render.test.ts` plus visual snapshots).
- Every partial in `modules/` has a showcase entry; `public/registry/components.json` is regenerated and committed.
- Exceptions are recorded in kui-react's `parity.exceptions.json`, not left implicit.
