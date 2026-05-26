# Toast

- **id:** `toast`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Toast/Toast.ejs`
- **status:** stable
- **since:** 2025-02

Notification system with success/warning/error/info/loading variants. Hover-to-freeze, progress bar, title, actions, and promise support.

## Variants

### Success

```ejs
<%- include('modules/ui/Toast', {
  variant: 'success',
  title: 'File uploaded',
  message: 'report.pdf has been uploaded successfully.'
}) %>
```

### Error

```ejs
<%- include('modules/ui/Toast', {
  variant: 'error',
  title: 'Upload failed',
  message: 'The file exceeds the 10 MB size limit.',
  actionLabel: 'Try again'
}) %>
```

### Warning

```ejs
<%- include('modules/ui/Toast', {
  variant: 'warning',
  message: 'Session expires in 5 minutes.'
}) %>
```

### Info

```ejs
<%- include('modules/ui/Toast', {
  variant: 'info',
  title: 'New update',
  message: 'Version 2.4 is available. Refresh to apply.'
}) %>
```

### Loading

```ejs
<%- include('modules/ui/Toast', {
  variant: 'loading',
  message: 'Saving your changes…',
  persistent: true
}) %>
```

### toast.promise() API

```ejs
<%# Mount once — store.js exposes window.toast() %>
<%- include('modules/ui/Toast/scripts/store.js') %>

<script>
  // Same surface as the NextJS `toast.promise()` — drives one toast
  // through loading → success | error in a single call.
  window.toast.promise(
    fetch('/api/user').then(function (r) { return r.json(); }),
    {
      loading: 'Kullanıcı yükleniyor…',
      success: function (u) { return u.name + ' (#' + u.id + ') yüklendi.'; },
      error:   function (e) { return 'Hata: ' + e.message; },
    }
  );

  // String shortcuts for success/error are also accepted.
  window.toast.promise(saveSettings(), {
    loading: 'Kaydediliyor…',
    success: 'Tamamlandı!',
    error:   'Kaydetme başarısız oldu.',
  });
</script>
```

## Full EJS source

```ejs
<%# modules/ui/Toast/Toast.ejs %>
<%#
  Toast suite entry point.

  Renders a single server-side toast card (`partials/_toast-item.ejs`) and
  initialises the global `window.toast()` / `window.notify()` controller
  exactly once per page (`scripts/store.js`). Safe to include this partial
  multiple times — the controller IIFE no-ops on re-init.

  Locals (all optional unless noted):
    variant      'info' (default) | 'success' | 'warning' | 'error' | 'loading'
    title        string
    message      string
    actionLabel  string
    actionHref   string
    persistent   bool — hides the close × button
    position     string — unused for the server card; reserved for future use

  M1 milestone — see PLANS/26-Toast.md.
%>
<%- include('./partials/_toast-item.ejs', locals) %>
<%- include('./scripts/store.js') %>

```
