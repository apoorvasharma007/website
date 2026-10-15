const rows = [...document.querySelectorAll<HTMLElement>('.row')];
const narrow = matchMedia('(hover:none),(max-width:899px)');
let marked: HTMLElement | undefined;
let queued = false;

// The focus line slides from 30% of the screen at the top of the page to the bottom edge at the end,
// so the last row can be reached. Progress is clamped, so iOS overscroll cannot move it.
function markFocusRow() {
  queued = false;
  const reach = document.documentElement.scrollHeight - innerHeight;
  const progress = reach > 0 ? Math.min(Math.max(scrollY / reach, 0), 1) : 0;
  const line = innerHeight * (0.3 + 0.7 * progress);
  let best: HTMLElement | undefined;
  let bestDistance = Infinity;
  if (narrow.matches) {
    for (const row of rows) {
      const box = row.getBoundingClientRect();
      if (box.bottom < 0 || box.top > innerHeight) continue;
      const distance = Math.abs(box.top + box.height / 2 - line);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = row;
      }
    }
  }
  if (best === marked) return;
  marked?.classList.remove('on');
  best?.classList.add('on');
  marked = best;
}

function queue() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(markFocusRow);
}

addEventListener('scroll', queue, { passive: true });
addEventListener('resize', queue);
markFocusRow();
