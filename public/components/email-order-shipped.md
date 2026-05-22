# OrderShippedEmail

- **id:** `email-order-shipped`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/order/shipped.ejs`
- **status:** stable
- **since:** 2025-05

Shipping notification. Carrier, tracking number, estimated delivery date, and a "Track My Package" CTA.

## Design tokens consumed

- `--border`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--primary-subtle`
- `--secondary`
- `--text-primary`
- `--text-secondary`

## Variants

### Order Shipped

```ejs
// GET /theme/common/email/order/shipped
res.render('theme/common/email/order/shipped', {
  layout:    'layouts/blank',
  subject:   'Your order #' + order.id + ' has shipped!',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  order: {
    id:                order.id,
    carrier:           shipment.carrier,
    trackingNumber:    shipment.trackingNumber,
    trackingUrl:       shipment.trackingUrl,
    estimatedDelivery: shipment.estimatedDelivery,
    items:             order.items,
  },
});
```

## Full EJS source

```ejs
<%
  var o = locals.order || {};
  var items = o.items || [];
%>
<%- include('../_preview-bar', locals) %>

<div class="bg-[#f0f2f5] min-h-screen py-8 px-4">
  <div class="max-w-[600px] mx-auto">

    <!-- Header -->
    <div class="bg-primary rounded-t-2xl px-8 py-8 text-center">
      <i class="fa-solid fa-truck text-primary-fg text-4xl mb-3" aria-hidden="true"></i>
      <p class="text-primary-fg font-bold text-xl">Your order is on its way!</p>
      <p class="text-primary-fg/80 text-sm mt-1">Order #<%= o.id %></p>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-6">
      <p class="text-text-secondary leading-relaxed">
        Hi <%= toName %>, great news — your order has shipped! Use the tracking number below to follow its journey.
      </p>

      <!-- Tracking card -->
      <div class="rounded-xl border border-primary/30 bg-primary-subtle p-5 space-y-3">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-box text-primary" aria-hidden="true"></i>
          <p class="text-sm font-semibold text-text-primary">Tracking Information</p>
        </div>
        <div class="space-y-1.5 text-sm">
          <div class="flex justify-between">
            <span class="text-text-secondary">Carrier</span>
            <span class="font-medium text-text-primary"><%= o.carrier %></span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-secondary">Tracking #</span>
            <span class="font-mono text-xs text-text-primary"><%= o.trackingNumber %></span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-secondary">Estimated delivery</span>
            <span class="font-semibold text-text-primary"><%= o.estimatedDelivery %></span>
          </div>
        </div>
        <a href="<%= o.trackingUrl %>"
          class="block text-center bg-primary text-primary-fg font-semibold rounded-lg px-6 py-2.5 text-sm hover:bg-primary-hover transition-colors">
          Track My Package
        </a>
      </div>

      <!-- Items -->
      <div class="space-y-2">
        <p class="text-sm font-semibold text-text-primary">Items in this shipment</p>
        <div class="rounded-xl border border-border divide-y divide-border">
          <% items.forEach(function(item) { %>
          <div class="flex items-start justify-between px-4 py-3 gap-4">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-text-primary"><%= item.name %></p>
              <% if (item.variant) { %><p class="text-xs text-text-secondary"><%= item.variant %></p><% } %>
            </div>
            <span class="text-xs text-text-secondary shrink-0">×<%= item.qty %></span>
          </div>
          <% }); %>
        </div>
      </div>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
