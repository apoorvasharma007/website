# Website agent context and cleanup plan

## Goal and motivation

The `website` repo is now an Astro 7 site on Cloudflare Workers, but its agent context still describes
the old Hugo site (`CLAUDE.md` says "No JS", "Hugo", "GitHub Pages") and the repo carries the dead Hugo
tree. Cloud sessions in Claude Projects read this repo cold, so wrong context produces wrong work.
This plan resets the repo to one clean, current set of context files, modelled on `traininglogs`, so any
agent thread can pick up a website task, make a change, and prove it with the tests. It is a plan only.
A later session implements it.

## What traininglogs does that we copy

| traininglogs piece | Website equivalent |
|---|---|
| `CLAUDE.md` (81 lines: where to start, money, secrets, branches, tests, words and docs, each rule with a "Why:") | New `CLAUDE.md`, same shape, Astro facts only |
| `.claude/rules/*.md` with `paths:` globs, loaded when matching files open | `.claude/rules/` for content, components/styles, tests, redirects |
| `.claude/skills/verify`, `release`, `setup`, `traininglogs-agent` | `verify`, `setup`, `website-agent` (see the agent plan) |
| `docs/glossary.md` (one concept, one name) | `docs/glossary.md`: page, side, type, hero scene, stub, Knowledge Base |
| `docs/architecture.md` (one page) and `docs/risk-map.md` | One-page architecture, short risk map (redirects, schema, view transitions) |
| Plan file with `▶ Resume here`, finished plans to `archived/plans/` | Same; move the two rebuild plans and the build spec to `archived/plans/` |
| `changelog.d/` | Skip. A personal site does not need release notes. Git history is enough |

## Known constraint to verify first

`traininglogs-agent` says "project threads load `CLAUDE.md` but not path rules or skills". If that holds
for website threads, everything an agent must know has to be in `CLAUDE.md` (kept short), with rules and
docs reached by a pointer the agent follows ("before editing X, read Y"). Step 1 settles this with a real
throwaway thread, not by assumption.

## Blast radius (audit, from the current tree)

Dead Hugo files, delete in step 3 after a one-week hold decided by Apoorva (existing next action):
`content/`, `layouts/`, `assets/`, `archetypes/`, `config.toml`, `public/`, `.hugo_build.lock`,
`HOSTINGER-DEPLOYMENT.md`, plus the GitHub Pages setting (Apoorva does that in GitHub).

Untracked scratch, delete or ignore in step 3: `mockups/`, `clean-and-jerk.svg`, `whack-a-bug.svg`,
`static/training-almanac/` (empty), `test-results/`.

Stale and to rewrite: `CLAUDE.md`, `README.md` (135 lines, Hugo era), `.claude/memory/` (empty),
`.claude/settings.local.json` (holds two stale Hugo permission entries).

Candidates to archive: `website-rebuild-plan.md`, `website-deploy-plan.md`, `website-build-spec.md`.
Keep only what an agent needs daily, moved into `docs/` as short pages: design rules (colours, fonts,
no uppercase mono labels, no "·" separators), content schema, redirect policy.

Unchanged: `src/`, `tests/`, `scripts/make_redirects.py`, `static/`, `wrangler.jsonc`, `package.json`.

## Steps

- [ ] 1. Spike, 30 minutes. In Claude Projects, start a throwaway thread on this repo. Ask it to quote
  `CLAUDE.md`, list `.claude/rules/` and `.claude/skills/`, and run `npm test`. Record what loads, whether
  Playwright browsers install, and whether it can open a PR with a Cloudflare preview. This fixes how much
  goes in `CLAUDE.md` and whether skills are usable in threads.
- [ ] 2. Run the prompt doctor and the skill doctor on the current context as a baseline (`/skill-doctor`
  report, plus a read of `CLAUDE.md` for contradictions). Save the findings in this file under Notes. Run them
  again at the end of step 5 and compare.
- [ ] 3. Overhaul the tree (branch `chore/agent-context`, sub-branch per step). Needs Apoorva's yes before
  any deletion, one list at a time. Delete the Hugo tree and scratch files, archive the old plans, update
  `.gitignore` and `.claude/settings.local.json`.
- [ ] 4. Write the new context, in this order, one PR each:
  1. `CLAUDE.md`: stack (Astro 7, Cloudflare Workers, Playwright), commands (`npm run build`,
     `npm run preview`, `npm test`), branch rules, "never push or merge `main`" (main deploys production),
     secrets, the stage-by-name rule (never `git add -A src`), voice rules for content, one "Why:" per rule.
  2. `docs/glossary.md`, `docs/architecture.md` (one page: content collection, shell, view transitions,
     redirects), `docs/risk-map.md`.
  3. `.claude/rules/` with `paths:` globs: `content.md` (`src/content/**`, schema in `src/content.config.ts`),
     `ui.md` (`src/components/**`, `src/styles/**`, locked design rules), `tests.md` (`tests/**`),
     `redirects.md` (`static/_redirects`, `scripts/make_redirects.py`).
  4. `.claude/skills/verify` (build, preview, Playwright on chromium and webkit, plus a phone-size check) and
     `.claude/skills/setup` (clone to running preview).
  5. Rewrite `README.md` short: what the site is, how to run it, where context lives.
- [ ] 5. Re-run the doctors. Fix every finding or record why not. Then prove it: give a fresh cloud thread one
  small real task (fix a typo on a page, open a PR). It succeeds with no questions about Hugo.
- [ ] 6. Add a CI check on pull requests: build plus Playwright. Cloudflare Workers Builds already makes the
  preview, but a failing suite must block the merge. Use GitHub Actions (free for public repos; check minutes
  if the repo is private). Unattended work needs CI as the witness.
- [ ] 7. Update memory (`website_astro_rebuild.md`) and the `Resume here` below.

## Decisions for Apoorva (answer when step 1 is done)

1. Keep the Hugo tree for the one-week hold, or delete now? Recommendation: hold to the week mark, because
   `main` has been live only since 2026-10-21 and the old files cost nothing.
2. Archive the old plans in `archived/plans/` or delete? Recommendation: archive, matching traininglogs.

## Side paths to avoid

Do not redesign the site, add features, or fix the parked items (swipe cue, AI-crawler block, empty Fitness
Blog) during this plan. Park new ideas below.

Parked ideas:

## ▶ Resume here

Status: plan written 2026-10-22, nothing implemented.
Next action: step 1, the throwaway-thread spike in Claude Projects (30 minutes).
State: branch `main`, site live, 323 Playwright tests green at the last run.
