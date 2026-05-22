# PasswordChangedEmail

- **id:** `email-password-changed`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/auth/password-changed.ejs`
- **status:** stable
- **since:** 2025-05

Şifre değişikliği onay e-postası. Cihaz, IP ve konum bilgisi ile "Benim değildi" uyarısı.

## Design tokens consumed

- `--border`
- `--error`
- `--primary`
- `--primary-fg`
- `--secondary`
- `--success`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Password Changed

```ejs
// GET /theme/common/email/auth/password-changed
res.render('theme/common/email/auth/password-changed', {
  layout:     'layouts/blank',
  subject:    'Your password has been changed',
  fromName:   'Acme Corp',
  fromEmail:  'noreply@acme.example.com',
  toName:     user.name,
  toEmail:    user.email,
  company:    { name: 'Acme Corp', address: '...' },
  changedAt:  new Date().toLocaleString(),
  ipAddress:  req.ip,
  location:   resolveLocation(req.ip),
  supportUrl: '/support',
});
```

## Full EJS source

```ejs
<%- include('../_preview-bar', locals) %>

<div class="bg-[#f0f2f5] min-h-screen py-8 px-4">
  <div class="max-w-[600px] mx-auto">

    <!-- Header -->
    <div class="bg-primary rounded-t-2xl px-8 py-8 text-center">
      <div class="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-white/20 mb-4">
        <span class="text-primary-fg font-bold text-xl">A</span>
      </div>
      <p class="text-primary-fg font-semibold text-xl"><%= company.name %></p>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-6">
      <!-- Success banner -->
      <div class="rounded-xl bg-success/10 border border-success/30 px-5 py-4 flex items-start gap-3">
        <i class="fa-solid fa-shield-check text-success text-lg shrink-0 mt-0.5" aria-hidden="true"></i>
        <div>
          <p class="text-sm font-semibold text-success">Password updated successfully</p>
          <p class="text-xs text-text-secondary mt-0.5">Your account password has been changed.</p>
        </div>
      </div>

      <div class="space-y-2">
        <h1 class="text-xl font-bold text-text-primary">Hi <%= toName %>,</h1>
        <p class="text-text-secondary leading-relaxed">
          This is a confirmation that the password for your account <strong><%= toEmail %></strong> was changed.
        </p>
      </div>

      <!-- Details -->
      <div class="rounded-xl border border-border bg-surface-raised divide-y divide-border text-sm">
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Changed at</span>
          <span class="text-text-primary font-medium"><%= changedAt %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">IP address</span>
          <span class="text-text-primary font-mono text-xs"><%= ipAddress %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Location</span>
          <span class="text-text-primary font-medium"><%= location %></span>
        </div>
      </div>

      <!-- Security note -->
      <div class="rounded-lg bg-error/10 border border-error/30 px-4 py-3 flex items-start gap-3">
        <i class="fa-solid fa-triangle-exclamation text-error text-sm mt-0.5 shrink-0" aria-hidden="true"></i>
        <div class="space-y-1">
          <p class="text-sm font-semibold text-error">Wasn't you?</p>
          <p class="text-xs text-text-secondary">
            If you didn't make this change, your account may be compromised.
            <a href="<%= supportUrl %>" class="text-primary hover:underline">Contact support immediately</a>.
          </p>
        </div>
      </div>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
