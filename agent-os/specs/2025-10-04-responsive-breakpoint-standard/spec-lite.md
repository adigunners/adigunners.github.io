# Spec - Lite Version

**Goal**

One shared, content-first responsive system for an FPL-style site with leaderboards, winners tables,
and stat cards.

**Principles**

- Five breakpoints (+optional XS) as tokens.
- Mobile-first `min-width` queries only.
- Tables and cards adapt without positional selectors.
- CSS and JS share the same values.

**Acceptance criteria**

- Only the defined tokens appear in code.
- Zero fractional breakpoints.
- Leaderboard and winners tables: sticky header, horizontal scroll on mobile, numeric alignment via
  classes.
- Cards: 1/2/3-column grid at md/xl/2xl.
- Countdown respects `prefers-reduced-motion`.
