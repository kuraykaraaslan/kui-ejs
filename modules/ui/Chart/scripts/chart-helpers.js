/*
 * modules/ui/Chart/scripts/chart-helpers.js
 *
 * Pure browser helpers shared by every Chart partial. Mirrors the
 * scale math used in /home/kuray/01_NextJS_Components/modules/ui/Chart/charts/_helpers.ts
 * so the two stacks render pixel-identical output.
 *
 * Globals exposed on `window.KuiChart`:
 *   - paletteColor(i, override)
 *   - chartTheme
 *   - niceTicks(lo, hi, count)
 *   - yScale(v, min, max, rect)
 *   - bandCenter(i, n, rect)
 *   - bandWidth(n, rect, padding)
 *   - yExtent(series)
 *   - xCategories(series)
 *   - smoothPath(points)
 *   - linePath(points)
 *   - observeContainer(el, onResize)
 *   - animationDuration(base)
 *   - stackedExtent(series), stackTops(series)          (stacked bar / area)
 *   - buildHeatGrid(cells, maxAxis), heatIntensity(v, min, max)   (heatmap)
 *   - toTime, isTimeSeries, timeExtent, timePoints, inDomain, visibleYExtent,
 *     xTime, invTime, tickStep, timeTicks, formatTick, formatFull,
 *     brushDomain, nearestIndex, MIN_ZOOM_MS, MIN_BRUSH_PX     (time axis + zoom)
 *   - svg(name, attrs), axisX, axisY, grid, crosshair, tooltip (shared primitives)
 *
 * The time-axis and heatmap maths mirror kui-react's charts/_time.ts and
 * charts/_heatmap.ts one to one. Keep them in step.
 */
(function (global) {
  'use strict';
  if (global.KuiChart) return;

  var DEFAULT_PALETTE = [
    'var(--primary)',
    'var(--secondary)',
    'var(--success)',
    'var(--warning)',
    'var(--error)',
    'var(--info)',
    'var(--primary-active)',
    'var(--text-secondary)',
  ];

  var THEME = {
    background: 'transparent',
    axisStroke: 'var(--border)',
    axisText: 'var(--text-secondary)',
    gridStroke: 'var(--border)',
    tooltipBg: 'var(--surface-raised)',
    tooltipBorder: 'var(--border)',
    tooltipText: 'var(--text-primary)',
    tooltipMutedText: 'var(--text-secondary)',
    crosshair: 'var(--border-strong)',
    legendSwatchBorder: 'var(--border)',
    fontSize: { axis: 11, tooltip: 12, legend: 12 },
  };

  function paletteColor(i, override) {
    if (override) return override;
    return DEFAULT_PALETTE[i % DEFAULT_PALETTE.length];
  }

  function niceTicks(lo, hi, count) {
    count = count || 4;
    if (lo === hi) {
      if (lo === 0) return [0, 0.25, 0.5, 0.75, 1];
      var pad = Math.abs(lo) * 0.5 || 1;
      lo -= pad;
      hi += pad;
    }
    var step = (hi - lo) / count;
    var out = [];
    for (var i = 0; i <= count; i++) out.push(lo + step * i);
    return out;
  }

  function yScale(value, min, max, rect) {
    if (max === min) return rect.y + rect.height / 2;
    var t = (value - min) / (max - min);
    return rect.y + rect.height - t * rect.height;
  }

  function bandCenter(i, n, rect) {
    if (n <= 0) return rect.x;
    var step = rect.width / n;
    return rect.x + step * (i + 0.5);
  }

  function bandWidth(n, rect, padding) {
    if (n <= 0) return 0;
    if (padding === undefined) padding = 0.2;
    var step = rect.width / n;
    return step * (1 - padding);
  }

  function yExtent(series) {
    var min = Infinity;
    var max = -Infinity;
    for (var i = 0; i < series.length; i++) {
      var data = series[i].data || [];
      for (var j = 0; j < data.length; j++) {
        var y = data[j].y;
        if (y === null || y === undefined) continue;
        if (y < min) min = y;
        if (y > max) max = y;
      }
    }
    if (!isFinite(min)) min = 0;
    if (!isFinite(max)) max = 1;
    if (min > 0) min = 0;
    if (max < 0) max = 0;
    return { min: min, max: max };
  }

  function xCategories(series) {
    if (!series.length) return [];
    return series[0].data.map(function (p) {
      return String(p.x);
    });
  }

  function smoothPath(points) {
    var d = '';
    var prev = null;
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      if (!p) {
        prev = null;
        continue;
      }
      if (!prev) {
        d += 'M' + p.x + ' ' + p.y + ' ';
      } else {
        var cx = (prev.x + p.x) / 2;
        d += 'C' + cx + ' ' + prev.y + ' ' + cx + ' ' + p.y + ' ' + p.x + ' ' + p.y + ' ';
      }
      prev = p;
    }
    return d.trim();
  }

  function linePath(points) {
    var d = '';
    var has = false;
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      if (!p) {
        has = false;
        continue;
      }
      d += (has ? 'L' : 'M') + p.x + ' ' + p.y + ' ';
      has = true;
    }
    return d.trim();
  }

  function observeContainer(el, onResize) {
    if (!el) return function () {};
    if (typeof ResizeObserver === 'undefined') {
      var rect = el.getBoundingClientRect();
      onResize({ width: Math.floor(rect.width), height: Math.floor(rect.height) });
      return function () {};
    }
    var ro = new ResizeObserver(function (entries) {
      var r = entries[0] && entries[0].contentRect;
      if (!r) return;
      onResize({ width: Math.floor(r.width), height: Math.floor(r.height) });
    });
    ro.observe(el);
    var rect = el.getBoundingClientRect();
    onResize({ width: Math.floor(rect.width), height: Math.floor(rect.height) });
    return function () {
      ro.disconnect();
    };
  }

  function animationDuration(base) {
    var b = typeof base === 'number' ? base : 250;
    if (typeof window === 'undefined') return b;
    var mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    return mq && mq.matches ? 0 : b;
  }

  /** Standard plot padding shared by all cartesian charts (matches NextJS). */
  var PADDING = { top: 12, right: 16, bottom: 28, left: 40 };

  /** Polar (cx, cy, r, angle°) → cartesian. Used by Pie + Donut. */
  function polar(cx, cy, r, deg) {
    var rad = ((deg - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }

  /** Annular wedge SVG path (r0=0 → pie slice). */
  function arcPath(cx, cy, r0, r1, a0, a1) {
    var large = a1 - a0 > 180 ? 1 : 0;
    var p0 = polar(cx, cy, r1, a0);
    var p1 = polar(cx, cy, r1, a1);
    if (r0 <= 0) {
      return 'M' + cx + ' ' + cy + ' L' + p0[0] + ' ' + p0[1]
        + ' A' + r1 + ' ' + r1 + ' 0 ' + large + ' 1 ' + p1[0] + ' ' + p1[1] + ' Z';
    }
    var p2 = polar(cx, cy, r0, a1);
    var p3 = polar(cx, cy, r0, a0);
    return 'M' + p0[0] + ' ' + p0[1]
      + ' A' + r1 + ' ' + r1 + ' 0 ' + large + ' 1 ' + p1[0] + ' ' + p1[1]
      + ' L' + p2[0] + ' ' + p2[1]
      + ' A' + r0 + ' ' + r0 + ' 0 ' + large + ' 0 ' + p3[0] + ' ' + p3[1]
      + ' Z';
  }


  // ── Stacked bars / areas (kui-react charts/_helpers.ts) ─────────────────

  /** y extent of a stack: 0 .. the tallest column sum. Negative values count as 0. */
  function stackedExtent(series) {
    var n = 0;
    series.forEach(function (s) { n = Math.max(n, (s.data || []).length); });
    var max = 0;
    for (var i = 0; i < n; i++) {
      var sum = 0;
      for (var j = 0; j < series.length; j++) {
        var d = (series[j].data || [])[i];
        var y = d ? d.y : undefined;
        if (typeof y === 'number' && y > 0) sum += y;
      }
      if (sum > max) max = sum;
    }
    return { min: 0, max: max || 1 };
  }

  /** tops[si][i] is where series `si` ends at category `i` (null when it has no number there). */
  function stackTops(series) {
    var n = 0;
    series.forEach(function (s) { n = Math.max(n, (s.data || []).length); });
    var running = [];
    for (var k = 0; k < n; k++) running.push(0);
    return series.map(function (s) {
      var row = [];
      for (var i = 0; i < n; i++) {
        var d = (s.data || [])[i];
        var y = d ? d.y : undefined;
        if (typeof y !== 'number') { row.push(null); continue; }
        running[i] += Math.max(0, y);
        row.push(running[i]);
      }
      return row;
    });
  }

  // ── Heatmap grid (kui-react charts/_heatmap.ts) ─────────────────────────

  var MAX_AXIS = 200;

  /**
   * Cells (long format {x, y, value}) -> a dense grid. Axis order is first
   * appearance, except an all-numeric axis is sorted numerically. A repeated
   * (x, y) keeps the LAST value; a non-finite value is an empty cell (null).
   */
  function buildHeatGrid(cells, maxAxis) {
    cells = cells || [];
    var cap = maxAxis || MAX_AXIS;
    function order(get) {
      var seen = {};
      var keys = [];
      cells.forEach(function (c) {
        var key = String(get(c));
        if (!Object.prototype.hasOwnProperty.call(seen, key)) { seen[key] = true; keys.push(key); }
      });
      var numeric = keys.length > 0 && keys.every(function (k) { return k.trim() !== '' && isFinite(Number(k)); });
      if (numeric) keys.sort(function (a, b) { return Number(a) - Number(b); });
      return keys.slice(0, cap);
    }
    var xs = order(function (c) { return c.x; });
    var ys = order(function (c) { return c.y; });
    var xi = {}; xs.forEach(function (k, i) { xi[k] = i; });
    var yi = {}; ys.forEach(function (k, i) { yi[k] = i; });
    var values = ys.map(function () { return xs.map(function () { return null; }); });
    cells.forEach(function (c) {
      var i = xi[String(c.x)];
      var j = yi[String(c.y)];
      if (i === undefined || j === undefined) return;
      values[j][i] = typeof c.value === 'number' && isFinite(c.value) ? c.value : null;
    });
    var min = Infinity;
    var max = -Infinity;
    values.forEach(function (row) {
      row.forEach(function (v) {
        if (v === null) return;
        if (v < min) min = v;
        if (v > max) max = v;
      });
    });
    if (!isFinite(min)) { min = 0; max = 1; }
    return { xs: xs, ys: ys, values: values, min: min, max: max };
  }

  /** 0..1 position of v in [min, max]; a flat range maps to 1. */
  function heatIntensity(v, min, max) {
    if (max <= min) return 1;
    return Math.min(1, Math.max(0, (v - min) / (max - min)));
  }

  // ── Time axis (kui-react charts/_time.ts) ───────────────────────────────

  /** A series x as epoch ms: a number is taken as ms, a string must parse as a date; else null. */
  function toTime(x) {
    if (typeof x === 'number') return isFinite(x) ? x : null;
    if (typeof x !== 'string') return null;
    // A date-only string is a calendar DAY in local time, not UTC midnight.
    var day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(x);
    if (day) return new Date(Number(day[1]), Number(day[2]) - 1, Number(day[3])).getTime();
    var t = Date.parse(x);
    return isNaN(t) ? null : t;
  }

  /** True when EVERY point of EVERY series has a time-like x (and there is at least one point). */
  function isTimeSeries(series) {
    var any = false;
    for (var i = 0; i < series.length; i++) {
      var data = series[i].data || [];
      for (var j = 0; j < data.length; j++) {
        if (toTime(data[j].x) === null) return false;
        any = true;
      }
    }
    return any;
  }

  /** Full time extent. A single instant is widened by 30 minutes each side. */
  function timeExtent(series) {
    var lo = Infinity;
    var hi = -Infinity;
    series.forEach(function (s) {
      (s.data || []).forEach(function (p) {
        var t = toTime(p.x);
        if (t === null) return;
        if (t < lo) lo = t;
        if (t > hi) hi = t;
      });
    });
    if (!isFinite(lo)) return [0, 1];
    if (lo === hi) return [lo - 30 * 60000, hi + 30 * 60000];
    return [lo, hi];
  }

  /** Per series: [{ t, y, label }] sorted by time; points without a parsable x are dropped. */
  function timePoints(series) {
    return series.map(function (s) {
      var out = [];
      (s.data || []).forEach(function (p) {
        var t = toTime(p.x);
        if (t !== null) out.push({ t: t, y: p.y, label: p.label });
      });
      return out.sort(function (a, b) { return a.t - b.t; });
    });
  }

  function inDomain(points, domain) {
    return points.filter(function (p) { return p.t >= domain[0] && p.t <= domain[1]; });
  }

  /** y extent over the visible points; always includes zero. */
  function visibleYExtent(all, domain) {
    var min = Infinity;
    var max = -Infinity;
    all.forEach(function (pts) {
      inDomain(pts, domain).forEach(function (p) {
        if (p.y === null || p.y === undefined) return;
        if (p.y < min) min = p.y;
        if (p.y > max) max = p.y;
      });
    });
    if (!isFinite(min)) min = 0;
    if (!isFinite(max)) max = 1;
    if (min > 0) min = 0;
    if (max < 0) max = 0;
    return { min: min, max: max };
  }

  function xTime(t, domain, rect) {
    if (domain[1] === domain[0]) return rect.x + rect.width / 2;
    return rect.x + ((t - domain[0]) / (domain[1] - domain[0])) * rect.width;
  }

  function invTime(px, domain, rect) {
    if (rect.width <= 0) return domain[0];
    return domain[0] + ((px - rect.x) / rect.width) * (domain[1] - domain[0]);
  }

  var SECOND = 1000;
  var MINUTE = 60 * SECOND;
  var HOUR = 60 * MINUTE;
  var DAY = 24 * HOUR;
  var STEPS = [
    SECOND, 5 * SECOND, 15 * SECOND, 30 * SECOND,
    MINUTE, 5 * MINUTE, 15 * MINUTE, 30 * MINUTE,
    HOUR, 3 * HOUR, 6 * HOUR, 12 * HOUR,
    DAY, 2 * DAY, 7 * DAY, 14 * DAY, 30 * DAY, 91 * DAY, 182 * DAY, 365 * DAY,
  ];

  /** Tick step (ms) for a span, giving at most about `target` ticks. */
  function tickStep(span, target) {
    var want = Math.max(1, target);
    for (var i = 0; i < STEPS.length; i++) if (span / STEPS[i] <= want) return STEPS[i];
    return STEPS[STEPS.length - 1];
  }

  /** Ticks aligned to the step in LOCAL time (day ticks land on midnight). */
  function timeTicks(domain, target) {
    var lo = domain[0];
    var hi = domain[1];
    if (!(hi > lo)) return [lo];
    var step = tickStep(hi - lo, target === undefined ? 6 : target);
    var off = new Date(lo).getTimezoneOffset() * MINUTE;
    var out = [];
    for (var t = Math.ceil((lo - off) / step) * step + off; t <= hi; t += step) out.push(t);
    return out.length ? out : [lo, hi];
  }

  function formatTick(ms, span, locale) {
    var d = new Date(ms);
    if (span <= 10 * MINUTE) return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (span <= 2 * DAY) return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    if (span <= 7 * DAY) return d.toLocaleString(locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    if (span <= 400 * DAY) return d.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
    return d.toLocaleDateString(locale, { year: '2-digit', month: 'short' });
  }

  function formatFull(ms, span, locale) {
    var d = new Date(ms);
    return span > 2 * DAY
      ? d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })
      : d.toLocaleString(locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  var MIN_ZOOM_MS = 1000;
  var MIN_BRUSH_PX = 8;

  /** The domain a brush from px0 to px1 selects, clamped to `full`; null when too small. */
  function brushDomain(px0, px1, domain, full, rect) {
    if (Math.abs(px1 - px0) < MIN_BRUSH_PX) return null;
    var a = invTime(Math.min(px0, px1), domain, rect);
    var b = invTime(Math.max(px0, px1), domain, rect);
    var lo = Math.max(full[0], a);
    var hi = Math.min(full[1], b);
    return hi - lo < MIN_ZOOM_MS ? null : [lo, hi];
  }

  /** Index of the time in the sorted `times` nearest to t (ties go to the earlier one). */
  function nearestIndex(times, t) {
    if (!times.length) return -1;
    var lo = 0;
    var hi = times.length - 1;
    while (lo < hi) {
      var mid = (lo + hi) >> 1;
      if (times[mid] < t) lo = mid + 1;
      else hi = mid;
    }
    if (lo > 0 && Math.abs(times[lo - 1] - t) <= Math.abs(times[lo] - t)) return lo - 1;
    return lo;
  }

  // ── Shared SVG / HTML primitives (kui-react primitives/*) ───────────────

  var SVG_NS = 'http://www.w3.org/2000/svg';

  function svg(name, attrs) {
    var el = document.createElementNS(SVG_NS, name);
    for (var k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) el.setAttribute(k, attrs[k]);
    return el;
  }

  /** <XAxis>: axis line, a 4px tick mark and a label per tick. ticks = [{ position, label }]. */
  function axisX(ticks, y, xStart, xEnd) {
    var g = svg('g', { 'aria-hidden': 'true' });
    g.appendChild(svg('line', { x1: xStart, x2: xEnd, y1: y, y2: y, stroke: THEME.axisStroke, 'stroke-width': 1 }));
    ticks.forEach(function (t) {
      g.appendChild(svg('line', { x1: t.position, x2: t.position, y1: y, y2: y + 4, stroke: THEME.axisStroke, 'stroke-width': 1 }));
      var text = svg('text', { x: t.position, y: y + 16, 'text-anchor': 'middle', 'font-size': THEME.fontSize.axis, fill: THEME.axisText });
      text.textContent = t.label;
      g.appendChild(text);
    });
    return g;
  }

  /** <YAxis> */
  function axisY(ticks, x, yStart, yEnd) {
    var g = svg('g', { 'aria-hidden': 'true' });
    g.appendChild(svg('line', { x1: x, x2: x, y1: yStart, y2: yEnd, stroke: THEME.axisStroke, 'stroke-width': 1 }));
    ticks.forEach(function (t) {
      g.appendChild(svg('line', { x1: x - 4, x2: x, y1: t.position, y2: t.position, stroke: THEME.axisStroke, 'stroke-width': 1 }));
      var text = svg('text', { x: x - 8, y: t.position + 4, 'text-anchor': 'end', 'font-size': THEME.fontSize.axis, fill: THEME.axisText });
      text.textContent = t.label;
      g.appendChild(text);
    });
    return g;
  }

  /** <Grid>: dashed horizontal (and optional vertical) lines at 50% opacity. */
  function grid(rect, yTicks, xTicks) {
    var g = svg('g', { 'aria-hidden': 'true', opacity: 0.5 });
    yTicks.forEach(function (y) {
      g.appendChild(svg('line', { x1: rect.x, x2: rect.x + rect.width, y1: y, y2: y, stroke: THEME.gridStroke, 'stroke-dasharray': '2 4', 'stroke-width': 1 }));
    });
    (xTicks || []).forEach(function (x) {
      g.appendChild(svg('line', { x1: x, x2: x, y1: rect.y, y2: rect.y + rect.height, stroke: THEME.gridStroke, 'stroke-dasharray': '2 4', 'stroke-width': 1 }));
    });
    return g;
  }

  /** <Crosshair>: a dashed vertical guide. */
  function crosshair(rect, x) {
    var g = svg('g', { 'aria-hidden': 'true' });
    g.appendChild(svg('line', { x1: x, x2: x, y1: rect.y, y2: rect.y + rect.height, stroke: THEME.crosshair, 'stroke-width': 1, 'stroke-dasharray': '3 3' }));
    return g;
  }

  /**
   * <ChartTooltip>: an HTML overlay inside the (relatively positioned) canvas.
   * Returns { update(label, data, x, y, containerWidth), hide(), el }.
   * data rows: { seriesId, seriesName, color, y, valueLabel? }.
   */
  function tooltip(container) {
    var el = document.createElement('div');
    el.setAttribute('role', 'tooltip');
    el.className = 'pointer-events-none absolute z-10 min-w-[140px] rounded-md border px-3 py-2 shadow-md';
    el.style.backgroundColor = THEME.tooltipBg;
    el.style.borderColor = THEME.tooltipBorder;
    el.style.color = THEME.tooltipText;
    el.style.fontSize = THEME.fontSize.tooltip + 'px';
    el.hidden = true;
    container.appendChild(el);
    return {
      el: el,
      hide: function () { el.hidden = true; },
      update: function (label, data, x, y, containerWidth) {
        if (!data.length) { el.hidden = true; return; }
        var flip = x > containerWidth - 160;
        el.style.left = (flip ? x - 12 : x + 12) + 'px';
        el.style.top = y + 'px';
        el.style.transform = flip ? 'translate(-100%, -50%)' : 'translate(0, -50%)';
        el.textContent = '';
        var head = document.createElement('div');
        head.className = 'mb-1 text-xs font-semibold';
        head.textContent = label;
        el.appendChild(head);
        var ul = document.createElement('ul');
        ul.className = 'space-y-0.5';
        data.forEach(function (d) {
          var li = document.createElement('li');
          li.className = 'flex items-center gap-2';
          var sw = document.createElement('span');
          sw.setAttribute('aria-hidden', 'true');
          sw.className = 'inline-block size-2 rounded-sm';
          sw.style.backgroundColor = d.color;
          var name = document.createElement('span');
          name.style.color = THEME.tooltipMutedText;
          name.textContent = d.seriesName;
          var val = document.createElement('span');
          val.className = 'ml-auto font-medium tabular-nums';
          val.textContent = d.valueLabel !== undefined && d.valueLabel !== null ? d.valueLabel : (d.y === null || d.y === undefined ? '—' : String(d.y));
          li.appendChild(sw); li.appendChild(name); li.appendChild(val);
          ul.appendChild(li);
        });
        el.appendChild(ul);
        el.hidden = false;
      },
    };
  }

  /** Resolve a global function by name (config can only carry JSON), else null. */
  function resolveFn(name) {
    if (typeof name !== 'string' || !name) return null;
    var fn = global[name];
    return typeof fn === 'function' ? fn : null;
  }

  /** Renderers register here: KuiChart.renderers.time / .heatmap = function (host, cfg). */
  var renderers = {};

  /** Mount every not-yet-mounted [data-kui-chart-config] under `root` (default: document). */
  function autoInit(root) {
    var scope = root || (typeof document !== 'undefined' ? document : null);
    if (!scope) return;
    var hosts = scope.querySelectorAll('[data-kui-chart-config]');
    for (var i = 0; i < hosts.length; i++) {
      var host = hosts[i];
      if (host.__kuiChartMounted) continue;
      var kind = host.getAttribute('data-kui-chart-kind');
      var render = renderers[kind];
      if (!render) continue;
      var cfg;
      try { cfg = JSON.parse(host.getAttribute('data-kui-chart-config')); } catch (e) { continue; }
      host.__kuiChartMounted = true;
      render(host, cfg);
    }
  }

  global.KuiChart = {
    palette: DEFAULT_PALETTE,
    theme: THEME,
    padding: PADDING,
    paletteColor: paletteColor,
    niceTicks: niceTicks,
    yScale: yScale,
    bandCenter: bandCenter,
    bandWidth: bandWidth,
    yExtent: yExtent,
    xCategories: xCategories,
    smoothPath: smoothPath,
    linePath: linePath,
    observeContainer: observeContainer,
    animationDuration: animationDuration,
    polar: polar,
    arcPath: arcPath,
    stackedExtent: stackedExtent,
    stackTops: stackTops,
    buildHeatGrid: buildHeatGrid,
    heatIntensity: heatIntensity,
    toTime: toTime,
    isTimeSeries: isTimeSeries,
    timeExtent: timeExtent,
    timePoints: timePoints,
    inDomain: inDomain,
    visibleYExtent: visibleYExtent,
    xTime: xTime,
    invTime: invTime,
    tickStep: tickStep,
    timeTicks: timeTicks,
    formatTick: formatTick,
    formatFull: formatFull,
    brushDomain: brushDomain,
    nearestIndex: nearestIndex,
    MIN_ZOOM_MS: MIN_ZOOM_MS,
    MIN_BRUSH_PX: MIN_BRUSH_PX,
    svg: svg,
    axisX: axisX,
    axisY: axisY,
    grid: grid,
    crosshair: crosshair,
    tooltip: tooltip,
    resolveFn: resolveFn,
    renderers: renderers,
    autoInit: autoInit,
  };
})(typeof window !== 'undefined' ? window : globalThis);
