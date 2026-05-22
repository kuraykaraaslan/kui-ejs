# OrderCancelledEmail

- **id:** `email-order-cancelled`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/order/cancelled.ejs`
- **status:** stable
- **since:** 2025-05

Order cancellation notice. Cancellation reason, struck-through items, and refund window.

## Design tokens consumed

- `--border`
- `--info`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--secondary`
- `--surface-raised`
- `--surface-sunken`
- `--text-primary`
- `--text-secondary`

## Variants

### Order Cancelled

```ejs
// GET /theme/common/email/order/cancelled
res.render('theme/common/email/order/cancelled', {
  layout:    'layouts/blank',
  subject:   'Your order #' + order.id + ' has been cancelled',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  order: {
    id:           order.id,
    reason:       cancellation.reason,
    items:        order.items,
    refundAmount: order.total,
    refundDays:   '3–5 business days',
    currency:     order.currency,
    shopUrl:      '/shop',
  },
});
```

## Full EJS source

```ejs
<%
  var o = locals.order || {};
  var items = o.items || [];
  function fmtTRY(n) { return '₺' + (n || 0).toFixed(2); }
%>
<%- include('../_preview-bar', locals) %>

<div class="bg-[#f0f2f5] min-h-screen py-8 px-4">
  <div class="max-w-[600px] mx-auto">

    <!-- Header -->
    <div class="bg-surface-sunken rounded-t-2xl px-8 py-8 text-center">
      <i class="fa-solid fa-xmark text-text-secondary text-4xl mb-3" aria-hidden="true"></i>
      <p class="text-text-primary font-bold text-xl">Order Cancelled</p>
      <p class="text-text-secondary text-sm mt-1">Order #<%= o.id %></p>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-6">
      <div class="space-y-2">
        <h1 class="text-xl font-bold text-text-primary">Hi <%= toName %>,</h1>
        <p class="text-text-secondary leading-relaxed">
          Your order has been cancelled. Here are the details:
        </p>
      </div>

      <!-- Reason -->
      <div class="rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm">
        <span class="text-text-secondary">Cancellation reason: </span>
        <span class="font-medium text-text-primary"><%= o.reason %></span>
      </div>

      <!-- Items -->
      <div class="rounded-xl border border-border divide-y divide-border">
        <% items.forEach(function(item) { %>
        <div class="flex items-start justify-between px-4 py-3 gap-4">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-text-primary line-through text-text-secondary"><%= item.name %></p>
            <% if (item.variant) { %><p class="text-xs text-text-secondary"><%= item.variant %></p><% } %>
          </div>
          <span class="text-xs text-text-secondary shrink-0">×<%= item.qty %></span>
        </div>
        <% }); %>
      </div>

      <!-- Refund info -->
      <div class="rounded-xl bg-info/10 border border-info/30 px-4 py-3 flex items-start gap-3">
        <i class="fa-solid fa-rotate-left text-info text-sm mt-0.5 shrink-0" aria-hidden="true"></i>
        <p class="text-sm text-text-secondary">
          A full refund of <strong class="text-text-primary"><%= fmtTRY(o.refundAmount) %></strong> will be returned to your original payment method within <strong><%= o.refundDays %></strong>.
        </p>
      </div>

      <div class="text-center">
        <a href="<%= o.shopUrl %>"
          class="inline-block bg-primary text-primary-fg font-semibold rounded-xl px-8 py-3 text-sm hover:bg-primary-hover transition-colors">
          Continue Shopping
        </a>
      </div>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
