import { expect, test } from '@playwright/test';

const chapter = '/tech/knowledge-base/system-design/caching/';
const book = '/tech/knowledge-base/system-design/';
const article = '/tech/articles/building-traininglogs/';
const bareArticle = '/fitness/articles/building-a-sustainable-training-habit/';
const project = '/tech/projects/traininglogs/';
const program = '/fitness/programs/morning-sunlight/';
const fitChapter = '/fitness/knowledge-base/training/foundations/principles/';

const everyPage = [chapter, book, article, bareArticle, project, program, fitChapter];

for (const path of everyPage) {
  test(`${path} has the footer and no sideways scroll at 390`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);
    await expect(page.locator('footer')).toContainText('All Rights Reserved.');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
}

test('chapter shows breadcrumb, callout, table, code, and only a Previous link', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(chapter);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Caching Strategies');
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toHaveText(
    'Tech/Knowledge Base/System Design/Caching Strategies',
  );
  await expect(page.locator('.note b')).toHaveText('Note');
  await expect(page.locator('.tbl table').first()).toBeVisible();
  await expect(page.locator('.code-h span').first()).toHaveText('python');
  const pager = page.getByRole('navigation', { name: 'Previous and Next' });
  await expect(pager.getByRole('link')).toHaveText(['PreviousDatabases']);
});

test('middle chapter links to both neighbours', async ({ page }) => {
  await page.goto('/tech/knowledge-base/system-design/databases/');
  await expect(
    page.getByRole('navigation', { name: 'Previous and Next' }).getByRole('link'),
  ).toHaveText(['PreviousScalability', 'NextCaching Strategies']);
});

test('Copy puts the code on the clipboard and says so', async ({ page, context, browserName }) => {
  if (browserName === 'chromium') await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(chapter);
  const copy = page.locator('.copy').first();
  await copy.click();
  await expect(copy).toHaveText('Copied');
  if (browserName === 'chromium') {
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('def get_user');
  }
  await expect(copy).toHaveText('Copy');
});

test('book page lists its chapters and section headings, with no outline or pager', async ({ page }) => {
  await page.goto(book);
  await expect(page.locator('.chapters .row strong')).toHaveText([
    'Scalability',
    'Databases',
    'Caching Strategies',
  ]);
  await expect(page.locator('[data-ol]')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Previous and Next' })).toHaveCount(0);

  await page.goto('/fitness/knowledge-base/training/');
  await expect(page.locator('.chapters > *')).toHaveCount(4);
  await expect(page.locator('.chapters .heading')).toHaveText('Foundations');
});

test('article has Previous only, outline from its headings', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(article);
  const pager = page.getByRole('navigation', { name: 'Previous and Next' });
  await expect(pager.getByRole('link')).toHaveText([/^Previous/]);
  const outline = page.getByRole('navigation', { name: 'On This Page' }).last();
  await expect(outline).toBeVisible();
  await expect(outline.getByRole('link')).toHaveCount(4);
});

test('a page with fewer than two headings has no outline', async ({ page }) => {
  await page.goto(bareArticle);
  await expect(page.locator('[data-ol]')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Previous and Next' })).toHaveCount(0);
});

test('outline sits beside the text on a laptop and above it on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(chapter);
  const above = page.locator('nav[data-ol].inline');
  const beside = page.locator('nav[data-ol]:not(.inline)');
  await expect(above).toBeHidden();
  await expect(beside).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(above).toBeVisible();
  await expect(beside).toBeHidden();
});

test('outline follows the section in view', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(chapter);
  const outline = page.getByRole('navigation', { name: 'On This Page' }).last();
  await expect(outline.getByRole('link', { name: 'Cache-Aside (Lazy Loading)' })).toHaveClass(/on/);
  await outline.getByRole('link', { name: 'Write-Through' }).click();
  await expect(outline.getByRole('link', { name: 'Write-Through' })).toHaveClass(/on/);
  await expect(outline.getByRole('link', { name: 'Cache-Aside (Lazy Loading)' })).not.toHaveClass(/on/);
});

test('project shows only the links that are filled in', async ({ page }) => {
  await page.goto(project);
  const links = page.locator('.card');
  await expect(links).toHaveText([/^Source/, /^Docs/, /^Live/]);
  await expect(links.first()).toHaveAttribute('href', 'https://github.com/apoorvasharma007/traininglogs');
});

test('program lists its sources and takes the Fitness colour', async ({ page }) => {
  await page.goto(program);
  await expect(page.locator('.card')).toHaveText([/^Huberman Lab/]);
  const accent = await page
    .locator('.app')
    .evaluate((el) => getComputedStyle(el).getPropertyValue('--accent').trim());
  expect(accent).toBe('#f0289c');
});

test('only the group holding the current page is open', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(chapter);
  const tree = page.getByRole('navigation', { name: 'Pages' });
  await expect(tree.getByRole('button', { name: 'Tech' })).toHaveAttribute('aria-expanded', 'true');
  await expect(tree.getByRole('button', { name: 'Fitness' })).toHaveAttribute('aria-expanded', 'false');
  await expect(tree.getByRole('link', { name: 'Caching Strategies' })).toHaveAttribute('aria-current', 'page');
  await expect(tree.getByRole('link', { name: 'Training' })).toBeHidden();
  await tree.getByRole('button', { name: 'Fitness' }).click();
  await expect(tree.getByRole('link', { name: 'Dashboard' })).toBeVisible();
});

test('phone menu slides in, and Escape closes it', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(chapter);
  const side = page.locator('#side');
  await expect(side).toBeHidden();
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(side).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(side).toBeHidden();
});

test('breadcrumb shortens to parent and current on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(fitChapter);
  const crumb = page.getByRole('navigation', { name: 'Breadcrumb' });
  await expect(crumb.locator('a:visible, span:visible')).toHaveText(['Foundations', 'Core Training Principles']);
});

test('theme toggle works in the shell and the choice persists', async ({ page }) => {
  await page.goto(chapter);
  await page.getByRole('button', { name: 'Switch theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.goto(book);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});
