# ContentScoreBar

- **id:** `content-score-bar`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/ContentScoreBar.ejs`
- **status:** stable
- **since:** 2026-05

Server-rendered içerik kalite skoru. Good ≥70 / Fair ≥40 / Poor <40 tier sistemi; her kural pass/fail chip ve geçen/kalan sayım gösterimi ile birlikte. role="progressbar" + aria-valuenow.

## Design tokens consumed

- `--border`
- `--error`
- `--error-fg`
- `--error-subtle`
- `--secondary`
- `--success`
- `--success-fg`
- `--success-subtle`
- `--surface-sunken`
- `--text-disabled`
- `--text-secondary`
- `--warning`
- `--warning-fg`
- `--warning-subtle`

## Variants

### Live evaluation

```ejs
<%# Evaluate rules in your Express route, then pass score + results. %>
<%
  // const value   = req.body.content || '';
  // const rules   = [
  //   { label: 'Min 20 chars', check: function (v) { return v.length >= 20; }, points: 20 },
  //   { label: 'Has keyword',  check: function (v) { return /react/i.test(v); }, points: 20, hint: 'Include "React"' },
  //   // ...
  // ];
  // let earned = 0, total = 0;
  // const results = rules.map(function (r) {
  //   const pass = r.check(value); if (pass) earned += r.points; total += r.points;
  //   return { label: r.label, pass: pass, hint: r.hint };
  // });
  // const score = total > 0 ? Math.round((earned / total) * 100) : 0;
%>
<%- include('modules/ui/ContentScoreBar', {
  label: 'Quality score',
  score: score,
  results: results
}) %>
```

### All tiers

```ejs
<%# Good tier  (score ≥ 70) %>
<%- include('modules/ui/ContentScoreBar', { score: 100, label: 'Good (100%)', results: allPassRules }) %>

<%# Fair tier  (40 ≤ score < 70) %>
<%- include('modules/ui/ContentScoreBar', { score: 60,  label: 'Fair (60%)',  results: halfPassRules }) %>

<%# Poor tier  (score < 40) %>
<%- include('modules/ui/ContentScoreBar', { score: 20,  label: 'Poor (20%)',  results: onePassRules  }) %>
```

### Password strength

```ejs
<%# Server-side password rule evaluation (mirror of NextJS preview). %>
<%
  // const rules = [
  //   { label: 'Min 8 chars',  check: function (v) { return v.length >= 8; },          points: 25 },
  //   { label: 'Uppercase',    check: function (v) { return /[A-Z]/.test(v); },        points: 25 },
  //   { label: 'Number',       check: function (v) { return /\d/.test(v); },           points: 25 },
  //   { label: 'Special char', check: function (v) { return /[^A-Za-z0-9]/.test(v); }, points: 25 },
  // ];
%>
<%- include('modules/ui/ContentScoreBar', {
  label: 'Password strength',
  score: score,
  results: results
}) %>
```

## Full EJS source

```ejs
<%
  // ContentScoreBar — server-rendered, presentational variant.
  // Props:
  //   score    : number (0–100) — precomputed score
  //   results  : array of { label, pass, hint? } — precomputed rule results
  //   label    : optional uppercase eyebrow label
  //   className: optional extra classes
  var _score     = (typeof locals.score === 'number') ? locals.score : 0;
  var _results   = Array.isArray(locals.results) ? locals.results : [];
  var _label     = locals.label     || '';
  var _className = locals.className || '';

  if (isNaN(_score)) _score = 0;
  if (_score < 0)   _score = 0;
  if (_score > 100) _score = 100;

  var tier = (_score >= 70) ? 'great' : (_score >= 40) ? 'ok' : 'poor';
  var tierMap = {
    great: { bar: 'bg-success', text: 'text-success-fg', bg: 'bg-success-subtle', border: 'border-success', dot: 'bg-success', label: 'Good' },
    ok:    { bar: 'bg-warning', text: 'text-warning-fg', bg: 'bg-warning-subtle', border: 'border-warning', dot: 'bg-warning', label: 'Fair' },
    poor:  { bar: 'bg-error',   text: 'text-error-fg',   bg: 'bg-error-subtle',   border: 'border-error',   dot: 'bg-error',   label: 'Poor' },
  };
  var t = tierMap[tier];

  var passCount = 0;
  for (var pi = 0; pi < _results.length; pi++) { if (_results[pi].pass) passCount++; }

  var ariaLabelText = (_label || 'Content score') + ': ' + _score + '%';
%>
<div
  class="rounded-lg border p-3 space-y-2 transition-colors duration-300 <%= t.bg %> <%= t.border %><%= _className ? ' ' + _className : '' %>"
  role="progressbar"
  aria-valuenow="<%= _score %>"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="<%= ariaLabelText %>"
>
  <div class="flex items-center gap-2">
    <span class="inline-block h-1.5 w-1.5 rounded-full shrink-0 <%= t.dot %>" aria-hidden="true"></span>
    <% if (_label) { %>
      <span class="text-xs font-semibold text-text-secondary uppercase tracking-wider"><%= _label %></span>
    <% } %>
    <div class="ml-auto flex items-center gap-1.5">
      <span class="text-xs font-medium <%= t.text %>"><%= t.label %></span>
      <span class="text-sm font-bold tabular-nums leading-none <%= t.text %>" aria-label="<%= ariaLabelText %>"><%= _score %>%</span>
    </div>
  </div>

  <div class="h-1.5 w-full rounded-full bg-surface-sunken overflow-hidden">
    <div class="h-full rounded-full transition-all duration-500 ease-out <%= t.bar %>" style="width: <%= _score %>%"></div>
  </div>

  <% if (_results.length > 0) { %>
  <div class="flex flex-wrap gap-1">
    <% _results.forEach(function(r){
         var pillClass = r.pass
           ? (t.bg + ' ' + t.text + ' border ' + t.border)
           : 'bg-surface-sunken text-text-disabled border border-border';
    %>
      <span
        <% if (r.hint) { %>title="<%= r.hint %>"<% } %>
        class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium cursor-default select-none transition-colors <%= pillClass %>"
      >
        <% if (r.pass) { %><span class="w-2.5 h-2.5 inline-flex items-center justify-center" aria-hidden="true"><i class="fa-solid fa-check" style="font-size:10px"></i></span><% } %>
        <%= r.label %>
      </span>
    <% }); %>
  </div>

  <p class="text-xs text-text-secondary leading-none">
    <%= passCount %> / <%= _results.length %> rules passed
  </p>
  <% } %>
</div>

```
