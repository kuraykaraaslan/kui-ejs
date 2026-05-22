# UserMenu

- **id:** `user-menu`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/user/UserMenu.ejs`
- **status:** stable
- **since:** 2025-03

Avatar + name + role trigger. Dropdown with Profile, Settings, and Sign out items. Closes on outside click.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--secondary`
- `--surface-overlay`
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
  var _onlyAvatar  = !!locals.onlyAvatar;
  var _profileHref  = locals.profileHref  || '#';
  var _settingsHref = locals.settingsHref || '#';
  var _signOutHref  = locals.signOutHref  || '#';

  // Build trigger as Button atom output (rendered via captureInclude).
  // We do this via a string by inlining the same Button atom output we'd render.
  // Because EJS includes can't be captured to a string easily without a helper,
  // we manually compose the trigger using the exact Button atom shape (ghost / sm).
  // This matches `<Button variant="ghost" size="sm" className="gap-2 px-2">…</Button>`.

  // Render Avatar via include into a captured chunk:
  // we rely on the DropdownMenu atom accepting raw HTML strings for `trigger` and `header`.
%>

<%
  // Capture the Avatar markup into a variable so we can embed it in the trigger string.
  var _avatarHtml = '';
%>
<% _avatarHtml %><%
  // We need a way to render Avatar to a string. EJS doesn't natively do this;
  // emit the Avatar HTML inline by including with a flag to write to a buffer
  // is not portable. Instead, use a div placeholder that we hydrate post-render.
%>

<div data-user-menu-host data-id="<%= _id %>" data-align="<%= _align %>">
  <%- include('../../../ui/DropdownMenu', {
    id:     _id,
    align:  _align,
    trigger:
      '<button type="button"' +
      ' aria-label="User menu for ' + _name + '"' +
      ' class="inline-flex items-center justify-center gap-2 px-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed bg-transparent text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm">' +
        '<span data-user-menu-avatar-slot></span>' +
        (_onlyAvatar ? '' :
          '<div class="hidden sm:block text-left min-w-0">' +
            '<p class="text-sm font-medium text-text-primary truncate max-w-[8rem]">' + _name + '</p>' +
            (_role ? '<p class="text-xs text-text-secondary truncate">' + _role + '</p>' : '') +
          '</div>') +
        '<span class="w-3 h-3 inline-flex items-center justify-center text-text-disabled hidden sm:inline-flex" aria-hidden="true">' +
          '<i class="fa-solid fa-chevron-down" style="font-size:12px"></i>' +
        '</span>' +
      '</button>',
    header:
      '<div class="px-3 py-2.5">' +
        '<p class="text-sm font-semibold text-text-primary truncate">' + _name + '</p>' +
        (_email ? '<p class="text-xs text-text-secondary truncate">' + _email + '</p>' : '') +
      '</div>',
    items: [
      { type: 'item', label: 'Profile',  icon: '<i class="fa-solid fa-user w-3.5 h-3.5" aria-hidden="true"></i>',  onClick: "window.location.href='" + _profileHref  + "'" },
      { type: 'item', label: 'Settings', icon: '<i class="fa-solid fa-gear w-3.5 h-3.5" aria-hidden="true"></i>', onClick: "window.location.href='" + _settingsHref + "'" },
      { type: 'separator' },
      { type: 'item', label: 'Sign out', icon: '<i class="fa-solid fa-arrow-right-from-bracket w-3.5 h-3.5" aria-hidden="true"></i>', danger: true, onClick: "window.location.href='" + _signOutHref + "'" }
    ]
  }) %>

  <%# Hidden Avatar — we mount it into the trigger slot via the script below. %>
  <template data-user-menu-avatar-template>
    <%- include('../../../ui/Avatar', { name: _name, src: _src, size: 'sm' }) %>
  </template>
</div>

<script>
(function () {
  var host = document.querySelector('[data-user-menu-host][data-id="<%= _id %>"]');
  if (!host || host.dataset.umInit === '1') return;
  host.dataset.umInit = '1';

  var tpl  = host.querySelector('template[data-user-menu-avatar-template]');
  var slot = host.querySelector('[data-user-menu-avatar-slot]');
  if (tpl && slot) {
    slot.innerHTML = tpl.innerHTML;
    tpl.remove();
  }
})();
</script>

```
