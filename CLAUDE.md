# website (apoorvasharma7.com)

Rules for working in this repo, for Apoorva and any coding agent. The site is Astro 7, built and served
by Cloudflare Workers. Content is Markdown, tests are Playwright. The old Hugo files (`content/`,
`layouts/`, `assets/`, `archetypes/`, `config.toml`) are dead and get deleted later. Never edit them or
read them as current.

## Where to start

- Open plans live in the repo root, each with a `▶ Resume here` section. Start at
  `website-agent-and-pipeline-plan.md`.
- Finished plans move to `archived/plans/`.

## Commands

- `npm run dev`: local site with live reload.
- `npm run build`, then `npm run preview`: the production build, served locally.
- `npm test`: builds, serves on port 4321, and runs Playwright on chromium and webkit.
- `npm run check`: Astro and TypeScript type check.

## Branches and deploys

- **Never push to or merge `main`.** Why: Cloudflare builds and deploys `main` to production on every
  push. There is no staging.
- Work on a branch and open a PR. Cloudflare builds a preview URL for every branch. Apoorva merges.
- A PR is ready only with `npm test` green: 0 failed, 0 skipped. Why: unattended work has no other
  witness.
- Stage files by name, never `git add -A src`. Why: a broad add once shipped mock-up pages to
  production.
- Commit messages: `<type>: <what changed>`, type one of `feat`, `fix`, `test`, `refactor`, `chore`,
  `docs`.

## Design

- **Before changing anything under `src/components/`, `src/layouts/`, `src/pages/` or `src/styles/`,
  read `docs/design-rules.md`.** Why: the look is locked, and an agent breaks it without meaning to.
- Any change to the look needs Apoorva's yes on a mockup or screenshot first. Content work never
  touches those folders.

## Content

- Every page is one Markdown file in `src/content/pages/`. Its front matter must match the schema in
  `src/content.config.ts`: `side` is `tech` or `fit`, `type` is one of the `pageTypes` listed there.
- Only `status: Published` pages are built (`getPublished()` in `src/lib/pages.ts`). Drafts do not
  appear anywhere, previews included.
- Voice: human, plain, simple, fun. No textbook tone. Never invent a fact, number or quote. Every claim
  from outside traces to a link in `sources`. Why: the site replaces AI-written fluff.
- Run the `unslop` skill on prose before opening a PR.

## Secrets

- The site needs no secrets today. Never commit a key, token or `.env`, even one that is public by
  design. Why: the repo is public.
