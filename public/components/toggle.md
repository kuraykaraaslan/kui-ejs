# Toggle

- **id:** `toggle`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Toggle.ejs`
- **status:** stable
- **since:** 2025-02

Boolean ayarlar için sürgü kontrolü. peer tabanlı CSS ile çalışır; label ve 3 boyut destekler.

## Design tokens consumed

- `--border`
- `--primary`
- `--secondary`
- `--surface-sunken`
- `--text-primary`
- `--text-secondary`

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
  var _sz  = locals.size || 'md';
  var _ch  = !!locals.checked;
  var _dis = !!locals.disabled;
  var _id  = locals.id || 'toggle-' + Math.random().toString(36).substr(2, 9);

  var sizeMap = {
    sm: { track: 'h-4 w-7',   thumb: 'h-3 w-3',     on: 'translate-x-3.5' },
    md: { track: 'h-5 w-9',   thumb: 'h-3.5 w-3.5', on: 'translate-x-4'   },
    lg: { track: 'h-6 w-11',  thumb: 'h-4 w-4',     on: 'translate-x-5'   }
  };
  var sm = sizeMap[_sz] || sizeMap.md;

  var trackBg = _ch ? 'bg-primary' : 'bg-surface-sunken border border-border';
  var thumbTranslate = _ch ? sm.on : 'translate-x-0';
%>
<label
  for="<%= _id %>"
  class="flex items-start gap-3 <%= _dis ? 'cursor-not-allowed opacity-50' : 'cursor-pointer' %><%= locals.className ? ' ' + locals.className : '' %>"
  data-toggle-root="<%= _id %>"
>
  <div class="relative shrink-0 mt-0.5">
    <input
      id="<%= _id %>"
      type="checkbox"
      role="switch"
      class="sr-only"
      aria-checked="<%= _ch ? 'true' : 'false' %>"
      data-toggle-input
      <% if (_ch)  { %>checked<% } %>
      <% if (_dis) { %>disabled<% } %>
      <% if (locals.name)     { %>name="<%= locals.name %>"<% } %>
      <% if (locals.value)    { %>value="<%= locals.value %>"<% } %>
      <% if (locals.onchange) { %>onchange="<%= locals.onchange %>"<% } %>
    >
    <div
      data-toggle-track
      class="rounded-full transition-colors duration-200 <%= sm.track %> <%= trackBg %>"
    ></div>
    <div
      data-toggle-thumb
      class="absolute top-0.5 left-0.5 rounded-full bg-white shadow-sm transition-transform duration-200 <%= sm.thumb %> <%= thumbTranslate %>"
    ></div>
  </div>
  <% if (locals.label || locals.description) { %>
  <div>
    <% if (locals.label) { %>
      <span class="text-sm font-medium text-text-primary"><%= locals.label %></span>
    <% } %>
    <% if (locals.description) { %>
      <p class="text-xs text-text-secondary mt-0.5"><%= locals.description %></p>
    <% } %>
  </div>
  <% } %>
</label>

<script>
(function () {
  var root = document.querySelector('[data-toggle-root="<%= _id %>"]');
  if (!root || root.__toggleBound) return;
  root.__toggleBound = true;

  var input = root.querySelector('[data-toggle-input]');
  var track = root.querySelector('[data-toggle-track]');
  var thumb = root.querySelector('[data-toggle-thumb]');
  if (!input || !track || !thumb) return;

  var ON_CLASS = '<%= sm.on %>';
  var TRACK_ON_CLASSES  = ['bg-primary'];
  var TRACK_OFF_CLASSES = ['bg-surface-sunken', 'border', 'border-border'];

  var _checked = input.checked;

  function render() {
    input.setAttribute('aria-checked', _checked ? 'true' : 'false');
    if (_checked) {
      TRACK_OFF_CLASSES.forEach(function (c) { track.classList.remove(c); });
      TRACK_ON_CLASSES.forEach(function (c) { track.classList.add(c); });
      thumb.classList.remove('translate-x-0');
      thumb.classList.add(ON_CLASS);
    } else {
      TRACK_ON_CLASSES.forEach(function (c) { track.classList.remove(c); });
      TRACK_OFF_CLASSES.forEach(function (c) { track.classList.add(c); });
      thumb.classList.remove(ON_CLASS);
      thumb.classList.add('translate-x-0');
    }
  }

  input.addEventListener('change', function () {
    _checked = input.checked;
    render();
  });

  render();
})();
</script>

```
