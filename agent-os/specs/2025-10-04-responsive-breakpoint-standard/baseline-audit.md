# Baseline Audit - Current Breakpoint and CSS State

> Generated: 2025-10-04 Branch: feature/responsive-breakpoint-standard

## Executive Summary

**Current State:**

- 109 total `@media` queries found in css/styles.css
- 20 ID selectors in use
- 182 `!important` declarations
- 129 `:nth-child` selectors

## Breakpoint Analysis

### Current Breakpoints Found

#### Fractional Breakpoints (to be removed):

- `768.01px` - Used 22 times (should be `768px`)
- `1024.01px` - Used 13 times (should be `1024px`)
- `1400.01px` - Used 4 times (should be `1440px`)
- `700.01px` - Used 2 times (should be `768px`)
- `600.01px` - Used 2 times (should be `768px`)

#### Non-Standard Breakpoints (to be consolidated):

- `360px` - Used 1 time (consolidate to `480px`)
- `375px` - Used 1 time (consolidate to `480px`)
- `420px` - Used 0 times
- `480px` - Used 12 times (KEEP - standard SM)
- `600px` - Used 18 times (consolidate to `768px`)
- `640px` - Used 2 times (consolidate to `768px`)
- `700px` - Used 6 times (consolidate to `768px`)
- `768px` - Used 27 times (KEEP - standard MD)
- `820px` - Used 1 time (consolidate to `1024px`)
- `900px` - Used 0 times
- `950px` - Used 1 time (consolidate to `1024px`)
- `1024px` - Used 28 times (KEEP - standard LG)
- `1200px` - Used 9 times (KEEP - standard XL)
- `1201px` - Used 3 times (should be `1200px`)
- `1280px` - Used 1 time (consolidate to `1200px`)
- `1366px` - Used 0 times
- `1400px` - Used 2 times (consolidate to `1440px`)
- `1440px` - Used 3 times (KEEP - standard 2XL)
- `1920px` - Used 0 times

#### Special Media Queries (to be preserved):

- `prefers-color-scheme: dark` - Used 4 times
- `prefers-reduced-motion: reduce` - Used 4 times
- `orientation: landscape` - Used 2 times
- `max-height` queries - Used 5 times
- `print` - Used 1 time

### Pattern Issues

#### Max-width vs Min-width:

- Mix of `max-width` and `min-width` queries (not fully mobile-first)
- Range queries using `min-width` AND `max-width` (e.g., `768.01px to 1024px`)

#### Target Breakpoint Tokens:

```css
--bp-xs: 375px /* Optional, mobile-small */ --bp-sm: 480px /* Mobile */ --bp-md: 768px /* Tablet */
  --bp-lg: 1024px /* Desktop */ --bp-xl: 1200px /* Large Desktop */ --bp-2xl: 1440px
  /* Extra Large Desktop */;
```

## CSS Specificity Violations

### ID Selectors (20 found):

These create high specificity and should be replaced with classes:

- Used for unique page elements
- Need migration to BEM or semantic classes

### !important Declarations (182 found):

- Excessive use indicates specificity battles
- Most should be resolved through proper cascade ordering
- Some utility classes may legitimately need it

### :nth-child Selectors for Layout (129 found):

- Used heavily for table column alignment
- Should be replaced with semantic BEM classes like:
  - `.table__cell--rank`
  - `.table__cell--team`
  - `.table__cell--num`
  - `.table__cell--manager`

## Recommendations

### Phase 1: Foundation

1. ✅ Add CSS Cascade Layers
2. ✅ Add breakpoint tokens as CSS custom properties
3. ✅ Update JS constants to match

### Phase 2: Consolidation

1. Replace all fractional `.01px` values
2. Convert to mobile-first `min-width` pattern
3. Consolidate non-standard breakpoints to nearest standard token

### Phase 3: Specificity Cleanup

1. Replace ID selectors with classes
2. Audit and remove unnecessary `!important`
3. Replace `:nth-child` with semantic BEM classes for tables

### Phase 4: Testing

1. Visual regression testing at all breakpoint boundaries
2. Test on real devices at key widths
3. Verify smooth transitions between breakpoints
