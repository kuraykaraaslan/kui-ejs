# OrderDeliveredEmail

- **id:** `email-order-delivered`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/order/delivered.ejs`
- **status:** stable
- **since:** 2025-05

Teslimat onayı. Yıldız derecelendirme butonları ile yorum isteği CTA.

## Design tokens consumed

- `--border`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--secondary`
- `--success`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Order Delivered

```ejs
// GET /theme/common/email/order/delivered
res.render('theme/common/email/order/delivered', {
  layout:    'layouts/blank',
  subject:   'Your order has been delivered!',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  order: {
    id:          order.id,
    deliveredAt: delivery.timestamp.toLocaleString(),
    items:       order.items,
    reviewUrl:   '/orders/' + order.id + '/review',
    viewUrl:     '/orders/' + order.id,
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
    <div class="bg-success rounded-t-2xl px-8 py-8 text-center">
      <i class="fa-solid fa-house text-white text-4xl mb-3" aria-hidden="true"></i>
      <p class="text-white font-bold text-xl">Delivered!</p>
      <p class="text-white/80 text-sm mt-1">Order #<%= o.id %></p>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-6">
      <div class="space-y-2">
        <h1 class="text-xl font-bold text-text-primary">Your order has arrived</h1>
        <p class="text-text-secondary leading-relaxed">
          Hi <%= toName %>, your package was delivered on <strong><%= o.deliveredAt %></strong>. We hope everything looks great!
        </p>
      </div>

      <!-- Items delivered -->
      <div class="rounded-xl border border-border divide-y divide-border">
        <% items.forEach(function(item) { %>
        <div class="flex items-start justify-between px-4 py-3 gap-4">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <i class="fa-solid fa-circle-check text-success text-sm shrink-0" aria-hidden="true"></i>
            <div class="min-w-0">
              <p class="text-sm font-medium text-text-primary"><%= item.name %></p>
              <% if (item.variant) { %><p class="text-xs text-text-secondary"><%= item.variant %></p><% } %>
            </div>
          </div>
        </div>
        <% }); %>
      </div>

      <!-- Review request -->
      <div class="rounded-xl bg-surface-raised border border-border px-5 py-4 space-y-3 text-center">
        <p class="text-sm font-semibold text-text-primary">How was your experience?</p>
        <p class="text-xs text-text-secondary">Your feedback helps us improve and helps other customers make informed decisions.</p>
        <div class="flex justify-center gap-2">
          <% ['⭐⭐⭐⭐⭐','⭐⭐⭐⭐','⭐⭐⭐'].forEach(function(stars) { %>
          <a href="<%= o.reviewUrl %>" class="rounded-lg border border-border bg-white px-4 py-2 text-sm hover:border-primary hover:shadow-sm transition-all">
            <%= stars %>
          </a>
          <% }); %>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <a href="<%= o.reviewUrl %>"
          class="flex-1 text-center bg-primary text-primary-fg font-semibold rounded-xl px-6 py-3 text-sm hover:bg-primary-hover transition-colors">
          Write a Review
        </a>
        <a href="<%= o.viewUrl %>"
          class="flex-1 text-center border border-border text-text-primary font-semibold rounded-xl px-6 py-3 text-sm hover:bg-surface-overlay transition-colors">
          View Order
        </a>
      </div>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
