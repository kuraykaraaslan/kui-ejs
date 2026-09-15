# Raw HTML Output Allowlist (`<%- %>`)

## Why This Document Exists

In EJS, `<%- expression %>` outputs the value **without HTML-escaping**. If the
expression ever contains user-supplied data, an attacker can inject arbitrary
HTML and JavaScript — a classic Cross-Site Scripting (XSS) vulnerability.

The safe default is `<%= expression %>`, which HTML-escapes every character that
has special meaning in HTML (`<`, `>`, `"`, `&`, etc.).

Every `<%- %>` usage is therefore a deliberate exception that **must be reviewed
and justified**. This file is the permanent audit trail: it lists every raw
output site found in `views/` and `modules/`, explains why each one is safe, and
describes the CI enforcement script that keeps the list up to date.

---

## Justification Categories

| Category | Meaning |
|---|---|
| **developer-controlled** | Value originates from a TypeScript data file (`src/data/*.ts`) or is a constant set by a module at render time — never from user input, request parameters, or an external API. |
| **express-ejs-layouts body** | The `<%- body %>` placeholder is the layout system's content injection point. `express-ejs-layouts` populates it from another trusted EJS template; it is never sourced from user input. |
| **slot / composition** | The value is a pre-rendered HTML string produced by *another EJS partial* and passed down as a slot (e.g., `logoContent`, `children`, `navContent`). It originates in a trusted template, not user input. |
| **pre-escaped** | The value is explicitly URL-encoded with `encodeURIComponent()` before rendering, so any HTML special characters are percent-encoded and cannot break out of their HTML attribute context. |
| **developer-controlled code display** | The value is source code or HTML stored in TypeScript data files for display in a syntax-highlighted `<code>` block. It is not user-supplied; it is part of the static component showcase data. |
| **developer-controlled JS config** | The value is a simple scalar (number, string ID, coordinate) read from a TypeScript data file and interpolated into an inline `<script>` block. It is never user-supplied. |
| **EJS include** | `<%- include('path') %>` loads another trusted EJS template file from the filesystem. No user data flows through the path argument; all dynamic values are passed as a local-variable object and escaped normally inside the included template. |

---

## Raw Output Sites (non-include)

These 58 sites use `<%- %>` without `include()`. Each entry shows the file,
line number, the expression rendered raw, and its justification.

### `modules/app/`

| File | Line | Expression | Category | Justification |
|---|---|---|---|---|
| `modules/app/AppCommandBar.ejs` | 26 | `locals.trigger` | slot / composition | HTML snippet built by a parent EJS template and passed as a slot; never user input. |
| `modules/app/AppFooter.ejs` | 13 | `locals.logoContent` | slot / composition | Logo HTML built by the calling template; never user input. |
| `modules/app/AppFooter.ejs` | 19 | `locals.navContent` | slot / composition | Navigation HTML built by the calling template; never user input. |
| `modules/app/AppFooter.ejs` | 30 | `locals.socialContent` | slot / composition | Social-icon HTML built by the calling template; never user input. |
| `modules/app/AppNav.ejs` | 19 | `locals.logoContent` | slot / composition | Logo HTML built by the calling template; never user input. |
| `modules/app/AppNav.ejs` | 32 | `locals.children` | slot / composition | Action-button HTML built by the calling template; never user input. |
| `modules/app/AppShell.ejs` | 14 | `locals.logoContent` | slot / composition | Logo HTML built by the calling template; never user input. |
| `modules/app/AppShell.ejs` | 18 | `locals.sidebarContent` | slot / composition | Sidebar HTML built by the calling template; never user input. |
| `modules/app/AppShell.ejs` | 33 | `locals.topbarContent` | slot / composition | Topbar HTML built by the calling template; never user input. |
| `modules/app/AppShell.ejs` | 37 | `locals.children \|\| ''` | slot / composition | Page body HTML built by the calling template; never user input. |
| `modules/app/AppSidebar.ejs` | 62 | `locals.footerContent` | slot / composition | Sidebar footer HTML built by the calling template; never user input. |
| `modules/app/AppTopBar.ejs` | 3 | `locals.logoContent` | slot / composition | Logo HTML built by the calling template; never user input. |
| `modules/app/AppTopBar.ejs` | 5 | `locals.children \|\| ''` | slot / composition | Topbar child HTML built by the calling template; never user input. |
| `modules/app/DetailHeader.ejs` | 25 | `locals.badgeContent` | slot / composition | Badge HTML built by the calling template; never user input. |
| `modules/app/DetailHeader.ejs` | 30 | `locals.actionsContent` | slot / composition | Action-button HTML built by the calling template; never user input. |
| `modules/app/Form.ejs` | 19 | `locals.children \|\| ''` | slot / composition | Form-field HTML built by the calling template; never user input. |
| `modules/app/Form.ejs` | 24 | `locals.actionsContent` | slot / composition | Form-action HTML built by the calling template; never user input. |
| `modules/app/SplashScreen.ejs` | 13 | `locals.logoContent` | slot / composition | Logo HTML built by the calling template; never user input. |

### `modules/domain/common/`

| File | Line | Expression | Category | Justification |
|---|---|---|---|---|
| `modules/domain/common/charts/Charts.ejs` | 28 | `type` | developer-controlled JS config | Chart type string (e.g., `'bar'`, `'line'`) from a TypeScript data file, interpolated into an inline `<script>` block. Never user-supplied. |
| `modules/domain/common/i18n/DirectionProvider.ejs` | 7 | `locals.children \|\| ''` | slot / composition | Page content HTML passed by the calling template; never user input. |
| `modules/domain/common/user/UserProfileCard.ejs` | 26 | `locals.actionsHtml` | slot / composition | Action-button HTML built by the calling template; never user input. |

### `modules/ui/`

| File | Line | Expression | Category | Justification |
|---|---|---|---|---|
| `modules/ui/BrandLogo.ejs` | 15 | `locals.children` | slot / composition | Logo inner HTML (typically a single letter or SVG) built by the calling template; never user input. |
| `modules/ui/Button.ejs` | 53 | `locals.iconLeft` | slot / composition | Icon HTML (Font Awesome `<i>` tag) built by the calling template; never user input. |
| `modules/ui/Button.ejs` | 56 | `locals.iconRight` | slot / composition | Icon HTML built by the calling template; never user input. |
| `modules/ui/Card.ejs` | 36 | `_headerRight` | slot / composition | Card header-right HTML built by the calling template; never user input. |
| `modules/ui/Card.ejs` | 40 | `locals.children` | slot / composition | Card body HTML built by the calling template; never user input. |
| `modules/ui/Card.ejs` | 43 | `_footer` | slot / composition | Card footer HTML built by the calling template; never user input. |
| `modules/ui/DataTable.ejs` | 53 | `_headerRight` | slot / composition | Table header-right HTML built by the calling template; never user input. |
| `modules/ui/DataTable.ejs` | 58 | `_toolbar` | slot / composition | Toolbar HTML built by the calling template; never user input. |
| `modules/ui/DataTable.ejs` | 88 | `col.render(row)` | developer-controlled | `col.render` is a renderer function defined in a TypeScript data file (`src/data/*.ts`). It produces badge or icon HTML from static data, not from request parameters. |
| `modules/ui/DataTable.ejs` | 118 | `_pageUrl(1)` | developer-controlled | `_pageUrl` is a URL-builder function passed from the route handler. It constructs pagination URLs from query parameters that are validated and sanitised by the route before being passed to the view. |
| `modules/ui/DataTable.ejs` | 119 | `_pageUrl(_page - 1)` | developer-controlled | Same as line 118. |
| `modules/ui/DataTable.ejs` | 131 | `_pageUrl(item)` | developer-controlled | Same as line 118. |
| `modules/ui/DataTable.ejs` | 136 | `_pageUrl(_page + 1)` | developer-controlled | Same as line 118. |
| `modules/ui/DataTable.ejs` | 137 | `_pageUrl(_totalPages)` | developer-controlled | Same as line 118. |
| `modules/ui/Drawer.ejs` | 56 | `locals.children \|\| ''` | slot / composition | Drawer body HTML built by the calling template; never user input. |
| `modules/ui/Drawer.ejs` | 62 | `locals.footer` | slot / composition | Drawer footer HTML built by the calling template; never user input. |
| `modules/ui/Input.ejs` | 30 | `locals.iconLeft` | slot / composition | Icon HTML (Font Awesome `<i>` tag) built by the calling template; never user input. |
| `modules/ui/MapView.ejs` | 102 | `_id` | developer-controlled JS config | Element ID string generated by the component helper from a static prefix; interpolated into an inline `<script>` to wire up the Leaflet map. Never user-supplied. |
| `modules/ui/MapView.ejs` | 105 | `_id`, `_center[0]`, `_center[1]`, `_zoom` | developer-controlled JS config | Map initialisation values (ID string, latitude, longitude, zoom level) from a TypeScript data file, interpolated into an inline `<script>`. Never user-supplied. |
| `modules/ui/MapView.ejs` | 146 | `_id` | developer-controlled JS config | Same element-ID wiring as line 102. |
| `modules/ui/MapView.ejs` | 147 | `_id` | developer-controlled JS config | Same element-ID wiring as line 102. |
| `modules/ui/MapView.ejs` | 148 | `_id` | developer-controlled JS config | Same element-ID wiring as line 102. |
| `modules/ui/MapView.ejs` | 149 | `_id` | developer-controlled JS config | Same element-ID wiring as line 102. |
| `modules/ui/Modal.ejs` | 52 | `locals.children` | slot / composition | Modal body HTML built by the calling template; never user input. |
| `modules/ui/Modal.ejs` | 55 | `locals.footer` | slot / composition | Modal footer HTML built by the calling template; never user input. |
| `modules/ui/ScrollArea.ejs` | 14 | `locals.children` | slot / composition | Scrollable-area body HTML built by the calling template; never user input. |
| `modules/ui/TabGroup.ejs` | 23 | `tab.badge` | developer-controlled | Badge HTML (typically a `<span>` with a count) defined in a TypeScript data file; never user-supplied. |
| `modules/ui/TabGroup.ejs` | 37 | `tab.content \|\| ''` | developer-controlled | Tab panel HTML defined in a TypeScript data file; never user-supplied. |

### `views/layouts/`

| File | Line | Expression | Category | Justification |
|---|---|---|---|---|
| `views/layouts/blank.ejs` | 19 | `body` | express-ejs-layouts body | Standard `express-ejs-layouts` injection point. Populated by another trusted EJS template; never user input. |
| `views/layouts/blank.ejs` | 30 | `locals.extraScripts \|\| ''` | developer-controlled | Optional `<script>` block injected by the route handler from a TypeScript data/route file; never user-supplied. |
| `views/layouts/main.ejs` | 22 | `body` | express-ejs-layouts body | Standard `express-ejs-layouts` injection point. Same as `blank.ejs` line 19. |
| `views/layouts/main.ejs` | 36 | `locals.extraScripts \|\| ''` | developer-controlled | Same as `blank.ejs` line 30. |

### `views/partials/`

| File | Line | Expression | Category | Justification |
|---|---|---|---|---|
| `views/partials/_head.ejs` | 69 | `locals.extraHead \|\| ''` | developer-controlled | Optional `<link>` / `<meta>` markup injected by a route handler from a TypeScript file; never user-supplied. |

### `views/showcase/partials/`

| File | Line | Expression | Category | Justification |
|---|---|---|---|---|
| `views/showcase/partials/source-block.ejs` | 14 | `encodeURIComponent(selected.sourceCode)` | pre-escaped | Source code is URL-encoded before being placed in a `data-code` HTML attribute. `encodeURIComponent` percent-encodes `<`, `>`, `"`, and `&`, so injection into the attribute is impossible. |
| `views/showcase/partials/source-block.ejs` | 25 | `selected.sourceCode` | developer-controlled code display | Component source code stored in a TypeScript showcase data file and displayed inside a `<code>` block in the component inspector. It is not user-supplied; displaying it unescaped is required to show angle brackets in the source. **Mitigating control:** this page is a developer-only showcase, never exposed to end-user input. |
| `views/showcase/partials/widget.ejs` | 11 | `encodeURIComponent(variant.code)` | pre-escaped | Same pattern as `source-block.ejs` line 14 — URL-encoded before placement in a `data-code` attribute. |
| `views/showcase/partials/widget.ejs` | 28 | `variant.previewHtml` | developer-controlled code display | Pre-rendered HTML for the component preview pane, defined in a TypeScript showcase data file. Required raw so the browser renders it as markup. Never user-supplied. |
| `views/showcase/partials/widget.ejs` | 38 | `variant.code` | developer-controlled code display | Component source code displayed in the code inspector `<code>` block, same as `source-block.ejs` line 25. Never user-supplied. |

---

## EJS Include Sites (always safe)

`<%- include('path', locals) %>` loads a file from the filesystem by a
**hardcoded path**. No user data influences which file is loaded. Dynamic values
are passed as a second argument and are escaped normally inside the included
template using `<%= %>`. This makes every `include()` call inherently safe from
an injection standpoint.

The 255 include sites below are listed for completeness. They require no further
individual justification.

### `modules/app/`

- `modules/app/AppNav.ejs:36` — includes `./NavDrawer`
- `modules/app/AppShell.ejs:42` — includes `../ui/Drawer`
- `modules/app/Form.ejs:15` — includes `../ui/AlertBanner`
- `modules/app/LoadingState.ejs:10` — includes `../ui/Spinner`
- `modules/app/NavDrawer.ejs:16` — includes `../ui/Drawer`
- `modules/app/SplashScreen.ejs:14` — includes `../ui/Spinner` (size lg)
- `modules/app/SplashScreen.ejs:16` — includes `../ui/Spinner` (size xl)

### `modules/domain/api-doc/`

- `modules/domain/api-doc/ApiTagSection.ejs:43` — includes `./EndpointRow`
- `modules/domain/api-doc/EndpointRow.ejs:13` — includes `./HttpMethodBadge`
- `modules/domain/api-doc/EndpointRow.ejs:31` — includes `./OperationPanel`
- `modules/domain/api-doc/OperationPanel.ejs:128` — includes `./ParameterTable` (path params)
- `modules/domain/api-doc/OperationPanel.ejs:134` — includes `./ParameterTable` (query params)
- `modules/domain/api-doc/OperationPanel.ejs:140` — includes `./ParameterTable` (header params)
- `modules/domain/api-doc/OperationPanel.ejs:146` — includes `./ParameterTable` (cookie params)
- `modules/domain/api-doc/OperationPanel.ejs:166` — includes `./SchemaViewer` (request body)
- `modules/domain/api-doc/OperationPanel.ejs:179` — includes `./ResponseCard`
- `modules/domain/api-doc/OperationPanel.ejs:186` — includes `./CodeSamplePanel`
- `modules/domain/api-doc/ResponseCard.ejs:55` — includes `./SchemaViewer` (response body)
- `modules/domain/api-doc/SchemaViewer.ejs:98` — includes `./SchemaViewer` (recursive)

### `modules/domain/common/address/`

- `modules/domain/common/address/AddressForm.ejs:12,17,24,30,36,40,44,51,56` — includes `../../../ui/Input`
- `modules/domain/common/address/AddressForm.ejs:64` — includes `../../../ui/Button` (Cancel)
- `modules/domain/common/address/AddressForm.ejs:66` — includes `../../../ui/Button` (Submit)
- `modules/domain/common/address/AddressSelector.ejs:18` — includes `../address/AddressCard`

### `modules/domain/common/auth/`

- `modules/domain/common/auth/ChangePasswordForm.ejs:15,25,36` — includes `../../../ui/Input`
- `modules/domain/common/auth/ChangePasswordForm.ejs:46` — includes `../../../ui/Button`
- `modules/domain/common/auth/ForgotPasswordForm.ejs:22` — includes `../../../ui/Input`
- `modules/domain/common/auth/ForgotPasswordForm.ejs:32` — includes `../../../ui/Button`
- `modules/domain/common/auth/LoginForm.ejs:14,25` — includes `../../../ui/Input`
- `modules/domain/common/auth/LoginForm.ejs:40` — includes `../../../ui/Button`
- `modules/domain/common/auth/RegisterForm.ejs:15,26,37` — includes `../../../ui/Input`
- `modules/domain/common/auth/RegisterForm.ejs:47` — includes `../../../ui/Button`

### `modules/domain/common/cart/`

- `modules/domain/common/cart/CartSummary.ejs:37` — includes `./CartItem`
- `modules/domain/common/cart/CartSummary.ejs:48` — includes `../discount/CouponInput`
- `modules/domain/common/cart/CartSummary.ejs:58` — includes `../money/OrderTotalsCard`

### `modules/domain/common/location/`

- `modules/domain/common/location/LocationPicker.ejs:34,39,44,49,54` — includes `../../../ui/Input`
- `modules/domain/common/location/LocationPicker.ejs:62` — includes `../../../ui/Button` (Cancel)
- `modules/domain/common/location/LocationPicker.ejs:64` — includes `../../../ui/Button` (Save)

### `modules/domain/common/payment/`

- `modules/domain/common/payment/CreditCardForm.ejs:18` — includes `../payment/CreditCardVisual`
- `modules/domain/common/payment/CreditCardForm.ejs:28,35,43,49` — includes `../../../ui/Input`
- `modules/domain/common/payment/CreditCardForm.ejs:59` — includes `../../../ui/Button` (Cancel)
- `modules/domain/common/payment/CreditCardForm.ejs:61` — includes `../../../ui/Button` (Add Card)
- `modules/domain/common/payment/PaymentStatusBadge.ejs:16` — includes `../../../ui/Badge`
- `modules/domain/common/payment/PaymentSummaryCard.ejs:21` — includes `../payment/PaymentStatusBadge`

### `modules/domain/common/seo/`

- `modules/domain/common/seo/SeoForm.ejs:20` — includes `../../../ui/Input`
- `modules/domain/common/seo/SeoForm.ejs:58` — includes `../../../ui/Button` (Cancel)
- `modules/domain/common/seo/SeoForm.ejs:60` — includes `../../../ui/Button` (Save SEO)

### `modules/domain/common/status/`

- `modules/domain/common/status/PublishStatusBadge.ejs:14` — includes `../../../ui/Badge`
- `modules/domain/common/status/VisibilityBadge.ejs:14` — includes `../../../ui/Badge`

### `modules/domain/common/user/`

- `modules/domain/common/user/UserAvatar.ejs:7` — includes `../../../ui/Avatar`
- `modules/domain/common/user/UserMenu.ejs:25` — includes `../../../ui/Avatar`
- `modules/domain/common/user/UserPreferencesForm.ejs:58,66,74` — includes `../../../ui/Toggle`
- `modules/domain/common/user/UserPreferencesForm.ejs:84` — includes `../../../ui/Button`
- `modules/domain/common/user/UserProfileCard.ejs:37` — includes `../user/UserRoleBadge`
- `modules/domain/common/user/UserProfileCard.ejs:38` — includes `../user/UserStatusBadge`
- `modules/domain/common/user/UserProfileForm.ejs:16,26,47` — includes `../../../ui/Input`
- `modules/domain/common/user/UserProfileForm.ejs:37` — includes `../../../ui/Textarea`
- `modules/domain/common/user/UserProfileForm.ejs:65` — includes `../../../ui/Button`
- `modules/domain/common/user/UserRoleBadge.ejs:12` — includes `../../../ui/Badge`
- `modules/domain/common/user/UserStatusBadge.ejs:13` — includes `../../../ui/Badge`

### `views/layouts/`

- `views/layouts/blank.ejs:3` — includes `../partials/_head`
- `views/layouts/blank.ejs:15` — includes `../partials/_flash`
- `views/layouts/main.ejs:3` — includes `../partials/_head`
- `views/layouts/main.ejs:15` — includes `../partials/_flash`
- `views/layouts/main.ejs:18` — includes `../partials/_navbar`
- `views/layouts/main.ejs:26` — includes `../partials/_footer`

### `views/partials/`

- `views/partials/_navbar.ejs:39` — includes `./_theme_toggle`

### `views/showcase/`

- `views/showcase/index.ejs:66` — includes `./partials/sidebar`
- `views/showcase/index.ejs:69` — includes `./partials/topbar`
- `views/showcase/index.ejs:74` — includes `./partials/home-panel`
- `views/showcase/index.ejs:97` — includes `./partials/widget`
- `views/showcase/index.ejs:102` — includes `./partials/source-block`
- `views/showcase/partials/home-panel.ejs:144` — includes `./github-button`
- `views/showcase/partials/topbar.ejs:11` — includes `./github-button`
- `views/showcase/partials/topbar.ejs:12` — includes `./theme-switcher`
- `views/showcase/partials/topbar.ejs:13` — includes `./user-menu`

### `views/theme/api-doc/`

- `views/theme/api-doc/_nav.ejs:75` — includes `modules/domain/api-doc/ServerSelector`
- `views/theme/api-doc/_nav.ejs:85` — includes `modules/domain/api-doc/SecuritySchemeBadge`
- `views/theme/api-doc/index.ejs:1` — includes `./_nav`
- `views/theme/api-doc/index.ejs:93` — includes `modules/domain/api-doc/SecuritySchemeBadge`
- `views/theme/api-doc/index.ejs:153` — includes `modules/domain/api-doc/ApiTagSection`

### `views/theme/common/account/`

- `views/theme/common/account/_nav.ejs:22` — includes `modules/domain/common/user/UserMenu`
- `views/theme/common/account/addresses.ejs:9` — includes `./_nav`
- `views/theme/common/account/addresses.ejs:30` — includes `modules/domain/common/address/AddressSelector`
- `views/theme/common/account/addresses.ejs:45` — includes `modules/domain/common/address/AddressForm`
- `views/theme/common/account/addresses.ejs:58` — includes `./_nav-close`
- `views/theme/common/account/orders.ejs:26` — includes `./_nav`
- `views/theme/common/account/orders.ejs:60` — includes `modules/domain/common/money/PriceDisplay`
- `views/theme/common/account/orders.ejs:66` — includes `modules/domain/common/payment/PaymentStatusBadge`
- `views/theme/common/account/orders.ejs:73` — includes `modules/domain/common/payment/PaymentSummaryCard`
- `views/theme/common/account/orders.ejs:94` — includes `./_nav-close`
- `views/theme/common/account/payment-methods.ejs:8` — includes `./_nav`
- `views/theme/common/account/payment-methods.ejs:29` — includes `modules/domain/common/payment/SavedCardSelector`
- `views/theme/common/account/payment-methods.ejs:38` — includes `modules/domain/common/payment/CreditCardForm`
- `views/theme/common/account/payment-methods.ejs:47` — includes `./_nav-close`
- `views/theme/common/account/profile.ejs:7` — includes `./_nav`
- `views/theme/common/account/profile.ejs:27` — includes `modules/domain/common/user/UserProfileCard`
- `views/theme/common/account/profile.ejs:41` — includes `modules/domain/common/user/UserProfileForm`
- `views/theme/common/account/profile.ejs:56` — includes `./_nav-close`
- `views/theme/common/account/settings.ejs:9` — includes `./_nav`
- `views/theme/common/account/settings.ejs:24` — includes `modules/domain/common/user/UserPreferencesForm`
- `views/theme/common/account/settings.ejs:45` — includes `modules/domain/common/auth/ChangePasswordForm`
- `views/theme/common/account/settings.ejs:52` — includes `./_nav-close`

### `views/theme/common/auth/`

- `views/theme/common/auth/forgot-password.ejs:17` — includes `modules/domain/common/auth/ForgotPasswordForm`
- `views/theme/common/auth/login.ejs:10` — includes `modules/domain/common/auth/SessionExpiredBanner`
- `views/theme/common/auth/login.ejs:20` — includes `modules/ui/BrandLogo`
- `views/theme/common/auth/login.ejs:34` — includes `modules/domain/common/auth/OAuthButtons`
- `views/theme/common/auth/login.ejs:47` — includes `modules/domain/common/auth/LoginForm`
- `views/theme/common/auth/register.ejs:13` — includes `modules/ui/BrandLogo`
- `views/theme/common/auth/register.ejs:34` — includes `modules/domain/common/auth/OAuthButtons`
- `views/theme/common/auth/register.ejs:47` — includes `modules/domain/common/auth/RegisterForm`

### `views/theme/common/cart/`

- `views/theme/common/cart/index.ejs:18` — includes `modules/domain/common/cart/CartSummary`

### `views/theme/common/email/` (all email templates)

All email templates use `<%- include('../_preview-bar', locals) %>` and
`<%- include('../_footer', locals) %>` — trusted EJS partials for the email
preview bar and footer. All 62 include() calls across the 31 email templates
follow this identical, safe pattern.

### `views/theme/common/not-found/`

- `views/theme/common/not-found.ejs:1` — includes `modules/domain/common/NotFoundPage`

### `views/theme/common/payment/`

- `views/theme/common/payment/checkout.ejs:31` — includes `modules/domain/common/payment/PaymentSummaryCard`
- `views/theme/common/payment/checkout.ejs:56` — includes `modules/domain/common/address/AddressSelector`
- `views/theme/common/payment/checkout.ejs:67` — includes `modules/domain/common/address/AddressCard`
- `views/theme/common/payment/checkout.ejs:80` — includes `modules/domain/common/payment/PaymentMethodSelector`
- `views/theme/common/payment/checkout.ejs:98` — includes `modules/domain/common/payment/SavedCardSelector`
- `views/theme/common/payment/checkout.ejs:131` — includes `modules/domain/common/discount/CouponInput`
- `views/theme/common/payment/checkout.ejs:141` — includes `modules/domain/common/payment/PaymentStatusBadge`
- `views/theme/common/payment/checkout.ejs:160` — includes `modules/domain/common/cart/CartPreview`
- `views/theme/common/payment/checkout.ejs:165` — includes `modules/domain/common/money/OrderTotalsCard`
- `views/theme/common/payment/checkout.ejs:170` — includes `modules/domain/common/address/AddressCard`
- `views/theme/common/payment/index.ejs:34` — includes `modules/domain/common/payment/CreditCardVisual`
- `views/theme/common/payment/index.ejs:58,59` — includes `modules/domain/common/payment/PaymentStatusBadge`
- `views/theme/common/payment/index.ejs:75,76,77,78,79` — includes `modules/domain/common/money/PriceDisplay`
- `views/theme/common/payment/index.ejs:93` — includes `modules/domain/common/money/OrderTotalsCard`
- `views/theme/common/payment/index.ejs:107` — includes `modules/domain/common/payment/PaymentSummaryCard`
- `views/theme/common/payment/index.ejs:121` — includes `modules/domain/common/payment/SavedCardSelector`

### `views/theme/modem/`

- `views/theme/modem/advanced.ejs:10` — includes `./_nav`
- `views/theme/modem/advanced.ejs:32` — includes `modules/domain/modem/PortForwardRow`
- `views/theme/modem/advanced.ejs:129` — includes `./_nav-close`
- `views/theme/modem/devices.ejs:38` — includes `./_nav`
- `views/theme/modem/devices.ejs:116` — includes `modules/domain/modem/ConnectedDeviceRow`
- `views/theme/modem/devices.ejs:220` — includes `./_nav-close`
- `views/theme/modem/firewall.ejs:12` — includes `./_nav`
- `views/theme/modem/firewall.ejs:327` — includes `./_nav-close`
- `views/theme/modem/index.ejs:32` — includes `./_nav`
- `views/theme/modem/index.ejs:79` — includes `modules/domain/modem/SystemStatusCard`
- `views/theme/modem/index.ejs:86` — includes `modules/domain/modem/WanStatusCard`
- `views/theme/modem/index.ejs:118` — includes `modules/domain/modem/WifiNetworkCard`
- `views/theme/modem/index.ejs:192` — includes `modules/domain/modem/AlertItem`
- `views/theme/modem/index.ejs:217` — includes `modules/domain/modem/ConnectedDeviceRow`
- `views/theme/modem/index.ejs:226` — includes `./_nav-close`
- `views/theme/modem/nat.ejs:17` — includes `./_nav`
- `views/theme/modem/nat.ejs:256` — includes `./_nav-close`
- `views/theme/modem/network.ejs:21` — includes `./_nav`
- `views/theme/modem/network.ejs:28` — includes `modules/domain/modem/WanStatusCard`
- `views/theme/modem/network.ejs:329` — includes `./_nav-close`
- `views/theme/modem/parental.ejs:29` — includes `./_nav`
- `views/theme/modem/parental.ejs:86` — includes `modules/domain/modem/ParentalProfileCard`
- `views/theme/modem/parental.ejs:190` — includes `./_nav-close`
- `views/theme/modem/qos.ejs:36` — includes `./_nav`
- `views/theme/modem/qos.ejs:226` — includes `./_nav-close`
- `views/theme/modem/settings.ejs:8` — includes `./_nav`
- `views/theme/modem/settings.ejs:364` — includes `./_nav-close`
- `views/theme/modem/system.ejs:42` — includes `./_nav`
- `views/theme/modem/system.ejs:47` — includes `modules/domain/modem/SystemStatusCard`
- `views/theme/modem/system.ejs:523` — includes `./_nav-close`
- `views/theme/modem/vpn.ejs:13` — includes `./_nav`
- `views/theme/modem/vpn.ejs:49` — includes `modules/domain/modem/VpnInstanceCard`
- `views/theme/modem/vpn.ejs:157` — includes `./_nav-close`
- `views/theme/modem/wifi.ejs:18` — includes `./_nav`
- `views/theme/modem/wifi.ejs:144` — includes `modules/domain/modem/WifiNetworkCard`
- `views/theme/modem/wifi.ejs:317` — includes `./_nav-close`

---

## CI Enforcement: `scripts/audit-raw-output.sh`

### What it does

`scripts/audit-raw-output.sh` greps `views/` and `modules/` for every line
containing `<%-` and then filters out the approved patterns one by one. Any line
that survives all the filters is a **violation** and the script exits with code 1.

### Approved patterns (as of last update)

| Pattern | grep -v argument | Rationale |
|---|---|---|
| `include(` | `include(` | All EJS template includes are inherently safe. |
| `JSON.stringify(` | `JSON\.stringify(` | Serialised to `<script type="application/ld+json">`; safe in that context. |
| `body` | `<%-[[:space:]]*body[[:space:]]*%>` | `express-ejs-layouts` layout injection placeholder. |
| `previewHtml` | `previewHtml` | Component preview HTML from TypeScript showcase data. |
| `sourceCode` | `sourceCode` | Component source code from TypeScript showcase data. |
| `variant.code` | `variant\.code` | Component code variant from TypeScript showcase data. |
| `locals.extraHead` | `locals\.extraHead` | Optional head markup injected by route handlers, not user input. |
| `locals.extraScripts` | `locals\.extraScripts` | Optional script blocks injected by route handlers, not user input. |

### Adding a new raw output site

1. Confirm the value is **never** derived from user input, request parameters, or
   an external API.
2. Add the variable/expression name to the appropriate `grep -v` line in
   `scripts/audit-raw-output.sh`, with a comment explaining why it is safe.
3. Add a corresponding row to the **Raw Output Sites** table in this file,
   choosing the correct category from the list above.
4. Commit both files together so the audit trail and the enforcement script
   remain in sync.

### Running the script locally

```bash
bash scripts/audit-raw-output.sh
# exit 0 → PASS
# exit 1 → prints every unapproved <%- %> line
```

---

*Last updated: 2026-09-15. Grep result: 59 raw output sites documented, 255 include() calls listed.*
