# modules/domain/ups — UPS / Power Management

EJS partials for an uninterruptible power supply admin UI: battery level, load gauge, outlets, event log, status badges.

## Files

```
BatteryLevelBar.ejs    EventLogRow.ejs     OutletCard.ejs
PowerLoadGauge.ejs     UpsInfoCard.ejs     UpsStatusBadge.ejs
```

## Parity

**EJS-only, no NextJS counterpart.** This vertical lives exclusively in `02_EJS_Components`.

## Conventions

1. **Header destructure** — `<% const { ups, outlet, level = 0, ... } = locals; %>`.
2. **Icons** — Font Awesome: `<i class="fa-solid fa-battery-three-quarters" aria-hidden="true"></i>`.
3. **Vanilla-JS IIFE** — outlet toggles, refresh polling, and gauge animations wrapped in scoped `(function(){ ... })()` blocks keyed on element ids.
4. **Shared Tailwind tokens** — battery / load / status colors driven by `bg-success` / `bg-warning` / `bg-error`; never raw hex.
5. **Numeric clamping** — gauges and bars must clamp 0–100 server-side before render to avoid layout overflow.

## See also

- Repo conventions: [`/home/kuray/02_EJS_Components/AGENTS.md`](../../../AGENTS.md)
- Theme pages that consume these: [`/home/kuray/02_EJS_Components/views/theme/ups/`](../../../views/theme/ups/)
- Parity contract & pixel-perfect rule: `../../../../00_Config_and_AI_Rules`
