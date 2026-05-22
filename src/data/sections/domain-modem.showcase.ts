import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const BASE = path.join(process.cwd(), 'modules/domain/modem');

const connectionStatusBadgeSource = fs.readFileSync(path.join(BASE, 'ConnectionStatusBadge.ejs'), 'utf-8');
const systemStatusCardSource      = fs.readFileSync(path.join(BASE, 'SystemStatusCard.ejs'),      'utf-8');
const wanStatusCardSource         = fs.readFileSync(path.join(BASE, 'WanStatusCard.ejs'),         'utf-8');
const wifiNetworkCardSource       = fs.readFileSync(path.join(BASE, 'WifiNetworkCard.ejs'),       'utf-8');
const connectedDeviceRowSource    = fs.readFileSync(path.join(BASE, 'ConnectedDeviceRow.ejs'),    'utf-8');
const portForwardRowSource        = fs.readFileSync(path.join(BASE, 'PortForwardRow.ejs'),        'utf-8');
const alertItemSource             = fs.readFileSync(path.join(BASE, 'AlertItem.ejs'),             'utf-8');

// ─── Shared helpers ───────────────────────────────────────────────────────────

function statusBadgeEl(status: string, label?: string): string {
  const meta: Record<string, { dot: string; text: string; bg: string; border: string; pulse?: boolean }> = {
    CONNECTED:    { dot: 'bg-success',  text: 'text-success',        bg: 'bg-green-50  dark:bg-green-950/30',  border: 'border-green-200  dark:border-green-800'  },
    DISCONNECTED: { dot: 'bg-error',    text: 'text-error',          bg: 'bg-red-50    dark:bg-red-950/30',    border: 'border-red-200    dark:border-red-800'    },
    CONNECTING:   { dot: 'bg-warning',  text: 'text-warning',        bg: 'bg-amber-50  dark:bg-amber-950/30', border: 'border-amber-200  dark:border-amber-800', pulse: true },
    ERROR:        { dot: 'bg-error',    text: 'text-error',          bg: 'bg-red-50    dark:bg-red-950/30',    border: 'border-red-200    dark:border-red-800'    },
    ENABLED:      { dot: 'bg-success',  text: 'text-success',        bg: 'bg-green-50  dark:bg-green-950/30',  border: 'border-green-200  dark:border-green-800'  },
    DISABLED:     { dot: 'bg-gray-400', text: 'text-text-secondary', bg: 'bg-surface-overlay',                 border: 'border-border'                           },
    ACTIVE:       { dot: 'bg-success',  text: 'text-success',        bg: 'bg-green-50  dark:bg-green-950/30',  border: 'border-green-200  dark:border-green-800'  },
    INACTIVE:     { dot: 'bg-gray-400', text: 'text-text-secondary', bg: 'bg-surface-overlay',                 border: 'border-border'                           },
  };
  const m = meta[status] ?? meta.INACTIVE;
  const lbl = label ?? status.charAt(0) + status.slice(1).toLowerCase();
  return `<span class="inline-flex items-center gap-1.5 rounded-full border font-medium text-xs px-2.5 py-1 ${m.text} ${m.bg} ${m.border}">
  <span class="h-1.5 w-1.5 rounded-full flex-shrink-0 ${m.dot}${m.pulse ? ' animate-pulse' : ''}" aria-hidden="true"></span>
  ${lbl}
</span>`;
}

function progressBar(pct: number, color: string): string {
  return `<div class="w-full h-1.5 rounded-full bg-surface-sunken overflow-hidden">
  <div class="h-full rounded-full ${color}" style="width:${pct}%"></div>
</div>`;
}

// ─── ConnectionStatusBadge ────────────────────────────────────────────────────

const connectionStatusBadgeItem: ShowcaseItem = {
  id: 'modem-connection-status-badge',
  title: 'ConnectionStatusBadge',
  category: 'Domain · Modem',
  abbr: 'CS',
  description: 'Color-coded badge for router/modem connection states. CONNECTED · DISCONNECTED · CONNECTING (pulse) · ERROR · ENABLED · DISABLED · ACTIVE · INACTIVE.',
  filePath: 'modules/domain/modem/ConnectionStatusBadge.ejs',
  sourceCode: connectionStatusBadgeSource,
  variants: [
    {
      title: 'Connection states',
      previewHtml: `<div class="flex flex-wrap gap-2 p-4">
  ${statusBadgeEl('CONNECTED')}
  ${statusBadgeEl('DISCONNECTED')}
  ${statusBadgeEl('CONNECTING')}
  ${statusBadgeEl('ERROR')}
</div>`,
      code: `<%- include('modules/domain/modem/ConnectionStatusBadge', { status: 'CONNECTED' }) %>
<%- include('modules/domain/modem/ConnectionStatusBadge', { status: 'DISCONNECTED' }) %>
<%- include('modules/domain/modem/ConnectionStatusBadge', { status: 'CONNECTING' }) %>
<%- include('modules/domain/modem/ConnectionStatusBadge', { status: 'ERROR' }) %>`,
    },
    {
      title: 'Enabled / Active states',
      previewHtml: `<div class="flex flex-wrap gap-2 p-4">
  ${statusBadgeEl('ENABLED')}
  ${statusBadgeEl('DISABLED')}
  ${statusBadgeEl('ACTIVE')}
  ${statusBadgeEl('INACTIVE')}
</div>`,
      code: `<%- include('modules/domain/modem/ConnectionStatusBadge', { status: 'ENABLED' }) %>
<%- include('modules/domain/modem/ConnectionStatusBadge', { status: 'DISABLED' }) %>
<%- include('modules/domain/modem/ConnectionStatusBadge', { status: 'ACTIVE' }) %>
<%- include('modules/domain/modem/ConnectionStatusBadge', { status: 'INACTIVE' }) %>`,
    },
    {
      title: 'Custom label',
      previewHtml: `<div class="flex flex-wrap gap-2 p-4">
  ${statusBadgeEl('CONNECTED', 'Online')}
  ${statusBadgeEl('DISCONNECTED', 'No signal')}
  ${statusBadgeEl('CONNECTING', 'Dialing…')}
</div>`,
      code: `<%- include('modules/domain/modem/ConnectionStatusBadge', { status: 'CONNECTED',    label: 'Online'    }) %>
<%- include('modules/domain/modem/ConnectionStatusBadge', { status: 'DISCONNECTED', label: 'No signal' }) %>
<%- include('modules/domain/modem/ConnectionStatusBadge', { status: 'CONNECTING',   label: 'Dialing…'  }) %>`,
    },
  ],
};

// ─── SystemStatusCard ─────────────────────────────────────────────────────────

const systemStatusCardItem: ShowcaseItem = {
  id: 'modem-system-status-card',
  title: 'SystemStatusCard',
  category: 'Domain · Modem',
  abbr: 'SS',
  description: 'Device model, CPU/RAM progress bars, temperature, uptime, and firmware version. Color changes based on temperature thresholds (>55 warning, >70 error).',
  filePath: 'modules/domain/modem/SystemStatusCard.ejs',
  sourceCode: systemStatusCardSource,
  variants: [
    {
      title: 'Normal load',
      previewHtml: `<div class="max-w-xs p-4">
  <div class="rounded-xl border border-border bg-surface-raised p-5 space-y-4">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm font-semibold text-text-primary">KONNECT-KT-3535n</p>
        <p class="text-xs text-text-secondary mt-0.5">KONNECT KT-3535n · HW 1.0</p>
      </div>
      <div class="text-right">
        <p class="text-lg font-bold tabular-nums text-success">52°C</p>
        <p class="text-xs text-text-secondary">Temp</p>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="space-y-1">
        <div class="flex items-center justify-between text-xs">
          <span class="font-medium text-text-primary">CPU</span>
          <span class="tabular-nums text-text-secondary">18%</span>
        </div>
        ${progressBar(18, 'bg-success')}
      </div>
      <div class="space-y-1">
        <div class="flex items-center justify-between text-xs">
          <span class="font-medium text-text-primary">Memory</span>
          <span class="tabular-nums text-text-secondary">215/512 MB</span>
        </div>
        ${progressBar(42, 'bg-primary')}
      </div>
    </div>
    <div class="flex items-center justify-between border-t border-border pt-3 text-xs">
      <span class="text-text-secondary">Uptime <span class="font-medium text-text-primary">14d 0h 0m</span></span>
      <span class="text-text-secondary font-mono">3.0.0.4.388</span>
    </div>
  </div>
</div>`,
      code: `<%- include('modules/domain/modem/SystemStatusCard', {
  hostname:  system.hostname,
  model:     system.model,
  firmware:  system.firmware,
  resources: system.resources,
  time:      system.time,
}) %>`,
      layout: 'stack',
    },
    {
      title: 'High load (warning)',
      previewHtml: `<div class="max-w-xs p-4">
  <div class="rounded-xl border border-border bg-surface-raised p-5 space-y-4">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm font-semibold text-text-primary">KONNECT-KT-3535n</p>
        <p class="text-xs text-text-secondary mt-0.5">KONNECT KT-3535n · HW 1.0</p>
      </div>
      <div class="text-right">
        <p class="text-lg font-bold tabular-nums text-warning">67°C</p>
        <p class="text-xs text-text-secondary">Temp</p>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="space-y-1">
        <div class="flex items-center justify-between text-xs">
          <span class="font-medium text-text-primary">CPU</span>
          <span class="tabular-nums text-text-secondary">75%</span>
        </div>
        ${progressBar(75, 'bg-warning')}
      </div>
      <div class="space-y-1">
        <div class="flex items-center justify-between text-xs">
          <span class="font-medium text-text-primary">Memory</span>
          <span class="tabular-nums text-text-secondary">390/512 MB</span>
        </div>
        ${progressBar(76, 'bg-warning')}
      </div>
    </div>
    <div class="flex items-center justify-between border-t border-border pt-3 text-xs">
      <span class="text-text-secondary">Uptime <span class="font-medium text-text-primary">2h 15m</span></span>
      <span class="text-text-secondary font-mono">3.0.0.4.388</span>
    </div>
  </div>
</div>`,
      code: `<%- include('modules/domain/modem/SystemStatusCard', {
  hostname:  system.hostname,
  model:     system.model,
  firmware:  system.firmware,
  resources: { cpuPercent: 75, memoryPercent: 76, memoryUsedMb: 390, memoryTotalMb: 512, temperatureCelsius: 67 },
  time:      system.time,
}) %>`,
      layout: 'stack',
    },
  ],
};

// ─── WanStatusCard ────────────────────────────────────────────────────────────

const wanStatusCardItem: ShowcaseItem = {
  id: 'modem-wan-status-card',
  title: 'WanStatusCard',
  category: 'Domain · Modem',
  abbr: 'WS',
  description: 'WAN connection type, IP/gateway/DNS information, and ISP speed indicator. Color-coded based on status badge.',
  filePath: 'modules/domain/modem/WanStatusCard.ejs',
  sourceCode: wanStatusCardSource,
  variants: [
    {
      title: 'Connected (PPPoE)',
      previewHtml: `<div class="max-w-xs p-4">
  <div class="rounded-xl border border-border bg-surface-raised p-5 space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30 text-primary">
          <i class="fa-solid fa-globe text-sm" aria-hidden="true"></i>
        </span>
        <div>
          <p class="text-sm font-semibold text-text-primary">WAN</p>
          <p class="text-xs text-text-secondary">PPPOE</p>
        </div>
      </div>
      ${statusBadgeEl('CONNECTED')}
    </div>
    <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
      <div><dt class="text-text-secondary">IP Address</dt><dd class="mt-0.5 font-mono font-medium text-text-primary">88.247.123.45</dd></div>
      <div><dt class="text-text-secondary">Gateway</dt><dd class="mt-0.5 font-mono font-medium text-text-primary">88.247.123.1</dd></div>
      <div><dt class="text-text-secondary">DNS Primary</dt><dd class="mt-0.5 font-mono font-medium text-text-primary">8.8.8.8</dd></div>
      <div><dt class="text-text-secondary">MTU</dt><dd class="mt-0.5 font-mono font-medium text-text-primary">1492</dd></div>
    </dl>
    <div class="flex gap-4 pt-1 border-t border-border text-xs text-text-secondary">
      <div class="flex items-center gap-1.5">
        <i class="fa-solid fa-arrow-up text-info" aria-hidden="true"></i>
        <span class="font-medium text-text-primary tabular-nums">100 Mbps</span>
      </div>
      <div class="flex items-center gap-1.5">
        <i class="fa-solid fa-arrow-down text-success" aria-hidden="true"></i>
        <span class="font-medium text-text-primary tabular-nums">500 Mbps</span>
      </div>
    </div>
  </div>
</div>`,
      code: `<%- include('modules/domain/modem/WanStatusCard', { wan: state.wan }) %>`,
      layout: 'stack',
    },
    {
      title: 'Disconnected',
      previewHtml: `<div class="max-w-xs p-4">
  <div class="rounded-xl border border-border bg-surface-raised p-5 space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30 text-primary">
          <i class="fa-solid fa-globe text-sm" aria-hidden="true"></i>
        </span>
        <div>
          <p class="text-sm font-semibold text-text-primary">WAN</p>
          <p class="text-xs text-text-secondary">DHCP</p>
        </div>
      </div>
      ${statusBadgeEl('DISCONNECTED')}
    </div>
    <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
      <div><dt class="text-text-secondary">IP Address</dt><dd class="mt-0.5 font-mono font-medium text-text-primary">—</dd></div>
      <div><dt class="text-text-secondary">Gateway</dt><dd class="mt-0.5 font-mono font-medium text-text-primary">—</dd></div>
      <div><dt class="text-text-secondary">DNS Primary</dt><dd class="mt-0.5 font-mono font-medium text-text-primary">—</dd></div>
      <div><dt class="text-text-secondary">MTU</dt><dd class="mt-0.5 font-mono font-medium text-text-primary">1500</dd></div>
    </dl>
  </div>
</div>`,
      code: `<%- include('modules/domain/modem/WanStatusCard', {
  wan: { status: 'DISCONNECTED', connectionType: 'DHCP', ipAddress: null, gateway: null, dnsPrimary: null, mtu: 1500 }
}) %>`,
      layout: 'stack',
    },
  ],
};

// ─── WifiNetworkCard ──────────────────────────────────────────────────────────

function wifiCardEl(ssid: string, band: string, sec: string, opts: { guest?: boolean; disabled?: boolean } = {}): string {
  const bandColor = band === '5GHz' ? 'text-primary' : band === '6GHz' ? 'text-secondary' : 'text-info';
  const secLabels: Record<string, string> = {
    OPEN: 'Open', WPA2_PERSONAL: 'WPA2', WPA3_PERSONAL: 'WPA3', WPA2_WPA3_MIXED: 'WPA2/3',
  };
  const secLabel = secLabels[sec] ?? sec;
  const disabled = opts.disabled ? 'opacity-60' : '';
  return `<div class="rounded-xl border border-border bg-surface-raised p-4 flex items-center gap-4 ${disabled}">
  <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30 ${bandColor}">
    <i class="fa-solid fa-wifi text-sm" aria-hidden="true"></i>
  </span>
  <div class="flex-1 min-w-0">
    <div class="flex items-center gap-2 flex-wrap">
      <p class="text-sm font-semibold text-text-primary truncate">${ssid}</p>
      ${opts.guest ? '<span class="rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-1.5 py-0.5 text-xs font-medium text-warning">Guest</span>' : ''}
      ${opts.disabled ? '<span class="rounded-md bg-surface-overlay border border-border px-1.5 py-0.5 text-xs font-medium text-text-secondary">Off</span>' : ''}
    </div>
    <div class="flex items-center gap-2 mt-0.5 text-xs text-text-secondary">
      <span>${band}</span><span aria-hidden="true">·</span><span>${secLabel}</span>
    </div>
  </div>
</div>`;
}

const wifiNetworkCardItem: ShowcaseItem = {
  id: 'modem-wifi-network-card',
  title: 'WifiNetworkCard',
  category: 'Domain · Modem',
  abbr: 'WN',
  description: 'SSID, band (2.4/5/6 GHz), security mode, and guest/disabled labels. An edit link is added via the editHref prop.',
  filePath: 'modules/domain/modem/WifiNetworkCard.ejs',
  sourceCode: wifiNetworkCardSource,
  variants: [
    {
      title: 'Dual-band + guest',
      previewHtml: `<div class="max-w-sm p-4 space-y-2">
  ${wifiCardEl('HomeNetwork',    '2.4GHz', 'WPA2_WPA3_MIXED')}
  ${wifiCardEl('HomeNetwork_5G','5GHz',   'WPA3_PERSONAL')}
  ${wifiCardEl('HomeGuest',     '2.4GHz', 'WPA2_PERSONAL', { guest: true })}
</div>`,
      code: `<% wifi.networks.forEach(function(net) { %>
<%- include('modules/domain/modem/WifiNetworkCard', { network: net }) %>
<% }); %>`,
      layout: 'stack',
    },
    {
      title: 'Disabled network',
      previewHtml: `<div class="max-w-sm p-4 space-y-2">
  ${wifiCardEl('OldNetwork', '2.4GHz', 'WPA2_PERSONAL', { disabled: true })}
</div>`,
      code: `<%- include('modules/domain/modem/WifiNetworkCard', { network: { ...net, enabled: false } }) %>`,
      layout: 'stack',
    },
    {
      title: 'With edit link',
      previewHtml: `<div class="max-w-sm p-4">
  <div class="rounded-xl border border-border bg-surface-raised p-4 flex items-center gap-4">
    <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30 text-primary">
      <i class="fa-solid fa-wifi text-sm" aria-hidden="true"></i>
    </span>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-semibold text-text-primary">HomeNetwork_5G</p>
      <div class="flex items-center gap-2 mt-0.5 text-xs text-text-secondary">
        <span>5GHz</span><span aria-hidden="true">·</span><span>WPA3</span>
      </div>
    </div>
    <a href="#" class="shrink-0 text-xs text-text-secondary px-2 py-1 rounded border border-border hover:bg-surface-overlay">Edit</a>
  </div>
</div>`,
      code: `<%- include('modules/domain/modem/WifiNetworkCard', { network: net, editHref: '/wifi/edit/' + net.id }) %>`,
      layout: 'stack',
    },
  ],
};

// ─── ConnectedDeviceRow ───────────────────────────────────────────────────────

function deviceRowEl(name: string, mac: string, ip: string, conn: string, up: string, down: string, status: 'dhcp' | 'static' | 'blocked'): string {
  const connIcon = conn === 'Wired' ? 'fa-solid fa-ethernet' : 'fa-solid fa-wifi';
  const statusBadge = status === 'blocked'
    ? '<span class="inline-flex items-center rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-error text-xs px-2 py-0.5 font-medium">Blocked</span>'
    : status === 'static'
    ? '<span class="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-primary text-xs px-2 py-0.5 font-medium">Static</span>'
    : '<span class="inline-flex items-center rounded-full bg-surface-overlay border border-border text-text-secondary text-xs px-2 py-0.5">DHCP</span>';
  return `<tr class="border-t border-border">
  <td class="py-3 px-4">
    <div class="flex items-center gap-3">
      <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-overlay text-text-secondary text-sm">
        <i class="fa-solid fa-laptop" aria-hidden="true"></i>
      </span>
      <div>
        <p class="text-sm font-medium text-text-primary">${name}</p>
        <p class="text-xs font-mono text-text-secondary">${mac}</p>
      </div>
    </div>
  </td>
  <td class="py-3 px-4 text-sm font-mono text-text-secondary">${ip}</td>
  <td class="py-3 px-4">
    <span class="inline-flex items-center gap-1.5 text-xs text-text-secondary">
      <i class="${connIcon} text-primary" aria-hidden="true"></i>${conn}
    </span>
  </td>
  <td class="py-3 px-4 text-xs tabular-nums">
    <span class="text-info"><i class="fa-solid fa-arrow-up" aria-hidden="true"></i> ${up}</span>
    <span class="mx-1 text-border" aria-hidden="true">·</span>
    <span class="text-success"><i class="fa-solid fa-arrow-down" aria-hidden="true"></i> ${down}</span>
  </td>
  <td class="py-3 px-4">${statusBadge}</td>
</tr>`;
}

const connectedDeviceRowItem: ShowcaseItem = {
  id: 'modem-connected-device-row',
  title: 'ConnectedDeviceRow',
  category: 'Domain · Modem',
  abbr: 'CD',
  description: 'Connected device table row. Device icon, hostname/MAC, IP, connection type (wired/wifi + dBm), traffic, and DHCP/Static/Blocked status.',
  filePath: 'modules/domain/modem/ConnectedDeviceRow.ejs',
  sourceCode: connectedDeviceRowSource,
  variants: [
    {
      title: 'Mixed device list',
      previewHtml: `<div class="rounded-xl border border-border overflow-hidden">
  <table class="w-full text-sm">
    <thead>
      <tr class="bg-surface-raised border-b border-border">
        <th class="text-left py-2.5 px-4 text-xs font-medium text-text-secondary">Device</th>
        <th class="text-left py-2.5 px-4 text-xs font-medium text-text-secondary">IP</th>
        <th class="text-left py-2.5 px-4 text-xs font-medium text-text-secondary">Connection</th>
        <th class="text-left py-2.5 px-4 text-xs font-medium text-text-secondary">Traffic</th>
        <th class="text-left py-2.5 px-4 text-xs font-medium text-text-secondary">Status</th>
      </tr>
    </thead>
    <tbody>
      ${deviceRowEl('Desktop PC',   '00:11:22:33:44:55', '192.168.1.10',  'Wired',  '2.0 GB', '10.0 GB', 'static')}
      ${deviceRowEl('Work Laptop',  'B8:E8:56:AA:BB:CC', '192.168.1.102', '5 GHz',  '1.0 GB', '5.0 GB',  'dhcp')}
      ${deviceRowEl('Unknown',      '02:42:AC:11:22:33', '192.168.1.150', '2.4 GHz','10 MB',  '50 MB',   'blocked')}
    </tbody>
  </table>
</div>`,
      code: `<table class="w-full text-sm">
  <thead>...</thead>
  <tbody>
    <% state.connectedDevices.forEach(function(dev) { %>
    <%- include('modules/domain/modem/ConnectedDeviceRow', { device: dev }) %>
    <% }); %>
  </tbody>
</table>`,
      layout: 'stack',
    },
  ],
};

// ─── PortForwardRow ───────────────────────────────────────────────────────────

function pfRowEl(name: string, proto: string, extPort: string, intHost: string, intPort: string, enabled: boolean): string {
  return `<tr class="border-t border-border${!enabled ? ' opacity-50' : ''}">
  <td class="py-3 px-4">
    <div class="flex items-center gap-2">
      <span class="text-sm font-medium text-text-primary">${name}</span>
      ${!enabled ? '<span class="text-xs text-text-secondary bg-surface-overlay border border-border rounded px-1.5 py-0.5">Off</span>' : ''}
    </div>
  </td>
  <td class="py-3 px-4 text-xs font-mono text-text-secondary">${proto}</td>
  <td class="py-3 px-4 text-sm font-mono text-text-primary tabular-nums">${extPort}</td>
  <td class="py-3 px-4 text-xs font-mono text-text-secondary"><span class="text-text-primary">${intHost}</span>:${intPort}</td>
</tr>`;
}

const portForwardRowItem: ShowcaseItem = {
  id: 'modem-port-forward-row',
  title: 'PortForwardRow',
  category: 'Domain · Modem',
  abbr: 'PF',
  description: 'Port forwarding table row. Rule name, protocol, external port, internal IP:port, and enabled/disabled state.',
  filePath: 'modules/domain/modem/PortForwardRow.ejs',
  sourceCode: portForwardRowSource,
  variants: [
    {
      title: 'Port forwarding rules',
      previewHtml: `<div class="rounded-xl border border-border overflow-hidden">
  <table class="w-full text-sm">
    <thead>
      <tr class="bg-surface-raised border-b border-border">
        <th class="text-left py-2.5 px-4 text-xs font-medium text-text-secondary">Name</th>
        <th class="text-left py-2.5 px-4 text-xs font-medium text-text-secondary">Protocol</th>
        <th class="text-left py-2.5 px-4 text-xs font-medium text-text-secondary">Ext Port</th>
        <th class="text-left py-2.5 px-4 text-xs font-medium text-text-secondary">Internal</th>
      </tr>
    </thead>
    <tbody>
      ${pfRowEl('HTTP Server',  'TCP', '80',   '192.168.1.10', '8080',  true)}
      ${pfRowEl('HTTPS Server', 'TCP', '443',  '192.168.1.10', '8443',  true)}
      ${pfRowEl('SSH Admin',    'TCP', '2222', '192.168.1.10', '22',    false)}
      ${pfRowEl('Plex Media',   'TCP', '32400','192.168.1.11', '32400', true)}
    </tbody>
  </table>
</div>`,
      code: `<table class="w-full text-sm">
  <thead>...</thead>
  <tbody>
    <% nat.portForwardRules.forEach(function(rule) { %>
    <%- include('modules/domain/modem/PortForwardRow', { rule: rule }) %>
    <% }); %>
  </tbody>
</table>`,
      layout: 'stack',
    },
    {
      title: 'Port range rule',
      previewHtml: `<div class="rounded-xl border border-border overflow-hidden">
  <table class="w-full text-sm">
    <thead>
      <tr class="bg-surface-raised border-b border-border">
        <th class="text-left py-2.5 px-4 text-xs font-medium text-text-secondary">Name</th>
        <th class="text-left py-2.5 px-4 text-xs font-medium text-text-secondary">Protocol</th>
        <th class="text-left py-2.5 px-4 text-xs font-medium text-text-secondary">Ext Port</th>
        <th class="text-left py-2.5 px-4 text-xs font-medium text-text-secondary">Internal</th>
      </tr>
    </thead>
    <tbody>
      ${pfRowEl('Game Server', 'UDP', '27015–27030', '192.168.1.10', '27015–27030', true)}
    </tbody>
  </table>
</div>`,
      code: `<%- include('modules/domain/modem/PortForwardRow', {
  rule: {
    name: 'Game Server', enabled: true, protocol: 'UDP',
    externalPort: { start: 27015, end: 27030 },
    internalIp: '192.168.1.10',
    internalPort: { start: 27015, end: 27030 },
  }
}) %>`,
      layout: 'stack',
    },
  ],
};

// ─── AlertItem ────────────────────────────────────────────────────────────────

function alertItemEl(severity: string, message: string, time: string, read: boolean): string {
  const meta: Record<string, { icon: string; iconColor: string; bg: string; border: string }> = {
    INFO:     { icon: 'fa-solid fa-circle-info',          iconColor: 'text-info',    bg: 'bg-cyan-50 dark:bg-cyan-950/20',   border: 'border-cyan-200 dark:border-cyan-800'   },
    WARNING:  { icon: 'fa-solid fa-triangle-exclamation', iconColor: 'text-warning', bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-200 dark:border-amber-800' },
    CRITICAL: { icon: 'fa-solid fa-circle-xmark',         iconColor: 'text-error',   bg: 'bg-red-50 dark:bg-red-950/20',    border: 'border-red-200 dark:border-red-800'     },
  };
  const m = meta[severity] ?? meta.INFO;
  return `<div class="flex items-start gap-3 rounded-lg border p-3.5 ${m.bg} ${m.border}${read ? ' opacity-60' : ''}">
  <i class="${m.icon} ${m.iconColor} text-base mt-0.5 shrink-0" aria-hidden="true"></i>
  <div class="flex-1 min-w-0">
    <p class="text-xs font-medium text-text-primary leading-relaxed">${message}</p>
    <p class="text-xs text-text-secondary mt-0.5">${time}</p>
  </div>
  ${!read ? '<span class="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" aria-label="Unread"></span>' : ''}
</div>`;
}

const alertItemItem: ShowcaseItem = {
  id: 'modem-alert-item',
  title: 'AlertItem',
  category: 'Domain · Modem',
  abbr: 'AI',
  description: 'Router notification row. INFO · WARNING · CRITICAL severity levels. Unread alerts are marked with a blue dot.',
  filePath: 'modules/domain/modem/AlertItem.ejs',
  sourceCode: alertItemSource,
  variants: [
    {
      title: 'All severities (unread)',
      previewHtml: `<div class="max-w-sm p-4 space-y-2">
  ${alertItemEl('INFO',     'New firmware 3.0.0.4.390 is available',      '02 May 10:00', false)}
  ${alertItemEl('WARNING',  'Unknown device joined: 02:42:AC:11:22:33',   '02 May 13:00', false)}
  ${alertItemEl('CRITICAL', 'WAN connection lost (PPPoE)',                 '28 Apr 03:15', false)}
</div>`,
      code: `<% state.alerts.forEach(function(alert) { %>
<%- include('modules/domain/modem/AlertItem', { alert: alert }) %>
<% }); %>`,
      layout: 'stack',
    },
    {
      title: 'Read vs unread',
      previewHtml: `<div class="max-w-sm p-4 space-y-2">
  ${alertItemEl('WARNING', 'Unknown device joined: 02:42:AC:11:22:33', '02 May 13:00', false)}
  ${alertItemEl('WARNING', 'WAN reconnected after outage',              '28 Apr 03:20', true)}
</div>`,
      code: `<%- include('modules/domain/modem/AlertItem', { alert: { ...alert, read: false } }) %>
<%- include('modules/domain/modem/AlertItem', { alert: { ...alert, read: true  } }) %>`,
      layout: 'stack',
    },
    {
      title: 'Unread-only filter',
      previewHtml: `<div class="max-w-sm p-4 space-y-2">
  ${alertItemEl('INFO',    'Firmware 3.0.0.4.390 available', '02 May 10:00', false)}
  ${alertItemEl('WARNING', 'Unknown device 02:42:AC:11:22:33', '02 May 13:00', false)}
</div>`,
      code: `<% state.alerts.filter(function(a){ return !a.read; }).forEach(function(alert) { %>
<%- include('modules/domain/modem/AlertItem', { alert: alert }) %>
<% }); %>`,
      layout: 'stack',
    },
  ],
};

// ─── Builder ──────────────────────────────────────────────────────────────────

export function buildDomainModemData(): ShowcaseItem[] {
  return [
    connectionStatusBadgeItem,
    systemStatusCardItem,
    wanStatusCardItem,
    wifiNetworkCardItem,
    connectedDeviceRowItem,
    portForwardRowItem,
    alertItemItem,
  ];
}
