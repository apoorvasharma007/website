import { expect, test } from '@playwright/test';

const chapter = '/tech/knowledge-base/system-design/caching/';
const book = '/tech/knowledge-base/system-design/';
const article = '/tech/blog/building-traininglogs/';
const bareArticle = '/fitness/blog/building-a-sustainable-training-habit/';
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
  await expect(pager.getByRole('link')).toHaveText(['Previous']);
  await expect(pager.getByRole('link')).toHaveAttribute('aria-label', 'Previous: Databases');
});

test('middle chapter links to both neighbours', async ({ page }) => {
  await page.goto('/tech/knowledge-base/system-design/databases/');
  await expect(
    page.getByRole('navigation', { name: 'Previous and Next' }).getByRole('link'),
  ).toHaveText(['Previous', 'Next']);
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
  await expect(page.locator('.items .card strong')).toHaveText([
    'Scalability',
    'Databases',
    'Caching Strategies',
  ]);
  await expect(page.locator('[data-ol]')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Previous and Next' })).toHaveCount(0);

  await page.goto('/fitness/knowledge-base/training/');
  await expect(page.locator('.items > *')).toHaveCount(4);
  await expect(page.locator('.items .section h2')).toHaveText('Foundations');
  await expect(page.locator('.items .card strong')).toHaveText([
    'Core Training Principles',
    'Session Structure',
    'Progression Models',
  ]);
});

test('article has Previous only, outline from its headings', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(article);
  const pager = page.getByRole('navigation', { name: 'Previous and Next' });
  await expect(pager.getByRole('link')).toHaveText(['Previous']);
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

test('Tech on Home opens the Tech overview, whose rows lead to real pages', async ({ page }) => {
  await page.goto('/');
  await page.locator('.row[data-side="tech"]').click();
  await expect(page).toHaveURL('/tech/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Overview');
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toHaveText('Tech/Overview');
  await expect(page.locator('.rows .word')).toHaveText([
    'Knowledge Base',
    'Projects',
    'DemosSoon',
    'TutorialsSoon',
    'Blog',
  ]);
  await page.locator('.rows .row', { hasText: 'Knowledge Base' }).click();
  await expect(page).toHaveURL('/tech/knowledge-base/system-design/');
});

test('Fitness overview links the dashboard out and has no dead rows', async ({ page }) => {
  await page.goto('/fitness/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Overview');
  const dashboard = page.locator('.rows .row', { hasText: 'Dashboard' });
  await expect(dashboard).toHaveAttribute('href', 'https://apoorvasharma007.github.io/traininglogs/');
  await expect(dashboard).toHaveAttribute('target', '_blank');
  await expect(page.locator('.rows .row.soon')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toHaveText('Fitness/Overview');
});

test('blog lists posts newest first, as separate cards, per side and for both', async ({ page }) => {
  await page.goto('/tech/blog/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tech Blog');
  await expect(page.locator('#side')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link')).toHaveText([
    'Tech',
    'Fitness',
    'Blog',
    'About',
    'Contact',
  ]);
  await expect(page.locator('.items .card strong')).toHaveText([
    'Building traininglogs: A Python Pipeline for My Gym Data',
    'Testing in Python: What to Test and What to Skip',
  ]);
  await expect(page.locator('.items .card').first()).toContainText('2 Apr 2026');

  await page.goto('/fitness/blog/');
  await expect(page.locator('.items .card strong')).toHaveText(['Building a Sustainable Training Habit']);

  await page.goto('/blog/');
  await expect(page.locator('.items .card')).toHaveCount(3);
  await expect(page.locator('.items .card').first()).toContainText('Tech, 2 Apr 2026');
});

test('sidebar has no Home item and lists no posts, only a Blog link', async ({ page }) => {
  await page.goto('/tech/blog/building-traininglogs/');
  const tree = page.getByRole('navigation', { name: 'Pages' });
  await expect(tree.getByRole('link', { name: 'Home' })).toHaveCount(0);
  await expect(tree.getByRole('link', { name: 'Building traininglogs' })).toHaveCount(0);
  await expect(tree.getByRole('link', { name: 'Blog' }).first()).toHaveAttribute('href', '/tech/blog/');
  await expect(page.getByRole('link', { name: 'Apoorva Sharma' })).toHaveAttribute('href', '/');
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Blog' })).toHaveAttribute(
    'href',
    '/tech/blog/',
  );
});

test('sidebar never scrolls sideways', async ({ page }) => {
  for (const path of [chapter, article, fitChapter]) {
    await page.goto(path);
    const over = await page.locator('.side-nav').evaluate((el) => el.scrollWidth - el.clientWidth);
    expect(over).toBe(0);
  }
});

test('Home footer is only the copyright, other pages keep Home and Contact', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Footer' })).toHaveCount(0);
  await expect(page.locator('footer')).toContainText('All Rights Reserved.');
  await page.goto('/404.html');
  await expect(page.getByRole('navigation', { name: 'Footer' }).getByRole('link')).toHaveText(['Home', 'Contact']);
});

test('the focus row on a phone moves down with the scroll, never jumps back, and reaches the last row', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/fitness/');
  const rows = page.locator('.rows .row');
  const count = await rows.count();
  const reach = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const seen: number[] = [];
  for (let y = 0; y <= reach; y += 40) {
    await page.evaluate((top) => scrollTo(0, top), y);
    await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
    const on = await rows.evaluateAll((all) => all.flatMap((r, i) => (r.classList.contains('on') ? [i] : [])));
    expect(on.length).toBeLessThanOrEqual(1);
    if (on.length === 1) seen.push(on[0]);
  }
  expect(seen).toEqual([...seen].sort((a, b) => a - b));
  expect(seen.at(-1)).toBe(count - 1);
});

test('cards stay small on a phone however long the text is', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/tech/blog/', '/tech/knowledge-base/system-design/']) {
    await page.goto(path);
    for (const height of await page.locator('.items .card').evaluateAll((all) => all.map((c) => c.getBoundingClientRect().height))) {
      expect(height).toBeLessThan(150);
    }
  }
});

test('a section heading is bigger than the chapter cards under it', async ({ page }) => {
  await page.goto('/fitness/knowledge-base/training/');
  const section = await page.locator('.items .section h2').evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  const card = await page.locator('.items .card strong').first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(section).toBeGreaterThan(card * 1.3);
});

test('the top nav stays on screen while scrolling Home, Blog and a content page', async ({ page }) => {
  for (const path of ['/', '/blog/', '/tech/knowledge-base/system-design/caching/']) {
    await page.goto(path);
    await page.evaluate(() => scrollTo(0, 1e6));
    await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
    const top = await page.locator('header').first().evaluate((el) => el.getBoundingClientRect().top);
    expect(top).toBe(0);
  }
});
