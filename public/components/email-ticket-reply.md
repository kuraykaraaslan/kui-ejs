# TicketReplyEmail

- **id:** `email-ticket-reply`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/support/ticket-reply.ejs`
- **status:** stable
- **since:** 2025-05

Destek ekibinden gelen yanıt. Ajan avatar, tam cevap metni, Reply ve View CTA çifti.

## Design tokens consumed

- `--border`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--secondary`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Agent Reply

```ejs
// GET /theme/common/email/support/ticket-reply
res.render('theme/common/email/support/ticket-reply', {
  layout:    'layouts/blank',
  subject:   '[Ticket #' + ticket.id + '] New reply from the support team',
  fromName:  'Acme Corp Support',
  fromEmail: 'support@acme.example.com',
  toName:    user.name,
  toEmail:   user.email,
  company:   { name: 'Acme Corp', address: '...' },
  ticket: {
    id:         ticket.id,
    subject:    ticket.subject,
    agentName:  reply.author.firstName,
    agentRole:  'Acme Support',
    replyText:  reply.body,
    repliedAt:  reply.createdAt.toLocaleString(),
    viewUrl:    '/support/tickets/' + ticket.id,
    replyUrl:   '/support/tickets/' + ticket.id + '/reply',
  },
});
```

## Full EJS source

```ejs
<%
  var ticket = locals.ticket || {};
  var replyLines = (ticket.replyText || '').split('\n\n');
%>
<%- include('../_preview-bar', locals) %>

<div class="bg-[#f0f2f5] min-h-screen py-8 px-4">
  <div class="max-w-[600px] mx-auto">

    <!-- Header -->
    <div class="bg-primary rounded-t-2xl px-8 py-8 text-center">
      <i class="fa-solid fa-reply text-primary-fg text-4xl mb-3" aria-hidden="true"></i>
      <p class="text-primary-fg font-bold text-xl">New Reply on Your Ticket</p>
      <p class="text-primary-fg/80 text-sm mt-1">Ticket #<%= ticket.id %></p>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-6">
      <!-- Agent info -->
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-fg font-semibold text-sm">
          <%= ticket.agentName ? ticket.agentName[0] : 'E' %>
        </div>
        <div>
          <p class="text-sm font-semibold text-text-primary"><%= ticket.agentName %></p>
          <p class="text-xs text-text-secondary"><%= ticket.agentRole %> · <%= ticket.repliedAt %></p>
        </div>
      </div>

      <!-- Subject -->
      <div class="rounded-lg bg-surface-overlay px-4 py-2 text-xs text-text-secondary">
        Re: <strong class="text-text-primary"><%= ticket.subject %></strong> [#<%= ticket.id %>]
      </div>

      <!-- Reply message -->
      <div class="rounded-xl border border-border bg-surface-raised px-5 py-4 space-y-3">
        <% replyLines.forEach(function(para) { if (para.trim()) { %>
        <p class="text-sm text-text-primary leading-relaxed"><%= para %></p>
        <% }}); %>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <a href="<%= ticket.replyUrl %>"
          class="flex-1 text-center bg-primary text-primary-fg font-semibold rounded-xl px-6 py-3 text-sm hover:bg-primary-hover transition-colors">
          <i class="fa-solid fa-reply mr-2" aria-hidden="true"></i>Reply
        </a>
        <a href="<%= ticket.viewUrl %>"
          class="flex-1 text-center border border-border text-text-primary font-semibold rounded-xl px-6 py-3 text-sm hover:bg-surface-overlay transition-colors">
          View Ticket
        </a>
      </div>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
