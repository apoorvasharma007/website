# Design rules

The look is locked. Read this before changing anything under `src/components/`, `src/layouts/`,
`src/pages/` or `src/styles/`. Apoorva checks every look change on the PR's preview URL. Take screenshots
only when asked.

Who may change what:
- `website-code` may change design, and the rules here, in the same PR as the code they describe.
  Apoorva approves on the preview before merging.
- `website-content` never changes design. It edits Markdown in `src/content/pages/` only, and never
  touches the folders above or this file.

Each section lists what is fixed and the tests that guard it. "Fixed" means `website-code` changes it only
when the task asks for that change.

## Global (every page)

Fixed:
- Colours come only from the tokens in `src/styles/tokens.css`. No raw hex or rgb anywhere else. One
  exception today: the dim backdrop behind the phone menu, `rgba(0, 0, 0, 0.55)` in
  `src/layouts/ShellLayout.astro`. The Résumé button's yellow is `--resume`, the same in both themes.
- Spacing, radii, type sizes and timings use a token wherever one exists. Raw px is fine for hairline
  borders and icon sizes.
- Two themes. Dark is the default, light is opt-in through the theme toggle, and the choice persists in
  `localStorage` (`as-theme`). Every colour token has a dark and a light value. A new colour needs both, and
  Apoorva's yes.
- Fonts: Inter for everything (weights 400, 450, 500, 600). Kalam only for the two hero stickers ("i like",
  "i love"). Code uses the `--mono` system stack. No other fonts.
- Two sides, two colours: Tech is `--tech` blue with `--t2` cyan, Fitness is `--fit` pink with `--f2`
  purple. A page or element gets its side colour through `data-side`, never a hard-coded colour. Blog mixes
  both. No third side colour.
- Links: one hover everywhere, a soft grey plate behind the link (`--plate`, `--plate-hot` on press). Never
  an underline, never greyed text.
- Motion: page changes cross-fade through view transitions; the top bar, sidebar, footer and theme toggle
  stay put. With reduced motion on, every animation and transition stops.
- Layout: no sideways scroll at any width from 360 px up. Every page has the shared footer.
- Touch: no iOS grey tap box or long-press preview. Pressed states are drawn by the site.
- Banned: uppercase mono labels, the "·" separator (use space, a new line or separate pills), muted yellow,
  underlined links, new fonts, new colours.

Guarded by: `tests/sizes.spec.ts` (no sideways scroll per page and screen), `tests/smoke.spec.ts` (footer,
theme, reduced motion, fonts), `tests/shell.spec.ts` (footer, theme in the shell).

## Home (`src/pages/index.astro`, text in `src/data/home.ts`)

What it shows, top to bottom:
1. "Hi, I'm Apoorva." as the hero name. No top nav on Home.
2. Two hero scenes, Tech ("i like Building Tech", `whack-a-bug.svg`) and Fitness ("i love Working Out",
   `clean-and-jerk.svg`), each with a spotlight in its side colour and a one-line caption.
3. Three rows: Tech, Fitness, Blog, each a big word with a short description, lit by a side-coloured
   gradient on hover, focus or press.
4. "Say Hello": a line of text, Contact Me and Résumé buttons, then YouTube, Instagram and GitHub pills.
5. A scroll cue at the bottom that fades out after the first scroll.

Laptop (wider than 800 px): both scenes side by side, each with its heading, and both headings on one line
so the art lines up.

Phone (800 px and narrower): the scenes become a swipe carousel. Two phrase tabs sit side by side above it,
each on one line from 360 px up, with an underline under the lit one that follows the swipe. Autoplay slides
to Fitness after about 7 seconds, then back and forth every 8 seconds in step with the art's loop, at most
8 times. A touch stops it. Reduced motion turns it off.

Fixed: everything above. That includes the hero name, the art and its positioning, the spotlight, the
sticker tilt, the carousel timing (it is matched to the SVG loops), the order of the rows, and the captions
and descriptions (Apoorva's own words, 2026-10-16).

Typos in the Home text (`src/data/home.ts`) are fixed by `website-code`, never by `website-content`.

Guarded by: the Home tests in `tests/smoke.spec.ts` (hero, phrases, fonts, scenes, carousel, autoplay, theme,
reduced motion, SVG animations) and `tests/swipe.chromium.spec.ts`.

## Not yet written

Side overview, Blog list, Knowledge Base book, Chapter, Project, Blog post, Tutorial/Demo/Program, About and
Contact, 404, Shell (sidebar, top bar, footer). Until a section exists, treat that page as fully fixed.
`website-code` writes a section the first time it changes that page.
