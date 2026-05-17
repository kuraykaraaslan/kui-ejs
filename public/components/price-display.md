# PriceDisplay

- **id:** `price-display`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/money/PriceDisplay.ejs`
- **status:** stable
- **since:** 0.1

Intl.NumberFormat ile para birimi formatlama. Boyut, locale ve üstü çizili seçenekleri destekler.

## Design tokens consumed

- `--secondary`
- `--text-secondary`

## Variants

### Sizes

```ejs
<%- include('modules/domain/common/money/PriceDisplay', { amount: 1299.99, currency: 'TRY', size: 'lg' }) %>
```

### Multi-currency + strikethrough

```ejs
<%- include('modules/domain/common/money/PriceDisplay', { amount: 2499, currency: 'TRY', size: 'lg' }) %>
<%- include('modules/domain/common/money/PriceDisplay', { amount: 1799, currency: 'TRY', size: 'lg', strikethrough: true }) %>
```

## Full EJS source

```ejs
<%
  var _amount   = locals.amount   || 0;
  var _currency = locals.currency || 'TRY';
  var _locale   = locals.locale   || 'tr-TR';
  var _size     = locals.size     || 'md';
  var _strike   = locals.strikethrough || false;

  var sizeClass = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl font-semibold',
    xl: 'text-3xl font-bold',
  }[_size] || 'text-base';
%>
<span class="tabular-nums <%= sizeClass %><%= _strike ? ' line-through text-text-secondary' : '' %><%= locals.className ? ' ' + locals.className : '' %>">
  <%= _amount.toLocaleString(_locale, { style: 'currency', currency: _currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }) %>
</span>

```
