# modules/ui — UI Primitives

Stateless or locally-stateful EJS partials (atoms + molecules). No business logic, no data fetching. Consumed by `modules/app/`, `modules/domain/`, and `views/theme/`.

## Files

```
AdvancedDataTable.ejs   AlertBanner.ejs        Avatar.ejs
Badge.ejs               BrandLogo.ejs          Breadcrumb.ejs
Button.ejs              ButtonGroup.ejs        Card.ejs
Checkbox.ejs            CheckboxGroup.ejs      ComboBox.ejs
ContentScoreBar.ejs     DataTable.ejs          DatePicker.ejs
DateRangePicker.ejs     Drawer.ejs             DropdownMenu.ejs
EmptyState.ejs          FileInput.ejs          Input.ejs
MapView.ejs             Modal.ejs              MultiSelect.ejs
PageHeader.ejs          Pagination.ejs         Popover.ejs
RadioGroup.ejs          SearchBar.ejs          Select.ejs
ServerDataTable.ejs     Skeleton.ejs           SkipLink.ejs
Slider.ejs              Spinner.ejs            StarRating.ejs
StatCard.ejs            Stepper.ejs            TabButton.ejs
TabGroup.ejs            Table.ejs              TagInput.ejs
Textarea.ejs            Toast.ejs              Toggle.ejs
Tooltip.ejs             TreeView.ejs           VideoPlayer.ejs
ViewToggle.ejs          lazy.ejs
```

## Parity

Shared with NextJS: yes — counterpart is `/home/kuray/01_NextJS_Components/modules/ui/`. Component names, props, and visual output must remain pixel-perfect. When you add or change a primitive in either repo, mirror it here.

## Conventions

1. **Header destructure** — every partial begins with `<% const { propA = default, propB } = locals; %>` so missing locals don't throw.
2. **Icons** — Font Awesome via `<i class="fa-solid fa-..." aria-hidden="true"></i>`. No inline SVG, no other icon libs.
3. **No React state** — interactive behavior is rendered as a vanilla-JS IIFE (`<script>(function(){ ... })();</script>`) scoped to a unique `id`/`data-` attribute.
4. **Tokens only** — use Tailwind utilities backed by shared CSS variables (`bg-primary`, `text-text-secondary`, `border-border-focus`); never raw hex.
5. **Escaping** — `<%= %>` for any value that could come from data; `<%- %>` only for trusted HTML / pre-rendered partials (see `docs/raw-output-allowlist.md`).
6. **Accessibility** — `focus-visible:ring-2 focus-visible:ring-border-focus`, ARIA attributes (`aria-busy`, `aria-invalid`, `aria-expanded`), `disabled:opacity-50 disabled:cursor-not-allowed`.

## See also

- Repo conventions: [`/home/kuray/02_EJS_Components/AGENTS.md`](../../AGENTS.md)
- Parity contract & pixel-perfect rule: `../../../00_Config_and_AI_Rules`
