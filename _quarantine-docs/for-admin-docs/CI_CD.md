# CI/CD and Deploy-time Cache Busting

## Overview

The site is a static HTML/CSS/JS project deployed to GitHub Pages. To prevent users from seeing stale assets, we apply deploy-time cache-busting: the Pages workflow appends a `?v=<commit-sha>` query parameter to local CSS/JS references in HTML at deploy time. Source files remain clean; stamping happens only in the deployed artifact.

## Workflow

- File: `.github/workflows/deploy.yml`
- Trigger: push to `main`
- Steps:
  - Checkout
  - Setup Node 20
  - Run `.github/scripts/stamp-version.js "$GITHUB_SHA"`
  - Upload artifact and deploy with `actions/deploy-pages`

Required permissions: `pages: write`, `id-token: write`, `contents: read`.

## Stamping Script

- File: `.github/scripts/stamp-version.js`
- Scans all `.html` files and rewrites local `href=`/`src=` to append `?v=<sha>`.
- Skips external URLs (e.g., `https://`, `//`), `mailto:`, `tel:`, `data:`, and hash-only anchors.
- If a `v=` param already exists, it is replaced.

## Local Development

- Source HTML stays clean; no build step required locally.
- Use VS Code Live Server (or similar) for local testing.

## Testing Deploys

1. Merge to `main` and wait for “Deploy with cache-busting” to complete.
2. View Source of the deployed pages: local CSS/JS should include `?v=<sha>`.
3. In DevTools → Network (Disable cache) → reload; assets should return fresh 200 responses.

## Rollback

- Revert the deploy workflow PR to stop stamping.
- Switch Pages deployment source back to “Deploy from branch” if necessary.

## Governance

- PR-first policy and branch naming: `fix/...`, `feat/...`, `chore/...`, `ci/...`, `docs/...`.
- `CODEOWNERS` enforces review requests for key areas.
- Project board automation adds new issues/PRs automatically.
- Recommend branch protection: require PR, at least one review, and passing checks (format and Pages deploy).
