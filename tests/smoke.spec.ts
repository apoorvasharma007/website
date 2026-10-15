import { expect, test } from '@playwright/test';

const pages = ['/', '/404.html'];

for (const path of pages) {
  test(`${path} has the shared footer and no horizontal scroll`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);
    await expect(page.locator('footer')).toContainText(
      `© ${new Date().getFullYear()} Apoorva Sharma. All Rights Reserved.`,
    );
    await expect(page.getByRole('navigation', { name: 'Footer' }).getByRole('link')).toHaveText([
      'Home',
      'Contact',
    ]);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
}

test('home lists both sides and the four nav links', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("Hi, I'm Apoorva.");
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link')).toHaveText([
    'Tech',
    'Fitness',
    'About',
    'Contact',
  ]);
  await expect(page.locator('.row')).toHaveCount(2);
});

test('phone shows one scene at a time and tabs switch it', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const tech = page.locator('.scene[data-side="tech"]');
  const fit = page.locator('.scene[data-side="fit"]');
  await expect(tech).toBeVisible();
  await expect(fit).toBeHidden();
  await page.getByRole('tab', { name: 'Training Movement' }).click();
  await expect(fit).toBeVisible();
  await expect(tech).toBeHidden();
  await expect(page.getByRole('tab', { name: 'Training Movement' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

test('laptop shows both scenes side by side', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.scene[data-side="tech"]')).toBeVisible();
  await expect(page.locator('.scene[data-side="fit"]')).toBeVisible();
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

test('the phone scene moves, including after switching tabs', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  for (const tab of ['Engineering Systems', 'Training Movement']) {
    await page.getByRole('tab', { name: tab }).click();
    const art = page.locator('.scene.on .art');
    const first = await art.screenshot();
    await page.waitForTimeout(1500);
    const second = await art.screenshot();
    expect(first.equals(second), `${tab} art changed between frames`).toBe(false);
  }
});
