# AppFooter

- **id:** `app-footer`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/AppFooter.ejs`
- **status:** stable
- **since:** 2026-05

Uygulama alt çubuğu. Üst satır: logo + sürüm + nav + status badge. Alt satır: copyright + sosyal medya. Tüm bölgeler slot olarak opsiyonel.

## Design tokens consumed

- `--border`
- `--error`
- `--error-fg`
- `--error-subtle`
- `--primary`
- `--secondary`
- `--success`
- `--success-fg`
- `--success-subtle`
- `--surface-base`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`
- `--warning`
- `--warning-fg`
- `--warning-subtle`

## Variants

### Full — logo + nav + status + social

```ejs
<%- include('modules/app/AppFooter', {
  logoContent: '<span class="text-sm font-bold text-primary">Acme</span>',
  version:   '2.4.1',
  status:    'operational',
  copyright: '© 2026 Acme Corp. All rights reserved.',
  navContent: `
    <a href="/docs"      class="px-3 py-1.5 text-sm">Docs</a>
    <a href="/changelog" class="px-3 py-1.5 text-sm">Changelog</a>
    <a href="/support"   class="px-3 py-1.5 text-sm">Support</a>
    <a href="/pricing"   class="px-3 py-1.5 text-sm">Pricing</a>
  `,
  socialContent: `
    <a href="https://github.com/acme"   aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
    <a href="https://x.com/acme"        aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>
    <a href="https://linkedin.com/acme" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
  `
}) %>
```

### Minimal — copyright + status only

```ejs
<%- include('modules/app/AppFooter', {
  logoContent: '<span class="text-sm font-bold text-primary">Acme</span>',
  status:    'degraded',
  copyright: '© 2026 Acme Corp.'
}) %>
```

## Full EJS source

```ejs
<%
  var _status = locals.status || null;
  var statusMap = {
    operational: { cls: 'bg-success-subtle text-success-fg', dot: 'bg-success', label: 'Operational' },
    degraded:    { cls: 'bg-warning-subtle text-warning-fg', dot: 'bg-warning', label: 'Degraded' },
    outage:      { cls: 'bg-error-subtle text-error-fg',     dot: 'bg-error',   label: 'Outage' }
  };
  var _sc = _status ? statusMap[_status] : null;
%>
<footer class="w-full border border-border rounded-xl bg-surface-raised overflow-hidden<%= locals.className ? ' '+locals.className : '' %>">
  <div class="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-border">
    <div class="flex items-center gap-2">
      <% if (locals.logoContent) { %><%- locals.logoContent %><% } %>
      <% if (locals.version) { %>
      <%# Badge variant="neutral" size="md" %>
      <span class="inline-flex items-center rounded-md font-medium bg-surface-overlay text-text-primary px-2.5 py-0.5 text-sm border border-border">v<%= locals.version %></span>
      <% } %>
    </div>
    <% if (locals.navContent) { %>
    <nav aria-label="Footer navigation" class="flex items-center gap-1"><%- locals.navContent %></nav>
    <% } %>
    <% if (_sc) { %>
    <%# Badge variant=<status> size="md" dot %>
    <span class="inline-flex items-center gap-1 rounded-md font-medium <%= _sc.cls %> px-2.5 py-0.5 text-sm border border-border">
      <span class="h-1.5 w-1.5 rounded-full shrink-0 <%= _sc.dot %>" aria-hidden="true"></span>
      <%= _sc.label %>
    </span>
    <% } %>
  </div>
  <div class="flex flex-wrap items-center justify-between gap-4 px-5 py-3 bg-surface-base">
    <% if (locals.copyright) { %><p class="text-xs text-text-secondary"><%= locals.copyright %></p><% } %>
    <% if (locals.socialContent) { %><div class="flex items-center gap-1"><%- locals.socialContent %></div><% } %>
  </div>
</footer>

```
