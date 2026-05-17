# VerifyEmailOTP

- **id:** `email-verify-otp`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/auth/verify-email.ejs`
- **status:** stable
- **since:** 0.1

6 haneli OTP kodu. Büyük, mono font kod gösterimi ve süre uyarısı.

## Design tokens consumed

- `--border`
- `--primary`
- `--primary-fg`
- `--primary-subtle`
- `--secondary`
- `--surface-overlay`
- `--text-primary`
- `--text-secondary`

## Variants

### OTP Code Email

```ejs
// GET /theme/common/email/auth/verify-email
res.render('theme/common/email/auth/verify-email', {
  layout:    'layouts/blank',
  subject:   'Your Acme Corp verification code',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  otp:       generateOTP(),      // e.g. '847 392'
  expiresIn: '15 minutes',
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
    <div class="bg-white px-8 py-8 space-y-6 text-center">
      <div class="space-y-2">
        <div class="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary-subtle text-primary text-2xl mb-2">
          <i class="fa-solid fa-envelope-circle-check" aria-hidden="true"></i>
        </div>
        <h1 class="text-2xl font-bold text-text-primary">Verify your email</h1>
        <p class="text-text-secondary leading-relaxed max-w-sm mx-auto">
          Enter the code below in the verification screen. It expires in <strong><%= expiresIn %></strong>.
        </p>
      </div>

      <!-- OTP -->
      <div class="my-6">
        <div class="inline-block bg-surface-overlay rounded-2xl px-10 py-5 border border-border">
          <p class="text-4xl font-bold tracking-[0.25em] text-text-primary font-mono"><%= otp %></p>
        </div>
      </div>

      <p class="text-xs text-text-secondary">
        If you didn't request this code, you can safely ignore this email.<br>
        Someone may have entered your email address by mistake.
      </p>

      <hr class="border-border">

      <p class="text-xs text-text-secondary">
        Having trouble? <a href="#" class="text-primary hover:underline">Contact support</a>
      </p>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
