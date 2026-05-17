# PasswordResetEmail

- **id:** `email-password-reset`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/auth/password-reset.ejs`
- **status:** stable
- **since:** 0.1

Şifre sıfırlama linki e-postası. Süre uyarısı ve güvenlik notu içerir.

## Design tokens consumed

- `--border`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--secondary`
- `--text-primary`
- `--text-secondary`
- `--warning`

## Variants

### Password Reset

```ejs
// GET /theme/common/email/auth/password-reset
res.render('theme/common/email/auth/password-reset', {
  layout:    'layouts/blank',
  subject:   'Reset your Acme Corp password',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  resetUrl:  generateResetUrl(token),
  expiresIn: '1 hour',
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
      <div class="space-y-2">
        <div class="flex items-center justify-center h-12 w-12 rounded-full bg-warning/10 text-warning text-xl mb-3">
          <i class="fa-solid fa-lock-open" aria-hidden="true"></i>
        </div>
        <h1 class="text-2xl font-bold text-text-primary">Reset your password</h1>
        <p class="text-text-secondary leading-relaxed">
          Hi <%= toName %>, we received a request to reset the password for your account. Click the button below to choose a new password.
        </p>
      </div>

      <!-- CTA -->
      <div class="text-center py-2">
        <a href="<%= resetUrl %>"
          class="inline-block bg-primary text-primary-fg font-semibold rounded-xl px-8 py-3.5 text-sm hover:bg-primary-hover transition-colors">
          Reset Password
        </a>
      </div>

      <!-- Expiry notice -->
      <div class="rounded-lg bg-warning/10 border border-warning/30 px-4 py-3 flex items-start gap-3">
        <i class="fa-solid fa-clock text-warning text-sm mt-0.5 shrink-0" aria-hidden="true"></i>
        <p class="text-sm text-text-secondary">
          This link expires in <strong class="text-text-primary"><%= expiresIn %></strong>. If it expires, you'll need to request a new one.
        </p>
      </div>

      <hr class="border-border">

      <!-- Security note -->
      <div class="space-y-1.5">
        <p class="text-xs font-semibold text-text-primary">Didn't request this?</p>
        <p class="text-xs text-text-secondary leading-relaxed">
          If you didn't request a password reset, no action is needed — your password remains unchanged. For extra security, you can
          <a href="#" class="text-primary hover:underline">review recent account activity</a>.
        </p>
      </div>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
