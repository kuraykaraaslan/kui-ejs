# ColorPicker

- **id:** `color-picker`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/ColorPicker.ejs`
- **status:** stable
- **since:** 2026-05

Color selection control with a 32-swatch preset palette plus optional hex input and native browser color picker for unlimited colors. Pixel-identical React sibling at modules/ui/ColorPicker.tsx. Used by RichTextEditor for text + highlight colors.

## Variants

### Default

```ejs
<%- include('modules/ui/ColorPicker', {
  id: 'brand',
  name: 'brand',
  label: 'Brand color',
  value: '#3b82f6',
  showNoColor: true
}) %>
```

### Compact (swatches only)

```ejs
<%- include('modules/ui/ColorPicker', {
  id: 'compact',
  value: '#22c55e',
  showHexInput: false,
  showNativePicker: false
}) %>
```

### Hex + native picker only (no swatches)

```ejs
<%- include('modules/ui/ColorPicker', {
  id: 'bg',
  label: 'Background',
  swatches: [],
  showHexInput: true,
  showNativePicker: true,
  showNoColor: true
}) %>
```

## Full EJS source

```ejs
<%- include('./ColorPicker/ColorPicker', locals) %>

```
