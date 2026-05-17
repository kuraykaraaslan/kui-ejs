# SeoForm

- **id:** `seo-form`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/seo/SeoForm.ejs`
- **status:** stable
- **since:** 0.1

SEO metadata formu: başlık (60 karakter sınırı), meta açıklaması (160 karakter) ve anahtar kelime etiket girişi.

## Design tokens consumed

- `--border`
- `--error`
- `--error-fg`
- `--error-subtle`
- `--primary`
- `--primary-subtle`
- `--secondary`
- `--text-primary`
- `--text-secondary`

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

  <div class="w-full">
    <label for="seo-description" class="block text-sm font-medium text-text-primary mb-1.5">Meta Description</label>
    <textarea id="seo-description" name="seoDescription" rows="3"
      placeholder="Short description shown in search results"
      class="block w-full rounded-md border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 border-border focus:border-primary hover:border-text-tertiary transition-colors px-3 py-2 text-sm resize-y"
    ><%= _initial.seoDescription || '' %></textarea>
    <% if (_errors.seoDescription) { %>
    <p class="mt-1.5 text-sm text-error"><%= _errors.seoDescription %></p>
    <% } else { %>
    <p class="mt-1.5 text-sm text-text-secondary"><%= _descLen %>/160</p>
    <% } %>
  </div>

  <div class="w-full">
    <label class="block text-sm font-medium text-text-primary mb-1.5">Keywords</label>
    <div class="flex flex-wrap gap-1.5 rounded-md border border-border bg-surface px-3 py-2 min-h-[2.5rem]">
      <% _keywords.forEach(function(kw) { %>
      <span class="inline-flex items-center gap-1 rounded-full bg-primary-subtle text-primary px-2 py-0.5 text-xs font-medium">
        <%= kw %>
        <input type="hidden" name="keywords[]" value="<%= kw %>">
      </span>
      <% }); %>
      <input type="text" placeholder="Add keyword…" id="seo-keyword-input"
        class="flex-1 min-w-[8rem] bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none">
    </div>
    <p class="mt-1.5 text-xs text-text-secondary">Press Enter or comma to add a keyword.</p>
  </div>

  <div class="flex justify-end gap-2 pt-2">
    <% if (_cancelHref) { %>
    <%- include('../../../ui/Button', { variant: 'outline', children: 'Cancel', href: _cancelHref }) %>
    <% } %>
    <%- include('../../../ui/Button', { type: 'submit', children: 'Save SEO' }) %>
  </div>
</form>

```
