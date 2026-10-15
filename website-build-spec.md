# Website build spec (LOCKED 2026-10-15)

Source of truth for the Astro build. Every line here was confirmed by Apoorva, and the final prototype `mockups/astro-rebuild/site-final.html` (https://claude.ai/artifact/DkCam7qZ8EYGGcHaLHGWAc) was approved as perfect on 2026-10-15. Change a line only with his explicit yes. Open items at the bottom are build-time details, not design questions.
Design record: `website-rebuild-plan.md` rows 9, 10, 11. Mockup: `mockups/astro-rebuild/landing-v2.html`.

## Global
- Stack: Astro on Cloudflare Pages, content fed from Notion.
- Sides: Tech and Fitness, equal weight, plus About and Contact. Four-item nav. Label is "Fitness".
- Shell: dark docs-style (left tree, reading column, right "On This Page" outline) for knowledge bases, articles, projects and protocols. Dark default, light toggle, Inter.
- Colors: Tech blue #3B82FF to #00D1FF. Fitness magenta #F0289C to violet #7A3CFF. They replace yellow and pink site-wide. Résumé button is #FFE600 with dark text.
- Text: Title Case on every heading and label. No "·" separators. Search is not in the first build.
- Row focus: static glow from the left, sweep style. On phone the row nearest the middle of the screen is active.
- Menu groups (Knowledge Base, Make, Articles) are collapsible, collapsed by default, only the group holding the current page is open.
- Old URLs keep redirecting.

- Small labels (dates, tags, table headers, "On This Page", callout titles, card tags): Inter 13px weight 500, Title Case, muted color, no uppercase, no letter spacing. One label style site-wide. Confirmed 2026-10-15.
- Code font: system monospace stack for code blocks and inline code only (no font download). Everything else is Inter. JetBrains Mono is dropped from the site. Confirmed 2026-10-15.
- Diagram boxes, link labels and list step numbers: Inter 500. Confirmed 2026-10-15.

## Home
- Full-width landing "Reveal": centered hero, four floating cards, Tech and Fitness as huge rows, "Say Hello" footer (Contact Me, Résumé, YouTube, Instagram, GitHub).
- Hero line: "Engineering Systems  Training Movement", no periods. Inter 500, first half in Tech blue, second in Fitness magenta. Confirmed 2026-10-15.
- No Explore buttons under the hero. No preview art on the rows.
- Hero cards: only two. Tech art (`whack-a-bug.svg`) on the left, Fitness art (`clean-and-jerk.svg`) on the right, to match the nav order. The Last Session and Astro plan cards are deleted (they were hidden on phone).
- The two SVGs sit on a cream card (#F4F1EA) in both themes. Confirmed 2026-10-15.

## Tech and Fitness landing pages (locked in the flow prototype, `site-flow.html`, view `v-section`)
- Inside the docs shell (left tree, top bar with breadcrumb): small dot and side name, huge side name as the title in its side color, one-line intro, then a list of huge rows with the left glow. No cards. (Corrected 2026-10-15: an earlier note here wrongly said "no left tree"; the locked flow keeps the tree.)
- Tech rows: Knowledge Base, Projects, Demos, Tutorials, Articles. Fitness rows: Knowledge Base, Programs, Dashboard, Articles.
- Rows with no content yet show a "Soon" tag and do not link.
- Tech intro: "Things I build, things I learn, and the notes I keep so I can build them again." Fitness intro: "Calisthenics, rings, strength, conditioning, juggling and reaction drills, and the theory behind them." (Title Case rule applies to headings and labels only, not intro sentences.)
- The A/B card mockup (`tech-landing.html`) was a mistake and is discarded.
- Fitness rows: Knowledge Base (opens the Training knowledge base page), Programs, Dashboard (opens the traininglogs dashboard in a new tab), Articles.

## About
- Docs-shell reading style, one column, no left tree, intro with a photo slot. Sections: Who I Am, What I Do At Work, What I Train, Where To Find Me (Résumé button, YouTube, Instagram, GitHub). Copy is Apoorva's to write, sample text marked as sample until then. Confirmed 2026-10-15.

## Contact
- First build is a simple page in the About reading style, no form. One line ("Best Way To Reach Me Is Email"), the email shown as text with a copy button (apoorva.c.sharma@gmail.com, confirmed), links to GitHub, YouTube and Instagram, and a small "Form Coming Soon" note. LinkedIn is not on the site. The form comes later as its own Cloudflare function with spam protection and its own webhook secret. Confirmed 2026-10-15 (form-later taken from his earlier "we can worry about this later").

## Fitness Dashboard
- The Dashboard row on the Fitness page opens the existing traininglogs dashboard in a new tab. Row label "Live Training Data". Nothing is built for it in the first build. Confirmed 2026-10-15. URL: https://apoorvasharma007.github.io/traininglogs/ (the old site's /dashboard/ page already redirects there, so /dashboard/ and /movement/dashboard/ keep redirecting to it).

## Fitness knowledge bases
- Same docs-shell page as the Tech knowledge base (left tree, reading column, "On This Page" outline), accent magenta instead of blue. Existing Training and Nutrition content migrates. Confirmed 2026-10-15.

## Redirects
- Cloudflare `_redirects` file, one permanent (301) line per old section and per old post, generated from the old content folder and shown in full before the build. `/movement/` goes to `/fitness/`, `/movement/dashboard/` and `/dashboard/` go to the traininglogs dashboard, `/work-with-me/` folds into Contact and redirects there. Confirmed 2026-10-15.
- Blog posts move under Articles. Tech (8): GitHub Actions For Personal Projects, Infrastructure As Code First Principles, How I Learn A New Codebase, A Note-Taking System That Actually Works For Engineers, Python Dataclasses For Domain Models, Testing In Python, What I Learned Deploying On Azure, Building traininglogs. Fitness (7): On Systems Over Goals, Building A Sustainable Training Habit, Progressive Overload Is Not Just Adding Weight, Sleep Is A Training Variable, The Deload Week, What To Eat When Training For Strength, Why I Started Running. Split confirmed 2026-10-15.
- "On Systems Over Goals" goes to Fitness (confirmed 2026-10-15), so the split is Tech 8, Fitness 7.

## 404
- One simple Reveal-style page: huge "Page Not Found" in Tech blue, one line saying the page may have moved, one Home button (a second Tech or Fitness button was dropped 2026-10-15 because those pages did not exist yet and it led back to the same 404; revisit when they do). Nav stays. No art. Confirmed 2026-10-15.

## SEO and sharing
- One shared preview image for the whole site: dark card, "Apoorva Sharma" and the hero line in blue and magenta, made once. Each page takes its own title and description from Notion (a Description field), plus a sitemap and robots.txt. Per-page generated images are a later upgrade. Confirmed 2026-10-15.

## Notion pipeline
- One Notion database for all content. Fields: Title, Slug, Side (Tech or Fitness), Type (Knowledge Base, Project, Demo, Tutorial, Program, Article), Knowledge Base (book a chapter belongs to), Order (position in the tree), Description, Date, Status (Draft or Published; only Published goes live). The build picks the layout from Type. Confirmed 2026-10-15.

## Global defaults (bundle confirmed 2026-10-15)
- Accessibility: text contrast at least 4.5 to 1 in both themes, visible keyboard focus ring, "Skip To Content" link, labels on every icon button, all motion off under reduced motion.
- Performance: at most 120 KB of JavaScript on first load, art loads after the text, Inter only with display=swap, Lighthouse mobile target 95 or higher.
- Favicon: the "AS" logo mark, dark and light versions.
- Analytics: none in the first build (Cloudflare's cookie-free counts can be switched on later).
- Footer: one identical footer component on every page, Home included, in the same position: a line with "© <year> Apoorva Sharma. All Rights Reserved." and the Home and Contact links (no About). Laptop: copyright left, links right. Phone: links on line 1 and copyright on line 2, both centered. On Home the "Say Hello" block sits above it as a normal section and does not replace it. The year fills in at build time.
- Content protection: the copyright footer, robots.txt disallowing known AI crawlers (GPTBot, ClaudeBot, CCBot, Google-Extended, PerplexityBot and similar), Cloudflare's AI-crawler blocking if it works as expected (verify in Cloudflare docs at hosting setup), and a no-AI-training meta tag. None of this stops a determined copier. It stops honest crawlers.

## Hosting and deploy (confirmed 2026-10-15)
- Branches: base `refactor/astro-rebuild` cut from `main`, one sub-branch per build step, each squash-merged into the base. The base merges to `main` only when everything works and Apoorva has seen the Cloudflare preview URL. The old site stays live meanwhile.
- Cutover: after approval, DNS moves from GitHub Pages to Cloudflare, old URLs redirecting. Every DNS change is shown first and never made without his yes.
- Notion changes: a Cloudflare deploy hook triggers a rebuild, called by a Notion automation with a scheduled job every 6 hours as fallback.
- Secrets: the Notion token lives only in Cloudflare environment variables, never in the repo.

## Top nav and phone header (2026-10-15)
- No colored dots in front of Tech and Fitness in the top nav, so all four items look the same. The header never wraps to a second line on phone: below 560px the brand text hides and only the "AS" mark shows, links tighten, theme button stays.
- Footer on phone: links on the first line, copyright on the second, both left-aligned.

## Header and hero art (2026-10-15, hero composition still open)
- Header: one grid. Laptop: full name left, four links, theme button. Phone (640px and below): row 1 is the full name and theme button, row 2 the four links spread evenly. The "AS" mark stays beside the name.
- Art: no card, no float, no rotation, only the SVG animates. Each SVG sits on a radial glow in its side color (blue Tech, magenta Fitness) that runs deep into the figure, with less white in the middle.
- Hero composition: three experiments in `mockups/astro-rebuild/landing-v4.html` (1 Split Stage, 2 Merged Rows, 3 Toggle Stage). Not chosen yet. The sentences inside them are placeholders, the real copy is Apoorva's to confirm.

## Final hero (2026-10-15)
- Name, then the two phrases and two scenes. Laptop (above 800px): both side by side with no toggle. Phone (800px and below): one scene at a time with the two phrases as tabs under the name, to save screen height. Manual tabs, no auto-switching.
- Each scene sits in a spotlight (a soft beam from above and a pool of light on the floor, no oval halo) in the same 4:3 box so both are the same size. The phrase is above in its side color. The caption is below in the bright body tone. Eased gradients plus a fine grain keep the fade into the page smooth.
- Captions (copy is a placeholder until confirmed): Tech "I build the software that shows where the cloud money goes." Fitness "I train the body that carries the laptop."
- Hero applies to the hero only. The Tech and Fitness rows below stay as locked.

## Text tones (confirmed 2026-10-15, whole site)
- Dark: body and descriptions #D0D2D8, nav and labels #A4A7AF, dates and small text #868991. Light: #2A2C32, #484A52, #6B6D75. All at least 4.5 to 1 (descriptions about 13 to 1).

## Naming, hierarchy and Notion mapping (confirmed 2026-10-15)
- Sidebar groups, overview rows and Notion Type use the same words. Tech: Knowledge Base, Projects, Demos, Tutorials, Articles. Fitness: Knowledge Base, Programs, Dashboard, Articles. "Make" and "Do" are removed. A Type with no published pages shows "Soon" on the overview.
- Breadcrumb and tree come from a Parent link (self-relation) in the one Notion database, any depth. Example Fitness / Knowledge Base / Training / Core Training Principles. Overview pages show just the side name, no "Overview".
- Fields on every page: Title, Slug, Side (one of Tech or Fitness), Type, Parent, Order, Description, Date, Status (only Published goes live). Project adds Source URL, Docs URL, Live URL (each block shows only if filled). Program adds Sources (list of title, URL, note). Article adds Tags (free, optional, not enforced, kept for the later search feature; where they show is decided later). No Stack, no Video field (video lives in the page body). No tags or chips on any other type.
- Removed from content pages: the small dot and label above the title, the "Tech / Projects" label and "Edit This Page" row at the end, the "Knowledge Base" word in the meta line, the two-dot side tags, status and stack chips.
- Page bottoms: knowledge base chapter and article get Previous and Next. Project gets Links. Program gets Sources. Every page gets the site footer. The Programs group and Type are named "Programs" (the word protocol can appear in the writing).

## Elements on each page type (confirmed 2026-10-15)
- Every docs-shell page: top bar (menu button on phone, breadcrumb, theme button), left tree (Home, Tech and Fitness groups, About, Contact, Résumé, GitHub, YouTube; only the group holding the current page is open; slides in on phone), site footer. Breadcrumb shows the full path on laptop and the parent plus the current page on phone. Tree groups nest to any depth.
- Overview (Tech, Fitness): huge side name in its color, one-line intro, rows (big word, one-line description, arrow, "Soon" if empty). No eyebrow, breadcrumb is just the side name.
- Knowledge Base book page: title, Description as intro, date, list of chapters (and sections) with title and description. No Previous and Next.
- Knowledge Base chapter: title, Description as intro, date, On This Page outline (only when two or more headings), body, Previous and Next chapter.
- Article: title, Description as intro, date (tags stored, not shown yet), outline, body, Previous and Next article.
- Project: title, Description as intro, date, outline, body (video or demo goes in the body), Links (Source, Docs, Live, each only if filled).
- Program: title, Description as intro, date, outline, body, Sources (only if any).
- Demo: like a Project with Links. Tutorial: like an Article with Previous and Next within Tutorials. Neither is in the prototype yet.
- Dashboard: no page, the row opens the traininglogs dashboard in a new tab.
- Date shows on every content page, format "29 Apr 2026". No chips or tags anywhere except article tags (stored only).
- Title Case applies to page titles and headings as authored in the prototype; in Notion the author decides.

## Open items
- Whether these two SVGs are final. The card is built so a new SVG drops in. Loading plan confirmed: minify, load after the text, pause off-screen, one still frame under reduced motion.
- Content-page details to confirm against the flow prototype: project page, program (protocol) page, article page.
- Light mode and tablet width checks of the new glow and colors.

## Feedback round 2026-10-15 (supersedes earlier lines where they differ)
- Articles is renamed Blog everywhere (Type, tree, overview row, URLs `/tech/blog/<slug>/`, `/fitness/blog/<slug>/`). The tree shows Blog as one link that opens that side's list page (`/tech/blog/`, `/fitness/blog/`), never the posts. `/blog/` lists every post from both sides, newest first, and the top nav (Home and 404) gets a Blog link between Fitness and About.
- Previous and Next are plain small text links (arrow, the word, no title or box). The title stays in the link's accessible label.
- Chapter lists and blog lists use separate cards with a gap, not rows in one box. One component for both; blog cards add the date. Design choice among three variants pending (A separate cards is wired in).
- The left tree has no Home item (the name and AS mark at its top link home). The Home page footer is only the copyright line; its Home and Contact links are removed because the nav shows Contact and we are on Home. Other pages keep the Home and Contact footer links.
- The overview rows' focus glow on phones follows scroll progress: the focus line slides from 30 percent of the screen to the bottom edge, so the last row can be reached, and overscroll cannot move it.
- Depth limit (2026-10-15): a knowledge base nests at most book, section, chapter. The build fails with the page name if anything sits deeper or names a parent that is not published. Section headings on a book page are real headings (section title, its description) above their chapter cards.
- Cards are compact: title and description each clamp to two lines, two columns on a laptop, one on a phone. Blog list pages (`/blog/`, `/tech/blog/`, `/fitness/blog/`) use the top nav layout with no left tree.
- Home: Tech and Fitness row descriptions are hidden on phone (shown on laptop), Say Hello lines up with the row text, and the social links are small pills.
- Overview pages (2026-10-15, supersede "just the side name"): the heading is Overview in the side color and the breadcrumb is Side / Overview, matching the tree item and the rule that a page's heading is its last breadcrumb item.
- The top nav is sticky on every page: the docs top bar already was, and the Home, Blog and 404 header now is too, frosted like the docs bar. On a phone it is two rows, about 130px.
- Home: the Tech and Fitness descriptions show on phone and laptop again.
- Overview heading uses the same size and color as every other page title (2026-10-15, supersedes the side-colored huge heading). Home has one line between the Fitness row and Say Hello, not two.
- Alignment rule (2026-10-15): every page's text shares one left edge. Rows and lists have no side padding, the glow behind a row bleeds past the text instead, and nothing shifts on hover. Chapter and blog lists are open rows (title, two-line description, date) between hairlines, not boxes, so their text lines up with the page title; Links and Sources keep boxed cards. Blog list pages have no intro line.
- Phone header is one row: AS mark, the five links, theme button. The name text is hidden below 640px.
- Page chrome (2026-10-15): the footer sits at the bottom of the screen on short pages, its rule is as wide as the text, and lists have one line per gap between rows (none after the last). The Home, Blog and 404 header is 64px tall like the docs bar, with no bottom line.
- Header and hero (2026-10-15, supersede the AS mark and four-link phone header lines): the brand is the full name everywhere (no AS box in the header or the tree). On a phone the header shows the name, Tech, Fitness, Blog and the theme button on one row; About and Contact are hidden there and appear as footer links (on Home only on a phone). Footer links are Home, About, Contact on every other page. The phone hero tabs have no rule under them and the spotlight is wider at the top so it spans both tabs. The favicon keeps the AS mark.
- Layout tokens (2026-10-15): `--gutter`, `--bleed`, `--wrap`, `--wrap-doc`, `--bar-h`, `--r-sm/md/lg/pill`, `--ease` in `tokens.css`; the row glow is one shared rule in `global.css`. New components use these, not literals. Open: 19 distinct font sizes remain, including six display sizes (hero name, Home rows, Overview rows, Say Hello, 404, page title). A type scale is proposed, not built.
- Type scale (2026-10-15, supersedes the separate huge sizes): three display tokens in `tokens.css`. `--t-hero` is only the Home name. `--t-section` (class `display`) is the Home Tech and Fitness rows, Say Hello, the Overview rows and the 404 heading. `--t-title` is every page title. Add new big text with these, not new clamp values.
- Top bars are more transparent (frosted, page shows through): dark 55 percent, light 60 percent. Phone header links are spaced evenly between the name and the theme button.
- Overview pages (2026-10-15, supersede the Overview heading): no visible title, because the breadcrumb already says Side / Overview (the h1 stays in the page for screen readers). The side's intro line leads, then the rows. Every row description is one line (shortened where needed) so all rows are the same height. Rows keep the shared section size, so nothing else needs resizing.
- Home rows stack the word above the description on a phone for both rows (side by side on a laptop). The row glow runs to the full row width before fading.
- Top gap (2026-10-15): every page starts `--top` (20 to 32px) under the top bar, set once in `tokens.css` and used by docs pages, Blog lists, Overview and the Home hero.
- Row descriptions on Home and Overview share one smaller style (`.row-desc`, 15px).
- Phone focus row: on a page that scrolls more than a quarter of the screen, the row nearest the middle is lit, and the last row is lit at the very end (overscroll counts as the end). A page that barely scrolls lights none. This replaced the scroll-progress sweep, which raced through the rows on short pages.
- Phone focus row, revised (2026-10-15, supersedes the "barely scrolls lights none" rule): the row nearest the middle of the screen is lit on every page including short ones (Overview), the last row is lit at the very end of a scrolling page, and a row also lights while pressed (`:active`, with a no-op touchstart listener so iOS applies it).
