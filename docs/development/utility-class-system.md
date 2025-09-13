# Utility Class System

> **Status**: Active  
> **Last Updated**: 2025-09-13  
> **Project**: adigunners.github.io

## Overview

This document defines the utility class system for the adigunners.github.io project, establishing
consistent naming patterns and resolving conflicts with component styles.

## Utility Naming Convention

### Pattern Structure

```
.{prefix}-{property}-{value}
.{prefix}-{breakpoint}-{property}-{value}
```

### Prefix System

| Prefix | Purpose               | Example          |
| ------ | --------------------- | ---------------- |
| `u-`   | General utilities     | `.u-text-center` |
| `l-`   | Layout utilities      | `.l-container`   |
| `is-`  | State utilities       | `.is-active`     |
| `has-` | Conditional utilities | `.has-dropdown`  |

## Text Utilities

### Text Alignment

```css
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
```

### Font Weight

```css
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
```

### Font Size

```css
.u-text-xs {
  font-size: 0.75rem !important;
} /* 12px */
.u-text-sm {
  font-size: 0.875rem !important;
} /* 14px */
.u-text-base {
  font-size: 1rem !important;
} /* 16px */
.u-text-lg {
  font-size: 1.125rem !important;
} /* 18px */
.u-text-xl {
  font-size: 1.25rem !important;
} /* 20px */
.u-text-2xl {
  font-size: 1.5rem !important;
} /* 24px */
```

## Spacing Utilities

### Margin

```css
/* All sides */
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

/* Individual sides */
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

/* Axes */
.u-margin-x-auto {
  margin-left: auto !important;
  margin-right: auto !important;
}
.u-margin-y-0 {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
```

### Padding

```css
/* All sides */
.u-padding-0 {
  padding: 0 !important;
}
.u-padding-xs {
  padding: var(--spacing-xs) !important;
} /* 4px */
.u-padding-sm {
  padding: var(--spacing-sm) !important;
} /* 8px */
.u-padding-md {
  padding: var(--spacing-md) !important;
} /* 16px */
.u-padding-lg {
  padding: var(--spacing-lg) !important;
} /* 24px */

/* Individual sides */
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

## Layout Utilities

### Container

```css
.l-container {
  max-width: var(--container-max-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--spacing-md);
  padding-right: var(--spacing-md);
}
```

### Display

```css
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
.u-inline-flex {
  display: inline-flex !important;
}
.u-grid {
  display: grid !important;
}
.u-hidden {
  display: none !important;
}
```

### Flexbox

```css
.u-flex-row {
  flex-direction: row !important;
}
.u-flex-col {
  flex-direction: column !important;
}
.u-flex-wrap {
  flex-wrap: wrap !important;
}
.u-flex-nowrap {
  flex-wrap: nowrap !important;
}

.u-justify-start {
  justify-content: flex-start !important;
}
.u-justify-center {
  justify-content: center !important;
}
.u-justify-end {
  justify-content: flex-end !important;
}
.u-justify-between {
  justify-content: space-between !important;
}

.u-items-start {
  align-items: flex-start !important;
}
.u-items-center {
  align-items: center !important;
}
.u-items-end {
  align-items: flex-end !important;
}
.u-items-stretch {
  align-items: stretch !important;
}
```

## Color Utilities

### Text Colors

```css
.u-text-primary {
  color: var(--primary-color) !important;
}
.u-text-secondary {
  color: var(--secondary-color) !important;
}
.u-text-accent {
  color: var(--accent-color) !important;
}
.u-text-muted {
  color: var(--text-muted) !important;
}
.u-text-white {
  color: #fff !important;
}
.u-text-black {
  color: #000 !important;
}

/* Status colors */
.u-text-success {
  color: var(--success-color, #28a745) !important;
}
.u-text-warning {
  color: var(--warning-color, #ffc107) !important;
}
.u-text-error {
  color: var(--error-color, #dc3545) !important;
}
.u-text-info {
  color: var(--info-color, #17a2b8) !important;
}
```

### Background Colors

```css
.u-bg-primary {
  background-color: var(--primary-color) !important;
}
.u-bg-secondary {
  background-color: var(--secondary-color) !important;
}
.u-bg-white {
  background-color: #fff !important;
}
.u-bg-gray {
  background-color: var(--light-gray) !important;
}
.u-bg-transparent {
  background-color: transparent !important;
}
```

## State Utilities

### Visibility

```css
.u-visible {
  visibility: visible !important;
}
.u-invisible {
  visibility: hidden !important;
}
.u-opacity-0 {
  opacity: 0 !important;
}
.u-opacity-50 {
  opacity: 0.5 !important;
}
.u-opacity-100 {
  opacity: 1 !important;
}
```

### Interactive States

```css
.is-active {
} /* Applied via JavaScript */
.is-disabled {
} /* Applied via JavaScript */
.is-loading {
} /* Applied via JavaScript */
.is-hidden {
  display: none !important;
}
.is-visible {
  display: block !important;
}

.has-dropdown::after {
  content: '▼';
}
.has-error {
  border-color: var(--error-color) !important;
}
.has-success {
  border-color: var(--success-color) !important;
}
```

## Responsive Utilities

### Breakpoint Prefixes

| Prefix  | Breakpoint  | Min Width |
| ------- | ----------- | --------- |
| `u-sm-` | Small       | 640px     |
| `u-md-` | Medium      | 768px     |
| `u-lg-` | Large       | 1024px    |
| `u-xl-` | Extra Large | 1280px    |

### Examples

```css
/* Base styles apply to all screen sizes */
.u-text-center {
  text-align: center !important;
}

/* Medium screens and up */
.u-md-text-left {
  @media (min-width: 768px) {
    text-align: left !important;
  }
}

/* Large screens and up */
.u-lg-flex {
  @media (min-width: 1024px) {
    display: flex !important;
  }
}
```

## Project-Specific Utilities

### Leaderboard-Specific

```css
.u-rank-gold {
  color: var(--gold-1) !important;
}
.u-rank-silver {
  color: var(--silver-1) !important;
}
.u-rank-bronze {
  color: var(--bronze-1) !important;
}

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

.u-tabular-nums {
  font-variant-numeric: tabular-nums !important;
}
```

### Table-Specific

```css
.u-table-fixed {
  table-layout: fixed !important;
}
.u-table-auto {
  table-layout: auto !important;
}
.u-border-collapse {
  border-collapse: collapse !important;
}
.u-border-separate {
  border-collapse: separate !important;
}
```

## Migration from Current System

### Replace These Utilities

```css
/* OLD - Remove these */
.table-align-rank { }
.table-align-player { }
.table-align-gw { }
.table-align-total { }
.table-align-deficit { }

/* NEW - Use these instead */
.u-text-center    /* For rank column */
.u-text-left      /* For player column */
.u-text-right     /* For GW, total, deficit columns */
```

### Implementation Strategy

1. **Add new utilities** to CSS file
2. **Update HTML** to use new classes
3. **Remove old utility classes** after migration
4. **Test visual consistency** across all components

## Usage Guidelines

### DO ✅

```html
<!-- Single responsibility utilities -->
<div class="leaderboard__cell u-text-right u-font-bold">179</div>

<!-- Combine with component classes -->
<tr class="leaderboard__row leaderboard__row--winner u-bg-primary">
  <!-- Use responsive variants -->
  <div class="u-text-center u-md-text-left u-lg-text-right"></div>
</tr>
```

### DON'T ❌

```html
<!-- Don't create component-specific utilities -->
<div class="u-leaderboard-cell-style">
  <!-- Too specific -->

  <!-- Don't duplicate component functionality -->
  <div class="leaderboard__cell u-table-cell">
    <!-- Redundant -->

    <!-- Don't override utility classes in CSS -->
    .component .u-text-center { text-align: left; }
    <!-- Defeats purpose -->
  </div>
</div>
```

## CSS File Organization

### Recommended Structure

```css
/* 1. CSS Variables */
:root {
}

/* 2. Reset/Base */
*,
*::before,
*::after {
}

/* 3. Layout Utilities */
.l-container {
}
.l-grid {
}

/* 4. Utility Classes */
.u-text-center {
}
.u-font-bold {
}
.u-margin-md {
}

/* 5. Component Styles */
.leaderboard {
}
.button {
}

/* 6. State Classes */
.is-active {
}
.has-error {
}

/* 7. Media Queries */
@media (min-width: 768px) {
}
```

---

_This utility system resolves conflicts with component styles while providing consistent, reusable
patterns._
