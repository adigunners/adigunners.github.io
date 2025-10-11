# Product Spec - Responsive System for FPL-style Site

## Overview

Standardise responsive behaviour using a tokenised breakpoint map, mobile-first queries, and
table-specific patterns suited to fantasy-sports data.

## User stories

1. **As a player**, I can read the leaderboard and winners tables on any device. Long team names
   truncate or wrap without breaking alignment. Numeric columns line up.
2. **As an admin**, I see the same breakpoint behaviour across pages. No layout changes at arbitrary
   widths like 701px.
3. **As a developer**, I add new components without inventing new breakpoints or using `:nth-child`.

## Scope

- Breakpoint tokens: `xs?`, `sm`, `md`, `lg`, `xl`, `2xl`.
- Refactor CSS to mobile-first min-width queries.
- Replace positional selectors in tables with BEM element modifiers.
- Expose JS helpers that read the same breakpoints.
- Document QA sizes, input modes, and user-pref media features.

## Non-goals

- Visual redesign beyond responsive fixes.
- Framework migration.

## Detailed requirements

### A. Breakpoints

- CSS vars and JS constants as listed in the technical spec.
- No fractional values. Ranges:  
  Mobile `< 768`, Tablet `768–1023`, Desktop `1024–1199`, Large `1200–1439`, 2XL `>= 1440`. XS
  `<= 375` only when needed.

### B. Tables

- Classes: `.table`, `.table__row`, `.table__cell`, modifiers `.table__cell--num`,
  `.table__cell--rank`, `.table__cell--team`.
- Sticky header within a scrolling wrapper on mobile.
- No `:nth-child` for alignment or width.
- `font-variant-numeric: tabular-nums;` for numeric columns.
- Ensure long names wrap or truncate with ellipsis; keep numeric columns right-aligned.

### C. Cards and grids

- Grid changes at md, xl, 2xl only.
- Clamp typography; max line length ~70-80ch on text content pages.

### D. Accessibility and preferences

- `prefers-reduced-motion` respected by countdown and badges.
- `prefers-color-scheme` tokens present. Maintain contrast >= WCAG AA.
- Support `hover:none` and `pointer:coarse` for touch devices.

### E. Testing

- Run the QA matrix widths and modes from the Fit-Gap doc.
- Keyboard and screen reader checks at mobile and desktop.
- Verify sticky headers and scroll behaviour on iOS Safari and Android Chrome.

## Success metrics

- Reduction to 5(+1) breakpoints across CSS and JS.
- Zero `*.01px` media queries.
- No overlapping or redundant queries in the build.
- Passes QA matrix, including `hover:none` and dark mode.

## Rollout

1. **Phase 1 (Foundation, ~4h):** Introduce tokens and JS constants.
2. **Phase 2 (Consolidation, ~8h):** Replace fractional and non-token queries.
3. **Phase 3 (Tables, ~6h):** Refactor tables.
4. **Phase 4 (Grids, ~4h):** Align cards and grids.
5. **Phase 5 (QA, ~6h):** QA and release.
