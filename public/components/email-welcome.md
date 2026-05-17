# WelcomeEmail

- **id:** `email-welcome`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/auth/welcome.ejs`
- **status:** stable
- **since:** 0.1

Kayıt sonrası gönderilen hoş geldin e-postası. E-posta doğrulama CTA ve "next steps" listesi içerir.

## Design tokens consumed

- `--border`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--primary-subtle`
- `--secondary`
- `--text-primary`
- `--text-secondary`

## Variants

### Welcome Email

```ejs
// GET /theme/common/email/auth/welcome
res.render('theme/common/email/auth/welcome', {
  layout:    'layouts/blank',
  subject:   'Welcome to Acme Corp! Confirm your email to get started',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  date:      new Date().toLocaleString(),
  company:   { name: 'Acme Corp', address: '123 Main St · San Francisco, CA' },
  confirmUrl: generateConfirmUrl(user.id),
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
        <h1 class="text-2xl font-bold text-text-primary">Welcome, <%= toName %>! 🎉</h1>
        <p class="text-text-secondary leading-relaxed">
          Thanks for creating an account. You're one step away from getting started — confirm your email address and unlock everything <%= company.name %> has to offer.
        </p>
      </div>

      <!-- CTA -->
      <div class="text-center py-2">
        <a href="<%= confirmUrl %>"
          class="inline-block bg-primary text-primary-fg font-semibold rounded-xl px-8 py-3.5 text-sm hover:bg-primary-hover transition-colors">
          Confirm Email Address
        </a>
      </div>

      <p class="text-xs text-text-secondary text-center">
        This link expires in <strong>24 hours</strong>. If you didn't create an account, you can safely ignore this email.
      </p>

      <hr class="border-border">

      <!-- What's next -->
      <div class="space-y-3">
        <p class="text-sm font-semibold text-text-primary">What you can do next:</p>
        <% [
          { icon: 'fa-solid fa-user-pen',  text: 'Complete your profile' },
          { icon: 'fa-solid fa-palette',   text: 'Explore themes and components' },
          { icon: 'fa-solid fa-users',     text: 'Invite your team' },
        ].forEach(function(item) { %>
        <div class="flex items-center gap-3">
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary text-xs">
            <i class="<%= item.icon %>" aria-hidden="true"></i>
          </span>
          <span class="text-sm text-text-secondary"><%= item.text %></span>
        </div>
        <% }); %>
      </div>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
