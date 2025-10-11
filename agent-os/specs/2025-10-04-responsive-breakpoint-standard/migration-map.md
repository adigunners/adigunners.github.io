# Breakpoint Migration Map

> Generated: 2025-10-04 Branch: feature/responsive-breakpoint-standard

## Summary

This document maps all existing breakpoints to standardized tokens.

### Standard Breakpoint Tokens

```
--bp-sm: 480px   (Mobile landscape)
--bp-md: 768px   (Tablet portrait)
--bp-lg: 1024px  (Tablet landscape / Small desktop)
--bp-xl: 1200px  (Desktop)
--bp-2xl: 1440px (Large desktop)
```

## Fractional Breakpoints to Replace

### Pattern 1: `768.01px` → `768px`

**Count: 22 occurrences**

- Lines: 823, 897, 1073, 1918, 2272, 2277, 2308, 3726, 3872, 4472, 4540, 4630, 4686, 4892, 4960,
  5210, 5424, 5600, 5833, 6097

**Migration:**

- `min-width: 768.01px` → `min-width: 768px` (MD)
- `(min-width: 768.01px) and (max-width: 1024px)` → `(min-width: 768px) and (max-width: 1023px)`

### Pattern 2: `1024.01px` → `1024px`

**Count: 13 occurrences**

- Lines: 1550, 2283, 2565, 4321, 4425, 4585, 4885, 4951, 5221, 5854, 6110

**Migration:**

- `min-width: 1024.01px` → `min-width: 1024px` (LG)
- `(min-width: 1024.01px) and (max-width: 1400px)` → `(min-width: 1024px) and (max-width: 1439px)`

### Pattern 3: `1400.01px` → `1440px`

**Count: 4 occurrences**

- Lines: 1291, 4378, 4878

**Migration:**

- `min-width: 1400.01px` → `min-width: 1440px` (2XL)

### Pattern 4: `700.01px` → `768px`

**Count: 2 occurrences**

- Lines: 1532

**Migration:**

- `min-width: 700.01px` → `min-width: 768px` (MD)

### Pattern 5: `600.01px` → `768px`

**Count: 2 occurrences**

- Lines: 4340

**Migration:**

- `min-width: 600.01px` → `min-width: 768px` (MD)

## Non-Standard Breakpoints to Consolidate

### `360px` → `480px` (SM)

- Used for very small mobile screens
- Consolidate to SM (480px)

### `375px` → `480px` (SM)

- Used for iPhone portrait
- Consolidate to SM (480px)

### `480px` → KEEP (SM)

- Already standard

### `600px` → `768px` (MD)

- Close to tablet, consolidate to MD

### `640px` → `768px` (MD)

- Close to tablet, consolidate to MD

### `700px` → `768px` (MD)

- Close to tablet, consolidate to MD

### `768px` → KEEP (MD)

- Already standard

### `820px` → `1024px` (LG)

- Between tablet and desktop, round up to LG

### `950px` → `1024px` (LG)

- Close to desktop, consolidate to LG

### `1024px` → KEEP (LG)

- Already standard

### `1200px` → KEEP (XL)

- Already standard

### `1201px` → `1200px` (XL)

- Off-by-one, use exact XL

### `1280px` → `1200px` (XL)

- Close to XL, consolidate to XL

### `1400px` → `1440px` (2XL)

- Close to 2XL, consolidate to 2XL

### `1440px` → KEEP (2XL)

- Already standard

## Max-Width to Min-Width Conversions

All `max-width` queries need mobile-first inversion:

### Examples:

- `max-width: 767px` → `min-width: 768px` with inverted styles
- `max-width: 768px` → Logic at `min-width: 769px` OR base mobile styles
- `max-width: 480px` → Base mobile styles (no media query)
- `max-width: 700px` → `min-width: 768px` with inverted logic
- `max-width: 600px` → `min-width: 768px` with inverted logic

## Special Cases to Preserve

### Do NOT change:

- `prefers-color-scheme: dark`
- `prefers-reduced-motion: reduce`
- `orientation: landscape`
- `max-height` queries
- `print` media queries

## Implementation Strategy

### Step 1: Replace Fractional Values

1. `768.01px` → `768px`
2. `1024.01px` → `1024px`
3. `1400.01px` → `1440px`
4. `700.01px` → `768px`
5. `600.01px` → `768px`

### Step 2: Consolidate Non-Standard

1. `360px/375px` → `480px`
2. `600px/640px/700px` → `768px`
3. `820px/950px` → `1024px`
4. `1201px/1280px` → `1200px`
5. `1400px` → `1440px`

### Step 3: Convert to Mobile-First

1. Identify all `max-width` rules
2. Move base mobile styles out of media queries
3. Convert remaining `max-width` to `min-width` with inverted logic
4. Ensure proper cascade ordering

### Step 4: Visual Regression Testing

1. Take screenshots at all standard breakpoints
2. Compare with baseline
3. Fix any layout regressions
