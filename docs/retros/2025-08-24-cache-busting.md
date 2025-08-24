# Retro: Deploy-time Cache Busting for GitHub Pages

## Summary

Auto-append commit SHA to local CSS/JS URLs at deploy time so users always fetch fresh assets without a manual hard refresh.

## Problem

GitHub Pages and browsers cached CSS/JS aggressively, causing users to see stale assets after merges. Asking for a hard refresh isn’t acceptable for most users.

## Solution

- Added a GitHub Action that stamps local asset URLs with `?v=<commit-sha>` during deployment, then deploys via Pages.
- Reverted hard-coded `?v=` parameters in source HTML; stamping now happens only in the deployed artifact.

## Scope

- `.github/workflows/deploy.yml`
- `.github/scripts/stamp-version.js`
- `index.html`, `winners.html` (remove temporary `?v=`)

## ✅ Acceptance Criteria

- [x] Stamped CSS/JS URLs visible in deployed HTML.
- [x] External URLs remain untouched.
- [x] Users see fresh styles/scripts immediately after deploy.

## Test Evidence

- Actions “Deploy with cache-busting” run green on `main`.
- View Source shows local CSS/JS with `?v=<sha>`.
- DevTools Network (Disable cache) → reload shows fresh 200 responses for assets.

## Risks / Rollback

- If workflow fails, Pages won’t update; site serves the last successful deploy.
- Rollback by reverting the PR and switching Pages back to “Deploy from branch”.

## Links

- PR: <add link>
- Deploy run: <add link>

## Follow-ups

- Consider Release Drafter for automated release notes.
- Evaluate content-hashed filenames via Vite/Webpack in the future.
