# PortForwardRow

- **id:** `modem-port-forward-row`
- **layer:** domain
- **category:** Domain · Modem
- **filePath:** `modules/domain/modem/PortForwardRow.ejs`
- **status:** stable
- **since:** 0.1

Port yönlendirme tablosu satırı. Kural adı, protokol, harici port, dahili IP:port ve etkin/devre dışı gösterimi.

## Design tokens consumed

- `--border`
- `--primary`
- `--secondary`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### Port forwarding rules

```ejs
<table class="w-full text-sm">
  <thead>...</thead>
  <tbody>
    <% nat.portForwardRules.forEach(function(rule) { %>
    <%- include('modules/domain/modem/PortForwardRow', { rule: rule }) %>
    <% }); %>
  </tbody>
</table>
```

### Port range rule

```ejs
<%- include('modules/domain/modem/PortForwardRow', {
  rule: {
    name: 'Game Server', enabled: true, protocol: 'UDP',
    externalPort: { start: 27015, end: 27030 },
    internalIp: '192.168.1.10',
    internalPort: { start: 27015, end: 27030 },
  }
}) %>
```

## Full EJS source

```ejs
<%
  var _rule    = locals.rule    || {};
  var _enabled = _rule.enabled !== false;

  function portStr(p) {
    if (p === null || p === undefined) return '—';
    if (typeof p === 'object' && p.start !== undefined) return p.start + '–' + p.end;
    return String(p);
  }
%>
<tr class="border-t border-border hover:bg-surface-raised transition-colors<%= !_enabled ? ' opacity-50' : '' %>">
  <td class="py-3 px-4">
    <div class="flex items-center gap-2">
      <span class="text-sm font-medium text-text-primary"><%= _rule.name %></span>
      <% if (!_enabled) { %>
      <span class="text-xs text-text-secondary bg-surface-overlay border border-border rounded px-1.5 py-0.5">Off</span>
      <% } %>
    </div>
  </td>
  <td class="py-3 px-4 hidden sm:table-cell text-xs font-mono text-text-secondary"><%= _rule.protocol %></td>
  <td class="py-3 px-4 text-sm font-mono text-text-primary tabular-nums"><%= portStr(_rule.externalPort) %></td>
  <td class="py-3 px-4 hidden md:table-cell text-xs font-mono text-text-secondary">
    <span class="text-text-primary"><%= _rule.internalIp %></span>:<%= portStr(_rule.internalPort) %>
  </td>
</tr>

```
