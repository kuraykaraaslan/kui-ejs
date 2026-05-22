# AccountLockedEmail

- **id:** `email-account-locked`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/auth/account-locked.ejs`
- **status:** stable
- **since:** 2025-05

Account lock email after too many failed sign-in attempts. Unlock time, reason, and "Unlock" / "Support" buttons.

## Design tokens consumed

- `--border`
- `--error`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--secondary`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Account Locked

```ejs
// GET /theme/common/email/auth/account-locked
res.render('theme/common/email/auth/account-locked', {
  layout:     'layouts/blank',
  subject:    'Your account has been temporarily locked',
  fromName:   'Acme Corp',
  fromEmail:  'noreply@acme.example.com',
  toName:     user.name,
  toEmail:    user.email,
  company:    { name: 'Acme Corp', address: '...' },
  reason:     'Too many failed login attempts',
  unlockAt:   lockExpiry.toLocaleString(),
  unlockUrl:  '/auth/unlock?token=' + token,
  supportUrl: '/support',
});
```

## Full EJS source

```ejs
<%- include('../_preview-bar', locals) %>

<div class="bg-[#f0f2f5] min-h-screen py-8 px-4">
  <div class="max-w-[600px] mx-auto">

    <!-- Header -->
    <div class="bg-error rounded-t-2xl px-8 py-8 text-center">
      <div class="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-white/20 mb-4">
        <i class="fa-solid fa-lock text-white text-xl" aria-hidden="true"></i>
      </div>
      <p class="text-white font-semibold text-xl"><%= company.name %></p>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-6">
      <div class="space-y-2">
        <h1 class="text-2xl font-bold text-text-primary">Account temporarily locked</h1>
        <p class="text-text-secondary leading-relaxed">
          Hi <%= toName %>, your account has been temporarily locked to protect your security.
        </p>
      </div>

      <!-- Reason -->
      <div class="rounded-xl border border-border bg-surface-raised divide-y divide-border text-sm">
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Reason</span>
          <span class="text-text-primary font-medium"><%= reason %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Unlocks at</span>
          <span class="text-text-primary font-medium"><%= unlockAt %></span>
        </div>
      </div>

      <p class="text-text-secondary text-sm leading-relaxed">
        Your account will unlock automatically. Alternatively, you can verify your identity to unlock it now.
      </p>

      <!-- CTA -->
      <div class="flex flex-col sm:flex-row gap-3">
        <a href="<%= unlockUrl %>"
          class="flex-1 text-center bg-primary text-primary-fg font-semibold rounded-xl px-6 py-3 text-sm hover:bg-primary-hover transition-colors">
          Unlock My Account
        </a>
        <a href="<%= supportUrl %>"
          class="flex-1 text-center border border-border text-text-primary font-semibold rounded-xl px-6 py-3 text-sm hover:bg-surface-overlay transition-colors">
          Contact Support
        </a>
      </div>

      <p class="text-xs text-text-secondary text-center">
        If this wasn't you, your account may be targeted. We recommend using a strong, unique password.
      </p>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
