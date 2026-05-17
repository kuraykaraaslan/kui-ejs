# OrderTotalsCard

- **id:** `order-totals-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/money/OrderTotalsCard.ejs`
- **status:** stable
- **since:** 0.1

Sipariş özet kartı: ara toplam, indirim, vergi, kargo ve kalın Total satırı. Sıfır değerli satırlar gizlenir.

## Design tokens consumed

- `--border`
- `--primary`
- `--secondary`
- `--success`
- `--success-fg`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### No extras

```ejs
<%- include('modules/domain/common/money/OrderTotalsCard', {
  totals: { subtotal: 89.99, total: 89.99, currency: 'USD' },
  locale: 'en-US'
}) %>
```

### With discount, tax & shipping

```ejs
<%- include('modules/domain/common/money/OrderTotalsCard', {
  totals: { subtotal: 149.99, discountTotal: 20, taxTotal: 11.99, shippingTotal: 9.99, total: 153.96, currency: 'USD' },
  locale: 'en-US'
}) %>
```

## Full EJS source

```ejs
<%
  var _totals  = locals.totals  || {};
  var _locale  = locals.locale  || 'tr-TR';
  var _currency = _totals.currency || locals.currency || 'TRY';

  function fmt(amount) {
    return Math.abs(amount).toLocaleString(_locale, { style: 'currency', currency: _currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  var lines = [];
  lines.push({ label: 'Subtotal', amount: _totals.subtotal || 0 });
  if (_totals.discountTotal && _totals.discountTotal > 0) lines.push({ label: 'Discount',    amount: -_totals.discountTotal, isDiscount: true });
  if (_totals.taxTotal      && _totals.taxTotal      > 0) lines.push({ label: 'Tax',         amount: _totals.taxTotal });
  if (_totals.serviceFee    && _totals.serviceFee    > 0) lines.push({ label: 'Service Fee', amount: _totals.serviceFee });
  if (_totals.shippingTotal && _totals.shippingTotal > 0) lines.push({ label: 'Shipping',    amount: _totals.shippingTotal });
%>
<div class="rounded-lg border border-border bg-surface-raised p-4 space-y-2<%= locals.className ? ' ' + locals.className : '' %>">
  <% lines.forEach(function(line) { %>
  <div class="flex items-center justify-between text-sm">
    <span class="text-text-secondary"><%= line.label %></span>
    <span class="tabular-nums<%= line.isDiscount ? ' text-success-fg' : ' text-text-primary' %>">
      <%= line.isDiscount ? '−' : '' %><%= fmt(line.amount) %>
    </span>
  </div>
  <% }); %>

  <div class="flex items-center justify-between pt-3 border-t border-border">
    <span class="text-sm font-semibold text-text-primary">Total</span>
    <span class="tabular-nums text-xl font-semibold text-text-primary"><%= fmt(_totals.total || 0) %></span>
  </div>
</div>

```
