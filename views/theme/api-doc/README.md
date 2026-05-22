# views/theme/api-doc — API Documentation Theme

Single-page OpenAPI-style API reference demo composed of `modules/domain/api-doc/` partials (tag sections, operation panels, schema viewers, code samples).

## Files

```
_nav.ejs
index.ejs
```

## Parity

Shared with NextJS: yes — counterpart is `/home/kuray/01_NextJS_Components/app/theme/api-doc/`. Page layout, side-nav, and rendered DOM must remain in sync.

## Conventions

1. **Layout** — `layouts/blank` (theme owns its own header / side-nav).
2. **Header destructure** — `<% const { spec, tags = [], servers = [], ... } = locals; %>`.
3. **Icons** — Font Awesome: `<i class="fa-solid fa-code" aria-hidden="true"></i>`.
4. **React state → vanilla IIFE** — expand/collapse, server switching, copy-to-clipboard, language tabs wrapped in scoped `(function(){ ... })()` blocks.
5. **Shared Tailwind tokens** — HTTP methods use `bg-success` / `bg-info` / `bg-warning` / `bg-error` token families; never raw hex.
6. **Compose** primitives from `modules/domain/api-doc/`; do not inline endpoint markup.
7. **`_nav.ejs`** underscore-prefixed partial is a theme-scoped include (not a route).

## See also

- Repo conventions: [`/home/kuray/02_EJS_Components/AGENTS.md`](../../../AGENTS.md)
- Domain partials consumed: [`/home/kuray/02_EJS_Components/modules/domain/api-doc/`](../../../modules/domain/api-doc/)
- Parity contract & pixel-perfect rule: `../../../../00_Config_and_AI_Rules`
