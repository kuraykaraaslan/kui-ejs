import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

// ControlTile: a frame plus ControlSwitch / ControlSlider / ControlSetpoint /
// ControlButton. Each asks for a write through a Promise-returning handler and
// shows idle -> pending -> confirmed / mismatch / failed.
const dir = path.join(process.cwd(), 'modules/ui/ControlTile');
const read = (f: string) => fs.readFileSync(path.join(dir, f), 'utf-8');
const sources = {
  tile: read('ControlTile.ejs'),
  switch: read('ControlSwitch.ejs'),
  slider: read('ControlSlider.ejs'),
  setpoint: read('ControlSetpoint.ejs'),
  button: read('ControlButton.ejs'),
};

function render(file: string, locals: Record<string, unknown>): string {
  const p = path.join(dir, file);
  return ejs.render(fs.readFileSync(p, 'utf-8'), locals, { filename: p });
}

/**
 * Wires a mock slow write (900 ms, or a rejection when `fail`) onto a control and
 * feeds the result back as the new bound value, like a host page would.
 * `reportBack` also reports the written value (a device that confirms it).
 */
function wire(id: string, opts: { fail?: boolean; reportBack?: boolean; setBound?: boolean } = {}): string {
  const { fail = false, reportBack = false, setBound = true } = opts;
  return `<script>(function(){
  var root = document.getElementById('${id}');
  if (!root || !root.__kuiControl) return;
  root.__kuiControl.onCommit = function (next) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (${fail}) { reject(new Error('Device offline')); return; }
        ${setBound ? 'root.__kuiControl.setValue(next);' : ''}
        ${reportBack ? 'root.__kuiControl.setReported(next);' : ''}
        resolve();
      }, 900);
    });
  };
})();</script>`;
}

const box = (inner: string) => `<div class="w-full max-w-xs">${inner}</div>`;

export function buildControlTileData(): ShowcaseItem[] {
  return [
    {
      id: 'control-tile',
      title: 'ControlTile',
      category: 'Molecule',
      abbr: 'Ct',
      description:
        'Async controls: a frame (`ControlTile`) plus `ControlButton`, `ControlSwitch`, `ControlSlider` and `ControlSetpoint`. Each takes the bound `value` and a write handler that returns a Promise, and shows idle -> pending -> confirmed / mismatch / failed with the previous value restored on failure. The slider writes once on release. Hand the write to the control with `root.__kuiControl.onCommit = fn`, the `onCommit` global-function name, or the `kui:control-commit` DOM event. No transport knowledge; all text is overridable through `messages`.',
      filePath: 'modules/ui/ControlTile/ControlTile.ejs',
      sourceCode: sources.tile + '\n\n' + sources.switch,
      since: '2026-10',
      relatedTo: ['toggle', 'range-slider', 'button'],
      composes: ['toggle', 'range-slider', 'button'],
      designTokens: ['--surface-raised', '--border', '--primary', '--success', '--warning', '--error', '--text-secondary'],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['switch', 'slider', 'status'],
        notes: 'The status line is an aria-live region; a failure is role="alert". Pending sets aria-busy and disables the input. A bad set-point is a field error (aria-invalid + described-by) and sends nothing.',
      },
      variants: [
        {
          title: 'Switch: pending then confirmed',
          layout: 'stack' as const,
          previewHtml: box(render('ControlSwitch.ejs', { id: 'ct-switch-ok', title: 'Heater', value: false })) + wire('ct-switch-ok'),
          code: `<%- include('modules/ui/ControlTile/ControlSwitch', { id: 'heater', title: 'Heater', value: false }) %>
<script>
  document.getElementById('heater').__kuiControl.onCommit = (next) => api.setHeater(next);
</script>`,
        },
        {
          title: 'Switch: failure rolls back (with Retry)',
          layout: 'stack' as const,
          previewHtml: box(render('ControlSwitch.ejs', { id: 'ct-switch-fail', title: 'Heater', value: false })) + wire('ct-switch-fail', { fail: true }),
          code: `<%- include('modules/ui/ControlTile/ControlSwitch', { id: 'heater', title: 'Heater', value: false }) %>
<script>
  document.getElementById('heater').__kuiControl.onCommit = () => Promise.reject(new Error('Device offline'));
</script>`,
        },
        {
          title: 'Switch: the device reports a different value (mismatch)',
          layout: 'stack' as const,
          previewHtml: box(render('ControlSwitch.ejs', { id: 'ct-switch-mismatch', title: 'Heater', value: false, reported: false, timeoutMs: 2500 })) + wire('ct-switch-mismatch'),
          code: `<%- include('modules/ui/ControlTile/ControlSwitch', { id: 'heater', title: 'Heater', value: false, reported: false, timeoutMs: 2500 }) %>
<script>
  const heater = document.getElementById('heater').__kuiControl;
  heater.onCommit = write;
  deviceEvents.on('heater', (state) => heater.setReported(state));
</script>`,
        },
        {
          title: 'Slider: commit on release',
          layout: 'stack' as const,
          previewHtml: box(render('ControlSlider.ejs', { id: 'ct-slider', title: 'Fan speed', value: 40, min: 0, max: 100, step: 5, unit: '%' })) + wire('ct-slider'),
          code: `<%- include('modules/ui/ControlTile/ControlSlider', { title: 'Fan speed', value: 40, min: 0, max: 100, step: 5, unit: '%' }) %>`,
        },
        {
          title: 'Set point: validated entry',
          layout: 'stack' as const,
          previewHtml: box(render('ControlSetpoint.ejs', { id: 'ct-setpoint', title: 'Target temperature', value: 21, min: 5, max: 30, step: 0.5, unit: '°C', decimals: 1 })) + wire('ct-setpoint'),
          code: `<%- include('modules/ui/ControlTile/ControlSetpoint', { title: 'Target temperature', value: 21, min: 5, max: 30, step: 0.5, unit: '°C', decimals: 1 }) %>`,
        },
        {
          title: 'Button: none / confirm / typed confirmation',
          layout: 'stack' as const,
          previewHtml: `<div class="flex flex-wrap gap-3">`
            + box(render('ControlButton.ejs', { id: 'ct-button-none', title: 'Gateway', label: 'Reboot', confirm: 'none' })) + wire('ct-button-none', { setBound: false })
            + box(render('ControlButton.ejs', { id: 'ct-button-confirm', title: 'Gateway', label: 'Reboot', confirm: 'confirm' })) + wire('ct-button-confirm', { setBound: false })
            + box(render('ControlButton.ejs', { id: 'ct-button-typed', title: 'Gateway', label: 'Reboot', confirm: 'typed', confirmText: 'reboot' })) + wire('ct-button-typed', { setBound: false })
            + `</div>`,
          code: `<%- include('modules/ui/ControlTile/ControlButton', { title: 'Gateway', label: 'Reboot', confirm: 'typed', confirmText: 'reboot' }) %>`,
        },
        {
          title: 'Read-only (no permission)',
          layout: 'stack' as const,
          previewHtml: box(render('ControlTile.ejs', {
            title: 'Heater', readOnly: true,
            body: '<p class="text-sm text-text-secondary">Any control goes in the slot.</p>',
          })),
          code: `<%- include('modules/ui/ControlTile/ControlSwitch', { title: 'Heater', value: false, readOnly: true }) %>`,
        },
      ],
    },
  ];
}
