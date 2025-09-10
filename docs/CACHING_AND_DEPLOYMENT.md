# 🚀 Caching & Deployment Strategy

This document explains how we ensure returning users always see the latest site with fast loads and reliable offline behavior.

## Overview

- Single source of version truth: `package.json` → `version.js`
- Fingerprinted assets: content-hashed CSS/JS outputs in `docs/`
- Service Worker strategy: network‑first for HTML; cache‑first for static assets
- Update prompt: banner invites users to refresh when a new version is ready
- Headers: Netlify `_headers` for optimal cache control (GitHub Pages ignores headers but hashed assets still work)

## Versioning

- The script `scripts/set-version.js` writes `version.js` with `SITE_VERSION` from `package.json`.
- `service-worker.js` imports `version.js` and names its cache `fpl-iim-mumbai-v${SITE_VERSION}`.
- Pages load `/version.js` so UI and diagnostics can read the current version.

## Build & Fingerprinting

Command: `npm run build`

What it does:
- Writes `version.js` from `package.json`.
- Copies the site to `public/` (excluding dev folders and docs/).
- Appends content hashes to CSS/JS filenames (e.g., `styles.abc12345.css`).
- Rewrites `index.html` and `winners.html` to reference the hashed assets.
- Generates `/precache-manifest.json` used by the Service Worker during install.

Why this helps:
- Browsers can cache hashed assets for a year (`immutable`), yet fetch fresh copies whenever content changes.
- HTML is short‑cached, so a normal refresh picks up new versions.

## Service Worker

- Navigations (HTML) use network‑first with an offline fallback page.
- Static assets use cache‑first with background revalidation.
- On install, the SW precaches default URLs plus any files in `/precache-manifest.json` (hashed build outputs).
- On activate, it removes old cache versions automatically.

## Update Prompt

- `js/sw-update.js` registers the SW and listens for updates.
- When a new SW is installed and waiting, a small banner appears: “New version available” with a Refresh button.
- Clicking Refresh sends `SKIP_WAITING` to the SW and reloads once the new version controls the page.

## Headers (Netlify)

The `_headers` file configures optimal caching on Netlify:

- HTML + `service-worker.js`: `no-cache, no-store, must-revalidate`
- Hashed assets (`/css`, `/js`, `/assets`): `public, max-age=31536000, immutable`

GitHub Pages ignores custom headers, but the hashing still ensures fresh assets.

## GitHub Pages

- Set Pages source to “Deploy from a branch” → your default branch, folder `/public`.
- After `npm run build`, commit and push `public/` to publish.

## Local Development

- Quick serve: `npm run dev` (or `python3 -m http.server`).
- Apply version only: `npm run version:apply` (updates `version.js` for SW cache name bump).

## Release Checklist (TL;DR)

1. Bump `package.json` version.
2. Run `npm run build`.
3. Commit changes (including `docs/`) and push.
4. Verify the site updates; ensure the update banner appears on old tabs.

## Troubleshooting

- Seeing stale pages: do a hard reload, or wait for the banner and click Refresh.
- SW not updating: confirm `version.js` changed and `CACHE_NAME` reflects the new version.
- Hashed assets missing: ensure `npm run build` ran and `docs/` contains hashed files.
