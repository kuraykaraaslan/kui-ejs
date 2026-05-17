# AppNav

- **id:** `app-nav`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/AppNav.ejs`
- **status:** stable
- **since:** 0.1

Yatay navigasyon çubuğu. Masaüstünde inline linkler, mobilde hamburger drawer açar. logoContent, navItems ve children slotları. sticky ve bordered seçenekleri.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--primary-subtle`
- `--secondary`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Marketing bar (logo + links + CTA)

```ejs
<%- include('modules/app/AppNav', {
  logoContent: '<span class="text-sm font-bold text-primary">Acme</span>',
  navItems: [
    { label: 'Home',     href: '/',         active: currentPath === '/' },
    { label: 'Features', href: '/features', active: currentPath === '/features' },
    { label: 'Pricing',  href: '/pricing',  active: currentPath === '/pricing' },
    { label: 'Docs',     href: '/docs',     active: currentPath === '/docs' },
  ],
  children: `
    <%- include('modules/ui/Button', { variant: 'outline', children: 'Sign in', href: '/login' }) %>
    <%- include('modules/ui/Button', { children: 'Get started', href: '/register' }) %>
  `
}) %>
```

### App bar (links + UserMenu)

```ejs
<%- include('modules/app/AppNav', {
  logoContent: '<span class="text-sm font-bold text-text-primary">Dashboard</span>',
  navItems: [
    { label: 'Overview',  href: '/dashboard',           active: true },
    { label: 'Analytics', href: '/dashboard/analytics'  },
    { label: 'Projects',  href: '/dashboard/projects'   },
    { label: 'Team',      href: '/dashboard/team'       },
  ],
  children: `
    <%- include('modules/domain/common/user/UserMenu', { name: user.name, role: user.role }) %>
  `
}) %>
```

## Full EJS source

```ejs
<%
  var _navItems = locals.navItems || [];
  var _sticky   = !!locals.sticky;
  var _bordered = locals.bordered !== false;
  var _drawerId = 'appnav-drawer-' + Math.random().toString(36).substr(2,6);
  var _title    = locals.mobileSidebarTitle || 'Navigation';
%>
<header class="w-full flex items-center gap-3 px-4 py-3 bg-surface-raised<%= _bordered ? ' border-b border-border' : '' %><%= _sticky ? ' sticky top-0 z-40' : '' %><%= locals.className ? ' '+locals.className : '' %>">

  <!-- Mobile hamburger -->
  <div class="md:hidden">
    <button type="button" onclick="openDrawer('<%= _drawerId %>')"
      aria-label="Open navigation menu"
      class="inline-flex items-center justify-center w-9 h-9 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
      <i class="fa-solid fa-bars" aria-hidden="true"></i>
    </button>
  </div>

  <% if (locals.logoContent) { %><div class="shrink-0"><%- locals.logoContent %></div><% } %>

  <nav class="hidden md:flex items-center gap-0.5 flex-1" aria-label="Main navigation">
    <% _navItems.forEach(function(item) { %>
    <a href="<%= item.href || '#' %>"
       <%= item.active ? 'aria-current="page"' : '' %>
       class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors <%= item.active ? 'bg-primary-subtle text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay' %>">
      <%= item.label %>
    </a>
    <% }); %>
  </nav>

  <% if (locals.children) { %>
  <div class="flex items-center gap-2 ml-auto shrink-0"><%- locals.children %></div>
  <% } %>
</header>

<%- include('./NavDrawer', { id: _drawerId, title: _title, side: 'left', open: false, navItems: _navItems }) %>

```
