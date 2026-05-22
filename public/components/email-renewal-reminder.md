# RenewalReminderEmail

- **id:** `email-renewal-reminder`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/billing/renewal-reminder.ejs`
- **status:** stable
- **since:** 2025-05

7-day advance renewal reminder. Payment method, amount, and manage/cancel links.

## Design tokens consumed

- `--border`
- `--info`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--secondary`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Renewal Reminder

```ejs
// GET /theme/common/email/billing/renewal-reminder
res.render('theme/common/email/billing/renewal-reminder', {
  layout:    'layouts/blank',
  subject:   'Your ' + plan.name + ' renews in 7 days',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  plan: {
    name:          subscription.planName,
    renewalDate:   subscription.nextBillingDate.toLocaleDateString(),
    amount:        subscription.amount,
    currency:      subscription.currency,
    paymentMethod: paymentMethod.display,
    manageUrl:     '/account/subscription',
    cancelUrl:     '/account/subscription/cancel',
  },
});
```

## Full EJS source

```ejs
<%
  var plan = locals.plan || {};
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
      <!-- Reminder banner -->
      <div class="rounded-xl bg-info/10 border border-info/30 px-4 py-3 flex items-center gap-3">
        <i class="fa-solid fa-bell text-info text-lg shrink-0" aria-hidden="true"></i>
        <p class="text-sm font-semibold text-text-primary">Your subscription renews in 7 days</p>
      </div>

      <div class="space-y-2">
        <h1 class="text-xl font-bold text-text-primary">Renewal Reminder</h1>
        <p class="text-text-secondary leading-relaxed text-sm">
          Hi <%= toName %>, this is a friendly reminder that your <strong><%= plan.name %></strong> subscription is scheduled to renew automatically.
        </p>
      </div>

      <!-- Details -->
      <div class="rounded-xl border border-border bg-surface-raised divide-y divide-border text-sm">
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Plan</span>
          <span class="font-medium text-text-primary"><%= plan.name %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Renewal date</span>
          <span class="font-semibold text-text-primary"><%= plan.renewalDate %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Amount</span>
          <span class="font-bold text-text-primary"><%= fmtTRY(plan.amount) %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Payment method</span>
          <span class="font-medium text-text-primary"><%= plan.paymentMethod %></span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <a href="<%= plan.manageUrl %>"
          class="flex-1 text-center bg-primary text-primary-fg font-semibold rounded-xl px-6 py-3 text-sm hover:bg-primary-hover transition-colors">
          Manage Subscription
        </a>
        <a href="<%= plan.cancelUrl %>"
          class="flex-1 text-center border border-border text-text-secondary font-medium rounded-xl px-6 py-3 text-sm hover:bg-surface-overlay transition-colors">
          Cancel
        </a>
      </div>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
