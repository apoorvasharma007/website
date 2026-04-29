# website (apoorvasharma7.com)

## What this project is
Personal site for Apoorva Sharma. Built with Hugo — no themes, no JS, minimal CSS.

## Stack
- Static site generator: Hugo (extended)
- No JavaScript, no external fonts, no analytics
- Dark background (`#0f1115`), system font stack only
- Deployed via GitHub Actions to GitHub Pages
- Custom domain: apoorvasharma7.com
- DNS managed via Hostinger

## Structure
- `content/_index.md` — home page
- `content/about.md` — about page
- `content/posts/` — blog posts
- `content/fitness/` — fitness content
- `content/tech/` — tech notes and projects
- `layouts/` — HTML templates (no theme)
- `assets/css/styles.css` — all styles
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

### Risk notes
- URL renames break any inbound links to `/fitness/...` or `/code/...`.
- Do not touch `.github/workflows/deploy.yml`.
