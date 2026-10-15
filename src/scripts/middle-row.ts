const rows = [...document.querySelectorAll<HTMLElement>('.row')];
const touch = matchMedia('(hover:none)');
let marked: HTMLElement | undefined;
let queued = false;

const visible = (row: HTMLElement) => {
  const box = row.getBoundingClientRect();
  return box.bottom > 0 && box.top < innerHeight;
};

// Touch screens have no hover, so one row is lit instead: the first at the top of the page, the last at
// the bottom (overscroll counts as the ends, so rubber-banding cannot flip it), otherwise the row nearest
// the middle of the screen. Mouse users get the hover glow only.
function markFocusRow() {
  queued = false;
  let best: HTMLElement | undefined;
  if (touch.matches) {
    const reach = document.documentElement.scrollHeight - innerHeight;
    const end = scrollY <= 2 ? rows[0] : reach > 8 && scrollY >= reach - 2 ? rows.at(-1) : undefined;
    if (end && visible(end)) best = end;
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
