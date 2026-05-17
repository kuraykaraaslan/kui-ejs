# NewsletterEmail

- **id:** `email-newsletter`
- **layer:** theme
- **category:** Email
- **filePath:** `views/theme/common/email/marketing/newsletter.ejs`
- **status:** stable
- **since:** 0.1

Haftalık bülten. Makale kartları, etiket renkleri ve okuma süresi.

## Design tokens consumed

- `--border`
- `--primary`
- `--primary-fg`
- `--secondary`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Weekly Newsletter

```ejs
// GET /theme/common/email/marketing/newsletter
res.render('theme/common/email/marketing/newsletter', {
  layout:    'layouts/blank',
  subject:   'Acme Weekly — Issue #' + newsletter.issue,
  fromName:  'Acme Corp',
  fromEmail: 'hello@acme.example.com',
  toName:    subscriber.name,
  toEmail:   subscriber.email,
  company:   { name: 'Acme Corp', address: '...' },
  newsletter: {
    issue:    newsletter.issueNumber,
    date:     newsletter.publishedAt.toLocaleDateString(),
    intro:    newsletter.intro,
    articles: newsletter.articles.map(a => ({
      tag:      a.category,
      title:    a.title,
      summary:  a.excerpt,
      url:      '/blog/' + a.slug,
      readTime: a.readingTime + ' min',
    })),
    ctaUrl: '/blog',
  },
});
```

## Full EJS source

```ejs
<%
  var nl       = locals.newsletter || {};
  var articles = nl.articles || [];
  var TAG_COLORS = { 'Design': 'bg-purple-100 text-purple-700', 'Dev Tools': 'bg-blue-100 text-blue-700', 'Community': 'bg-green-100 text-green-700', 'Business': 'bg-amber-100 text-amber-700' };
%>
<%- include('../_preview-bar', locals) %>

<div class="bg-[#f0f2f5] min-h-screen py-8 px-4">
  <div class="max-w-[600px] mx-auto">

    <!-- Header -->
    <div class="bg-primary rounded-t-2xl px-8 py-8">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-primary-fg font-bold text-xl"><%= company.name %></p>
          <p class="text-primary-fg/80 font-medium mt-1">Weekly Newsletter</p>
        </div>
        <div class="text-right">
          <p class="text-primary-fg/70 text-xs">Issue #<%= nl.issue %></p>
          <p class="text-primary-fg/70 text-xs"><%= nl.date %></p>
        </div>
      </div>
      <p class="text-primary-fg/80 text-sm mt-4 leading-relaxed"><%= nl.intro %></p>
    </div>

    <!-- Body -->
    <div class="bg-white px-8 py-8 space-y-4">
      <p class="text-sm font-semibold text-text-primary">This week's reads</p>

      <% articles.forEach(function(article) {
        var tagClass = TAG_COLORS[article.tag] || 'bg-surface-overlay text-text-secondary';
      %>
      <a href="<%= article.url %>"
        class="group block rounded-xl border border-border bg-surface-raised p-4 hover:border-primary hover:shadow-sm transition-all space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="rounded-full px-2.5 py-0.5 text-xs font-medium <%= tagClass %>"><%= article.tag %></span>
          <span class="text-xs text-text-secondary"><%= article.readTime %> read</span>
        </div>
        <p class="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors"><%= article.title %></p>
        <p class="text-xs text-text-secondary leading-relaxed"><%= article.summary %></p>
      </a>
      <% }); %>

      <div class="text-center pt-2">
        <a href="<%= nl.ctaUrl %>"
          class="inline-flex items-center gap-2 border border-border text-text-primary font-semibold rounded-xl px-8 py-2.5 text-sm hover:bg-surface-overlay transition-colors">
          Read all articles
          <i class="fa-solid fa-arrow-right text-xs" aria-hidden="true"></i>
        </a>
      </div>

      <hr class="border-border">

      <p class="text-xs text-text-secondary text-center">
        You're receiving this because you subscribed to the <%= company.name %> newsletter.
      </p>
    </div>

    <%- include('../_footer', locals) %>
  </div>
</div>

```
