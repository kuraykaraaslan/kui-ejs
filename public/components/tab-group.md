# TabGroup

- **id:** `tab-group`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/TabGroup.ejs`
- **status:** stable
- **since:** 0.1

Erişilebilir tab navigasyonu. ARIA rollerini, klavye gezintisini ve içerik panellerini içerir.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--secondary`
- `--text-primary`
- `--text-secondary`

## Variants

### Default

```ejs
<%- include('modules/ui/TabGroup', {
  tabs: [
    { id: 'overview', label: 'Overview', content: '<p>Overview panel content.</p>' },
    { id: 'details',  label: 'Details',  content: '<p>Details panel content.</p>' },
    { id: 'history',  label: 'History',  content: '<p>History panel content.</p>' },
  ]
}) %>
```

### With icons

```ejs
<%- include('modules/ui/TabGroup', {
  tabs: [
    { id: 'home',     label: 'Home',     icon: 'fa-house', content: '<p>Home content.</p>' },
    { id: 'users',    label: 'Users',    icon: 'fa-users', content: '<p>Users content.</p>' },
    { id: 'settings', label: 'Settings', icon: 'fa-gear',  content: '<p>Settings content.</p>' },
  ]
}) %>
```

### With disabled tab

```ejs
<%- include('modules/ui/TabGroup', {
  tabs: [
    { id: 'active',   label: 'Active',   content: '<p>Active tab content.</p>' },
    { id: 'disabled', label: 'Disabled', content: '', disabled: true },
    { id: 'another',  label: 'Another',  content: '<p>Another tab content.</p>' },
  ]
}) %>
```

## Full EJS source

```ejs
<%
  var _tabs      = locals.tabs      || [];
  var _activeTab = locals.activeTab || (_tabs.length > 0 ? _tabs[0].id : '');
  var _label     = locals.label     || 'Tabs';
  var _id        = locals.id        || 'tabgroup-' + Math.random().toString(36).substr(2, 9);
%>
<div id="<%= _id %>" class="w-full">
  <div role="tablist" aria-label="<%= _label %>" class="flex border-b border-border">
    <% _tabs.forEach(function (tab) { %>
    <button
      type="button"
      role="tab"
      id="<%= _id %>-tab-<%= tab.id %>"
      aria-selected="<%= tab.id === _activeTab ? 'true' : 'false' %>"
      aria-controls="<%= _id %>-panel-<%= tab.id %>"
      <%= tab.disabled ? 'aria-disabled="true"' : '' %>
      tabindex="<%= tab.id === _activeTab ? '0' : '-1' %>"
      onclick="<%= !tab.disabled ? 'activateTab(\'' + _id + '\', \'' + tab.id + '\')' : '' %>"
      class="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus <%= tab.disabled ? 'opacity-40 cursor-not-allowed pointer-events-none border-transparent text-text-secondary' : (tab.id === _activeTab ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border') %>"
    >
      <% if (tab.icon) { %><i class="fa-solid <%= tab.icon %> text-sm" aria-hidden="true"></i><% } %>
      <%= tab.label %>
      <% if (tab.badge) { %><span class="shrink-0"><%- tab.badge %></span><% } %>
    </button>
    <% }); %>
  </div>

  <% _tabs.forEach(function (tab) { %>
  <div
    id="<%= _id %>-panel-<%= tab.id %>"
    role="tabpanel"
    aria-labelledby="<%= _id %>-tab-<%= tab.id %>"
    tabindex="0"
    <%= tab.id !== _activeTab ? 'hidden' : '' %>
    class="py-4 focus-visible:outline-none"
  >
    <%- tab.content || '' %>
  </div>
  <% }); %>
</div>

<script>
(function () {
  function activateTab(groupId, tabId) {
    var group = document.getElementById(groupId);
    if (!group) return;
    group.querySelectorAll('[role="tab"]').forEach(function (t) {
      var active = t.id === groupId + '-tab-' + tabId;
      t.setAttribute('aria-selected', active ? 'true' : 'false');
      t.setAttribute('tabindex', active ? '0' : '-1');
      t.classList.toggle('border-primary', active);
      t.classList.toggle('text-primary', active);
      t.classList.toggle('border-transparent', !active);
      t.classList.toggle('text-text-secondary', !active);
    });
    group.querySelectorAll('[role="tabpanel"]').forEach(function (p) {
      var active = p.id === groupId + '-panel-' + tabId;
      active ? p.removeAttribute('hidden') : p.setAttribute('hidden', '');
    });
  }
  window.activateTab = window.activateTab || activateTab;
})();
</script>

```
