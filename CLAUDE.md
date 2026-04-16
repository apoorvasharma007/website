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
