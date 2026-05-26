# DiffViewer

- **id:** `diff-viewer`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/DiffViewer/DiffViewer.ejs`
- **status:** stable
- **since:** 2026-05

Line-based text diff viewer with unified (GitHub-style) and split (yan yana) modes. M1 ships a zero-dep LCS algorithm, hunk headers in `@@ -old,n +new,n @@` form, old/new line-number gutters, configurable context window, and optional collapsible unchanged regions. Pixel-identical React sibling at modules/ui/DiffViewer/index.tsx.

## Variants

### Unified (default)

```ejs
<%- include('modules/ui/DiffViewer', {
  id: 'review',
  oldText: oldSrc,
  newText: newSrc
}) %>
```

### Split (yan yana)

```ejs
<%- include('modules/ui/DiffViewer', {
  id: 'review',
  oldText: oldSrc,
  newText: newSrc,
  mode: 'split'
}) %>
```

### With context=1

```ejs
<%- include('modules/ui/DiffViewer', {
  id: 'review',
  oldText: oldSrc,
  newText: newSrc,
  context: 1
}) %>
```

### Collapsible unchanged context

```ejs
<%- include('modules/ui/DiffViewer', {
  id: 'review',
  oldText: oldSrc,
  newText: newSrc,
  context: 3,
  collapsible: true
}) %>
```

## Full EJS source

```ejs
<%- include('./DiffViewer/DiffViewer', locals) %>

```
