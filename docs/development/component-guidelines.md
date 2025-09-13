# Component CSS Guidelines

> **Status**: Active  
> **Last Updated**: 2025-09-13  
> **Project**: adigunners.github.io

## Overview

This document provides detailed guidelines for writing component CSS using BEM methodology, ensuring
consistency and maintainability across the adigunners.github.io project.

## Component Naming Standards

### Primary Components

Each major UI component should follow this structure:

```css
/* Block (Component Root) */
.component-name {
}

/* Elements (Component Parts) */
.component-name__element {
}

/* Modifiers (Variations) */
.component-name--modifier {
}
.component-name__element--modifier {
}
```

### Component Hierarchy

#### Level 1: Page Components

```css
.leaderboard {
} /* Main leaderboard component */
.winners {
} /* Winners showcase component */
.navigation {
} /* Site navigation component */
.header {
} /* Page header component */
.footer {
} /* Page footer component */
```

#### Level 2: Feature Components

```css
.leaderboard-table {
} /* Table within leaderboard */
.leaderboard-nav {
} /* Navigation within leaderboard */
.winner-card {
} /* Individual winner card */
.stat-box {
} /* Statistics display box */
.countdown {
} /* Countdown timer component */
```

#### Level 3: UI Components

```css
.button {
} /* Generic button component */
.modal {
} /* Modal dialog component */
.dropdown {
} /* Dropdown menu component */
.tooltip {
} /* Tooltip component */
.badge {
} /* Badge/chip component */
```

## Leaderboard Component Structure

### Complete BEM Structure

```css
/* === LEADERBOARD COMPONENT === */

/* Block */
.leaderboard {
  /* Container styles */
}

/* Elements */
.leaderboard__table {
  /* Table element styles */
}

.leaderboard__header {
  /* Table header styles */
}

.leaderboard__body {
  /* Table body styles */
}

.leaderboard__row {
  /* Table row styles */
}

.leaderboard__cell {
  /* Table cell styles */
}

.leaderboard__rank {
  /* Rank column specific styles */
}

.leaderboard__player {
  /* Player name column styles */
}

.leaderboard__points {
  /* Points columns styles */
}

.leaderboard__movement {
  /* Movement indicator styles */
}

/* Modifiers */
.leaderboard--compact {
  /* Compact variant */
}

.leaderboard--mobile {
  /* Mobile variant */
}

.leaderboard__row--highlighted {
  /* Highlighted row variant */
}

.leaderboard__row--winner {
  /* Winner row variant */
}

.leaderboard__cell--numeric {
  /* Numeric cell variant */
}

.leaderboard__rank--gold {
  /* Gold rank styling */
}

.leaderboard__rank--silver {
  /* Silver rank styling */
}

.leaderboard__rank--bronze {
  /* Bronze rank styling */
}
```

### Navigation Sub-Component

```css
/* === LEADERBOARD NAVIGATION === */

.leaderboard-nav {
  /* Navigation container */
}

.leaderboard-nav__list {
  /* Navigation list */
}

.leaderboard-nav__item {
  /* Navigation item */
}

.leaderboard-nav__button {
  /* Navigation button */
}

.leaderboard-nav__indicator {
  /* Page indicator */
}

/* Modifiers */
.leaderboard-nav__button--active {
  /* Active button state */
}

.leaderboard-nav__button--disabled {
  /* Disabled button state */
}
```

## Movement Indicator Component

```css
/* === MOVEMENT INDICATOR === */

.movement {
  /* Base movement container */
}

.movement__indicator {
  /* Visual indicator (arrow, dot, etc.) */
}

.movement__text {
  /* Movement text (optional) */
}

/* Modifiers */
.movement--up {
  /* Upward movement */
  --movement-color: var(--movement-up-color);
}

.movement--down {
  /* Downward movement */
  --movement-color: var(--movement-down-color);
}

.movement--same {
  /* No movement */
  --movement-color: var(--movement-same-color);
}

.movement--new {
  /* New entry */
  --movement-color: var(--movement-new-color);
}
```

## Button Component System

```css
/* === BUTTON COMPONENT === */

.button {
  /* Base button styles */
}

/* Size Modifiers */
.button--small {
  /* Small button variant */
}

.button--medium {
  /* Medium button variant (default) */
}

.button--large {
  /* Large button variant */
}

/* Style Modifiers */
.button--primary {
  /* Primary button styling */
}

.button--secondary {
  /* Secondary button styling */
}

.button--outline {
  /* Outline button styling */
}

.button--ghost {
  /* Ghost button styling */
}

/* State Modifiers */
.button--loading {
  /* Loading state */
}

.button--disabled {
  /* Disabled state */
}
```

## Component CSS Variables

### Local CSS Variables Pattern

```css
.component {
  /* Define component-specific variables */
  --component-background: var(--card-background);
  --component-border: var(--border-color);
  --component-text: var(--text-color);
  --component-padding: var(--spacing-md);
  --component-radius: var(--border-radius);

  /* Use variables in properties */
  background: var(--component-background);
  border: 1px solid var(--component-border);
  color: var(--component-text);
  padding: var(--component-padding);
  border-radius: var(--component-radius);
}

/* Modifier can override variables */
.component--dark {
  --component-background: var(--primary-color);
  --component-text: #fff;
}
```

### Leaderboard Variables

```css
.leaderboard {
  --leaderboard-row-height: 56px;
  --leaderboard-cell-padding: var(--spacing-sm) var(--spacing-md);
  --leaderboard-border: 1px solid var(--border-color);
  --leaderboard-background: var(--card-background);
  --leaderboard-header-bg: linear-gradient(135deg, var(--primary-color), var(--heading-color));

  /* Rank-specific variables */
  --rank-gold: var(--gold-1);
  --rank-silver: var(--silver-1);
  --rank-bronze: var(--bronze-1);

  /* Movement variables */
  --movement-up: var(--movement-up-color);
  --movement-down: var(--movement-down-color);
  --movement-same: var(--movement-same-color);
  --movement-new: var(--movement-new-color);
}
```

## Responsive Component Patterns

### Mobile-First Approach

```css
.leaderboard {
  /* Mobile styles (base) */
  display: block;
  overflow-x: auto;
}

.leaderboard__table {
  /* Mobile table styles */
  min-width: 600px;
}

/* Tablet styles */
@media (min-width: 768px) {
  .leaderboard {
    /* Tablet adjustments */
  }

  .leaderboard__table {
    min-width: 100%;
  }
}

/* Desktop styles */
@media (min-width: 1024px) {
  .leaderboard {
    /* Desktop enhancements */
  }
}
```

### Component-Level Media Queries

```css
.leaderboard {
  /* Base styles */
}

.leaderboard__cell--mobile-hidden {
  display: none;
}

@media (min-width: 768px) {
  .leaderboard__cell--mobile-hidden {
    display: table-cell;
  }
}
```

## Component State Management

### State Classes Pattern

```css
/* State classes for JavaScript interaction */
.leaderboard.is-loading {
  opacity: 0.6;
  pointer-events: none;
}

.leaderboard.is-error {
  border-color: var(--error-color);
}

.leaderboard__row.is-highlighted {
  background-color: var(--highlight-background);
}

.leaderboard__row.is-selected {
  background-color: var(--selection-background);
}
```

### Animation States

```css
.leaderboard__row {
  transition: background-color 0.2s ease;
}

.leaderboard__row:hover {
  background-color: var(--hover-background);
}

.leaderboard__movement {
  transition: transform 0.3s ease;
}

.leaderboard__movement.is-updating {
  transform: scale(1.2);
}
```

## Component Documentation Template

### Component Header Template

```css
/* ===============================================
   COMPONENT NAME: Leaderboard
   ===============================================
   
   Purpose: Display fantasy football leaderboard with rankings,
           player names, points, and movement indicators
           
   Usage: <div class="leaderboard leaderboard--compact">
   
   Dependencies: 
   - CSS Variables: --primary-color, --spacing-*
   - Utility Classes: .u-text-center, .u-text-right
   - JavaScript: LeaderboardManager (for state updates)
   
   Modifiers:
   - .leaderboard--compact: Reduced padding for mobile
   - .leaderboard--mobile: Mobile-optimized layout
   
   Last Updated: 2025-09-13
   =============================================== */
```

## HTML Structure Guidelines

### Semantic HTML with BEM

```html
<div class="leaderboard leaderboard--compact">
  <table class="leaderboard__table">
    <thead class="leaderboard__header">
      <tr>
        <th class="leaderboard__cell leaderboard__cell--rank u-text-center">#</th>
        <th class="leaderboard__cell leaderboard__cell--player">PLAYER</th>
        <th class="leaderboard__cell leaderboard__cell--points u-text-right">GW</th>
        <th class="leaderboard__cell leaderboard__cell--points u-text-right">TOTAL</th>
        <th class="leaderboard__cell leaderboard__cell--deficit u-text-right">FROM #1</th>
      </tr>
    </thead>
    <tbody class="leaderboard__body">
      <tr class="leaderboard__row leaderboard__row--winner">
        <td class="leaderboard__cell leaderboard__rank leaderboard__rank--gold u-text-center">
          <span class="leaderboard__rank-number">1</span>
          <span class="movement movement--up">⬆</span>
        </td>
        <td class="leaderboard__cell leaderboard__player">
          <div class="leaderboard__player-name">Player Name</div>
        </td>
        <td class="leaderboard__cell leaderboard__points u-text-right u-tabular-nums">75</td>
        <td class="leaderboard__cell leaderboard__points u-text-right u-tabular-nums">179</td>
        <td class="leaderboard__cell leaderboard__deficit u-text-right u-tabular-nums">—</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Testing Components

### Visual Regression Testing

1. **Component Isolation**: Test each component in isolation
2. **Modifier Testing**: Test all modifier combinations
3. **Responsive Testing**: Test across breakpoints
4. **State Testing**: Test interactive states

### CSS Guidelines Checklist

- [ ] ✅ Uses BEM methodology consistently
- [ ] ✅ No conflicting specificity with utilities
- [ ] ✅ Uses CSS variables for theming
- [ ] ✅ Responsive mobile-first approach
- [ ] ✅ Proper semantic HTML structure
- [ ] ✅ Accessible markup with ARIA labels
- [ ] ✅ Performance-optimized CSS selectors
- [ ] ✅ Documented component purpose and usage

---

_These guidelines ensure consistent, maintainable component architecture across the entire project._
