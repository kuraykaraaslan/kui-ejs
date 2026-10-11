# Phases (docs/phases)

Planned work for kui-ejs. The shared plan for the KUI repositories lives in kui-react (`$KUIREACT_ROOT/docs/phases/`): phases 0-9 cover both web repos and are tracked there, so their tasks are not copied here. This folder holds the kui-ejs side of every phase that adds work specific to kui-ejs, starting with phase 10.

Path keys resolve through `internal-ai-rules/LOCAL_PATHS.json`. Never hardcode absolute paths in these docs.

## Phases

| # | File | Goal | Canonical plan |
|---|---|---|---|
| 10 | [10-ecosystem-gap-closure.md](10-ecosystem-gap-closure.md) | The kui-ejs share of the gaps found against five reference libraries: palette presets, primitives, cookie consent, and the drift between the three KUI repos | `$KUIREACT_ROOT/docs/phases/10-ecosystem-gap-closure.md` |

## Rules for every phase here

1. The canonical spec for a shared item is the kui-react phase file. If the two disagree, kui-react wins; fix this file.
2. **Parity is not all-or-nothing** (see `AGENTS.md`, "Parity with kui-react"). A task exists here only if the item belongs in kui-ejs. React-only verticals (landing, commerce, blog, ai and the rest) get no tasks here; widening that scope is ADR 0008 in kui-react.
3. **Pixel-perfect when mirrored.** Same rendered DOM shape and class names, same local names and defaults, same token names and values as the kui-react component (ADR 0003, `$KUIREACT_ROOT/docs/adr/0003-react-ejs-parity-contract.md`).
4. **Everything added shows in the demo shell.** A showcase section file in `src/data/sections/` (at least two variants, titles identical to kui-react), an entry in `src/data/showcase.menu.ts` in the same group, then `npm run registry:snapshot` and commit the regenerated catalog. Themes also get a route in `src/routes/themes/` and a view folder in `views/theme/`.
5. Tick a checkbox only when the task is merged on `main`; append the short commit hash. If a task proves wrong, strike it through with one line of reasoning instead of deleting it.
6. Authoring rules still apply: tokens only (`npm run audit:tokens`), escaped output (`npm run audit:raw`), spacing scale (`npm run lint:spacing`), no dead partials (`npm run dead-partials`).

Status legend: `[ ]` not started · `[~]` in progress · `[x]` merged on `main`.
