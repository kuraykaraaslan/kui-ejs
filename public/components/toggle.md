# Toggle

- **id:** `toggle`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Toggle.ejs`
- **status:** stable
- **since:** 0.1

Boolean ayarlar için sürgü kontrolü. peer tabanlı CSS ile çalışır; label ve 3 boyut destekler.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--primary-fg`
- `--surface-sunken`
- `--text-primary`

## Variants

### Checked

```ejs
<%- include('modules/ui/Toggle', { id: 'notif', label: 'Notifications enabled', checked: true }) %>
```

### Unchecked

```ejs
<%- include('modules/ui/Toggle', { id: 'dark', label: 'Dark mode' }) %>
```

### No label

```ejs
<%- include('modules/ui/Toggle', { id: 't', checked: true }) %>
```

### Disabled

```ejs
<%- include('modules/ui/Toggle', { id: 'a', label: 'Enabled (disabled)', checked: true,  disabled: true }) %>
<%- include('modules/ui/Toggle', { id: 'b', label: 'Disabled option',     checked: false, disabled: true }) %>
```

### Sizes

```ejs
<%- include('modules/ui/Toggle', { id: 'sm', label: 'Small',  size: 'sm', checked: true }) %>
<%- include('modules/ui/Toggle', { id: 'md', label: 'Medium', size: 'md', checked: true }) %>
<%- include('modules/ui/Toggle', { id: 'lg', label: 'Large',  size: 'lg', checked: true }) %>
```

## Full EJS source

```ejs
<%
  var _sz = locals.size || 'md';
  var _ch = locals.checked ? 'checked' : '';
  var _dis = locals.disabled ? 'disabled' : '';
  
  var wClass = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6',
    lg: 'w-14 h-7'
  }[_sz] || 'w-11 h-6';

  var dotClass = {
    sm: 'h-3 w-3 peer-checked:translate-x-4',
    md: 'h-5 w-5 peer-checked:translate-x-5',
    lg: 'h-6 w-6 peer-checked:translate-x-7'
  }[_sz] || 'h-5 w-5 peer-checked:translate-x-5';

  var _id = locals.id || 'toggle-' + Math.random().toString(36).substr(2, 9);
%>
<label class="inline-flex items-center cursor-pointer <%= _dis ? 'opacity-50 cursor-not-allowed' : '' %> <%= locals.className || '' %>">
  <div class="relative">
    <input type="checkbox" id="<%= _id %>" class="sr-only peer" <%= _ch %> <%= _dis %>
      <% if (locals.name)     { %>name="<%= locals.name %>"<% } %>
      <% if (locals.value)    { %>value="<%= locals.value %>"<% } %>
      <% if (locals.onchange) { %>onchange="<%= locals.onchange %>"<% } %>
    >
    <div class="bg-surface-sunken rounded-full peer peer-focus:ring-2 peer-focus:ring-border-focus peer-checked:bg-primary transition-all <%= wClass %>"></div>
    <div class="absolute left-0.5 top-0.5 bg-white rounded-full transition-all peer-checked:bg-primary-fg <%= dotClass %>"></div>
  </div>
  <% if (locals.label) { %>
    <span class="ml-3 text-sm font-medium text-text-primary"><%= locals.label %></span>
  <% } %>
</label>

```
