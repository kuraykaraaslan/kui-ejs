# TicketResolvedEmail

- **id:** `email-ticket-resolved`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/support/ticket-resolved.ejs`
- **status:** stable
- **since:** 2025-05

Support ticket resolved notice. Resolution summary, emoji rating, and a reopen option.

## Design tokens consumed

- `--border`
- `--error`
- `--primary`
- `--secondary`
- `--success`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`
- `--warning`

## Variants

### Ticket Resolved

```ejs
// GET /theme/common/email/support/ticket-resolved
res.render('theme/common/email/support/ticket-resolved', {
  layout:    'layouts/blank',
  subject:   '[Ticket #' + ticket.id + '] Your ticket has been resolved',
  fromName:  'Acme Corp Support',
  fromEmail: 'support@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  ticket: {
    id:          ticket.id,
    subject:     ticket.subject,
    resolvedAt:  ticket.resolvedAt.toLocaleString(),
    resolution:  ticket.resolutionSummary,
    feedbackUrl: '/support/tickets/' + ticket.id + '/feedback',
    reopenUrl:   '/support/tickets/' + ticket.id + '/reopen',
    viewUrl:     '/support/tickets/' + ticket.id,
  },
});
```

## Full EJS source

```ejs
<%
  var ticket = locals.ticket || {};
%>
<%- include('../_preview-bar', locals) %>

<div class="bg-[#f0f2f5] min-h-screen py-8 px-4">
  <div class="max-w-[600px] mx-auto">

    <!-- Header -->
    <div class="bg-success rounded-t-2xl px-8 py-8 text-center">
      <i class="fa-solid fa-circle-check text-white text-4xl mb-3" aria-hidden="true"></i>
      <p class="text-white font-bold text-xl">Ticket Resolved</p>
      <p class="text-white/80 text-sm mt-1">Ticket #<%= ticket.id %></p>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-6">
      <div class="space-y-2">
        <h1 class="text-xl font-bold text-text-primary">Your issue has been resolved</h1>
        <p class="text-text-secondary leading-relaxed text-sm">
          Hi <%= toName %>, we're happy to let you know that your support ticket has been marked as resolved.
        </p>
      </div>

      <!-- Details -->
      <div class="rounded-xl border border-border bg-surface-raised divide-y divide-border text-sm">
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Ticket</span>
          <span class="font-mono font-bold text-text-primary">#<%= ticket.id %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Subject</span>
          <span class="font-medium text-text-primary text-right max-w-xs"><%= ticket.subject %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Resolved on</span>
          <span class="font-medium text-text-primary"><%= ticket.resolvedAt %></span>
        </div>
      </div>

      <!-- Resolution summary -->
      <div class="space-y-1.5">
        <p class="text-xs font-semibold text-text-secondary uppercase tracking-wide">Resolution Summary</p>
        <div class="rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-text-secondary leading-relaxed">
          <%= ticket.resolution %>
        </div>
      </div>

      <!-- Feedback -->
      <div class="rounded-xl bg-surface-raised border border-border px-5 py-4 text-center space-y-3">
        <p class="text-sm font-semibold text-text-primary">Was this helpful?</p>
        <p class="text-xs text-text-secondary">Rate your support experience to help us improve.</p>
        <div class="flex justify-center gap-2">
          <% [
            { icon: 'fa-solid fa-face-smile', label: 'Great',  color: 'text-success' },
            { icon: 'fa-solid fa-face-meh',   label: 'Okay',   color: 'text-warning' },
            { icon: 'fa-solid fa-face-frown',  label: 'Poor',   color: 'text-error' },
          ].forEach(function(r) { %>
          <a href="<%= ticket.feedbackUrl %>"
            class="flex flex-col items-center gap-1 rounded-xl border border-border bg-white px-5 py-2.5 hover:border-primary hover:shadow-sm transition-all">
            <i class="<%= r.icon %> text-xl <%= r.color %>" aria-hidden="true"></i>
            <span class="text-xs text-text-secondary"><%= r.label %></span>
          </a>
          <% }); %>
        </div>
      </div>

      <div class="text-center space-y-2">
        <p class="text-xs text-text-secondary">
          Still having issues?
          <a href="<%= ticket.reopenUrl %>" class="text-primary hover:underline">Reopen this ticket</a>
          or
          <a href="/theme/common/email/support/ticket-opened" class="text-primary hover:underline">create a new one</a>.
        </p>
      </div>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
