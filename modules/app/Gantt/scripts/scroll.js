/* ── Gantt scroll sync (M1) ──────────────────────────────────────────── */
/* The timeline body owns both axes; the left WBS panel mirrors vertical
   scroll, the sticky header mirrors horizontal scroll. A reentrancy flag
   keeps the two sides from echoing each other indefinitely. */
(function () {
  var side     = root.querySelector('[data-gantt-side="1"]');
  var header   = root.querySelector('[data-gantt-header="1"]');
  var timeline = root.querySelector('[data-gantt-timeline="1"]');
  if (!side || !header || !timeline) return;

  var syncing = false;

  timeline.addEventListener('scroll', function () {
    if (syncing) return;
    syncing = true;
    if (side.scrollTop !== timeline.scrollTop) side.scrollTop = timeline.scrollTop;
    if (header.scrollLeft !== timeline.scrollLeft) header.scrollLeft = timeline.scrollLeft;
    syncing = false;
  });

  side.addEventListener('scroll', function () {
    if (syncing) return;
    syncing = true;
    if (timeline.scrollTop !== side.scrollTop) timeline.scrollTop = side.scrollTop;
    syncing = false;
  });
})();
