import { expect, test } from '@playwright/test';

// Touch gestures are synthesized through the Chromium protocol, so this file runs in the chromium project only.
const sceneIndex = (page: import('@playwright/test').Page) =>
  page.locator('.scenes').evaluate((el) => Math.round(el.scrollLeft / el.clientWidth));

test('phone: a finger swipe over the scene moves to the other scene and back', async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  const cdp = await context.newCDPSession(page);
  const swipe = (xDistance: number) =>
    cdp.send('Input.synthesizeScrollGesture', { x: 195, y: 520, xDistance, yDistance: 0, gestureSourceType: 'touch', speed: 900 });
  await swipe(-260);
  await expect.poll(() => sceneIndex(page)).toBe(1);
  await expect(page.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
  await swipe(260);
  await expect.poll(() => sceneIndex(page)).toBe(0);
  await context.close();
});
