# GitHub Copilot instructions — kui-ejs

> Canonical source: [AGENTS.md](../AGENTS.md). When this file and AGENTS.md disagree, AGENTS.md wins.

This is a **server-rendered Express + EJS** boilerplate, not a SPA. Conventions differ from Copilot's training defaults. Use the AI-facing catalog below before suggesting code.

## Discovery before generation

| Endpoint | Purpose |
| --- | --- |
| `/api/registry?index=1` | Full catalog (no source) — ~5x smaller, fast to scan |
| `/api/registry` | Full catalog with inline EJS source per partial |
| `/llms-full.txt` | Markdown dump for context windows |
| `public/registry/components.json` | Offline static snapshot |
| `public/components/<id>.md` | One markdown file per partial for chunked retrieval |

Filter `components[]` by `layer` (`ui` \| `app` \| `domain` \| `theme`), `category`, `name`, or `filePath`. Use `composes[]` recursively to find include dependencies; `usedBy[]` is the inverse index.

## Hard rules

1. **Server-rendered Express + EJS only.** No React, no Vue, no htmx, no Alpine, no SPA bundling.
2. **`<%= value %>`** for user-facing data (HTML-escaped). **`<%- html %>`** only for trusted EJS includes or pre-built HTML — every site must be enumerated in `docs/raw-output-allowlist.md`.
3. **`<%- include('partials/foo', locals) %>`** for partial includes. Paths are relative to the current view.
4. **Token-only styling.** `bg-primary`, `text-text-secondary`, `border-border-focus`. Never raw hex / rgb / hsl in partials.
5. **Font Awesome via CDN only.** `<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>`. No inline SVG, no other icon libraries.
6. **Accessibility on every interactive element:**
   - `aria-hidden="true"` on decorative icons
   - `aria-label` on icon-only interactive elements
   - Semantic HTML (`<button>`, `<a>`, correct `<input type>`)
   - `focus-visible:ring-2 focus-visible:ring-border-focus`
7. **All sample data in `src/data/<vertical>.data.ts`** — never inside routes or views.
8. **Static data only** — no real API or DB calls in themes.

## Where new code goes

- Primitive partial → `modules/ui/`
- Composed UI partial → `modules/ui/`
- App shell / nav / state placeholder → `modules/app/`
- Industry-specific partial → `modules/domain/<vertical>/`
- Full multi-page theme → `views/theme/<vertical>/` + `src/routes/themes/<vertical>.ts` + `src/data/<vertical>.data.ts` + register in `src/routes/themes.ts` + add to `src/data/showcase.menu.ts`

## Don't

- Don't use `<%- %>` for user-provided strings (XSS).
- Don't install client-side UI frameworks.
- Don't put real data fetching in views.
- Don't bypass the design tokens.
