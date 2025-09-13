# Table Component BEM Refactoring Plan

> **Status**: ✅ Completed  
> **Task**: 4.1 - Refactor table component classes to BEM methodology  
> **Date**: 2025-09-13  
> **Project**: adigunners.github.io

## Current State Analysis

### Existing Table Classes (Mixed Naming)

#### Primary Leaderboard Classes

- `.leaderboard-table` - Main table container
- `.leaderboard-rank` - Rank column cells
- `.leaderboard-player` - Player name cells
- `.leaderboard-gw` - Gameweek points cells
- `.leaderboard-total` - Total points cells
- `.leaderboard-deficit` - Deficit from leader cells

#### Problematic Utility Classes (Being Removed)

- ~~`.table-align-rank`~~ - ✅ Already removed in Phase 3
- ~~`.table-align-player`~~ - ✅ Already removed in Phase 3
- ~~`.table-align-gw`~~ - ✅ Already removed in Phase 3
- ~~`.table-align-total`~~ - ✅ Already removed in Phase 3
- ~~`.table-align-deficit`~~ - ✅ Already removed in Phase 3

#### External Components (Preserve)

- `.c-table` - External component library (keep as exception)
- `.c-table--winners` - External winners table variant
- `.c-table-wrap` - External table wrapper

#### Generic Classes

- `.table-scroll` - Generic table scroll container
- `.table-density-compact` - Table spacing modifier

## Target BEM Structure

### 1. Leaderboard Component Hierarchy

```css
/* BLOCK: Main leaderboard component */
.leaderboard {
  /* Overall leaderboard container styles */
}

/* ELEMENT: Table within leaderboard */
.leaderboard__table {
  /* Specific table styling for leaderboard */
}

/* ELEMENT: Table sections */
.leaderboard__header {
  /* Table header section */
}

.leaderboard__body {
  /* Table body section */
}

/* ELEMENT: Row within leaderboard table */
.leaderboard__row {
  /* Row styling within leaderboard */
}

/* ELEMENT: Generic cell within leaderboard */
.leaderboard__cell {
  /* Base cell styling */
}

/* MODIFIER: Specific cell types */
.leaderboard__cell--rank {
  /* Rank-specific cell styling */
}

.leaderboard__cell--player {
  /* Player name cell styling */
}

.leaderboard__cell--gw {
  /* Gameweek points cell styling */
}

.leaderboard__cell--total {
  /* Total points cell styling */
}

.leaderboard__cell--deficit {
  /* Deficit cell styling */
}

/* MODIFIER: Row states */
.leaderboard__row--winner {
  /* Winner row highlighting */
}

.leaderboard__row--hover {
  /* Hover state styling */
}

.leaderboard__row--even {
  /* Even row styling (zebra stripes) */
}

.leaderboard__row--odd {
  /* Odd row styling (zebra stripes) */
}
```

### 2. Table Scroll Component

```css
/* BLOCK: Generic table scroll container */
.table-scroll {
  /* Horizontal scroll container */
}

.table-scroll__table {
  /* Table within scroll container */
}
```

### 3. Density Modifier

```css
/* MODIFIER: Table density variations */
.leaderboard__table--compact {
  /* Compact spacing version */
}

.leaderboard__table--comfortable {
  /* Default spacing version */
}

.leaderboard__table--spacious {
  /* Expanded spacing version */
}
```

## Migration Strategy

### Phase 1: Add New BEM Classes (Non-Breaking)

1. **Add new BEM classes alongside existing classes**
2. **Keep old classes functional during transition**
3. **Test new classes work correctly**

### Phase 2: Update HTML Templates

1. **Update main index.html leaderboard table**
2. **Update test files to use new BEM classes**
3. **Add both old and new classes temporarily**

### Phase 3: Remove Old Classes

1. **Remove old non-BEM classes from CSS**
2. **Remove old classes from HTML templates**
3. **Clean up unused CSS rules**

## Implementation Details

### Current CSS Locations

The leaderboard table CSS is currently scattered across:

- **Base styles**: Lines 889-895 (basic table structure)
- **Column styling**: Lines 2567-2703 (individual column classes)
- **Responsive mobile**: Lines 3721-3821 (mobile-specific adjustments)
- **Responsive tablet**: Lines 3992-4102 (tablet-specific adjustments)
- **Responsive small desktop**: Lines 4078-4192 (small desktop adjustments)
- **Responsive desktop**: Lines 4330-4337 (desktop adjustments)

### Consolidation Strategy

**Before (Scattered)**:

```css
/* Base styles around line 889 */
.leaderboard-table {
}

/* Column styles around line 2567 */
.leaderboard-rank {
}
.leaderboard-player {
}
.leaderboard-gw {
}

/* Mobile styles around line 3721 */
@media (max-width: 768px) {
  .leaderboard-table {
  }
}

/* Tablet styles around line 3992 */
@media (min-width: 768.01px) and (max-width: 1024px) {
  .leaderboard-table {
  }
}
```

**After (Consolidated)**:

```css
/* ==========================================================================
   LEADERBOARD COMPONENT - BEM Structure
   ========================================================================== */

/* Base Component */
.leaderboard {
}
.leaderboard__table {
}
.leaderboard__header {
}
.leaderboard__body {
}
.leaderboard__row {
}
.leaderboard__cell {
}

/* Cell Type Modifiers */
.leaderboard__cell--rank {
}
.leaderboard__cell--player {
}
.leaderboard__cell--gw {
}
.leaderboard__cell--total {
}
.leaderboard__cell--deficit {
}

/* Row State Modifiers */
.leaderboard__row--winner {
}
.leaderboard__row--hover {
}

/* Table Density Modifiers */
.leaderboard__table--compact {
}

/* ==========================================================================
   LEADERBOARD RESPONSIVE STYLES
   ========================================================================== */

@media (max-width: 768px) {
  .leaderboard__table {
  }
  .leaderboard__cell {
  }
  /* etc... */
}

@media (min-width: 768.01px) and (max-width: 1024px) {
  .leaderboard__table {
  }
  /* etc... */
}
```

## HTML Migration Examples

### Current HTML Structure

```html
<table class="leaderboard-table table-density-compact">
  <thead>
    <tr>
      <th class="col-rank u-text-center">#</th>
      <th class="u-text-left">PLAYER</th>
      <th class="u-text-right">GW</th>
      <th class="u-text-right">TOTAL</th>
      <th class="u-text-right">FROM #1</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="leaderboard-rank col-rank u-text-center rank-1">1</td>
      <td class="leaderboard-player u-text-left">Player Name</td>
      <td class="leaderboard-gw u-text-right">75</td>
      <td class="leaderboard-total u-text-right">2,459</td>
      <td class="leaderboard-deficit u-text-right">-179</td>
    </tr>
  </tbody>
</table>
```

### Target BEM HTML Structure

```html
<div class="leaderboard">
  <table class="leaderboard__table leaderboard__table--compact">
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
        <td class="leaderboard__cell leaderboard__cell--rank u-text-center">1</td>
        <td class="leaderboard__cell leaderboard__cell--player u-text-left">Player Name</td>
        <td class="leaderboard__cell leaderboard__cell--gw u-text-right">75</td>
        <td class="leaderboard__cell leaderboard__cell--total u-text-right">2,459</td>
        <td class="leaderboard__cell leaderboard__cell--deficit u-text-right">-179</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Benefits of BEM Refactoring

### 1. Improved Maintainability

- **Clear component hierarchy** - Easy to understand relationships
- **Consistent naming pattern** - Predictable class names
- **Reduced cognitive load** - Obvious purpose of each class
- **Better organization** - Logical grouping of related styles

### 2. Enhanced Scalability

- **Modular components** - Easy to reuse leaderboard elsewhere
- **Flexible modifiers** - Easy to add new table variations
- **Clear boundaries** - Component styles don't leak between components
- **Future-proof structure** - Easy to extend with new features

### 3. Better Developer Experience

- **Searchable code** - Easy to find all leaderboard-related styles
- **Predictable patterns** - Developers know where to look for styles
- **Easier debugging** - Clear relationship between HTML and CSS
- **Better tooling support** - IDE autocomplete and navigation

### 4. Performance Benefits

- **Consolidated CSS** - Fewer scattered rules to parse
- **Reduced specificity conflicts** - Cleaner cascade behavior
- **Better caching** - Component styles cache independently
- **Smaller bundle size** - Eliminate duplicate patterns

## Risk Assessment

### Low Risk Changes

- ✅ **Adding new BEM classes** - Non-breaking additive changes
- ✅ **Consolidating scattered CSS** - Improves organization
- ✅ **Utility class integration** - Already proven in Phase 3

### Medium Risk Changes

- ⚠️ **HTML template updates** - Requires careful testing
- ⚠️ **Responsive style consolidation** - Complex media query rules
- ⚠️ **JavaScript integration** - Dynamic class manipulation

### High Risk Changes

- 🔴 **Removing old classes** - Could break functionality if missed
- 🔴 **Complex nth-child selectors** - Intricate specificity relationships
- 🔴 **Cross-component dependencies** - Potential unexpected interactions

## Testing Strategy

### 1. Visual Regression Testing

- **Before/after screenshots** for all breakpoints
- **Interactive state testing** (hover, active, focus)
- **Cross-browser validation** across supported browsers

### 2. Functional Testing

- **Table sorting** (if applicable)
- **Dynamic content updates** via JavaScript
- **Responsive behavior** across all breakpoints
- **Accessibility compliance** with screen readers

### 3. Performance Testing

- **CSS bundle size** comparison
- **Render performance** benchmarks
- **Memory usage** validation
- **Cache effectiveness** measurement

## Implementation Checklist

### Phase 1: Preparation ✅

- [x] Analyze current table CSS structure
- [x] Design new BEM hierarchy
- [x] Plan migration strategy
- [x] Create detailed implementation plan

### Phase 2: CSS Implementation ✅

- [x] Add new BEM classes to CSS
- [x] Consolidate scattered table rules
- [x] Implement responsive BEM structure
- [x] Test new classes in isolation

### Phase 3: HTML Migration ✅

- [x] Update main leaderboard table HTML
- [x] Update test file HTML templates
- [x] Add temporary dual class support
- [x] Validate HTML structure changes

### Phase 4: Testing & Validation

- [ ] Perform visual regression testing
- [ ] Test responsive behavior
- [ ] Validate accessibility compliance
- [ ] Check cross-browser compatibility

### Phase 5: Cleanup

- [ ] Remove old non-BEM classes from CSS
- [ ] Remove old classes from HTML
- [ ] Clean up unused CSS rules
- [ ] Update documentation

---

**Next Action**: Begin Phase 2 - Implement new BEM classes in CSS alongside existing classes.
