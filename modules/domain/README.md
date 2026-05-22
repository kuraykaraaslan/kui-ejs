# modules/domain — Industry Verticals

Domain-specific EJS partials composing `modules/ui/` + `modules/app/` for real-world use cases. Each vertical is a sub-directory with its own partials (and optionally a `types.ts`).

## Verticals

```
api-doc/    — OpenAPI / REST documentation primitives
common/     — Cross-domain partials (auth, cart, user, payment, ...)
invoice/    — Invoice & billing line items (EJS-only)
modem/      — Router / modem management UI (EJS-only)
ups/        — UPS / power-management UI (EJS-only)
```

See each vertical's README for its full file list and parity status.

## Parity

Mixed:

- `api-doc/`, `common/` — shared with NextJS at `/home/kuray/01_NextJS_Components/modules/domains/<vertical>/`. Keep parity (naming, props, DOM).
- `invoice/`, `modem/`, `ups/` — **EJS-only, no NextJS counterpart**. These are demos that exist solely in this repo.

## Conventions

1. **Header destructure** — `<% const { invoice, status, ... } = locals; %>` at the top.
2. **Icons** — Font Awesome via `<i class="fa-solid ..." aria-hidden="true"></i>`. No SVG, no Lucide/Heroicons.
3. **Vanilla-JS IIFE** — any React `useState`/effect from the NextJS counterpart becomes an IIFE scoped by a unique element id.
4. **Shared Tailwind tokens** — `bg-primary`, `text-text-secondary`, `border-border-focus`, etc.; never raw hex.
5. **Compose, don't fork** — pull `Card`, `Badge`, `Button`, etc. from `modules/ui/` instead of inlining markup.
6. **Types** — Zod-like TypeScript types belong in `types.ts` next to the partials (see `modem/types.ts`).

## See also

- Repo conventions: [`/home/kuray/02_EJS_Components/AGENTS.md`](../../AGENTS.md)
- Parity contract & pixel-perfect rule: `../../../00_Config_and_AI_Rules`
