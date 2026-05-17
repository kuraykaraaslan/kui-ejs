# RefundEmail

- **id:** `email-refund`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/order/refund.ejs`
- **status:** stable
- **since:** 0.1

İade işlendi bildirimi. Tutar hero, iade yöntemi ve tahmini varış süresi.

## Design tokens consumed

- `--border`
- `--primary`
- `--primary-fg`
- `--secondary`
- `--success`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Refund Processed

```ejs
// GET /theme/common/email/order/refund
res.render('theme/common/email/order/refund', {
  layout:    'layouts/blank',
  subject:   'Your refund of ₺' + refund.amount + ' has been processed',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  refund: {
    id:          refund.id,
    orderId:     order.id,
    amount:      refund.amount,
    currency:    refund.currency,
    method:      paymentMethod.display,  // 'Visa ••••4242'
    processedAt: new Date().toLocaleDateString(),
    arrivalDays: '3–5 business days',
    viewUrl:     '/orders/' + order.id,
  },
});
```

## Full EJS source

```ejs
<%
  var r = locals.refund || {};
  function fmtTRY(n) { return '₺' + (n || 0).toFixed(2); }
%>
<%- include('../_preview-bar', locals) %>

<div class="bg-[#f0f2f5] min-h-screen py-8 px-4">
  <div class="max-w-[600px] mx-auto">

    <!-- Header -->
    <div class="bg-primary rounded-t-2xl px-8 py-8 text-center">
      <div class="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-white/20 mb-4">
        <span class="text-primary-fg font-bold text-xl">A</span>
      </div>
      <p class="text-primary-fg font-semibold text-xl"><%= company.name %></p>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-6">
      <!-- Amount hero -->
      <div class="rounded-xl bg-success/10 border border-success/30 px-6 py-5 text-center space-y-1">
        <i class="fa-solid fa-rotate-left text-success text-2xl" aria-hidden="true"></i>
        <p class="text-3xl font-bold text-text-primary"><%= fmtTRY(r.amount) %></p>
        <p class="text-sm text-text-secondary">Refund processed</p>
      </div>

      <div class="space-y-1">
        <p class="text-sm text-text-secondary">Hi <%= toName %>,</p>
        <p class="text-text-secondary leading-relaxed text-sm">
          Your refund has been successfully processed. Here are the details:
        </p>
      </div>

      <!-- Details -->
      <div class="rounded-xl border border-border bg-surface-raised divide-y divide-border text-sm">
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Refund ID</span>
          <span class="font-mono text-xs text-text-primary"><%= r.id %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Original order</span>
          <span class="font-medium text-text-primary"><%= r.orderId %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Refunded to</span>
          <span class="font-medium text-text-primary"><%= r.method %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Processed on</span>
          <span class="font-medium text-text-primary"><%= r.processedAt %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Expected arrival</span>
          <span class="font-semibold text-text-primary"><%= r.arrivalDays %></span>
        </div>
      </div>

      <div class="text-center">
        <a href="<%= r.viewUrl %>"
          class="inline-block border border-border text-text-primary font-semibold rounded-xl px-8 py-3 text-sm hover:bg-surface-overlay transition-colors">
          View Order
        </a>
      </div>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
