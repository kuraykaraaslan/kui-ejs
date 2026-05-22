# Tooltip

- **id:** `tooltip`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Tooltip.ejs`
- **status:** stable
- **since:** 2026-05

Hover/focus üzerine açılan kısa açıklayıcı katman. 4 yerleşim, 3 tema, isteğe bağlı ok ve gecikme süresi.

## Design tokens consumed

- `--border`
- `--primary`
- `--surface-overlay`
- `--text-primary`

## Variants

### Placements

```ejs
<%- include('modules/ui/Tooltip', { content: 'Top tooltip', placement: 'top', children: '<button>Top</button>' }) %>
<%- include('modules/ui/Tooltip', { content: 'Bottom tooltip', placement: 'bottom', children: '<button>Bottom</button>' }) %>
<%- include('modules/ui/Tooltip', { content: 'Right tooltip', placement: 'right', children: '<button>Right</button>' }) %>
```

### Themes

```ejs
<%- include('modules/ui/Tooltip', { content: 'Default theme', theme: 'default', children: '<button>Default</button>' }) %>
<%- include('modules/ui/Tooltip', { content: 'Dark theme', theme: 'dark', children: '<button>Dark</button>' }) %>
<%- include('modules/ui/Tooltip', { content: 'Light theme', theme: 'light', children: '<button>Light</button>' }) %>
```

### With arrow

```ejs
<%- include('modules/ui/Tooltip', {
  content: 'Has an arrow',
  placement: 'top',
  arrow: true,
  children: '<button>Top + arrow</button>'
}) %>
```

### On an icon button

```ejs
<%- include('modules/ui/Tooltip', {
  content: 'Open settings',
  placement: 'top',
  theme: 'dark',
  children: '<button aria-label="Settings"><i class="fa-solid fa-gear"></i></button>'
}) %>
```

## Full EJS source

```ejs
<%
  var _id        = locals.id        || 'tooltip-' + Math.random().toString(36).substr(2, 9);
  var _content   = locals.content   || '';
  var _placement = locals.placement || 'top';
  var _theme     = locals.theme     || 'default';
  var _arrow     = !!locals.arrow;
  var _delay     = typeof locals.delay === 'number' ? locals.delay : 0;
  var _className = locals.className || '';

  var themeClass = {
    'default': 'bg-surface-overlay text-text-primary border border-border',
    'dark':    'bg-gray-900 text-white border-transparent',
    'light':   'bg-white text-gray-900 border border-border shadow-md',
  }[_theme] || 'bg-surface-overlay text-text-primary border border-border';

  var placementClass = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left:   'right-full top-1/2 -translate-y-1/2 mr-2',
    right:  'left-full top-1/2 -translate-y-1/2 ml-2',
  }[_placement] || 'bottom-full left-1/2 -translate-x-1/2 mb-2';

  var arrowPlacementClass = {
    top:    'bottom-[-5px] left-1/2 -translate-x-1/2 border-t-0 border-l-0',
    bottom: 'top-[-5px] left-1/2 -translate-x-1/2 border-b-0 border-r-0',
    left:   'right-[-5px] top-1/2 -translate-y-1/2 border-l-0 border-b-0',
    right:  'left-[-5px] top-1/2 -translate-y-1/2 border-r-0 border-t-0',
  }[_placement] || 'bottom-[-5px] left-1/2 -translate-x-1/2 border-t-0 border-l-0';

  var arrowThemeClass = {
    'default': 'bg-surface-overlay',
    'dark':    'bg-gray-900 border-transparent',
    'light':   'bg-white',
  }[_theme] || 'bg-surface-overlay';
%>
<span
  id="<%= _id %>-wrapper"
  class="relative inline-flex items-center<%= _className ? ' ' + _className : '' %>"
  data-tooltip-delay="<%= _delay %>"
>
  <span aria-describedby="<%= _id %>"><%- locals.children || '' %></span>
  <span
    id="<%= _id %>"
    role="tooltip"
    class="absolute z-[80] whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium shadow-md transition-opacity duration-150 pointer-events-none opacity-0 <%= themeClass %> <%= placementClass %>"
  >
    <%- _content %>
    <% if (_arrow) { %>
      <span aria-hidden="true" class="absolute w-2 h-2 rotate-45 border border-border <%= arrowPlacementClass %> <%= arrowThemeClass %>"></span>
    <% } %>
  </span>
</span>

<script>
(function () {
  var wrapper = document.getElementById('<%= _id %>-wrapper');
  var tip     = document.getElementById('<%= _id %>');
  if (!wrapper || !tip) return;

  var delay = parseInt(wrapper.getAttribute('data-tooltip-delay'), 10) || 0;
  var timer = null;

  function show() {
    if (delay > 0) {
      timer = setTimeout(function () {
        tip.classList.remove('opacity-0');
        tip.classList.add('opacity-100');
      }, delay);
    } else {
      tip.classList.remove('opacity-0');
      tip.classList.add('opacity-100');
    }
  }

  function hide() {
    if (timer) { clearTimeout(timer); timer = null; }
    tip.classList.add('opacity-0');
    tip.classList.remove('opacity-100');
  }

  wrapper.addEventListener('mouseenter', show);
  wrapper.addEventListener('mouseleave', hide);
  wrapper.addEventListener('focusin',  show);
  wrapper.addEventListener('focusout', hide);
})();
</script>

```
