# SubscriptionActivatedEmail

- **id:** `email-subscription-activated`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/billing/subscription-activated.ejs`
- **status:** stable
- **since:** 2025-05

Plan activation confirmation. Feature list, price, and next billing date.

## Design tokens consumed

- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--primary-subtle`
- `--secondary`
- `--success`
- `--text-primary`
- `--text-secondary`

## Variants

### Subscription Activated

```ejs
// GET /theme/common/email/billing/subscription-activated
res.render('theme/common/email/billing/subscription-activated', {
  layout:    'layouts/blank',
  subject:   'Your ' + plan.name + ' subscription is now active!',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  plan: {
    name:            plan.name,
    price:           plan.price,
    currency:        plan.currency,
    interval:        plan.billingInterval,  // 'month' | 'year'
    nextBillingDate: subscription.nextBillingDate.toLocaleDateString(),
    features:        plan.features,
    manageUrl:       '/account/subscription',
  },
});
```

## Full EJS source

```ejs
<%
  var plan = locals.plan || {};
  var features = plan.features || [];
  function fmtTRY(n) { return '₺' + (n || 0).toFixed(2); }
%>
<%- include('../_preview-bar', locals) %>

<div class="bg-[#f0f2f5] min-h-screen py-8 px-4">
  <div class="max-w-[600px] mx-auto">

    <!-- Header -->
    <div class="bg-primary rounded-t-2xl px-8 py-8 text-center">
      <i class="fa-solid fa-sparkles text-primary-fg text-4xl mb-3" aria-hidden="true"></i>
      <p class="text-primary-fg font-bold text-xl">You're on <%= plan.name %>!</p>
      <p class="text-primary-fg/80 text-sm mt-1">Your subscription is now active</p>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-6">
      <div class="space-y-2">
        <p class="text-text-secondary leading-relaxed">
          Hi <%= toName %>, welcome to <%= plan.name %>! Your subscription is active and ready to use. Here's everything included in your plan:
        </p>
      </div>

      <!-- Plan summary -->
      <div class="rounded-xl border border-primary/30 bg-primary-subtle px-5 py-4 space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-sm font-bold text-text-primary"><%= plan.name %></p>
          <p class="text-sm font-bold text-primary"><%= fmtTRY(plan.price) %> / <%= plan.interval %></p>
        </div>
        <p class="text-xs text-text-secondary">Next billing date: <strong class="text-text-primary"><%= plan.nextBillingDate %></strong></p>
      </div>

      <!-- Features -->
      <div class="space-y-2">
        <p class="text-sm font-semibold text-text-primary">What's included:</p>
        <% features.forEach(function(f) { %>
        <div class="flex items-center gap-3">
          <i class="fa-solid fa-circle-check text-success text-sm shrink-0" aria-hidden="true"></i>
          <span class="text-sm text-text-secondary"><%= f %></span>
        </div>
        <% }); %>
      </div>

      <div class="text-center">
        <a href="<%= plan.manageUrl %>"
          class="inline-block bg-primary text-primary-fg font-semibold rounded-xl px-8 py-3 text-sm hover:bg-primary-hover transition-colors">
          Manage Subscription
        </a>
      </div>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
