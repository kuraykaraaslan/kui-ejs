import type { ShowcaseItem } from '../../types';
import * as fs   from 'fs';
import * as path from 'path';

const mapViewSource = fs.readFileSync(path.join(process.cwd(), 'modules/ui/MapView.ejs'), 'utf-8');

// ─── color tables (mirrors MapView.ejs) ──────────────────────────────────────

const COLORS: Record<string, string> = {
  primary: '#3b82f6', success: '#22c55e', warning: '#f59e0b',
  error: '#ef4444',   info: '#06b6d4',    neutral: '#6b7280',
};
const FILL: Record<string, string> = {
  primary: '#3b82f620', success: '#22c55e20', warning: '#f59e0b20',
  error: '#ef444420',   info: '#06b6d420',    neutral: '#6b728020',
};

// ─── shared preview helper ────────────────────────────────────────────────────

let _seq = 0;

interface Marker  { id?: string; position: [number, number]; variant?: string; tooltip?: { title: string; description?: string; fields?: { label: string; value: string }[] }; label?: string }
interface Zone    { id?: string; positions: [number, number][]; label?: string; variant?: string; fillOpacity?: number }
interface Route   { id?: string; positions: [number, number][]; label?: string; color?: string; weight?: number; dashed?: boolean }

function mapPreviewHtml(opts: {
  center?:  [number, number];
  zoom?:    number;
  height?:  number;
  markers?: Marker[];
  zones?:   Zone[];
  routes?:  Route[];
}): string {
  _seq++;
  const id      = `map-showcase-${_seq}`;
  const center  = opts.center  ?? [39.5, 35.0];
  const zoom    = opts.zoom    ?? 5;
  const height  = opts.height  ?? 360;
  const markers = opts.markers ?? [];
  const zones   = opts.zones   ?? [];
  const routes  = opts.routes  ?? [];

  const btnBase    = 'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus px-2 py-1 text-xs';
  const btnOutline = 'border border-border text-text-primary hover:bg-surface-overlay';
  const btnPrimary = 'bg-primary text-primary-fg';

  const zonesBtn = zones.length > 0
    ? `<button type="button" id="${id}-zones-btn" class="${btnBase} ${btnPrimary}" aria-pressed="true">
        <i class="fa-solid fa-eye" aria-hidden="true"></i>
        <i class="fa-solid fa-layer-group" aria-hidden="true"></i>
        Bölgeler
       </button>` : '';

  const routesBtn = routes.length > 0
    ? `<button type="button" id="${id}-routes-btn" class="${btnBase} ${btnPrimary}" aria-pressed="true">
        <i class="fa-solid fa-eye" aria-hidden="true"></i>
        <i class="fa-solid fa-route" aria-hidden="true"></i>
        Rotalar
       </button>` : '';

  const pinSvg = (color: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))"><path d="M12 0C5.373 0 0 5.373 0 12c0 3.143 1.204 5.997 3.17 8.126L12 36l8.83-15.874A11.945 11.945 0 0 0 24 12C24 5.373 18.627 0 12 0z" fill="${color}"/><circle cx="12" cy="12" r="4.5" fill="white" opacity=".9"/></svg>`;

  const tooltipHtmlFn = (tt: NonNullable<Marker['tooltip']>) => {
    let html = `<div style="min-width:130px;max-width:220px"><p style="font-weight:600;font-size:13px;color:#111827;margin-bottom:${tt.description || tt.fields?.length ? '3px' : '0'}">${tt.title}</p>`;
    if (tt.description) html += `<p style="font-size:11px;color:#6b7280;line-height:1.4;margin-bottom:${tt.fields?.length ? '4px' : '0'}">${tt.description}</p>`;
    if (tt.fields?.length) {
      html += '<table style="width:100%;border-collapse:collapse"><tbody>';
      tt.fields.forEach(f => { html += `<tr><td style="font-size:11px;color:#6b7280;padding-right:6px;white-space:nowrap">${f.label}</td><td style="font-size:11px;color:#111827;font-weight:500">${f.value}</td></tr>`; });
      html += '</tbody></table>';
    }
    return html + '</div>';
  };

  const jsMarkers = JSON.stringify(markers);
  const jsZones   = JSON.stringify(zones);
  const jsRoutes  = JSON.stringify(routes);

  return `
<div class="rounded-xl border border-border shadow-sm overflow-hidden bg-surface-raised w-full" style="isolation:isolate">
  <div class="flex items-center gap-2 px-4 py-2.5 bg-surface-raised border-b border-border flex-wrap">
    <button type="button" id="${id}-add-btn" class="${btnBase} ${btnOutline}" aria-pressed="false">
      <i class="fa-solid fa-plus" aria-hidden="true"></i>
      <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
      İşaretçi Ekle
    </button>
    ${zonesBtn}
    ${routesBtn}
    <span id="${id}-hint" class="ml-auto text-xs text-primary font-medium animate-pulse hidden" aria-live="polite">
      Haritaya tıklayarak işaretçi ekleyin
    </span>
  </div>
  <div id="${id}-map" style="height:${height}px"></div>
</div>
<script>
(function(){
  var COLORS=${JSON.stringify(COLORS)};
  var FILL=${JSON.stringify(FILL)};
  function pinSvg(c){return ${JSON.stringify(pinSvg('__C__'))}.replace('__C__',c);}
  function createIcon(c){return L.divIcon({html:pinSvg(c),className:'',iconSize:[24,36],iconAnchor:[12,36],tooltipAnchor:[0,-38]});}
  function ttHtml(tt){
    var h='<div style="min-width:130px;max-width:220px"><p style="font-weight:600;font-size:13px;color:#111827">'+tt.title+'</p>';
    if(tt.description)h+='<p style="font-size:11px;color:#6b7280;line-height:1.4">'+tt.description+'</p>';
    if(tt.fields&&tt.fields.length){h+='<table style="width:100%;border-collapse:collapse"><tbody>';tt.fields.forEach(function(f){h+='<tr><td style="font-size:11px;color:#6b7280;padding-right:6px;white-space:nowrap">'+f.label+'</td><td style="font-size:11px;color:#111827;font-weight:500">'+f.value+'</td></tr>';});h+='</tbody></table>';}
    return h+'</div>';
  }
  function init(){
    var el=document.getElementById('${id}-map');
    if(!el||!window.L)return;
    var map=L.map('${id}-map').setView([${center[0]},${center[1]}],${zoom});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
    var zD=${jsZones},rD=${jsRoutes},mD=${jsMarkers};
    var zL=zD.map(function(z){var v=z.variant||'primary';var l=L.polygon(z.positions,{color:COLORS[v],fillColor:FILL[v],fillOpacity:z.fillOpacity!=null?z.fillOpacity:0.25,weight:2}).addTo(map);if(z.label)l.bindTooltip('<span style="font-weight:600;font-size:12px;color:'+COLORS[v]+'">'+z.label+'</span>',{sticky:true});return l;});
    var rL=rD.map(function(r){var l=L.polyline(r.positions,{color:r.color||COLORS.primary,weight:r.weight||3,dashArray:r.dashed?'8 6':null}).addTo(map);if(r.label)l.bindTooltip('<span style="font-weight:600;font-size:12px">'+r.label+'</span>',{sticky:true});return l;});
    mD.forEach(function(m){var mk=L.marker(m.position,{icon:createIcon(COLORS[m.variant||'primary'])}).addTo(map);if(m.tooltip)mk.bindTooltip(ttHtml(m.tooltip));else if(m.label)mk.bindTooltip('<span style="font-size:12px;font-weight:600">'+m.label+'</span>');});
    var addMode=false,autoN=0;
    var btnBase='inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus px-2 py-1 text-xs';
    function setActive(btn,on){if(!btn)return;btn.className=btnBase+' '+(on?'bg-primary text-primary-fg':'border border-border text-text-primary hover:bg-surface-overlay');btn.setAttribute('aria-pressed',on?'true':'false');}
    var addBtn=document.getElementById('${id}-add-btn');
    var hint=document.getElementById('${id}-hint');
    if(addBtn)addBtn.addEventListener('click',function(){addMode=!addMode;setActive(addBtn,addMode);if(hint)hint.classList.toggle('hidden',!addMode);el.style.cursor=addMode?'crosshair':'';});
    map.on('click',function(e){if(!addMode)return;autoN++;var pos=[e.latlng.lat,e.latlng.lng];var mk=L.marker(pos,{icon:createIcon(COLORS.primary)}).addTo(map);mk.bindTooltip(ttHtml({title:'İşaretçi '+autoN,fields:[{label:'Enlem',value:pos[0].toFixed(5)},{label:'Boylam',value:pos[1].toFixed(5)}]}));addMode=false;setActive(addBtn,false);if(hint)hint.classList.add('hidden');el.style.cursor='';});
    var zBtn=document.getElementById('${id}-zones-btn');
    if(zBtn){var zOn=true;zBtn.addEventListener('click',function(){zOn=!zOn;zL.forEach(function(l){zOn?l.addTo(map):map.removeLayer(l);});setActive(zBtn,zOn);});}
    var rBtn=document.getElementById('${id}-routes-btn');
    if(rBtn){var rOn=true;rBtn.addEventListener('click',function(){rOn=!rOn;rL.forEach(function(l){rOn?l.addTo(map):map.removeLayer(l);});setActive(rBtn,rOn);});}
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
<\/script>`.trim();
}

// ─── sample data ──────────────────────────────────────────────────────────────

const CITIES: Marker[] = [
  { id: 'istanbul', position: [41.015, 28.979], variant: 'primary', tooltip: { title: 'İstanbul', description: 'Türkiye\'nin en kalabalık şehri', fields: [{ label: 'Nüfus', value: '15.8 M' }, { label: 'Alan', value: '5.461 km²' }] } },
  { id: 'ankara',   position: [39.925, 32.836], variant: 'success', tooltip: { title: 'Ankara',   description: 'Türkiye\'nin başkenti',             fields: [{ label: 'Nüfus', value: '5.6 M'  }] } },
  { id: 'izmir',    position: [38.423, 27.143], variant: 'info',    tooltip: { title: 'İzmir',    description: 'Ege\'nin incisi',                    fields: [{ label: 'Nüfus', value: '4.4 M'  }] } },
  { id: 'bursa',    position: [40.182, 29.067], variant: 'warning', tooltip: { title: 'Bursa',    description: 'Yeşil Bursa',                        fields: [{ label: 'Nüfus', value: '3.1 M'  }] } },
];

const ZONES: Zone[] = [
  { id: 'marmara', label: 'Marmara Bölgesi', variant: 'primary', positions: [[41.8,26.3],[41.5,30.8],[40.0,31.0],[39.8,26.5]], fillOpacity: 0.15 },
  { id: 'ege',     label: 'Ege Bölgesi',     variant: 'info',    positions: [[39.8,26.5],[40.0,31.0],[37.5,30.5],[37.2,26.3]], fillOpacity: 0.15 },
];

const ROUTES: Route[] = [
  { id: 'ist-ank', label: 'İstanbul → Ankara (TEM)', positions: [[41.015,28.979],[40.85,29.9],[40.78,31.2],[40.5,32.0],[39.925,32.836]], color: '#3b82f6', weight: 3 },
  { id: 'ist-izm', label: 'İstanbul → İzmir (E87)',  positions: [[41.015,28.979],[40.5,27.9],[39.9,27.5],[38.9,27.2],[38.423,27.143]],  color: '#06b6d4', weight: 3, dashed: true },
];

// ─────────────────────────────────────────────────────────────────────────────

export function buildMapData(): ShowcaseItem[] {
  return [
    {
      id:          'map-view',
      title:       'MapView',
      category:    'Molecule',
      abbr:        'Mp',
      description: 'Leaflet-based interactive map. Tooltip-enabled markers, predefined zones (polygon), route lines (polyline), and click-to-add marker mode.',
      filePath:    'modules/ui/MapView.ejs',
      sourceCode:  mapViewSource,
      variants: [
        {
          title:       'Tam özellik — işaretçi + zone + rota',
          layout:      'stack',
          previewHtml: mapPreviewHtml({ center: [41.015, 28.979], zoom: 6, height: 400, markers: CITIES, zones: ZONES, routes: ROUTES }),
          code: `<%- include('modules/ui/MapView', {
  center:  [41.015, 28.979],
  zoom:    6,
  height:  400,
  markers: CITIES,
  zones:   ZONES,
  routes:  ROUTES,
}) %>`,
        },
        {
          title:       'Tıkla-ekle işaretçi modu',
          layout:      'stack',
          previewHtml: mapPreviewHtml({ center: [39.5, 35.0], zoom: 5, height: 360 }),
          code: `<%- include('modules/ui/MapView', {
  center: [39.5, 35.0],
  zoom:   5,
  height: 360,
}) %>`,
        },
        {
          title:       'Yalnız zone ve rota',
          layout:      'stack',
          previewHtml: mapPreviewHtml({ center: [39.5, 35.0], zoom: 5, height: 360, zones: ZONES, routes: ROUTES }),
          code: `<%- include('modules/ui/MapView', {
  center: [39.5, 35.0],
  zoom:   5,
  height: 360,
  zones:  ZONES,
  routes: ROUTES,
}) %>`,
        },
      ],
    },
  ];
}
