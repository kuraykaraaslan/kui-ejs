# CardExpiringEmail

- **id:** `email-card-expiring`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/billing/card-expiring.ejs`
- **status:** stable
- **since:** 2025-05

Kart son kullanma uyarısı. Kart görseli, plan/faturalandırma bilgisi ve güncelleme CTA.

## Design tokens consumed

- `--info`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--secondary`
- `--text-primary`
- `--text-secondary`
- `--warning`

## Variants

### Card Expiring Soon

```ejs
// GET /theme/common/email/billing/card-expiring
res.render('theme/common/email/billing/card-expiring', {
  layout:    'layouts/blank',
  subject:   'Your ' + card.brand + ' ••••' + card.last4 + ' expires next month',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  card: {
    last4:       card.last4,
    brand:       card.brand,
    expiryMonth: card.expMonth.toString().padStart(2, '0'),
    expiryYear:  card.expYear.toString().slice(-2),
    updateUrl:   '/account/payment-methods',
  },
  plan: {
    name:            subscription.planName,
    nextBillingDate: subscription.nextBillingDate.toLocaleDateString(),
  },
});
```

## Full EJS source

```ejs
<%
  var card = locals.card || {};
  var plan = locals.plan || {};
%>
<%- include('../_preview-bar', locals) %>

<div class="bg-[#f0f2f5] min-h-screen py-8 px-4">
  <div class="max-w-[600px] mx-auto">

    <!-- Header -->
    <div class="bg-warning rounded-t-2xl px-8 py-8 text-center">
      <i class="fa-solid fa-credit-card text-white text-4xl mb-3" aria-hidden="true"></i>
      <p class="text-white font-bold text-xl">Your card is expiring soon</p>
      <p class="text-white/80 text-sm mt-1"><%= card.brand %> ••••<%= card.last4 %> expires <%= card.expiryMonth %>/<%= card.expiryYear %></p>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-6">
      <div class="space-y-2">
        <h1 class="text-xl font-bold text-text-primary">Update your payment method</h1>
        <p class="text-text-secondary leading-relaxed text-sm">
          Hi <%= toName %>, your <strong><%= card.brand %> ••••<%= card.last4 %></strong> expires at the end of <%= card.expiryMonth %>/<%= card.expiryYear %>.
          Please update it before your next billing date to avoid any service interruption.
        </p>
      </div>

      <!-- Card visual -->
      <div class="rounded-2xl bg-gradient-to-br from-text-primary to-text-secondary p-5 text-white space-y-4">
        <div class="flex items-center justify-between">
          <p class="text-xs font-medium opacity-70 uppercase tracking-widest"><%= card.brand %></p>
          <i class="fa-solid fa-credit-card opacity-60 text-lg" aria-hidden="true"></i>
        </div>
        <p class="font-mono text-lg tracking-widest">•••• •••• •••• <%= card.last4 %></p>
        <div class="flex items-end justify-between">
          <div>
            <p class="text-xs opacity-60 uppercase tracking-wide">Expires</p>
            <p class="font-mono text-sm font-semibold text-warning"><%= card.expiryMonth %>/<%= card.expiryYear %></p>
          </div>
        </div>
      </div>

      <!-- Plan info -->
      <div class="rounded-lg bg-info/10 border border-info/30 px-4 py-3 flex items-start gap-3">
        <i class="fa-solid fa-circle-info text-info text-sm mt-0.5 shrink-0" aria-hidden="true"></i>
        <p class="text-sm text-text-secondary">
          This card is used for your <strong class="text-text-primary"><%= plan.name %></strong> plan, which renews on <strong class="text-text-primary"><%= plan.nextBillingDate %></strong>.
        </p>
      </div>

      <div class="text-center">
        <a href="<%= card.updateUrl %>"
          class="inline-block bg-primary text-primary-fg font-semibold rounded-xl px-8 py-3.5 text-sm hover:bg-primary-hover transition-colors">
          Update Payment Method
        </a>
      </div>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
