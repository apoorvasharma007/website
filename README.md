# apoorvasharma7.com

Apoorva Sharma's personal site: software engineering and training, as articles, projects and
knowledge-base chapters. Built with Astro 7, served by Cloudflare Workers.

## Run it

Needs Node 22.12 or newer.

```sh
npm ci
npm run dev        # local site with live reload
npm test           # production build plus Playwright on chromium and webkit
```

## Where things live

- `src/content/pages/` holds every page as Markdown. The schema is in `src/content.config.ts`.
- `src/components/`, `src/layouts/` and `src/styles/` hold the look. Design tokens are in
  `src/styles/tokens.css`.
- `static/` is served as is: the résumé, art, favicon and `_redirects`.
- `scripts/make_redirects.py` writes `static/_redirects` so old URLs keep working.

## Deploys

Cloudflare builds every branch. A pull request gets a preview URL from the Cloudflare bot. A merge
into `main` deploys production.

## For agents

Start with `CLAUDE.md`. Design rules are in `docs/design-rules.md`.
