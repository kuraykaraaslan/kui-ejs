# UpsInfoCard

- **id:** `ups-info-card`
- **layer:** domain
- **category:** Domain · UPS
- **filePath:** `modules/domain/ups/UpsInfoCard.ejs`
- **status:** stable
- **since:** 0.1

2-column info grid displaying UPS model, serial, firmware, capacity, and voltage specs.

## Design tokens consumed

- `--border`
- `--primary`
- `--secondary`
- `--surface-raised`
- `--text-primary`
- `--text-secondary`

## Variants

### UPS info grid

```ejs
<%- include('../../../modules/domain/ups/UpsInfoCard', { info: state.ups }) %>
```

## Full EJS source

```ejs
<%
  var _info = locals.info || {};
  var rows = [
    { label: 'Model',      value: _info.model            || '—' },
    { label: 'Manufacturer', value: _info.manufacturer   || '—' },
    { label: 'Serial',     value: _info.serial            || '—' },
    { label: 'Firmware',   value: _info.firmwareVersion   || '—' },
    { label: 'Capacity',   value: (_info.nominalVA || '—') + ' VA / ' + (_info.nominalWatts || '—') + ' W' },
    { label: 'Input V',    value: (_info.inputVoltage  || '—') + ' V' },
    { label: 'Output V',   value: (_info.outputVoltage || '—') + ' V' },
    { label: 'Frequency',  value: (_info.frequency     || '—') + ' Hz' },
  ];
%>
<div class="rounded-xl border border-border bg-surface-raised overflow-hidden">
  <div class="px-4 py-3 border-b border-border">
    <h3 class="text-xs font-bold text-text-primary uppercase tracking-wide">UPS Information</h3>
  </div>
  <div class="grid grid-cols-2 divide-y divide-border">
    <% rows.forEach(function(row) { %>
    <div class="px-4 py-2.5 text-xs text-text-secondary font-medium border-r border-border"><%= row.label %></div>
    <div class="px-4 py-2.5 text-xs font-mono text-text-primary"><%= row.value %></div>
    <% }); %>
  </div>
</div>

```
