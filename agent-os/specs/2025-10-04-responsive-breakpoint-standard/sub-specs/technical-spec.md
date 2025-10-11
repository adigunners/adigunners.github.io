# Technical Specification

This is the technical specification for the spec detailed in
@.agent-os/specs/2025-10-04-responsive-breakpoint-standard/spec.md

## Technical Requirements

### 1. CSS Custom Properties Implementation

**Location:** `css/styles.css` (top of :root section, approximately line 40-70)

Define standardized breakpoint custom properties:

```css
:root {
  /* Responsive Breakpoints */
  --bp-mobile-base: 375px; /* Mobile Base - Small phones (iPhone SE, etc.) */
  --bp-mobile-sm: 480px; /* Small Mobile - Standard phones */
  --bp-mobile: 768px; /* Mobile/Tablet boundary - Landscape phones, small tablets */
  --bp-tablet: 1024px; /* Tablet - iPad, Android tablets */
  --bp-desktop: 1200px; /* Desktop - Laptops, standard monitors */
  --bp-desktop-lg: 1440px; /* Large Desktop - High-res displays */

  /* Breakpoint ranges for calculations */
  --bp-mobile-max: 767px; /* Max width before tablet */
  --bp-tablet-max: 1023px; /* Max width before desktop */
  --bp-desktop-max: 1439px; /* Max width before large desktop */
}
```

### 2. Media Query Standardization

**Pattern to follow:**

```css
/* Mobile-first base styles (no media query needed) */
.component {
  /* Base mobile styles for 320px-767px */
}

/* Small mobile adjustments */
@media (min-width: 480px) {
  .component {
    /* Enhancements for 480px+ */
  }
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    /* Tablet styles for 768px-1023px */
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component {
    /* Desktop styles for 1024px+ */
  }
}

/* Large desktop */
@media (min-width: 1440px) {
  .component {
    /* Large desktop optimizations */
  }
}
```

**Range-based queries (use sparingly, only when needed):**

```css
/* Tablet only (not mobile, not desktop) */
@media (min-width: 768px) and (max-width: 1023px) {
  .component {
    /* Tablet-specific styles */
  }
}

/* Mobile only (not tablet+) */
@media (max-width: 767px) {
  .component {
    /* Mobile-only styles */
  }
}
```

### 3. JavaScript Breakpoint Constants Update

**File:** `js/state-module.js` (Lines 6-11)

Replace existing BREAKPOINTS object:

```javascript
export const BREAKPOINTS = {
  MOBILE_BASE_PX: 375, // Mobile base (matches CSS --bp-mobile-base)
  MOBILE_SM_PX: 480, // Small mobile (matches CSS --bp-mobile-sm)
  MOBILE_PX: 768, // Mobile/tablet boundary (matches CSS --bp-mobile)
  TABLET_PX: 1024, // Tablet (matches CSS --bp-tablet)
  DESKTOP_PX: 1200, // Desktop (matches CSS --bp-desktop)
  DESKTOP_LG_PX: 1440, // Large desktop (matches CSS --bp-desktop-lg)
};
```

**Update viewport detection functions (Lines 96-116):**

```javascript
export function isDesktopViewport() {
  return window.matchMedia(`(min-width: ${BREAKPOINTS.DESKTOP_PX}px)`).matches;
}

export function isTabletViewport() {
  return window.matchMedia(
    `(min-width: ${BREAKPOINTS.MOBILE_PX}px) and (max-width: ${BREAKPOINTS.DESKTOP_PX - 1}px)`
  ).matches;
}

export function isMobileViewport() {
  return window.matchMedia(`(max-width: ${BREAKPOINTS.MOBILE_PX - 1}px)`).matches;
}

// Add new utility functions
export function isLargeDesktopViewport() {
  return window.matchMedia(`(min-width: ${BREAKPOINTS.DESKTOP_LG_PX}px)`).matches;
}

export function isMobileBaseViewport() {
  return window.matchMedia(`(max-width: ${BREAKPOINTS.MOBILE_SM_PX - 1}px)`).matches;
}
```

### 4. CSS Refactoring Strategy

**Phase 1: Search and Replace Precision Values**

- Find all `768.01px` → Replace with `768px`
- Find all `1024.01px` → Replace with `1024px`
- Find all `600.01px` → Replace with `768px` (consolidate to standard mobile breakpoint)
- Find all `700.01px` → Replace with `768px`
- Find all `1400.01px` → Replace with `1440px`

**Phase 2: Consolidate Non-Standard Breakpoints**

- `360px`, `375px`, `420px` → Consolidate to `480px` (small mobile) where applicable
- `600px`, `640px`, `700px` → Consolidate to `768px` (mobile/tablet boundary)
- `820px`, `900px`, `950px` → Consolidate to `1024px` (tablet)
- `1200px`, `1201px`, `1280px` → Consolidate to `1200px` (desktop) or `1440px` (large desktop) based
  on context

**Phase 3: Audit Each Section** Review all 109 media queries in styles.css and map to standard
breakpoints:

- Lines 125-811: Typography section
- Lines 1079-1326: Header/Navigation
- Lines 1480-1604: Stats boxes
- Lines 2051-2160: Countdown component
- Lines 2260-2312: Table layouts
- Lines 3824-3914: Winners section
- Lines 4228-4887: Leaderboard
- Lines 4838-4957: Cards
- Lines 5177-5553: Rank display
- Lines 5775-5887: Navigation

### 5. Container Width Alignment

**Update container max-widths to align with breakpoints:**

```css
:root {
  --container-max-width: 1200px; /* Matches --bp-desktop */
  --container-wide-max-width: 1440px; /* Matches --bp-desktop-lg */
}
```

### 6. Orientation and Height Queries

**Preserve existing landscape/height queries but ensure they work with standard breakpoints:**

```css
/* Example: Landscape mobile with standard mobile breakpoint */
@media (max-width: 767px) and (orientation: landscape) and (max-height: 480px) {
  /* Landscape mobile adjustments */
}
```

### 7. HTML Viewport Meta Tags

**Verify and maintain existing correct implementation:**

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

No changes needed - both index.html and winners.html already use correct viewport meta tags.

### 8. Testing Requirements

**Browser Testing Matrix:**

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS 15+)
- Chrome Mobile (Android)

**Viewport Testing Points:**

- 375px (Mobile Base - iPhone SE)
- 480px (Small Mobile - standard phones)
- 768px (Mobile/Tablet boundary - iPad Mini portrait)
- 1024px (Tablet - iPad landscape)
- 1200px (Desktop - standard laptop)
- 1440px (Large Desktop - MacBook Pro 15", high-res monitors)
- 1920px (Extra Large - Full HD monitors)

**Components to Test:**

1. Header/Navigation (responsive menu)
2. Stats boxes/cards
3. Countdown component
4. Data tables (leaderboard)
5. Winners section
6. Footer
7. All interactive elements (buttons, dropdowns)

### 9. Performance Considerations

**CSS Organization:**

- Group media queries by breakpoint at the end of relevant sections (avoid scattered queries)
- Use mobile-first approach to minimize media query overrides
- Consider using CSS Grid/Flexbox to reduce need for multiple breakpoints

**JavaScript:**

- Cache `matchMedia` results where possible
- Use resize event throttling if adding viewport-dependent JavaScript logic

### 10. Accessibility Requirements

**Maintain existing accessibility features:**

- Respect `prefers-reduced-motion` media queries (lines 2621, 2803, 3632, 6129)
- Ensure touch targets remain at least 44x44px at all breakpoints
- Test keyboard navigation at all viewport sizes
- Verify screen reader compatibility across breakpoints

## Implementation Files

**Primary Files to Modify:**

1. `css/styles.css` (6,650 lines, 109 media queries to refactor)
2. `js/state-module.js` (Lines 6-116: Update BREAKPOINTS and viewport functions)
3. `js/winners-module.js` (Line 176: Verify usage of `isDesktopViewport()`)

**Files to Verify (no changes expected):**

1. `index.html` (Line 35: viewport meta tag - already correct)
2. `winners.html` (Line 15: viewport meta tag - already correct)
3. `test-enhanced-data-flow.html` (verify responsive behavior)
4. `tests/test-5-column-integration.html` (verify responsive behavior)

## Validation Criteria

**Automated Testing:**

- Run responsive design testing across all 6 standard breakpoints
- Verify no console errors related to matchMedia or viewport detection
- Check that all JavaScript viewport detection functions return expected values

**Manual Testing:**

- Open site in browser DevTools responsive mode
- Test each breakpoint by setting exact widths (375, 480, 768, 1024, 1200, 1440)
- Resize continuously from 320px to 1920px - verify smooth transitions
- Test on actual devices (iPhone, iPad, MacBook, desktop monitor)

**Code Review:**

- Confirm zero instances of `.01px` values remain
- Verify all media queries use standard breakpoint values
- Ensure CSS custom properties are used consistently
- Check JavaScript BREAKPOINTS object matches CSS values exactly

## CSS architecture (modern, framework-agnostic)

Use Cascade Layers and a low-specificity budget.

```css
@layer reset, base, components, utilities;

/* Budget */
:root {
  /* tokens */
}
@layer base {
  /* element defaults, typographic scales */
}
@layer components {
  /* BEM blocks: .table, .card, etc. */
}
@layer utilities {
  /* single-class helpers: .u-*, loaded last only if override is intentional */
}
```

**Specificity budget**

- Max selector specificity: 0,2,0.
- No IDs, no type-qualified classes, no deep chains (> + ~).
- No :nth-child for layout/alignment (zebra striping allowed).
- !important disallowed except in a documented exceptions file.

**Utilities policy**

- Utilities are single-class and property-scoped.
- Either components win (utilities loaded before components) or utilities win (loaded last).
  Document the chosen policy and keep it consistent.

## Lint rules (stylelint)

Optional but recommended.

```json
{
  "rules": {
    "selector-max-specificity": "0,2,0",
    "selector-no-id": true,
    "selector-max-compound-selectors": 2,
    "declaration-no-important": true,
    "selector-no-qualifying-type": true
  }
}
```
