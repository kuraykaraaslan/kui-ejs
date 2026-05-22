# SeoForm

- **id:** `seo-form`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/seo/SeoForm.ejs`
- **status:** stable
- **since:** 2025-04

SEO metadata form: title (60 char limit), meta description (160 char limit), and keyword tag input with character counters.

## Design tokens consumed

- `--error`
- `--error-fg`
- `--error-subtle`

## Variants

### Empty

```ejs
<%- include('modules/domain/common/seo/SeoForm', { action: '/content/1/seo' }) %>
```

### Pre-filled

```ejs
<%- include('modules/domain/common/seo/SeoForm', {
  action: '/content/1/seo',
  cancelHref: '/content/1',
  initial: {
    seoTitle: 'Best Running Shoes 2025',
    seoDescription: 'Discover the top-rated running shoes…',
    keywords: ['running', 'shoes', 'sports']
  }
}) %>
```

## Full EJS source

```ejs
<%
  var _action      = locals.action      || '#';
  var _method      = locals.method      || 'post';
  var _initial     = locals.initial     || {};
  var _cancelHref  = locals.cancelHref  || null;
  var _errors      = locals.errors      || {};
  var _error       = locals.error       || '';
  var _keywords    = Array.isArray(_initial.keywords) ? _initial.keywords : [];
  var _titleLen    = (_initial.seoTitle       || '').length;
  var _descLen     = (_initial.seoDescription || '').length;
%>
<form action="<%= _action %>" method="<%= _method %>" novalidate class="space-y-4<%= locals.className ? ' ' + locals.className : '' %>">
  <% if (_error) { %>
  <div role="alert" class="flex items-start gap-3 rounded-lg border p-3 bg-error-subtle border-error text-error-fg text-sm">
    <i class="fa-solid fa-circle-xmark mt-0.5 shrink-0" aria-hidden="true"></i>
    <span><%= _error %></span>
  </div>
  <% } %>

  <%- include('../../../ui/Input', {
    id: 'seo-title', label: 'SEO Title', name: 'seoTitle',
    placeholder: 'Page title for search engines',
    value: _initial.seoTitle || '',
    error: _errors.seoTitle,
    hint: _titleLen + '/60'
  }) %>

  <%- include('../../../ui/Textarea', {
    id:    'seo-description',
    label: 'Meta Description',
    name:  'seoDescription',
    rows:  3,
    placeholder: 'Short description shown in search results',
    value: _initial.seoDescription || '',
    error: _errors.seoDescription,
    hint:  _descLen + '/160'
  }) %>

  <%- include('../../../ui/TagInput', {
    id:    'seo-keywords',
    label: 'Keywords',
    name:  'keywords',
    value: _keywords,
    placeholder: 'Add keyword…'
  }) %>

  <div class="flex justify-end gap-2 pt-2">
    <% if (_cancelHref) { %>
    <%- include('../../../ui/Button', { variant: 'outline', children: 'Cancel', href: _cancelHref }) %>
    <% } %>
    <%- include('../../../ui/Button', { type: 'submit', children: 'Save SEO' }) %>
  </div>
</form>

```
