# views/theme/modem — Modem / Router Admin Theme

Multi-page residential-gateway admin UI demo: WAN/WiFi status, connected devices, firewall, NAT, parental controls, QoS, VPN, system info. Composes `modules/domain/modem/`.

## Files

```
_nav.ejs       _nav-close.ejs
index.ejs      advanced.ejs    devices.ejs    firewall.ejs
nat.ejs        network.ejs     network/       parental.ejs
qos.ejs        settings.ejs    system.ejs     vpn.ejs
wifi.ejs
```

## Parity

**EJS-only, no NextJS counterpart.** This theme lives exclusively in `02_EJS_Components`.

## Conventions

1. **Layout** — `layouts/blank` (theme owns its sidebar + topbar shell).
2. **Header destructure** — `<% const { device, wan, wifi, ... } = locals; %>` at the top of every view.
3. **Icons** — Font Awesome: `<i class="fa-solid fa-wifi" aria-hidden="true"></i>`.
4. **React state → vanilla IIFE** — interface toggles, refresh polling, modal openers wrapped in scoped `(function(){ ... })()` blocks keyed on element ids.
5. **Shared Tailwind tokens** — connection/health colors driven by `bg-success` / `bg-warning` / `bg-error`; surfaces from `bg-surface-raised` / `border-border`.
6. **Compose** every visual unit from `modules/domain/modem/` + `modules/ui/`; theme files only own page layout and data wiring.
7. **`_nav.ejs` / `_nav-close.ejs`** underscore-prefixed partials are theme-scoped includes (not routes).

## See also

- Repo conventions: [`/home/kuray/02_EJS_Components/AGENTS.md`](../../../AGENTS.md)
- Domain partials consumed: [`/home/kuray/02_EJS_Components/modules/domain/modem/`](../../../modules/domain/modem/)
- Parity contract & pixel-perfect rule: `../../../../00_Config_and_AI_Rules`
