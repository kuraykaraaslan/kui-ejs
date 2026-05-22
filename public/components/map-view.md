# MapView

- **id:** `map-view`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/MapView.ejs`
- **status:** beta
- **since:** 2025-04

Leaflet tabanlı etkileşimli harita. Tooltip destekli işaretçiler, predefined zone'lar (polygon), rota çizgisi (polyline) ve tıkla-ekle işaretçi modu.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--primary-fg`
- `--primary-hover`
- `--surface-overlay`
- `--surface-raised`
- `--text-primary`

## Variants

### Tam özellik — işaretçi + zone + rota

```ejs
<%- include('modules/ui/MapView', {
  center:  [41.015, 28.979],
  zoom:    6,
  height:  400,
  markers: CITIES,
  zones:   ZONES,
  routes:  ROUTES,
}) %>
```

### Tıkla-ekle işaretçi modu

```ejs
<%- include('modules/ui/MapView', {
  center: [39.5, 35.0],
  zoom:   5,
  height: 360,
}) %>
```

### Yalnız zone ve rota

```ejs
<%- include('modules/ui/MapView', {
  center: [39.5, 35.0],
  zoom:   5,
  height: 360,
  zones:  ZONES,
  routes: ROUTES,
}) %>
```

## Full EJS source

```ejs
<%
var _id      = locals.id      || ('map-' + Math.random().toString(36).substr(2, 9));
var _center  = locals.center  || [39.9334, 32.8597];
var _zoom    = locals.zoom    || 6;
var _height  = locals.height  || 480;
var _markers = locals.markers || [];
var _zones   = locals.zones   || [];
var _routes  = locals.routes  || [];
var _cls     = locals.className || '';

// Button base classes — kept in sync with Button.ejs `xs` size + primary/outline variants.
var btnBase    = 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 text-xs';
var btnPrimary = 'bg-primary text-primary-fg hover:bg-primary-hover';
var btnOutline = 'border border-border text-text-primary hover:bg-surface-overlay';
%>
<%/*
  Inline Card(variant="raised") wrapper with -mx-6 -my-4 cancel-padding inner
  so toolbar + map render edge-to-edge inside Card's rounded border.
*/%>
<div class="rounded-xl border border-border overflow-hidden text-left bg-surface-raised shadow-sm<%= _cls ? ' ' + _cls : '' %>"
     style="isolation:isolate">
  <div class="px-6 py-4">
    <div class="-mx-6 -my-4 flex flex-col">

      <!-- Toolbar -->
      <div class="px-4 py-2.5 bg-surface-raised border-b border-border">
        <div class="flex items-center gap-2 flex-wrap">

          <button type="button" id="<%= _id %>-add-btn"
            class="<%= btnBase %> <%= btnOutline %>"
            title="Haritaya işaretçi ekle"
            aria-pressed="false">
            <span aria-hidden="true" class="shrink-0" data-add-left><i class="fa-solid fa-plus"></i></span>
            <span data-add-label>İşaretçi Ekle</span>
            <span aria-hidden="true" class="shrink-0"><i class="fa-solid fa-location-dot"></i></span>
          </button>

          <% if (_zones.length > 0) { %>
          <button type="button" id="<%= _id %>-zones-btn"
            class="<%= btnBase %> <%= btnPrimary %>"
            title="Bölgeleri gizle"
            aria-pressed="true">
            <span aria-hidden="true" class="shrink-0"><i class="fa-solid fa-eye"></i></span>
            <span>Bölgeler</span>
            <span aria-hidden="true" class="shrink-0"><i class="fa-solid fa-layer-group"></i></span>
          </button>
          <% } %>

          <% if (_routes.length > 0) { %>
          <button type="button" id="<%= _id %>-routes-btn"
            class="<%= btnBase %> <%= btnPrimary %>"
            title="Rotaları gizle"
            aria-pressed="true">
            <span aria-hidden="true" class="shrink-0"><i class="fa-solid fa-eye"></i></span>
            <span>Rotalar</span>
            <span aria-hidden="true" class="shrink-0"><i class="fa-solid fa-route"></i></span>
          </button>
          <% } %>

          <span id="<%= _id %>-hint"
            class="text-xs text-primary font-medium animate-pulse hidden"
            aria-live="polite">
            Haritaya tıklayarak işaretçi ekleyin
          </span>
        </div>
      </div>

      <!-- Map canvas -->
      <div id="<%= _id %>-map" style="height:<%= _height %>px"></div>

    </div>
  </div>
</div>

<script>
(function () {
  var COLORS = {
    primary: '#3b82f6', success: '#22c55e', warning: '#f59e0b',
    error: '#ef4444',   info: '#06b6d4',    neutral: '#6b7280'
  };
  var FILL = {
    primary: '#3b82f620', success: '#22c55e20', warning: '#f59e0b20',
    error: '#ef444420',   info: '#06b6d420',    neutral: '#6b728020'
  };

  function pinSvg(color) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))">'
      + '<path d="M12 0C5.373 0 0 5.373 0 12c0 3.143 1.204 5.997 3.17 8.126L12 36l8.83-15.874A11.945 11.945 0 0 0 24 12C24 5.373 18.627 0 12 0z" fill="' + color + '"/>'
      + '<circle cx="12" cy="12" r="4.5" fill="white" opacity=".9"/></svg>';
  }

  function createIcon(color) {
    return L.divIcon({ html: pinSvg(color), className: '', iconSize: [24, 36], iconAnchor: [12, 36], tooltipAnchor: [0, -38] });
  }

  function tooltipHtml(tt) {
    var html = '<div style="min-width:130px;max-width:220px">'
      + '<p style="font-weight:600;font-size:13px;color:#111827;margin-bottom:' + (tt.description || (tt.fields && tt.fields.length) ? '3px' : '0') + '">' + tt.title + '</p>';
    if (tt.description) {
      html += '<p style="font-size:11px;color:#6b7280;line-height:1.4;margin-bottom:' + (tt.fields && tt.fields.length ? '4px' : '0') + '">' + tt.description + '</p>';
    }
    if (tt.fields && tt.fields.length) {
      html += '<table style="width:100%;border-collapse:collapse"><tbody>';
      tt.fields.forEach(function (f) {
        html += '<tr><td style="font-size:11px;color:#6b7280;padding-right:6px;white-space:nowrap">' + f.label + '</td>'
              + '<td style="font-size:11px;color:#111827;font-weight:500">' + f.value + '</td></tr>';
      });
      html += '</tbody></table>';
    }
    return html + '</div>';
  }

  function init() {
    var mapEl = document.getElementById('<%- _id %>-map');
    if (!mapEl || !window.L) return;

    var map = L.map('<%- _id %>-map').setView([<%- _center[0] %>, <%- _center[1] %>], <%- _zoom %>);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    /* ── zones ── */
    var zonesData  = <%- JSON.stringify(_zones) %>;
    var zoneLayers = zonesData.map(function (z) {
      var v = z.variant || 'primary';
      var layer = L.polygon(z.positions, {
        color: COLORS[v], fillColor: FILL[v],
        fillOpacity: z.fillOpacity != null ? z.fillOpacity : 0.25, weight: 2
      }).addTo(map);
      if (z.label) layer.bindTooltip('<span style="font-weight:600;font-size:12px;color:' + COLORS[v] + '">' + z.label + '</span>', { sticky: true });
      return layer;
    });

    /* ── routes ── */
    var routesData  = <%- JSON.stringify(_routes) %>;
    var routeLayers = routesData.map(function (r) {
      var layer = L.polyline(r.positions, {
        color: r.color || COLORS.primary,
        weight: r.weight || 3,
        dashArray: r.dashed ? '8 6' : null
      }).addTo(map);
      if (r.label) layer.bindTooltip('<span style="font-weight:600;font-size:12px">' + r.label + '</span>', { sticky: true });
      return layer;
    });

    /* ── static markers ── */
    var markersData = <%- JSON.stringify(_markers) %>;
    var autoCount   = 0;
    markersData.forEach(function (m) {
      var color  = COLORS[m.variant || 'primary'];
      var marker = L.marker(m.position, { icon: createIcon(color) }).addTo(map);
      if (m.tooltip) marker.bindTooltip(tooltipHtml(m.tooltip));
      else if (m.label) marker.bindTooltip('<span style="font-size:12px;font-weight:600">' + m.label + '</span>');
    });

    /* ── toolbar wiring ── */
    var addMode  = false;
    var addBtn   = document.getElementById('<%- _id %>-add-btn');
    var hint     = document.getElementById('<%- _id %>-hint');
    var zonesBtn = document.getElementById('<%- _id %>-zones-btn');
    var routeBtn = document.getElementById('<%- _id %>-routes-btn');

    var btnBase    = 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1 text-xs';
    var btnOutline = 'border border-border text-text-primary hover:bg-surface-overlay';
    var btnPrimary = 'bg-primary text-primary-fg hover:bg-primary-hover';

    function setActive(btn, on) {
      if (!btn) return;
      if (on) {
        btn.className = btnBase + ' ' + btnPrimary;
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.className = btnBase + ' ' + btnOutline;
        btn.setAttribute('aria-pressed', 'false');
      }
    }

    function setAddBtnState(active) {
      setActive(addBtn, active);
      if (!addBtn) return;
      var leftIcon = addBtn.querySelector('[data-add-left] i');
      var label    = addBtn.querySelector('[data-add-label]');
      if (leftIcon) leftIcon.className = active ? 'fa-solid fa-xmark' : 'fa-solid fa-plus';
      if (label)    label.textContent  = active ? 'İptal' : 'İşaretçi Ekle';
      addBtn.setAttribute('title', active ? 'İşaretçi eklemeyi iptal et' : 'Haritaya işaretçi ekle');
    }

    if (addBtn) {
      addBtn.addEventListener('click', function () {
        addMode = !addMode;
        setAddBtnState(addMode);
        if (hint) hint.classList.toggle('hidden', !addMode);
        mapEl.style.cursor = addMode ? 'crosshair' : '';
      });
    }

    map.on('click', function (e) {
      if (!addMode) return;
      autoCount++;
      var pos = [e.latlng.lat, e.latlng.lng];
      var marker = L.marker(pos, { icon: createIcon(COLORS.primary) }).addTo(map);
      marker.bindTooltip(tooltipHtml({
        title: 'İşaretçi ' + autoCount,
        fields: [
          { label: 'Enlem',  value: pos[0].toFixed(5) },
          { label: 'Boylam', value: pos[1].toFixed(5) }
        ]
      }));
      addMode = false;
      setAddBtnState(false);
      if (hint) hint.classList.add('hidden');
      mapEl.style.cursor = '';
    });

    if (zonesBtn) {
      var zonesOn = true;
      zonesBtn.addEventListener('click', function () {
        zonesOn = !zonesOn;
        zoneLayers.forEach(function (l) { zonesOn ? l.addTo(map) : map.removeLayer(l); });
        var eyeIcon = zonesBtn.querySelector('.fa-eye, .fa-eye-slash');
        if (eyeIcon) eyeIcon.className = zonesOn ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
        setActive(zonesBtn, zonesOn);
        zonesBtn.setAttribute('title', zonesOn ? 'Bölgeleri gizle' : 'Bölgeleri göster');
      });
    }

    if (routeBtn) {
      var routesOn = true;
      routeBtn.addEventListener('click', function () {
        routesOn = !routesOn;
        routeLayers.forEach(function (l) { routesOn ? l.addTo(map) : map.removeLayer(l); });
        var eyeIcon = routeBtn.querySelector('.fa-eye, .fa-eye-slash');
        if (eyeIcon) eyeIcon.className = routesOn ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
        setActive(routeBtn, routesOn);
        routeBtn.setAttribute('title', routesOn ? 'Rotaları gizle' : 'Rotaları göster');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>

```
