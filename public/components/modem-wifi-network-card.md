# WifiNetworkCard

- **id:** `modem-wifi-network-card`
- **layer:** domain
- **category:** Domain · Modem
- **filePath:** `modules/domain/modem/WifiNetworkCard.ejs`
- **status:** stable
- **since:** 0.1

SSID, band (2.4/5/6 GHz), güvenlik modu ve guest/disabled etiketleri. editHref prop'u ile düzenleme bağlantısı eklenir.

## Design tokens consumed

- `--border`
- `--info`
- `--primary`
- `--primary-subtle`
- `--secondary`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`
- `--warning`

## Variants

### Dual-band + guest

```ejs
<% wifi.networks.forEach(function(net) { %>
<%- include('modules/domain/modem/WifiNetworkCard', { network: net }) %>
<% }); %>
```

### Disabled network

```ejs
<%- include('modules/domain/modem/WifiNetworkCard', { network: { ...net, enabled: false } }) %>
```

### With edit link

```ejs
<%- include('modules/domain/modem/WifiNetworkCard', { network: net, editHref: '/wifi/edit/' + net.id }) %>
```

## Full EJS source

```ejs
<%
  var _net     = locals.network  || {};
  var _enabled = _net.enabled !== false;
  var _isGuest = _net.isGuest || false;

  var secLabels = {
    OPEN:              'Open',
    WPA2_PERSONAL:     'WPA2',
    WPA3_PERSONAL:     'WPA3',
    WPA2_WPA3_MIXED:   'WPA2/3',
    WPA2_ENTERPRISE:   'WPA2-Ent',
    WPA3_ENTERPRISE:   'WPA3-Ent',
  };
  var secLabel  = secLabels[_net.securityMode] || _net.securityMode;
  var bandColor = _net.band === '6GHz' ? 'text-secondary' : _net.band === '5GHz' ? 'text-primary' : 'text-info';
%>
<div class="rounded-xl border <%= _enabled ? 'border-border' : 'border-border opacity-60' %> bg-surface-raised p-4 flex items-center gap-4<%= locals.className ? ' ' + locals.className : '' %>">
  <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle <%= bandColor %>">
    <i class="fa-solid fa-wifi text-sm" aria-hidden="true"></i>
  </span>

  <div class="flex-1 min-w-0">
    <div class="flex items-center gap-2 flex-wrap">
      <p class="text-sm font-semibold text-text-primary truncate"><%= _net.ssid %></p>
      <% if (_isGuest) { %>
      <span class="rounded-md bg-warning/10 border border-warning/30 px-1.5 py-0.5 text-xs font-medium text-warning">Guest</span>
      <% } %>
      <% if (!_enabled) { %>
      <span class="rounded-md bg-surface-overlay border border-border px-1.5 py-0.5 text-xs font-medium text-text-secondary">Off</span>
      <% } %>
    </div>
    <div class="flex items-center gap-2 mt-0.5 text-xs text-text-secondary">
      <span><%= _net.band %></span>
      <span aria-hidden="true">·</span>
      <span><%= secLabel %></span>
      <% if (_net.maxClients) { %>
      <span aria-hidden="true">·</span>
      <span>Max <%= _net.maxClients %></span>
      <% } %>
    </div>
  </div>

  <% if (locals.editHref) { %>
  <a href="<%= locals.editHref %>"
     class="shrink-0 text-xs text-text-secondary hover:text-text-primary transition-colors px-2 py-1 rounded border border-border hover:bg-surface-overlay">
    Edit
  </a>
  <% } %>
</div>

```
