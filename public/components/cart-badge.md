# CartBadge

- **id:** `cart-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/cart/CartBadge.ejs`
- **status:** stable
- **since:** 2026-05

Round cart button for the header that shows the number of items in the cart. Counts above 99 render as a "99+" badge.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--primary-fg`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`

## Variants

### States

```ejs
<%- include('modules/domain/common/cart/CartBadge', {
  cart: { items: [] }
}) %>
<%- include('modules/domain/common/cart/CartBadge', {
  cart: { items: [{ quantity: 1 }, { quantity: 2 }] }
}) %>
<%- include('modules/domain/common/cart/CartBadge', {
  cart: { items: [{ quantity: 150 }] }
}) %>
```

### In a header

```ejs
<header class="flex items-center justify-between">
  <a href="/">Shop</a>
  <nav>
    <%- include('modules/domain/common/cart/CartBadge', {
      cart: currentCart,
      onClick: 'openCartDrawer'
    }) %>
  </nav>
</header>
```

## Full EJS source

```ejs
<%
  var _cart       = locals.cart       || {};
  var _items      = _cart.items       || [];
  var _id         = locals.id         || ('cart-badge-' + Math.random().toString(36).slice(2, 9));
  var _onClick    = locals.onClick    || '';
  var _className  = locals.className  || '';

  var totalQty = _items.reduce(function(s, i) { return s + (i.quantity || 0); }, 0);
  var label    = 'Cart — ' + totalQty + ' item' + (totalQty !== 1 ? 's' : '');
  var display  = totalQty > 99 ? '99+' : totalQty;
%>
<button id="<%= _id %>"
        type="button"
        <% if (_onClick) { %>onclick="(<%= _onClick %>)();"<% } %>
        aria-label="<%= label %>"
        class="relative inline-flex items-center justify-center h-10 w-10 rounded-full border border-border bg-surface-raised text-text-primary hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus<%= _className ? ' ' + _className : '' %>">
  <i class="fa-solid fa-cart-shopping w-5 h-5" aria-hidden="true"></i>
  <% if (totalQty > 0) { %>
  <span aria-hidden="true"
        class="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-fg tabular-nums shadow">
    <%= display %>
  </span>
  <% } %>
</button>

```
