# modules/domain/modem — Modem / Router Management

EJS partials for a residential-gateway admin UI: WAN/WiFi status, connected devices, port forwarding, QoS, parental controls, VPN, system info.

## Files

```
AlertItem.ejs              ConnectedDeviceRow.ejs   ConnectionStatusBadge.ejs
ParentalProfileCard.ejs    PortForwardRow.ejs       QosDeviceRuleRow.ejs
SystemStatusCard.ejs       VpnInstanceCard.ejs      WanStatusCard.ejs
WifiNetworkCard.ejs        types.ts
```

## Parity

**EJS-only, no NextJS counterpart.** This vertical lives exclusively in `02_EJS_Components`.

## Conventions

1. **Header destructure** — `<% const { device, status = 'online', ... } = locals; %>`.
2. **Icons** — Font Awesome: `<i class="fa-solid fa-wifi" aria-hidden="true"></i>`.
3. **Vanilla-JS IIFE** — toggles, refresh buttons, modal openers wrapped in scoped `(function(){ ... })()` blocks keyed on element ids.
4. **Shared Tailwind tokens** — connection state uses `bg-success` / `bg-warning` / `bg-error`; surfaces use `bg-surface-raised` / `border-border`.
5. **Types** — `types.ts` defines the TypeScript shapes for modem entities used by `src/data/modem.data.ts` and `views/theme/modem/`.

## See also

- Repo conventions: [`/home/kuray/02_EJS_Components/AGENTS.md`](../../../AGENTS.md)
- Theme pages that consume these: [`/home/kuray/02_EJS_Components/views/theme/modem/`](../../../views/theme/modem/)
- Parity contract & pixel-perfect rule: `../../../../00_Config_and_AI_Rules`
