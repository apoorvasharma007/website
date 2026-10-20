"""Write static/_redirects so every URL on the old Hugo site lands on a real page.

Run after `npm run build`: python3 scripts/make_redirects.py
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
DASHBOARD = "https://apoorvasharma007.github.io/traininglogs/"
TRAINING = "/fitness/knowledge-base/training/"

MOVED = {
    "/tech/traininglogs/": "/tech/projects/traininglogs/",
    "/tech/website/": "/tech/projects/website/",
    "/blog/building-traininglogs/": "/tech/blog/building-traininglogs/",
    "/training/": TRAINING,
    "/training/foundations/": TRAINING + "foundations/",
    "/training/foundations/principles/": TRAINING + "foundations/principles/",
    "/training/foundations/progression-models/": TRAINING + "foundations/progression-models/",
    "/training/foundations/session-structure/": TRAINING + "foundations/session-structure/",
    "/work-with-me/": "/contact/",
    "/dashboard/": DASHBOARD,
}

# Pages dropped at launch go to the nearest section page. First match wins.
DROPPED_TO = [
    ("/blog/", "/blog/"),
    ("/tags/", "/blog/"),
    ("/categories/", "/blog/"),
    ("/tech/knowledge-base/ai/", "/tech/"),
    ("/nutrition/", "/fitness/"),
    ("/training/", "/fitness/"),
    ("/programs/", "/fitness/"),
]

# Never on the live sitemap, but linked from the Hugo era or the old plan.
EXTRA = {"/movement/": "/fitness/", "/movement/dashboard/": DASHBOARD}


def exists(path: str) -> bool:
    return (DIST / path.lstrip("/") / "index.html").is_file()


def target(old: str) -> str | None:
    if old in MOVED:
        return MOVED[old]
    if exists(old):
        return None
    for prefix, section in DROPPED_TO:
        if old.startswith(prefix):
            return section
    raise SystemExit(f"No home for {old}. Add it to MOVED or DROPPED_TO.")


def main() -> None:
    old_urls = (ROOT / "scripts/old-urls.txt").read_text().split()
    rules = {old: new for old in old_urls if (new := target(old))}
    rules.update(EXTRA)
    for old, new in rules.items():
        if new.startswith("/") and not exists(new):
            raise SystemExit(f"{old} points at {new}, which the build does not have.")
    lines = [f"{old} {new} 301" for old, new in rules.items()]
    (ROOT / "static/_redirects").write_text("\n".join(lines) + "\n")
    print(f"{len(lines)} redirects, {len(old_urls) - len(rules) + len(EXTRA)} old URLs kept as they are")


main()
