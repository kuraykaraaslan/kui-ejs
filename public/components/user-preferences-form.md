# UserPreferencesForm

- **id:** `user-preferences-form`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domain/common/user/UserPreferencesForm.ejs`
- **status:** stable
- **since:** 0.1

Tema (SYSTEM/LIGHT/DARK), dil seçimi, email/push/newsletter toggle'ları içeren tercihler formu.

## Design tokens consumed

- `--border`
- `--error`
- `--error-fg`
- `--error-subtle`
- `--primary`
- `--text-primary`

## Variants

### Default

```ejs
<%- include('modules/domain/common/user/UserPreferencesForm', {
  action: '/account/preferences',
  initial: {
    theme: 'SYSTEM',
    language: 'en',
    emailNotifications: true,
    pushNotifications: true,
    newsletter: false
  }
}) %>
```

## Full EJS source

```ejs
<%
  var _action   = locals.action   || '#';
  var _method   = locals.method   || 'post';
  var _error    = locals.error    || '';
  var _initial  = locals.initial  || {};

  var _theme              = _initial.theme              || 'SYSTEM';
  var _language           = _initial.language           || 'en';
  var _emailNotifications = _initial.emailNotifications !== false;
  var _pushNotifications  = _initial.pushNotifications  !== false;
  var _newsletter         = _initial.newsletter         !== false;

  var languages = [
    { value: 'en', label: '🇺🇸 English' },
    { value: 'tr', label: '🇹🇷 Türkçe' },
    { value: 'de', label: '🇩🇪 Deutsch' },
    { value: 'fr', label: '🇫🇷 Français' },
    { value: 'ar', label: '🇸🇦 العربية' },
  ];
%>
<form action="<%= _action %>" method="<%= _method %>" novalidate class="space-y-6<%= locals.className ? ' ' + locals.className : '' %>">
  <% if (_error) { %>
  <div role="alert" class="flex items-start gap-3 rounded-lg border p-3 bg-error-subtle border-error text-error-fg text-sm">
    <i class="fa-solid fa-circle-xmark mt-0.5 shrink-0" aria-hidden="true"></i>
    <span><%= _error %></span>
  </div>
  <% } %>

  <!-- Appearance -->
  <div class="space-y-3">
    <h3 class="text-sm font-semibold text-text-primary">Appearance</h3>

    <div>
      <label for="pref-theme" class="block text-sm font-medium text-text-primary mb-1.5">Theme</label>
      <select id="pref-theme" name="theme"
        class="block w-full rounded-md border border-border bg-surface text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary px-3 py-2 text-sm">
        <option value="SYSTEM" <%= _theme === 'SYSTEM' ? 'selected' : '' %>>System default</option>
        <option value="LIGHT"  <%= _theme === 'LIGHT'  ? 'selected' : '' %>>Light</option>
        <option value="DARK"   <%= _theme === 'DARK'   ? 'selected' : '' %>>Dark</option>
      </select>
    </div>

    <div>
      <label for="pref-language" class="block text-sm font-medium text-text-primary mb-1.5">Language</label>
      <select id="pref-language" name="language"
        class="block w-full rounded-md border border-border bg-surface text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary px-3 py-2 text-sm">
        <% languages.forEach(function (lang) { %>
        <option value="<%= lang.value %>" <%= _language === lang.value ? 'selected' : '' %>><%= lang.label %></option>
        <% }); %>
      </select>
    </div>
  </div>

  <!-- Notifications -->
  <div class="space-y-3 pt-2 border-t border-border">
    <h3 class="text-sm font-semibold text-text-primary pt-2">Notifications</h3>

    <%- include('../../../ui/Toggle', {
      id:      'pref-email-notif',
      name:    'emailNotifications',
      value:   '1',
      label:   'Email notifications',
      checked: _emailNotifications
    }) %>

    <%- include('../../../ui/Toggle', {
      id:      'pref-push-notif',
      name:    'pushNotifications',
      value:   '1',
      label:   'Push notifications',
      checked: _pushNotifications
    }) %>

    <%- include('../../../ui/Toggle', {
      id:      'pref-newsletter',
      name:    'newsletter',
      value:   '1',
      label:   'Newsletter',
      checked: _newsletter
    }) %>
  </div>

  <div class="flex justify-end pt-2">
    <%- include('../../../ui/Button', {
      type: 'submit',
      children: 'Save Preferences'
    }) %>
  </div>
</form>

```
