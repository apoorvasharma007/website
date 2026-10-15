# Website deploy plan: local, Cloudflare preview, live, Notion publishing

Companion to `website-rebuild-plan.md` (steps 3, 8, 10) and `website-build-spec.md` (Hosting and deploy). This file owns the path from "no Astro code yet" to "a Notion Published card appears on apoorvasharma7.com".

## How publishing works (answer to "who publishes it")

Notion never pushes to GitHub, and no Notion-to-GitHub hook is needed. Content does not live in git. The Astro build fetches Published pages from the Notion API every time it runs. So publishing is "run a build", and Cloudflare Pages is the only thing that builds and publishes.

| Part | What it is |
|---|---|
| Builder and host | Cloudflare Pages, connected to the GitHub repo. It runs `npm run build` and serves the result |
| Trigger for code changes | A push to GitHub. Pages builds `main` as production and every other branch as a preview |
| Trigger for content changes | A Pages deploy hook: a secret URL. An HTTP POST to it starts a build of the chosen branch |
| Who calls the hook, fast path | A Notion database automation with a "Send webhook" action, fired when Status becomes Published. Needs a paid Notion plan (verified on Notion's help page 2026-10-15) |
| Who calls the hook, fallback | A GitHub Actions workflow on a 6-hour cron that POSTs the hook. Works on any Notion plan. Hook URL lives in a GitHub secret |
| Notion token | Cloudflare environment variable `NOTION_TOKEN`, plus a gitignored `.env` locally. Never in the repo |

Conflict found: `website-rebuild-plan.md` decision 4 says "scheduled GitHub Action twice a day", the spec says "deploy hook called by Notion automation, 6-hour fallback". This plan follows the spec (newer, 2026-10-15). Row 4 should be updated to match when step 3 starts.

Cloudflare Pages deploy hooks have no auth: anyone with the URL can start a build. Treat the URL as a secret and rotate it by deleting and recreating the hook.

## Blast radius

| Touched | How |
|---|---|
| `website` repo | Astro project at root; `.github/workflows/deploy.yml` replaced by a small cron workflow |
| Cloudflare account | One Pages project, one deploy hook per branch that should rebuild, env vars |
| Notion | Integration with read access to the content database; one database automation (paid plan only) |
| Hostinger DNS | Only at cutover, each change shown first |
| GitHub Pages | Stays live until cutover, then retired |

## Steps

Branches follow the rebuild plan: base `refactor/astro-rebuild`, sub-branch `refactor/astro-rebuild-N-<step>`, squash-merge back. Each gate must be green before the squash.

### Phase 1. Local server (rebuild plan step 3, points 1 to 5)

- [ ] 1.1 Apoorva says yes to the step 3 detail in `website-rebuild-plan.md`
- [ ] 1.2 Cut `refactor/astro-rebuild-3-scaffold` from `refactor/astro-rebuild`
- [ ] 1.3 Scaffold Astro (TypeScript strict, `@astrojs/sitemap`), tokens, Header, Footer, Home, 404, robots, favicon
- [ ] 1.4 Run `npm run dev`, open `http://localhost:4321`, compare against `mockups/astro-rebuild/site-final.html` at 1440 and 390 wide, both themes
- [ ] 1.5 Run `npm run build && npm run preview` (serves the real build output, not the dev server) and re-check; this is the server that matches what Cloudflare will serve
- [ ] 1.6 Gate: `astro check` and build pass, Playwright smoke test, first-load JS at most 120 KB

### Phase 2. Cloudflare preview (rebuild plan step 3, point 6)

Apoorva does the dashboard clicks; I give them one at a time and check each result.

- [ ] 2.1 Push `refactor/astro-rebuild-3-scaffold` to GitHub (needs his yes)
- [ ] 2.2 Cloudflare dashboard: Workers & Pages, create Pages project, connect `apoorvasharma007/website`, build command `npm run build`, output directory `dist`, production branch `main`
- [ ] 2.3 Confirm the Cloudflare build picks the Node version in `.nvmrc` or `NODE_VERSION`, and that the branch preview URL (`<hash>.<project>.pages.dev`) loads
- [ ] 2.4 Decide preview privacy: preview URLs are public by default. Either accept (nothing secret before launch) or put Cloudflare Access in front. Needs his call
- [ ] 2.5 Apoorva reviews the preview on his phone and laptop. Squash-merge into the base branch only after his yes

### Phase 3. Notion to site (rebuild plan step 8)

- [ ] 3.1 Create the Notion integration (read-only), share the content database with it; token into `.env` (gitignored) and Cloudflare env vars (Preview and Production)
- [ ] 3.2 Loader pulls only Status = Published, maps fields from the spec's Notion pipeline section, downloads images at build (Notion image URLs expire)
- [ ] 3.3 Local check: mark one test page Published, run the build, see it at `localhost`; set it back to Draft, rebuild, see it vanish
- [ ] 3.4 Create the deploy hook in Cloudflare (Settings, Builds, Add deploy hook) for branch `main`; save the URL as GitHub secret `CF_DEPLOY_HOOK` and nowhere else
- [ ] 3.5 Add `.github/workflows/rebuild.yml`: cron every 6 hours plus `workflow_dispatch`, one `curl -X POST "$CF_DEPLOY_HOOK"` step. Show the diff before pushing
- [ ] 3.6 Test: publish a test card, trigger the workflow by hand, watch the Cloudflare deployment log show Source = deploy hook, and the page appear
- [ ] 3.7 If Notion is on a paid plan: add the database automation (When Status is set to Published, Send webhook, POST to the hook URL). Test the same way. If free plan, skip and rely on 3.5
- [ ] 3.8 Decide whether Unpublish (Published back to Draft) also fires the hook, so removals go live too

### Phase 4. Push to the world (rebuild plan step 10)

Every DNS change is shown first and made only on his explicit yes in that session.

- [ ] 4.1 Pre-flight on the preview URL: all old URLs redirect (`_redirects` list shown in full), sitemap, robots, 404, Lighthouse mobile 95 or higher, contrast
- [ ] 4.2 Read Cloudflare's current docs on custom domains for an apex domain before choosing: moving the domain's nameservers to Cloudflare (my expectation for an apex domain, to verify) versus a CNAME from Hostinger DNS. Show him the exact records and the email/MX records that must survive
- [ ] 4.3 Lower the DNS TTL at Hostinger a day ahead
- [ ] 4.4 Merge base `refactor/astro-rebuild` into `main` (needs his yes). Cloudflare builds production
- [ ] 4.5 Add `apoorvasharma7.com` and `www` as custom domains on the Pages project; switch DNS per 4.2
- [ ] 4.6 Verify live: HTTPS, old URLs, sitemap, a Notion Published card via the hook
- [ ] 4.7 Turn on Cloudflare AI-crawler blocking if the docs confirm it works as the spec assumes
- [ ] 4.8 After a week stable, retire the GitHub Pages deploy and the old Hugo files (separate step, confirm first)

### Phase 5. Close out

- [ ] 5.1 Rewrite `website/CLAUDE.md` for Astro, Cloudflare and the Notion flow (rebuild plan step 11), including this publishing table
- [ ] 5.2 Update `~/Projects/PLAN.md` log

## Risks

| Risk | Where | Watch |
|---|---|---|
| Notion automations need a paid plan | 3.7 | Fallback cron covers it; worst case a post waits up to 6 hours |
| Deploy hook URL leaks | 3.4 | Only in a GitHub secret and the Notion automation; rotate by recreating |
| This repo has no `dev` branch | Phase 2 and 4 | `main` is production and the old Hugo site until 4.4 |
| Old deploy workflow triggers on `main` push | 4.4 | Replace or disable it in the same merge, or GitHub Pages and Cloudflare both deploy |
| Email breaks at DNS move | 4.2 | List MX/TXT records first, carry them over |
| Notion API rate or outage during build | 3.2 | Build fails, old site stays live; Cloudflare keeps the last good deploy |

## ▶ Resume here

Plan written 2026-10-15, nothing executed. No Astro code exists yet, so Phase 1 is the first action. Branch `refactor/astro-rebuild`, last code commit `6c1c6ab`. Next action: Apoorva answers (a) yes to the step 3 detail (task 1.1), (b) is Notion on a paid plan (decides 3.7), (c) are the preview URLs allowed to be public (2.4). Then cut `refactor/astro-rebuild-3-scaffold`.
