# Rank Column Implementation Issues

> Documentation Date: 2025-09-22 Target: Mobile devices ≤700px width

## Primary Issue: Misaligned Rank Cell Content

### Current CSS Problem (styles.css line 6389-6395)

```css
.leaderboard__cell--rank {
  display: flex;
  gap: 3px;
  justify-content: space-between; /* ❌ PROBLEM: spreads content to edges */
  align-items: center;
  padding: 8px 6px;
}
```

### Visual Impact

- **Rank number** pushed to **left edge** of cell
- **Movement icon** pushed to **right edge** of cell
- **Large gap** between rank and icon on narrow screens
- **Inconsistent spacing** as cell width changes

### Expected Behavior

- Rank number and movement icon should be **centered together** as a unit
- Consistent 4-6px gap between number and icon
- Content group should be centered within the cell

## Secondary Issue: Header/Body Alignment Mismatch

### Header CSS (styles.css line 6397-6400)

```css
.leaderboard__header .leaderboard__cell--rank {
  justify-content: center; /* ✅ CORRECT: centers header "#" */
  padding: 10px 6px;
}
```

### Body CSS (same file line 6389)

```css
.leaderboard__cell--rank {
  justify-content: space-between; /* ❌ INCONSISTENT with header */
}
```

### Visual Impact

- Header "#" symbol appears centered
- Body rank numbers appear left-aligned
- Creates visual misalignment between header and data rows

## Tertiary Issue: Missing Semantic Wrapper

### Current HTML Structure (index.html line 2308)

```html
<td class="leaderboard__cell leaderboard__cell--rank">
  <span class="rank-number">${actualRank}</span>
  <span class="rank-movement ${movementClass}">${movementIcon}</span>
</td>
```

### Missing Structure

No wrapper div around rank content to enable proper flexbox control:

```html
<!-- NEEDED: -->
<td class="leaderboard__cell leaderboard__cell--rank">
  <div class="rank-cell">
    <span class="rank-number">${actualRank}</span>
    <span class="rank-movement ${movementClass}">${movementIcon}</span>
  </div>
</td>
```

## Required Fixes

### 1. CSS Fix: Update Flexbox Alignment

```css
/* CHANGE FROM: */
.leaderboard__cell--rank {
  justify-content: space-between;
}

/* CHANGE TO: */
.leaderboard__cell--rank {
  justify-content: center;
}
```

### 2. HTML Fix: Add Rank Cell Wrapper

```html
<!-- ADD wrapper div with .rank-cell class -->
<div class="rank-cell">
  <span class="rank-number">${actualRank}</span>
  <span class="rank-movement ${movementClass}">${movementIcon}</span>
</div>
```

### 3. CSS Addition: Style Rank Cell Wrapper

```css
.rank-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px; /* Consistent gap between rank and icon */
}
```

## Browser Testing Matrix

### Critical Test Cases

1. **Rank 1-3:** Gold/silver/bronze styling preserved
2. **Rank >99:** Two/three digit numbers don't break layout
3. **Missing Movement:** Layout remains centered when no icon present
4. **Long Names:** Ensure rank column width doesn't compress

### Device Width Testing

- **360px:** Minimum Android screen width
- **390px:** iPhone 12/13/14 width
- **430px:** iPhone 12/13/14 Plus width
- **768px:** iPad portrait (tablet boundary)
- **1280px:** Desktop verification (no regression)

## Success Criteria

### Visual Requirements

- ✅ Rank number and movement icon centered as a unit
- ✅ Consistent 4-6px gap between rank and icon
- ✅ Header "#" aligned with body rank numbers
- ✅ No horizontal scrolling on any test width

### Technical Requirements

- ✅ Semantic HTML structure with wrapper div
- ✅ BEM-compliant CSS class naming
- ✅ Mobile-only CSS changes (guarded by @media query)
- ✅ No regression on tablet/desktop layouts
