# PaymentMethodSelector

- **id:** `payment-method-selector`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/payment/PaymentMethodSelector.ejs`
- **status:** stable
- **since:** 0.1

Radio-group kart seçici. Credit card, debit card, bank transfer ve wallet seçenekleri.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--border-strong`
- `--primary`
- `--primary-subtle`
- `--secondary`
- `--text-primary`
- `--text-secondary`

## Variants

### Default (4 methods)

```ejs
<%- include('modules/domain/common/payment/PaymentMethodSelector', {
  name:  'paymentMethod',
  value: selectedMethod
}) %>
```

## Full EJS source

```ejs
<%
  var _name    = locals.name    || 'paymentMethod';
  var _value   = locals.value   || 'CREDIT_CARD';
  var _legend  = locals.legend  || 'Payment method';
  var _disabled = !!locals.disabled;

  var methods = [
    { value: 'CREDIT_CARD',   label: 'Credit Card',     desc: 'Visa, Mastercard, Amex',    icon: 'fa-solid fa-credit-card text-blue-600' },
    { value: 'DEBIT_CARD',    label: 'Debit Card',       desc: 'All bank debit cards',      icon: 'fa-solid fa-credit-card text-green-600' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer',    desc: 'Direct from your account',  icon: 'fa-solid fa-building-columns text-text-secondary' },
    { value: 'WALLET',        label: 'Digital Wallet',   desc: 'PayPal, Google Pay, etc.', icon: 'fa-solid fa-wallet text-purple-600' },
  ];
%>
<fieldset class="w-full<%= locals.className ? ' ' + locals.className : '' %>"<%= _disabled ? ' disabled' : '' %>>
  <legend class="block text-sm font-medium text-text-primary mb-3"><%= _legend %></legend>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <% methods.forEach(function(m) { %>
    <%
      var isSelected = m.value === _value;
      var cardClass = isSelected
        ? 'border-primary ring-2 ring-primary bg-primary-subtle/30'
        : 'border-border hover:border-border-strong';
    %>
    <label class="flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-border-focus <%= cardClass %>">
      <input type="radio" name="<%= _name %>" value="<%= m.value %>"
        <%= isSelected ? 'checked' : '' %> <%= _disabled ? 'disabled' : '' %>
        class="sr-only">
      <span aria-hidden="true" class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors <%= isSelected ? 'border-primary bg-primary' : 'border-border' %>">
        <% if (isSelected) { %><span class="h-1.5 w-1.5 rounded-full bg-white"></span><% } %>
      </span>
      <i class="<%= m.icon %> text-lg shrink-0" aria-hidden="true"></i>
      <div class="min-w-0">
        <p class="text-sm font-medium text-text-primary"><%= m.label %></p>
        <p class="text-xs text-text-secondary"><%= m.desc %></p>
      </div>
    </label>
    <% }); %>
  </div>
</fieldset>

```
