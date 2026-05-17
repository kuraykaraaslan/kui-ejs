# LanguageSwitcher

- **id:** `language-switcher`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/i18n/LanguageSwitcher.ejs`
- **status:** stable
- **since:** 0.1

Native select ile dil seçici. en/tr/de/fr/ar varsayılan diller; autoSubmit ile form aracılığıyla otomatik gönderi.

## Design tokens consumed

- `--border`
- `--primary`
- `--secondary`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### Default (English)

```ejs
<%- include('modules/domain/common/i18n/LanguageSwitcher', {
  value: currentLang,
  name: 'language'
}) %>
```

### Turkish selected

```ejs
<%- include('modules/domain/common/i18n/LanguageSwitcher', {
  value: 'tr'
}) %>
```

### Auto-submit on change

```ejs
<form action="/set-language" method="post">
  <%- include('modules/domain/common/i18n/LanguageSwitcher', {
    value: currentLang,
    autoSubmit: true
  }) %>
</form>
```

## Full EJS source

```ejs
<%
  var _value     = locals.value     || 'en';
  var _name      = locals.name      || 'language';
  var _id        = locals.id        || 'lang-' + Math.random().toString(36).substr(2, 9);
  var _autoSubmit = !!locals.autoSubmit;

  var languages = locals.languages || [
    { value: 'en', label: '🇺🇸 English' },
    { value: 'tr', label: '🇹🇷 Türkçe' },
    { value: 'de', label: '🇩🇪 Deutsch' },
    { value: 'fr', label: '🇫🇷 Français' },
    { value: 'ar', label: '🇸🇦 العربية' },
  ];
%>
<div class="relative inline-flex items-center gap-1<%= locals.className ? ' ' + locals.className : '' %>">
  <i class="fa-solid fa-globe text-text-secondary text-sm" aria-hidden="true"></i>
  <select
    id="<%= _id %>"
    name="<%= _name %>"
    aria-label="Select language"
    <% if (_autoSubmit) { %>onchange="this.closest('form') ? this.closest('form').submit() : null"<% } %>
    class="appearance-none rounded-md border border-border bg-surface text-text-primary text-sm px-2.5 py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-text-tertiary transition-colors cursor-pointer"
  >
    <% languages.forEach(function (lang) { %>
    <option value="<%= lang.value %>" <%= _value === lang.value ? 'selected' : '' %>><%= lang.label %></option>
    <% }); %>
  </select>
  <i class="fa-solid fa-chevron-down text-xs text-text-disabled pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" aria-hidden="true"></i>
</div>

```
