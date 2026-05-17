# NewMessageEmail

- **id:** `email-new-message`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/notification/new-message.ejs`
- **status:** stable
- **since:** 0.1

Gelen kutusu mesaj bildirimi. Gönderici, mesaj önizlemesi ve Reply/Inbox CTA çifti.

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

### New Message

```ejs
// GET /theme/common/email/notification/new-message
res.render('theme/common/email/notification/new-message', {
  layout:    'layouts/blank',
  subject:   'You have a new message from ' + sender.name,
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    recipient.name,
  toEmail:   recipient.email,
  company:   { name: 'Acme Corp', address: '...' },
  notification: {
    senderName:   sender.name,
    messageCount: unreadCount,
    preview:      message.body.slice(0, 120) + '…',
    sentAt:       message.createdAt.toLocaleString(),
    replyUrl:     '/messages/' + thread.id,
  },
});
```

## Full EJS source

```ejs
<%
  var n = locals.notification || {};
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
      <div class="space-y-1">
        <h1 class="text-xl font-bold text-text-primary">You have a new message</h1>
        <p class="text-text-secondary text-sm">From <strong><%= n.senderName %></strong> · <%= n.sentAt %></p>
      </div>

      <!-- Message preview -->
      <div class="rounded-xl border border-border bg-surface-raised overflow-hidden">
        <div class="flex items-center gap-3 px-4 py-3 border-b border-border bg-white">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-fg font-semibold text-xs">
            <%= n.senderName ? n.senderName[0] : 'M' %>
          </div>
          <div>
            <p class="text-sm font-semibold text-text-primary"><%= n.senderName %></p>
            <p class="text-xs text-text-secondary"><%= n.sentAt %></p>
          </div>
          <% if (n.messageCount > 1) { %>
          <span class="ml-auto bg-primary text-primary-fg rounded-full text-xs font-bold px-2 py-0.5"><%= n.messageCount %></span>
          <% } %>
        </div>
        <div class="px-4 py-4">
          <p class="text-sm text-text-secondary leading-relaxed"><%= n.preview %></p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <a href="<%= n.replyUrl %>"
          class="flex-1 text-center bg-primary text-primary-fg font-semibold rounded-xl px-6 py-3 text-sm hover:bg-primary-hover transition-colors">
          <i class="fa-solid fa-reply mr-2" aria-hidden="true"></i>Reply
        </a>
        <a href="<%= n.replyUrl %>"
          class="flex-1 text-center border border-border text-text-primary font-semibold rounded-xl px-6 py-3 text-sm hover:bg-surface-overlay transition-colors">
          View in Inbox
        </a>
      </div>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
