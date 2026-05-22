# views/theme — Full-Page Theme Demos

Each subdirectory is a self-contained multi-page website demo that wires `modules/domain/<vertical>/` partials into a realistic product. Routes are mounted via `src/routes/themes/<vertical>.ts`; static sample data lives in `src/data/<vertical>.data.ts`.

## Themes

```
common/    — Auth, account, cart, payment, email templates (shared scaffolding)
api-doc/   — OpenAPI / REST documentation site
modem/     — Modem / router admin UI (EJS-only)
invoice/   — Invoice list, detail, printable view (EJS-only)
ups/       — UPS / power-management dashboard (EJS-only)
```

## Parity

Mixed:

- `common/`, `api-doc/` — shared with NextJS at `/home/kuray/01_NextJS_Components/app/theme/<vertical>/`. Pages and layouts must match visually.
- `modem/`, `invoice/`, `ups/` — **EJS-only, no NextJS counterpart**.

## Conventions

1. **Layout choice** — pass `layout: 'layouts/blank'` for self-contained themed shells, `layout: 'layouts/main'` for showcase-framed demos. Set in the route file, not the view.
2. **`_nav.ejs` / `_nav-close.ejs`** — per-theme nav partials with leading underscore; included via `<%- include('./_nav') %>`.
3. **Header destructure in every view** — `<% const { title, data, ... } = locals; %>`.
4. **Icons** — Font Awesome: `<i class="fa-solid ..." aria-hidden="true"></i>`.
5. **React state → vanilla IIFE** — tab switches, modal opens, form toggles wrapped in `<script>(function(){ ... })();</script>` keyed on element ids.
6. **Shared Tailwind tokens** — `bg-primary`, `text-text-secondary`, `border-border-focus`; no raw hex.
7. **Compose, don't fork** — pull every visual primitive from `modules/ui/`, `modules/app/`, `modules/domain/<vertical>/`. Theme files only own layout wiring.
8. **No real data fetching** — themes consume static TS data passed through `res.render()`.

## See also

- Repo conventions: [`/home/kuray/02_EJS_Components/AGENTS.md`](../../AGENTS.md)
- Parity contract & pixel-perfect rule: `../../../00_Config_and_AI_Rules`
