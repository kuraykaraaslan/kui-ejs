# ProductUpdateEmail

- **id:** `email-product-update`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/marketing/product-update.ejs`
- **status:** stable
- **since:** 2025-05

Ürün sürüm duyurusu. Versiyon badge, öne çıkan değişiklik kartları ve changelog linki.

## Design tokens consumed

- `--border`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--primary-subtle`
- `--secondary`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Product Update

```ejs
// GET /theme/common/email/marketing/product-update
res.render('theme/common/email/marketing/product-update', {
  layout:    'layouts/blank',
  subject:   "What's new in Acme Corp v" + release.version,
  fromName:  'Acme Corp',
  fromEmail: 'updates@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  update: {
    version:      release.version,
    date:         release.releasedAt.toLocaleDateString(),
    intro:        release.intro,
    highlights:   release.highlights.map(h => ({
      icon:        h.icon,
      title:       h.title,
      description: h.summary,
    })),
    changelogUrl: '/changelog',
    learnMoreUrl: '/blog/v' + release.version,
  },
});
```

## Full EJS source

```ejs
<%
  var upd        = locals.update || {};
  var highlights = upd.highlights || [];
%>
<%- include('../_preview-bar', locals) %>

<div class="bg-[#f0f2f5] min-h-screen py-8 px-4">
  <div class="max-w-[600px] mx-auto">

    <!-- Header -->
    <div class="bg-primary rounded-t-2xl px-8 py-8">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-primary-fg font-bold text-xl"><%= company.name %></p>
          <p class="text-primary-fg/80 text-sm mt-0.5">Product Update</p>
        </div>
        <span class="bg-white/20 text-primary-fg text-xs font-bold rounded-full px-3 py-1">v<%= upd.version %></span>
      </div>
      <div class="mt-6">
        <p class="text-primary-fg font-bold text-2xl leading-tight"><%= upd.headline %></p>
        <p class="text-primary-fg/80 text-sm mt-2 leading-relaxed"><%= upd.intro %></p>
      </div>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-6">
      <p class="text-sm font-semibold text-text-primary">What's new in v<%= upd.version %>:</p>

      <% highlights.forEach(function(h) { %>
      <div class="flex items-start gap-4 rounded-xl border border-border bg-surface-raised p-4">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary text-sm">
          <i class="<%= h.icon %>" aria-hidden="true"></i>
        </span>
        <div class="space-y-0.5">
          <p class="text-sm font-semibold text-text-primary"><%= h.title %></p>
          <p class="text-xs text-text-secondary leading-relaxed"><%= h.description %></p>
        </div>
      </div>
      <% }); %>

      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <a href="<%= upd.learnMoreUrl %>"
          class="flex-1 text-center bg-primary text-primary-fg font-semibold rounded-xl px-6 py-3 text-sm hover:bg-primary-hover transition-colors">
          Explore What's New
        </a>
        <a href="<%= upd.changelogUrl %>"
          class="flex-1 text-center border border-border text-text-primary font-semibold rounded-xl px-6 py-3 text-sm hover:bg-surface-overlay transition-colors">
          Full Changelog
        </a>
      </div>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
