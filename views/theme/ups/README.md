# views/theme/ups — UPS Theme

UPS / power-management dashboard demo: status overview, outlets, event log, settings. Composes `modules/domain/ups/` partials (battery bar, load gauge, outlet card, event row).

## Files

```
_nav.ejs       _nav-close.ejs
index.ejs      events.ejs      outlets.ejs     settings.ejs
```

## Parity

**EJS-only, no NextJS counterpart.** This theme lives exclusively in `02_EJS_Components`.

## Conventions

1. **Layout** — `layouts/blank` (theme owns its sidebar + topbar shell).
2. **Header destructure** — `<% const { ups, outlets = [], events = [], ... } = locals; %>` at the top of every view.
3. **Icons** — Font Awesome: `<i class="fa-solid fa-plug" aria-hidden="true"></i>`.
4. **React state → vanilla IIFE** — outlet toggles, polling refresh, gauge animations, log filters wrapped in scoped `(function(){ ... })()` blocks keyed on element ids.
5. **Shared Tailwind tokens** — battery/load/status colors driven by `bg-success` / `bg-warning` / `bg-error`; surfaces from `bg-surface-raised` / `border-border`.
6. **Compose** every visual unit from `modules/domain/ups/` + `modules/ui/`; theme files only own page layout and data wiring.
7. **`_nav.ejs` / `_nav-close.ejs`** underscore-prefixed partials are theme-scoped includes (not routes).
8. **Numeric clamping** — clamp 0–100 server-side before passing to gauges/bars to prevent layout overflow.

## See also

- Repo conventions: [`/home/kuray/02_EJS_Components/AGENTS.md`](../../../AGENTS.md)
- Domain partials consumed: [`/home/kuray/02_EJS_Components/modules/domain/ups/`](../../../modules/domain/ups/)
- Parity contract & pixel-perfect rule: `../../../../00_Config_and_AI_Rules`
