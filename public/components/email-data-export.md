# DataExportEmail

- **id:** `email-data-export`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/system/data-export.ejs`
- **status:** stable
- **since:** 2025-05

Veri dışa aktarma hazır bildirimi. Dosya boyutu, format, son kullanma tarihi ve indirme CTA.

## Design tokens consumed

- `--border`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--secondary`
- `--success`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`
- `--warning`

## Variants

### Data Export Ready

```ejs
// GET /theme/common/email/system/data-export
res.render('theme/common/email/system/data-export', {
  layout:    'layouts/blank',
  subject:   'Your data export is ready to download',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  export: {
    requestedAt: exportJob.requestedAt.toLocaleString(),
    readyAt:     exportJob.completedAt.toLocaleString(),
    fileSize:    formatBytes(exportJob.fileSizeBytes),
    format:      'ZIP (JSON + CSV)',
    downloadUrl: exportJob.signedDownloadUrl,   // time-limited signed URL
    expiresAt:   exportJob.expiresAt.toLocaleDateString(),
  },
});
```

## Full EJS source

```ejs
<%
  var exp = locals.export || {};
%>
<%- include('../_preview-bar', locals) %>

<div class="bg-[#f0f2f5] min-h-screen py-8 px-4">
  <div class="max-w-[600px] mx-auto">

    <!-- Header -->
    <div class="bg-success rounded-t-2xl px-8 py-8 text-center">
      <i class="fa-solid fa-download text-white text-4xl mb-3" aria-hidden="true"></i>
      <p class="text-white font-bold text-xl">Your export is ready!</p>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-6">
      <div class="space-y-2">
        <h1 class="text-xl font-bold text-text-primary">Data export ready to download</h1>
        <p class="text-text-secondary leading-relaxed text-sm">
          Hi <%= toName %>, your data export has been prepared and is ready to download. The file will be available until <strong><%= exp.expiresAt %></strong>.
        </p>
      </div>

      <!-- Export details -->
      <div class="rounded-xl border border-border bg-surface-raised divide-y divide-border text-sm">
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Requested</span>
          <span class="font-medium text-text-primary"><%= exp.requestedAt %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Ready at</span>
          <span class="font-medium text-text-primary"><%= exp.readyAt %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">File size</span>
          <span class="font-medium text-text-primary"><%= exp.fileSize %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Format</span>
          <span class="font-medium text-text-primary"><%= exp.format %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Link expires</span>
          <span class="font-semibold text-warning"><%= exp.expiresAt %></span>
        </div>
      </div>

      <div class="text-center">
        <a href="<%= exp.downloadUrl %>"
          class="inline-flex items-center gap-2 bg-primary text-primary-fg font-semibold rounded-xl px-8 py-3.5 text-sm hover:bg-primary-hover transition-colors">
          <i class="fa-solid fa-download" aria-hidden="true"></i>
          Download Your Data
        </a>
      </div>

      <p class="text-xs text-text-secondary text-center">
        Keep this file secure — it contains your personal data and account information.
      </p>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
