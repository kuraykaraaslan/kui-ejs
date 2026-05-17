# LocationPicker

- **id:** `location-picker`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/location/LocationPicker.ejs`
- **status:** stable
- **since:** 0.1

Ülke seçici (countries-list), şehir, bölge, posta kodu ve isteğe bağlı enlem/boylam alanları. 2 sütun grid.

## Design tokens consumed

- `--border`
- `--error`
- `--error-fg`
- `--error-subtle`
- `--primary`
- `--text-primary`

## Variants

### Empty

```ejs
<%- include('modules/domain/common/location/LocationPicker', {
  action: '/locations/update',
  countries: countryList
}) %>
```

### Pre-filled

```ejs
<%- include('modules/domain/common/location/LocationPicker', {
  action: '/locations/update',
  cancelHref: '/settings',
  countries: countryList,
  initial: { city: 'Istanbul', countryCode: 'TR', postalCode: '34000', latitude: 41.0082, longitude: 28.9784 }
}) %>
```

## Full EJS source

```ejs
<%
  var _action     = locals.action     || '#';
  var _method     = locals.method     || 'post';
  var _initial    = locals.initial    || {};
  var _cancelHref = locals.cancelHref || null;
  var _error      = locals.error      || '';
  var _countries  = locals.countries  || [];
%>
<form action="<%= _action %>" method="<%= _method %>" novalidate class="space-y-4<%= locals.className ? ' ' + locals.className : '' %>">
  <% if (_error) { %>
  <div role="alert" class="flex items-start gap-3 rounded-lg border p-3 bg-error-subtle border-error text-error-fg text-sm">
    <i class="fa-solid fa-circle-xmark mt-0.5 shrink-0" aria-hidden="true"></i>
    <span><%= _error %></span>
  </div>
  <% } %>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="w-full">
      <label for="loc-country" class="block text-sm font-medium text-text-primary mb-1.5">Country</label>
      <div class="relative">
        <select id="loc-country" name="countryCode"
          class="block w-full rounded-md border border-border bg-surface text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-text-tertiary transition-colors px-3 py-2 text-sm pr-8">
          <option value="">Select country…</option>
          <% _countries.forEach(function(c) { %>
          <option value="<%= c.value %>" <%= _initial.countryCode === c.value ? 'selected' : '' %>><%= c.label %></option>
          <% }); %>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-text-tertiary">
          <i class="fa-solid fa-chevron-down text-xs" aria-hidden="true"></i>
        </div>
      </div>
    </div>

    <%- include('../../../ui/Input', {
      id: 'loc-city', label: 'City', name: 'city',
      value: _initial.city || ''
    }) %>

    <%- include('../../../ui/Input', {
      id: 'loc-state', label: 'State / Province', name: 'state',
      value: _initial.state || ''
    }) %>

    <%- include('../../../ui/Input', {
      id: 'loc-postal', label: 'Postal Code', name: 'postalCode',
      value: _initial.postalCode || ''
    }) %>

    <%- include('../../../ui/Input', {
      id: 'loc-lat', label: 'Latitude', name: 'latitude', type: 'number',
      value: _initial.latitude !== null && _initial.latitude !== undefined ? _initial.latitude : ''
    }) %>

    <%- include('../../../ui/Input', {
      id: 'loc-lng', label: 'Longitude', name: 'longitude', type: 'number',
      value: _initial.longitude !== null && _initial.longitude !== undefined ? _initial.longitude : ''
    }) %>
  </div>

  <div class="flex justify-end gap-2 pt-2">
    <% if (_cancelHref) { %>
    <%- include('../../../ui/Button', { variant: 'outline', children: 'Cancel', href: _cancelHref }) %>
    <% } %>
    <%- include('../../../ui/Button', { type: 'submit', children: 'Save Location' }) %>
  </div>
</form>

```
