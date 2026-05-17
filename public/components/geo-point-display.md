# GeoPointDisplay

- **id:** `geo-point-display`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/location/GeoPointDisplay.ejs`
- **status:** stable
- **since:** 0.1

Enlem/boylam koordinat gösterimi ve Google Maps bağlantısı. Hassasiyet ve etiket ayarlanabilir.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--primary-hover`
- `--secondary`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`

## Variants

### With label

```ejs
<%- include('modules/domain/common/location/GeoPointDisplay', {
  point: { latitude: 41.0082, longitude: 28.9784 },
  label: 'Istanbul'
}) %>
```

### Coordinates only

```ejs
<%- include('modules/domain/common/location/GeoPointDisplay', {
  point: { latitude: 51.5074, longitude: -0.1278 },
  showMapLink: false,
  precision: 4
}) %>
```

## Full EJS source

```ejs
<%
  var _point     = locals.point     || {};
  var _label     = locals.label     || null;
  var _showLink  = locals.showMapLink !== false;
  var _precision = locals.precision  || 6;

  var lat = typeof _point.latitude  === 'number' ? _point.latitude.toFixed(_precision)  : '';
  var lng = typeof _point.longitude === 'number' ? _point.longitude.toFixed(_precision) : '';
  var mapsUrl = 'https://www.google.com/maps?q=' + lat + ',' + lng;
%>
<div class="inline-flex items-center gap-2 text-sm<%= locals.className ? ' ' + locals.className : '' %>">
  <i class="fa-solid fa-location-dot text-text-disabled shrink-0" style="width:.875rem;height:.875rem" aria-hidden="true"></i>
  <div class="min-w-0">
    <% if (_label) { %><p class="text-xs text-text-secondary mb-0.5"><%= _label %></p><% } %>
    <p class="font-mono text-text-primary tabular-nums"><%= lat %>, <%= lng %></p>
  </div>
  <% if (_showLink && lat && lng) { %>
  <a href="<%= mapsUrl %>" target="_blank" rel="noopener noreferrer"
    aria-label="Open <%= lat %>, <%= lng %> in Google Maps"
    class="text-xs text-primary hover:text-primary-hover underline shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded">
    Map
  </a>
  <% } %>
</div>

```
