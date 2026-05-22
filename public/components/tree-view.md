# TreeView

- **id:** `tree-view`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/TreeView.ejs`
- **status:** stable
- **since:** 2026-05

Collapsible tree with keyboard navigation, selection, and aria-tree roles.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--primary-subtle`
- `--surface-overlay`
- `--text-disabled`

## Variants

### File tree

```ejs
<%- include('modules/ui/TreeView', {
  label: 'Files',
  selectedId: selectedId,
  nodes: [
    { id: 'src', label: 'src', children: [
      { id: 'components', label: 'components', children: [
        { id: 'Button', label: 'Button.ejs' },
        { id: 'Card',   label: 'Card.ejs' },
      ]},
      { id: 'routes', label: 'routes', children: [
        { id: 'index', label: 'index.ts' },
        { id: 'users', label: 'users.ts' },
      ]},
    ]},
    { id: 'package', label: 'package.json' },
  ]
}) %>
```

### Navigation menu

```ejs
<%- include('modules/ui/TreeView', {
  label: 'Settings navigation',
  selectedId: 'billing',
  nodes: [
    { id: 'account', label: 'Account', children: [
      { id: 'profile',  label: 'Profile' },
      { id: 'password', label: 'Password' },
    ]},
    { id: 'workspace', label: 'Workspace', children: [
      { id: 'general', label: 'General' },
      { id: 'billing', label: 'Billing' },
    ]},
    { id: 'integrations', label: 'Integrations' },
  ]
}) %>
```

### Flat list

```ejs
<%- include('modules/ui/TreeView', {
  label: 'Language selector',
  selectedId: 'ts',
  nodes: [
    { id: 'ts', label: 'TypeScript' },
    { id: 'js', label: 'JavaScript' },
    { id: 'py', label: 'Python' },
    { id: 'go', label: 'Go' },
  ]
}) %>
```

## Full EJS source

```ejs
<%
  var _nodes      = locals.nodes      || [];
  var _selectedId = locals.selectedId || '';
  var _label      = locals.label      || 'Tree';
  var _className  = locals.className  || '';
  var _depth      = (locals.depth !== undefined) ? locals.depth : 0;
  var _isRoot     = _depth === 0;
  var _id         = locals.id         || 'treeview-' + Math.random().toString(36).substr(2, 9);
%>
<% if (_isRoot) { %>
<ul
  id="<%= _id %>"
  role="tree"
  aria-label="<%= _label %>"
  data-selected-id="<%= _selectedId %>"
  class="space-y-0.5<%= _className ? ' ' + _className : '' %>"
>
<% } else { %>
<ul role="group" class="ml-0">
<% } %>
  <% _nodes.forEach(function (node) { %>
  <%
    var hasChildren = node.children && node.children.length > 0;
    var isSelected  = node.id === _selectedId;
    var rowCls = 'flex items-center gap-1.5 px-2 py-1.5 text-sm rounded-md cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus hover:bg-surface-overlay transition-colors' + (isSelected ? ' bg-primary-subtle text-primary font-medium' : '');
  %>
  <li
    role="treeitem"
    data-tree-node-id="<%= node.id %>"
    data-has-children="<%= hasChildren ? 'true' : 'false' %>"
    <% if (hasChildren) { %>aria-expanded="true"<% } %>
    aria-selected="<%= isSelected ? 'true' : 'false' %>"
  >
    <div
      tabindex="0"
      data-tree-row
      style="padding-left: <%= _depth * 1.25 %>rem;"
      class="<%= rowCls %>"
    >
      <% if (hasChildren) { %>
      <span aria-hidden="true" data-tree-chevron class="text-text-disabled w-3 shrink-0 flex items-center justify-center">
        <i class="fa-solid fa-chevron-down w-2.5 h-2.5" aria-hidden="true"></i>
      </span>
      <% } else { %>
      <span class="w-3 shrink-0" aria-hidden="true"></span>
      <% } %>
      <span><%= node.label %></span>
    </div>

    <% if (hasChildren) { %>
    <%- include('TreeView', { nodes: node.children, depth: _depth + 1, selectedId: _selectedId, label: _label }) %>
    <% } %>
  </li>
  <% }); %>
</ul>

<% if (_isRoot) { %>
<script>
(function () {
  var root = document.getElementById('<%= _id %>');
  if (!root || root.dataset.treeInit === '1') return;
  root.dataset.treeInit = '1';

  function toggleItem(item) {
    var expanded = item.getAttribute('aria-expanded') === 'true';
    var next = !expanded;
    item.setAttribute('aria-expanded', next ? 'true' : 'false');
    var group = item.querySelector(':scope > ul[role="group"]');
    if (group) group.hidden = !next;
    var chev = item.querySelector(':scope > [data-tree-row] > [data-tree-chevron] > i');
    if (chev) {
      chev.classList.toggle('fa-chevron-down', next);
      chev.classList.toggle('fa-chevron-right', !next);
    }
  }

  function selectItem(item) {
    var id = item.getAttribute('data-tree-node-id');
    root.querySelectorAll('[role="treeitem"]').forEach(function (it) {
      var sel = it === item;
      it.setAttribute('aria-selected', sel ? 'true' : 'false');
      var row = it.querySelector(':scope > [data-tree-row]');
      if (row) {
        row.classList.toggle('bg-primary-subtle', sel);
        row.classList.toggle('text-primary', sel);
        row.classList.toggle('font-medium', sel);
      }
    });
    root.dataset.selectedId = id;
    root.dispatchEvent(new CustomEvent('treeview:select', { detail: { id: id }, bubbles: true }));
  }

  function handleActivate(row) {
    var item = row.closest('[role="treeitem"]');
    if (!item) return;
    if (item.getAttribute('data-has-children') === 'true') {
      toggleItem(item);
    } else {
      selectItem(item);
    }
  }

  root.addEventListener('click', function (e) {
    var row = e.target.closest('[data-tree-row]');
    if (!row || !root.contains(row)) return;
    handleActivate(row);
  });

  root.addEventListener('keydown', function (e) {
    var row = e.target.closest('[data-tree-row]');
    if (!row || !root.contains(row)) return;
    var item = row.closest('[role="treeitem"]');
    if (!item) return;
    var hasChildren = item.getAttribute('data-has-children') === 'true';
    var expanded = item.getAttribute('aria-expanded') === 'true';

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleActivate(row);
    } else if (e.key === 'ArrowRight' && hasChildren && !expanded) {
      e.preventDefault();
      toggleItem(item);
    } else if (e.key === 'ArrowLeft' && hasChildren && expanded) {
      e.preventDefault();
      toggleItem(item);
    }
  });
})();
</script>
<% } %>

```
