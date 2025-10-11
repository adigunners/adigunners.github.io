# Leaderboard Mobile Responsiveness Analysis

> Analysis Date: 2025-09-22 Branch: feature/leaderboard-mobile-responsive

## Current Implementation Overview

### HTML Structure

The leaderboard is implemented in `index.html` with the following structure:

- Container: `#leaderboard-container`
- Table wrapper: `.table-scroll`
- Table: `.leaderboard` > `.leaderboard__table leaderboard__table--compact`
- Columns defined by `<colgroup>` with BEM classes: `.leaderboard__col--rank`,
  `.leaderboard__col--player`, etc.
- 5-column layout: Rank (#), Player, GW, Total, From #1

### Current Breakpoint System

**Identified Breakpoints in CSS:**

- `700px` - Major mobile/tablet boundary (most relevant for this fix)
- `768px` - Traditional tablet boundary
- `1024px` - Desktop boundary
- `600px` - Small mobile
- `480px` - Ultra-compact mobile
- `375px` - Very small mobile

**Current Mobile Styles (@media max-width: 700px):**

- Font size: 0.82rem
- Row heights: not standardized (varies by breakpoint)
- Cell padding: 8px 6px
- Rank column: 15% width, flexbox with `justify-content: space-between`

### Current Rank Column Issues

#### Problem 1: Misaligned Rank Cell Content

- **Current CSS (line 6389-6395):**

  ```css
  .leaderboard__cell--rank {
    display: flex;
    gap: 3px;
    justify-content: space-between; /* ISSUE: pushes content to edges */
    align-items: center;
    padding: 8px 6px;
  }
  ```

- **Issue:** `justify-content: space-between` spreads rank number and movement icon to opposite
  edges instead of centering them together

#### Problem 2: Header/Body Alignment Mismatch

- **Header CSS (line 6397-6400):**

  ```css
  .leaderboard__header .leaderboard__cell--rank {
    justify-content: center; /* Centers header content */
    padding: 10px 6px;
  }
  ```

- **Issue:** Header uses `center` while body uses `space-between`, creating visual misalignment

#### Problem 3: Inconsistent Row Heights

- Multiple conflicting row height rules across different breakpoints
- No minimum touch target height enforced consistently
- Current heights range from 44px to 56px depending on media query

### BEM Class Structure Analysis

**Current BEM Implementation:**

- Block: `.leaderboard__table`
- Elements: `.leaderboard__cell`, `.leaderboard__header`, `.leaderboard__row`
- Modifiers: `--rank`, `--player`, `--gw`, `--total`, `--deficit`, `--compact`

**Missing BEM Classes for Rank Cell Content:**

- Need: `.rank-cell` wrapper for rank number + movement icon
- Current: Direct content in `.leaderboard__cell--rank` without semantic wrapper

## Media Query Audit

### Current Mobile Query (@media max-width: 700px)

- **Lines 6339-6404:** Main mobile responsive rules
- **Font sizes:** Headers 0.7rem, cells 0.82rem, numeric 0.76rem
- **Column widths:** Rank 15%, Player 38%, Others 15.67% each
- **Gaps/Padding:** 3px gap, 8px 6px padding

### Tablet Queries

- **768px-1024px:** Intermediate sizing
- **701px-900px:** Secondary mobile-to-tablet transition

### Desktop Queries

- **1024px+:** Full desktop experience with hover states

## Technical Requirements Summary

### Immediate Fixes Needed

1. **Rank Column Alignment:** Change `justify-content: space-between` to `center`
2. **Header Consistency:** Ensure header and body rank cells use identical alignment
3. **Touch Targets:** Implement consistent 52px minimum row height on mobile
4. **Rank Cell Wrapper:** Add `.rank-cell` semantic wrapper for flexbox content

### Performance Considerations

- **CLS Risk:** Multiple conflicting height rules could cause layout shift
- **Horizontal Scroll:** Current 15% rank width may be insufficient on narrow screens
- **Font Loading:** Tabular-nums feature needs fallback for older browsers

### Browser Compatibility

- **CSS Grid/Flexbox:** Well supported, safe to use
- **font-variant-numeric:** Good support, needs fallback
- **Container Queries:** Not used, relying on media queries (correct approach)

## Next Steps for Implementation

### Task 2 Preparation

1. **Primary Fix:** Update rank cell flexbox from `space-between` to `center`
2. **Wrapper Addition:** Implement `.rank-cell` div in HTML template (line 2308 in index.html)
3. **Media Query Guard:** Ensure mobile-only changes with `@media (max-width: 700px)`
4. **Header Alignment:** Sync header cell styles with body cells

### Testing Requirements

- **Device Matrix:** 360px, 390px, 430px, 768px, 1280px
- **Key Interactions:** Touch targets, horizontal scroll, header alignment
- **Performance:** CLS measurement before/after changes
