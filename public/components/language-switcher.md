# LanguageSwitcher

- **id:** `language-switcher`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/i18n/LanguageSwitcher.ejs`
- **status:** stable
- **since:** 2025-04

Native select ile dil seçici. en/tr/de/fr/ar varsayılan diller; autoSubmit ile form aracılığıyla otomatik gönderi.

## Design tokens consumed

- `--text-disabled`

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
  var _value      = locals.value      || 'en';
  var _name       = locals.name       || 'language';
  var _id         = locals.id         || ('lang-' + Math.random().toString(36).substr(2, 9));
  var _autoSubmit = !!locals.autoSubmit;

  // NOTE: NextJS sibling uses `country-flag-icons` (SVG) — EJS bundle has no
  // flag asset pipeline yet, so we keep emoji flags as a TODO fallback.
  // TODO(common/i18n): wire SVG country flags (parity with React DirectionProvider).
  var languages = locals.languages || [
    { value: 'en', flag: '🇺🇸', name: 'English' },
    { value: 'tr', flag: '🇹🇷', name: 'Türkçe' },
    { value: 'de', flag: '🇩🇪', name: 'Deutsch' },
    { value: 'fr', flag: '🇫🇷', name: 'Français' },
    { value: 'ar', flag: '🇸🇦', name: 'العربية' }
  ];

  var current = languages.filter(function (l) { return l.value === _value; })[0] || languages[0];

  var items = languages.map(function (lang) {
    var iconHtml = '<span class="w-4 inline-flex items-center justify-center" aria-hidden="true">' + lang.flag + '</span>';
    var onClick  = "document.getElementById('" + _id + "-hidden').value='" + lang.value + "';"
                 + (_autoSubmit ? "var f=document.getElementById('" + _id + "-hidden').closest('form'); if(f){f.submit();}" : '');
    return { type: 'item', label: lang.name, icon: iconHtml, onClick: onClick };
  });

  // Build trigger using the Button atom output (captured into a string)
  var triggerHtml = '';
%>
<form action="<%= locals.action || '#' %>" method="post" style="display:inline-block">
  <input type="hidden" id="<%= _id %>-hidden" name="<%= _name %>" value="<%= _value %>">
  <%
    var btnIcon = '<span class="w-4 flex items-center justify-center shrink-0" aria-hidden="true">' + current.flag + '</span>';
    var btnChev = '<span class="w-3 h-3 inline-flex items-center justify-center text-text-disabled" aria-hidden="true"><i class="fa-solid fa-chevron-down" style="font-size:10px"></i></span>';
    triggerHtml = include('../../../ui/Button', {
      variant: 'outline',
      size: 'sm',
      className: 'gap-2',
      iconLeft: btnIcon,
      iconRight: btnChev,
      children: current.name
    });
  %>
  <%- include('../../../ui/DropdownMenu', {
    id: _id,
    align: 'left',
    className: locals.className || '',
    trigger: triggerHtml,
    items: items
  }) %>
</form>

```
