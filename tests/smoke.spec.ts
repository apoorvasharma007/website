import { expect, test } from '@playwright/test';

const pages = ['/', '/404.html'];

for (const path of pages) {
  test(`${path} has the shared footer and no horizontal scroll`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);
    await expect(page.locator('footer')).toContainText(
      `© ${new Date().getFullYear()} Apoorva Sharma. All Rights Reserved.`,
    );
    if (path === '/404.html') {
      await expect(page.getByRole('navigation', { name: 'Footer' }).getByRole('link')).toHaveText([
        'Home',
        'About',
        'Contact',
      ]);
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
}

test('home has no top nav, three rows, and the name only once', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("Hi, I'm Apoorva.");
  await expect(page.locator('header')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Main' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Apoorva Sharma' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Switch theme' })).toBeVisible();
  await expect(page.locator('.row .display')).toHaveText(['Tech', 'Fitness', 'Blog']);
});

const sceneIndex = (page: import('@playwright/test').Page) =>
  page.locator('.scenes').evaluate((el) => Math.round(el.scrollLeft / el.clientWidth));

test('phone: both phrases show at once, tapping one moves the carousel and the lit phrase follows', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const picks = page.getByRole('tab');
  await expect(picks).toHaveText(['I likeBuilding Tech', 'I loveWorking Out']);
  for (const pick of await picks.all()) await expect(pick).toBeVisible();
  await expect(picks.nth(0)).toHaveAttribute('aria-selected', 'true');
  await picks.nth(1).click();
  await expect.poll(() => sceneIndex(page)).toBe(1);
  await expect(picks.nth(1)).toHaveAttribute('aria-selected', 'true');
  await picks.nth(0).click();
  await expect.poll(() => sceneIndex(page)).toBe(0);
  await expect(picks.nth(0)).toHaveAttribute('aria-selected', 'true');
});

test('phone: both phrases fit on one line each from 360px up', async ({ page }) => {
  for (const width of [360, 390, 430]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    for (const pick of await page.locator('.pick').all()) {
      const line = await pick.locator('.phrase').evaluate((el) => el.getBoundingClientRect().height);
      const overflow = await pick.evaluate((el) => el.scrollWidth - el.clientWidth);
      expect(line).toBeLessThan(50);
      expect(overflow).toBeLessThanOrEqual(0);
    }
  }
});

test('the hero keeps Inter for the name and phrases and uses Kalam only for the two small stickers', async ({ page }) => {
  const style = (selector: string) =>
    page.locator(selector).first().evaluate((el) => {
      const css = getComputedStyle(el);
      return { size: parseFloat(css.fontSize), family: css.fontFamily };
    });
  for (const [width, sticker, phrase] of [[390, '.pick .sticker', '.pick .phrase'], [1280, '.scene .sticker', '.scene h2']] as const) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    const [name, small, big] = [await style('.hero-name'), await style(sticker), await style(phrase)];
    expect(name.family).not.toContain('Kalam');
    expect(big.family).not.toContain('Kalam');
    expect(small.family).toContain('Kalam');
    expect(small.size).toBeLessThan(big.size);
    expect(name.size).toBeGreaterThan(big.size);
  }
});

test('phone: both phrases sit side by side with the underline under the lit one', async ({ page }) => {
  for (const width of [360, 390, 430]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    const boxes = await page.locator('.pick').evaluateAll((all) => all.map((el) => {
      const phrase = el.querySelector('.phrase')!.getBoundingClientRect();
      const box = el.getBoundingClientRect();
      return { top: Math.round(phrase.top), right: phrase.right, left: phrase.left, boxLeft: box.left, boxRight: box.right, height: phrase.height };
    }));
    expect(boxes[0].top).toBe(boxes[1].top);
    expect(boxes[0].right).toBeLessThan(boxes[1].left);
    for (const box of boxes) {
      expect(box.height).toBeLessThan(40);
      expect(box.left).toBeGreaterThanOrEqual(box.boxLeft);
      expect(box.right).toBeLessThanOrEqual(box.boxRight);
    }
  }
});

test('phone: the underline follows the swipe', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const barX = () => page.locator('.bar').evaluate((el) => el.getBoundingClientRect().left);
  const start = await barX();
  await page.getByRole('tab').nth(1).click();
  await expect.poll(barX).toBeGreaterThan(start + 100);
});

test('laptop: both headings sit on one line so the art lines up', async ({ page }) => {
  for (const width of [1100, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const tops = await page.locator('.scene .stage').evaluateAll((all) => all.map((el) => Math.round(el.getBoundingClientRect().top)));
    expect(tops[0]).toBe(tops[1]);
  }
});

test('laptop shows both scenes side by side', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.scene[data-side="tech"]')).toBeVisible();
  await expect(page.locator('.scene[data-side="fit"]')).toBeVisible();
  await expect(page.locator('.dots')).toBeHidden();
});

test('theme defaults to dark, toggles to light, and the choice persists', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'light');
  const dark = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(dark).toBe('rgb(10, 10, 11)');
  await page.getByRole('button', { name: 'Switch theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  const light = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(light).toBe('rgb(255, 255, 255)');
});

test('reduced motion leaves no running animations on the rows', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const running = await page.evaluate(() => document.getAnimations().length);
  expect(running).toBe(0);
});

test('404 shows the message and a single Home button', async ({ page }) => {
  await page.goto('/movement/old-page/');
  await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
  await expect(page.locator('.cta a')).toHaveText(['Home']);
});

for (const [file, count] of [
  ['whack-a-bug', 66],
  ['clean-and-jerk', 74],
] as const) {
  test(`${file}.svg keeps all ${count} of its animations after minifying`, async ({ page }) => {
    await page.goto(`/art/${file}.svg`);
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(count);
  });
}

test('both hero scenes visibly move on the laptop layout', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  for (const side of ['tech', 'fit']) {
    const art = page.locator(`.scene[data-side="${side}"] .art`);
    await art.scrollIntoViewIfNeeded();
    const first = await art.screenshot();
    await page.waitForTimeout(1500);
    const second = await art.screenshot();
    expect(first.equals(second), `${side} art changed between frames`).toBe(false);
  }
});

test('the phone scene art moves, including after switching scenes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  for (const index of [0, 1]) {
    await page.getByRole('tab').nth(index).click();
    await expect.poll(() => sceneIndex(page)).toBe(index);
    await page.waitForTimeout(400);
    const art = page.locator('.scene.on .art');
    const first = await art.screenshot();
    await page.waitForTimeout(1500);
    const second = await art.screenshot();
    expect(first.equals(second), `scene ${index} art changed between frames`).toBe(false);
  }
});

test.describe('phone carousel autoplay', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  const sceneIndex = (page: import('@playwright/test').Page) =>
    page.locator('.scenes').evaluate((el) => Math.round(el.scrollLeft / el.clientWidth));

  test('slides to Working Out after about 7 seconds, slowly, then back to Building Tech 8 seconds later', async ({ page }) => {
    await page.clock.install({ time: 0 });
    await page.clock.pauseAt(1000);
    await page.goto('/');
    await page.locator('.scene img').first().evaluate((img: HTMLImageElement) => img.decode());
    await page.clock.runFor(6500);
    expect(await sceneIndex(page)).toBe(0);
    await page.clock.runFor(1000);
    const mid = await page.locator('.scenes').evaluate((el) => el.scrollLeft / el.clientWidth);
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(1);
    await page.clock.runFor(1200);
    expect(await sceneIndex(page)).toBe(1);
    await expect(page.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
    await page.clock.runFor(8000);
    expect(await sceneIndex(page)).toBe(0);
    await expect(page.getByRole('tab').nth(0)).toHaveAttribute('aria-selected', 'true');
    await page.clock.runFor(8000);
    expect(await sceneIndex(page)).toBe(1);
  });


  test('a touch on the scene cancels it', async ({ page }) => {
    await page.clock.install({ time: 0 });
    await page.clock.pauseAt(1000);
    await page.goto('/');
    await page.locator('.scene img').first().evaluate((img: HTMLImageElement) => img.decode());
    await page.locator('.scenes').dispatchEvent('touchstart');
    await page.clock.runFor(10000);
    expect(await sceneIndex(page)).toBe(0);
  });

  test('it does not run with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.clock.install({ time: 0 });
    await page.clock.pauseAt(1000);
    await page.goto('/');
    await page.clock.runFor(10000);
    expect(await sceneIndex(page)).toBe(0);
  });

  test('the captions are plain text in the same size as every other description, and the fitness art is mirrored', async ({ page }) => {
    await page.goto('/');
    const caption = await page.locator('.caption').first().evaluate((el) => {
      const css = getComputedStyle(el);
      return { family: css.fontFamily, size: css.fontSize };
    });
    expect(caption.family).not.toContain('Kalam');
    const row = await page.locator('.row-desc').first().evaluate((el) => getComputedStyle(el).fontSize);
    expect(caption.size).toBe(row);
    await expect(page.locator('.scene').nth(1).locator('img')).toHaveAttribute('src', '/art/clean-and-jerk.svg');
    const svg = await (await page.request.get('/art/clean-and-jerk.svg')).text();
    expect(svg).toContain('scale(-1 1)');
  });

});

test('about shows its four sections and the résumé button', async ({ page }) => {
  await page.goto('/about/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('About');
  await expect(page.getByRole('heading', { level: 2 })).toHaveText(['Who I am', 'What I do', 'What I train', 'Where to find me']);
  await expect(page.getByRole('link', { name: 'Résumé' })).toHaveAttribute('href', '/resume.pdf');
});

test('contact shows the email with a working copy button and no overflow on a phone', async ({ page, context, browserName }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/contact/');
  await expect(page.getByRole('link', { name: 'apoorva.c.sharma@gmail.com' })).toHaveAttribute('href', 'mailto:apoorva.c.sharma@gmail.com');
  if (browserName === 'chromium') await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copy' }).click();
  await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible();
  if (browserName === 'chromium') expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('apoorva.c.sharma@gmail.com');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});
