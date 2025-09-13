# Utility Class Hierarchy Design

> **Status**: Active  
> **Task**: 3.2 - Design consistent utility class hierarchy with clear specificity levels  
> **Date**: 2025-09-13  
> **Project**: adigunners.github.io

## Overview

This document establishes a systematic hierarchy for utility classes that eliminates specificity
conflicts while maintaining predictable override patterns.

## Hierarchy Principles

### 1. Specificity Levels (Low to High)

```css
/* Level 1: Base Utilities (0-1-0) */
.u-text-center {
  text-align: center;
}
.u-font-bold {
  font-weight: 700;
}

/* Level 2: Enhanced Utilities (!important) (0-1-0 + important) */
.u-text-center {
  text-align: center !important;
}
.u-font-bold {
  font-weight: 700 !important;
}

/* Level 3: Responsive Utilities (!important) (0-1-1 + important) */
.u-md-text-center {
  @media (min-width: 768px) {
    text-align: center !important;
  }
}

/* Level 4: State-based Utilities (!important) (0-2-0 + important) */
.is-hidden {
  display: none !important;
}
.has-error {
  border-color: var(--error-color) !important;
}
```

### 2. Specificity Strategy

**Goal**: Utilities should always override component styles

**Solution**: All utilities use `!important` for predictable behavior

**Rationale**:

- Eliminates specificity conflicts
- Makes utility behavior predictable
- Allows components to use natural CSS cascade
- Matches industry best practices (Tailwind, Bootstrap 5+)

---

## Hierarchy Architecture

### Layer 1: Foundation Utilities (Highest Priority)

**Prefix**: `u-` (utility)  
**Specificity**: `0-1-0 + !important`  
**Purpose**: Core styling utilities that should override everything

```css
/* Text Alignment */
.u-text-left {
  text-align: left !important;
}
.u-text-center {
  text-align: center !important;
}
.u-text-right {
  text-align: right !important;
}
.u-text-justify {
  text-align: justify !important;
}

/* Font Weight */
.u-font-light {
  font-weight: 300 !important;
}
.u-font-normal {
  font-weight: 400 !important;
}
.u-font-medium {
  font-weight: 500 !important;
}
.u-font-semibold {
  font-weight: 600 !important;
}
.u-font-bold {
  font-weight: 700 !important;
}
.u-font-black {
  font-weight: 900 !important;
}

/* Display */
.u-block {
  display: block !important;
}
.u-inline {
  display: inline !important;
}
.u-inline-block {
  display: inline-block !important;
}
.u-flex {
  display: flex !important;
}
.u-grid {
  display: grid !important;
}
.u-hidden {
  display: none !important;
}

/* Colors */
.u-text-primary {
  color: var(--primary-color) !important;
}
.u-text-secondary {
  color: var(--secondary-color) !important;
}
.u-text-muted {
  color: var(--text-muted) !important;
}
.u-text-white {
  color: #fff !important;
}

.u-bg-primary {
  background-color: var(--primary-color) !important;
}
.u-bg-white {
  background-color: #fff !important;
}
.u-bg-transparent {
  background-color: transparent !important;
}
```

**Usage Pattern**:

```html
<div class="component__element u-text-center u-font-bold">
  <!-- Utility always wins over component -->
</div>
```

### Layer 2: Layout Utilities

**Prefix**: `l-` (layout)  
**Specificity**: `0-1-0` (no !important for flexibility)  
**Purpose**: Structural layout patterns

```css
/* Container */
.l-container {
  max-width: var(--container-max-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--spacing-md);
  padding-right: var(--spacing-md);
}

/* Grid Layouts */
.l-grid {
  display: grid;
}

.l-grid--2-col {
  grid-template-columns: 1fr 1fr;
}

.l-grid--3-col {
  grid-template-columns: 1fr 1fr 1fr;
}

/* Flex Layouts */
.l-flex {
  display: flex;
}

.l-flex--center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.l-flex--between {
  display: flex;
  justify-content: space-between;
}
```

**Usage Pattern**:

```html
<div class="l-container">
  <div class="l-grid--2-col u-gap-md">
    <!-- Layout + utility combination -->
  </div>
</div>
```

### Layer 3: Spacing Utilities

**Prefix**: `u-` (follows foundation pattern)  
**Specificity**: `0-1-0 + !important`  
**Purpose**: Margin and padding utilities

```css
/* All Sides Margin */
.u-margin-0 {
  margin: 0 !important;
}
.u-margin-xs {
  margin: var(--spacing-xs) !important;
} /* 4px */
.u-margin-sm {
  margin: var(--spacing-sm) !important;
} /* 8px */
.u-margin-md {
  margin: var(--spacing-md) !important;
} /* 16px */
.u-margin-lg {
  margin: var(--spacing-lg) !important;
} /* 24px */
.u-margin-xl {
  margin: var(--spacing-xl) !important;
} /* 32px */

/* Directional Margin */
.u-margin-top-0 {
  margin-top: 0 !important;
}
.u-margin-top-sm {
  margin-top: var(--spacing-sm) !important;
}
.u-margin-right-md {
  margin-right: var(--spacing-md) !important;
}
.u-margin-bottom-lg {
  margin-bottom: var(--spacing-lg) !important;
}
.u-margin-left-xl {
  margin-left: var(--spacing-xl) !important;
}

/* Axis Margin */
.u-margin-x-auto {
  margin-left: auto !important;
  margin-right: auto !important;
}
.u-margin-y-0 {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

/* All Sides Padding */
.u-padding-0 {
  padding: 0 !important;
}
.u-padding-xs {
  padding: var(--spacing-xs) !important;
}
.u-padding-sm {
  padding: var(--spacing-sm) !important;
}
.u-padding-md {
  padding: var(--spacing-md) !important;
}
.u-padding-lg {
  padding: var(--spacing-lg) !important;
}

/* Directional Padding */
.u-padding-top-sm {
  padding-top: var(--spacing-sm) !important;
}
.u-padding-right-md {
  padding-right: var(--spacing-md) !important;
}
.u-padding-bottom-lg {
  padding-bottom: var(--spacing-lg) !important;
}
.u-padding-left-xl {
  padding-left: var(--spacing-xl) !important;
}
```

### Layer 4: Responsive Utilities

**Prefix**: `u-{breakpoint}-` (responsive utility)  
**Specificity**: `0-1-1 + !important` (media query adds specificity)  
**Purpose**: Responsive behavior utilities

```css
/* Small screens and up (640px+) */
@media (min-width: 640px) {
  .u-sm-text-left {
    text-align: left !important;
  }
  .u-sm-text-center {
    text-align: center !important;
  }
  .u-sm-text-right {
    text-align: right !important;
  }

  .u-sm-block {
    display: block !important;
  }
  .u-sm-flex {
    display: flex !important;
  }
  .u-sm-hidden {
    display: none !important;
  }
}

/* Medium screens and up (768px+) */
@media (min-width: 768px) {
  .u-md-text-left {
    text-align: left !important;
  }
  .u-md-text-center {
    text-align: center !important;
  }
  .u-md-text-right {
    text-align: right !important;
  }

  .u-md-flex {
    display: flex !important;
  }
  .u-md-grid {
    display: grid !important;
  }
  .u-md-hidden {
    display: none !important;
  }
}

/* Large screens and up (1024px+) */
@media (min-width: 1024px) {
  .u-lg-text-left {
    text-align: left !important;
  }
  .u-lg-text-center {
    text-align: center !important;
  }
  .u-lg-text-right {
    text-align: right !important;
  }

  .u-lg-flex {
    display: flex !important;
  }
  .u-lg-grid {
    display: grid !important;
  }
  .u-lg-block {
    display: block !important;
  }
}

/* Extra large screens and up (1280px+) */
@media (min-width: 1280px) {
  .u-xl-flex {
    display: flex !important;
  }
  .u-xl-grid {
    display: grid !important;
  }
  .u-xl-text-center {
    text-align: center !important;
  }
}
```

**Usage Pattern**:

```html
<div class="u-text-center u-md-text-left u-lg-text-right">
  <!-- Mobile: center, Tablet: left, Desktop: right -->
</div>
```

### Layer 5: State Utilities (Highest Specificity)

**Prefix**: `is-`, `has-` (state indicator)  
**Specificity**: `0-1-0 + !important` or `0-2-0 + !important`  
**Purpose**: JavaScript-managed states

```css
/* Simple States */
.is-active {
  /* Applied via JavaScript */
}
.is-disabled {
  /* Applied via JavaScript */
}
.is-loading {
  /* Applied via JavaScript */
}
.is-hidden {
  display: none !important;
}
.is-visible {
  display: block !important;
}

/* Conditional States */
.has-error {
  border-color: var(--error-color) !important;
}
.has-success {
  border-color: var(--success-color) !important;
}
.has-dropdown::after {
  content: '▼';
}

/* Contextual States (Higher specificity when needed) */
.component.is-active {
  /* 0-2-0 + !important for complex interactions */
}

.component.has-error {
  /* 0-2-0 + !important for component-specific error states */
}
```

---

## Project-Specific Utilities

### Leaderboard Utilities

**Purpose**: Domain-specific utilities for leaderboard features

```css
/* Rank Colors */
.u-rank-gold {
  color: var(--gold-1) !important;
}
.u-rank-silver {
  color: var(--silver-1) !important;
}
.u-rank-bronze {
  color: var(--bronze-1) !important;
}

/* Movement Indicators */
.u-movement-up {
  color: var(--movement-up-color) !important;
}
.u-movement-down {
  color: var(--movement-down-color) !important;
}
.u-movement-same {
  color: var(--movement-same-color) !important;
}
.u-movement-new {
  color: var(--movement-new-color) !important;
}

/* Typography */
.u-tabular-nums {
  font-variant-numeric: tabular-nums !important;
}

/* Table-specific */
.u-table-fixed {
  table-layout: fixed !important;
}
.u-border-collapse {
  border-collapse: collapse !important;
}
```

---

## Implementation Strategy

### Phase 1: Core Foundation (Week 1)

**Priority Order**:

1. **Text Alignment** (fixes critical conflicts)
2. **Font Weight** (eliminates 90+ duplicates)
3. **Display** (fundamental layout control)
4. **Colors** (brand consistency)

```css
/* Add to css/styles.css - UTILITY SECTION */

/* ==========================================================================
   UTILITY CLASSES - Foundation Layer
   ========================================================================== */

/* Text Alignment */
.u-text-left {
  text-align: left !important;
}
.u-text-center {
  text-align: center !important;
}
.u-text-right {
  text-align: right !important;
}

/* Font Weight */
.u-font-normal {
  font-weight: 400 !important;
}
.u-font-medium {
  font-weight: 500 !important;
}
.u-font-semibold {
  font-weight: 600 !important;
}
.u-font-bold {
  font-weight: 700 !important;
}

/* Display */
.u-block {
  display: block !important;
}
.u-flex {
  display: flex !important;
}
.u-hidden {
  display: none !important;
}

/* Colors */
.u-text-primary {
  color: var(--primary-color) !important;
}
.u-text-muted {
  color: var(--text-muted) !important;
}
```

### Phase 2: Spacing System (Week 2)

Add comprehensive spacing utilities using CSS variables:

```css
/* ==========================================================================
   UTILITY CLASSES - Spacing Layer  
   ========================================================================== */

/* Margin Utilities */
.u-margin-0 {
  margin: 0 !important;
}
.u-margin-sm {
  margin: var(--spacing-sm) !important;
}
.u-margin-md {
  margin: var(--spacing-md) !important;
}
.u-margin-lg {
  margin: var(--spacing-lg) !important;
}

/* Padding Utilities */
.u-padding-0 {
  padding: 0 !important;
}
.u-padding-sm {
  padding: var(--spacing-sm) !important;
}
.u-padding-md {
  padding: var(--spacing-md) !important;
}
.u-padding-lg {
  padding: var(--spacing-lg) !important;
}
```

### Phase 3: Responsive Layer (Week 3)

Add responsive variants for critical utilities:

```css
/* ==========================================================================
   UTILITY CLASSES - Responsive Layer
   ========================================================================== */

@media (min-width: 768px) {
  .u-md-text-left {
    text-align: left !important;
  }
  .u-md-text-center {
    text-align: center !important;
  }
  .u-md-text-right {
    text-align: right !important;
  }
  .u-md-flex {
    display: flex !important;
  }
  .u-md-block {
    display: block !important;
  }
}

@media (min-width: 1024px) {
  .u-lg-text-left {
    text-align: left !important;
  }
  .u-lg-text-center {
    text-align: center !important;
  }
  .u-lg-text-right {
    text-align: right !important;
  }
  .u-lg-flex {
    display: flex !important;
  }
  .u-lg-grid {
    display: grid !important;
  }
}
```

### Phase 4: State & Project-Specific (Week 4)

Add state management and domain-specific utilities:

```css
/* ==========================================================================
   UTILITY CLASSES - State & Project Layer
   ========================================================================== */

/* State Classes */
.is-hidden {
  display: none !important;
}
.is-visible {
  display: block !important;
}
.has-error {
  border-color: var(--error-color) !important;
}

/* Leaderboard-Specific */
.u-rank-gold {
  color: var(--gold-1) !important;
}
.u-movement-up {
  color: var(--movement-up-color) !important;
}
.u-tabular-nums {
  font-variant-numeric: tabular-nums !important;
}
```

---

## CSS File Organization

### Recommended Structure

```css
/* css/styles.css */

/* 1. CSS Variables */
:root {
  --primary-color: #37003c;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}

/* 2. Reset/Base Styles */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* 3. Layout Utilities (No !important) */
.l-container {
  /* ... */
}
.l-grid {
  /* ... */
}

/* 4. Foundation Utilities (!important) */
.u-text-center {
  text-align: center !important;
}
.u-font-bold {
  font-weight: 700 !important;
}

/* 5. Spacing Utilities (!important) */
.u-margin-md {
  margin: var(--spacing-md) !important;
}
.u-padding-sm {
  padding: var(--spacing-sm) !important;
}

/* 6. Component Styles (Natural cascade) */
.leaderboard {
  /* ... */
}
.leaderboard__table {
  /* ... */
}
.button {
  /* ... */
}

/* 7. State Classes (!important) */
.is-active {
  /* ... */
}
.has-error {
  /* ... */
}

/* 8. Responsive Utilities (!important + media query) */
@media (min-width: 768px) {
  .u-md-text-left {
    text-align: left !important;
  }
}
```

## Usage Guidelines

### DO ✅

```html
<!-- Combine utilities with components -->
<div class="leaderboard__cell u-text-right u-font-semibold">179</div>

<!-- Use responsive utilities -->
<div class="u-text-center u-md-text-left u-lg-text-right">Responsive text</div>

<!-- Layer utilities predictably -->
<button class="button button--primary u-font-bold u-margin-md">Click me</button>
```

### DON'T ❌

```html
<!-- Don't create component-specific utilities -->
<div class="u-leaderboard-cell-text">Bad</div>

<!-- Don't mix high-specificity patterns -->
<div class="component">
  <style>
    .component .u-text-center {
      text-align: left;
    } /* Defeats purpose */
  </style>
</div>

<!-- Don't use conflicting utilities -->
<div class="u-text-center u-text-left">Conflicting</div>
```

---

## Migration Benefits

### Eliminated Problems

- ✅ **No more specificity conflicts** - utilities always win
- ✅ **Predictable behavior** - `!important` makes utilities reliable
- ✅ **Consistent spacing** - CSS variables ensure uniformity
- ✅ **Responsive design** - built-in breakpoint system
- ✅ **Maintainable code** - single source of truth

### Performance Gains

- ✅ **Smaller CSS** - eliminates 250+ duplicate declarations
- ✅ **Better caching** - utilities rarely change
- ✅ **Faster development** - no more CSS authoring for common patterns

**Next Action**: Proceed to Task 3.3 - Consolidate duplicate utility classes.
