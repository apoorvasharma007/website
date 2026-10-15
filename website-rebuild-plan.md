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
- [ ] 2. Design mockup: article page (Notion-like) + homepage, as an Artifact; approve before code
- [ ] 3. Scaffold Astro + Cloudflare Pages project; PR preview working on an empty page
- [ ] 4. Article layout + components (callout, YouTube embed, table, image) from the approved mockup
- [ ] 5. Migrate content + redirects; check every old URL resolves
- [ ] 6. Homepage, section landings, KB sidebar, blog list
- [ ] 7. Dashboard copy from traininglogs kept working at `/dashboard/`
- [ ] 8. Notion loader: published pages from the pipeline database to content; scheduled build twice a day
- [ ] 9. Perf gate in CI
- [ ] 10. Cutover: DNS to Cloudflare (needs explicit yes), verify, retire GitHub Pages deploy
- [ ] 11. Rewrite `website/CLAUDE.md`

Branches (proposed): base `refactor/astro-rebuild` cut from `main` (this repo has no `dev`),
sub-branches `refactor/astro-rebuild-N-<step>`, squash-merged back; base merges to `main` at cutover.

## ▶ Resume here

Design is LOCKED (2026-10-15). Spec: `website-build-spec.md`. Final prototype: `mockups/astro-rebuild/site-final.html`
(artifact https://claude.ai/artifact/DkCam7qZ8EYGGcHaLHGWAc). Branch `refactor/astro-rebuild` (cut from main, docs and
mockups committed on it). Next action: write the build plan for step 1 (Astro project scaffold on Cloudflare Pages
with the design tokens, shell and Home) and show it to Apoorva before writing code. Open at build time: confirm hero
captions, minify the two SVGs, real About text, Cloudflare account and AI-crawler blocking check at hosting setup.
