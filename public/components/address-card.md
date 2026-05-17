# AddressCard

- **id:** `address-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/address/AddressCard.ejs`
- **status:** stable
- **since:** 0.1

Salt okunur adres kartı. Ad, telefon, adres satırları, şehir/bölge/posta kodu ve ülge. Seçili durum ve edit/delete butonları.

## Design tokens consumed

- `--border`
- `--error`
- `--primary`
- `--secondary`
- `--surface-base`
- `--surface-overlay`
- `--surface-raised`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Default

```ejs
<%- include('modules/domain/common/address/AddressCard', {
  address: savedAddress,
  editHref: '/addresses/1/edit',
  deleteAction: '/addresses/1/delete'
}) %>
```

### Selectable list

```ejs
<%- include('modules/domain/common/address/AddressCard', {
  address: address,
  selected: selectedIdx === i
}) %>
```

## Full EJS source

```ejs
<%
  var _addr     = locals.address  || {};
  var _selected = locals.selected || false;
  var _editHref = locals.editHref || null;
  var _deleteAction = locals.deleteAction || null;

  var cityLine    = [_addr.city, _addr.state, _addr.postalCode].filter(Boolean).join(', ');
  var countryLine = [_addr.country, _addr.countryCode ? '(' + _addr.countryCode + ')' : ''].filter(Boolean).join(' ');
  var borderClass = _selected
    ? 'border-primary ring-2 ring-primary ring-offset-1'
    : 'border-border';
%>
<div class="relative rounded-lg border bg-surface-raised p-4 space-y-2 transition-colors <%= borderClass %><%= locals.className ? ' ' + locals.className : '' %>">
  <% if (_selected !== undefined) { %>
  <span aria-hidden="true" class="absolute top-3 right-3 flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors <%= _selected ? 'border-primary bg-primary' : 'border-border bg-surface-base' %>">
    <% if (_selected) { %><span class="h-1.5 w-1.5 rounded-full bg-white"></span><% } %>
  </span>
  <% } %>

  <% if (_addr.fullName) { %>
  <div class="flex items-center gap-2 text-sm font-medium text-text-primary">
    <i class="fa-solid fa-user w-3 h-3 text-text-disabled shrink-0" aria-hidden="true"></i>
    <%= _addr.fullName %>
  </div>
  <% } %>

  <div class="flex items-start gap-2 text-sm text-text-secondary">
    <i class="fa-solid fa-location-dot w-3 h-3 text-text-disabled shrink-0 mt-0.5" aria-hidden="true"></i>
    <div class="space-y-0.5">
      <p><%= _addr.addressLine1 %></p>
      <% if (_addr.addressLine2) { %><p><%= _addr.addressLine2 %></p><% } %>
      <% if (cityLine)           { %><p><%= cityLine %></p><% } %>
      <% if (countryLine)        { %><p><%= countryLine %></p><% } %>
    </div>
  </div>

  <% if (_addr.phone) { %>
  <div class="flex items-center gap-2 text-sm text-text-secondary">
    <i class="fa-solid fa-phone w-3 h-3 text-text-disabled shrink-0" aria-hidden="true"></i>
    <%= _addr.phone %>
  </div>
  <% } %>

  <% if (_editHref || _deleteAction) { %>
  <div class="flex gap-2 pt-2 border-t border-border">
    <% if (_editHref) { %>
    <a href="<%= _editHref %>" class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors bg-transparent text-primary hover:bg-surface-overlay px-2 py-1 text-xs">Edit</a>
    <% } %>
    <% if (_deleteAction) { %>
    <form action="<%= _deleteAction %>" method="post" onsubmit="return confirm('Delete this address?')">
      <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors bg-transparent text-error hover:opacity-80 px-2 py-1 text-xs">Delete</button>
    </form>
    <% } %>
  </div>
  <% } %>
</div>

```
