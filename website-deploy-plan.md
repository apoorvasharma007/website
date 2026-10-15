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

- [x] 1.1 Apoorva says yes to the step 3 detail in `website-rebuild-plan.md`
- [x] 1.2 Cut `refactor/astro-rebuild-3-scaffold` from `refactor/astro-rebuild`
- [x] 1.3 Scaffold Astro (TypeScript strict, `@astrojs/sitemap`), tokens, Header, Footer, Home, 404, robots, favicon
- [x] 1.4 Run `npm run dev`, open `http://localhost:4321`, compare against `mockups/astro-rebuild/site-final.html` at 1440 and 390 wide, both themes
- [x] 1.5 Run `npm run build && npm run preview` (serves the real build output, not the dev server) and re-check; this is the server that matches what Cloudflare will serve
- [x] 1.6 Gate: `astro check` and build pass, Playwright smoke test, first-load JS at most 120 KB

### Phase 2. Cloudflare preview (rebuild plan step 3, point 6)

Paused by Apoorva 2026-10-15: build more locally first, test Cloudflare later. What we learned from his first attempt:

- The Cloudflare dashboard created a Workers project (Workers Builds), not a Pages project. It runs `npx wrangler deploy` after the build. It cloned `main`, found Hugo and Zola and stopped with "multiple frameworks were found". The live site on GitHub Pages was not affected.
- Workers Builds is free for this size: 3,000 build minutes per month, static asset requests free and unlimited (both from Cloudflare docs). The docs do not say what happens past the build-minute limit, so check billing after the first week.
- Branches: Settings, Build has a "Git branch" field (the production branch, default `main`) and a Preview command for every other branch (default `npx wrangler preview`, which gives a preview URL). So a branch can be tested without touching `main`.
- Deploy hooks exist for Workers Builds (Settings, Builds, Deploy Hooks, one URL per branch, POST starts a build, 10 builds per minute per Worker). Phase 3 is unchanged.

Resume this phase with:

- [ ] 2.1 Add `wrangler.jsonc` to the repo (name, `assets.directory` set to `./dist`) so Cloudflare skips framework detection. Show the file first
- [ ] 2.2 In Cloudflare, Settings, Build: build command `npm run build`, deploy command `npx wrangler deploy`, Node version from `.nvmrc`
- [ ] 2.3 Test without touching `main`: either set the Git branch to `refactor/astro-rebuild`, or merge to `main` once the whole site is ready (his plan). Merging to `main` is safe for the live site only while `deploy.yml` still builds Hugo, so replace that workflow in the same merge
- [x] 2.4 Decide preview privacy: public preview URLs are fine
- [ ] 2.5 Apoorva reviews the preview on his phone and laptop

### Phase 3. Notion to site (rebuild plan step 8)

- [ ] 3.1 Create the Notion integration (read-only), share the content database with it; token into `.env` (gitignored) and Cloudflare env vars (Preview and Production)
- [ ] 3.2 Loader pulls only Status = Published, maps fields from the spec's Notion pipeline section, downloads images at build (Notion image URLs expire)
- [ ] 3.3 Local check: mark one test page Published, run the build, see it at `localhost`; set it back to Draft, rebuild, see it vanish
- [ ] 3.4 Create the deploy hook in Cloudflare (Settings, Builds, Deploy Hooks) for the production branch; save the URL as GitHub secret `CF_DEPLOY_HOOK` and nowhere else
- [ ] 3.5 Add `.github/workflows/rebuild.yml`: cron every 6 hours plus `workflow_dispatch`, one `curl -X POST "$CF_DEPLOY_HOOK"` step. Show the diff before pushing
- [ ] 3.6 Test: publish a test card, trigger the workflow by hand, watch the Cloudflare deployment log show Source = deploy hook, and the page appear
- [x] 3.7 skip: free Notion plan, revisit later. If Notion is on a paid plan: add the database automation (When Status is set to Published, Send webhook, POST to the hook URL). Test the same way. If free plan, skip and rely on 3.5
- [ ] 3.8 Decide whether Unpublish (Published back to Draft) also fires the hook, so removals go live too

### Phase 4. Push to the world (rebuild plan step 10)

Every DNS change is shown first and made only on his explicit yes in that session.

- [ ] 4.1 Pre-flight on the preview URL: all old URLs redirect (`_redirects` list shown in full), sitemap, robots, 404, Lighthouse mobile 95 or higher, contrast
- [x] 4.2 Researched 2026-10-15. Cloudflare's custom-domain docs require an apex domain to be a Cloudflare zone, so the nameservers must move; an external CNAME works only for subdomains. The Free zone plan is $0. Current DNS (read with `dig`): nameservers `ns1/ns2.dns-parking.com` (Hostinger), four GitHub Pages A records on the apex, `www` CNAME to `apoorvasharma007.github.io`, no MX and no TXT records, so no email depends on this DNS. Registration stays at Hostinger; only DNS hosting moves
- [ ] 4.2b Before the switch: add the zone on Cloudflare Free, let it import records, show him the full record list, confirm no card or upgrade prompt appeared. Rollback is setting the nameservers back to `ns1/ns2.dns-parking.com` at Hostinger
- [ ] 4.3 Lower the DNS TTL at Hostinger a day ahead
- [ ] 4.4 Merge base `refactor/astro-rebuild` into `main` (needs his yes). Cloudflare builds production
- [ ] 4.5 Add `apoorvasharma7.com` and `www` as custom domains on the Pages project; switch DNS per 4.2
- [ ] 4.6 Verify live: HTTPS, old URLs, sitemap, a Notion Published card via the hook
- [ ] 4.7 Turn on Cloudflare AI-crawler blocking if the docs confirm it works as the spec assumes
- [ ] 4.8 After a week stable, retire the GitHub Pages deploy and the old Hugo files (separate step, confirm first)

### Phase 5. Close out

- [ ] 5.1 Rewrite `website/CLAUDE.md` for Astro, Cloudflare and the Notion flow (rebuild plan step 11), including this publishing table
- [ ] 5.2 Update `~/Projects/PLAN.md` log

## Cost guard (decided 2026-10-15: nothing may cost money)

- Stay on Cloudflare Free for the zone and Pages (500 builds per month; the plan uses about 125 with a 6-hour cron plus pushes).
- Never click Upgrade, and decline every add-on prompt (Automatic Platform Optimization is $5 per month even on Free, Workers Paid, Argo, Load Balancing).
- If any step asks for a card, stop and tell Apoorva.
- Pages Functions count toward Workers quotas (free tier 100k requests per day, then paid). The first build has no functions. The later contact form is the first thing that would; revisit cost then.
- Pages docs do not say what happens past the free build limit, so check the Cloudflare billing page after the first week.
- The domain registration renewal stays at Hostinger and is unchanged.

## Risks

| Risk | Where | Watch |
|---|---|---|
| Notion automations need a paid plan | 3.7 | Fallback cron covers it; worst case a post waits up to 6 hours |
| Deploy hook URL leaks | 3.4 | Only in a GitHub secret and the Notion automation; rotate by recreating |
| This repo has no `dev` branch | Phase 2 and 4 | `main` is production and the old Hugo site until 4.4 |
| Old deploy workflow triggers on `main` push | 4.4 | Replace or disable it in the same merge, or GitHub Pages and Cloudflare both deploy |
| Email breaks at DNS move | 4.2b | No MX or TXT records exist today; re-run `dig` for MX/TXT right before the switch in case he added mail since |
| Notion API rate or outage during build | 3.2 | Build fails, old site stays live; Cloudflare keeps the last good deploy |

## ▶ Resume here

2026-10-15. Step 3 is squashed into `refactor/astro-rebuild` (commit `69254ce`), not pushed. Nothing is on GitHub except `main`. Apoorva wants to keep building locally and test Cloudflare later (Phase 2 above is paused). His Cloudflare Workers project exists and fails harmlessly on `main` (Hugo and Zola detected).

Next action: Apoorva approves the "Step 4 detail" in `website-rebuild-plan.md`, then cut `refactor/astro-rebuild-4-layouts` from `refactor/astro-rebuild`.

Open placeholders: YouTube and Instagram URLs in `src/data/site.ts`, hero captions in `src/data/home.ts`, site description in `src/data/site.ts`, phone side margin 16px versus 24px (his call).

Run locally: `npm run dev` (http://localhost:4321) or `npm run build && npm run preview`. Tests: `npm test`. Dev toolbar is off because it froze the art animations in WebKit.
