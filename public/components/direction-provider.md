# DirectionProvider

- **id:** `direction-provider`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/i18n/DirectionProvider.ejs`
- **status:** stable
- **since:** 2025-04

Dil koduna göre dir="rtl"/"ltr" atayan wrapper div. RTL dilleri: ar, he, fa, ur, yi, ku, ps, sd.

## Variants

### RTL (Arabic)

```ejs
<%- include('modules/domain/common/i18n/DirectionProvider', {
  lang: 'ar'
}) %>
```

### LTR (English)

```ejs
<%- include('modules/domain/common/i18n/DirectionProvider', {
  lang: 'en'
}) %>
```

## Full EJS source

```ejs
<%
  var _lang = locals.lang || 'en';
  var RTL_LANGS = ['ar', 'he', 'fa', 'ur', 'yi', 'ku', 'ps', 'sd'];
  var _dir  = RTL_LANGS.indexOf(_lang) !== -1 ? 'rtl' : 'ltr';
  var _applyToDocument = (locals.applyToDocument === undefined) ? true : !!locals.applyToDocument;
%>
<div dir="<%= _dir %>" lang="<%= _lang %>"<%= locals.className ? ' class="' + locals.className + '"' : '' %>>
  <%- locals.children || '' %>
</div>
<% if (_applyToDocument) { %>
<script>
(function () {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('dir',  '<%= _dir %>');
  document.documentElement.setAttribute('lang', '<%= _lang %>');
})();
</script>
<% } %>

```
