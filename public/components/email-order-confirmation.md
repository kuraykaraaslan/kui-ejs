# OrderConfirmationEmail

- **id:** `email-order-confirmation`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/order/confirmation.ejs`
- **status:** stable
- **since:** 2025-05

Order confirmation receipt. Line items, subtotal/tax/total, and shipping address.

## Design tokens consumed

- `--border`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--secondary`
- `--success`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Order Confirmed

```ejs
// GET /theme/common/email/order/confirmation
res.render('theme/common/email/order/confirmation', {
  layout:    'layouts/blank',
  subject:   'Order confirmed — #' + order.id,
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  order: {
    id:       order.id,
    date:     order.createdAt.toLocaleDateString(),
    items:    order.items,    // [{ name, variant, qty, price }]
    totals:   order.totals,   // { subtotal, discount, tax, shipping, total, currency }
    shipping: order.address,  // { fullName, addressLine1, city, country, postalCode }
    viewUrl:  '/orders/' + order.id,
  },
});
```

## Full EJS source

```ejs
<%
  var o = locals.order || {};
  var totals = o.totals || {};
  var items  = o.items  || [];
  var ship   = o.shipping || {};
  function fmtTRY(n) { return '₺' + (n || 0).toFixed(2); }
%>
<%- include('../_preview-bar', locals) %>

<div class="bg-[#f0f2f5] min-h-screen py-8 px-4">
  <div class="max-w-[600px] mx-auto">

    <!-- Header -->
    <div class="bg-success rounded-t-2xl px-8 py-8 text-center">
      <i class="fa-solid fa-circle-check text-white text-4xl mb-3" aria-hidden="true"></i>
      <p class="text-white font-bold text-xl">Order Confirmed!</p>
      <p class="text-white/80 text-sm mt-1">Order #<%= o.id %></p>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-6">
      <p class="text-text-secondary leading-relaxed">
        Hi <%= toName %>, thank you for your order! We've received it and will start processing shortly. You'll get a shipping notification when it's on its way.
      </p>

      <!-- Items -->
      <div class="space-y-2">
        <p class="text-sm font-semibold text-text-primary">Order Summary</p>
        <div class="rounded-xl border border-border divide-y divide-border">
          <% items.forEach(function(item) { %>
          <div class="flex items-start justify-between px-4 py-3 gap-4">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-text-primary"><%= item.name %></p>
              <% if (item.variant) { %><p class="text-xs text-text-secondary"><%= item.variant %></p><% } %>
              <p class="text-xs text-text-secondary">Qty: <%= item.qty %></p>
            </div>
            <p class="text-sm font-semibold text-text-primary shrink-0"><%= fmtTRY(item.price * item.qty) %></p>
          </div>
          <% }); %>
          <div class="px-4 py-3 space-y-1.5 bg-surface-raised rounded-b-xl">
            <% if (totals.discount > 0) { %>
            <div class="flex justify-between text-xs text-text-secondary">
              <span>Discount</span><span class="text-success">-<%= fmtTRY(totals.discount) %></span>
            </div>
            <% } %>
            <div class="flex justify-between text-xs text-text-secondary">
              <span>Tax</span><span><%= fmtTRY(totals.tax) %></span>
            </div>
            <div class="flex justify-between text-sm font-bold text-text-primary border-t border-border pt-1.5 mt-1">
              <span>Total</span><span><%= fmtTRY(totals.total) %></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Shipping address -->
      <% if (ship.fullName) { %>
      <div class="space-y-1.5">
        <p class="text-sm font-semibold text-text-primary">Shipping To</p>
        <div class="rounded-xl border border-border px-4 py-3 text-sm text-text-secondary leading-relaxed">
          <p class="font-medium text-text-primary"><%= ship.fullName %></p>
          <p><%= ship.addressLine1 %></p>
          <p><%= ship.city %>, <%= ship.postalCode %> — <%= ship.country %></p>
        </div>
      </div>
      <% } %>

      <div class="text-center">
        <a href="<%= o.viewUrl %>"
          class="inline-block bg-primary text-primary-fg font-semibold rounded-xl px-8 py-3 text-sm hover:bg-primary-hover transition-colors">
          View Order Details
        </a>
      </div>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
