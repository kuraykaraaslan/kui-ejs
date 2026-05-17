# CurrencySelector

- **id:** `currency-selector`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/money/CurrencySelector.ejs`
- **status:** stable
- **since:** 0.1

ISO 4217 para birimi seçici. countries-list'ten derlenen, alfabetik sıralı native select.

## Design tokens consumed

- `--border`
- `--primary`
- `--text-primary`

## Variants

### Default

```ejs
<%- include('modules/domain/common/money/CurrencySelector', {
  value: currentCurrency,
  name:  'currency',
  currencies: availableCurrencies
}) %>
```

### No label

```ejs
<%- include('modules/domain/common/money/CurrencySelector', {
  value: 'USD',
  label: '',
  name:  'currency'
}) %>
```

## Full EJS source

```ejs
<%
  var _id       = locals.id       || 'currency';
  var _name     = locals.name     || 'currency';
  var _value    = locals.value    || 'TRY';
  var _label    = locals.label    !== undefined ? locals.label : 'Currency';
  var _disabled = !!locals.disabled;
  var _currencies = locals.currencies || [];
%>
<div class="space-y-1<%= locals.className ? ' ' + locals.className : '' %>">
  <% if (_label) { %>
  <label for="<%= _id %>" class="block text-sm font-medium text-text-primary"><%= _label %></label>
  <% } %>
  <div class="relative">
    <select id="<%= _id %>" name="<%= _name %>"
      class="block w-full rounded-md border border-border bg-surface text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-text-tertiary transition-colors px-3 py-2 text-sm pr-8 disabled:opacity-50 disabled:cursor-not-allowed"
      <%= _disabled ? 'disabled' : '' %>>
      <% _currencies.forEach(function(c) { %>
      <option value="<%= c %>" <%= c === _value ? 'selected' : '' %>><%= c %></option>
      <% }); %>
      <% if (!_currencies.length) { %>
      <option value="<%= _value %>" selected><%= _value %></option>
      <% } %>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-text-tertiary">
      <i class="fa-solid fa-chevron-down text-xs" aria-hidden="true"></i>
    </div>
  </div>
</div>

```
