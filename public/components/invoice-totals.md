# InvoiceTotals

- **id:** `invoice-totals`
- **layer:** domain
- **category:** Domain · Invoice
- **filePath:** `modules/domain/invoice/InvoiceTotals.ejs`
- **status:** stable
- **since:** 0.1

Invoice totals block: subtotal, discount, VAT, total, paid amount, and balance due.

## Design tokens consumed

- `--border`
- `--error`
- `--primary`
- `--secondary`
- `--success`
- `--text-primary`
- `--text-secondary`

## Variants

### Full totals

```ejs
<%- include('../../../modules/domain/invoice/InvoiceTotals', { subtotal: inv.subtotal, taxRate: inv.taxRate, taxAmount: inv.taxAmount, discount: inv.discount, total: inv.total, currency: 'TRY' }) %>
```

## Full EJS source

```ejs
<%
  var _subtotal  = locals.subtotal  || 0;
  var _taxRate   = locals.taxRate   || 0;
  var _taxAmount = locals.taxAmount || 0;
  var _discount  = locals.discount  || 0;
  var _total     = locals.total     || 0;
  var _paid      = locals.paid      || 0;
  var _balance   = locals.balance   !== undefined ? locals.balance : _total - _paid;
  var _currency  = locals.currency  || 'TRY';
  var symbol     = _currency === 'TRY' ? '₺' : _currency === 'USD' ? '$' : _currency === 'EUR' ? '€' : _currency;

  function fmt(n) { return symbol + n.toLocaleString('tr-TR'); }
%>
<div class="flex flex-col gap-0 min-w-56">
  <div class="flex justify-between py-2 border-b border-border text-sm">
    <span class="text-text-secondary">Subtotal</span>
    <span class="font-mono text-text-primary"><%= fmt(_subtotal) %></span>
  </div>
  <% if (_discount > 0) { %>
  <div class="flex justify-between py-2 border-b border-border text-sm">
    <span class="text-text-secondary">Discount</span>
    <span class="font-mono text-success">−<%= fmt(_discount) %></span>
  </div>
  <% } %>
  <div class="flex justify-between py-2 border-b border-border text-sm">
    <span class="text-text-secondary">VAT (<%= _taxRate %>%)</span>
    <span class="font-mono text-text-primary"><%= fmt(_taxAmount) %></span>
  </div>
  <div class="flex justify-between py-3 border-b-2 border-border text-base font-bold">
    <span class="text-text-primary">Total</span>
    <span class="font-mono text-text-primary"><%= fmt(_total) %></span>
  </div>
  <% if (_paid > 0) { %>
  <div class="flex justify-between py-2 border-b border-border text-sm">
    <span class="text-text-secondary">Paid</span>
    <span class="font-mono text-success">−<%= fmt(_paid) %></span>
  </div>
  <div class="flex justify-between py-2 text-sm font-semibold">
    <span class="<%= _balance > 0 ? 'text-error' : 'text-success' %>">Balance Due</span>
    <span class="font-mono <%= _balance > 0 ? 'text-error' : 'text-success' %>"><%= fmt(_balance) %></span>
  </div>
  <% } %>
</div>

```
