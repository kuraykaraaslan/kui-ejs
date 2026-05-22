# AppSidebar

- **id:** `app-sidebar`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/AppSidebar.ejs`
- **status:** stable
- **since:** 2025-03

Daraltılabilir kenar çubuğu. navGroups veya navItems alır; collapsed toggle dahili. searchable prop ile yerleşik arama filtresi; footerContent slotu ile kullanıcı bilgisi gösterilebilir.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--primary-subtle`
- `--secondary`
- `--surface-base`
- `--surface-overlay`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Açık (grouped nav + footer)

```ejs
<%- include('modules/app/AppSidebar', {
  navGroups: [
    { label: 'Main', items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-house', href: '/' },
      { id: 'analytics', label: 'Analytics',  icon: 'fa-solid fa-chart-bar', badge: 3, href: '/analytics' },
    ]},
    { label: 'Settings', items: [
      { id: 'team',     label: 'Team',     icon: 'fa-solid fa-users', href: '/team' },
      { id: 'settings', label: 'Settings', icon: 'fa-solid fa-gear',  href: '/settings' },
    ]},
  ],
  activeId: currentPage,
  footerContent: userMenuHtml
}) %>
```

### Arama filtreli sidebar

```ejs
<%- include('modules/app/AppSidebar', {
  navGroups: navGroups,
  activeId: currentPage,
  searchable: true
}) %>
```

### Daraltılmış (icon-only)

```ejs
<%- include('modules/app/AppSidebar', {
  navGroups: navGroups,
  activeId:  currentPage,
  collapsed: true
}) %>
```

## Full EJS source

```ejs
<%
  var _id         = locals.id || ('sidebar-' + Math.random().toString(36).substr(2,6));
  var _activeId   = locals.activeId || '';
  var _collapsed  = !!locals.collapsed;
  var _groups     = locals.navGroups || (locals.navItems ? [{ items: locals.navItems }] : []);
  var _searchable = locals.searchable !== false;
  var _searchId   = _id + '-search';
%>
<div id="<%= _id %>"
  data-collapsed="<%= _collapsed %>"
  class="flex flex-col flex-1 min-h-0 transition-all duration-200 w-full<%= _collapsed ? ' lg:w-14' : ' lg:w-56' %>">

  <!-- Collapse toggle (desktop only) -->
  <div class="hidden lg:flex items-center px-2 py-2 border-b border-border shrink-0 <%= _collapsed ? 'justify-center' : 'justify-end' %>">
    <button type="button" onclick="toggleAppSidebar('<%= _id %>')"
      aria-label="<%= _collapsed ? 'Expand sidebar' : 'Collapse sidebar' %>"
      class="p-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
      <i class="fa-solid fa-chevron-left<%= _collapsed ? ' rotate-180' : '' %> transition-transform" aria-hidden="true"></i>
    </button>
  </div>

  <% if (_searchable) { %>
  <div class="<%= _collapsed ? 'hidden' : '' %> px-3 py-2 border-b border-border shrink-0" id="<%= _searchId %>-wrap">
    <div class="relative">
      <i class="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-text-disabled text-xs" aria-hidden="true"></i>
      <input
        id="<%= _searchId %>"
        type="search"
        placeholder="Search…"
        autocomplete="off"
        class="w-full rounded-md border border-border bg-surface-base pl-7 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-border-focus"
        aria-label="Search navigation"
      />
    </div>
  </div>
  <% } %>

  <nav class="flex-1 min-h-0 overflow-y-auto px-2 py-3 space-y-4" aria-label="Sidebar navigation">
    <% _groups.forEach(function(group, gi) {
      var gKey = (group.label || String(gi)).replace(/\s+/g,'_');
      var hasActive = (group.items||[]).some(function(i){ return i.id === _activeId; });
      var _expanded = group.collapsible ? (!!group.defaultExpanded || hasActive) : true;
    %>
    <div data-group-section data-group-key="<%= gKey %>">
      <% if (group.label && !_collapsed) { %>
        <% if (group.collapsible) { %>
        <button type="button" onclick="toggleSidebarGroup('<%= _id %>','<%= gKey %>')"
          aria-expanded="<%= _expanded ? 'true' : 'false' %>"
          class="w-full flex items-center justify-between px-3 py-1 rounded-md mb-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus <%= hasActive ? 'text-text-primary' : 'text-text-disabled hover:text-text-secondary' %>">
          <span class="text-[10px] font-semibold uppercase tracking-widest"><%= group.label %></span>
          <i class="fa-solid fa-chevron-down text-xs transition-transform<%= _expanded ? '' : ' -rotate-90' %>" id="<%= _id %>-gicon-<%= gKey %>" aria-hidden="true"></i>
        </button>
        <% } else { %>
        <p class="text-[10px] font-semibold uppercase tracking-widest text-text-disabled px-3 mb-1"><%= group.label %></p>
        <% } %>
      <% } %>
      <div class="space-y-0.5<%= _expanded ? '' : ' hidden' %>" id="<%= _id %>-gitems-<%= gKey %>">
        <% (group.items||[]).forEach(function(item) {
          var isActive = item.id === _activeId;
          var cls = 'w-full flex items-center gap-2.5 rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus '
            + (_collapsed ? 'justify-center px-2 py-2' : 'px-3 py-2 text-left ')
            + (isActive ? 'bg-primary-subtle text-primary font-medium' : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay');
        %>
        <div data-nav-item data-search-title="<%= (item.label||'').toLowerCase() %>">
        <% if (item.href) { %>
        <a href="<%= item.href %>" <%= isActive ? 'aria-current="page"' : '' %> <%= (_collapsed && item.label) ? 'title="'+item.label+'"' : '' %> class="<%= cls %>">
        <% } else { %>
        <button type="button" <%= isActive ? 'aria-current="page"' : '' %> <%= (_collapsed && item.label) ? 'title="'+item.label+'"' : '' %> class="<%= cls %>">
        <% } %>
          <% if (item.icon) { %><span class="shrink-0 w-5 text-center text-[15px] leading-none" aria-hidden="true"><%- item.icon %></span><% } %>
          <% if (!_collapsed) { %><span class="flex-1 truncate"><%= item.label %></span><% } %>
          <% if (!_collapsed && item.badge) { %>
          <%# Badge variant="primary" size="sm" %>
          <span class="inline-flex items-center gap-1 rounded-full font-medium bg-primary-subtle text-primary px-1.5 py-0 text-[10px]"><%= item.badge %></span>
          <% } %>
        <% if (item.href) { %></a><% } else { %></button><% } %>
        </div>
        <% }); %>
      </div>
    </div>
    <% }); %>
  </nav>

  <% if (locals.footerContent) { %>
  <div class="border-t border-border shrink-0<%= _collapsed ? ' flex justify-center px-2 py-3' : '' %>">
    <%- locals.footerContent %>
  </div>
  <% } %>
</div>
<script>
(function(){
  function toggleAppSidebar(id){
    var el=document.getElementById(id);if(!el)return;
    var c=el.dataset.collapsed==='true';
    el.dataset.collapsed=c?'false':'true';
    el.classList.toggle('lg:w-14',!c);el.classList.toggle('lg:w-56',c);
    var btn=el.querySelector('[aria-label]');
    if(btn)btn.setAttribute('aria-label',c?'Collapse sidebar':'Expand sidebar');
    el.querySelectorAll('.fa-chevron-left').forEach(function(i){i.classList.toggle('rotate-180',!c);});
    el.querySelectorAll('[id$="-gitems-"]').forEach(function(d){
      var labels=d.querySelectorAll('span.flex-1');
      labels.forEach(function(l){l.classList.toggle('hidden',!c);});
    });
    // Hide search when collapsed
    var sw=document.getElementById(id+'-search-wrap');
    if(sw)sw.classList.toggle('hidden',!c);
  }
  function toggleSidebarGroup(sid,key){
    var items=document.getElementById(sid+'-gitems-'+key);
    var icon=document.getElementById(sid+'-gicon-'+key);
    if(!items)return;
    var hidden=items.classList.toggle('hidden');
    if(icon)icon.classList.toggle('-rotate-90',hidden);
  }
  // Sidebar search
  (function initSidebarSearch(id){
    var input=document.getElementById(id+'-search');
    if(!input)return;
    var sidebar=document.getElementById(id);
    var timer=null;
    function filter(q){
      q=q.trim().toLowerCase();
      var groups=sidebar.querySelectorAll('[data-group-section]') // only within this sidebar instance won't work without parent scope
        || [];
      // fallback: use nav element as scope
      var nav=sidebar.querySelector('nav');
      var scope=nav||sidebar;
      if(!q){
        scope.querySelectorAll('[data-nav-item]').forEach(function(el){el.style.display='';});
        scope.querySelectorAll('[data-group-section]').forEach(function(el){el.style.display='';});
        return;
      }
      scope.querySelectorAll('[data-group-section]').forEach(function(g){
        var items=g.querySelectorAll('[data-nav-item]');
        var visible=false;
        items.forEach(function(item){
          var t=(item.getAttribute('data-search-title')||'').toLowerCase();
          var m=t.includes(q);
          item.style.display=m?'':'none';
          if(m)visible=true;
        });
        g.style.display=visible?'':'none';
      });
    }
    input.addEventListener('input',function(){
      clearTimeout(timer);
      timer=setTimeout(function(){filter(input.value);},150);
    });
    input.addEventListener('keydown',function(e){
      if(e.key==='Escape'){input.value='';filter('');}
    });
  })('<%= _id %>');
  window.toggleAppSidebar=window.toggleAppSidebar||toggleAppSidebar;
  window.toggleSidebarGroup=window.toggleSidebarGroup||toggleSidebarGroup;
})();
</script>

```
