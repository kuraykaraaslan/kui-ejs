# LoginAlertEmail

- **id:** `email-login-alert`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/auth/login-alert.ejs`
- **status:** stable
- **since:** 2025-05

Yeni cihazdan giriş uyarısı. Cihaz, konum ve IP bilgisi; "Secure My Account" ve "This Was Me" CTA çifti.

## Design tokens consumed

- `--border`
- `--error`
- `--primary`
- `--secondary`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`
- `--warning`

## Variants

### New Login Alert

```ejs
// GET /theme/common/email/auth/login-alert
res.render('theme/common/email/auth/login-alert', {
  layout:    'layouts/blank',
  subject:   'New sign-in to your Acme Corp account',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  device:    parseUserAgent(req.headers['user-agent']),
  location:  resolveLocation(req.ip),
  ipAddress: req.ip,
  loginTime: new Date().toLocaleString(),
  secureUrl: '/account/security',
});
```

## Full EJS source

```ejs
<%- include('../_preview-bar', locals) %>

<div class="bg-[#f0f2f5] min-h-screen py-8 px-4">
  <div class="max-w-[600px] mx-auto">

    <!-- Header -->
    <div class="bg-warning rounded-t-2xl px-8 py-8 text-center">
      <div class="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-white/20 mb-4">
        <i class="fa-solid fa-triangle-exclamation text-white text-xl" aria-hidden="true"></i>
      </div>
      <p class="text-white font-semibold text-xl"><%= company.name %></p>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-6">
      <div class="space-y-2">
        <h1 class="text-2xl font-bold text-text-primary">New sign-in detected</h1>
        <p class="text-text-secondary leading-relaxed">
          Hi <%= toName %>, we noticed a new sign-in to your account. If this was you, no action is needed.
        </p>
      </div>

      <!-- Sign-in details -->
      <div class="rounded-xl border border-border bg-surface-raised divide-y divide-border text-sm">
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Device</span>
          <span class="text-text-primary font-medium"><%= device %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Location</span>
          <span class="text-text-primary font-medium"><%= location %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">IP address</span>
          <span class="text-text-primary font-mono text-xs"><%= ipAddress %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Time</span>
          <span class="text-text-primary font-medium"><%= loginTime %></span>
        </div>
      </div>

      <!-- CTA row -->
      <div class="flex flex-col sm:flex-row gap-3">
        <a href="<%= secureUrl %>"
          class="flex-1 text-center bg-error text-white font-semibold rounded-xl px-6 py-3 text-sm hover:opacity-90 transition-opacity">
          Secure My Account
        </a>
        <a href="#"
          class="flex-1 text-center border border-border text-text-primary font-semibold rounded-xl px-6 py-3 text-sm hover:bg-surface-overlay transition-colors">
          This Was Me
        </a>
      </div>

      <p class="text-xs text-text-secondary text-center">
        If you don't recognize this activity, change your password and enable two-factor authentication immediately.
      </p>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
