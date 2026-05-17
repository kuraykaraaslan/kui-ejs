# CouponInput

- **id:** `coupon-input`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/discount/CouponInput.ejs`
- **status:** stable
- **since:** 0.1

Kupon kodu giriş + uygula/kaldır akışı. Sunucu taraflı doğrulama ile hata/başarı mesajları.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--primary`
- `--success`
- `--success-fg`
- `--success-subtle`
- `--surface-overlay`
- `--text-primary`

## Variants

### Default

```ejs
<%- include('modules/domain/common/discount/CouponInput', {
  action: '/cart/coupon/apply'
}) %>
```

### Applied state

```ejs
<%- include('modules/domain/common/discount/CouponInput', {
  appliedCode: 'SAVE20',
  removeAction: '/cart/coupon/remove'
}) %>
```

## Full EJS source

```ejs
<%
  var _action      = locals.action      || '#';
  var _appliedCode = locals.appliedCode || null;
  var _removeAction = locals.removeAction || null;
%>
<% if (_appliedCode) { %>
<div class="flex items-center justify-between gap-3 rounded-lg bg-success-subtle border border-success px-4 py-2.5<%= locals.className ? ' ' + locals.className : '' %>">
  <div class="flex items-center gap-2 min-w-0">
    <i class="fa-solid fa-check text-success-fg shrink-0" style="width:.875rem;height:.875rem" aria-hidden="true"></i>
    <span class="text-sm font-medium text-success-fg truncate">
      <span class="font-mono"><%= _appliedCode %></span> applied
    </span>
  </div>
  <% if (_removeAction) { %>
  <form action="<%= _removeAction %>" method="post" class="shrink-0">
    <button type="submit" class="text-sm text-success-fg underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded">Remove</button>
  </form>
  <% } %>
</div>
<% } else { %>
<form action="<%= _action %>" method="post" class="space-y-1.5<%= locals.className ? ' ' + locals.className : '' %>">
  <div class="flex gap-2">
    <input type="text" name="couponCode" placeholder="Enter coupon code" aria-label="Coupon code"
      value="<%= locals.couponCode || '' %>"
      class="flex-1 block rounded-md border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-text-tertiary transition-colors px-3 py-2 text-sm uppercase">
    <button type="submit" class="shrink-0 inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors border border-border text-text-primary hover:bg-surface-overlay px-4 py-2 text-sm">Apply</button>
  </div>
  <% if (locals.couponError) { %>
  <p class="text-xs text-error"><%= locals.couponError %></p>
  <% } %>
  <% if (locals.couponSuccess) { %>
  <p class="text-xs text-success-fg"><%= locals.couponSuccess %></p>
  <% } %>
</form>
<% } %>

```
