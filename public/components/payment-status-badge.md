# PaymentStatusBadge

- **id:** `payment-status-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/payment/PaymentStatusBadge.ejs`
- **status:** stable
- **since:** 2025-03

PENDING / AUTHORIZED / PAID / FAILED / CANCELLED / REFUNDED ödeme durumları için renk kodlu rozet.

## Variants

### All statuses

```ejs
<%- include('modules/domain/common/payment/PaymentStatusBadge', { status: 'PAID' }) %>
<%- include('modules/domain/common/payment/PaymentStatusBadge', { status: 'PENDING' }) %>
```

### With dot, large

```ejs
<%- include('modules/domain/common/payment/PaymentStatusBadge', { status: 'PENDING', dot: true, size: 'lg' }) %>
<%- include('modules/domain/common/payment/PaymentStatusBadge', { status: 'PAID',    dot: true, size: 'lg' }) %>
<%- include('modules/domain/common/payment/PaymentStatusBadge', { status: 'FAILED',  dot: true, size: 'lg' }) %>
```

## Full EJS source

```ejs
<%
  var _status = (locals.status || '').toUpperCase();
  var _size   = locals.size || 'md';
  var _dot    = !!locals.dot;

  var statusMeta = {
    PENDING:    { children: 'Pending',    variant: 'warning' },
    AUTHORIZED: { children: 'Authorized', variant: 'info' },
    PAID:       { children: 'Paid',       variant: 'success' },
    FAILED:     { children: 'Failed',     variant: 'error' },
    CANCELLED:  { children: 'Cancelled',  variant: 'neutral' },
    REFUNDED:   { children: 'Refunded',   variant: 'info' },
  };
  var meta = statusMeta[_status] || { children: locals.status || _status, variant: 'neutral' };
%>
<%- include('../../../ui/Badge', {
  variant:  meta.variant,
  size:     _size,
  dot:      _dot,
  children: meta.children
}) %>

```
