# MaintenanceEmail

- **id:** `email-maintenance`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/system/maintenance.ejs`
- **status:** stable
- **since:** 0.1

Planlı bakım öncesi uyarı. Zaman penceresi, etkilenen servisler ve status page linki.

## Design tokens consumed

- `--info`
- `--primary`
- `--secondary`
- `--text-primary`
- `--text-secondary`
- `--warning`

## Variants

### Scheduled Maintenance

```ejs
// GET /theme/common/email/system/maintenance
res.render('theme/common/email/system/maintenance', {
  layout:    'layouts/blank',
  subject:   'Scheduled maintenance on ' + maintenance.date,
  fromName:  'Acme Corp',
  fromEmail: 'status@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  maintenance: {
    startTime: maintenance.startAt.toUTCString(),
    endTime:   maintenance.endAt.toUTCString(),
    duration:  maintenance.durationLabel,
    reason:    maintenance.reason,
    affected:  maintenance.affectedServices,
    statusUrl: 'https://status.acme.example.com',
  },
});
```

## Full EJS source

```ejs
<%
  var m        = locals.maintenance || {};
  var affected = m.affected || [];
%>
<%- include('../_preview-bar', locals) %>

<div class="bg-[#f0f2f5] min-h-screen py-8 px-4">
  <div class="max-w-[600px] mx-auto">

    <!-- Header -->
    <div class="bg-warning rounded-t-2xl px-8 py-8 text-center">
      <i class="fa-solid fa-screwdriver-wrench text-white text-4xl mb-3" aria-hidden="true"></i>
      <p class="text-white font-bold text-xl">Scheduled Maintenance</p>
      <p class="text-white/80 text-sm mt-1">Advance notice — no action required</p>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-6">
      <div class="space-y-2">
        <h1 class="text-xl font-bold text-text-primary">Planned downtime on May 10</h1>
        <p class="text-text-secondary leading-relaxed text-sm">
          Hi <%= toName %>, we're performing scheduled maintenance to upgrade our infrastructure. The platform will be temporarily unavailable during this window.
        </p>
      </div>

      <!-- Time window -->
      <div class="rounded-xl border border-warning/30 bg-warning/10 divide-y divide-warning/20 text-sm">
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Start</span>
          <span class="font-semibold text-text-primary"><%= m.startTime %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">End</span>
          <span class="font-semibold text-text-primary"><%= m.endTime %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Duration</span>
          <span class="font-semibold text-text-primary"><%= m.duration %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Reason</span>
          <span class="font-medium text-text-primary text-right max-w-xs"><%= m.reason %></span>
        </div>
      </div>

      <!-- Affected services -->
      <div class="space-y-2">
        <p class="text-sm font-semibold text-text-primary">Affected services:</p>
        <% affected.forEach(function(svc) { %>
        <div class="flex items-center gap-3">
          <i class="fa-solid fa-circle text-warning text-[8px] shrink-0" aria-hidden="true"></i>
          <span class="text-sm text-text-secondary"><%= svc %></span>
        </div>
        <% }); %>
      </div>

      <div class="rounded-lg bg-info/10 border border-info/30 px-4 py-3 flex items-start gap-3">
        <i class="fa-solid fa-circle-info text-info text-sm mt-0.5 shrink-0" aria-hidden="true"></i>
        <p class="text-sm text-text-secondary">
          Follow real-time updates on our <a href="<%= m.statusUrl %>" class="text-primary hover:underline">status page</a>. We'll post a completion notice as soon as maintenance is done.
        </p>
      </div>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
