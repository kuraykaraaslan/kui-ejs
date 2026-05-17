# AccountDeletionEmail

- **id:** `email-account-deletion`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/system/account-deletion.ejs`
- **status:** stable
- **since:** 0.1

Hesap silme zamanlama bildirimi. Grace period, kalıcı silme uyarısı ve iptal CTA.

## Design tokens consumed

- `--border`
- `--error`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--secondary`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Account Deletion Scheduled

```ejs
// GET /theme/common/email/system/account-deletion
res.render('theme/common/email/system/account-deletion', {
  layout:    'layouts/blank',
  subject:   'Your account is scheduled for deletion on ' + deletionDate,
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  deletion: {
    requestedAt:      new Date().toLocaleString(),
    scheduledAt:      deletionDate.toLocaleDateString(),
    gracePeriodDays:  7,
    cancelUrl:        '/account/cancel-deletion?token=' + token,
    supportUrl:       '/support',
  },
});
```

## Full EJS source

```ejs
<%
  var del = locals.deletion || {};
%>
<%- include('../_preview-bar', locals) %>

<div class="bg-[#f0f2f5] min-h-screen py-8 px-4">
  <div class="max-w-[600px] mx-auto">

    <!-- Header -->
    <div class="bg-error rounded-t-2xl px-8 py-8 text-center">
      <i class="fa-solid fa-trash text-white text-4xl mb-3" aria-hidden="true"></i>
      <p class="text-white font-bold text-xl">Account Deletion Scheduled</p>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-6">
      <div class="space-y-2">
        <h1 class="text-xl font-bold text-text-primary">Hi <%= toName %>,</h1>
        <p class="text-text-secondary leading-relaxed text-sm">
          We've received your request to delete your <%= company.name %> account. Your account has been scheduled for permanent deletion.
        </p>
      </div>

      <!-- Timeline -->
      <div class="rounded-xl border border-border bg-surface-raised divide-y divide-border text-sm">
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Deletion requested</span>
          <span class="font-medium text-text-primary"><%= del.requestedAt %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Scheduled for</span>
          <span class="font-semibold text-error"><%= del.scheduledAt %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Grace period</span>
          <span class="font-medium text-text-primary"><%= del.gracePeriodDays %> days to cancel</span>
        </div>
      </div>

      <!-- Warning -->
      <div class="rounded-xl bg-error/10 border border-error/30 px-4 py-3 space-y-1.5">
        <p class="text-sm font-semibold text-error">This action is permanent</p>
        <p class="text-xs text-text-secondary leading-relaxed">
          All your data — including projects, files, and settings — will be permanently deleted on <strong><%= del.scheduledAt %></strong>. This cannot be undone after the deletion date.
        </p>
      </div>

      <!-- CTA to cancel -->
      <div class="text-center space-y-3">
        <a href="<%= del.cancelUrl %>"
          class="inline-block bg-primary text-primary-fg font-semibold rounded-xl px-8 py-3.5 text-sm hover:bg-primary-hover transition-colors">
          Cancel Deletion
        </a>
        <p class="text-xs text-text-secondary">
          Changed your mind? You have until <strong><%= del.scheduledAt %></strong> to cancel.
        </p>
      </div>

      <hr class="border-border">

      <p class="text-xs text-text-secondary text-center">
        If you didn't request this, <a href="<%= del.supportUrl %>" class="text-primary hover:underline">contact support immediately</a>.
      </p>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
