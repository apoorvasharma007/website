# Minimal Hugo Site for Apoorva Sharma

Ultra minimal, modern dark personal site built with Hugo. No themes, no JavaScript, and a small amount of CSS that is easy to understand and edit.

The site has:

- Home with hero, resume link, recent posts, tech, and fitness intro
- Posts, Tech, and Fitness sections
- About page
- GitHub Pages deployment via GitHub Actions

## Prerequisites

- Hugo extended (recommended)
- Git

### Install Hugo

See the official docs for your OS: `https://gohugo.io/installation/`

On macOS (Homebrew):

```bash
brew install hugo
```

Verify:

```bash
hugo version
```

## Run the site locally

From the project root:

```bash
hugo server -D
```

Then open `http://localhost:1313/` in your browser.

The `-D` flag includes drafts; you can omit it later if you prefer.

## Content structure

- Home page: `content/_index.md`
- About page: `content/about.md`
- Posts: `content/posts/`
- Fitness: `content/fitness/`
- Tech: `content/tech/`

Sample posts are already included:

- `content/posts/first-tech-post.md`
- `content/fitness/first-fitness-post.md`
- `content/tech/first-project-post.md`

## Creating a new post

From the project root, use Hugo’s `new` command:

```bash
hugo new posts/my-new-post.md
hugo new fitness/my-new-session.md
hugo new tech/my-new-tech-note.md
```

Then edit the generated file under `content/` and fill in:

- `title`
- `date`
- `categories` (e.g. `"Tech"`, `"Fitness"`)
- `tags` (e.g. `"tech"`, `"fitness"`, `"mindset"`, `"vlog"`)
- The body content in Markdown

## Layout and design

- Layouts live in `layouts/`
  - Base: `_default/baseof.html`
  - Home: `index.html`
  - List pages: `_default/list.html`
  - Single pages: `_default/single.html`
  - Partials: `partials/header.html`, `partials/footer.html`
- Styles live in `assets/css/styles.css`
- Resume is served from `static/resume.pdf`

The design is:

- Dark background (`#0f1115`)
- System font stack only
- No animations, shadows, gradients, or icons
- No external fonts, analytics, or JS

## Deployment (GitHub Pages)

This repo is set up to deploy via GitHub Actions to GitHub Pages.

1. Push the code to GitHub on the `main` branch.
2. In GitHub, go to **Settings → Pages** and set:
   - **Source**: GitHub Actions
3. The workflow file is at `.github/workflows/deploy.yml`.

On each push to `main`, the workflow will:

- Install Hugo
- Build the site with `hugo --minify`
- Publish the `public/` folder to GitHub Pages

Your site will be available at:

- `https://<your-github-username>.github.io/<repo-name>/` (default), or
- Your custom domain once configured (see below)

## Custom domain: apoorvasharma7.com

1. In GitHub, open the repository settings:
   - Go to **Settings → Pages**
   - Under **Custom domain**, enter `apoorvasharma7.com` and save.
2. In Hostinger (or your DNS provider), create DNS records:
   - If using an apex domain (`apoorvasharma7.com`):
     - Create an `A` record pointing to GitHub Pages IPs (see latest values in GitHub Pages docs).
   - If also using `www.apoorvasharma7.com`:
     - Create a `CNAME` record for `www` pointing to `your-username.github.io`.
3. Enable **Enforce HTTPS** in GitHub Pages once the certificate is issued.

DNS changes can take some time to propagate. Once they do, `apoorvasharma7.com` will serve this Hugo site.

## Editing the resume

Replace the placeholder file at:

- `static/resume.pdf`

The site links to it at `/resume.pdf` from the home page.
