# modules/domain/api-doc — API Documentation Components

EJS partials for OpenAPI / REST API documentation pages: endpoint rows, operation panels, schema viewers, parameter tables, auth scheme cards, response cards.

## Files

```
ApiKeyTokenCard.ejs        ApiTagSection.ejs       AuthSchemeCard.ejs
CodeSamplePanel.ejs        EndpointRow.ejs         HttpMethodBadge.ejs
OAuthFlowDiagram.ejs       OperationPanel.ejs      ParameterTable.ejs
ResponseCard.ejs           SchemaViewer.ejs        SecurityBadge.ejs
SecuritySchemeBadge.ejs    ServerSelector.ejs      StatusCodeBadge.ejs
```

## Parity

Shared with NextJS: yes — counterpart is `/home/kuray/01_NextJS_Components/modules/domains/api-doc/`. Names, props (locals), and DOM must match the React versions pixel-for-pixel.

## Conventions

1. **Header destructure** — `<% const { endpoint, method = 'GET', ... } = locals; %>`.
2. **Icons** — Font Awesome: `<i class="fa-solid fa-lock" aria-hidden="true"></i>`.
3. **React state → vanilla IIFE** — expand/collapse, tab switching, copy-to-clipboard live in scoped `(function(){ ... })()` blocks.
4. **Shared Tailwind tokens** — HTTP-method colors map to `bg-success` / `bg-info` / `bg-warning` / `bg-error` (see `HttpMethodBadge`), never raw hex.
5. **Code samples** — wrap in `<pre><code>` with a class hook for client-side highlighting; never trust raw user input.

## See also

- Repo conventions: [`/home/kuray/02_EJS_Components/AGENTS.md`](../../../AGENTS.md)
- Parity contract & pixel-perfect rule: `../../../../00_Config_and_AI_Rules`
