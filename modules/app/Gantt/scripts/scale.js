/* ── Gantt scale switcher (M1) ───────────────────────────────────────── */
/* Wire the role="tablist" scale buttons to a `gantt:scale-change` event so
   host apps can re-render the component server-side or React clients can
   hook in. For pure-EJS use cases the tab state is updated in-place. */
Array.prototype.forEach.call(root.querySelectorAll('[data-kui-gantt-scale]'), function (btn) {
  btn.addEventListener('click', function () {
    var next = btn.getAttribute('data-kui-gantt-scale');
    var cur  = root.getAttribute('data-gantt-scale');
    if (next === cur) return;

    // Visual toggle — bg-primary swap.
    Array.prototype.forEach.call(root.querySelectorAll('[data-kui-gantt-scale]'), function (other) {
      var active = other === btn;
      other.setAttribute('aria-selected', active ? 'true' : 'false');
      other.classList.toggle('bg-primary',        active);
      other.classList.toggle('text-primary-fg',   active);
      other.classList.toggle('text-text-secondary', !active);
      other.classList.toggle('hover:text-text-primary', !active);
      other.classList.toggle('hover:bg-surface-overlay', !active);
    });
    root.setAttribute('data-gantt-scale', next);

    // Notify host (host must re-render with new scale to update bars).
    root.dispatchEvent(new CustomEvent('gantt:scale-change', { detail: { scale: next }, bubbles: true }));
  });

  // ── Expand / collapse toggles ─────────────────────────────────────── */
  // (also wired here for proximity — single script bundle for M1)
});

Array.prototype.forEach.call(root.querySelectorAll('[data-kui-gantt-toggle]'), function (btn) {
  btn.addEventListener('click', function () {
    var expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    var icon = btn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-chevron-down',  expanded ? false : true);
      icon.classList.toggle('fa-chevron-right', expanded ? true  : false);
    }
    var taskId = btn.getAttribute('data-kui-gantt-toggle');
    root.dispatchEvent(new CustomEvent('gantt:task-toggle', { detail: { taskId: taskId, collapsed: expanded }, bubbles: true }));
  });
});
