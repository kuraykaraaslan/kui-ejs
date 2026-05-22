# TicketOpenedEmail

- **id:** `email-ticket-opened`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/support/ticket-opened.ejs`
- **status:** stable
- **since:** 2025-05

Support request received auto-reply. Ticket ID, subject, status badge, and message preview.

## Design tokens consumed

- `--border`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--secondary`
- `--success`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`
- `--warning`

## Variants

### Ticket Opened

```ejs
// GET /theme/common/email/support/ticket-opened
res.render('theme/common/email/support/ticket-opened', {
  layout:    'layouts/blank',
  subject:   '[Ticket #' + ticket.id + '] Your request has been received',
  fromName:  'Acme Corp Support',
  fromEmail: 'support@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  ticket: {
    id:          ticket.id,
    subject:     ticket.subject,
    description: ticket.body,
    submittedAt: ticket.createdAt.toLocaleString(),
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
    <div class="bg-primary rounded-t-2xl px-8 py-8 text-center">
      <i class="fa-solid fa-headset text-primary-fg text-4xl mb-3" aria-hidden="true"></i>
      <p class="text-primary-fg font-bold text-xl">Support Request Received</p>
      <p class="text-primary-fg/80 text-sm mt-1">Ticket #<%= ticket.id %></p>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-6">
      <!-- Confirmation -->
      <div class="rounded-xl bg-success/10 border border-success/30 px-4 py-3 flex items-center gap-3">
        <i class="fa-solid fa-circle-check text-success text-lg shrink-0" aria-hidden="true"></i>
        <p class="text-sm font-medium text-text-primary">We've received your request and will respond shortly.</p>
      </div>

      <div class="space-y-2">
        <h1 class="text-xl font-bold text-text-primary">Hi <%= toName %>,</h1>
        <p class="text-text-secondary leading-relaxed text-sm">
          Thank you for reaching out. Our support team has been notified and will get back to you as soon as possible — typically within 24 hours.
        </p>
      </div>

      <!-- Ticket details -->
      <div class="rounded-xl border border-border divide-y divide-border text-sm">
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Ticket ID</span>
          <span class="font-mono font-bold text-primary">#<%= ticket.id %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Subject</span>
          <span class="font-medium text-text-primary text-right max-w-xs"><%= ticket.subject %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Submitted</span>
          <span class="font-medium text-text-primary"><%= ticket.submittedAt %></span>
        </div>
        <div class="flex justify-between px-4 py-3">
          <span class="text-text-secondary">Status</span>
          <span class="rounded-full bg-warning/10 text-warning border border-warning/30 px-2.5 py-0.5 text-xs font-semibold">Open</span>
        </div>
      </div>

      <!-- Message preview -->
      <div class="space-y-1.5">
        <p class="text-xs font-semibold text-text-secondary uppercase tracking-wide">Your message</p>
        <div class="rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-text-secondary leading-relaxed">
          <%= ticket.description %>
        </div>
      </div>

      <div class="text-center">
        <a href="<%= ticket.viewUrl %>"
          class="inline-block bg-primary text-primary-fg font-semibold rounded-xl px-8 py-3 text-sm hover:bg-primary-hover transition-colors">
          View Ticket
        </a>
      </div>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
