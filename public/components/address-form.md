# AddressForm

- **id:** `address-form`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/address/AddressForm.ejs`
- **status:** stable
- **since:** 0.1

Ad, telefon, adres satırları, şehir, bölge, posta kodu ve ülke alanlarından oluşan adres formu. initial prop ile önceden doldurulabilir.

## Variants

### Empty

```ejs
<%- include('modules/domain/common/address/AddressForm', {
  action: '/addresses/new'
}) %>
```

### Pre-filled

```ejs
<%- include('modules/domain/common/address/AddressForm', {
  action: '/addresses/1/edit',
  initial: existingAddress,
  submitLabel: 'Update',
  cancelHref: '/addresses'
}) %>
```

## Full EJS source

```ejs
<%
  var _action      = locals.action      || '#';
  var _method      = locals.method      || 'post';
  var _initial     = locals.initial     || {};
  var _submitLabel = locals.submitLabel || 'Save';
  var _cancelHref  = locals.cancelHref  || null;
  var _errors      = locals.errors      || {};
%>
<form action="<%= _action %>" method="<%= _method %>" novalidate class="space-y-4<%= locals.className ? ' ' + locals.className : '' %>">

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <%- include('../../../ui/Input', {
      id: 'addr-fullname', label: 'Full Name', name: 'fullName', required: true,
      iconLeft: '<i class="fa-solid fa-user text-xs" aria-hidden="true"></i>',
      value: _initial.fullName || '', error: _errors.fullName
    }) %>
    <%- include('../../../ui/Input', {
      id: 'addr-phone', label: 'Phone', name: 'phone', type: 'tel',
      iconLeft: '<i class="fa-solid fa-phone text-xs" aria-hidden="true"></i>',
      value: _initial.phone || ''
    }) %>
  </div>

  <%- include('../../../ui/Input', {
    id: 'addr-line1', label: 'Address Line 1', name: 'addressLine1', required: true,
    iconLeft: '<i class="fa-solid fa-location-dot text-xs" aria-hidden="true"></i>',
    value: _initial.addressLine1 || '', error: _errors.addressLine1
  }) %>

  <%- include('../../../ui/Input', {
    id: 'addr-line2', label: 'Address Line 2 (optional)', name: 'addressLine2',
    value: _initial.addressLine2 || ''
  }) %>

  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <%- include('../../../ui/Input', {
      id: 'addr-city', label: 'City', name: 'city', required: true,
      value: _initial.city || '', error: _errors.city
    }) %>
    <%- include('../../../ui/Input', {
      id: 'addr-state', label: 'State / District', name: 'state',
      value: _initial.state || ''
    }) %>
    <%- include('../../../ui/Input', {
      id: 'addr-postal', label: 'Postal Code', name: 'postalCode',
      value: _initial.postalCode || ''
    }) %>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <%- include('../../../ui/Input', {
      id: 'addr-country', label: 'Country', name: 'country', required: true,
      iconLeft: '<i class="fa-solid fa-globe text-xs" aria-hidden="true"></i>',
      value: _initial.country || '', error: _errors.country
    }) %>
    <%- include('../../../ui/Input', {
      id: 'addr-code', label: 'Country Code (2 letters)', name: 'countryCode',
      value: _initial.countryCode || ''
    }) %>
  </div>

  <div class="flex justify-end gap-2 pt-2">
    <% if (_cancelHref) { %>
    <%- include('../../../ui/Button', { variant: 'outline', children: 'Cancel', href: _cancelHref }) %>
    <% } %>
    <%- include('../../../ui/Button', { type: 'submit', children: _submitLabel }) %>
  </div>
</form>

```
