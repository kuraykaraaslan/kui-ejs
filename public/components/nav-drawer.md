# NavDrawer

- **id:** `nav-drawer`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/NavDrawer.ejs`
- **status:** stable
- **since:** 2025-03

Wrapper that wraps any trigger and children inside a drawer. Manages its own open/closed state. Used as AppNav's mobile menu and also works standalone.

## Design tokens consumed

- `--primary`
- `--primary-subtle`
- `--surface-overlay`
- `--text-primary`

## Variants

### Sol nav (standalone)

```ejs
<%- include('modules/app/NavDrawer', {
  title: 'Navigation',
  side: 'left',
  navItems: [
    { label: 'Home',     href: '/',         active: currentPath === '/' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing',  href: '/pricing'  },
    { label: 'Blog',     href: '/blog'     },
  ]
}) %>
```

### Sağ panel (cart/settings)

```ejs
<%- include('modules/app/NavDrawer', {
  title: 'Cart (' + cartCount + ')',
  side: 'right',
  children: cartItemsHtml,
  footerContent: '<button ...>Checkout</button>'
}) %>
```

## Full EJS source

```ejs
<%
  var _id    = locals.id || ('nav-drawer-' + Math.random().toString(36).substr(2,6));
  var _title = locals.title || 'Menu';
  var _side  = locals.side  || 'left';
  var _items = locals.navItems || [];
%>
<%
  var _navContent = locals.children;
  if (!_navContent && _items.length) {
    var _links = _items.map(function(item){
      return '<a href="'+(item.href||'#')+'"'+(item.active?' aria-current="page"':'')+' class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors '+(item.active?'bg-primary-subtle text-primary':'text-text-primary hover:bg-surface-overlay')+'">'+item.label+'</a>';
    }).join('');
    _navContent = '<nav class="flex flex-col gap-0.5 pt-1" aria-label="Mobile navigation">'+_links+'</nav>';
  }
%>
<%- include('../ui/Drawer', {
  id:       _id,
  title:    _title,
  side:     _side,
  open:     !!locals.open,
  footer:   locals.footerContent || '',
  children: _navContent || ''
}) %>

```
