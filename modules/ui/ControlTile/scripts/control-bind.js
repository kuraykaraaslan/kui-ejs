/*
 * modules/ui/ControlTile/scripts/control-bind.js
 *
 * DOM binding for the async controls (ControlSwitch / ControlSlider /
 * ControlSetpoint / ControlButton). Mirrors the kui-react components in
 * modules/ui/ControlTile/. Requires control-logic.js + async-control.js.
 *
 * Mounted by KuiControl.autoInit() from `[data-kui-control="<kind>"]` +
 * `data-kui-control-config` (JSON) + `data-kui-messages` (JSON).
 *
 * The write (kui-react `onCommit: (value) => Promise<void>`) is resolved in this order:
 *   1. root.__kuiControl.onCommit = function (value) { return promise }
 *   2. the global function named by the `onCommit` local / data-on-commit
 *   3. the DOM event 'kui:control-commit' on the root (bubbles):
 *        detail: { value, kind, id, respond(promise) }
 *      call respond() with the promise of your write; reject it to fail.
 *   With none of these the commit resolves at once.
 *
 * Runtime API on the root element: root.__kuiControl = {
 *   setValue(v)        the bound value changed
 *   setReported(v)     the value the other side reports (undefined = no report)
 *   onCommit           assign the write handler (see above)
 *   state()            'idle' | 'pending' | 'confirmed' | 'mismatch' | 'failed'
 *   destroy()
 * }
 */
(function (global) {
  'use strict';
  var KC = global.KuiControl;
  var L = global.KuiControlLogic;
  if (!KC || !L || KC.autoInit) return;

  var RETRY_CLASS = 'rounded-sm text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus';
  var SPINNER_CLASS = 'inline-block h-3 w-3 animate-spin rounded-full border-2 border-border border-t-primary motion-reduce:animate-none';
  var BTN_SPINNER_CLASS = 'inline-block rounded-full border-current border-t-transparent animate-spin shrink-0 h-4 w-4 border-2';

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function readJson(root, attr) {
    try { return JSON.parse(root.getAttribute(attr) || '{}'); } catch (e) { return {}; }
  }

  /** The one live status line every control shares. */
  function renderStatus(root, msgs, state, error, readOnly) {
    var box = root.querySelector('[data-kui-control-status]');
    if (!box) return;
    box.textContent = '';
    if (state === 'pending') {
      var sp = el('span', SPINNER_CLASS);
      sp.setAttribute('aria-hidden', 'true');
      box.appendChild(sp);
      box.appendChild(el('span', 'text-text-secondary', msgs.pending));
    }
    if (state === 'confirmed') box.appendChild(el('span', 'text-success', msgs.confirmed));
    if (state === 'mismatch') box.appendChild(el('span', 'text-warning', msgs.mismatch));
    if (state === 'failed') {
      var f = el('span', 'text-error', error || msgs.failed);
      f.setAttribute('role', 'alert');
      box.appendChild(f);
    }
    if (state === 'failed' || state === 'mismatch') {
      var retry = el('button', RETRY_CLASS, msgs.retry);
      retry.type = 'button';
      retry.setAttribute('data-kui-control-retry', '');
      box.appendChild(retry);
    }
    if (readOnly && state === 'idle') box.appendChild(el('span', 'text-text-secondary', msgs.readOnly));
  }

  /** Mirror of Button.ejs' loading state, for a button that already exists. */
  function setButtonLoading(btn, on, locked) {
    if (!btn) return;
    var spin = btn.querySelector('[data-kui-btn-spinner]');
    if (on && !spin) {
      spin = el('span', BTN_SPINNER_CLASS);
      spin.setAttribute('aria-hidden', 'true');
      spin.setAttribute('data-kui-btn-spinner', '');
      btn.insertBefore(spin, btn.firstChild);
    } else if (!on && spin) {
      btn.removeChild(spin);
    }
    if (on) btn.setAttribute('aria-busy', 'true'); else btn.removeAttribute('aria-busy');
    btn.disabled = !!locked || !!on;
  }

  function mount(root) {
    var cfg = readJson(root, 'data-kui-control-config');
    var msgs = readJson(root, 'data-kui-messages');
    var kind = root.getAttribute('data-kui-control');
    var id = root.id || '';
    var handlers = { onCommit: null };
    var disposers = [];

    function commitFn(value) {
      if (typeof handlers.onCommit === 'function') return Promise.resolve(handlers.onCommit(value));
      var name = cfg.onCommit;
      if (name && typeof global[name] === 'function') return Promise.resolve(global[name](value));
      var promises = [];
      root.dispatchEvent(new CustomEvent('kui:control-commit', {
        bubbles: true,
        detail: { value: value, kind: kind, id: id, respond: function (p) { promises.push(Promise.resolve(p)); } },
      }));
      return promises.length ? Promise.all(promises).then(function () {}) : Promise.resolve();
    }

    var binder = { switch: bindSwitch, slider: bindSlider, setpoint: bindSetpoint, button: bindButton }[kind];
    if (!binder) return;
    var api = binder(root, cfg, msgs, commitFn);
    if (!api) return;

    root.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target.closest('[data-kui-control-retry]') : null;
      if (t && root.contains(t)) api.ctl.retry();
    });

    root.__kuiControl = {
      setValue: api.setValue,
      setReported: api.setReported,
      state: function () { return api.ctl.snapshot().state; },
      get onCommit() { return handlers.onCommit; },
      set onCommit(fn) { handlers.onCommit = fn; },
      destroy: function () { api.ctl.destroy(); disposers.forEach(function (d) { d(); }); },
    };
  }

  // ── ControlSwitch ─────────────────────────────────────────────────────────
  function bindSwitch(root, cfg, msgs, commitFn) {
    var toggleRoot = root.querySelector('[data-toggle-root]');
    var input = toggleRoot && toggleRoot.querySelector('[data-toggle-input]');
    var labelEl = toggleRoot && toggleRoot.querySelector('[data-toggle-label]');
    var hint = root.querySelector('[data-kui-control-hint]');
    if (!toggleRoot || !input) return null;
    var bound = L.asBoolean(cfg.value);
    var ctl = KC.createAsyncControl({
      value: bound,
      reported: cfg.reported === undefined ? undefined : L.asBoolean(cfg.reported),
      commit: commitFn,
      timeoutMs: cfg.timeoutMs,
      onChange: apply,
    });
    function api() { return toggleRoot.__toggle; }
    function apply(snap) {
      var shown = snap.displayValue === null || snap.displayValue === undefined ? false : snap.displayValue;
      if (api()) {
        api().setChecked(shown);
        api().setPending(snap.state === 'pending');
        api().setMismatch(snap.state === 'mismatch');
        api().setDescribedBy(snap.state === 'mismatch' && hint ? hint.id : null);
      }
      if (labelEl) labelEl.textContent = shown ? cfg.onLabel : cfg.offLabel;
      renderStatus(root, msgs, snap.state, snap.error, cfg.readOnly);
    }
    input.addEventListener('change', function () { ctl.set(input.checked); });
    return {
      ctl: ctl,
      setValue: function (v) {
        bound = L.asBoolean(v);
        if (hint) hint.hidden = bound !== null;
        ctl.setValue(bound);
      },
      setReported: function (v) { ctl.setReported(v === undefined ? undefined : (v === null ? null : L.asBoolean(v))); },
    };
  }

  // ── ControlSlider ─────────────────────────────────────────────────────────
  function bindSlider(root, cfg, msgs, commitFn) {
    var sliderRoot = root.querySelector('[data-rangeslider]');
    var input = sliderRoot && sliderRoot.querySelector('[data-rangeslider-handle="single"]');
    var textEl = root.querySelector('[data-kui-control-value]');
    var reportedEl = root.querySelector('[data-kui-control-reported]');
    if (!sliderRoot || !input) return null;
    var range = L.toRange(cfg);
    var decimals = cfg.decimals || 0;
    var suffix = cfg.unit ? ' ' + cfg.unit : '';
    var bound = L.asNumber(cfg.value);
    var dragged = null; // { v, base }
    var lastSnap = null;
    var ctl = KC.createAsyncControl({
      value: bound,
      reported: cfg.reported === undefined ? undefined : L.asNumber(cfg.reported),
      commit: commitFn,
      timeoutMs: cfg.timeoutMs,
      onChange: function (snap) { lastSnap = snap; apply(); },
    });
    lastSnap = ctl.snapshot();
    function apply() {
      var snap = lastSnap;
      var draft = dragged && dragged.base === bound ? dragged.v : null;
      var shown = draft !== null ? draft : (snap.displayValue !== null && snap.displayValue !== undefined ? snap.displayValue : range.min);
      if (Number(input.value) !== shown && sliderRoot.__rangeslider) sliderRoot.__rangeslider.setValue(shown);
      if (sliderRoot.__rangeslider) sliderRoot.__rangeslider.setPending(snap.state === 'pending');
      if (textEl) textEl.textContent = L.formatValue(shown, decimals) + suffix;
      if (reportedEl) {
        var showReported = bound !== null && draft !== null && draft !== bound;
        reportedEl.hidden = !showReported;
        if (showReported) reportedEl.textContent = msgs.reportedLabel.replace('{value}', L.formatValue(bound, decimals) + suffix);
      }
      renderStatus(root, msgs, snap.state, snap.error, cfg.readOnly);
    }
    input.addEventListener('input', function () {
      dragged = { v: L.snapToStep(Number(input.value), range), base: bound };
      apply();
    });
    // The slider commits once per gesture (pointer up / keyboard idle / blur).
    function onCommit(e) {
      if (!sliderRoot.contains(e.target)) return;
      e.stopPropagation();
      var next = L.snapToStep(e.detail.value, range);
      dragged = null;
      ctl.set(next);
    }
    root.addEventListener('kui:rangeslider-commit', onCommit);
    apply();
    return {
      ctl: ctl,
      setValue: function (v) { bound = L.asNumber(v); ctl.setValue(bound); },
      setReported: function (v) { ctl.setReported(v === undefined ? undefined : (v === null ? null : L.asNumber(v))); },
    };
  }

  // ── ControlSetpoint ───────────────────────────────────────────────────────
  function bindSetpoint(root, cfg, msgs, commitFn) {
    var form = root.querySelector('form');
    var input = root.querySelector('[data-kui-control-input]');
    var btn = root.querySelector('[data-kui-control-apply]');
    var currentEl = root.querySelector('[data-kui-control-current]');
    var errHost = root.querySelector('[data-kui-control-error-host]');
    if (!form || !input) return null;
    var range = L.toRange(cfg);
    var decimals = cfg.decimals || 0;
    var unitText = cfg.unit ? ' ' + cfg.unit : '';
    var bound = L.asNumber(cfg.value);
    var errId = root.id + '-error';
    var lastState = 'idle';
    var ctl = KC.createAsyncControl({
      value: bound,
      reported: cfg.reported === undefined ? undefined : L.asNumber(cfg.reported),
      commit: commitFn,
      timeoutMs: cfg.timeoutMs,
      onChange: function (snap) {
        lastState = snap.state;
        var pending = snap.state === 'pending';
        var locked = !!cfg.disabled || !!cfg.readOnly || pending;
        input.disabled = locked;
        setButtonLoading(btn, pending, !!cfg.disabled || !!cfg.readOnly);
        renderStatus(root, msgs, snap.state, snap.error, cfg.readOnly);
      },
    });
    function showCurrent() {
      if (!currentEl) return;
      currentEl.hidden = bound === null;
      if (bound !== null) currentEl.textContent = msgs.current.replace('{value}', L.formatValue(bound, decimals) + unitText);
    }
    function setFieldError(text) {
      errHost.textContent = '';
      if (text) {
        var p = el('p', 'text-xs text-error', text);
        p.id = errId;
        p.setAttribute('role', 'alert');
        errHost.appendChild(p);
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', errId);
      } else {
        input.setAttribute('aria-invalid', 'false');
        input.removeAttribute('aria-describedby');
      }
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var checked = L.validateSetpoint(input.value, range);
      if (!checked.ok) {
        setFieldError(checked.reason === 'range'
          ? msgs.outOfRange.replace('{min}', String(range.min)).replace('{max}', String(range.max))
          : msgs.enterNumber);
        return;
      }
      setFieldError(null);
      ctl.set(checked.value);
    });
    input.addEventListener('input', function () { setFieldError(null); });
    showCurrent();
    return {
      ctl: ctl,
      setValue: function (v) {
        var next = L.asNumber(v);
        var changed = next !== bound;
        bound = next;
        // A new bound value replaces the typed text.
        if (changed && bound !== null) input.value = String(bound);
        showCurrent();
        ctl.setValue(bound);
      },
      setReported: function (v) { ctl.setReported(v === undefined ? undefined : (v === null ? null : L.asNumber(v))); },
    };
  }

  // ── ControlButton ─────────────────────────────────────────────────────────
  function bindButton(root, cfg, msgs, commitFn) {
    var main = root.querySelector('[data-kui-control-main]');
    var ask = root.querySelector('[data-kui-control-ask]');
    var go = root.querySelector('[data-kui-control-go]');
    var cancel = root.querySelector('[data-kui-control-cancel]');
    var typedInput = root.querySelector('[data-kui-control-typed]');
    var mode = cfg.confirm || 'none';
    var confirmText = cfg.confirmText || '';
    var ctl = KC.createAsyncControl({
      value: undefined,
      commit: commitFn,
      confirmedMs: 2000,
      onChange: function (snap) {
        var pending = snap.state === 'pending';
        setButtonLoading(main, pending, !!cfg.disabled || !!cfg.readOnly);
        renderStatus(root, msgs, snap.state, snap.error, cfg.readOnly);
      },
    });
    function showAsk(on) {
      if (!ask) return;
      main.hidden = on;
      ask.hidden = !on;
      if (on) {
        syncGo();
        var focusEl = typedInput || go;
        if (focusEl) focusEl.focus();
      } else if (typedInput) {
        typedInput.value = '';
      }
    }
    function syncGo() {
      if (go) go.disabled = mode === 'typed' && (typedInput ? typedInput.value.trim() : '') !== confirmText;
    }
    function fire() {
      var arg;
      if (mode !== 'none') {
        arg = { confirmed: true };
        if (mode === 'typed') arg.typed = typedInput ? typedInput.value : '';
      }
      showAsk(false);
      ctl.set(arg);
    }
    main.addEventListener('click', function () { if (mode === 'none') fire(); else showAsk(true); });
    if (go) go.addEventListener('click', fire);
    if (cancel) cancel.addEventListener('click', function () { showAsk(false); main.focus(); });
    if (typedInput) typedInput.addEventListener('input', syncGo);
    return { ctl: ctl, setValue: function () {}, setReported: function () {} };
  }

  KC.autoInit = function (scope) {
    var rootEl = scope || document;
    var nodes = rootEl.querySelectorAll('[data-kui-control]');
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].__kuiControlMounted) continue;
      nodes[i].__kuiControlMounted = true;
      mount(nodes[i]);
    }
  };
  KC.renderStatus = renderStatus;
})(typeof window !== 'undefined' ? window : globalThis);
