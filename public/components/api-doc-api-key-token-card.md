# ApiKeyTokenCard

- **id:** `api-doc-api-key-token-card`
- **layer:** domain
- **category:** Domain · API Doc
- **filePath:** `modules/domain/api-doc/ApiKeyTokenCard.ejs`
- **status:** stable
- **since:** 2026-05

API anahtarı / kişisel erişim token kartı. Maskeli/gizli token gösterimi, göster-gizle, panoya kopyala, ortam rozeti, scope listesi ve isteğe bağlı revoke aksiyonu içerir.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--error-subtle`
- `--primary`
- `--primary-subtle`
- `--secondary`
- `--success`
- `--surface-base`
- `--surface-overlay`
- `--surface-raised`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`
- `--warning`
- `--warning-subtle`

## Variants

### Production key with scopes

```ejs
<%- include('modules/domain/api-doc/ApiKeyTokenCard', {
  name: 'Production key',
  token: 'sk_live_AbCdEfGhIjKlMnOpQrSta1b2',
  environment: 'production',
  createdAt: '2026-01-12',
  lastUsedAt: '2026-05-20',
  scopes: ['read:products', 'write:orders']
}) %>
```

### Staging key with revoke action

```ejs
<%- include('modules/domain/api-doc/ApiKeyTokenCard', {
  name: 'Staging key',
  token: 'sk_test_XyZ9z8y',
  environment: 'staging',
  createdAt: '2026-04-01',
  lastUsedAt: null,
  onRevoke: true
}) %>
```

## Full EJS source

```ejs
<%
  var _name        = locals.name        || '';
  var _token       = locals.token       || '';
  var _masked      = locals.masked      || null;
  var _scopes      = locals.scopes      || null;
  var _createdAt   = locals.createdAt   || null;
  var _lastUsedAt  = (typeof locals.lastUsedAt !== 'undefined') ? locals.lastUsedAt : null;
  var _environment = locals.environment || null;
  var _onRevoke    = !!locals.onRevoke;
  var _revokeLabel = locals.revokeLabel || ('Revoke ' + _name);
  var _className   = locals.className   || '';

  var envBadgeVariant = {
    production:  'success',
    staging:     'warning',
    development: 'neutral',
  };

  function maskToken(token) {
    if (!token) return '';
    var tail = token.slice(-4);
    var bulletCount = Math.max(0, token.length - 4);
    var bullets = '';
    for (var i = 0; i < bulletCount; i++) bullets += '•';
    return bullets + tail;
  }

  function formatDate(d) {
    if (!d) return '—';
    try {
      var date = (typeof d === 'string' || typeof d === 'number') ? new Date(d) : d;
      if (isNaN(date.getTime())) return '—';
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) { return '—'; }
  }

  var displayMasked = _masked != null ? _masked : maskToken(_token);

  // Unique id per render so multiple instances on a page don't collide.
  var _uid = 'aktc_' + Math.random().toString(36).slice(2, 10);
%>
<div
  id="<%= _uid %>"
  class="rounded-xl border border-border bg-surface-raised p-4 flex flex-col gap-3<%= _className ? ' ' + _className : '' %>"
  data-token="<%= _token %>"
>
  <div class="flex items-start justify-between gap-3">
    <div class="flex items-start gap-2 min-w-0">
      <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning-subtle text-warning">
        <span class="w-3.5 h-3.5 inline-flex items-center justify-center">
          <i class="fa-solid fa-key" aria-hidden="true"></i>
        </span>
      </div>
      <div class="min-w-0">
        <p class="font-semibold text-text-primary truncate"><%= _name %></p>
        <% if (_environment) { %>
        <div class="mt-1">
          <%- include('../../ui/Badge', { variant: envBadgeVariant[_environment] || 'neutral', size: 'sm', children: _environment }) %>
        </div>
        <% } %>
      </div>
    </div>

    <% if (_onRevoke) { %>
    <button
      type="button"
      data-aktc-revoke
      class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-error border border-error/40 hover:bg-error-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      aria-label="<%= _revokeLabel %>"
    >
      <span class="w-3 h-3 inline-flex items-center justify-center">
        <i class="fa-solid fa-trash" aria-hidden="true"></i>
      </span>
      Revoke
    </button>
    <% } %>
  </div>

  <div class="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface-base font-mono text-xs text-text-primary">
    <span
      data-aktc-display
      data-masked="<%= displayMasked %>"
      class="flex-1 truncate select-all"
      aria-label="API token"
    ><%= displayMasked %></span>
    <button
      type="button"
      data-aktc-toggle
      aria-label="Reveal token"
      aria-pressed="false"
      class="inline-flex items-center justify-center w-7 h-7 rounded text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
    >
      <span class="w-3.5 h-3.5 inline-flex items-center justify-center">
        <i class="fa-solid fa-eye" data-aktc-eye aria-hidden="true"></i>
      </span>
    </button>
    <button
      type="button"
      data-aktc-copy
      aria-label="Copy token to clipboard"
      class="inline-flex items-center justify-center w-7 h-7 rounded text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
    >
      <span class="w-3.5 h-3.5 inline-flex items-center justify-center">
        <i class="fa-solid fa-copy" data-aktc-copy-icon aria-hidden="true"></i>
      </span>
    </button>
  </div>

  <dl class="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
    <div>
      <dt class="text-[10px] uppercase tracking-wider text-text-disabled">Created</dt>
      <dd class="text-text-primary"><%= formatDate(_createdAt) %></dd>
    </div>
    <div>
      <dt class="text-[10px] uppercase tracking-wider text-text-disabled">Last used</dt>
      <dd class="text-text-primary"><%= _lastUsedAt ? formatDate(_lastUsedAt) : 'Never' %></dd>
    </div>
  </dl>

  <% if (_scopes && _scopes.length > 0) { %>
  <div class="flex flex-wrap gap-1.5 border-t border-border pt-3">
    <% _scopes.forEach(function(scope) { %>
      <code class="px-1.5 py-0.5 rounded bg-primary-subtle text-primary font-mono text-[11px]"><%= scope %></code>
    <% }); %>
  </div>
  <% } %>
</div>

<script>(function(){
  var root = document.getElementById('<%= _uid %>');
  if (!root || root.dataset.aktcInit === '1') return;
  root.dataset.aktcInit = '1';

  var token   = root.getAttribute('data-token') || '';
  var display = root.querySelector('[data-aktc-display]');
  var masked  = display ? (display.getAttribute('data-masked') || display.textContent) : '';
  var toggle  = root.querySelector('[data-aktc-toggle]');
  var eyeIcon = root.querySelector('[data-aktc-eye]');
  var copyBtn = root.querySelector('[data-aktc-copy]');
  var copyIcon= root.querySelector('[data-aktc-copy-icon]');

  var revealed = false;
  if (toggle) {
    toggle.addEventListener('click', function(){
      revealed = !revealed;
      if (display) display.textContent = revealed ? token : masked;
      toggle.setAttribute('aria-pressed', revealed ? 'true' : 'false');
      toggle.setAttribute('aria-label', revealed ? 'Hide token' : 'Reveal token');
      if (eyeIcon) {
        eyeIcon.classList.remove('fa-eye', 'fa-eye-slash');
        eyeIcon.classList.add(revealed ? 'fa-eye-slash' : 'fa-eye');
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', function(){
      var done = function(){
        copyBtn.classList.add('text-success');
        copyBtn.setAttribute('aria-label', 'Copied');
        if (copyIcon) {
          copyIcon.classList.remove('fa-copy');
          copyIcon.classList.add('fa-check');
        }
        setTimeout(function(){
          copyBtn.classList.remove('text-success');
          copyBtn.setAttribute('aria-label', 'Copy token to clipboard');
          if (copyIcon) {
            copyIcon.classList.remove('fa-check');
            copyIcon.classList.add('fa-copy');
          }
        }, 1600);
      };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(token).then(done).catch(function(){});
        } else {
          var ta = document.createElement('textarea');
          ta.value = token;
          ta.setAttribute('readonly', '');
          ta.style.position = 'absolute';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); done(); } catch (e) {}
          document.body.removeChild(ta);
        }
      } catch (e) { /* ignore */ }
    });
  }
})();</script>

```
