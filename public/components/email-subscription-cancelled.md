# SubscriptionCancelledEmail

- **id:** `email-subscription-cancelled`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/billing/subscription-cancelled.ejs`
- **status:** stable
- **since:** 2025-05

Abonelik iptali. Erişim sona erme tarihi, yeniden aktivasyon CTA ve geri bildirim linki.

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

### Subscription Cancelled

```ejs
// GET /theme/common/email/billing/subscription-cancelled
res.render('theme/common/email/billing/subscription-cancelled', {
  layout:    'layouts/blank',
  subject:   'Your ' + plan.name + ' subscription has been cancelled',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  plan: {
    name:          subscription.planName,
    cancelledAt:   new Date().toLocaleDateString(),
    accessUntil:   subscription.currentPeriodEnd.toLocaleDateString(),
    reactivateUrl: '/account/subscription/reactivate',
    feedbackUrl:   '/feedback/cancellation',
  },
});
```

## Full EJS source

```ejs
<%
  var plan = locals.plan || {};
%>
<%- include('../_preview-bar', locals) %>

<div class="bg-[#f0f2f5] min-h-screen py-8 px-4">
  <div class="max-w-[600px] mx-auto">

    <!-- Header -->
    <div class="bg-surface-sunken rounded-t-2xl px-8 py-8 text-center">
      <i class="fa-solid fa-circle-minus text-text-secondary text-4xl mb-3" aria-hidden="true"></i>
      <p class="text-text-primary font-bold text-xl">Subscription Cancelled</p>
      <p class="text-text-secondary text-sm mt-1"><%= plan.name %></p>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-6">
      <div class="space-y-2">
        <h1 class="text-xl font-bold text-text-primary">We're sorry to see you go</h1>
        <p class="text-text-secondary leading-relaxed text-sm">
          Hi <%= toName %>, your <strong><%= plan.name %></strong> subscription has been successfully cancelled.
        </p>
      </div>

      <!-- Access info -->
      <div class="rounded-xl bg-info/10 border border-info/30 px-4 py-3 flex items-start gap-3">
        <i class="fa-solid fa-circle-info text-info text-sm mt-0.5 shrink-0" aria-hidden="true"></i>
        <p class="text-sm text-text-secondary">
          You'll still have access to all Pro features until <strong class="text-text-primary"><%= plan.accessUntil %></strong>. After that, your account will revert to the Free plan.
        </p>
      </div>

      <!-- Details -->
      <div class="rounded-xl border border-border bg-surface-raised divide-y divide-border text-sm">
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Cancelled on</span>
          <span class="font-medium text-text-primary"><%= plan.cancelledAt %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Access until</span>
          <span class="font-semibold text-text-primary"><%= plan.accessUntil %></span>
        </div>
      </div>

      <!-- Reactivate -->
      <div class="rounded-xl bg-surface-raised border border-border px-5 py-4 text-center space-y-2">
        <p class="text-sm font-semibold text-text-primary">Changed your mind?</p>
        <p class="text-xs text-text-secondary">Reactivate before <%= plan.accessUntil %> and you won't lose any data or settings.</p>
        <a href="<%= plan.reactivateUrl %>"
          class="inline-block bg-primary text-primary-fg font-semibold rounded-xl px-8 py-2.5 text-sm hover:bg-primary-hover transition-colors">
          Reactivate Subscription
        </a>
      </div>

      <p class="text-xs text-text-secondary text-center">
        We'd love to know why you cancelled. <a href="<%= plan.feedbackUrl %>" class="text-primary hover:underline">Share your feedback</a> — it takes 30 seconds.
      </p>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
