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

## Outcome (2026-10-25)

Done in `chore/cleanup`: Hugo tree, scratch files, mock-ups and the unserved résumé copy deleted; old plans
archived; `CLAUDE.md`, `README.md` and `.gitignore` rewritten; `docs/design-rules.md` added; CI added in
`.github/workflows/test.yml` (type check, build, Playwright on every PR and on `main`).

Dropped, as not earning their place on a personal site: `docs/glossary.md`, `docs/architecture.md`,
`docs/risk-map.md`, path-scoped `.claude/rules/`, and the doctor baseline. `CLAUDE.md` plus
`docs/design-rules.md` carry the rules; the two skills carry the workflow.

Moved to `website-agent-and-pipeline-plan.md`: the cloud-thread spike (does a Claude Projects thread load
skills and the Notion connector) and the verify steps, which live in the `website-code` skill.
