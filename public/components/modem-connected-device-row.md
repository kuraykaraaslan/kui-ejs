# ConnectedDeviceRow

- **id:** `modem-connected-device-row`
- **layer:** domain
- **category:** Domain · Modem
- **filePath:** `modules/domain/modem/ConnectedDeviceRow.ejs`
- **status:** stable
- **since:** 2025-05

Connected device table row. Device icon, hostname/MAC, IP, connection type (wired/wifi + dBm), traffic, and DHCP/Static/Blocked status.

## Design tokens consumed

- `--border`
- `--error`
- `--info`
- `--primary`
- `--primary-subtle`
- `--secondary`
- `--success`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Mixed device list

```ejs
<table class="w-full text-sm">
  <thead>...</thead>
  <tbody>
    <% state.connectedDevices.forEach(function(dev) { %>
    <%- include('modules/domain/modem/ConnectedDeviceRow', { device: dev }) %>
    <% }); %>
  </tbody>
</table>
```

## Full EJS source

```ejs
<%
  var _dev = locals.device || {};

  var iconMap = {
    computer: 'fa-solid fa-desktop',
    laptop:   'fa-solid fa-laptop',
    phone:    'fa-solid fa-mobile-screen',
    tablet:   'fa-solid fa-tablet-screen-button',
    tv:       'fa-solid fa-tv',
    gaming:   'fa-solid fa-gamepad',
    printer:  'fa-solid fa-print',
    camera:   'fa-solid fa-camera',
    iot:      'fa-solid fa-microchip',
    router:   'fa-solid fa-network-wired',
    nas:      'fa-solid fa-hard-drive',
    unknown:  'fa-solid fa-circle-question',
  };

  var connLabel = { WIRED: 'Wired', WIFI_2_4: '2.4 GHz', WIFI_5: '5 GHz', WIFI_6: '6 GHz' };

  function fmtBytes(b) {
    if (b >= 1073741824) return (b / 1073741824).toFixed(1) + ' GB';
    if (b >= 1048576)    return (b / 1048576).toFixed(0) + ' MB';
    return (b / 1024).toFixed(0) + ' KB';
  }

  var icon     = iconMap[_dev.iconType]       || iconMap.unknown;
  var name     = _dev.customName || _dev.hostname || '—';
  var conn     = connLabel[_dev.connectionType] || _dev.connectionType;
  var upload   = fmtBytes(_dev.uploadBytes   || 0);
  var download = fmtBytes(_dev.downloadBytes || 0);
%>
<tr class="border-t border-border hover:bg-surface-raised transition-colors<%= _dev.isBlocked ? ' opacity-60' : '' %>">
  <td class="py-3 px-4">
    <div class="flex items-center gap-3">
      <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-overlay text-text-secondary text-sm">
        <i class="<%= icon %>" aria-hidden="true"></i>
      </span>
      <div class="min-w-0">
        <p class="text-sm font-medium text-text-primary truncate"><%= name %></p>
        <p class="text-xs font-mono text-text-secondary truncate"><%= _dev.mac %></p>
      </div>
    </div>
  </td>
  <td class="py-3 px-4 text-sm font-mono text-text-secondary"><%= _dev.ip %></td>
  <td class="py-3 px-4 hidden md:table-cell">
    <span class="inline-flex items-center gap-1.5 text-xs text-text-secondary">
      <i class="<%= _dev.connectionType === 'WIRED' ? 'fa-solid fa-ethernet' : 'fa-solid fa-wifi' %> text-primary" aria-hidden="true"></i>
      <%= conn %>
      <% if (_dev.signalDbm !== null && _dev.signalDbm !== undefined) { %>
      <span class="text-text-secondary tabular-nums">(<%= _dev.signalDbm %> dBm)</span>
      <% } %>
    </span>
  </td>
  <td class="py-3 px-4 hidden lg:table-cell text-xs tabular-nums">
    <span class="text-info"><i class="fa-solid fa-arrow-up" aria-hidden="true"></i> <%= upload %></span>
    <span class="mx-1 text-border" aria-hidden="true">·</span>
    <span class="text-success"><i class="fa-solid fa-arrow-down" aria-hidden="true"></i> <%= download %></span>
  </td>
  <td class="py-3 px-4">
    <% if (_dev.isBlocked) { %>
    <span class="inline-flex items-center rounded-full bg-error/10 border border-error/30 text-error text-xs px-2 py-0.5 font-medium">Blocked</span>
    <% } else if (_dev.isStatic) { %>
    <span class="inline-flex items-center rounded-full bg-primary-subtle border border-primary/20 text-primary text-xs px-2 py-0.5 font-medium">Static</span>
    <% } else { %>
    <span class="inline-flex items-center rounded-full bg-surface-overlay border border-border text-text-secondary text-xs px-2 py-0.5">DHCP</span>
    <% } %>
  </td>
</tr>

```
