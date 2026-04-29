+++
title = "GitHub Actions for Personal Projects"
date = 2026-01-08T10:30:00Z
tags = ["tech", "devops"]
summary = "How I set up lightweight CI/CD for personal projects without overengineering it."
+++

Enterprise CI/CD setups are often overkill for personal projects — multiple stages, approval gates, deployment environments. For a solo developer, you need something lighter.

GitHub Actions hits the right balance: free for public repos, simple YAML, no separate server to maintain.

## My standard personal project workflow

```yaml
name: ci

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: pytest tests/ -v
```

This covers the basics: run tests on every push to main and on every PR. If tests pass, I know nothing is obviously broken.

## Adding a lint step

```yaml
      - run: pip install ruff
      - run: ruff check .
```

Ruff is fast enough that it adds almost nothing to CI time. I run the same command locally before pushing, so CI is just a safety net.

## Deployment

For this website, the deploy workflow builds the Hugo site and pushes to GitHub Pages:

```yaml
      - run: rm -rf public && hugo
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

The key thing is keeping workflows short and doing one thing well. A workflow that tests, lints, builds, and deploys in a single job is fine for a personal project. A failing step stops the whole thing, which is what you want.

## What I avoid

- Caching dependencies unless build time is actually a problem
- Secrets management complexity until there are real secrets to manage
- Multiple environments until there is a reason to have them

The goal is to catch obvious mistakes automatically and get out of the way.
