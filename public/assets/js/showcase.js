// ── Theme switcher ────────────────────────────────────────
const html = document.documentElement;
const themeSwitcherBtn = document.getElementById('theme-switcher-btn');
const themeDropdown = document.getElementById('theme-dropdown');
const themeSwitcherContainer = document.getElementById('theme-switcher-container');
const themeIcon = document.getElementById('theme-icon');
const themeLabel = document.getElementById('theme-label');

const themeIconClass = { light: 'fa-solid fa-sun', dark: 'fa-solid fa-moon', system: 'fa-solid fa-display' };

let currentTheme = 'system';
try { currentTheme = localStorage.getItem('theme') || 'system'; } catch (e) {}

function applyTheme(theme) {
  currentTheme = theme;
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  html.classList.toggle('dark', isDark);
  try { localStorage.setItem('theme', theme); } catch (e) {}
  if (themeIcon) themeIcon.className = themeIconClass[theme] || themeIconClass.system;
  if (themeLabel) themeLabel.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
}

applyTheme(currentTheme);

if (themeSwitcherBtn && themeDropdown) {
  themeSwitcherBtn.addEventListener('click', () => {
    const isHidden = themeDropdown.classList.toggle('hidden');
    themeSwitcherBtn.setAttribute('aria-expanded', String(!isHidden));
  });

  document.querySelectorAll('.theme-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyTheme(btn.getAttribute('data-theme') || 'system');
      themeDropdown.classList.add('hidden');
      themeSwitcherBtn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('mousedown', (e) => {
    if (themeSwitcherContainer && !themeSwitcherContainer.contains(e.target)) {
      themeDropdown.classList.add('hidden');
      themeSwitcherBtn.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      themeDropdown.classList.add('hidden');
      themeSwitcherBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── Sidebar collapse ──────────────────────────────────────
const collapseBtn = document.getElementById('sidebar-collapse-btn');
const collapseIcon = document.getElementById('collapse-icon');

let sidebarCollapsed = false;
try { sidebarCollapsed = localStorage.getItem('sidebar-collapsed') === 'true'; } catch (e) {}

function applySidebarCollapse(animated) {
  if (!animated) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.style.transition = 'none';
    requestAnimationFrame(() => {
      if (sidebar) sidebar.style.transition = '';
    });
  }
  if (sidebarCollapsed) {
    html.classList.add('sidebar-collapsed');
    if (collapseIcon) collapseIcon.classList.add('rotate-180');
    if (collapseBtn) collapseBtn.setAttribute('aria-label', 'Expand sidebar');
    var sidebarCollapseRow = document.getElementById('sidebar-collapse-row');
    if (sidebarCollapseRow) {
      sidebarCollapseRow.classList.remove('justify-end');
      sidebarCollapseRow.classList.add('justify-center');
    }
  } else {
    html.classList.remove('sidebar-collapsed');
    if (collapseIcon) collapseIcon.classList.remove('rotate-180');
    if (collapseBtn) collapseBtn.setAttribute('aria-label', 'Collapse sidebar');
    var sidebarCollapseRow2 = document.getElementById('sidebar-collapse-row');
    if (sidebarCollapseRow2) {
      sidebarCollapseRow2.classList.add('justify-end');
      sidebarCollapseRow2.classList.remove('justify-center');
    }
  }
}

// Apply immediately without animation to avoid flash
applySidebarCollapse(false);

if (collapseBtn) {
  collapseBtn.addEventListener('click', () => {
    sidebarCollapsed = !sidebarCollapsed;
    try { localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed)); } catch (e) {}
    applySidebarCollapse(true);
  });
}

// ── Group accordion ───────────────────────────────────────
// SSR default: groups collapsed unless they contain the active item.
// sessionStorage stores explicit user toggles ('open' | 'closed') and
// takes precedence over the SSR default.
document.querySelectorAll('.group-toggle-btn').forEach((btn) => {
  const groupIndex = btn.getAttribute('data-group');
  const itemsEl = document.querySelector(`.group-items[data-group="${groupIndex}"]`);
  const chevron = btn.querySelector('i');

  function setExpanded(next) {
    btn.setAttribute('aria-expanded', String(next));
    if (itemsEl) itemsEl.classList.toggle('hidden', !next);
    if (chevron) chevron.style.transform = next ? '' : 'rotate(-90deg)';
  }

  try {
    const stored = sessionStorage.getItem(`group-${groupIndex}`);
    if (stored === 'open')   setExpanded(true);
    if (stored === 'closed') setExpanded(false);
  } catch (e) {}

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const next = !expanded;
    setExpanded(next);
    try { sessionStorage.setItem(`group-${groupIndex}`, next ? 'open' : 'closed'); } catch (e) {}
  });
});

// ── Mobile sidebar ────────────────────────────────────────
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileOverlay = document.getElementById('mobile-sidebar-overlay');
const mobileSidebar = document.getElementById('mobile-sidebar');
const mobileBackdrop = document.getElementById('mobile-backdrop');

function openMobileSidebar() {
  if (!mobileOverlay || !mobileSidebar) return;
  mobileOverlay.classList.remove('opacity-0', 'pointer-events-none');
  mobileOverlay.classList.add('opacity-100');
  mobileSidebar.classList.remove('-translate-x-full');
  mobileSidebar.classList.add('translate-x-0');
}

function closeMobileSidebar() {
  if (!mobileOverlay || !mobileSidebar) return;
  mobileOverlay.classList.add('opacity-0', 'pointer-events-none');
  mobileOverlay.classList.remove('opacity-100');
  mobileSidebar.classList.add('-translate-x-full');
  mobileSidebar.classList.remove('translate-x-0');
}

window.closeMobileSidebar = closeMobileSidebar;

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileSidebar);
if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileSidebar);

// ── Copy buttons ──────────────────────────────────────────
document.querySelectorAll('.copy-btn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const code = decodeURIComponent(btn.getAttribute('data-code') || '');
    try {
      await navigator.clipboard.writeText(code);
      const prev = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('bg-success-subtle', 'text-success-fg');
      btn.classList.remove('bg-surface-overlay', 'text-text-secondary');
      setTimeout(() => {
        btn.textContent = prev;
        btn.classList.remove('bg-success-subtle', 'text-success-fg');
        btn.classList.add('bg-surface-overlay', 'text-text-secondary');
      }, 2000);
    } catch (e) {
      console.warn('Copy failed:', e);
    }
  });
});

// ── User menu dropdown ────────────────────────────────────
const userMenuBtn = document.getElementById('user-menu-btn');
const userMenuDropdown = document.getElementById('user-menu-dropdown');
const userMenuContainer = document.getElementById('user-menu-container');

if (userMenuBtn && userMenuDropdown) {
  userMenuBtn.addEventListener('click', () => {
    const isHidden = userMenuDropdown.classList.toggle('hidden');
    userMenuBtn.setAttribute('aria-expanded', String(!isHidden));
  });

  document.addEventListener('mousedown', (e) => {
    if (userMenuContainer && !userMenuContainer.contains(e.target)) {
      userMenuDropdown.classList.add('hidden');
      userMenuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      userMenuDropdown.classList.add('hidden');
      userMenuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ── Source block expand / collapse ────────────────────────
const sourceToggleBtn = document.getElementById('source-toggle-btn');
const sourceContent = document.getElementById('source-content');

if (sourceToggleBtn && sourceContent) {
  sourceToggleBtn.addEventListener('click', () => {
    const expanded = sourceToggleBtn.getAttribute('aria-expanded') === 'true';
    sourceToggleBtn.setAttribute('aria-expanded', String(!expanded));
    sourceToggleBtn.setAttribute('aria-label', !expanded ? 'Collapse source' : 'Expand source');
    sourceToggleBtn.textContent = !expanded ? 'Collapse' : 'Expand';
    sourceContent.classList.toggle('hidden', expanded);
  });
}

// ── Sidebar search (desktop + mobile, mirrored) ───────────
(function SidebarSearchModule() {
  var inputs = [
    document.getElementById('sidebar-search'),
    document.getElementById('mobile-sidebar-search'),
  ].filter(Boolean);
  if (inputs.length === 0) return;

  var noResultsContainers = [
    {
      root: document.getElementById('sidebar-no-results'),
      q:    document.getElementById('sidebar-no-results-q'),
    },
    {
      root: document.getElementById('mobile-sidebar-no-results'),
      q:    document.getElementById('mobile-sidebar-no-results-q'),
    },
  ].filter(function(x) { return x.root; });

  var debounceTimer = null;

  function setNoResults(value, anyVisible) {
    var show = !!value && !anyVisible;
    noResultsContainers.forEach(function(nr) {
      nr.root.classList.toggle('hidden', !show);
      nr.root.classList.toggle('flex', show);
      if (nr.q) nr.q.textContent = value;
    });
  }

  function filterSidebar(query) {
    var q = query.trim().toLowerCase();
    var groups = document.querySelectorAll('[data-group-section]');

    if (!q) {
      document.querySelectorAll('[data-nav-item]').forEach(function(el) {
        el.style.display = '';
      });
      groups.forEach(function(g) { g.style.display = ''; });
      setNoResults('', true);
      return;
    }

    var anyVisible = false;
    groups.forEach(function(groupEl) {
      var items = groupEl.querySelectorAll('[data-nav-item]');
      var hasVisible = false;
      items.forEach(function(item) {
        var title = (item.getAttribute('data-search-title') || '').toLowerCase();
        var matches = title.includes(q);
        item.style.display = matches ? '' : 'none';
        if (matches) { hasVisible = true; anyVisible = true; }
      });
      groupEl.style.display = hasVisible ? '' : 'none';
    });
    setNoResults(query, anyVisible);
  }

  function syncInputs(value, source) {
    inputs.forEach(function(el) { if (el !== source) el.value = value; });
  }

  inputs.forEach(function(input) {
    input.addEventListener('input', function() {
      syncInputs(input.value, input);
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function() {
        filterSidebar(input.value);
      }, 150);
    });

    input.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        input.value = '';
        syncInputs('', input);
        filterSidebar('');
      }
    });
  });
})();
