# PaymentFailedEmail

- **id:** `email-payment-failed`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/billing/payment-failed.ejs`
- **status:** stable
- **since:** 2025-05

Payment failed notice. Failure reason, retry date, and an update-payment-method CTA.

## Design tokens consumed

- `--border`
- `--error`
- `--primary`
- `--secondary`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`
- `--warning`

## Variants

### Payment Failed

```ejs
// GET /theme/common/email/billing/payment-failed
res.render('theme/common/email/billing/payment-failed', {
  layout:    'layouts/blank',
  subject:   "We couldn't process your payment",
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  payment: {
    amount:      charge.amount,
    currency:    charge.currency,
    attemptedAt: charge.createdAt.toLocaleString(),
    failReason:  charge.failureMessage,
    retryDate:   nextRetry.toLocaleDateString(),
    updateUrl:   '/account/payment-methods',
  },
});
```

## Full EJS source

```ejs
<%
  var payment = locals.payment || {};
  function fmtTRY(n) { return '₺' + (n || 0).toFixed(2); }
%>
<%- include('../_preview-bar', locals) %>

<div class="bg-[#f0f2f5] min-h-screen py-8 px-4">
  <div class="max-w-[600px] mx-auto">

    <!-- Header -->
    <div class="bg-error rounded-t-2xl px-8 py-8 text-center">
      <i class="fa-solid fa-circle-exclamation text-white text-4xl mb-3" aria-hidden="true"></i>
      <p class="text-white font-bold text-xl">Payment Failed</p>
      <p class="text-white/80 text-sm mt-1"><%= fmtTRY(payment.amount) %> could not be processed</p>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-6">
      <div class="space-y-2">
        <h1 class="text-xl font-bold text-text-primary">Action required</h1>
        <p class="text-text-secondary leading-relaxed text-sm">
          Hi <%= toName %>, we were unable to process your payment. Please update your payment method to keep your subscription active.
        </p>
      </div>

      <!-- Details -->
      <div class="rounded-xl border border-border bg-surface-raised divide-y divide-border text-sm">
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Amount</span>
          <span class="font-bold text-error"><%= fmtTRY(payment.amount) %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Attempted on</span>
          <span class="font-medium text-text-primary"><%= payment.attemptedAt %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Failure reason</span>
          <span class="font-medium text-text-primary"><%= payment.failReason %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Next retry</span>
          <span class="font-semibold text-text-primary"><%= payment.retryDate %></span>
        </div>
      </div>

      <!-- Warning -->
      <div class="rounded-lg bg-warning/10 border border-warning/30 px-4 py-3 flex items-start gap-3">
        <i class="fa-solid fa-clock text-warning text-sm mt-0.5 shrink-0" aria-hidden="true"></i>
        <p class="text-sm text-text-secondary">
          If payment isn't resolved by <strong class="text-text-primary"><%= payment.retryDate %></strong>, your subscription will be paused.
        </p>
      </div>

      <div class="text-center">
        <a href="<%= payment.updateUrl %>"
          class="inline-block bg-error text-white font-semibold rounded-xl px-8 py-3.5 text-sm hover:opacity-90 transition-opacity">
          Update Payment Method
        </a>
      </div>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
