# PolicyUpdateEmail

- **id:** `email-policy-update`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/system/policy-update.ejs`
- **status:** stable
- **since:** 2025-05

Privacy policy / terms of service update. Point-by-point summary and effective date.

## Design tokens consumed

- `--border`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--primary-subtle`
- `--secondary`
- `--surface-overlay`
- `--text-primary`
- `--text-secondary`

## Variants

### Privacy Policy Update

```ejs
// GET /theme/common/email/system/policy-update
res.render('theme/common/email/system/policy-update', {
  layout:    'layouts/blank',
  subject:   'Important updates to our ' + update.type,
  fromName:  'Acme Corp',
  fromEmail: 'legal@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  update: {
    type:          'Privacy Policy',   // or 'Terms of Service'
    effectiveDate: policy.effectiveDate.toLocaleDateString(),
    summaryPoints: policy.changes.map(c => c.summary),
    viewUrl:       '/legal/privacy',
  },
});
```

## Full EJS source

```ejs
<%
  var upd    = locals.update || {};
  var points = upd.summaryPoints || [];
%>
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
        <h1 class="text-xl font-bold text-text-primary">Updates to our <%= upd.type %></h1>
        <p class="text-text-secondary leading-relaxed text-sm">
          Hi <%= toName %>, we've made some updates to our <strong><%= upd.type %></strong>. These changes take effect on <strong><%= upd.effectiveDate %></strong>.
        </p>
      </div>

      <!-- Summary points -->
      <div class="space-y-2">
        <p class="text-sm font-semibold text-text-primary">Key changes at a glance:</p>
        <% points.forEach(function(point) { %>
        <div class="flex items-start gap-3">
          <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-primary text-[10px] font-bold mt-0.5">
            <i class="fa-solid fa-check" aria-hidden="true"></i>
          </span>
          <p class="text-sm text-text-secondary leading-relaxed"><%= point %></p>
        </div>
        <% }); %>
      </div>

      <div class="rounded-lg bg-surface-overlay border border-border px-4 py-3">
        <p class="text-xs text-text-secondary leading-relaxed">
          By continuing to use <%= company.name %> after <strong><%= upd.effectiveDate %></strong>, you agree to the updated terms. If you have concerns, please contact us before the effective date.
        </p>
      </div>

      <div class="text-center">
        <a href="<%= upd.viewUrl %>"
          class="inline-block bg-primary text-primary-fg font-semibold rounded-xl px-8 py-3 text-sm hover:bg-primary-hover transition-colors">
          Read the Full <%= upd.type %>
        </a>
      </div>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
