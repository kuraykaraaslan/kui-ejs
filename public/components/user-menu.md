# UserMenu

- **id:** `user-menu`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/user/UserMenu.ejs`
- **status:** stable
- **since:** 0.1

Avatar + isim + rol trigger. Profile, Settings ve Sign out öğeleri içeren dropdown. Dışarı tıklayınca kapanır.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--error-subtle`
- `--primary`
- `--secondary`
- `--surface-overlay`
- `--surface-raised`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Closed (default)

```ejs
<%- include('modules/domain/common/user/UserMenu', {
  name:  user.name,
  email: user.email,
  role:  user.role,
  src:   user.profilePicture,
  profileHref:  '/account/profile',
  settingsHref: '/account/settings',
  signOutHref:  '/auth/logout',
  signOutMethod: 'post'
}) %>
```

### Dropdown open (static preview)

```ejs
<!-- Dropdown panel content (shown when open) -->
<%- include('modules/domain/common/user/UserMenu', {
  name:  'Alice Johnson',
  email: 'alice@example.com',
  align: 'right'
}) %>
```

## Full EJS source

```ejs
<%
  var _id          = locals.id          || 'user-menu-' + Math.random().toString(36).substr(2, 9);
  var _name        = locals.name        || (locals.user && locals.user.name) || 'User';
  var _email       = locals.email       || (locals.user && locals.user.email) || '';
  var _role        = locals.role        || (locals.user && locals.user.role)  || '';
  var _src         = locals.src         || (locals.user && locals.user.profilePicture) || null;
  var _align       = locals.align       || 'right';
  var _profileHref = locals.profileHref || '#';
  var _settingsHref = locals.settingsHref || '#';
  var _signOutHref  = locals.signOutHref  || '#';
  var _signOutMethod = locals.signOutMethod || 'get';

  var dropdownAlignClass = _align === 'right' ? 'right-0' : 'left-0';
%>
<div id="<%= _id %>" class="relative inline-block<%= locals.className ? ' ' + locals.className : '' %>">
  <!-- Trigger -->
  <button
    type="button"
    aria-haspopup="true"
    aria-expanded="false"
    aria-label="User menu for <%= _name %>"
    onclick="toggleUserMenu('<%= _id %>')"
    class="inline-flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
  >
    <%- include('../../../ui/Avatar', { name: _name, src: _src, size: 'sm' }) %>
    <div class="hidden sm:block text-left min-w-0">
      <p class="text-sm font-medium text-text-primary truncate max-w-[8rem]"><%= _name %></p>
      <% if (_role) { %><p class="text-xs text-text-secondary truncate"><%= _role %></p><% } %>
    </div>
    <i class="fa-solid fa-chevron-down w-3 h-3 text-text-disabled hidden sm:block text-xs" aria-hidden="true"></i>
  </button>

  <!-- Dropdown -->
  <div
    id="<%= _id %>-dropdown"
    class="absolute <%= dropdownAlignClass %> top-full mt-1 w-56 rounded-xl border border-border bg-surface-raised shadow-lg z-50 overflow-hidden hidden"
    role="menu"
    aria-label="User menu"
  >
    <!-- User info header -->
    <div class="px-3 py-2.5 border-b border-border">
      <p class="text-sm font-semibold text-text-primary truncate"><%= _name %></p>
      <% if (_email) { %><p class="text-xs text-text-secondary truncate"><%= _email %></p><% } %>
    </div>
    <!-- Items -->
    <div class="py-1">
      <a href="<%= _profileHref %>" role="menuitem"
        class="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-overlay transition-colors">
        <i class="fa-solid fa-user w-3.5 h-3.5 text-text-secondary text-xs shrink-0" aria-hidden="true"></i>
        Profile
      </a>
      <a href="<%= _settingsHref %>" role="menuitem"
        class="flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-surface-overlay transition-colors">
        <i class="fa-solid fa-gear w-3.5 h-3.5 text-text-secondary text-xs shrink-0" aria-hidden="true"></i>
        Settings
      </a>
    </div>
    <div class="py-1 border-t border-border">
      <% if (_signOutMethod === 'post') { %>
      <form action="<%= _signOutHref %>" method="post" class="w-full">
        <button type="submit" role="menuitem"
          class="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error-subtle transition-colors text-left">
          <i class="fa-solid fa-arrow-right-from-bracket w-3.5 h-3.5 shrink-0 text-xs" aria-hidden="true"></i>
          Sign out
        </button>
      </form>
      <% } else { %>
      <a href="<%= _signOutHref %>" role="menuitem"
        class="flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error-subtle transition-colors">
        <i class="fa-solid fa-arrow-right-from-bracket w-3.5 h-3.5 shrink-0 text-xs" aria-hidden="true"></i>
        Sign out
      </a>
      <% } %>
    </div>
  </div>
</div>

<script>
(function () {
  function toggleUserMenu(id) {
    var dd = document.getElementById(id + '-dropdown');
    var btn = document.querySelector('#' + id + ' [aria-haspopup]');
    if (!dd || !btn) return;
    var isOpen = !dd.classList.contains('hidden');
    dd.classList.toggle('hidden', isOpen);
    btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  }

  window.toggleUserMenu = window.toggleUserMenu || toggleUserMenu;

  document.addEventListener('click', function (e) {
    document.querySelectorAll('[id^="user-menu-"]').forEach(function (menu) {
      var dd  = document.getElementById(menu.id + '-dropdown');
      var btn = menu.querySelector('[aria-haspopup]');
      if (!dd || !btn) return;
      if (!menu.contains(e.target)) {
        dd.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });
})();
</script>

```
