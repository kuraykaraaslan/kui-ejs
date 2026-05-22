# AddressSelector

- **id:** `address-selector`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/address/AddressSelector.ejs`
- **status:** beta
- **since:** 2025-04

AddressCard üzerine kurulu seçilebilir adres listesi. Ekle, düzenle ve sil callback'leri destekler.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--secondary`
- `--surface-overlay`
- `--text-primary`
- `--text-secondary`

## Variants

### Multiple addresses

```ejs
<%- include('modules/domain/common/address/AddressSelector', {
  addresses: savedAddresses,
  selectedIndex: 0,
  addHref: '/addresses/new'
}) %>
```

### Empty state

```ejs
<%- include('modules/domain/common/address/AddressSelector', {
  addresses: [],
  addHref: '/addresses/new'
}) %>
```

## Full EJS source

```ejs
<%
  var _addresses     = locals.addresses     || [];
  var _selectedIndex = locals.selectedIndex !== undefined ? locals.selectedIndex : -1;
  var _addHref       = locals.addHref       || null;
%>
<fieldset class="space-y-3<%= locals.className ? ' ' + locals.className : '' %>">
  <legend class="sr-only">Select delivery address</legend>

  <% if (_addresses.length === 0) { %>
  <p class="text-sm text-text-secondary py-4 text-center">No saved addresses.</p>
  <% } else { %>
  <div class="space-y-2">
    <% _addresses.forEach(function(addr, i) { %>
    <label class="block cursor-pointer rounded-lg focus-within:ring-2 focus-within:ring-border-focus">
      <input type="radio" name="addressIndex" value="<%= i %>"
        <%= _selectedIndex === i ? 'checked' : '' %>
        class="sr-only">
      <%- include('../address/AddressCard', {
        address: addr,
        selected: _selectedIndex === i,
        editHref: addr.editHref || null,
        deleteAction: addr.deleteAction || null
      }) %>
    </label>
    <% }); %>
  </div>
  <% } %>

  <% if (_addHref) { %>
  <a href="<%= _addHref %>"
    class="w-full inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors border border-border text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm">
    + Add new address
  </a>
  <% } %>
</fieldset>

```
