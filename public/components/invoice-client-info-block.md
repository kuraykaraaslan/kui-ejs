# ClientInfoBlock

- **id:** `invoice-client-info-block`
- **layer:** domain
- **category:** Domain · Invoice
- **filePath:** `modules/domain/invoice/ClientInfoBlock.ejs`
- **status:** stable

Address block component for BILL TO / SHIP TO / FROM sections in an invoice.

## Design tokens consumed

- `--primary`
- `--secondary`
- `--text-primary`
- `--text-secondary`

## Variants

### Bill To block

```ejs
<%- include('../../../modules/domain/invoice/ClientInfoBlock', { type: 'BILL_TO', entity: client }) %>
```

## Full EJS source

```ejs
<%
  var _type   = locals.type   || 'BILL_TO';
  var _entity = locals.entity || {};

  var typeLabels = {
    BILL_TO:  'Bill To',
    SHIP_TO:  'Ship To',
    FROM:     'From',
  };
  var label = typeLabels[_type] || _type;
%>
<div class="space-y-1">
  <p class="text-xs font-semibold text-text-secondary uppercase tracking-widest"><%= label %></p>
  <p class="text-sm font-bold text-text-primary"><%= _entity.name || '—' %></p>
  <% if (_entity.address) { %>
  <p class="text-xs text-text-secondary"><%= _entity.address %></p>
  <% } %>
  <% if (_entity.city) { %>
  <p class="text-xs text-text-secondary"><%= _entity.city %></p>
  <% } %>
  <% if (_entity.country) { %>
  <p class="text-xs text-text-secondary"><%= _entity.country %></p>
  <% } %>
  <% if (_entity.taxId) { %>
  <p class="text-xs text-text-secondary font-mono">Tax ID: <%= _entity.taxId %></p>
  <% } %>
  <% if (_entity.email) { %>
  <p class="text-xs text-text-secondary"><%= _entity.email %></p>
  <% } %>
  <% if (_entity.phone) { %>
  <p class="text-xs text-text-secondary"><%= _entity.phone %></p>
  <% } %>
</div>

```
