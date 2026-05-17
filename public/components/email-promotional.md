# PromotionalEmail

- **id:** `email-promotional`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/marketing/promotional.ejs`
- **status:** stable
- **since:** 0.1

Süre sınırlı kampanya. Gradient başlık, fiyat karşılaştırma, kesik çizgili kupon kodu.

## Design tokens consumed

- `--border`
- `--primary`
- `--primary-subtle`
- `--secondary`
- `--success`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Promotional Offer

```ejs
// GET /theme/common/email/marketing/promotional
res.render('theme/common/email/marketing/promotional', {
  layout:    'layouts/blank',
  subject:   promo.discountPct + '% off ' + plan.name + ' — This weekend only',
  fromName:  'Acme Corp',
  fromEmail: 'deals@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  promo: {
    headline:         promo.headline,
    subheadline:      promo.subheadline,
    discountPct:      promo.discountPercent,
    code:             promo.couponCode,
    validUntil:       promo.expiresAt.toLocaleString(),
    originalPrice:    plan.price,
    discountedPrice:  plan.price * (1 - promo.discountPercent / 100),
    currency:         plan.currency,
    shopUrl:          '/pricing',
    features:         plan.features,
  },
});
```

## Full EJS source

```ejs
<%
  var promo    = locals.promo || {};
  var features = promo.features || [];
  function fmtTRY(n) { return '₺' + (n || 0).toFixed(2); }
%>
<%- include('../_preview-bar', locals) %>

<div class="bg-[#f0f2f5] min-h-screen py-8 px-4">
  <div class="max-w-[600px] mx-auto">

    <!-- Header — gradient -->
    <div class="rounded-t-2xl px-8 py-10 text-center" style="background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);">
      <div class="inline-block bg-white/20 rounded-full px-4 py-1 text-white text-xs font-semibold mb-4 uppercase tracking-wide">
        Limited Time Offer
      </div>
      <p class="text-white font-black text-5xl mb-2"><%= promo.discountPct %>% OFF</p>
      <p class="text-white/90 font-semibold text-lg"><%= promo.subheadline %></p>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-6">
      <p class="text-text-secondary leading-relaxed text-sm">
        Hi <%= toName %>, for this weekend only, we're offering a massive <strong><%= promo.discountPct %>% discount</strong> on our <strong><%= promo.headline.replace(promo.discountPct + '% Off ', '') %></strong>. Don't miss out!
      </p>

      <!-- Price comparison -->
      <div class="rounded-xl border border-border bg-surface-raised p-5 flex items-center justify-center gap-6 text-center">
        <div>
          <p class="text-xs text-text-secondary uppercase tracking-wide">Regular price</p>
          <p class="text-2xl font-bold text-text-secondary line-through mt-1"><%= fmtTRY(promo.originalPrice) %></p>
        </div>
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary-subtle text-primary font-bold text-sm">→</div>
        <div>
          <p class="text-xs text-text-secondary uppercase tracking-wide">Your price</p>
          <p class="text-2xl font-bold text-success mt-1"><%= fmtTRY(promo.discountedPrice) %></p>
        </div>
      </div>

      <!-- Coupon -->
      <div class="rounded-xl bg-primary-subtle border border-primary/30 px-5 py-4 text-center space-y-2">
        <p class="text-xs text-text-secondary">Use code at checkout:</p>
        <div class="inline-block bg-white border-2 border-dashed border-primary rounded-lg px-6 py-2 font-mono text-lg font-bold text-primary tracking-widest">
          <%= promo.code %>
        </div>
        <p class="text-xs text-text-secondary">Valid until <strong class="text-text-primary"><%= promo.validUntil %></strong></p>
      </div>

      <!-- Features -->
      <div class="space-y-2">
        <p class="text-sm font-semibold text-text-primary">What you'll get:</p>
        <% features.forEach(function(f) { %>
        <div class="flex items-center gap-3">
          <i class="fa-solid fa-circle-check text-success text-sm shrink-0" aria-hidden="true"></i>
          <span class="text-sm text-text-secondary"><%= f %></span>
        </div>
        <% }); %>
      </div>

      <div class="text-center">
        <a href="<%= promo.shopUrl %>"
          class="inline-block font-semibold rounded-xl px-10 py-3.5 text-sm text-white hover:opacity-90 transition-opacity"
          style="background: linear-gradient(135deg, var(--primary), var(--secondary))">
          Claim My Discount
        </a>
      </div>

      <p class="text-xs text-text-secondary text-center">
        Offer expires <%= promo.validUntil %>. Cannot be combined with other promotions.
      </p>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
