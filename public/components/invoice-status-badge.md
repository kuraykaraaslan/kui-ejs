# InvoiceStatusBadge

- **id:** `invoice-status-badge`
- **layer:** domain
- **category:** Domain · Invoice
- **filePath:** `modules/domain/invoice/InvoiceStatusBadge.ejs`
- **status:** stable
- **since:** 2025-05

Invoice lifecycle status badge: Draft, Sent, Paid, Overdue, Partial, Cancelled.

## Design tokens consumed

- `--border`
- `--error`
- `--info`
- `--secondary`
- `--success`
- `--surface-overlay`
- `--surface-sunken`
- `--text-secondary`
- `--warning`

## Variants

### All statuses

```ejs
<%- include('../../../modules/domain/invoice/InvoiceStatusBadge', { status: 'PAID' }) %>
```

## Full EJS source

```ejs
<%
  var _status = (locals.status || 'DRAFT').toUpperCase();
  var _size   = locals.size   || 'md';

  var meta = {
    DRAFT:     { label: 'Draft',     text: 'text-text-secondary', bg: 'bg-surface-overlay', border: 'border-border'       },
    SENT:      { label: 'Sent',      text: 'text-info',           bg: 'bg-info/10',         border: 'border-info/30'      },
    PAID:      { label: 'Paid',      text: 'text-success',        bg: 'bg-success/10',      border: 'border-success/30'   },
    OVERDUE:   { label: 'Overdue',   text: 'text-error',          bg: 'bg-error/10',        border: 'border-error/30'     },
    CANCELLED: { label: 'Cancelled', text: 'text-text-secondary', bg: 'bg-surface-sunken',  border: 'border-border'       },
    PARTIAL:   { label: 'Partial',   text: 'text-warning',        bg: 'bg-warning/10',      border: 'border-warning/30'   },
  };
  var m   = meta[_status] || meta.DRAFT;
  var cls = _size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';
%>
<span class="inline-flex items-center rounded-full border font-semibold <%= cls %> <%= m.text %> <%= m.bg %> <%= m.border %>">
  <%= m.label %>
</span>

```
