/*
 * modules/ui/Chart/scripts/pie.js
 *
 * Renderer behind `type: 'pie' | 'donut'` (donut = innerRadius > 0). Mirrors
 * kui-react's charts/PieChart.tsx one to one: slice labels (percent / value /
 * name / name and percent) inside the slice or outside with a leader line, the
 * start angle, an even gap between slices, the donut centre (total + caption,
 * or off), legend position, layout (wrapping line or grid) and a value or
 * share after each name, legend toggling of slices, and what the tooltip prints.
 *
 * Mounted by KuiChart.autoInit() from `data-kui-chart-kind="pie"`. Requires
 * chart-helpers.js. `valueFormat` is the NAME of a global function.
 */
(function (global) {
  'use strict';
  var K = global.KuiChart;
  if (!K || K.renderers.pie) return;

  var num = function (v, d) { return typeof v === 'number' && isFinite(v) ? v : d; };

  function render(host, cfg) {
    var canvas = host.querySelector('[data-kui-chart-canvas]');
    if (!canvas) return;
    var baseHeight = num(cfg.height, 240);
    var fill = !!cfg.fill;
    var showLegend = cfg.showLegend !== false;
    var showTooltip = cfg.showTooltip !== false;
    var innerRadius = num(cfg.innerRadius, 0);
    var labels = cfg.labels || 'none';
    var outsideLabels = cfg.labelPosition === 'outside';
    var labelStyle = cfg.labelStyle || {};
    var minLabelShare = num(cfg.minLabelShare, 0.04);
    var valueFormat = K.resolveFn(cfg.valueFormat);
    var fmt = valueFormat || K.defaultNumber;
    var showCenter = cfg.showCenter !== false;
    var centerLabel = cfg.centerLabel;
    var legendValue = cfg.legendValue || 'none';
    var legendPosition = cfg.legendPosition || 'bottom';
    var tooltipValue = cfg.tooltipValue || 'both';
    var startAngle = num(cfg.startAngle, 0);
    var sliceGap = num(cfg.sliceGap, 0);
    var animate = cfg.animate !== false;
    var tipOn = showTooltip && cfg.tooltipMode !== 'none';
    var animMs = K.animationDuration();

    var first = (cfg.series || [])[0];
    var all = [];
    if (first) {
      (first.data || []).filter(function (p) { return p.y !== null && p.y !== undefined && p.y >= 0; }).forEach(function (p, i) {
        all.push({ id: first.id + '-' + i, name: String(p.label !== undefined && p.label !== null ? p.label : p.x), value: p.y, color: K.paletteColor(i, p.color) });
      });
    }
    var hidden = {};
    (cfg.hiddenSlices || []).forEach(function (n) { hidden[n] = true; });
    var toggleable = typeof cfg.legendToggle === 'boolean' ? cfg.legendToggle : (cfg.hiddenSlices || []).length > 0;
    var allTotal = all.reduce(function (a, s) { return a + s.value; }, 0) || 1;
    var pctText = function (v, t) { return Math.round((v / t) * 100) + '%'; };

    var hover = null;
    var size = { width: 0, height: 0 };
    var played = false;
    var geo = null;
    var centre = null;
    var caption = null;

    var svgEl = K.svg('svg', { role: 'img', 'aria-label': cfg.ariaLabel || 'Pie chart' });
    svgEl.style.display = 'block';
    svgEl.style.overflow = 'visible';
    canvas.insertBefore(svgEl, canvas.firstChild);
    var tip = K.tooltip(canvas);

    function slices() { return all.filter(function (s) { return !hidden[s.name]; }); }
    function totalOf(list) { return list.reduce(function (a, s) { return a + s.value; }, 0) || 1; }

    function drawLegend() {
      if (!showLegend || !all.length) { K.mountLegend(host, null); return; }
      var total = totalOf(slices());
      var hiddenIds = {};
      var values;
      all.forEach(function (s) { if (hidden[s.name]) hiddenIds[s.id] = true; });
      if (legendValue !== 'none') {
        values = {};
        all.forEach(function (s) { values[s.id] = legendValue === 'percent' ? pctText(s.value, hidden[s.name] ? allTotal : total) : fmt(s.value); });
      }
      K.mountLegend(host, K.legend({
        series: all.map(function (s) { return { id: s.id, name: s.name, color: s.color }; }),
        position: legendPosition, style: cfg.legendStyle, layout: cfg.legendLayout, hidden: hiddenIds, values: values,
        onToggle: toggleable ? function (id) {
          var hit = all.filter(function (s) { return s.id === id; })[0];
          if (!hit) return;
          if (hidden[hit.name]) delete hidden[hit.name]; else hidden[hit.name] = true;
          hover = null;
          drawLegend();
          draw();
        } : undefined,
      }), legendPosition);
    }

    function labelOf(w, total) {
      if (labels === 'percent') return pctText(w.value, total);
      if (labels === 'value') return fmt(w.value);
      if (labels === 'name') return w.name;
      return w.name + ' ' + pctText(w.value, total);
    }

    function draw() {
      var width = size.width;
      if (width <= 0) return;
      var height = fill ? (size.height > 0 ? size.height : baseHeight) : baseHeight;
      while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);
      svgEl.setAttribute('width', width);
      svgEl.setAttribute('height', height);

      var list = slices();
      var total = totalOf(list);
      var outside = labels !== 'none' && outsideLabels;
      var longest = 0;
      if (outside) list.forEach(function (s) { longest = Math.max(longest, labelOf(s, total).length); });
      var textRoom = outside ? longest * 6.4 + 22 : 0;
      var cx = width / 2;
      var cy = height / 2;
      var radius = Math.max(0, outside ? Math.min(width / 2 - textRoom, height / 2 - 18) : Math.min(width, height) / 2 - 4);
      var r0 = innerRadius > 0 ? radius * innerRadius : 0;

      var cursor = 0;
      var wedges = list.map(function (s) {
        var a0 = startAngle + (cursor / total) * 360;
        cursor += s.value;
        var a1 = startAngle + (cursor / total) * 360;
        return { id: s.id, name: s.name, value: s.value, color: s.color, a0: a0, a1: a1, d: K.arcPath(cx, cy, r0, radius, a0, a1, list.length > 1 ? sliceGap : 0) };
      });
      var labelR = r0 > 0 ? (r0 + radius) / 2 : radius * 0.64;
      var centreSize = Math.round(Math.max(14, Math.min(30, r0 * 0.42)));

      var enter = K.svg('g', {});
      var paths = wedges.map(function (w, i) {
        var path = K.svg('path', { d: w.d, fill: w.color, opacity: 1 });
        if (animMs) path.style.transition = 'opacity ' + animMs + 'ms';
        path.addEventListener('mouseenter', function () { if (tipOn) { hover = i; paintHover(); } });
        path.addEventListener('mouseleave', function () { hover = null; paintHover(); });
        enter.appendChild(path);
        return path;
      });
      if (labels !== 'none') {
        wedges.forEach(function (w) {
          if ((w.a1 - w.a0) / 360 < minLabelShare) return;
          var mid = (w.a0 + w.a1) / 2;
          var label = labelOf(w, total);
          var attrs;
          var t;
          if (outside) {
            var a = K.polar(cx, cy, radius + 2, mid);
            var b = K.polar(cx, cy, radius + 12, mid);
            var right = b[0] >= cx;
            var ex = b[0] + (right ? 8 : -8);
            var g = K.svg('g', { 'data-slice-label-group': '' });
            g.appendChild(K.svg('polyline', { points: a[0] + ',' + a[1] + ' ' + b[0] + ',' + b[1] + ' ' + ex + ',' + b[1], fill: 'none', stroke: w.color, 'stroke-width': 1, opacity: 0.8 }));
            var ls = { color: 'var(--text-primary)' };
            for (var k in labelStyle) ls[k] = labelStyle[k];
            attrs = K.valueLabelAttrs(ls);
            attrs['data-slice-label'] = '';
            attrs.x = ex + (right ? 4 : -4);
            attrs.y = b[1];
            attrs['text-anchor'] = right ? 'start' : 'end';
            attrs['dominant-baseline'] = 'middle';
            t = K.svg('text', attrs);
            t.textContent = label;
            g.appendChild(t);
            enter.appendChild(g);
            return;
          }
          var l = K.polar(cx, cy, labelR, mid);
          var inStyle = { fontWeight: 600 };
          for (var k2 in labelStyle) inStyle[k2] = labelStyle[k2];
          attrs = K.valueLabelAttrs(inStyle, true);
          attrs['data-slice-label'] = '';
          attrs.x = l[0];
          attrs.y = l[1];
          attrs['text-anchor'] = 'middle';
          attrs['dominant-baseline'] = 'middle';
          t = K.svg('text', attrs);
          t.textContent = label;
          enter.appendChild(t);
        });
      }
      svgEl.appendChild(enter);
      if (!played) { played = true; K.entrance(enter, 'grow', animate); }

      centre = null;
      caption = null;
      if (r0 > 0 && showCenter) {
        centre = K.svg('text', {
          x: cx, 'text-anchor': 'middle', 'dominant-baseline': 'middle',
          fill: 'var(--text-primary)', 'font-size': centreSize, 'font-weight': 600, 'data-center': '',
        });
        centre.style.fontVariantNumeric = 'tabular-nums';
        centre.style.letterSpacing = '-0.01em';
        svgEl.appendChild(centre);
        if (centerLabel) {
          caption = K.svg('text', { x: cx, y: cy + centreSize * 0.62, 'text-anchor': 'middle', 'dominant-baseline': 'middle', fill: 'var(--text-secondary)', 'font-size': 11 });
          caption.textContent = centerLabel;
          svgEl.appendChild(caption);
        }
      }
      geo = { wedges: wedges, paths: paths, total: total, cx: cx, cy: cy, radius: radius, centreSize: centreSize, width: width };
      paintHover();
    }

    /** Hover changes only opacities, the centre text and the tooltip (the slices stay under the pointer). */
    function paintHover() {
      if (!geo) return;
      var hv = hover !== null ? geo.wedges[hover] : undefined;
      geo.paths.forEach(function (p, i) { p.setAttribute('opacity', hover === null || hover === i ? 1 : 0.5); });
      if (centre) {
        centre.setAttribute('y', centerLabel && !hv ? geo.cy - geo.centreSize * 0.32 : geo.cy);
        centre.textContent = hv ? pctText(hv.value, geo.total) : valueFormat ? fmt(geo.total) : String(Math.round(geo.total));
      }
      if (caption) caption.style.display = hv ? 'none' : '';
      if (tipOn && hv) {
        var tipText = tooltipValue === 'value' ? fmt(hv.value) : tooltipValue === 'percent' ? pctText(hv.value, geo.total) : fmt(hv.value) + ' (' + pctText(hv.value, geo.total) + ')';
        var at = K.polar(geo.cx, geo.cy, geo.radius * 0.7, (hv.a0 + hv.a1) / 2);
        tip.update('', [{ seriesId: hv.id, seriesName: hv.name, color: hv.color, y: hv.value, valueLabel: tipText }], at[0], at[1], geo.width);
      } else tip.hide();
    }

    drawLegend();
    K.observeContainer(canvas, function (s) {
      if (s.width <= 0) return;
      size = s;
      draw();
    });
  }

  K.renderers.pie = render;
})(typeof window !== 'undefined' ? window : globalThis);
