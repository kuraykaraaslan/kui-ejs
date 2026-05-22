import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const BASE = path.join(process.cwd(), 'modules/domain/api-doc');

const statusCodeBadgeSource   = fs.readFileSync(path.join(BASE, 'StatusCodeBadge.ejs'),    'utf-8');
const httpMethodBadgeSource   = fs.readFileSync(path.join(BASE, 'HttpMethodBadge.ejs'),    'utf-8');
const securityBadgeSource     = fs.readFileSync(path.join(BASE, 'SecurityBadge.ejs'),      'utf-8');
const securitySchemeBadgeSrc  = fs.readFileSync(path.join(BASE, 'SecuritySchemeBadge.ejs'),'utf-8');
const parameterTableSource    = fs.readFileSync(path.join(BASE, 'ParameterTable.ejs'),     'utf-8');
const schemaViewerSource      = fs.readFileSync(path.join(BASE, 'SchemaViewer.ejs'),       'utf-8');
const codeSamplePanelSource   = fs.readFileSync(path.join(BASE, 'CodeSamplePanel.ejs'),    'utf-8');
const serverSelectorSource    = fs.readFileSync(path.join(BASE, 'ServerSelector.ejs'),     'utf-8');
const responseCardSource      = fs.readFileSync(path.join(BASE, 'ResponseCard.ejs'),       'utf-8');
const operationPanelSource    = fs.readFileSync(path.join(BASE, 'OperationPanel.ejs'),     'utf-8');
const endpointRowSource       = fs.readFileSync(path.join(BASE, 'EndpointRow.ejs'),        'utf-8');
const apiTagSectionSource     = fs.readFileSync(path.join(BASE, 'ApiTagSection.ejs'),      'utf-8');
const apiKeyTokenCardSource   = fs.readFileSync(path.join(BASE, 'ApiKeyTokenCard.ejs'),    'utf-8');
const authSchemeCardSource    = fs.readFileSync(path.join(BASE, 'AuthSchemeCard.ejs'),     'utf-8');
const oauthFlowDiagramSource  = fs.readFileSync(path.join(BASE, 'OAuthFlowDiagram.ejs'),   'utf-8');

/* ─── Shared helpers ─── */

function statusBadge(code: string): string {
  const n = parseInt(code, 10);
  let cls: string;
  if (n >= 200 && n < 300) cls = 'bg-success-subtle text-success-fg border-success/30';
  else if (n >= 300 && n < 400) cls = 'bg-info-subtle text-info-fg border-info/30';
  else if (n >= 400 && n < 500) cls = 'bg-warning-subtle text-warning-fg border-warning/30';
  else if (n >= 500) cls = 'bg-error-subtle text-error-fg border-error/30';
  else cls = 'bg-surface-overlay text-text-secondary border-border';
  return `<span class="inline-flex items-center gap-1.5 rounded border font-mono font-semibold text-xs px-2 py-0.5 ${cls}">${code}</span>`;
}

function methodBadge(method: string): string {
  const colors: Record<string, string> = {
    GET:     'bg-success-subtle text-success-fg border-success/30',
    POST:    'bg-primary-subtle text-primary border-primary/30',
    PUT:     'bg-warning-subtle text-warning-fg border-warning/30',
    PATCH:   'bg-warning-subtle text-warning-fg border-warning/30',
    DELETE:  'bg-error-subtle text-error-fg border-error/30',
    HEAD:    'bg-surface-overlay text-text-secondary border-border',
    OPTIONS: 'bg-surface-overlay text-text-secondary border-border',
    TRACE:   'bg-surface-overlay text-text-secondary border-border',
  };
  const cls = colors[method] ?? 'bg-surface-overlay text-text-secondary border-border';
  return `<span class="inline-flex items-center rounded border font-mono font-bold uppercase text-xs px-2 py-0.5 ${cls}">${method}</span>`;
}

function schemeBadge(type: string, name: string): string {
  const icons: Record<string, string> = {
    apiKey: 'fa-key', http: 'fa-shield-halved', oauth2: 'fa-circle-check', openIdConnect: 'fa-id-badge', mutualTLS: 'fa-lock',
  };
  const styles: Record<string, string> = {
    apiKey: 'bg-warning-subtle text-warning-fg border-warning/30',
    http:   'bg-info-subtle text-info-fg border-info/30',
    oauth2: 'bg-primary-subtle text-primary border-primary/30',
    openIdConnect: 'bg-success-subtle text-success-fg border-success/30',
    mutualTLS: 'bg-surface-sunken text-text-secondary border-border',
  };
  const icon = icons[type] ?? 'fa-lock';
  const cls  = styles[type] ?? 'bg-surface-overlay text-text-secondary border-border';
  return `<span class="inline-flex items-center gap-1.5 rounded-full border font-medium text-xs px-2.5 py-1 ${cls}"><i class="fa-solid ${icon} text-[10px]" aria-hidden="true"></i>${name}</span>`;
}

/* ─── StatusCodeBadge ─── */

const statusCodeBadgeItem: ShowcaseItem = {
  id:          'api-doc-status-code-badge',
  title:       'StatusCodeBadge',
  category:    'Domain · API Doc',
  abbr:        'SC',
  description: 'Displays an HTTP status code with a semantic color and an optional human-readable label.',
  filePath:    'modules/domain/api-doc/StatusCodeBadge.ejs',
  sourceCode:  statusCodeBadgeSource,
  variants: [
    {
      title: 'Success & redirect codes',
      previewHtml: `<div class="flex flex-wrap gap-2 p-4">${['200','201','204','301','302'].map(statusBadge).join('')}</div>`,
      code: `<%- include('modules/domain/api-doc/StatusCodeBadge', { code: '200' }) %>
<%- include('modules/domain/api-doc/StatusCodeBadge', { code: '201' }) %>
<%- include('modules/domain/api-doc/StatusCodeBadge', { code: '204' }) %>`,
    },
    {
      title: 'Client & server error codes',
      previewHtml: `<div class="flex flex-wrap gap-2 p-4">${['400','401','403','404','422','429','500','503'].map(statusBadge).join('')}</div>`,
      code: `<%- include('modules/domain/api-doc/StatusCodeBadge', { code: '400' }) %>
<%- include('modules/domain/api-doc/StatusCodeBadge', { code: '401' }) %>
<%- include('modules/domain/api-doc/StatusCodeBadge', { code: '404' }) %>
<%- include('modules/domain/api-doc/StatusCodeBadge', { code: '500' }) %>`,
    },
  ],
};

/* ─── HttpMethodBadge ─── */

const httpMethodBadgeItem: ShowcaseItem = {
  id:          'api-doc-http-method-badge',
  title:       'HttpMethodBadge',
  category:    'Domain · API Doc',
  abbr:        'HM',
  description: 'Color-coded badge for HTTP methods — GET, POST, PUT, PATCH, DELETE, and more.',
  filePath:    'modules/domain/api-doc/HttpMethodBadge.ejs',
  sourceCode:  httpMethodBadgeSource,
  variants: [
    {
      title: 'All methods',
      previewHtml: `<div class="flex flex-wrap gap-2 p-4">${['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS'].map(m => methodBadge(m)).join('')}</div>`,
      code: `<%- include('modules/domain/api-doc/HttpMethodBadge', { method: 'GET' }) %>
<%- include('modules/domain/api-doc/HttpMethodBadge', { method: 'POST' }) %>
<%- include('modules/domain/api-doc/HttpMethodBadge', { method: 'DELETE' }) %>`,
    },
    {
      title: 'Sizes',
      previewHtml: `<div class="flex flex-wrap items-center gap-3 p-4">
  <span class="inline-flex items-center rounded border font-mono font-bold uppercase text-[10px] px-1.5 py-px bg-success-subtle text-success-fg border-success/30">GET</span>
  <span class="inline-flex items-center rounded border font-mono font-bold uppercase text-xs px-2 py-0.5 bg-success-subtle text-success-fg border-success/30">GET</span>
  <span class="inline-flex items-center rounded border font-mono font-bold uppercase text-sm px-2.5 py-1 bg-success-subtle text-success-fg border-success/30">GET</span>
</div>`,
      code: `<%- include('modules/domain/api-doc/HttpMethodBadge', { method: 'GET', size: 'sm' }) %>
<%- include('modules/domain/api-doc/HttpMethodBadge', { method: 'GET', size: 'md' }) %>
<%- include('modules/domain/api-doc/HttpMethodBadge', { method: 'GET', size: 'lg' }) %>`,
    },
  ],
};

/* ─── SecurityBadge ─── */

const securityBadgeItem: ShowcaseItem = {
  id:          'api-doc-security-badge',
  title:       'SecurityBadge',
  category:    'Domain · API Doc',
  abbr:        'SB',
  description: 'Inline badge representing an API security scheme type with a matching icon and color.',
  filePath:    'modules/domain/api-doc/SecurityBadge.ejs',
  sourceCode:  securityBadgeSource,
  variants: [
    {
      title: 'Scheme types',
      previewHtml: `<div class="flex flex-wrap gap-2 p-4">
  ${schemeBadge('http',          'BearerAuth')}
  ${schemeBadge('apiKey',        'ApiKey')}
  ${schemeBadge('oauth2',        'OAuth2')}
  ${schemeBadge('openIdConnect', 'OpenID')}
  ${schemeBadge('mutualTLS',     'mTLS')}
</div>`,
      code: `<%- include('modules/domain/api-doc/SecurityBadge', { type: 'http',   name: 'BearerAuth' }) %>
<%- include('modules/domain/api-doc/SecurityBadge', { type: 'apiKey', name: 'ApiKey' }) %>
<%- include('modules/domain/api-doc/SecurityBadge', { type: 'oauth2', name: 'OAuth2' }) %>`,
    },
  ],
};

/* ─── SecuritySchemeBadge ─── */

const securitySchemeBadgeItem: ShowcaseItem = {
  id:          'api-doc-security-scheme-badge',
  title:       'SecuritySchemeBadge',
  category:    'Domain · API Doc',
  abbr:        'SS',
  description: 'Badge variant of SecurityBadge that uses the design-system Badge component for consistent styling.',
  filePath:    'modules/domain/api-doc/SecuritySchemeBadge.ejs',
  sourceCode:  securitySchemeBadgeSrc,
  variants: [
    {
      title: 'Pill variants',
      previewHtml: `<div class="flex flex-wrap gap-2 p-4">
  <span class="inline-flex items-center gap-1.5 rounded-full font-medium px-2 py-0.5 text-xs bg-info-subtle text-info-fg border border-info/30"><i class="fa-solid fa-shield-halved text-[10px]" aria-hidden="true"></i>BearerAuth</span>
  <span class="inline-flex items-center gap-1.5 rounded-full font-medium px-2 py-0.5 text-xs bg-warning-subtle text-warning-fg border border-warning/30"><i class="fa-solid fa-key text-[10px]" aria-hidden="true"></i>ApiKey</span>
</div>`,
      code: `<%- include('modules/domain/api-doc/SecuritySchemeBadge', { scheme: { name: 'BearerAuth', type: 'http' } }) %>
<%- include('modules/domain/api-doc/SecuritySchemeBadge', { scheme: { name: 'ApiKey', type: 'apiKey' } }) %>`,
    },
  ],
};

/* ─── ParameterTable ─── */

const parameterTableItem: ShowcaseItem = {
  id:          'api-doc-parameter-table',
  title:       'ParameterTable',
  category:    'Domain · API Doc',
  abbr:        'PT',
  description: 'Table displaying API parameters with location (path/query/header/cookie), type, required flag, and description.',
  filePath:    'modules/domain/api-doc/ParameterTable.ejs',
  sourceCode:  parameterTableSource,
  variants: [
    {
      title: 'Query parameters',
      previewHtml: `<div class="p-4">
  <table class="w-full text-xs border-collapse">
    <thead><tr class="border-b border-border">
      <th class="text-left py-1.5 pr-3 text-text-secondary font-medium">Name</th>
      <th class="text-left py-1.5 pr-3 text-text-secondary font-medium">Type</th>
      <th class="text-left py-1.5 pr-3 text-text-secondary font-medium">Required</th>
      <th class="text-left py-1.5 text-text-secondary font-medium">Description</th>
    </tr></thead>
    <tbody>
      <tr class="border-b border-border/50"><td class="py-1.5 pr-3 font-mono font-semibold text-text-primary">page</td><td class="py-1.5 pr-3 font-mono text-primary">integer</td><td class="py-1.5 pr-3"></td><td class="py-1.5 text-text-secondary">Page number (1-based)</td></tr>
      <tr><td class="py-1.5 pr-3 font-mono font-semibold text-text-primary">pageSize<span class="text-error ml-0.5">*</span></td><td class="py-1.5 pr-3 font-mono text-primary">integer</td><td class="py-1.5 pr-3 text-error text-[10px] font-medium">required</td><td class="py-1.5 text-text-secondary">Items per page</td></tr>
    </tbody>
  </table>
</div>`,
      code: `<%- include('modules/domain/api-doc/ParameterTable', {
  parameters: [
    { parameterId: 'p1', name: 'page',     in: 'query', schema: { type: 'integer' }, description: 'Page number (1-based)' },
    { parameterId: 'p2', name: 'pageSize', in: 'query', required: true, schema: { type: 'integer' }, description: 'Items per page' },
  ]
}) %>`,
    },
  ],
};

/* ─── SchemaViewer ─── */

const schemaViewerItem: ShowcaseItem = {
  id:          'api-doc-schema-viewer',
  title:       'SchemaViewer',
  category:    'Domain · API Doc',
  abbr:        'SV',
  description: 'Interactive JSON Schema tree viewer with type coloring, constraint display, and collapsible nodes.',
  filePath:    'modules/domain/api-doc/SchemaViewer.ejs',
  sourceCode:  schemaViewerSource,
  variants: [
    {
      title: 'Object schema',
      previewHtml: `<div class="p-4">
  <div class="rounded-lg border border-border bg-surface-base text-sm overflow-hidden">
    <div class="p-3 space-y-0.5">
      <div class="flex flex-wrap items-center gap-2 py-0.5 pl-5 text-xs">
        <span class="font-mono font-semibold text-text-primary">id<span class="text-error ml-0.5" title="required">*</span></span>
        <span class="font-mono text-text-secondary">string</span>
        <span class="text-[10px] border rounded px-1 bg-surface-overlay text-text-disabled border-border">read-only</span>
        <span class="text-text-secondary italic">UUID identifier</span>
      </div>
      <div class="flex flex-wrap items-center gap-2 py-0.5 pl-5 text-xs">
        <span class="font-mono font-semibold text-text-primary">name<span class="text-error ml-0.5">*</span></span>
        <span class="font-mono text-success-fg">string</span>
        <span class="text-text-secondary italic">Display name</span>
      </div>
      <div class="flex flex-wrap items-center gap-2 py-0.5 pl-5 text-xs">
        <span class="font-mono font-semibold text-text-primary">price<span class="text-error ml-0.5">*</span></span>
        <span class="font-mono text-primary">number</span>
      </div>
    </div>
  </div>
</div>`,
      code: `<%- include('modules/domain/api-doc/SchemaViewer', {
  schema: {
    type: 'object',
    required: ['id', 'name', 'price'],
    properties: {
      id:    { type: 'string', description: 'UUID identifier', readOnly: true },
      name:  { type: 'string', description: 'Display name' },
      price: { type: 'number' },
    }
  }
}) %>`,
    },
  ],
};

/* ─── CodeSamplePanel ─── */

const codeSamplePanelItem: ShowcaseItem = {
  id:          'api-doc-code-sample-panel',
  title:       'CodeSamplePanel',
  category:    'Domain · API Doc',
  abbr:        'CS',
  description: 'Dark-themed panel showing code samples in multiple languages with tab switching and a one-click copy button.',
  filePath:    'modules/domain/api-doc/CodeSamplePanel.ejs',
  sourceCode:  codeSamplePanelSource,
  variants: [
    {
      title: 'Multi-language samples',
      previewHtml: `<div class="p-4">
  <div class="rounded-lg border border-border overflow-hidden bg-gray-950">
    <div class="flex items-center justify-between gap-2 px-3 py-2 border-b border-white/10">
      <div class="flex gap-1">
        <span class="rounded px-2.5 py-1 text-xs font-medium bg-white/15 text-white">cURL</span>
        <span class="rounded px-2.5 py-1 text-xs font-medium text-white/50">JavaScript</span>
      </div>
      <span class="text-xs text-white/40 hidden sm:block"><i class="fa-solid fa-code text-[10px]" aria-hidden="true"></i> 2 samples</span>
    </div>
    <pre class="overflow-x-auto p-4 text-xs text-white/90 font-mono leading-relaxed"><code>curl -X GET https://api.example.com/users \\
  -H 'Authorization: Bearer &lt;token&gt;'</code></pre>
  </div>
</div>`,
      code: `<%- include('modules/domain/api-doc/CodeSamplePanel', {
  samples: [
    { lang: 'curl',       label: 'cURL',       source: "curl -X GET https://api.example.com/users \\\n  -H 'Authorization: Bearer <token>'" },
    { lang: 'javascript', label: 'JavaScript', source: "const res = await fetch('/users', { headers: { Authorization: 'Bearer <token>' } });" },
  ]
}) %>`,
    },
  ],
};

/* ─── ServerSelector ─── */

const serverSelectorItem: ShowcaseItem = {
  id:          'api-doc-server-selector',
  title:       'ServerSelector',
  category:    'Domain · API Doc',
  abbr:        'SR',
  description: 'Dropdown for selecting the active API server, with environment badges (production, staging, development, sandbox).',
  filePath:    'modules/domain/api-doc/ServerSelector.ejs',
  sourceCode:  serverSelectorSource,
  variants: [
    {
      title: 'Production selected',
      previewHtml: `<div class="p-4 max-w-sm">
  <div class="flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-3 py-2">
    <i class="fa-solid fa-server text-text-disabled text-xs shrink-0" aria-hidden="true"></i>
    <div class="flex-1 min-w-0">
      <p class="font-mono text-xs text-text-primary truncate">https://api.commerce.io/v2</p>
      <p class="text-[10px] text-text-secondary leading-tight">Production</p>
    </div>
    <span class="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium shrink-0 bg-success-subtle text-success-fg">production</span>
  </div>
</div>`,
      code: `<%- include('modules/domain/api-doc/ServerSelector', {
  servers: [
    { serverId: 'srv-prod', url: 'https://api.commerce.io/v2', description: 'Production', environment: 'production' },
    { serverId: 'srv-stg',  url: 'https://staging-api.commerce.io/v2', description: 'Staging', environment: 'staging' },
  ]
}) %>`,
    },
  ],
};

/* ─── ResponseCard ─── */

const responseCardItem: ShowcaseItem = {
  id:          'api-doc-response-card',
  title:       'ResponseCard',
  category:    'Domain · API Doc',
  abbr:        'RC',
  description: 'Collapsible card for a single API response showing the status code, description, and response body schema.',
  filePath:    'modules/domain/api-doc/ResponseCard.ejs',
  sourceCode:  responseCardSource,
  variants: [
    {
      title: '200 OK response',
      previewHtml: `<div class="p-4">
  <details open class="rounded-lg border border-border overflow-hidden group">
    <summary class="flex w-full items-center gap-3 px-4 py-3 text-left bg-surface-raised hover:bg-surface-overlay cursor-pointer list-none focus:outline-none">
      <span class="inline-flex items-center rounded-full font-medium px-2 py-0.5 text-xs bg-success-subtle text-success-fg shrink-0">200</span>
      <span class="flex-1 text-sm text-text-primary">Token issued</span>
      <span class="text-xs text-text-disabled font-mono shrink-0 hidden sm:block">application/json</span>
      <i class="fa-solid fa-chevron-down text-[10px] text-text-disabled shrink-0 group-open:rotate-180 transition-transform" aria-hidden="true"></i>
    </summary>
    <div class="border-t border-border bg-surface-base px-4 py-3">
      <p class="text-xs text-text-disabled italic">Schema rendered here</p>
    </div>
  </details>
</div>`,
      code: `<%- include('modules/domain/api-doc/ResponseCard', {
  response: {
    responseId: 'r-200',
    statusCode: '200',
    description: 'Token issued',
    content: { 'application/json': { schema: { type: 'object' } } }
  }
}) %>`,
    },
  ],
};

/* ─── OperationPanel ─── */

const operationPanelItem: ShowcaseItem = {
  id:          'api-doc-operation-panel',
  title:       'OperationPanel',
  category:    'Domain · API Doc',
  abbr:        'OP',
  description: 'Tabbed panel showing all details of an API operation — parameters, request body, responses, and code samples.',
  filePath:    'modules/domain/api-doc/OperationPanel.ejs',
  sourceCode:  operationPanelSource,
  variants: [
    {
      title: 'GET operation with parameters',
      previewHtml: `<div class="p-4">
  <div class="rounded-xl border border-border bg-surface-base overflow-hidden">
    <div class="px-5 py-4 border-b border-border bg-surface-raised space-y-2">
      <p class="text-sm text-text-secondary">Returns a paginated list of products.</p>
      <div class="flex flex-wrap items-center gap-2">
        <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-surface-sunken text-text-secondary">Products</span>
        <span class="inline-flex items-center gap-1 rounded-full font-medium px-2 py-0.5 text-xs bg-info-subtle text-info-fg"><i class="fa-solid fa-lock text-[10px]" aria-hidden="true"></i>BearerAuth</span>
      </div>
    </div>
    <div class="divide-y divide-border">
      <details open class="group"><summary class="flex items-center gap-3 px-5 py-3 cursor-pointer list-none hover:bg-surface-raised focus:outline-none">
        <i class="fa-solid fa-chevron-right text-[9px] text-text-disabled group-open:rotate-90 transition-transform" aria-hidden="true"></i>
        <span class="text-sm font-semibold text-text-primary">Parameters</span>
        <span class="inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-medium bg-surface-sunken text-text-secondary">3</span>
      </summary></details>
    </div>
  </div>
</div>`,
      code: `<%- include('modules/domain/api-doc/OperationPanel', {
  operation: {
    operationId: 'list-products',
    operationKey: 'list-products',
    method: 'GET',
    tags: ['Products'],
    description: 'Returns a paginated list of products.',
    security: [{ BearerAuth: [] }],
    parameters: [
      { parameterId: 'p1', name: 'page', in: 'query', schema: { type: 'integer' } },
      { parameterId: 'p2', name: 'pageSize', in: 'query', schema: { type: 'integer' } },
      { parameterId: 'p3', name: 'category', in: 'query', schema: { type: 'string' } },
    ],
    responses: [
      { responseId: 'r1', statusCode: '200', description: 'OK' },
    ],
  }
}) %>`,
    },
  ],
};

/* ─── EndpointRow ─── */

const endpointRowItem: ShowcaseItem = {
  id:          'api-doc-endpoint-row',
  title:       'EndpointRow',
  category:    'Domain · API Doc',
  abbr:        'ER',
  description: 'Collapsible row representing a single API endpoint — shows the method badge, path, summary, and expands to an OperationPanel.',
  filePath:    'modules/domain/api-doc/EndpointRow.ejs',
  sourceCode:  endpointRowSource,
  variants: [
    {
      title: 'GET and POST rows',
      previewHtml: `<div class="p-4 space-y-2">
  <div class="rounded-xl border border-border overflow-hidden">
    <div class="flex items-center gap-3 px-4 py-3 bg-surface-raised cursor-pointer">
      <span class="inline-flex items-center rounded border font-mono font-bold uppercase text-xs px-2 py-0.5 bg-success-subtle text-success-fg border-success/30">GET</span>
      <code class="flex-1 truncate font-mono text-sm text-text-primary">/products</code>
      <span class="hidden sm:block text-xs text-text-secondary">List products</span>
      <i class="fa-solid fa-lock text-xs text-text-disabled" aria-label="Requires authentication"></i>
      <i class="fa-solid fa-chevron-down text-[10px] text-text-disabled" aria-hidden="true"></i>
    </div>
  </div>
  <div class="rounded-xl border border-border overflow-hidden">
    <div class="flex items-center gap-3 px-4 py-3 bg-surface-raised cursor-pointer">
      <span class="inline-flex items-center rounded border font-mono font-bold uppercase text-xs px-2 py-0.5 bg-primary-subtle text-primary border-primary/30">POST</span>
      <code class="flex-1 truncate font-mono text-sm text-text-primary">/products</code>
      <span class="hidden sm:block text-xs text-text-secondary">Create product</span>
      <i class="fa-solid fa-lock text-xs text-text-disabled" aria-label="Requires authentication"></i>
      <i class="fa-solid fa-chevron-down text-[10px] text-text-disabled" aria-hidden="true"></i>
    </div>
  </div>
</div>`,
      code: `<%- include('modules/domain/api-doc/EndpointRow', {
  path: '/products',
  operation: {
    operationId: 'list-products',
    operationKey: 'list-products',
    method: 'GET',
    summary: 'List products',
    security: [{ BearerAuth: [] }],
    parameters: [],
    responses: [],
  }
}) %>`,
    },
  ],
};

/* ─── ApiTagSection ─── */

const apiTagSectionItem: ShowcaseItem = {
  id:          'api-doc-api-tag-section',
  title:       'ApiTagSection',
  category:    'Domain · API Doc',
  abbr:        'TS',
  description: 'Collapsible section grouping endpoints under a named tag — the primary navigation unit in API documentation.',
  filePath:    'modules/domain/api-doc/ApiTagSection.ejs',
  sourceCode:  apiTagSectionSource,
  variants: [
    {
      title: 'Products tag section',
      previewHtml: `<div class="p-4">
  <section class="rounded-xl border border-border overflow-hidden">
    <details open class="group">
      <summary class="flex w-full items-center gap-3 px-5 py-4 text-left bg-surface-raised hover:bg-surface-overlay cursor-pointer list-none focus:outline-none group-open:border-b group-open:border-border">
        <i class="fa-solid fa-chevron-down text-text-disabled shrink-0 transition-transform text-xs" aria-hidden="true"></i>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="font-semibold text-text-primary">Products</h3>
            <span class="inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-medium bg-surface-sunken text-text-secondary">4</span>
          </div>
          <p class="text-xs text-text-secondary mt-0.5">Product catalogue — create, read, update, delete</p>
        </div>
      </summary>
      <div class="p-4 space-y-2 bg-surface-base">
        <p class="text-xs text-text-disabled text-center py-2">EndpointRow × 4</p>
      </div>
    </details>
  </section>
</div>`,
      code: `<%- include('modules/domain/api-doc/ApiTagSection', {
  tag: { tagId: 'tag-products', name: 'Products', description: 'Product catalogue — create, read, update, delete' },
  paths: [
    { pathItem: { pathItemId: 'pi-products', path: '/products', operations: [
      { operationId: 'list-products', operationKey: 'list-products', method: 'GET', summary: 'List products', parameters: [], responses: [] },
      { operationId: 'create-product', operationKey: 'create-product', method: 'POST', summary: 'Create product', parameters: [], responses: [] },
    ]}}
  ]
}) %>`,
    },
  ],
};

/* ─── ApiKeyTokenCard ─── */

const apiKeyTokenCardItem: ShowcaseItem = {
  id:          'api-doc-api-key-token-card',
  title:       'ApiKeyTokenCard',
  category:    'Domain · API Doc',
  abbr:        'AT',
  description: 'Card for a single API key — reveal/hide, copy-to-clipboard, env badge, last-used metadata.',
  filePath:    'modules/domain/api-doc/ApiKeyTokenCard.ejs',
  sourceCode:  apiKeyTokenCardSource,
  variants: [
    {
      title: 'Production key with scopes',
      previewHtml: `<div class="p-4 max-w-sm">
  <div class="rounded-xl border border-border bg-surface-raised p-4 flex flex-col gap-3">
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-2 min-w-0">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning-subtle text-warning">
          <span class="w-3.5 h-3.5 inline-flex items-center justify-center"><i class="fa-solid fa-key" aria-hidden="true"></i></span>
        </div>
        <div class="min-w-0">
          <p class="font-semibold text-text-primary truncate">Production key</p>
          <div class="mt-1"><span class="inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-medium bg-success-subtle text-success-fg">production</span></div>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface-base font-mono text-xs text-text-primary">
      <span class="flex-1 truncate select-all" aria-label="API token">••••••••••••••••a1b2</span>
      <button type="button" aria-label="Reveal token" class="inline-flex items-center justify-center w-7 h-7 rounded text-text-secondary hover:text-text-primary hover:bg-surface-overlay"><span class="w-3.5 h-3.5 inline-flex items-center justify-center"><i class="fa-solid fa-eye" aria-hidden="true"></i></span></button>
      <button type="button" aria-label="Copy token" class="inline-flex items-center justify-center w-7 h-7 rounded text-text-secondary hover:text-text-primary hover:bg-surface-overlay"><span class="w-3.5 h-3.5 inline-flex items-center justify-center"><i class="fa-solid fa-copy" aria-hidden="true"></i></span></button>
    </div>
    <dl class="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
      <div><dt class="text-[10px] uppercase tracking-wider text-text-disabled">Created</dt><dd class="text-text-primary">Jan 12, 2026</dd></div>
      <div><dt class="text-[10px] uppercase tracking-wider text-text-disabled">Last used</dt><dd class="text-text-primary">May 20, 2026</dd></div>
    </dl>
    <div class="flex flex-wrap gap-1.5 border-t border-border pt-3">
      <code class="px-1.5 py-0.5 rounded bg-primary-subtle text-primary font-mono text-[11px]">read:products</code>
      <code class="px-1.5 py-0.5 rounded bg-primary-subtle text-primary font-mono text-[11px]">write:orders</code>
    </div>
  </div>
</div>`,
      code: `<%- include('modules/domain/api-doc/ApiKeyTokenCard', {
  name: 'Production key',
  token: 'demo_production_token_REDACTED',
  environment: 'production',
  createdAt: '2026-01-12',
  lastUsedAt: '2026-05-20',
  scopes: ['read:products', 'write:orders']
}) %>`,
    },
    {
      title: 'Staging key with revoke action',
      previewHtml: `<div class="p-4 max-w-sm">
  <div class="rounded-xl border border-border bg-surface-raised p-4 flex flex-col gap-3">
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-2 min-w-0">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning-subtle text-warning">
          <span class="w-3.5 h-3.5 inline-flex items-center justify-center"><i class="fa-solid fa-key" aria-hidden="true"></i></span>
        </div>
        <div class="min-w-0">
          <p class="font-semibold text-text-primary truncate">Staging key</p>
          <div class="mt-1"><span class="inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-medium bg-warning-subtle text-warning-fg">staging</span></div>
        </div>
      </div>
      <button type="button" class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-error border border-error/40 hover:bg-error-subtle"><span class="w-3 h-3 inline-flex items-center justify-center"><i class="fa-solid fa-trash" aria-hidden="true"></i></span>Revoke</button>
    </div>
    <div class="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface-base font-mono text-xs text-text-primary">
      <span class="flex-1 truncate select-all">••••••••••••9z8y</span>
      <button type="button" aria-label="Reveal token" class="inline-flex items-center justify-center w-7 h-7 rounded text-text-secondary"><span class="w-3.5 h-3.5 inline-flex items-center justify-center"><i class="fa-solid fa-eye" aria-hidden="true"></i></span></button>
      <button type="button" aria-label="Copy token" class="inline-flex items-center justify-center w-7 h-7 rounded text-text-secondary"><span class="w-3.5 h-3.5 inline-flex items-center justify-center"><i class="fa-solid fa-copy" aria-hidden="true"></i></span></button>
    </div>
    <dl class="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
      <div><dt class="text-[10px] uppercase tracking-wider text-text-disabled">Created</dt><dd class="text-text-primary">Apr 1, 2026</dd></div>
      <div><dt class="text-[10px] uppercase tracking-wider text-text-disabled">Last used</dt><dd class="text-text-primary">Never</dd></div>
    </dl>
  </div>
</div>`,
      code: `<%- include('modules/domain/api-doc/ApiKeyTokenCard', {
  name: 'Staging key',
  token: 'demo_staging_token_REDACTED',
  environment: 'staging',
  createdAt: '2026-04-01',
  lastUsedAt: null,
  onRevoke: true
}) %>`,
    },
  ],
};

/* ─── AuthSchemeCard ─── */

const authSchemeCardItem: ShowcaseItem = {
  id:          'api-doc-auth-scheme-card',
  title:       'AuthSchemeCard',
  category:    'Domain · API Doc',
  abbr:        'AK',
  description: 'Selectable card describing a single auth scheme (apiKey, http, oauth2, openIdConnect, mutualTLS).',
  filePath:    'modules/domain/api-doc/AuthSchemeCard.ejs',
  sourceCode:  authSchemeCardSource,
  variants: [
    {
      title: 'OAuth 2.0 recommended scheme',
      previewHtml: `<div class="p-4 max-w-md">
  <a href="#" class="block rounded-xl border border-border bg-surface-raised p-4 text-left transition-shadow hover:shadow-md hover:border-border-focus">
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-3 min-w-0">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary">
          <span class="w-4 h-4 inline-flex items-center justify-center"><i class="fa-solid fa-shield" aria-hidden="true"></i></span>
        </div>
        <div class="min-w-0">
          <p class="font-semibold text-text-primary truncate">OAuth 2.0</p>
          <div class="mt-1 flex flex-wrap items-center gap-1.5">
            <span class="inline-flex items-center gap-1.5 rounded-full font-medium px-2 py-0.5 text-xs bg-primary-subtle text-primary border border-primary/30"><i class="fa-solid fa-circle-check text-[10px]" aria-hidden="true"></i>oauth2</span>
            <span class="inline-flex items-center rounded-full px-1.5 py-0 text-[10px] font-medium bg-success-subtle text-success-fg">Recommended</span>
          </div>
        </div>
      </div>
      <i class="fa-solid fa-arrow-right text-[13px] text-text-disabled mt-1" aria-hidden="true"></i>
    </div>
    <p class="mt-3 text-sm text-text-secondary leading-relaxed">Authorization Code flow with PKCE — preferred for user-facing apps.</p>
    <dl class="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-border pt-3">
      <div><dt class="text-[10px] uppercase tracking-wider text-text-disabled">Client ID</dt><dd class="text-xs text-text-primary font-mono break-words">prod_client_42</dd></div>
      <div><dt class="text-[10px] uppercase tracking-wider text-text-disabled">Scopes</dt><dd class="text-xs text-text-primary font-mono break-words">read write</dd></div>
    </dl>
  </a>
</div>`,
      code: `<%- include('modules/domain/api-doc/AuthSchemeCard', {
  name: 'OAuth 2.0',
  type: 'oauth2',
  recommended: true,
  description: 'Authorization Code flow with PKCE — preferred for user-facing apps.',
  metaItems: [
    { label: 'Client ID', value: 'prod_client_42' },
    { label: 'Scopes',    value: 'read write' },
  ],
  href: '/auth/oauth2'
}) %>`,
    },
    {
      title: 'API Key static scheme',
      previewHtml: `<div class="p-4 max-w-md">
  <div class="block rounded-xl border border-border bg-surface-raised p-4 text-left">
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-3 min-w-0">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary">
          <span class="w-4 h-4 inline-flex items-center justify-center"><i class="fa-solid fa-key" aria-hidden="true"></i></span>
        </div>
        <div class="min-w-0">
          <p class="font-semibold text-text-primary truncate">X-API-Key</p>
          <div class="mt-1 flex flex-wrap items-center gap-1.5">
            <span class="inline-flex items-center gap-1.5 rounded-full font-medium px-2 py-0.5 text-xs bg-warning-subtle text-warning-fg border border-warning/30"><i class="fa-solid fa-key text-[10px]" aria-hidden="true"></i>apiKey</span>
          </div>
        </div>
      </div>
    </div>
    <p class="mt-3 text-sm text-text-secondary leading-relaxed">Static header-based key for server-to-server integrations.</p>
  </div>
</div>`,
      code: `<%- include('modules/domain/api-doc/AuthSchemeCard', {
  name: 'X-API-Key',
  type: 'apiKey',
  description: 'Static header-based key for server-to-server integrations.'
}) %>`,
    },
  ],
};

/* ─── OAuthFlowDiagram ─── */

const oauthFlowDiagramItem: ShowcaseItem = {
  id:          'api-doc-oauth-flow-diagram',
  title:       'OAuthFlowDiagram',
  category:    'Domain · API Doc',
  abbr:        'OF',
  description: 'Visual walkthrough of an OAuth 2.0 flow with actors, numbered steps, endpoints, and scopes.',
  filePath:    'modules/domain/api-doc/OAuthFlowDiagram.ejs',
  sourceCode:  oauthFlowDiagramSource,
  variants: [
    {
      title: 'Authorization Code flow',
      previewHtml: `<div class="p-4 max-w-md">
  <div class="rounded-xl border border-border bg-surface-raised p-4 flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-text-disabled">OAuth 2.0 Flow</p>
        <p class="text-base font-semibold text-text-primary mt-0.5">Authorization Code</p>
      </div>
      <span class="inline-flex items-center gap-1 rounded-full font-medium px-1.5 py-0 text-[10px] bg-primary-subtle text-primary"><span class="w-3 h-3 inline-flex items-center justify-center"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i></span>authorizationCode</span>
    </div>
    <div class="flex items-center justify-between gap-2 px-2 py-3 bg-surface-base rounded-lg border border-border">
      <div class="flex flex-col items-center gap-1 min-w-0"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-primary"><i class="fa-solid fa-user text-[13px]" aria-hidden="true"></i></span><span class="text-[10px] font-medium text-text-secondary truncate">User</span></div>
      <i class="fa-solid fa-arrow-right text-[11px] text-text-disabled" aria-hidden="true"></i>
      <div class="flex flex-col items-center gap-1 min-w-0"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-primary"><i class="fa-solid fa-server text-[13px]" aria-hidden="true"></i></span><span class="text-[10px] font-medium text-text-secondary truncate">Your App</span></div>
      <i class="fa-solid fa-arrow-right text-[11px] text-text-disabled" aria-hidden="true"></i>
      <div class="flex flex-col items-center gap-1 min-w-0"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-primary"><i class="fa-solid fa-shield-halved text-[13px]" aria-hidden="true"></i></span><span class="text-[10px] font-medium text-text-secondary truncate">Auth Server</span></div>
    </div>
    <ol class="space-y-1.5">
      <li class="flex items-start gap-2 text-sm text-text-primary"><span class="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-subtle text-primary text-[10px] font-bold font-mono">1</span><span>User clicks "Sign in"</span></li>
      <li class="flex items-start gap-2 text-sm text-text-primary"><span class="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-subtle text-primary text-[10px] font-bold font-mono">2</span><span>Redirect to /authorize</span></li>
      <li class="flex items-start gap-2 text-sm text-text-primary"><span class="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-subtle text-primary text-[10px] font-bold font-mono">3</span><span>User grants consent</span></li>
      <li class="flex items-start gap-2 text-sm text-text-primary"><span class="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-subtle text-primary text-[10px] font-bold font-mono">4</span><span>Code returned to app</span></li>
      <li class="flex items-start gap-2 text-sm text-text-primary"><span class="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-subtle text-primary text-[10px] font-bold font-mono">5</span><span>Exchange code for token</span></li>
    </ol>
    <dl class="border-t border-border pt-3 space-y-1.5">
      <div class="flex items-baseline gap-2"><dt class="shrink-0 text-[10px] uppercase tracking-wider text-text-disabled w-32">Authorization URL</dt><dd class="font-mono text-xs text-text-primary break-all">https://auth.example.com/authorize</dd></div>
      <div class="flex items-baseline gap-2"><dt class="shrink-0 text-[10px] uppercase tracking-wider text-text-disabled w-32">Token URL</dt><dd class="font-mono text-xs text-text-primary break-all">https://auth.example.com/token</dd></div>
    </dl>
    <div class="border-t border-border pt-3">
      <p class="text-[10px] uppercase tracking-wider text-text-disabled mb-2">Available scopes</p>
      <ul class="space-y-1">
        <li class="flex items-start gap-2 text-xs"><i class="fa-solid fa-circle-check text-[11px] text-success mt-0.5 shrink-0" aria-hidden="true"></i><div class="min-w-0"><code class="font-mono text-text-primary font-semibold">read</code><span class="text-text-secondary"> &mdash; Read access</span></div></li>
        <li class="flex items-start gap-2 text-xs"><i class="fa-solid fa-circle-check text-[11px] text-success mt-0.5 shrink-0" aria-hidden="true"></i><div class="min-w-0"><code class="font-mono text-text-primary font-semibold">write</code><span class="text-text-secondary"> &mdash; Write access</span></div></li>
      </ul>
    </div>
  </div>
</div>`,
      code: `<%- include('modules/domain/api-doc/OAuthFlowDiagram', {
  flow: 'authorizationCode',
  authorizationUrl: 'https://auth.example.com/authorize',
  tokenUrl:         'https://auth.example.com/token',
  scopes: [
    { name: 'read',  description: 'Read access' },
    { name: 'write', description: 'Write access' },
  ]
}) %>`,
    },
    {
      title: 'Client Credentials flow',
      previewHtml: `<div class="p-4 max-w-md">
  <div class="rounded-xl border border-border bg-surface-raised p-4 flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-text-disabled">OAuth 2.0 Flow</p>
        <p class="text-base font-semibold text-text-primary mt-0.5">Client Credentials</p>
      </div>
      <span class="inline-flex items-center gap-1 rounded-full font-medium px-1.5 py-0 text-[10px] bg-primary-subtle text-primary"><span class="w-3 h-3 inline-flex items-center justify-center"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i></span>clientCredentials</span>
    </div>
    <div class="flex items-center justify-between gap-2 px-2 py-3 bg-surface-base rounded-lg border border-border">
      <div class="flex flex-col items-center gap-1 min-w-0"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-primary"><i class="fa-solid fa-user text-[13px]" aria-hidden="true"></i></span><span class="text-[10px] font-medium text-text-secondary truncate">User</span></div>
      <i class="fa-solid fa-arrow-right text-[11px] text-text-disabled" aria-hidden="true"></i>
      <div class="flex flex-col items-center gap-1 min-w-0"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-primary"><i class="fa-solid fa-server text-[13px]" aria-hidden="true"></i></span><span class="text-[10px] font-medium text-text-secondary truncate">Your App</span></div>
      <i class="fa-solid fa-arrow-right text-[11px] text-text-disabled" aria-hidden="true"></i>
      <div class="flex flex-col items-center gap-1 min-w-0"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-primary"><i class="fa-solid fa-shield-halved text-[13px]" aria-hidden="true"></i></span><span class="text-[10px] font-medium text-text-secondary truncate">Auth Server</span></div>
    </div>
    <ol class="space-y-1.5">
      <li class="flex items-start gap-2 text-sm text-text-primary"><span class="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-subtle text-primary text-[10px] font-bold font-mono">1</span><span>App authenticates with client ID + secret</span></li>
      <li class="flex items-start gap-2 text-sm text-text-primary"><span class="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-subtle text-primary text-[10px] font-bold font-mono">2</span><span>POST to /token</span></li>
      <li class="flex items-start gap-2 text-sm text-text-primary"><span class="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-subtle text-primary text-[10px] font-bold font-mono">3</span><span>Access token returned</span></li>
    </ol>
    <dl class="border-t border-border pt-3 space-y-1.5">
      <div class="flex items-baseline gap-2"><dt class="shrink-0 text-[10px] uppercase tracking-wider text-text-disabled w-32">Token URL</dt><dd class="font-mono text-xs text-text-primary break-all">https://auth.example.com/token</dd></div>
    </dl>
  </div>
</div>`,
      code: `<%- include('modules/domain/api-doc/OAuthFlowDiagram', {
  flow: 'clientCredentials',
  tokenUrl: 'https://auth.example.com/token'
}) %>`,
    },
  ],
};

/* ─── Builder ─── */

export function buildApiDocDomainData(): ShowcaseItem[] {
  return [
    statusCodeBadgeItem,
    httpMethodBadgeItem,
    securityBadgeItem,
    securitySchemeBadgeItem,
    parameterTableItem,
    schemaViewerItem,
    codeSamplePanelItem,
    serverSelectorItem,
    responseCardItem,
    operationPanelItem,
    endpointRowItem,
    apiTagSectionItem,
    apiKeyTokenCardItem,
    authSchemeCardItem,
    oauthFlowDiagramItem,
  ];
}
