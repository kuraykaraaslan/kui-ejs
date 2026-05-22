# MentionEmail

- **id:** `email-mention`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/notification/mention.ejs`
- **status:** stable
- **since:** 2025-05

@mention bildirimi. Bahseden kişi, bağlam ve alıntı excerpt gösterimi.

## Design tokens consumed

- `--border`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--secondary`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Mention Notification

```ejs
// GET /theme/common/email/notification/mention
res.render('theme/common/email/notification/mention', {
  layout:    'layouts/blank',
  subject:   mention.authorName + ' mentioned you in a comment',
  fromName:  'Acme Corp',
  fromEmail: 'noreply@acme.example.com',
  toName:    mentionedUser.name,
  toEmail:   mentionedUser.email,
  company:   { name: 'Acme Corp', address: '...' },
  notification: {
    mentionerName: mention.authorName,
    context:       'mentioned you in a comment on "' + post.title + '"',
    excerpt:       buildExcerptAround(mention, comment.body),
    viewUrl:       '/posts/' + post.slug + '#comment-' + comment.id,
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
      <!-- Who mentioned you -->
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary-fg font-semibold text-sm">
          <%= n.mentionerName ? n.mentionerName[0] : 'A' %>
        </div>
        <div>
          <p class="text-sm font-semibold text-text-primary">
            <span class="text-primary"><%= n.mentionerName %></span> <%= n.context %>
          </p>
        </div>
      </div>

      <!-- Excerpt -->
      <div class="rounded-xl border border-border bg-surface-raised px-5 py-4 space-y-2">
        <div class="flex items-center gap-2 text-xs text-text-secondary">
          <i class="fa-solid fa-quote-left text-text-secondary" aria-hidden="true"></i>
          <span>Excerpt</span>
        </div>
        <p class="text-sm text-text-primary leading-relaxed italic"><%= n.excerpt %></p>
      </div>

      <div class="text-center">
        <a href="<%= n.viewUrl %>"
          class="inline-block bg-primary text-primary-fg font-semibold rounded-xl px-8 py-3 text-sm hover:bg-primary-hover transition-colors">
          See the Mention
        </a>
      </div>

      <p class="text-xs text-text-secondary text-center">
        You received this because you have mention notifications enabled.
        <a href="#" class="text-primary hover:underline">Update preferences</a>
      </p>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
