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
  };
})(typeof window !== 'undefined' ? window : globalThis);
