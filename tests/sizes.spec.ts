import { expect, test } from '@playwright/test';

const screens = [
  { name: 'small phone', width: 320, height: 568 },
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 17', width: 393, height: 852 },
  { name: 'large phone', width: 430, height: 932 },
  { name: 'tablet portrait', width: 768, height: 1024 },
  { name: 'tablet landscape', width: 1024, height: 768 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'laptop large', width: 1536, height: 864 },
  { name: 'desktop', width: 1920, height: 1080 },
];

const pages = [
  '/',
  '/about/',
  '/contact/',
  '/tech/',
  '/fitness/',
  '/blog/',
  '/tech/blog/building-traininglogs/',
  '/tech/projects/traininglogs/',
  '/tech/knowledge-base/system-design/caching/',
  '/fitness/knowledge-base/training/foundations/principles/',
];

for (const screen of screens) {
  for (const path of pages) {
    test(`${path} fits ${screen.name} (${screen.width}px) with no sideways scroll`, async ({ page }) => {
      await page.setViewportSize({ width: screen.width, height: screen.height });
      await page.goto(path);
      await expect(page.locator('footer')).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
    });
  }
}
