import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

// useAsyncControl: the state machine behind ControlTile. kui-react exposes it as a
// hook (libs/hooks/useAsyncControl.ts); in kui-ejs it is KuiControl.createAsyncControl
// (modules/ui/ControlTile/scripts/async-control.js). The demo markup is identical to
// the kui-react preview.
const scriptPath = path.join(process.cwd(), 'modules/ui/ControlTile/scripts/async-control.js');
const scriptSource = fs.readFileSync(scriptPath, 'utf-8');
const buttonPath = path.join(process.cwd(), 'modules/ui/Button.ejs');
const buttonSource = fs.readFileSync(buttonPath, 'utf-8');

type Scenario = 'ok' | 'fail' | 'mismatch' | 'confirm';

/** The exact class string Button.ejs renders for a variant + size. */
function btnClass(variant: string, size: string): string {
  const html = ejs.render(buttonSource, { variant, size, children: 'x' }, { filename: buttonPath });
  const m = html.match(/class="([^"]*)"/);
  return (m ? m[1] : '').replace(/\s+/g, ' ').trim();
}

const CLASSES = {
  turn: btnClass('outline', 'sm'),
  retry: btnClass('secondary', 'sm'),
  confirm: btnClass('primary', 'xs'),
  cancel: btnClass('ghost', 'xs'),
};

const STATE_TEXT = {
  idle: 'Idle',
  pending: 'Pending: writing...',
  confirmed: 'Confirmed',
  mismatch: 'Mismatch: the device reports a different value',
  failed: 'Failed: rolled back to the previous value',
};

let seq = 0;

function asyncControlDemo(scenario: Scenario): string {
  const id = `uac-demo-${++seq}`;
  return `<div id="${id}" class="w-full max-w-sm space-y-3 rounded-lg border border-border bg-surface-raised p-4"></div>
<script>
(function () {
${scriptSource}
  var root = document.getElementById('${id}');
  if (!root || root.__uacMounted) return;
  root.__uacMounted = true;
  var scenario = '${scenario}';
  var CLS = ${JSON.stringify(CLASSES)};
  var STATE_TEXT = ${JSON.stringify(STATE_TEXT)};
  var value = false;
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  // Fake transport: resolves after 600 ms, or rejects with "Device offline" in the fail scenario.
  function transport(fail) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () { if (fail) reject(new Error('Device offline')); else resolve(); }, 600);
    });
  }
  var ctl = window.KuiControl.createAsyncControl({
    value: value,
    // In the mismatch scenario the device never agrees: it keeps reporting false.
    reported: scenario === 'mismatch' ? false : undefined,
    timeoutMs: 1500,
    confirmedMs: 2000,
    confirm: scenario === 'confirm',
    commit: function (next) {
      return transport(scenario === 'fail').then(function () { value = next; ctl.setValue(next); });
    },
    onChange: render,
  });
  function render(s) {
    var shown = Boolean(s.displayValue);
    var h = '<div class="flex items-center justify-between gap-3">'
      + '<span class="text-sm font-medium text-text-primary">Heater: ' + (shown ? 'on' : 'off') + '</span>'
      + '<button type="button" data-act="turn" class="' + CLS.turn + '"' + (s.state === 'pending' ? ' disabled' : '') + '>Turn ' + (shown ? 'off' : 'on') + '</button>'
      + '</div>'
      + '<p class="text-xs text-text-secondary" role="status" aria-live="polite">State: <span class="font-semibold text-text-primary" data-state="' + s.state + '">' + esc(STATE_TEXT[s.state]) + '</span></p>';
    if (s.error) h += '<p class="text-xs text-error" role="alert">' + esc(s.error) + '</p>';
    if (s.state === 'failed' || s.state === 'mismatch') h += '<button type="button" data-act="retry" class="' + CLS.retry + '">Retry</button>';
    if (s.awaiting) {
      h += '<div class="flex items-center gap-2 text-xs text-text-secondary"><span>Switch ' + (s.awaiting.value ? 'on' : 'off') + '?</span>'
        + '<button type="button" data-act="accept" class="' + CLS.confirm + '">Confirm</button>'
        + '<button type="button" data-act="dismiss" class="' + CLS.cancel + '">Cancel</button></div>';
    }
    root.innerHTML = h;
  }
  root.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!b || b.disabled) return;
    var act = b.getAttribute('data-act');
    if (act === 'turn') ctl.set(!Boolean(ctl.snapshot().displayValue));
    else if (act === 'retry') ctl.retry();
    else if (act === 'accept') ctl.accept();
    else if (act === 'dismiss') ctl.dismiss();
  });
  render(ctl.snapshot());
})();
</script>`;
}

export function buildUseAsyncControlData(): ShowcaseItem[] {
  return [
    {
      id: 'use-async-control',
      title: 'useAsyncControl (hook)',
      category: 'Molecule',
      abbr: 'Ua',
      since: '2026-10',
      description:
        'State machine behind ControlTile: idle -> pending -> confirmed / mismatch / failed. `commit` returns a Promise (a rejection rolls the display back to the bound `value`); an optional `reported` value keeps the write pending until the other side agrees, else it ends as mismatch after `timeoutMs`; `confirm` parks the value until `accept()` / `dismiss()`. No transport knowledge. In kui-ejs it is `KuiControl.createAsyncControl` (modules/ui/ControlTile/scripts/async-control.js), the counterpart of the kui-react hook in libs/hooks/useAsyncControl.ts.',
      filePath: 'modules/ui/ControlTile/scripts/async-control.js',
      sourceCode: scriptSource,
      relatedTo: ['control-tile', 'toggle', 'range-slider'],
      variants: [
        {
          title: 'Success: pending then confirmed',
          layout: 'stack' as const,
          previewHtml: asyncControlDemo('ok'),
          code: `const ctl = KuiControl.createAsyncControl({ value, commit: async (n) => { await api.write(n); ctl.setValue(n); }, onChange: render });`,
        },
        {
          title: 'Failure: rolls back (with Retry)',
          layout: 'stack' as const,
          previewHtml: asyncControlDemo('fail'),
          code: `const ctl = KuiControl.createAsyncControl({ value, commit: () => Promise.reject(new Error('Device offline')), onChange: render });\n// snapshot().state === 'failed', snapshot().error === 'Device offline', ctl.retry()`,
        },
        {
          title: 'Mismatch: the device reports a different value',
          layout: 'stack' as const,
          previewHtml: asyncControlDemo('mismatch'),
          code: `const ctl = KuiControl.createAsyncControl({ value, reported: deviceState, timeoutMs: 1500, commit: write, onChange: render });`,
        },
        {
          title: 'Confirm before commit',
          layout: 'stack' as const,
          previewHtml: asyncControlDemo('confirm'),
          code: `const ctl = KuiControl.createAsyncControl({ value, confirm: true, commit: write, onChange: render });\n// ctl.set(next) -> snapshot().awaiting -> ctl.accept() | ctl.dismiss()`,
        },
      ],
    },
  ];
}
