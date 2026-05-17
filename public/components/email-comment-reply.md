# CommentReplyEmail

- **id:** `email-comment-reply`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/notification/comment-reply.ejs`
- **status:** stable
- **since:** 0.1

Yorum cevabı bildirimi. Orijinal yorum + yeni cevap thread görünümü.

## Design tokens consumed

- `--border`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--primary-subtle`
- `--secondary`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Comment Reply

```ejs
// GET /theme/common/email/notification/comment-reply
res.render('theme/common/email/notification/comment-reply', {
  layout:    'layouts/blank',
  subject:   reply.authorName + ' replied to your comment',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    originalComment.authorName,
  toEmail:   originalComment.authorEmail,
  company:   { name: 'Acme Corp', address: '...' },
  notification: {
    senderName:  reply.authorName,
    postTitle:   post.title,
    postUrl:     '/posts/' + post.slug,
    yourComment: originalComment.body,
    replyText:   reply.body,
    viewUrl:     '/posts/' + post.slug + '#comment-' + reply.id,
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
      <!-- Summary -->
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-fg font-semibold text-sm">
          <%= n.senderName ? n.senderName[0] : 'S' %>
        </div>
        <div>
          <p class="text-sm font-semibold text-text-primary">
            <span class="text-primary"><%= n.senderName %></span> replied to your comment
          </p>
          <p class="text-xs text-text-secondary">on "<%= n.postTitle %>"</p>
        </div>
      </div>

      <!-- Thread -->
      <div class="space-y-3">
        <!-- Original comment -->
        <div class="rounded-xl border border-border bg-surface-raised px-4 py-3 space-y-1">
          <p class="text-xs font-semibold text-text-secondary uppercase tracking-wide">Your comment</p>
          <p class="text-sm text-text-primary leading-relaxed"><%= n.yourComment %></p>
        </div>

        <!-- Reply -->
        <div class="ml-6 rounded-xl border border-primary/30 bg-primary-subtle px-4 py-3 space-y-1">
          <p class="text-xs font-semibold text-primary uppercase tracking-wide"><%= n.senderName %> replied</p>
          <p class="text-sm text-text-primary leading-relaxed"><%= n.replyText %></p>
        </div>
      </div>

      <div class="text-center">
        <a href="<%= n.viewUrl %>"
          class="inline-block bg-primary text-primary-fg font-semibold rounded-xl px-8 py-3 text-sm hover:bg-primary-hover transition-colors">
          View Discussion
        </a>
      </div>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
