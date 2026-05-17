# AbandonedCartEmail

- **id:** `email-abandoned-cart`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/order/abandoned-cart.ejs`
- **status:** stable
- **since:** 0.1

Terk edilen sepet yeniden katılım e-postası. Kupon kodu, indirim teklifi ve sepet içeriği.

## Design tokens consumed

- `--border`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--secondary`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`
- `--warning`

## Variants

### Abandoned Cart

```ejs
// GET /theme/common/email/order/abandoned-cart
res.render('theme/common/email/order/abandoned-cart', {
  layout:    'layouts/blank',
  subject:   'You left something behind…',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  cart: {
    items:       cart.items,
    total:       cart.subtotal,
    currency:    cart.currency,
    couponCode:  'COMEBACK10',
    couponPct:   10,
    expiresAt:   expiryDate.toLocaleDateString(),
    resumeUrl:   '/cart?token=' + cart.token,
  },
});
```

## Full EJS source

```ejs
<%
  var cart  = locals.cart || {};
  var items = cart.items  || [];
  function fmtTRY(n) { return '₺' + (n || 0).toFixed(2); }
%>
<%- include('../_preview-bar', locals) %>

<div class="bg-[#f0f2f5] min-h-screen py-8 px-4">
  <div class="max-w-[600px] mx-auto">

    <!-- Header -->
    <div class="bg-primary rounded-t-2xl px-8 py-8 text-center">
      <i class="fa-solid fa-cart-shopping text-primary-fg text-4xl mb-3" aria-hidden="true"></i>
      <p class="text-primary-fg font-bold text-xl">You left something behind</p>
      <p class="text-primary-fg/80 text-sm mt-1">Your cart is waiting for you</p>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-6">
      <p class="text-text-secondary leading-relaxed">
        Hi <%= toName %>, you added some items to your cart but didn't complete your purchase. Your cart will expire on <strong><%= cart.expiresAt %></strong>.
      </p>

      <!-- Cart items -->
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
        <div class="flex justify-between px-4 py-3 bg-surface-raised rounded-b-xl">
          <span class="text-sm font-semibold text-text-primary">Subtotal</span>
          <span class="text-sm font-bold text-text-primary"><%= fmtTRY(cart.total) %></span>
        </div>
      </div>

      <!-- Coupon offer -->
      <div class="rounded-xl bg-warning/10 border border-warning/30 px-5 py-4 space-y-2 text-center">
        <p class="text-sm font-semibold text-text-primary">Special offer just for you</p>
        <p class="text-xs text-text-secondary">Use code <strong class="text-text-primary font-mono"><%= cart.couponCode %></strong> for <strong><%= cart.couponPct %>% off</strong> your order today.</p>
        <div class="inline-block bg-warning/20 rounded-lg px-4 py-1.5 font-mono text-sm font-bold text-text-primary tracking-widest border border-warning/40">
          <%= cart.couponCode %>
        </div>
      </div>

      <div class="text-center">
        <a href="<%= cart.resumeUrl %>"
          class="inline-block bg-primary text-primary-fg font-semibold rounded-xl px-10 py-3.5 text-sm hover:bg-primary-hover transition-colors">
          Complete My Purchase
        </a>
      </div>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
