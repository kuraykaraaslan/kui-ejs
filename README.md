# kui-ejs

A server-rendered EJS / Express / Tailwind 4 component library organised the same way as its React sibling [`kui-react`](../01_NextJS_Components/) — atoms → molecules → organisms → app patterns → industry-vertical domain partials → full-page theme demos. Every partial is **copy-paste-ready** from the live showcase; no npm install required.

> **AI assistants:** start at `/llms.txt` or fetch `/api/registry` for a machine-readable catalog of every partial. See the [AI agent quick reference](#ai-agent-quick-reference) below.

## Stack

Node.js 20+ · Express 4 · EJS 3 + express-ejs-layouts · TypeScript 5 · Tailwind CSS 4 · PostCSS pipeline · Font Awesome 6 Free (CDN) · Helmet · Zod

## Quick start

```bash
npm install
npm run dev          # http://localhost:3003
```

`npm run dev` runs the Express server (with auto-reload) and the PostCSS/Tailwind watcher in parallel.

## Theme demos

Five full-page demos — one per industry vertical — built entirely from the partial library.

<table>
  <tr>
    <td align="center"><b>API docs</b><br/><img src="https://raw.githubusercontent.com/kuraykaraaslan/kui-ejs/main/public/assets/img/screenshot-api-doc.png" alt="API docs" width="380"/></td>
    <td align="center"><b>Common (auth / account)</b><br/><img src="https://raw.githubusercontent.com/kuraykaraaslan/kui-ejs/main/public/assets/img/screenshot-common.png" alt="Common" width="380"/></td>
  </tr>
  <tr>
    <td align="center"><b>Invoice</b><br/><img src="https://raw.githubusercontent.com/kuraykaraaslan/kui-ejs/main/public/assets/img/screenshot-invoice.png" alt="Invoice" width="380"/></td>
    <td align="center"><b>Modem / UPS dashboard</b><br/><img src="https://raw.githubusercontent.com/kuraykaraaslan/kui-ejs/main/public/assets/img/screenshot-modem.png" alt="Modem / UPS dashboard" width="380"/></td>
  </tr>
</table>

---

## Module layers

```
modules/
├── ui/           ← ~29 primitive EJS partials (atoms + molecules)
├── app/          ← ~16 application patterns (shells, navigation, states)
└── domain/       ← Industry verticals: common, modem, invoice, ups, api-doc
views/
├── layouts/      ← main.ejs, blank.ejs
├── partials/     ← shared _head, _navbar, _footer, _flash, _theme_toggle
├── showcase/     ← live preview site + interactive playground
└── theme/        ← 5 full-page theme demos, one per domain vertical
src/
├── app.ts        ← Express setup, middleware, route mounting
├── server.ts     ← Entry point
├── data/         ← Showcase manifest + per-section builders
├── registry/     ← AI-discoverability layer — machine-readable catalog builder
├── routes/       ← Showcase + /api + /theme + per-theme routers
└── types/        ← Shared TypeScript types
public/
└── assets/css/   ← Tailwind source (input.css) + compiled output
```

## Using a partial (copy-paste path)

1. Browse the live showcase, pick a partial.
2. Open the variant you want, copy its source.
3. Drop the `.ejs` file into your project under a matching `modules/` path.
4. Read the partial's `composes[]` field in the registry to know what other partials to include.

## Using a partial (in-tree path)

```ejs
<%- include('modules/ui/Avatar', { name, size: 'md' }) %>
<%- include('modules/ui/Button', { label: 'Submit', variant: 'primary' }) %>
<%- include('modules/domain/common/auth/LoginForm', { providers, returnUrl }) %>
<%- include('../../partials/_head') %>
```

## AI agent quick reference

This library ships a first-class machine-readable surface for AI tools — HTTP endpoints, static snapshots, an MCP server, and editor rule files for every major AI coding assistant.

### HTTP endpoints

| Resource | URL / Path | Purpose |
|---|---|---|
| Concise overview | [`/llms.txt`](public/llms.txt) | One-page TL;DR following the llms.txt convention |
| Full registry (JSON) | `GET /api/registry` | Every partial with full EJS source, variants, status, tokens |
| Index registry (JSON) | `GET /api/registry?index=1` | Same data minus `source` — ~5x smaller for search |
| Long-form markdown | `GET /llms-full.txt` | Flattened markdown of every partial — paste into a context window |
| JSON Schema | [`/schemas/registry-v1.json`](public/schemas/registry-v1.json) | Validate registry payloads or generate typed clients |
| Offline JSON snapshot | [`/registry/components.json`](public/registry/components.json) | Pre-built static catalog — works without dev server (`npm run registry:snapshot`) |
| Per-partial markdown | `/components/<id>.md` | One file per partial — chunk-friendly retrieval |
| Partial index | [`/components/_index.json`](public/components/_index.json) | id → filename map for the markdown chunks |
| Registry source | [`src/registry/registry.ts`](src/registry/registry.ts) | Derives the catalog from showcase data |

The registry includes for every partial: id, layer, category, file path, description, status, since, full EJS source, every variant, design tokens consumed, accessibility metadata, dependencies, and (where authored) when-to-use guidance.

### MCP server (Claude Desktop / Cursor / Cline / Windsurf / Zed)

Zero-dependency stdio MCP server defined in [`.mcp.json`](.mcp.json). Tools exposed:

- `list_components` · `get_component` · `search_components`
- `list_themes` · `get_conventions` · `list_design_tokens`
- `read_file` (sandboxed to the repository root)

The server reads `public/registry/components.json` so it works offline. Refresh with `npm run registry:snapshot`. Run standalone with `npm run mcp:server`.

### Editor rule files (canonical: [`AGENTS.md`](AGENTS.md))

| File | Tool |
|---|---|
| [`.cursor/rules/kui-ejs.mdc`](.cursor/rules/kui-ejs.mdc) | Cursor (modern) |
| [`.cursorrules`](.cursorrules) | Cursor (legacy) |
| [`.windsurfrules`](.windsurfrules) | Windsurf |
| [`.github/copilot-instructions.md`](.github/copilot-instructions.md) | GitHub Copilot |
| [`.clinerules`](.clinerules) | Cline / Continue.dev |

## Adding a partial

1. Choose the right layer (`modules/ui/`, `modules/app/`, or `modules/domain/<vertical>/`).
2. Author the `.ejs` file. Follow the rules in [`AGENTS.md`](AGENTS.md): semantic HTML, prefer `<%= %>` over `<%- %>`, use design tokens (never raw hex), include Font Awesome icons with `aria-hidden="true"`.
3. Add a showcase entry under `src/data/sections/` with at least 2 variants.
4. Wire the builder into `src/data/showcase.data.ts`.
5. Register in `src/data/showcase.menu.ts`.

## Adding a theme

1. Create views: `views/theme/<vertical>/index.ejs` plus any sub-pages.
2. Create data file: `src/data/<vertical>.data.ts`.
3. Create route file: `src/routes/themes/<vertical>.ts`.
4. Register the router in `src/routes/themes.ts`.
5. Register metadata in the showcase menu so it appears in the sidebar.

See **Adding a New Theme** in [`AGENTS.md`](AGENTS.md) for the full step order.

## Scripts

```bash
npm run dev            # development (server + CSS watcher in parallel)
npm run build          # production build (CSS then TypeScript → dist/)
npm start              # production server (runs dist/server.js)
npm run audit:tokens   # validates CSS token usage (no raw hex outside allowlist)
npm run audit:raw      # enforces the <%- %> allowlist (docs/raw-output-allowlist.md)
npm run lint:spacing   # rejects arbitrary px values in spacing utilities
npm run dead-partials  # scans for partials with zero include() refs
npm run screenshots    # Puppeteer-based visual capture
npm run registry:snapshot  # write offline JSON + per-partial markdown to public/
npm run mcp:server         # start the stdio MCP server (used by .mcp.json)
npm run ci             # build + all audit/lint scripts
```

## Conventions

- **Layouts:** `layouts/main` for showcase pages, `layouts/blank` for theme demos with self-contained chrome.
- **Data:** sample data in `src/data/<vertical>.data.ts`, never inline in views or routes.
- **Static only:** no real API calls or database queries — themes use static TypeScript data.
- **Escaping:** `<%= %>` for any user-controlled value; `<%- %>` reserved for trusted EJS includes (audited in [`docs/raw-output-allowlist.md`](docs/raw-output-allowlist.md)).

## Contributing

See [`AGENTS.md`](AGENTS.md) for the deep authoring rules. Pull requests should pass `npm run ci` (build + token audit + raw-output audit + spacing lint + dead-partial scan).

## License

0BSD — see [`LICENSE`](LICENSE).
