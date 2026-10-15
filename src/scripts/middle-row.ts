const rows = [...document.querySelectorAll<HTMLElement>('.row')];
const narrow = matchMedia('(hover:none),(max-width:899px)');
let marked: HTMLElement | undefined;
let queued = false;

const visible = (row: HTMLElement) => {
  const box = row.getBoundingClientRect();
  return box.bottom > 0 && box.top < innerHeight;
};

// The row nearest the middle of the screen is lit, on short pages too. At the very end of the page the last row is lit,
// since it may never reach the middle; iOS overscroll counts as the end, so it cannot bounce back.
function markFocusRow() {
  queued = false;
  let best: HTMLElement | undefined;
  const reach = document.documentElement.scrollHeight - innerHeight;
  if (narrow.matches) {
    const last = rows.at(-1);
    if (last && reach > 8 && scrollY >= reach - 2 && visible(last)) best = last;
    else {
      let bestDistance = innerHeight * 0.4;
      for (const row of rows) {
        const box = row.getBoundingClientRect();
        const distance = Math.abs(box.top + box.height / 2 - innerHeight / 2);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = row;
        }
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

// iOS Safari only styles :active when some touch listener exists on the page.
document.addEventListener('touchstart', () => {}, { passive: true });
