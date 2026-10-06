/*
 * modules/ui/ControlTile/scripts/control-logic.js
 *
 * Pure helpers shared by the async controls. No DOM, no transport.
 * Mirrors kui-react modules/ui/ControlTile/control-logic.ts one to one.
 * The server-side twin (used while rendering) is ControlTile/_logic.ejs —
 * keep the two in step (tests/control-tile.test.ts compares them).
 *
 * Exposed as window.KuiControlLogic (and module.exports under Node).
 */
(function (global) {
  'use strict';

  /** A scalar as a boolean: true/false, 1/0, "on"/"off", "true"/"false"/"yes"/"no"; anything else is unknown (null). */
  function asBoolean(value) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 0 ? false : value === 1 ? true : null;
    if (typeof value === 'string') {
      var v = value.trim().toLowerCase();
      if (['true', 'on', '1', 'yes'].indexOf(v) !== -1) return true;
      if (['false', 'off', '0', 'no'].indexOf(v) !== -1) return false;
    }
    return null;
  }

  /** A scalar as a finite number, or null. Blank strings are not numbers. */
  function asNumber(value) {
    if (typeof value === 'number') return isFinite(value) ? value : null;
    if (typeof value === 'string' && value.trim() !== '') {
      var n = Number(value);
      return isFinite(n) ? n : null;
    }
    return null;
  }

  /** Loose bounds -> a usable range (min < max, positive step). Defaults 0..100 step 1. */
  function toRange(bounds) {
    var min = asNumber(bounds.min);
    if (min === null) min = 0;
    var maxRaw = asNumber(bounds.max);
    if (maxRaw === null) maxRaw = 100;
    var step = asNumber(bounds.step);
    return { min: min, max: maxRaw > min ? maxRaw : min + 1, step: step && step > 0 ? step : 1 };
  }

  /** Validate a typed set-point so a bad entry becomes a field error, never a write. */
  function validateSetpoint(raw, range) {
    if (String(raw).trim() === '') return { ok: false, reason: 'empty' };
    var n = Number(raw);
    if (!isFinite(n)) return { ok: false, reason: 'nan' };
    if (n < range.min || n > range.max) return { ok: false, reason: 'range' };
    return { ok: true, value: n };
  }

  /** Round to the step grid anchored at `min`, so a slider never sends 20.000000004. */
  function snapToStep(value, range) {
    var snapped = range.min + Math.round((value - range.min) / range.step) * range.step;
    var decimals = (String(range.step).split('.')[1] || '').length;
    return Number(Math.min(range.max, Math.max(range.min, snapped)).toFixed(decimals));
  }

  /** Fixed-decimals number text (no grouping), for the value line. */
  function formatValue(value, decimals) {
    return value.toFixed(Math.max(0, decimals || 0));
  }

  var api = {
    asBoolean: asBoolean, asNumber: asNumber, toRange: toRange,
    validateSetpoint: validateSetpoint, snapToStep: snapToStep, formatValue: formatValue,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  global.KuiControlLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
