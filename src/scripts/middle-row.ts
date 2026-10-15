const rows = document.querySelectorAll<HTMLElement>('.row');
const narrow = matchMedia('(hover:none),(max-width:899px)');

function markMiddleRow() {
  rows.forEach((r) => r.classList.remove('on'));
  if (!narrow.matches) return;
  const middle = innerHeight / 2;
  let best: HTMLElement | null = null;
  let bestDistance = Infinity;
  rows.forEach((r) => {
    const box = r.getBoundingClientRect();
    const distance = Math.abs(box.top + box.height / 2 - middle);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = r;
    }
  });
  if (best && bestDistance < innerHeight * 0.35) (best as HTMLElement).classList.add('on');
}

addEventListener('scroll', markMiddleRow, { passive: true });
addEventListener('resize', markMiddleRow);
markMiddleRow();
