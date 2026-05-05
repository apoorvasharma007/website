# website (apoorvasharma7.com)

## What this project is
Personal site for Apoorva Sharma. Built with Hugo — no themes, no JS, minimal CSS.

## Stack
- Static site generator: Hugo (extended)
- No JavaScript (except blog tag/search filter in `layouts/blog/list.html`)
- Fonts: Inter via Google Fonts CDN; system mono for code only
- White background (`#FFFFFF`), accent red (`#C83C29`)
- Deployed via GitHub Actions to GitHub Pages
- Custom domain: apoorvasharma7.com
- DNS managed via Hostinger

## Structure
- `content/_index.md` — home page
- `content/about.md` — about page
- `content/posts/` — blog posts
- `content/fitness/` — fitness content (URL section: `/movement/`)
- `content/tech/` — tech notes and projects
- `layouts/` — HTML templates (no theme)
- `assets/css/variables.css` — design tokens (palette, spacing, type, motion)
- `assets/css/layout.css` — structural styles (container, page fade, grid)
- `assets/css/components.css` — all component styles
- `static/resume.pdf` — resume served at `/resume.pdf`
- `.github/workflows/deploy.yml` — CI/CD deploy to GitHub Pages

## Commands
- Local dev: `hugo server -D`
- Build: `rm -rf public && hugo` (full clean build — do not use `--minify` as it can cause incomplete renders with cached output)

## Deployment
Push to `main` triggers the GitHub Actions workflow, which builds and publishes to GitHub Pages.

## Working conventions
- No JS — do not introduce JavaScript
- No external dependencies (fonts, CDNs, analytics)
- Keep CSS minimal and readable
- New content via `hugo new <section>/filename.md`
- Front matter must include: `title`, `date`, `categories`, `tags`
- Do not modify the deploy workflow without explicit instruction
- After making changes: run `rm -rf public && hugo && hugo server -D --disableFastRender` to build and serve. Let the user verify manually. Do not inspect rendered output or scan `public/` yourself. Only debug output if the user reports something looks wrong.

## Pending redesign plan (not yet executed)

### Decisions
- Fonts: try system stack first; only self-host a woff2 if quality is insufficient (show user before adding).
- Rename sections: `fitness` → `movement`, `code` → `tech` (URLs + nav).
- Page layout pattern (Movement and Tech): keep existing top cards (Dashboard/Almanac for movement; Projects for tech), then a Knowledge Base section listing KB titles that link directly to the book — no intermediate KB landing card.
- Movement KBs: Training, Nutrition, Programming.
- Tech KBs: System Design, DSA, AI.
- Drop the word "ebook" everywhere; use "Knowledge Base" or the specific KB title.
- No Notion — KB content stays in Hugo markdown.

### Execution order
1. ~~Typography pass (CSS only): title font with better weight + letter-spacing, body readability, mobile sweep.~~ **DONE** — Dropped Fraunces, Inter everywhere (headings 700, body 400). Google Fonts CDN already in use (constraint relaxed in practice).
2. ~~Rename `fitness` → `movement` and `code` → `tech` across `content/`, `layouts/`, `config.toml` menu URLs, internal links, and CSS class names.~~ **DONE** — content/layouts/config/CSS all updated; old directories removed; clean 112-page build.
3. ~~Drop "ebook" everywhere: rename `*/ebook/` → `*/knowledge-base/`, layouts `ebook-*.html` → `kb-*.html`, replace user-visible "Ebook" strings with specific KB titles.~~ **DONE** — KB layouts in `_default/kb-*.html`, sidebar partial renamed, CSS classes kept as `ebook-*` (internal only).
4. ~~Restructure Movement landing: keep Dashboard + Training Almanac cards; add Knowledge Base section listing Training · Nutrition · Programming.~~ **DONE**
5. ~~Restructure Tech landing: Projects card on top; Knowledge Base section listing System Design · DSA · AI.~~ **DONE** — `layouts/tech/tech-landing.html` + `content/tech/_index.md` updated.
6. ~~Starter content for the 6 KBs: each gets `_index.md` + 2–3 short stub chapters, enough to test sidebar nav and mobile rendering.~~ **DONE** — 6 KBs × 2 chapters each; all at `/movement/knowledge-base/{training,nutrition,programming}/` and `/tech/knowledge-base/{system-design,dsa,ai}/`.
7. ~~Build + manual mobile render check (`rm -rf public && hugo`, then `hugo server -D`).~~ **DONE** — 150-page clean build.
8. ~~UI polish pass — fix footer, remove redundant headings, add section backdrops to landing pages, expand KB content.~~ **DONE** — footer pinned via flex, h1s stripped from blog/movement/tech/music list layouts, landing pages use `landing-backdrop-section` boxes, all 6 KBs at 3 chapters each with tables/blockquotes/code, 3 SVG diagrams in `static/diagrams/`, sidebar + kb-index fixed to handle flat KB structure (pages directly under KB root, no sub-sections). 174-page clean build.

### Wave 3 — Done
9. ~~Home page redesign: hero with resume CTA, home-cards (Movement Dashboard + traininglogs GitHub), recent blog posts list.~~ **DONE**
10. ~~Blog search/filter: tag chips + text search via inline JS (no external deps).~~ **DONE** — `layouts/blog/list.html`
11. ~~Tech project pages: `traininglogs.md` and `website.md` with github/status/summary front matter.~~ **DONE**
12. ~~CSS split into modules: `variables.css`, `layout.css`, `components.css` (replaces monolithic `styles.css`).~~ **DONE** — loaded via `baseof.html` with SRI fingerprints
13. ~~Fade-in scroll animation on `.fade-in` elements.~~ **DONE** — IntersectionObserver in `baseof.html`
14. ~~Contact page (`content/contact.md`).~~ **DONE** — moved out of nav, contact links now live in the footer.

### Deferred / Not needed yet
- **Sitewide search** — preferred over tagging; implement only when the volume of content justifies it. Tags + tag-filtering are lower priority and likely not worth the complexity. If/when implemented, sitewide search wins over a tag taxonomy.

### Risk notes
- URL renames break any inbound links to `/fitness/...` or `/code/...`.
- Do not touch `.github/workflows/deploy.yml`.

## Wave 4 — Visual redesign — DONE

Status: implemented and verified locally.

### What was done
- White bg (`#FFFFFF`), warm surface (`#F5F4F1`), original red accent (`#C83C29`) kept
- Inter only — mono removed from nav, dates, labels, stat-labels, footer; `var(--font-mono)` now code-only
- Fluid type via `clamp()` on h1/h2/hero/single-title
- Hero unboxed (no background card)
- Section titles: red left-border (`border-left: 3px solid`) instead of top rule
- Cards (home, stat, project, landing-backdrop): resting shadow + 3-layer hover lift
- Frosted nav: `blur(20px) saturate(1.6)` at 82% opacity
- Animated underline on inline content links (`background-size` transition)
- `::selection` styled in accent red
- Drop cap on first paragraph of `.content` pages
- Blockquote: 3px red left bar, slightly larger text, italic
- Primary button: red default, black hover
- JS `IntersectionObserver` removed; CSS `@keyframes pageFadeIn` on `main` (with `prefers-reduced-motion` guard)
- `scroll-padding-top: 4.5rem` added to fix anchor-under-sticky-nav
- Dead `.movement-nav-cards` block removed from CSS
- Inline `style=` on "All blog posts" link replaced with `.cta-row` class

### Remaining known issues (deferred)
- `_default/list.html` and taxonomy templates emit unstyled classes (`post-item`, `post-title`, `read-more`, etc.) — tag/category pages look plain. Unify with blog-row design in a future pass.
- Two date formats still coexist (`02 Jan 2006` vs `02 Jan, 2006`) across templates.
- `blog/list.html` has one remaining `style="display:none"` on `#no-results` (JS-controlled, needs template change to remove).

### Constraints (do not violate)
- One UI font (Inter). Mono only for `<code>` and `<pre>`.
- One accent color. No second hue.
- All styling via tokens in `variables.css` + rules in `components.css`. No per-page CSS, no per-template overrides, no inline `style=` in production templates.
- No JavaScript for any visual/animation effect (CSS-only). JS budget: UX-functional only (search filter, copy-code, scroll-spy).
- Google Fonts CDN for Inter is acceptable. Do not add more external deps.
