# Website rebuild plan: Hugo to Astro, Notion-fed, Cloudflare Pages

Status: approved 2026-10-14 (decisions 1-8, CLAUDE.md rule changes, branch naming).

## Goal and motivation

The site looks static and dated, and it can't take drafts from the Notion pipeline (see
`~/Projects/alfred/plans/pipeline-plan.md`, step 9). Rebuild it on Astro: static pages by default, React only
where a page needs interaction. Give it a Notion-like reading design across article-type pages,
pull published Notion pages through the official API, rebuild twice a day, and deploy to
Cloudflare Pages so every PR gets a free preview link.

## Decisions (proposed)

| # | Decision | Status |
|---|---|---|
| 1 | Framework: Astro. Content-first, ships 0 JS by default, React islands for interactive parts (shadcn, Motion) | Approved |
| 2 | Design: Notion-like reading style (type, spacing, callouts, toggles) for every article-type page: blog, KB, training, programs, nutrition, tech/project pages. Homepage and Work with me get their own designed layouts on the same tokens | Approved |
| 3 | Notion to site: official `@notionhq/client` + `notion-to-md` into Astro content collections. Not `react-notion-x` (unofficial API, heavy JS). Images downloaded at build (Notion image URLs expire) | Approved |
| 4 | Hosting: Cloudflare Pages free plan (500 builds/mo, PR previews). Scheduled GitHub Action rebuilds twice a day (~60 builds/mo) | Approved |
| 5 | Existing 54 Markdown pages migrate as-is into Astro content; Notion is for new pages only. No bulk move of old pages into Notion | Approved |
| 6 | Every current URL and alias keeps working (redirects file) | Approved |
| 7 | Perf budget gate in CI (first load JS budget, Lighthouse) | Approved, numbers TBD |
| 8 | Notion token only as a GitHub Actions / Cloudflare secret, never in the repo | Approved |
| 9 | IA (2026-10-14): two equal sides, Tech and Fitness, plus About and Contact. Tech: knowledge bases (AI, System Design, Coding), projects, demos, tutorials, articles. Fitness: knowledge bases (Training, Nutrition, Programming), programs, dashboard, articles. Home is a single timeline mixing commits and training sessions. Blog is no longer its own section. Radical visual redesign from scratch, no carry-over from the Wave 4 look | Approved (page set); look pending mockup |
| 10 | Visual direction locked 2026-10-14. Dark docs shell for knowledge bases, articles and projects (text-led pages with embedded video and demos): artifact https://claude.ai/artifact/EATnq7F4r6e33J5wKYkhwE, file `mockups/astro-rebuild/docs-shell.html`. Landing 1.0 locked: the "Reveal" treatment, a centered hero with four floating cards, then Tech and Fitness as huge hover-reveal rows, then a contact and social footer. File `mockups/astro-rebuild/landing-v1.html`, artifact https://claude.ai/artifact/QC1vVJF4HUVnzsd7w5q93f. The earlier hero-plus-two-tiles first pass is kept as `landing-v0-first-pass.html` (artifact https://claude.ai/artifact/PzurXRkU4NXA22Y3vcuCWZ). Dark default with light toggle, Inter, muted blue for Tech and amber for Fitness. Landing links YouTube and Instagram, which reverses the July rule that the site never links Instagram | Approved |
| 11 | Confirmed 2026-10-15. Row focus is a static glow from the left, sweep style: Fitness magenta to violet (#F0289C to #7A3CFF), Tech electric blue (#3B82FF to #00D1FF); the full-row color wipe is dropped. These colors replace yellow and pink for dots, labels and the outline across the whole site. Resume button stays bright yellow (#FFE600) with dark text. Title Case on every heading and label. Search is left out of the first build. Landing art: a clean-and-jerk animation (plates 2, 4, 6, 8, Wham! at the lockout, PR animation on the 8-plate rep) and a Neo-style dodge of an android's lasers, same anime-style character, neon night scene. Sketch artifacts: glow https://claude.ai/artifact/GSNxnVbkycnitWKmwomfSv, animations https://claude.ai/artifact/JSrFCATp3GpLGSfi2wYbi5. Still open: what replaces the uppercase monospace labels, and the character's look | Approved except the open items |

## `website/CLAUDE.md` rule changes (approved 2026-10-14)

- "No JS — do not introduce JavaScript" → replace with the island rule + perf budget
- "No Notion — KB content stays in Hugo markdown" → replaced by decisions 3 and 5
- "Do not modify the deploy workflow without explicit instruction" → this plan replaces it; each change shown first
- Wave 4 constraint "No JavaScript for any visual/animation effect (CSS-only)" → conflicts with using
  Motion; decide per effect at the mockup step
- Wave 4 constraints "One UI font (Inter)", "One accent color (#C83C29)", tokens-only styling → keep or
  change is a mockup-step decision
- Stack/Commands/Structure sections rewritten for Astro at the end

## Blast radius

| Touched | How |
|---|---|
| `website` repo | New Astro project replaces Hugo (`layouts/`, `assets/`, `config.toml`, `archetypes/`) |
| `content/` (54 .md files, 14 with aliases) | Moved into Astro content collections; front matter mapped |
| `.github/workflows/deploy.yml` | Replaced: build + deploy to Cloudflare, schedule twice a day, traininglogs dashboard copy kept |
| Shortcodes / render hooks | `youtube` shortcode and `> [!note]` callouts re-done as Astro components / remark plugin |
| DNS (Hostinger) | `apoorvasharma7.com` moves from GitHub Pages to Cloudflare Pages at cutover |
| Notion | Read-only integration on the pipeline database |
| `website/CLAUDE.md` | Rewritten for the new stack |

## Steps

- [x] 1. Approve this plan: decisions, names, branch naming (2026-10-14)
- [x] 2. Design mockups for every page, approved and locked (2026-10-15). Spec `website-build-spec.md`, prototype `mockups/astro-rebuild/site-final.html`
- [x] 3. (Done 2026-10-15 locally, Cloudflare part moved to `website-deploy-plan.md` Phase 2) Scaffold Astro + Cloudflare Pages; tokens, shell, Home, 404, robots, sitemap; PR preview working (detail below)
- [x] 4. (Done 2026-10-15 locally, detail below) Page layouts and body components for Knowledge Base chapter and book, Article, Project, Program (callout, table, code with copy, YouTube embed, video and demo slots, Previous and Next, Links, Sources)
- [x] 5. (Done 2026-10-21, scope cut by Apoorva) No bulk migration. Launch keeps the 14 pages already in Astro minus 3 dropped, plus a website project stub. `scripts/make_redirects.py` writes `static/_redirects` (58 rules) from `scripts/old-urls.txt`, the live sitemap snapshot
- [x] 6. (Done 2026-10-16) Overview pages, tree and breadcrumb generated from the hierarchy, About and Contact with Apoorva's approved copy
- [x] 7. (Done 2026-10-21, inside the redirects file) `/dashboard/` and `/movement/dashboard/` redirect to the traininglogs dashboard
- [ ] 8. Notion loader on the one content database (fields in the spec), Draft and Published, scheduled build twice a day
- [ ] 9. Perf gate in CI (first-load JS at most 120 KB, Lighthouse mobile 95 or higher)
- [ ] 10. Cutover: DNS to Cloudflare (needs explicit yes, each DNS change shown first), verify, retire the GitHub Pages deploy; confirm AI-crawler blocking in Cloudflare
- [ ] 11. Rewrite `website/CLAUDE.md`

Branches (proposed): base `refactor/astro-rebuild` cut from `main` (this repo has no `dev`),
sub-branches `refactor/astro-rebuild-N-<step>`, squash-merged back; base merges to `main` at cutover.

## Step 3 detail (proposed, awaiting Apoorva's yes)

Sub-branch `refactor/astro-rebuild-3-scaffold` from the base branch. Hugo files stay until step 5 deletes them, so the old site and its content remain available. The deploy workflow only runs on `main`, so nothing here goes live.

1. Astro minimal template in the repo root, TypeScript strict, `@astrojs/sitemap`. No React yet. The phone tabs and the mid-screen row glow are small vanilla scripts.
2. `src/styles/tokens.css` and `global.css` from the spec: dark default and light theme, side colors, text tones (descriptions #D0D2D8, nav #A4A7AF, small #868991; light #2A2C32, #484A52, #6B6D75), Inter with display=swap, 13px label style, system monospace for code only.
3. Components: Header (one grid, two rows on phone), Footer (same on every page), ThemeToggle (inline script, localStorage in try/catch, no flash), Skip To Content link. Layouts `FullLayout` (Home, About, Contact, 404) and `ShellLayout` (tree, breadcrumb, outline slots, tree data placeholder).
4. Home exactly as `site-final.html`: hero with spotlight scenes, phone tabs, rows with the sweep glow, Say Hello, footer. The two SVGs minified with svgo and lazy-loaded; one still frame under reduced motion.
5. 404 page, `robots.txt` (AI crawlers disallowed), sitemap, favicon (AS mark), no-AI-training meta tag, one shared preview image.
6. Cloudflare Pages project connected to the repo so the branch gets a private preview URL. This needs Apoorva's Cloudflare account and his action to connect. No DNS change.
7. Gate before squash-merge: `astro check` and build pass, a Playwright smoke test (Home renders, tabs switch at 390 wide, footer on every page, no horizontal scroll, dark and light), a manual screenshot comparison with `site-final.html` at 1440 and 390 in both themes, first-load JS at most 120 KB, contrast at least 4.5 to 1.

Not in step 3: knowledge base, article, project and program pages (step 4), content (step 5), Notion (step 8).

## Step 4 detail (approved 2026-10-15, built)

Sub-branch `refactor/astro-rebuild-4-layouts` from `refactor/astro-rebuild`. Nothing goes live and nothing is pushed.

1. Content shape. `src/content.config.ts` defines one collection with the spec's fields: Title, Slug, Side, Type, Parent, Order, Description, Date, Status, plus Source URL, Docs URL and Live URL for Project and Demo, Sources for Program, Tags for Article. Markdown files fill it now (step 5 migrates the 54 pages, step 8 adds the Notion loader that produces the same shape). Only Published entries build.
2. `ShellLayout`: left tree built from the Parent links (groups collapsible, collapsed by default, only the group with the current page open, slides in on phone), top bar with menu button, breadcrumb (full path on laptop, parent plus current on phone) and theme button, right "On This Page" outline (only with two or more headings, highlights the section in view), the shared footer.
3. Body parts: Callout (`> [!note]` through a small remark plugin), styled tables, code blocks with a Copy button and the four prototype token colors, YouTube embed, video and demo slot, Previous and Next, Links, Sources.
4. Templates chosen by Type through one catch-all page: Knowledge Base book, Knowledge Base chapter, Article, Project, Program. Demo reuses Project and Tutorial reuses Article, as in the spec. Overview pages for Tech and Fitness are step 6.
5. Sample content is four real existing pages moved by hand (one Knowledge Base chapter, one Article, one Project, one Program) so every template is tested on real text. They are the first four of the 54 that step 5 migrates.
6. Gate before squash: `astro check`, build, Playwright in Chromium and WebKit for each template (outline only with two or more headings, Previous and Next link correctly, Copy works, only the current group is open, phone drawer opens and closes, no sideways scroll at 390), screenshots against `site-final.html` views at 1440 and 390 in both themes, first-load JS at most 120 KB, contrast at least 4.5 to 1.

Not in step 4: migrating the other 50 pages (step 5), Tech and Fitness overview pages, About and Contact text (step 6), Notion (step 8).

## Step 4 result and notes for step 5

Built on `refactor/astro-rebuild-4-layouts`: one `pages` collection (`src/content.config.ts`), `ShellLayout` with tree, breadcrumb, drawer and outline, a catch-all `src/pages/[...slug].astro` that picks the view by whether the page has children and by Type, body parts (callout, wrapped tables, code with Copy, YouTube link to embed), Previous and Next, Links and Sources cards. 11 hand-migrated sample pages cover every template. 66 Playwright tests pass in Chromium and WebKit, first-load JavaScript is about 0.8 KB gzipped, contrast at least 4.5 to 1 in both themes (code comments moved to the dim text tone to get there).

Decisions made while building, for step 5 and 8:
- Astro 7 renders Markdown with Sätteri, not unified. Plugins are objects in `src/plugins/markdown.mjs` passed to `satteri()`. Do not add remark or rehype plugins.
- A page's URL is its file path under `src/content/pages/` (`tech/knowledge-base/system-design/caching` gives `/tech/knowledge-base/system-design/caching/`). `parent` is the parent page's id. A book is `system-design.md` next to a `system-design/` folder, not `index.md`.
- Description is plain text and is the intro. Migration moves the first paragraph of a Hugo knowledge base page into `description` and removes it from the body, and strips Markdown markers (`**`) from it.
- Plain Hugo blockquotes stay blockquotes. Only `> [!note]` becomes a callout. Step 5 decides which blockquotes become callouts.
- Page title in the browser tab is `<Title> | Apoorva Sharma`.
- Not built, by design: the video and demo placeholder boxes (a YouTube link on its own line becomes an embed; Demo has no pages yet), the animated flow diagram in the prototype, the pointer-following glow on cards, the entrance animation. Say if any should come back.
- Tech and Fitness Overview pages were pulled forward from step 6 on 2026-10-15 because Home linked to them (`src/pages/[side]/index.astro`, rows from `overviewRows` in `src/lib/pages.ts`). About and Contact still 404 until step 6.
- The sample migration script lives in the session scratchpad only. Step 5 should turn it into a committed script (Python, `scripts/`) that also writes the redirects file.

### Launch scope decisions (grill-me, 2026-10-21)
- Launch set: Home, About, Contact, Tech and Fitness overviews, Blog lists, `traininglogs` project page, `building-traininglogs` post, the 9 knowledge-base skeleton pages already in Astro (5 training, 4 system design), and a short stub for the website project page (rewrite for Astro; the Hugo text is wrong).
- Dropped and redirected to their section page: `testing-in-python`, `building-a-sustainable-training-habit`, `morning-sunlight`, and every other Hugo page. No bulk migration, so step 5 shrinks to the redirects file, the stub page and fixing the two test fixtures in `tests/shell.spec.ts`.
- "Knowledge Base" name stays. Notion loader (step 8) comes after launch.
- YouTube and Instagram set in `src/data/site.ts` (`@apoorvasharma.7`); verify they resolve.
- Later list: email automation on apoorva.c.sharma@gmail.com (reminder saved in memory, raise after launch).

## ▶ Resume here

2026-10-21. Steps 4, 5, 6 and 7 are done locally and squashed into `refactor/astro-rebuild`. Full suite 323 passed, 0 skipped (includes `tests/sizes.spec.ts`, 9 screen sizes from 320 to 1920). Launch scope, redirects, social links, description (option 5), lowercase "i like" and "i love", and a 20px phone gutter are decided and built. `main` is untouched and still serves Hugo. Cloudflare, DNS and merging to `main` stay paused until Apoorva says yes in-session; see `website-deploy-plan.md`.

Next action: Apoorva checks the dev server on his phone (his Mac's LAN address changes, run `ipconfig getifaddr en0`; start with `npx astro dev --ignore-lock --host --port 4331`) and tests Back on the built preview, not `astro dev`. Then Cloudflare Phase 2 with his yes (`wrangler.jsonc`, preview deploy), then step 10 cutover. After launch, in order: step 8 Notion loader, step 9 perf gate, step 11 `website/CLAUDE.md`, his first real articles, email automation reminder.

Before cutover also delete `src/pages/lab/` (untracked mock-ups) and the empty `static/training-almanac/`. Fitness Blog is empty at launch and shows "Soon".

Open issues (2026-10-21, from Apoorva's phone): (1) Swipe-from-edge Back on iPhone Safari returned to the top of Tech Overview after Overview, Tech Blog, a post; Playwright (Chromium and WebKit) restores scroll on the built preview, so it needs a real-device repro. (2) Home has no cue to scroll on laptop; the whole first screen is the hero (proposal pending). (3) He has "some design issues" on that Back path to fix later. (4) Copy on Contact fails over HTTP on the LAN address by design, retest on the HTTPS preview.
