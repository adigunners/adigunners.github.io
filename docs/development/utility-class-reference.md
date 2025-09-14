# Utility Class Reference

> **Status**: ✅ Complete  
> **Task**: 6.3 - Create utility class documentation with usage examples  
> **Date**: 2025-09-13  
> **Project**: adigunners.github.io

Complete reference guide for all utility classes in the adigunners Fantasy Premier League website,
organized by category with practical usage examples.

## Table of Contents

1. [Overview](#overview)
2. [Text Utilities](#text-utilities)
3. [Display Utilities](#display-utilities)
4. [Flexbox Utilities](#flexbox-utilities)
5. [Spacing Utilities](#spacing-utilities)
6. [Color Utilities](#color-utilities)
7. [Project-Specific Utilities](#project-specific-utilities)
8. [Responsive Utilities](#responsive-utilities)
9. [Usage Examples](#usage-examples)
10. [CSS Layer Integration](#css-layer-integration)

## Overview

### Naming Convention

All utility classes follow the `.u-` prefix pattern:

- **Text**: `.u-text-*`, `.u-font-*`
- **Display**: `.u-block`, `.u-flex`, `.u-hidden`
- **Spacing**: `.u-margin-*`, `.u-padding-*`
- **Colors**: `.u-text-*`, `.u-bg-*`
- **Responsive**: `.u-md-*`, `.u-lg-*`

### CSS Layer Implementation

```css
@layer utilities {
  .u-text-center {
    text-align: center;
  }
  /* All utilities in layer - no !important needed */
}
```

## Text Utilities

### Text Alignment

#### Classes

```css
.u-text-left     /* text-align: left */
.u-text-center   /* text-align: center */
.u-text-right    /* text-align: right */
.u-text-justify  /* text-align: justify */
```

#### Usage Examples

```html
<!-- Center-aligned leaderboard rank -->
<th class="leaderboard__cell leaderboard__cell--rank u-text-center">#</th>

<!-- Right-aligned stats numbers -->
<td class="leaderboard__cell leaderboard__cell--total u-text-right">2,459</td>

<!-- Left-aligned player names -->
<td class="leaderboard__cell leaderboard__cell--player u-text-left">Player Name</td>
```

### Font Weight

#### Classes

```css
.u-font-light    /* font-weight: 300 */
.u-font-normal   /* font-weight: 400 */
.u-font-medium   /* font-weight: 500 */
.u-font-semibold /* font-weight: 600 */
.u-font-bold     /* font-weight: 700 */
.u-font-black    /* font-weight: 900 */
```

#### Usage Examples

```html
<!-- Bold headings -->
<h2 class="section__heading-main u-font-bold">Leaderboard</h2>

<!-- Medium weight for subheadings -->
<p class="section__heading-subtitle u-font-medium">Current standings</p>

<!-- Light weight for descriptions -->
<p class="section__desc u-font-light">Updated every hour</p>
```

## Display Utilities

### Basic Display

#### Classes

```css
.u-block        /* display: block */
.u-inline       /* display: inline */
.u-inline-block /* display: inline-block */
.u-flex         /* display: flex */
.u-inline-flex  /* display: inline-flex */
.u-grid         /* display: grid */
.u-hidden       /* display: none */
```

#### Usage Examples

```html
<!-- Hide elements on specific conditions -->
<div class="error-message u-hidden">Error occurred</div>

<!-- Force block display -->
<span class="highlight u-block">Important notice</span>

<!-- Flexbox containers -->
<div class="nav__button-group u-flex">
  <button class="nav__button">Previous</button>
  <button class="nav__button">Next</button>
</div>
```

## Flexbox Utilities

### Flex Direction

#### Classes

```css
.u-flex-row  /* flex-direction: row */
.u-flex-col  /* flex-direction: column */
```

#### Usage Examples

```html
<!-- Horizontal layout -->
<div class="stats__summary u-flex u-flex-row">
  <div class="stats__item">Total Players: 64</div>
  <div class="stats__item">Active: 58</div>
</div>

<!-- Vertical layout -->
<div class="winner__card u-flex u-flex-col">
  <div class="winner__rank">1st Place</div>
  <div class="winner__name">Weekend Blues</div>
</div>
```

### Flex Wrap

#### Classes

```css
.u-flex-wrap   /* flex-wrap: wrap */
.u-flex-nowrap /* flex-wrap: nowrap */
```

#### Usage Examples

```html
<!-- Wrapping button group -->
<div class="nav__controls u-flex u-flex-wrap">
  <button class="nav__button">First</button>
  <button class="nav__button">Previous</button>
  <button class="nav__button">Next</button>
  <button class="nav__button">Last</button>
</div>
```

### Justify Content

#### Classes

```css
.u-justify-start   /* justify-content: flex-start */
.u-justify-center  /* justify-content: center */
.u-justify-end     /* justify-content: flex-end */
.u-justify-between /* justify-content: space-between */
```

#### Usage Examples

```html
<!-- Centered navigation -->
<nav class="nav__leaderboard u-flex u-justify-center">
  <button class="nav__button">Previous</button>
  <span class="nav__page-info">Page 1 of 3</span>
  <button class="nav__button">Next</button>
</nav>

<!-- Space between header elements -->
<header class="section__header u-flex u-justify-between">
  <h2 class="section__title">Statistics</h2>
  <button class="section__toggle">Toggle</button>
</header>
```

### Align Items

#### Classes

```css
.u-items-start   /* align-items: flex-start */
.u-items-center  /* align-items: center */
.u-items-end     /* align-items: flex-end */
.u-items-stretch /* align-items: stretch */
```

#### Usage Examples

```html
<!-- Vertically centered content -->
<div class="stats__box u-flex u-items-center">
  <div class="stats__icon">📊</div>
  <div class="stats__content">
    <div class="stats__number">64</div>
    <div class="stats__title">Players</div>
  </div>
</div>
```

## Spacing Utilities

### Margin - All Sides

#### Classes

```css
.u-margin-0   /* margin: 0 */
.u-margin-xs  /* margin: var(--spacing-xs)  = 4px */
.u-margin-sm  /* margin: var(--spacing-sm)  = 8px */
.u-margin-md  /* margin: var(--spacing-md)  = 16px */
.u-margin-lg  /* margin: var(--spacing-lg)  = 24px */
.u-margin-xl  /* margin: var(--spacing-xl)  = 32px */
```

#### Usage Examples

```html
<!-- Remove default margins -->
<p class="section__desc u-margin-0">No margin paragraph</p>

<!-- Add consistent spacing -->
<div class="stats__summary u-margin-lg">
  <p>Summary information with large margin</p>
</div>
```

### Margin - Directional

#### Classes

```css
.u-margin-top-0     /* margin-top: 0 */
.u-margin-top-sm    /* margin-top: var(--spacing-sm) */
.u-margin-right-md  /* margin-right: var(--spacing-md) */
.u-margin-bottom-lg /* margin-bottom: var(--spacing-lg) */
.u-margin-left-xl   /* margin-left: var(--spacing-xl) */
```

#### Usage Examples

```html
<!-- Remove top margin from first element -->
<h2 class="section__heading u-margin-top-0">First Heading</h2>

<!-- Add bottom spacing between sections -->
<section class="stats u-margin-bottom-lg">
  <!-- Stats content -->
</section>
```

### Margin - Axis

#### Classes

```css
.u-margin-x-auto /* margin-left: auto; margin-right: auto */
.u-margin-y-0    /* margin-top: 0; margin-bottom: 0 */
```

#### Usage Examples

```html
<!-- Centered container -->
<div class="winner__card u-margin-x-auto">
  <h3>Centered Winner Card</h3>
</div>

<!-- Remove vertical margins -->
<p class="inline-text u-margin-y-0">No vertical margins</p>
```

### Padding

#### Classes

```css
.u-padding-0   /* padding: 0 */
.u-padding-xs  /* padding: var(--spacing-xs)  = 4px */
.u-padding-sm  /* padding: var(--spacing-sm)  = 8px */
.u-padding-md  /* padding: var(--spacing-md)  = 16px */
.u-padding-lg  /* padding: var(--spacing-lg)  = 24px */

/* Directional padding */
.u-padding-top-sm    /* padding-top: var(--spacing-sm) */
.u-padding-right-md  /* padding-right: var(--spacing-md) */
.u-padding-bottom-lg /* padding-bottom: var(--spacing-lg) */
.u-padding-left-xl   /* padding-left: var(--spacing-xl) */
```

#### Usage Examples

```html
<!-- Compact padding for mobile -->
<button class="nav__button nav__button--compact u-padding-sm">Next</button>

<!-- Extra padding for emphasis -->
<div class="section__card section__card--highlighted u-padding-lg">
  <h3>Important Section</h3>
</div>
```

## Color Utilities

### Text Colors

#### Classes

```css
.u-text-primary   /* color: var(--primary-color) */
.u-text-secondary /* color: var(--secondary-color) */
.u-text-accent    /* color: var(--accent-color) */
.u-text-muted     /* color: var(--text-muted) */
.u-text-white     /* color: #fff */
.u-text-black     /* color: #000 */

/* Status colors */
.u-text-success   /* color: var(--success-color) */
.u-text-warning   /* color: var(--warning-color) */
.u-text-error     /* color: var(--error-color) */
.u-text-info      /* color: var(--info-color) */
```

#### Usage Examples

```html
<!-- Muted text for descriptions -->
<p class="section__desc u-text-muted">Last updated: 2 hours ago</p>

<!-- Primary color for important elements -->
<h2 class="section__heading u-text-primary">Current Rankings</h2>

<!-- Status indicators -->
<span class="status u-text-success">✓ Active</span>
<span class="status u-text-warning">⚠ Pending</span>
<span class="status u-text-error">✗ Error</span>
```

### Background Colors

#### Classes

```css
.u-bg-primary     /* background-color: var(--primary-color) */
.u-bg-secondary   /* background-color: var(--secondary-color) */
.u-bg-white       /* background-color: #fff */
.u-bg-gray        /* background-color: var(--light-gray) */
.u-bg-transparent /* background-color: transparent */
```

#### Usage Examples

```html
<!-- White background overlay -->
<div class="modal-content u-bg-white u-padding-lg">
  <h3>Modal Title</h3>
</div>

<!-- Transparent background for overlays -->
<div class="overlay u-bg-transparent">
  <div class="overlay-content u-bg-white">
    <!-- Content -->
  </div>
</div>
```

## Project-Specific Utilities

### Leaderboard Rankings

#### Classes

```css
.u-rank-gold   /* color: var(--gold-1)   - #ffd700 */
.u-rank-silver /* color: var(--silver-1) - #c0c0c0 */
.u-rank-bronze /* color: var(--bronze-1) - #cd7f32 */
```

#### Usage Examples

```html
<!-- Rank highlighting in leaderboard -->
<td class="leaderboard__cell leaderboard__cell--rank u-text-center">
  <span class="rank-number u-rank-gold">1</span>
</td>

<td class="leaderboard__cell leaderboard__cell--rank u-text-center">
  <span class="rank-number u-rank-silver">2</span>
</td>

<td class="leaderboard__cell leaderboard__cell--rank u-text-center">
  <span class="rank-number u-rank-bronze">3</span>
</td>
```

### Movement Indicators

#### Classes

```css
.u-movement-up   /* color: var(--movement-up-color)   - Green */
.u-movement-down /* color: var(--movement-down-color) - Red */
.u-movement-same /* color: var(--movement-same-color) - Gray */
.u-movement-new  /* color: var(--movement-new-color)  - Blue */
```

#### Usage Examples

```html
<!-- Movement indicators in leaderboard -->
<span class="rank-movement u-movement-up">⬆ +2</span>
<span class="rank-movement u-movement-down">⬇ -1</span>
<span class="rank-movement u-movement-same">⚬ —</span>
<span class="rank-movement u-movement-new">● NEW</span>
```

### Typography Enhancements

#### Classes

```css
.u-tabular-nums  /* font-variant-numeric: tabular-nums */
```

#### Usage Examples

```html
<!-- Aligned numbers in tables -->
<td class="leaderboard__cell leaderboard__cell--total u-text-right u-tabular-nums">2,459</td>

<td class="leaderboard__cell leaderboard__cell--gw u-text-right u-tabular-nums">75</td>
```

### Table Utilities

#### Classes

```css
.u-table-fixed    /* table-layout: fixed */
.u-table-auto     /* table-layout: auto */
.u-border-collapse /* border-collapse: collapse */
.u-border-separate /* border-collapse: separate */
```

#### Usage Examples

```html
<!-- Fixed table layout for consistent column widths -->
<table class="leaderboard__table u-table-fixed">
  <colgroup>
    <col style="width: 3ch" />
    <!-- Rank -->
    <col style="width: auto" />
    <!-- Player -->
    <col style="width: 4ch" />
    <!-- GW -->
    <col style="width: 6ch" />
    <!-- Total -->
    <col style="width: 5ch" />
    <!-- Deficit -->
  </colgroup>
</table>
```

### Visibility Utilities

#### Classes

```css
.u-visible   /* visibility: visible */
.u-invisible /* visibility: hidden */
.u-opacity-0   /* opacity: 0 */
.u-opacity-50  /* opacity: 0.5 */
.u-opacity-100 /* opacity: 1 */
```

#### Usage Examples

```html
<!-- Fade effects -->
<div class="loading-spinner u-opacity-50">
  <div class="spinner"></div>
</div>

<!-- Hidden but space-preserving -->
<button class="nav__button u-invisible">Hidden Button</button>

<!-- Completely hidden -->
<div class="error-message u-hidden">Error: Something went wrong</div>
```

## Responsive Utilities

### Breakpoint System

```css
/* Small screens and up (640px+) */
.u-sm-*

/* Medium screens and up (768px+) */
.u-md-*

/* Large screens and up (1024px+) */
.u-lg-*

/* Extra large screens and up (1280px+) */
.u-xl-*
```

### Text Alignment - Responsive

#### Classes

```css
.u-sm-text-left, .u-sm-text-center, .u-sm-text-right
.u-md-text-left, .u-md-text-center, .u-md-text-right
.u-lg-text-left, .u-lg-text-center, .u-lg-text-right
.u-xl-text-center
```

#### Usage Examples

```html
<!-- Centered on mobile, left-aligned on larger screens -->
<h2 class="section__heading u-text-center u-md-text-left">Statistics Overview</h2>

<!-- Right-aligned on large screens only -->
<div class="nav__actions u-lg-text-right">
  <button class="nav__button">Actions</button>
</div>
```

### Display - Responsive

#### Classes

```css
.u-sm-block, .u-sm-flex, .u-sm-grid, .u-sm-hidden
.u-md-block, .u-md-flex, .u-md-grid, .u-md-hidden
.u-lg-block, .u-lg-flex, .u-lg-grid, .u-lg-hidden
.u-xl-flex, .u-xl-grid, .u-xl-hidden
```

#### Usage Examples

```html
<!-- Hidden on mobile, visible on tablet+ -->
<div class="advanced-controls u-hidden u-md-block">
  <button>Advanced Options</button>
</div>

<!-- Flex layout on medium screens and up -->
<div class="stats__row u-md-flex u-md-justify-between">
  <div class="stats__box">Stat 1</div>
  <div class="stats__box">Stat 2</div>
</div>
```

### Flexbox - Responsive

#### Classes

```css
.u-md-flex-row, .u-md-flex-col
.u-md-justify-center, .u-md-justify-between
.u-lg-flex-row, .u-lg-flex-col
```

#### Usage Examples

```html
<!-- Column on mobile, row on tablet+ -->
<div class="winner__cards u-flex u-flex-col u-md-flex-row">
  <div class="winner__card">First</div>
  <div class="winner__card">Second</div>
  <div class="winner__card">Third</div>
</div>

<!-- Center on medium screens -->
<nav class="nav__leaderboard u-flex u-md-justify-center">
  <button class="nav__button">Previous</button>
  <button class="nav__button">Next</button>
</nav>
```

## Usage Examples

### Complete Leaderboard Table

```html
<div class="table-scroll">
  <div class="leaderboard">
    <table class="leaderboard__table leaderboard__table--compact u-table-fixed">
      <colgroup>
        <col style="width: 5ch" />
        <!-- Rank -->
        <col style="width: auto" />
        <!-- Player -->
        <col style="width: 4ch" />
        <!-- GW -->
        <col style="width: 6ch" />
        <!-- Total -->
        <col style="width: 5ch" />
        <!-- Deficit -->
      </colgroup>
      <thead class="leaderboard__header">
        <tr class="leaderboard__row">
          <th class="leaderboard__cell leaderboard__cell--rank u-text-center">#</th>
          <th class="leaderboard__cell leaderboard__cell--player u-text-left">PLAYER</th>
          <th class="leaderboard__cell leaderboard__cell--gw u-text-right">GW</th>
          <th class="leaderboard__cell leaderboard__cell--total u-text-right">TOTAL</th>
          <th class="leaderboard__cell leaderboard__cell--deficit u-text-right">FROM #1</th>
        </tr>
      </thead>
      <tbody class="leaderboard__body">
        <tr class="leaderboard__row leaderboard__row--winner">
          <td class="leaderboard__cell leaderboard__cell--rank u-text-center">
            <span class="rank-number u-rank-gold">1</span>
            <span class="rank-movement u-movement-up">⬆</span>
          </td>
          <td class="leaderboard__cell leaderboard__cell--player u-text-left">Weekend Blues</td>
          <td class="leaderboard__cell leaderboard__cell--gw u-text-right u-tabular-nums">75</td>
          <td class="leaderboard__cell leaderboard__cell--total u-text-right u-tabular-nums">
            2,459
          </td>
          <td class="leaderboard__cell leaderboard__cell--deficit u-text-right u-tabular-nums">
            —
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### Responsive Stats Grid

```html
<div class="stats">
  <div class="stats__row u-flex u-flex-col u-md-flex-row">
    <div class="stats__box stats__box--primary u-flex u-items-center u-padding-lg">
      <div class="stats__icon u-text-white">👥</div>
      <div class="stats__content u-text-white">
        <div class="stats__number u-font-bold u-tabular-nums">64</div>
        <div class="stats__title u-font-medium">Total Players</div>
      </div>
    </div>

    <div class="stats__box u-flex u-items-center u-padding-lg u-bg-white">
      <div class="stats__icon u-text-primary">🏆</div>
      <div class="stats__content">
        <div class="stats__number u-font-bold u-text-primary u-tabular-nums">₹5,280</div>
        <div class="stats__title u-text-muted u-font-medium">Total Prize Pool</div>
      </div>
    </div>
  </div>
</div>
```

### Navigation with Responsive Behavior

```html
<nav class="nav__leaderboard u-flex u-flex-col u-md-flex-row u-items-center u-justify-center">
  <button class="nav__button nav__button--compact u-margin-bottom-sm u-md-margin-bottom-0">
    ← Previous
  </button>

  <div class="nav__page-info u-text-center u-text-muted u-margin-x-auto u-md-margin-x-0">
    <span class="u-font-medium">Page 1 of 3</span>
    <span class="u-hidden u-md-inline"> • </span>
    <span class="u-hidden u-md-inline">Showing 20 of 64 players</span>
  </div>

  <button class="nav__button nav__button--compact u-margin-top-sm u-md-margin-top-0">Next →</button>
</nav>
```

## CSS Layer Integration

### How Utilities Override Components

```css
@layer components {
  .stats__box {
    text-align: left; /* Component default */
    background: #f5f5f5; /* Component default */
  }
}

@layer utilities {
  .u-text-center {
    text-align: center; /* Utility override */
  }

  .u-bg-white {
    background: #fff; /* Utility override */
  }
}
```

### HTML Example

```html
<!-- Utilities override component defaults -->
<div class="stats__box u-text-center u-bg-white">
  <!-- Content will be center-aligned with white background -->
  <div class="stats__number">64</div>
  <div class="stats__title">Players</div>
</div>
```

### No !important Required

Thanks to CSS layers, utilities naturally override components without needing `!important`:

```css
/* ❌ Old approach - required !important */
.u-text-center {
  text-align: center !important;
}

/* ✅ New approach - layer order provides specificity */
@layer utilities {
  .u-text-center {
    text-align: center; /* No !important needed */
  }
}
```

## Best Practices

### When to Use Utilities

✅ **Good use cases:**

- Common styling patterns (alignment, spacing)
- One-off adjustments to component styles
- Responsive behavior modifications
- State-based styling changes

❌ **Avoid for:**

- Complex component-specific styling
- Styles that should be part of component identity
- Frequently repeated complex combinations

### Combining with Components

```html
<!-- ✅ Good: Utilities enhance components -->
<div class="winner__card winner__card--rank-1 u-margin-lg u-text-center">
  <h3 class="winner__name u-font-bold">Champion</h3>
  <p class="winner__prize u-text-muted">₹2,500 won</p>
</div>

<!-- ❌ Avoid: Too many utilities replacing component styles -->
<div class="u-bg-white u-border u-border-radius u-padding-lg u-margin-md u-text-center">
  <!-- Should be a proper component -->
</div>
```

### Responsive Strategy

```html
<!-- ✅ Good: Progressive enhancement -->
<div class="stats__summary u-text-center u-md-text-left u-lg-flex u-lg-justify-between">
  <!-- Mobile: center text, block layout -->
  <!-- Tablet: left text, block layout -->
  <!-- Desktop: left text, flex layout with space between -->
</div>
```

---

## Implementation Stats

- **Total Utility Classes**: 80+ classes implemented
- **CSS Layer Integration**: All utilities wrapped in `@layer utilities`
- **!important Elimination**: 48+ utility declarations converted from `!important`
- **Responsive Coverage**: 4 breakpoints with consistent patterns
- **Project-Specific**: 12 FPL-specific utility classes

---

**Last Updated**: 2025-09-13  
**Version**: 1.0.0  
**Maintained By**: Development Team
