# TreeView

- **id:** `tree-view`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/TreeView/TreeView.ejs`
- **status:** stable
- **since:** 2026-05

Collapsible tree with keyboard navigation, selection, and aria-tree roles.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--secondary`
- `--surface-overlay`
- `--text-secondary`

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

### Multi-select + type-ahead

```ejs
<%- include('modules/ui/TreeView', {
  label: 'Project files',
  selectionMode: 'multi',
  selectedIds: ['Card'],
  nodes: [
    { id: 'docs', label: 'Documents', children: [
      { id: 'spec',    label: 'spec.md' },
      { id: 'roadmap', label: 'roadmap.md' },
    ]},
    { id: 'src', label: 'src', children: [
      { id: 'Button',   label: 'Button.ejs' },
      { id: 'Card',     label: 'Card.ejs' },
      { id: 'Drawer',   label: 'Drawer.ejs' },
      { id: 'TreeView', label: 'TreeView.ejs' },
    ]},
  ]
}) %>

<%# Try it:
%   - Cmd/Ctrl-click       → toggle individual rows
%   - Shift-click          → range-select between anchor and clicked row
%   - Type "tre"           → focus jumps to "TreeView.ejs"
%   - Cmd/Ctrl+A           → select all visible rows
%   - Arrow keys / Home / End / Space / Enter — full keyboard nav.
%>
```

## Full EJS source

```ejs
<%
  // modules/ui/TreeView/TreeView.ejs — M1 entry point.
  //
  // Pixel-parity contract with `modules/ui/TreeView/index.tsx` (NextJS).
  // Recursive node rendering lives in `partials/_node.ejs`; behaviour lives in
  // `scripts/tree-state.js` + `scripts/keyboard.js`.
  //
  // Backwards-compat: legacy `modules/ui/TreeView.ejs` is a shim that
  // forwards to this template, so existing callers keep working.
  var _nodes         = locals.nodes         || [];
  var _selectedId    = locals.selectedId    || '';
  var _selectedIds   = locals.selectedIds   || (_selectedId ? [_selectedId] : []);
  var _label         = locals.label         || 'Tree';
  var _className     = locals.className     || '';
  var _selectionMode = locals.selectionMode || 'single';
  var _hideToolbar   = locals.hideToolbar   === true;
  var _focusId       = locals.focusId       || (_selectedIds[0] || '');
  var _id            = locals.id            || 'treeview-' + Math.random().toString(36).substr(2, 9);
  var _expandAllLbl   = (locals.messages && locals.messages.expandAll)   || 'Expand all';
  var _collapseAllLbl = (locals.messages && locals.messages.collapseAll) || 'Collapse all';

  function _hasAnyChildren(arr) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].children && arr[i].children.length) return true;
    }
    return false;
  }
  var _showToolbar = !_hideToolbar && _hasAnyChildren(_nodes);
%>
<div class="flex flex-col gap-1<%= _className ? ' ' + _className : '' %>">
  <% if (_showToolbar) { %>
  <div data-tree-toolbar class="flex items-center gap-1 px-1 pb-1 text-xs text-text-secondary">
    <button type="button" data-tree-action="expand-all"
      data-tree-target="<%= _id %>"
      class="inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus transition-colors">
      <i class="fa-solid fa-angles-down w-3 h-3" aria-hidden="true"></i>
      <span><%= _expandAllLbl %></span>
    </button>
    <button type="button" data-tree-action="collapse-all"
      data-tree-target="<%= _id %>"
      class="inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus transition-colors">
      <i class="fa-solid fa-angles-up w-3 h-3" aria-hidden="true"></i>
      <span><%= _collapseAllLbl %></span>
    </button>
  </div>
  <% } %>

  <ul
    id="<%= _id %>"
    role="tree"
    aria-label="<%= _label %>"
    <% if (_selectionMode === 'multi') { %>aria-multiselectable="true"<% } %>
    data-selected-id="<%= _selectedIds[_selectedIds.length - 1] || '' %>"
    data-selection-mode="<%= _selectionMode %>"
    class="space-y-0.5"
  >
    <% _nodes.forEach(function (node, idx) { %>
      <%- include('./partials/_node', {
        node: node,
        depth: 0,
        selectedIds: _selectedIds,
        focusId: _focusId,
        siblings: _nodes.length,
        posInSet: idx + 1
      }) %>
    <% }); %>
  </ul>
</div>

<%- include('./scripts/tree-state', { _id: _id }) %>
<%- include('./scripts/keyboard',    { _id: _id }) %>

```
