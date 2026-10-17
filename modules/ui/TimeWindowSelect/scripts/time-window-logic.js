/*
 * modules/ui/TimeWindowSelect/scripts/time-window-logic.js
 *
 * Pure helpers and the DOM-free draft state of TimeWindowSelect. Mirrors kui-react
 * modules/ui/TimeWindowSelect.tsx one to one (toZonedInput, fromZonedInput, windowSpanMs,
 * summarize, and the component's state + handlers as createTimeWindowDraft).
 * The server-side twin (used while rendering) is TimeWindowSelect/_logic.ejs — keep the
 * two in step (tests/time-window-select.test.ts compares them).
 *
 * Exposed as window.KuiTimeWindowLogic (and module.exports under Node).
 */
(function (global) {
  'use strict';

  var DURATION = /^([1-9]\d{0,5})([mhd])$/;
  var UNIT_MS = { m: 60000, h: 3600000, d: 86400000 };
  var PERIOD_UNIT_MS = {
    hour: 3600000, day: 86400000, week: 7 * 86400000, isoWeek: 7 * 86400000, month: 30 * 86400000,
    quarter: 91 * 86400000, halfYear: 182 * 86400000, year: 365 * 86400000,
  };

  // ── zoned wall-clock helpers: a `datetime-local` value is a wall time in the window's zone ──

  function wallParts(t, timeZone) {
    var opts = { hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    if (timeZone) opts.timeZone = timeZone;
    var p = {};
    new Intl.DateTimeFormat('en-CA', opts).formatToParts(new Date(t)).forEach(function (part) { p[part.type] = part.value; });
    return p;
  }

  /** An instant as `YYYY-MM-DDTHH:mm` in a zone (the browser's when none), for a `datetime-local` input. */
  function toZonedInput(iso, timeZone) {
    var p = wallParts(Date.parse(iso), timeZone);
    return p.year + '-' + p.month + '-' + p.day + 'T' + p.hour + ':' + p.minute;
  }

  /** A `datetime-local` value read as a wall time in a zone (the browser's when none), as an ISO instant. */
  function fromZonedInput(v, timeZone) {
    var dt = v.split('T');
    var d = dt[0].split('-').map(Number);
    var hm = (dt[1] != null ? dt[1] : '00:00').split(':').map(Number);
    var guess = Date.UTC(d[0], d[1] - 1, d[2], hm[0], hm[1]);
    function offset(t) {
      var p = wallParts(t, timeZone);
      return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - Math.floor(t / 1000) * 1000;
    }
    var first = guess - offset(guess);
    return new Date(guess - offset(first)).toISOString();
  }

  /** The span a window covers, in ms (a calendar period approximately), or null when it cannot be told. */
  function windowSpanMs(w) {
    if (w.mode === 'relative') {
      var m = DURATION.exec(w.last);
      return m ? Number(m[1]) * UNIT_MS[m[2]] : null;
    }
    if (w.mode === 'absolute') {
      var s = Date.parse(w.to) - Date.parse(w.from);
      return isFinite(s) && s > 0 ? s : null;
    }
    if (w.period === 'dayBeforeYesterday' || w.period === 'thisDayLastWeek') return 86400000;
    var unit = PERIOD_UNIT_MS[String(w.period).split('.')[1]];
    return unit != null ? unit : null;
  }

  function intervalMs(i) {
    var m = /^([1-9]\d*)([mhd])$/.exec(i);
    return m ? Number(m[1]) * UNIT_MS[m[2]] : null;
  }

  function isCurrent(p) { return String(p).indexOf('current.') === 0; }

  /** Realtime for a sliding or a current-period window (and for none), History otherwise. */
  function tabOf(w) {
    return !w || w.mode === 'relative' || (w.mode === 'calendar' && isCurrent(w.period)) ? 'realtime' : 'history';
  }

  /** The trigger's text: which tab, then the window, interval, aggregation and zone when set. */
  function summarize(w, m) {
    if (!w) return m.label;
    var tab = tabOf(w) === 'realtime' ? m.realtime : m.history;
    var periods = m.periods || {};
    var what = w.mode === 'relative'
      ? m.last + ' ' + w.last
      : w.mode === 'calendar'
        ? (periods[w.period] != null ? periods[w.period] : w.period) + (w.soFar ? ' (' + m.soFar.toLowerCase() + ')' : '')
        : toZonedInput(w.from, w.timezone).replace('T', ' ') + ' – ' + toZonedInput(w.to, w.timezone).replace('T', ' ');
    var parts = [tab, what];
    var iv = w.interval && w.interval !== 'auto' ? w.interval : null;
    if (w.aggregation || iv) parts.push([w.aggregation, iv].filter(Boolean).join(' '));
    if (w.timezone) parts.push(w.timezone);
    return parts.join(' · ');
  }

  /** A copy without the keys whose value is undefined (what a JSON round trip would give). */
  function clean(o) {
    var out = {};
    Object.keys(o).forEach(function (k) { if (o[k] !== undefined) out[k] = o[k]; });
    return out;
  }
  function assign() {
    var out = {};
    for (var i = 0; i < arguments.length; i++) {
      var src = arguments[i] || {};
      Object.keys(src).forEach(function (k) { out[k] = src[k]; });
    }
    return out;
  }

  /**
   * The component's state and handlers without a DOM. `opts`:
   *   value, presets, calendarPeriods, now (() => ms),
   *   tabs (['realtime', 'history'] by default; which kinds of window may be picked)
   * Every handler mutates the state; `view()` returns what to paint; `apply()` returns the
   * value Update stores (or null when it cannot be applied).
   */
  function createTimeWindowDraft(opts) {
    var presets = opts.presets || [];
    var calendarPeriods = opts.calendarPeriods || [];
    var now = opts.now || function () { return Date.now(); };
    var fallback = { mode: 'relative', last: presets.indexOf('24h') !== -1 ? '24h' : presets[0] };
    var currentPeriods = calendarPeriods.filter(isCurrent);
    var pastPeriods = calendarPeriods.filter(function (p) { return !isCurrent(p); });
    var allowed = Array.isArray(opts.tabs) && opts.tabs.length > 0 ? opts.tabs : ['realtime', 'history'];
    function startTab(v) { return allowed.indexOf(tabOf(v)) !== -1 ? tabOf(v) : allowed[0]; }

    var s = {
      value: opts.value || null,
      draft: opts.value || fallback,
      tab: startTab(opts.value || null),
      rtKind: 'last',
      hKind: 'range',
      amount: '1',
      unit: 'h',
    };

    function extras() { return { interval: s.draft.interval, aggregation: s.draft.aggregation, timezone: s.draft.timezone }; }
    function put(next) { s.draft = clean(assign(next, extras())); }
    function durationValid() { return DURATION.test(s.amount + s.unit); }
    function lastDay() {
      var to = new Date(now()); to.setSeconds(0, 0);
      return { mode: 'absolute', from: new Date(to.getTime() - 86400000).toISOString(), to: to.toISOString() };
    }
    function isDraftCurrent() { return s.draft.mode === 'calendar' && isCurrent(s.draft.period); }
    function isDraftPast() { return s.draft.mode === 'calendar' && !isCurrent(s.draft.period); }
    function historyLast() { return s.tab === 'history' && s.hKind === 'last'; }
    function canApply() {
      return historyLast()
        ? durationValid()
        : !(s.draft.mode === 'absolute' && !(Date.parse(s.draft.to) > Date.parse(s.draft.from)));
    }

    var api = {
      state: s,
      tabs: allowed,
      currentPeriods: currentPeriods,
      pastPeriods: pastPeriods,
      /** Opening the panel: the draft starts again from the applied value. */
      begin: function () {
        var v = s.value || fallback;
        s.draft = v;
        s.tab = startTab(v);
        // A window of a kind this board does not offer opens on the kind it does, starting from a default of that kind.
        if (allowed.indexOf(tabOf(v)) === -1) s.draft = assign(v, allowed[0] === 'realtime' ? fallback : lastDay());
        s.rtKind = v.mode === 'calendar' && isCurrent(v.period) ? 'current' : 'last';
        s.hKind = v.mode === 'calendar' ? 'period' : 'range';
        var d = v.mode === 'relative' ? DURATION.exec(v.last) : null;
        s.amount = d ? d[1] : '1';
        s.unit = d ? d[2] : 'h';
      },
      setValue: function (v) { s.value = v || null; },
      switchTab: function (next) {
        s.tab = next;
        if (next === 'realtime' && tabOf(s.draft) !== 'realtime') put({ mode: 'relative', last: fallback.last });
        if (next === 'history' && tabOf(s.draft) !== 'history') {
          put(lastDay());
          s.hKind = 'range';
        }
      },
      otherTab: function (t) { api.switchTab(t === 'realtime' ? 'history' : 'realtime'); },
      // Realtime
      selectRealtimeLast: function () {
        s.rtKind = 'last';
        if (durationValid()) put({ mode: 'relative', last: s.amount + s.unit });
      },
      selectPreset: function (p) {
        s.rtKind = 'last';
        var d = DURATION.exec(p);
        if (d) { s.amount = d[1]; s.unit = d[2]; }
        put({ mode: 'relative', last: p });
      },
      setRealtimeDuration: function (a, u) {
        s.amount = a; s.unit = u; s.rtKind = 'last';
        if (DURATION.test(a + u)) put({ mode: 'relative', last: a + u });
      },
      selectCurrent: function () {
        s.rtKind = 'current';
        if (!isDraftCurrent()) put({ mode: 'calendar', period: currentPeriods[0] });
      },
      setCurrentPeriod: function (p) {
        put(assign({ mode: 'calendar', period: p }, s.draft.mode === 'calendar' && s.draft.soFar ? { soFar: true } : {}));
      },
      setSoFar: function (on) {
        if (s.draft.mode === 'calendar') put(assign({ mode: 'calendar', period: s.draft.period }, on ? { soFar: true } : {}));
      },
      // History
      selectHistoryLast: function () { s.hKind = 'last'; },
      setHistoryDuration: function (a, u) { s.amount = a; s.unit = u; },
      selectRange: function () {
        s.hKind = 'range';
        if (s.draft.mode !== 'absolute') put(lastDay());
      },
      setFrom: function (v) { if (v) s.draft = assign(s.draft, { from: fromZonedInput(v, s.draft.timezone) }); },
      setTo: function (v) { if (v) s.draft = assign(s.draft, { to: fromZonedInput(v, s.draft.timezone) }); },
      selectPast: function () {
        s.hKind = 'period';
        if (!isDraftPast()) put({ mode: 'calendar', period: pastPeriods[0] });
      },
      setPastPeriod: function (p) { put({ mode: 'calendar', period: p }); },
      // Both
      setAggregation: function (a) { s.draft = assign(s.draft, { aggregation: a }); },
      setInterval: function (i) { s.draft = assign(s.draft, { interval: i }); },
      setTimezone: function (z) {
        var rest = assign(s.draft);
        delete rest.timezone;
        s.draft = z ? assign(rest, { timezone: z }) : rest;
      },
      canApply: canApply,
      /** What Update stores: a History "last N" is anchored to the moment it is applied (the clock is read only here). */
      apply: function () {
        if (!canApply()) return null;
        var next;
        if (historyLast()) {
          var to = now();
          next = clean(assign(extras(), { mode: 'absolute', from: new Date(to - Number(s.amount) * UNIT_MS[s.unit]).toISOString(), to: new Date(to).toISOString() }));
        } else {
          next = clean(s.draft);
        }
        s.value = next;
        return next;
      },
      /** Everything the panel shows, derived from the state. */
      view: function () {
        var d = s.draft;
        var hl = historyLast();
        var valid = durationValid();
        var span = hl ? (valid ? Number(s.amount) * UNIT_MS[s.unit] : null) : windowSpanMs(d);
        var step = d.interval && d.interval !== 'auto' ? intervalMs(d.interval) : null;
        return {
          tab: s.tab,
          rtKind: s.rtKind,
          hKind: s.hKind,
          amount: s.amount,
          unit: s.unit,
          activePreset: s.rtKind === 'last' && d.mode === 'relative' ? d.last : null,
          currentPeriod: isDraftCurrent() ? d.period : currentPeriods[0],
          soFar: d.mode === 'calendar' && d.soFar === true,
          pastPeriod: isDraftPast() ? d.period : pastPeriods[0],
          showRange: d.mode === 'absolute' && s.hKind === 'range',
          from: d.mode === 'absolute' ? toZonedInput(d.from, d.timezone) : '',
          to: d.mode === 'absolute' ? toZonedInput(d.to, d.timezone) : '',
          aggregation: d.aggregation != null ? d.aggregation : 'avg',
          interval: d.interval != null ? d.interval : 'auto',
          timezone: d.timezone != null ? d.timezone : '',
          bucketCount: span && step ? Math.ceil(span / step) : null,
          canApply: canApply(),
        };
      },
    };
    return api;
  }

  var api = {
    DURATION: DURATION,
    UNIT_MS: UNIT_MS,
    toZonedInput: toZonedInput,
    fromZonedInput: fromZonedInput,
    windowSpanMs: windowSpanMs,
    intervalMs: intervalMs,
    isCurrent: isCurrent,
    tabOf: tabOf,
    summarize: summarize,
    createTimeWindowDraft: createTimeWindowDraft,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  global.KuiTimeWindowLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
