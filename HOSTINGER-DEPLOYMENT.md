# Hostinger + GitHub Pages Deployment Guide

This document explains how to deploy this Hugo site to **GitHub Pages** and connect it to a custom domain hosted on **Hostinger**.

Use it as a reference; anything in UPPER_SNAKE_CASE is a placeholder you can change.

---

## 1. Prerequisites

- A GitHub account.
- A Hostinger account with the domain: `apoorvasharma7.com`.
- Hugo installed locally (extended); verified with:

```bash
hugo version
```

---

## 2. Prepare the GitHub repository

1. Create a new repo on GitHub:
   - Name: `REPO_NAME` (e.g. `website` or `apoorva-site`).
   - Visibility: public or private (either works with GitHub Pages via Actions).

2. In your local project (this folder):

```bash
git init
git remote add origin git@github.com:GITHUB_USERNAME/REPO_NAME.git
git add .
git commit -m "Initial Hugo site"
git branch -M main
git push -u origin main
```

Replace:

- `GITHUB_USERNAME` with your GitHub username.
- `REPO_NAME` with your chosen repo name.

---

## 3. Enable GitHub Pages

1. In GitHub, open the repo: `https://github.com/GITHUB_USERNAME/REPO_NAME`.
2. Go to **Settings → Pages**.
3. Under **Source**, choose **GitHub Actions**.
4. Save.

The workflow file `.github/workflows/deploy.yml` in this repo is already configured to:

- Install Hugo (extended).
- Build the site with `hugo --minify`.
- Deploy to GitHub Pages using the official `deploy-pages` action.

Every push to `main` will trigger a deployment.

---

## 4. Test a deployment from main

1. Make sure all changes are committed and pushed:

```bash
git add .
git commit -m "Update site"
git push
```

2. In GitHub, go to the repo’s **Actions** tab.
3. Look for the latest **“Deploy Hugo site to GitHub Pages”** workflow run.
4. Confirm it succeeds.

Once it completes:

- GitHub will show a **GitHub Pages** URL on the **Settings → Pages** screen.
- This URL is the one you’ll map your custom domain to.

---

## 5. Configure Hostinger DNS for apoorvasharma7.com

You will point your domain at GitHub Pages using DNS records. GitHub occasionally updates IPs, so always verify against their official docs.

1. In GitHub:
   - Go to **Settings → Pages** for your repo.
   - Under **Custom domain**, enter: `apoorvasharma7.com` and save.

2. In Hostinger:
   - Go to **Domains → apoorvasharma7.com → DNS / Manage DNS**.

3. Add/verify records following the pattern from the **GitHub Pages custom domain** docs:
   - For apex/root domain `apoorvasharma7.com`:
     - Create **A records** pointing to the current GitHub Pages IP addresses shown in the official docs.
   - For `www.apoorvasharma7.com`:
     - Create a **CNAME** record:
       - **Name**: `www`
       - **Target**: `GITHUB_USERNAME.github.io`

4. Remove any old or conflicting `A`/`CNAME` records for the same names (`@` / `www`) that point elsewhere.

> Always cross-check the exact IP addresses and recommendations in the current GitHub Pages documentation, as they may change over time.

---

## 6. Enable HTTPS

1. In GitHub, go to **Settings → Pages**.
2. After DNS has propagated and GitHub detects the domain, you should see:
   - A section for **“Custom domain”** with `apoorvasharma7.com`.
   - A checkbox **“Enforce HTTPS”**.
3. Check **Enforce HTTPS**.

GitHub will request and manage a TLS certificate for you. This may take several minutes the first time.

---

## 7. Verify everything

After DNS propagation (can take from a few minutes up to 24 hours):

1. Visit:
   - `https://apoorvasharma7.com`
   - `https://www.apoorvasharma7.com` (if configured)
2. Confirm:
   - The site loads with HTTPS (lock icon).
   - The content matches your latest deployment from GitHub.

If you see GitHub’s “There isn’t a GitHub Pages site here.” page:

- DNS may still be propagating, or the CNAME/A records may not match what GitHub expects. Re-check **Settings → Pages** and Hostinger DNS.

---

## 8. Ongoing updates

To update the site:

1. Make changes locally (content, layouts, CSS, etc.).
2. Run locally to verify:

```bash
hugo server -D
```

3. When satisfied:

```bash
git add .
git commit -m "Describe the change"
git push
```

4. Wait for the GitHub Actions workflow to complete.
5. Reload `https://apoorvasharma7.com` to see the new version.

---

## 9. Where to change URLs later

- **GitHub repo remote**:
  - `git remote -v` shows the current origin.
  - To change it:

    ```bash
    git remote set-url origin git@github.com:NEW_GITHUB_USERNAME/NEW_REPO_NAME.git
    ```

- **Site base URL**:
  - In `config.toml`:

    ```toml
    baseURL = "https://YOUR_DOMAIN_OR_PAGES_URL/"
    ```

  - Set this to `https://apoorvasharma7.com/` once the domain is live, or keep it as the GitHub Pages URL.

This keeps all deployment-related configuration in a small, predictable set of places.

