# modules/domain/invoice — Invoice & Billing

EJS partials for invoice generation, line items, totals, payment terms, and printable views.

## Files

```
ClientInfoBlock.ejs    InvoiceLineItem.ejs     InvoiceNotes.ejs
InvoiceStatusBadge.ejs InvoiceTotals.ejs       PaymentTermsBadge.ejs
```

## Parity

**EJS-only, no NextJS counterpart.** This vertical lives exclusively in `02_EJS_Components`.

## Conventions

1. **Header destructure** — `<% const { invoice, currency = 'USD', ... } = locals; %>`.
2. **Icons** — Font Awesome: `<i class="fa-solid fa-file-invoice" aria-hidden="true"></i>`.
3. **Vanilla-JS IIFE** — print triggers, copy actions, and totals recalculation wrapped in scoped `(function(){ ... })()` blocks.
4. **Shared Tailwind tokens** — `InvoiceStatusBadge` and `PaymentTermsBadge` map to `bg-success` / `bg-warning` / `bg-error` / `bg-info` token families; never raw hex.
5. **Numbers & money** — format via shared helpers; never inline `toFixed(2)` without currency context. Use `<%= %>` (escaped) for all values.
6. **Print parity** — `print.ejs` consumer must remain visually identical to the on-screen `detail.ejs` minus chrome.

## See also

- Repo conventions: [`/home/kuray/02_EJS_Components/AGENTS.md`](../../../AGENTS.md)
- Theme pages that consume these: [`/home/kuray/02_EJS_Components/views/theme/invoice/`](../../../views/theme/invoice/)
- Parity contract & pixel-perfect rule: `../../../../00_Config_and_AI_Rules`
