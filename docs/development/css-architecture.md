# CSS Architecture Standards

> **Status**: Active  
> **Last Updated**: 2025-09-13  
> **Project**: adigunners.github.io

## Overview

This document defines the CSS architecture standards for the adigunners.github.io project,
implementing BEM methodology to resolve specificity conflicts and improve maintainability.

## BEM Naming Convention

### Block-Element-Modifier (BEM) Structure

```css
.block {
}
.block__element {
}
.block--modifier {
}
.block__element--modifier {
}
```

### Project-Specific BEM Standards

#### 1. Component Blocks (Primary Components)

```css
/* Leaderboard Component */
.leaderboard {
}
.leaderboard__table {
}
.leaderboard__header {
}
.leaderboard__row {
}
.leaderboard__cell {
}
.leaderboard__rank {
}
.leaderboard__player {
}
.leaderboard__points {
}
.leaderboard__movement {
}

/* Modifiers */
.leaderboard--compact {
}
.leaderboard--mobile {
}
.leaderboard__row--highlight {
}
.leaderboard__row--winner {
}
.leaderboard__cell--numeric {
}
.leaderboard__rank--gold {
}
.leaderboard__rank--silver {
}
.leaderboard__rank--bronze {
}
```

#### 2. Navigation Components

```css
/* Navigation Block */
.leaderboard-nav {
}
.leaderboard-nav__button {
}
.leaderboard-nav__indicator {
}

/* Modifiers */
.leaderboard-nav__button--disabled {
}
.leaderboard-nav__button--active {
}
```

#### 3. Movement Indicators

```css
/* Movement Block */
.movement {
}
.movement__indicator {
}
.movement__arrow {
}

/* Modifiers */
.movement--up {
}
.movement--down {
}
.movement--same {
}
.movement--new {
}
```

## Utility Class System

### Utility Naming Convention

**Pattern**: `.u-{property}-{value}`

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

/* Font Weights */
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

/* Spacing */
.u-margin-none {
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

.u-padding-none {
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

### Utility Specificity Rules

1. **Always use `!important`** - Utilities should override component styles
2. **Single responsibility** - One property per utility class
3. **Responsive variants** - Use breakpoint prefixes when needed

```css
/* Responsive Utilities */
.u-text-left {
  text-align: left !important;
}
.u-md-text-center {
  text-align: center !important;
} /* 768px+ */
.u-lg-text-right {
  text-align: right !important;
} /* 1024px+ */
```

## CSS Specificity Hierarchy

### 1. Reset/Base Styles (Specificity: 0-0-1)

```css
html,
body,
div,
span {
}
```

### 2. Layout Utilities (Specificity: 0-1-0)

```css
.container {
}
.grid {
}
.flex {
}
```

### 3. Component Styles (Specificity: 0-1-0)

```css
.leaderboard {
}
.leaderboard__table {
}
```

### 4. Component Modifiers (Specificity: 0-2-0)

```css
.leaderboard.leaderboard--compact {
}
.leaderboard__row.leaderboard__row--highlight {
}
```

### 5. Utility Classes (Specificity: 0-1-0 + !important)

```css
.u-text-center {
  text-align: center !important;
}
```

### 6. State Classes (Specificity: 0-2-0)

```css
.leaderboard__button:hover {
}
.leaderboard__row.is-active {
}
```

## Migration Strategy

### Phase 1: Immediate Conflicts (Current Phase)

**Problem**: `.table-align-gw` vs `.leaderboard-gw` conflicts

**Solution**: Consolidate into BEM structure

```css
/* OLD - Conflicting */
.table-align-gw td:nth-child(3) {
  text-align: center;
}
.leaderboard-gw {
  text-align: right;
}

/* NEW - BEM + Utility */
.leaderboard__cell--gw {
  /* component styles */
}
.u-text-right {
  text-align: right !important;
}
```

### Phase 2: Component Refactoring

1. **Leaderboard component** → `.leaderboard` block
2. **Table component** → `.table` block
3. **Button components** → `.button` block
4. **Modal components** → `.modal` block

### Phase 3: Utility Consolidation

1. Replace duplicate alignment rules with `.u-text-*` utilities
2. Replace duplicate font-weight rules with `.u-font-*` utilities
3. Replace duplicate spacing with `.u-margin-*` and `.u-padding-*` utilities

## Implementation Guidelines

### DO ✅

```css
/* Use BEM for components */
.leaderboard__rank { }
.leaderboard__rank--gold { }

/* Use utilities for single properties */
.u-text-center { text-align: center !important; }

/* Use CSS variables */
.leaderboard {
  color: var(--primary-color);
  padding: var(--spacing-md);
}

/* Combine BEM + utilities */
<td class="leaderboard__cell leaderboard__cell--numeric u-text-right">
```

### DON'T ❌

```css
/* Don't mix naming conventions */
.leaderboard-cell.table-align-right {
} /* Mixed conventions */

/* Don't use complex selectors for utilities */
.table-align-gw td:nth-child(3) {
} /* Too specific */

/* Don't hardcode values that have variables */
.component {
  padding: 16px; /* Use var(--spacing-md) instead */
}

/* Don't create utility-like components */
.text-center-component {
} /* Use .u-text-center instead */
```

## CSS Variables Integration

### Component-Specific Variables

```css
:root {
  /* Leaderboard specific */
  --leaderboard-row-height: 56px;
  --leaderboard-rank-width: 60px;
  --leaderboard-border-radius: var(--radius-md);

  /* Movement indicators */
  --movement-up-color: #28a745;
  --movement-down-color: #dc3545;
  --movement-same-color: #6c757d;
  --movement-new-color: #007bff;
}

.leaderboard {
  --rank-width: var(--leaderboard-rank-width);
  --row-height: var(--leaderboard-row-height);
}
```

## Next Steps

1. **Phase 2**: Create utility class standards document
2. **Phase 3**: Develop migration guide for existing components
3. **Phase 4**: Implement BEM refactoring for leaderboard component
4. **Phase 5**: Create component-specific guidelines

---

_This document is part of the CSS architecture refactoring project and should be updated as
standards evolve._
