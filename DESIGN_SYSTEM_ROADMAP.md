# Design System & Modularization Roadmap

This document records the recommended options, trade-offs, and an implementation roadmap for making the site modular and consistent across pages (headers, countdown, styles, components, and scripts).

## Goal

Make pages share a single design philosophy and reusable components so new pages can be created quickly and consistently.

---

## Options (summary)

A) Extract header into a reusable include/partial

- What: Move header HTML into a single include and reference it from pages (via build templating or manual copy/paste).
- Pros: Single canonical header markup; simple content updates.
- Cons: Without a templating build requires manual sync or copy/paste. With a build (Eleventy/Jekyll) introduces a build step.
- Effort: 30–60 min (manual), 2–4 hours (with templating scaffold).

B) Extract shared CSS (recommended first step)

- What: Create `assets/css/site.css` with design tokens (colors, spacing, typography) and core component styles (header, countdown, cards, table, badges). Update pages to reference it.
- Pros: Immediate visual parity, single place for stylistic changes, low risk.
- Cons: Requires careful consolidation but minimal behavioral change.
- Effort: 30–90 min.

C) Extract shared JS (countdown + data loaders)

- What: Move countdown, caching, and data-fetch utilities to `assets/js/site.js` (ES module) and import on pages.
- Pros: Ensures consistent behaviour across pages; fixes/updates in one place.
- Cons: Refactor of inline scripts and DOM wiring.
- Effort: 1–2 hours.

D) Adopt a tiny static-site build (Eleventy) + components

- What: Add Eleventy (or Jekyll), move common HTML into `_includes/`, add build scripts and optional CI for deployment.
- Pros: Best long-term DX (partials, collections, pattern library). Easy scaling.
- Cons: Larger change; requires build/CI familiarity.
- Effort: 1–2 days for minimal migration.

---

## Recommendation (practical path)

1. Implement B (shared CSS) first — biggest visual consistency for least effort.
2. Implement C (shared JS) next — ensures logic parity (countdown, data loading).
3. Implement A/D (templating + includes) when you want to stop copy/paste and scale the site.

This sequence minimizes risk while delivering clear value at each step.

---

## Minimal Next Steps (actionable)

- Create `assets/css/site.css` and move shared CSS variables + header/countdown styles from `index.html` into it. Update both pages to include the stylesheet.
- Create `assets/js/site.js` and extract countdown and helper functions; export `initCountdown()` and `initSharedUI()`.
- (Optional) Scaffold Eleventy and move `header.html`/`footer.html` into `_includes/` for templating.

---

## Notes / Edge cases

- Time handling: keep a single `now()` implementation; preserve `clockOffset` debug param.
- Long player names: keep dynamic width logic or use truncation with accessible tooltip.
- Test vs Live: centralize `data`/`test` mode logic so links and behaviour are consistent.

---

## When you return

- If you want me to implement the first action now, say: `Do B (create shared CSS)` and I'll extract CSS into `assets/css/site.css` and update pages.
- Or tell me which option you prefer and I'll implement it and verify locally.

_File created: DESIGN_SYSTEM_ROADMAP.md_
