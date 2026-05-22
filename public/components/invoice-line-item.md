# InvoiceLineItem

- **id:** `invoice-line-item`
- **layer:** domain
- **category:** Domain · Invoice
- **filePath:** `modules/domain/invoice/InvoiceLineItem.ejs`
- **status:** stable
- **since:** 2025-05

Table row for a single invoice line item with description, quantity, unit price, and total.

## Design tokens consumed

- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Line items table

```ejs
<% lineItems.forEach(function(item, i) { %>
<%- include('../../../modules/domain/invoice/InvoiceLineItem', { item: item, index: i, currency: 'TRY' }) %>
<% }); %>
```

## Full EJS source

```ejs
<%
  var _item     = locals.item     || {};
  var _currency = locals.currency || 'TRY';
  var _index    = locals.index    || 0;
  var _isEven   = _index % 2 === 0;
  var symbol    = _currency === 'TRY' ? '₺' : _currency === 'USD' ? '$' : _currency === 'EUR' ? '€' : _currency;
%>
<tr class="<%= _isEven ? 'bg-surface-base' : 'bg-surface-raised' %>">
  <td class="px-4 py-2.5 text-xs text-text-secondary w-8"><%= _index + 1 %></td>
  <td class="px-4 py-2.5 text-sm text-text-primary"><%= _item.description || '—' %></td>
  <% if (_item.unit) { %>
  <td class="px-4 py-2.5 text-xs text-text-secondary text-center"><%= _item.unit %></td>
  <% } %>
  <td class="px-4 py-2.5 text-sm text-text-primary text-center"><%= _item.quantity || 1 %></td>
  <td class="px-4 py-2.5 text-sm text-text-primary text-right font-mono"><%= symbol %><%= (_item.unitPrice || 0).toLocaleString('tr-TR') %></td>
  <td class="px-4 py-2.5 text-sm font-semibold text-text-primary text-right font-mono"><%= symbol %><%= (_item.total || 0).toLocaleString('tr-TR') %></td>
</tr>

```
