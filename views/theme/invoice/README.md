# views/theme/invoice — Invoice Theme

Invoice list, detail, and printable views. Composes `modules/domain/invoice/` partials (client info, line items, totals, status & terms badges).

## Files

```
_nav.ejs       _nav-close.ejs
index.ejs      detail.ejs       print.ejs
```

## Parity

**EJS-only, no NextJS counterpart.** This theme lives exclusively in `02_EJS_Components`.

## Conventions

1. **Layout** — `layouts/blank` for `print.ejs` (chrome-free), `layouts/main` or theme-owned shell for `index.ejs` / `detail.ejs`.
2. **Header destructure** — `<% const { invoice, invoices = [], currency = 'USD', ... } = locals; %>` at the top of every view.
3. **Icons** — Font Awesome: `<i class="fa-solid fa-file-invoice-dollar" aria-hidden="true"></i>`.
4. **React state → vanilla IIFE** — print trigger, copy-link, status filter wrapped in scoped `(function(){ ... })()` blocks keyed on element ids.
5. **Shared Tailwind tokens** — status & terms badges use `bg-success` / `bg-warning` / `bg-error` / `bg-info` token families; never raw hex.
6. **Compose** every visual unit from `modules/domain/invoice/` + `modules/ui/`; theme files only own page wiring.
7. **`_nav.ejs` / `_nav-close.ejs`** underscore-prefixed partials are theme-scoped includes (not routes).
8. **Print parity** — `print.ejs` must remain visually identical to `detail.ejs` minus chrome.

## See also

- Repo conventions: [`/home/kuray/02_EJS_Components/AGENTS.md`](../../../AGENTS.md)
- Domain partials consumed: [`/home/kuray/02_EJS_Components/modules/domain/invoice/`](../../../modules/domain/invoice/)
- Parity contract & pixel-perfect rule: `../../../../00_Config_and_AI_Rules`
