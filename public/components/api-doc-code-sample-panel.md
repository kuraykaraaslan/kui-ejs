# CodeSamplePanel

- **id:** `api-doc-code-sample-panel`
- **layer:** domain
- **category:** Domain · API Doc
- **filePath:** `modules/domain/api-doc/CodeSamplePanel.ejs`
- **status:** stable
- **since:** 0.1

API kod örneklerini koyu arka planlı panel içinde gösterir. İlk örnek açık, diğerleri details/summary ile erişilebilir.

## Design tokens consumed

- `--border`

## Variants

### Multi-language samples

```ejs
<%- include('modules/domain/api-doc/CodeSamplePanel', {
  samples: [
    { lang: 'curl',       label: 'cURL',       source: "curl -X GET https://api.example.com/users \
  -H 'Authorization: Bearer <token>'" },
    { lang: 'javascript', label: 'JavaScript', source: "const res = await fetch('/users', { headers: { Authorization: 'Bearer <token>' } });" },
  ]
}) %>
```

## Full EJS source

```ejs
<%
  var _samples = locals.samples || [];
  if (!_samples.length) { return; }
%>
<div class="rounded-lg border border-border overflow-hidden bg-gray-950<%= locals.className ? ' ' + locals.className : '' %>">
  <div class="flex items-center justify-between gap-2 px-3 py-2 border-b border-white/10">
    <div class="flex gap-1 flex-wrap">
      <% _samples.forEach(function(s, i) { %>
        <span class="rounded px-2.5 py-1 text-xs font-medium <%= i === 0 ? 'bg-white/15 text-white' : 'text-white/50' %>">
          <%= s.label || s.lang %>
        </span>
      <% }); %>
    </div>
    <span class="text-xs text-white/40 hidden sm:block">
      <i class="fa-solid fa-code text-[10px]" aria-hidden="true"></i>
      <%= _samples.length %> sample<%= _samples.length > 1 ? 's' : '' %>
    </span>
  </div>
  <% _samples.forEach(function(s, i) { %>
    <% if (i === 0) { %>
      <pre class="overflow-x-auto p-4 text-xs text-white/90 font-mono leading-relaxed"><code><%= s.source %></code></pre>
    <% } else { %>
      <details class="border-t border-white/10 group">
        <summary class="flex items-center gap-2 px-4 py-2 text-xs text-white/50 cursor-pointer list-none hover:text-white/80 transition-colors focus:outline-none">
          <i class="fa-solid fa-chevron-right text-[9px] group-open:rotate-90 transition-transform" aria-hidden="true"></i>
          <%= s.label || s.lang %>
        </summary>
        <pre class="overflow-x-auto px-4 pb-4 text-xs text-white/90 font-mono leading-relaxed"><code><%= s.source %></code></pre>
      </details>
    <% } %>
  <% }); %>
</div>

```
