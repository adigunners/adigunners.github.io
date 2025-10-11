# Fit-Gap Analysis (Responsive System)

## Executive summary

Current CSS and JS use mismatched breakpoints and fractional hacks. Tables and card grids behave
inconsistently between 700-768 and >=1400. Target is a tokenised, content-first model: one shared
breakpoint map, mobile-first queries, table-ready components, and a small set of QA widths.

## Target state

- **Tokens:** `--bp-sm: 480px`, `--bp-md: 768px`, `--bp-lg: 1024px`, `--bp-xl: 1200px`,
  `--bp-2xl: 1440px`. Optional `--bp-xs: 375px` when the layout needs it.
- **Pattern:** mobile-first `@media (min-width)` only. No fractional pixel values.
- **Ownership:** CSS owns presentation; JS reads the same values from one constants object.
- **Tables:** sticky header + horizontal scroll on mobile; numeric columns use tabular numerals; no
  `:nth-child` for alignment.
- **Optional phase 2:** container queries for cards and tables.

## When to use XS (375px)

- Button/input sizing below 480px needs adjustment.
- Typography needs a smaller step.
- Otherwise skip - base mobile styles should work down to 360px.

## Fit-gap matrix

| Area        | Target                     | Current                        | Gap    | Action                                   |
| ----------- | -------------------------- | ------------------------------ | ------ | ---------------------------------------- |
| Breakpoints | 5 (+optional XS) tokens    | Many ad-hoc values             | High   | Consolidate to tokens above              |
| Precision   | Integer px only            | `600.01, 700.01, 1024.01` etc. | High   | Replace with integers; adjust ranges     |
| CSS vs JS   | Shared map                 | Drifting values                | High   | Single source in CSS vars + JS constants |
| Query style | Mobile-first min-width     | Mixed with max-width           | Medium | Standardise on min-width                 |
| Tables      | Semantic classes           | Positional selectors           | Medium | Replace `:nth-child` with `__cell--*`    |
| XL screens  | 1200/1440 supported        | 1400 used inconsistently       | Medium | Align to `--bp-xl` and `--bp-2xl`        |
| Docs/QA     | Named widths + device list | Ad-hoc                         | Medium | Apply QA matrix below                    |

## QA matrix (resize or emulation)

- Widths: 360, 375, 480, 600, 768, 820, 1024, 1200, 1366, 1440, 1920.
- Inputs: `hover:none` and `hover:hover`, `pointer:coarse` and `pointer:fine`.
- Prefs: `prefers-reduced-motion: reduce`, `prefers-color-scheme: dark`.
- Orientation: portrait and landscape checks at <=768.

## Success criteria

- Only the 5(+1) tokens appear in CSS and JS.
- Zero fractional breakpoints.
- Tables render without horizontal jitter; headers remain sticky; first and last columns visible
  with scroll, not clipped.
- No layout shifts when webfonts swap.

## Rollout

1. **Phase 1 (Foundation, ~4h):** Introduce tokens and JS constants.
2. **Phase 2 (Consolidation, ~8h):** Replace fractional and non-token queries.
3. **Phase 3 (Tables, ~6h):** Refactor tables.
4. **Phase 4 (Grids, ~4h):** Align cards and grids.
5. **Phase 5 (QA, ~6h):** QA and release.
