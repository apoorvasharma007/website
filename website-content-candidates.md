# Website content candidates

Mined 2026-10-22 from personal repos and notes only: `traininglogs`, `alfred`, `website`, `training`,
`interview-prep`, `open-wearables-guide.md`, and the memory notes. Nothing from `resume-generator` or work
material, by decision. Résumé work is a separate track.

How reliable this is: I read headings, the roadmap, `CLAUDE.md` and plan titles, not every file. Each angle
below is a hypothesis from those. Step "verify" in the curation session reads the evidence file in full
before anything is outlined.

## Proposed themes (to confirm with Apoorva)

| Theme | Side | Why it fits |
|---|---|---|
| Building with AI agents, the unglamorous parts | tech | Your strongest material, all first-hand, with real numbers |
| Building my own tools in the open | tech | traininglogs, this site, Alfred: decisions and mistakes |
| How I study and keep up | tech | Interview prep, reading open-source code, working as a distractible person |
| Training like an engineer | fit | Your plans already hold the method (assessment, recovery tiers) |

## Tech candidates

| # | Working title | Angle | Reader | Evidence | Strength |
|---|---|---|---|---|---|
| T1 | Hugo to Astro on Cloudflare, free | Moving DNS, a 116-line redirect file (slash and no-slash both, Cloudflare matches exact paths), the www rule, a site that went briefly down, a mistake that shipped mock-ups | Anyone moving a personal site | This session's history, `scripts/make_redirects.py`, `wrangler.jsonc` | Strong. Fresh, all facts verifiable. Already promised on the website project page |
| T2 | What actually makes LLM extraction accurate | The schema is a bigger lever than the prompt. A model dropped sets with zero warnings (1 of 4 right against 4 of 4 for Haiku) | Developers extracting structured data | `traininglogs/extraction-design-principles.md`, `roadmap.md` eval table, `eval_runs/` | Strong. Has measurements |
| T3 | I deleted the parser that never ran | `parse_exercise_block` fired on 0 of 10 real inputs because headers never matched. Delete beats fix | Anyone with legacy rules code | `roadmap.md` | Medium. Short. May fold into T2 |
| T4 | Running an AI agent unattended | Failing test first, CI as the only witness, a hand-off list, never merge | Developers trusting agents with real repos | `.claude/skills/traininglogs-agent`, `archived/plans/ai-workflow-plan.md` (has a "Step 2 notes (for the blog)" section) | Strong. You already marked it as blog material |
| T5 | Dry-run before every paid call | A regeneration priced at $6.76 against $3.29 left. `--dry-run` lists every call and spends nothing | Anyone on a small API budget | `traininglogs/CLAUDE.md`, `feedback_api_budget` | Strong, short |
| T6 | Mark, don't delete | `ON DELETE CASCADE` would delete the cost history with the input. Reject by status instead | Developers with audit data | `traininglogs/CLAUDE.md`, `pre-online-plan.md` | Medium |
| T7 | Setting up a repo so a cloud agent can work in it | Context files, rules, skills and CI from scratch, and what a cloud thread does and does not load | Developers starting with Claude Projects | The two plans from today, after they are done | Strong, but write after doing it |
| T8 | From an idea on my phone to a published page | Capture shortcut, Notion board, cloud thread, PR preview, merge | Solo builders | `alfred/plans/pipeline-plan.md`, after it works | Strong, but later |
| T9 | Reading an open-source codebase to learn from it | Open Wearables: data model, sync path, what it taught traininglogs | Developers who want to learn from big repos | `open-wearables-guide.md` | Medium. Needs a general angle, not a summary |
| T10 | Plan files and resume pointers for a distractible mind | Branch per step, a "Resume here" section, one next action after a gap | Anyone who loses the thread | Your `CLAUDE.md` methodology, `feedback_plan_and_branch_methodology`, `feedback_scope_creep_pattern` | Personal, likely the most shared. Your call whether to publish |
| T11 | System design and DSA notes | Capacity estimation drills and numbers | Interview candidates | `interview-prep/data/sessions` (5 sessions), `reference.md` | Thin. Empty `kb/`. Grows only as you restart prep |

## Fitness candidates (from your plans, not from me)

| # | Working title | Evidence |
|---|---|---|
| F1 | How I assess before I program (cause taxonomy, test battery, the cossack problem) | `training/ASSESSMENT.md` |
| F2 | Three tiers of recovery: joints, muscle, whole body | `training/RECOVERY.md` |
| F3 | Gymnastics basics: shapes, supports, handstand, false grip | `training/GYMNASTICS.md` |
| F4 | A goal sheet by movement pattern | `training/GOALS.md` |

You said fitness is handled by your fitness plans. These are only pointers to where the material sits.

## Suggested first article

T1. It is fresh, every fact is checkable against the repo, it needs no research, and it is the exact story
the website project page already promises. It also becomes the template the website-agent is tested
against (see `website-agent-and-pipeline-plan.md`, step 0). T4 and T5 come next, then T2.

## Curation session (next)

1. Confirm or change the four themes.
2. Dump your own top ideas into the tables above. Anything missing from my mining goes here.
3. Pick 5. Cap one article in progress at a time.
4. For each pick, I read the full evidence file, then we outline together before any drafting.
5. Voice and quality rules: human, plain, fun, no invented facts, sources listed, `unslop` before merge.

## ▶ Resume here

Status: candidates mined 2026-10-22. Not yet curated.
Next action: curation session step 1, confirm the themes, then add your own ideas.
State: branch `docs/agent-plans`, nothing pushed.
