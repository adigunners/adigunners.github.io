# Changelog

All notable changes to this project are documented here.

## 2025-09-08 – CSS Consolidation Pivot (18 → 1)

- Consolidated 18 CSS files into a single bundle `css/styles.css` (design tokens, base, components,
  responsive).
- Kept `css/fallbacks.css` for external resource failure handling.
- Winners page continues to use `assets/css/components/table.css` for table component.
- Updated HTML to load a single stylesheet with noscript fallback; removed all other CSS links.
- Deleted deprecated CSS files: variables.css, base.css, components.css, header.css, winners.css,
  winners-specific.css, leaderboard.css, responsive.css, mobile-optimizations.css,
  advanced-mobile.css, unified-spacing.css, desktop-tablet-optimizations.css, fonts.css,
  error-handling.css, countdown-enhancements.css, mobile-consolidated.css and backup
  `winners-consolidated.css.bak`.
- Critical CSS: stabilized above‑the‑fold by aligning inline styles with final bundle; added a
  reference guide section in `styles.css`.
- FOUC: eliminated across hard refresh and throttled (3G) loads; countdown/sections render styled
  immediately; subtitles visible on first paint.
- Offline: added immediate offline banner detection and ensured countdown displays static zeros on
  offline reload.
- Test mode: added floating controls + `[TEST MODE]` subtitle on winners; QA panel revamped with
  minimize/expand toggle and session persistence; added winners QA panel to match index.
- Vertical rhythm: standardized inter‑section spacing and header‑to‑first‑section spacing across
  desktop/tablet/mobile; tightened spacing overall for a denser look.
- Demo pages: `countdown-demo.html` and `test-stat-boxes.html` updated to use `css/styles.css`.
- Documentation: updated `CSS_ARCHITECTURE_STATUS.md` and `docs/DESIGN_SYSTEM_GUIDE.md` to reflect
  the consolidated architecture.

### Developer Notes

- Service worker cache bumped to `v1.0.4`; pre‑caches `css/styles.css` and no longer pre‑caches
  removed files.
- To update inline critical CSS, mirror the reference in `css/styles.css` (Critical Inline Reference
  block) and the `<style>` blocks in HTML heads.
