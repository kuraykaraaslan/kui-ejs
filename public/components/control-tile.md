# ControlTile

- **id:** `control-tile`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/ControlTile/ControlTile.ejs`
- **status:** stable
- **since:** 2026-10

Async controls: a frame (`ControlTile`) plus `ControlButton`, `ControlSwitch`, `ControlSlider` and `ControlSetpoint`. Each takes the bound `value` and a write handler that returns a Promise, and shows idle -> pending -> confirmed / mismatch / failed with the previous value restored on failure. The slider writes once on release. Hand the write to the control with `root.__kuiControl.onCommit = fn`, the `onCommit` global-function name, or the `kui:control-commit` DOM event. No transport knowledge; all text is overridable through `messages`.

## Depends on (include order)

- `toggle`
- `range-slider`
- `button`

## Accessibility

- WCAG: AA
- ARIA patterns: switch, slider, status

The status line is an aria-live region; a failure is role="alert". Pending sets aria-busy and disables the input. A bad set-point is a field error (aria-invalid + described-by) and sends nothing.

## Design tokens consumed

- `--surface-raised`
- `--border`
- `--primary`
- `--success`
- `--warning`
- `--error`
- `--text-secondary`

## Variants

### Switch: pending then confirmed

```ejs
<%- include('modules/ui/ControlTile/ControlSwitch', { id: 'heater', title: 'Heater', value: false }) %>
<script>
  document.getElementById('heater').__kuiControl.onCommit = (next) => api.setHeater(next);
</script>
```

### Switch: failure rolls back (with Retry)

```ejs
<%- include('modules/ui/ControlTile/ControlSwitch', { id: 'heater', title: 'Heater', value: false }) %>
<script>
  document.getElementById('heater').__kuiControl.onCommit = () => Promise.reject(new Error('Device offline'));
</script>
```

### Switch: the device reports a different value (mismatch)

```ejs
<%- include('modules/ui/ControlTile/ControlSwitch', { id: 'heater', title: 'Heater', value: false, reported: false, timeoutMs: 2500 }) %>
<script>
  const heater = document.getElementById('heater').__kuiControl;
  heater.onCommit = write;
  deviceEvents.on('heater', (state) => heater.setReported(state));
</script>
```

### Slider: commit on release

```ejs
<%- include('modules/ui/ControlTile/ControlSlider', { title: 'Fan speed', value: 40, min: 0, max: 100, step: 5, unit: '%' }) %>
```

### Set point: validated entry

```ejs
<%- include('modules/ui/ControlTile/ControlSetpoint', { title: 'Target temperature', value: 21, min: 5, max: 30, step: 0.5, unit: '°C', decimals: 1 }) %>
```

### Button: none / confirm / typed confirmation

```ejs
<%- include('modules/ui/ControlTile/ControlButton', { title: 'Gateway', label: 'Reboot', confirm: 'typed', confirmText: 'reboot' }) %>
```

### Read-only (no permission)

```ejs
<%- include('modules/ui/ControlTile/ControlSwitch', { title: 'Heater', value: false, readOnly: true }) %>
```

## Full EJS source

```ejs
<%
  // ControlTile — the frame every async control shares: title, the control slot,
  // and one live status line (pending / confirmed / mismatch / failed / read-only).
  // One place, so the controls cannot drift on what "pending" or "failed" looks
  // like. Mirror of kui-react modules/ui/ControlTile/ControlTile.tsx.
  //
  // The status line is rendered by the runtime (scripts/control-bind.js) as the
  // control's state changes; this partial renders the idle state (the read-only
  // notice, when set). Locals:
  //   id            — root id (auto-generated when omitted)
  //   title         — optional heading
  //   body          — pre-rendered HTML of the control (trusted include output)
  //   kind          — 'switch' | 'slider' | 'setpoint' | 'button' (runtime binder)
  //   config        — JSON-serialisable settings for the binder
  //   readOnly      — show the read-only notice (the user may not use the control)
  //   reportedText  — quiet line under the control (the slider keeps it live)
  //   messages      — { pending, confirmed, mismatch, failed, readOnly, retry, ... }
  //   className     — extra classes on the frame
  //
  // DEFAULT_CONTROL_MESSAGES (same strings as kui-react):
  var DEFAULT_MESSAGES = {
    pending: 'Sending…',
    confirmed: 'Done',
    mismatch: 'The device reports a different value.',
    failed: 'The change failed.',
    readOnly: 'You do not have permission to use this control.',
    retry: 'Retry',
  };
  var _m = Object.assign({}, DEFAULT_MESSAGES, locals.messages || {});
  var _id = locals.id || ('control-' + Math.random().toString(36).substr(2, 9));
  var _title = locals.title || '';
  var _readOnly = !!locals.readOnly;
  var _reportedText = locals.reportedText || '';
  var _kind = locals.kind || '';
  var body = locals.body || '';
  var _reportedHolder = !!locals.reportedHolder;   // slider: a live (initially hidden) reported line
%>
<div
  id="<%= _id %>"
  class="rounded-lg border border-border bg-surface-raised p-3<%= locals.className ? ' ' + locals.className : '' %>"
  <% if (_kind) { %>data-kui-control="<%= _kind %>"
  data-kui-control-config="<%= JSON.stringify(locals.config || {}) %>"
  data-kui-messages="<%= JSON.stringify(_m) %>"<% } %>
>
  <% if (_title) { %><h3 class="mb-2 text-sm font-semibold text-text-primary"><%= _title %></h3><% } %>
  <div class="space-y-2">
    <%- body %>
    <% if (_reportedText || _reportedHolder) { %><p class="text-xs text-text-secondary" data-kui-control-reported<%= _reportedText ? '' : ' hidden' %>><%= _reportedText %></p><% } %>
    <div class="flex min-h-5 items-center gap-2 text-xs" aria-live="polite" data-kui-control-status>
      <% if (_readOnly) { %><span class="text-text-secondary"><%= _m.readOnly %></span><% } %>
    </div>
  </div>
</div>


<%
  // ControlSwitch — a bound boolean written on toggle; shows the requested value
  // while pending, rolls back on failure. Mirror of kui-react ControlSwitch.
  //
  // Locals:
  //   id, title
  //   value       — the bound state. Anything asBoolean cannot read is "unknown" and shows off.
  //   reported    — the state the other side reports, if it reports one; "pending"
  //                 lasts until it matches. Omit it when nothing reports back.
  //   onCommit    — NAME of a global function (next: boolean) => Promise, the write.
  //                 Reject to fail and roll the thumb back. Or listen for the DOM event
  //                 'kui:control-commit' (detail.respond(promise)) — see scripts/control-bind.js.
  //   onLabel ('On'), offLabel ('Off'), unknownLabel ('State unknown')
  //   readOnly    — the user may not use the control
  //   disabled, timeoutMs (10000), messages, className
  //   loadRuntime — default true (see _runtime.ejs)
  //
  // Runtime: document.getElementById(id).__kuiControl.setValue(v) / .setReported(v) / .onCommit = fn
  var L = {};
  include('./_logic', { L: L });
  var _id = locals.id || ('control-switch-' + Math.random().toString(36).substr(2, 9));
  var _bound = L.asBoolean(locals.value);
  var _shown = _bound === null ? false : _bound;
  var _onLabel = locals.onLabel || 'On';
  var _offLabel = locals.offLabel || 'Off';
  var _unknownLabel = locals.unknownLabel || 'State unknown';
  var _readOnly = !!locals.readOnly;
  var _disabled = !!locals.disabled;
  var _hintId = _id + '-hint';
  var _toggle = include('../Toggle', {
    id: _id + '-toggle', label: _shown ? _onLabel : _offLabel, ariaLabel: locals.title || undefined,
    checked: _shown, disabled: _disabled || _readOnly,
  });
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  var body = '<div class="flex items-center gap-3">' + _toggle
    + '<span id="' + esc(_hintId) + '" class="text-xs text-text-secondary" data-kui-control-hint' + (_bound === null ? '' : ' hidden') + '>' + esc(_unknownLabel) + '</span>'
    + '</div>';
%>
<%- include('./ControlTile', {
  id: _id, title: locals.title, kind: 'switch', readOnly: _readOnly, messages: locals.messages, className: locals.className,
  body: body,
  config: {
    value: locals.value, reported: locals.reported, timeoutMs: locals.timeoutMs, readOnly: _readOnly,
    disabled: _disabled, onLabel: _onLabel, offLabel: _offLabel, onCommit: locals.onCommit,
  },
}) %>
<% if (locals.loadRuntime !== false) { %><%- include('./_runtime') %><% } %>

```
