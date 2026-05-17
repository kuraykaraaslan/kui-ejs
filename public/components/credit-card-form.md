# CreditCardForm

- **id:** `credit-card-form`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/payment/CreditCardForm.ejs`
- **status:** stable
- **since:** 0.1

Canlı kart görseli önizlemeli kredi kartı giriş formu. Marka tespiti, numara formatlaması ve geçerlilik doğrulaması.

## Design tokens consumed

- `--error`
- `--error-fg`
- `--error-subtle`

## Variants

### Default

```ejs
<%- include('modules/domain/common/payment/CreditCardForm', {
  action: '/payment/cards',
  method: 'post'
}) %>
```

### Server error

```ejs
<%- include('modules/domain/common/payment/CreditCardForm', {
  action: '/payment/cards',
  error: 'Card declined. Please try a different card.'
}) %>
```

## Full EJS source

```ejs
<%
  var _action     = locals.action     || '#';
  var _method     = locals.method     || 'post';
  var _cancelHref = locals.cancelHref || null;
  var _error      = locals.error      || '';
  var _errors     = locals.errors     || {};
  var _initial    = locals.initial    || {};
%>
<form action="<%= _action %>" method="<%= _method %>" novalidate class="space-y-4<%= locals.className ? ' ' + locals.className : '' %>">
  <% if (_error) { %>
  <div role="alert" class="flex items-start gap-3 rounded-lg border p-3 bg-error-subtle border-error text-error-fg text-sm">
    <i class="fa-solid fa-circle-xmark mt-0.5 shrink-0" aria-hidden="true"></i>
    <span><%= _error %></span>
  </div>
  <% } %>

  <div class="flex justify-center mb-2">
    <%- include('../payment/CreditCardVisual', {
      brand:          _initial.brand          || 'UNKNOWN',
      cardNumber:     _initial.cardNumber     || '',
      cardholderName: _initial.cardholderName || '',
      expiryMonth:    _initial.expiryMonth    || 'MM',
      expiryYear:     _initial.expiryYear     || 'YY',
      cvv:            _initial.cvv            || ''
    }) %>
  </div>

  <%- include('../../../ui/Input', {
    id: 'card-number', label: 'Card Number', name: 'cardNumber',
    placeholder: '1234 5678 9012 3456',
    value: _initial.cardNumber || '',
    error: _errors.cardNumber
  }) %>

  <%- include('../../../ui/Input', {
    id: 'cardholder-name', label: 'Cardholder Name', name: 'cardholderName',
    placeholder: 'Name on card',
    value: _initial.cardholderName || '',
    error: _errors.cardholderName
  }) %>

  <div class="grid grid-cols-2 gap-4">
    <%- include('../../../ui/Input', {
      id: 'expiry', label: 'Expiry', name: 'expiry',
      placeholder: 'MM/YY',
      value: _initial.expiry || '',
      error: _errors.expiry
    }) %>
    <%- include('../../../ui/Input', {
      id: 'cvv', label: 'CVV', name: 'cvv', type: 'password',
      placeholder: '•••',
      value: '',
      error: _errors.cvv
    }) %>
  </div>

  <div class="flex justify-end gap-2 pt-2">
    <% if (_cancelHref) { %>
    <%- include('../../../ui/Button', { variant: 'outline', children: 'Cancel', href: _cancelHref }) %>
    <% } %>
    <%- include('../../../ui/Button', { type: 'submit', children: 'Add Card' }) %>
  </div>
</form>

```
