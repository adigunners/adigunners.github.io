# Mobile Responsiveness Test Plan

> Test Plan Date: 2025-09-22 Target Feature: Leaderboard Mobile Responsiveness Branch:
> feature/leaderboard-mobile-responsive

## Testing Strategy

### Phase 1: Development Testing (Per Milestone)

Each milestone requires visual verification before proceeding to next task.

### Phase 2: Comprehensive Validation

Final testing across all devices and edge cases before merge.

## Device Matrix

### Primary Test Devices

| Device Category      | Width  | Height | Device Examples      |
| -------------------- | ------ | ------ | -------------------- |
| **Mobile Small**     | 360px  | 640px  | Galaxy S8, Pixel 2   |
| **Mobile Standard**  | 390px  | 844px  | iPhone 12/13/14      |
| **Mobile Large**     | 430px  | 932px  | iPhone 12/13/14 Plus |
| **Tablet Portrait**  | 768px  | 1024px | iPad                 |
| **Desktop Standard** | 1280px | 720px  | Standard laptop      |

### Browser Matrix

| Browser            | Mobile      | Tablet | Desktop    |
| ------------------ | ----------- | ------ | ---------- |
| **iOS Safari**     | ✅ Primary  | ✅     | ✅         |
| **Chrome Android** | ✅ Primary  | ✅     | ✅         |
| **Chrome Desktop** | ⚠️ DevTools | ✅     | ✅ Primary |
| **Firefox**        | ⚠️ DevTools | ✅     | ✅         |
| **Edge**           | ⚠️ DevTools | ✅     | ✅         |

## Test Cases by Milestone

### Milestone 1: Mobile Rank Column Alignment (Task 2)

#### Test Case 2.1: Rank Column Centering

**Objective:** Verify rank number and movement icon are centered together **Test Steps:**

1. Load leaderboard on 360px, 390px, 430px widths
2. Verify rank column content is centered as a unit
3. Measure gap between rank number and movement icon (should be 4-6px)
4. Check header "#" alignment matches body rank alignment

**Success Criteria:**

- ✅ Rank content centered in cell
- ✅ Consistent 4-6px gap between number and icon
- ✅ Header/body alignment match
- ❌ No content pushed to cell edges

#### Test Case 2.2: Edge Cases

**Test Scenarios:**

- Rank 1-3 with gold/silver/bronze styling
- Ranks >99 (three-digit numbers)
- Players with no movement (missing icon)
- After sorting/pagination changes

**Success Criteria:**

- ✅ All rank ranges display correctly
- ✅ Layout stable with/without movement icons
- ✅ No horizontal scrolling on any width ≤700px

### Milestone 2: Touch Target Optimization (Task 3)

#### Test Case 3.1: Touch Target Accessibility

**Objective:** Ensure adequate touch targets on mobile **Test Steps:**

1. Load leaderboard on iOS Safari and Chrome Android
2. Measure row heights on 360px-430px widths
3. Test tap accuracy on each row
4. Verify no accidental taps on adjacent rows

**Success Criteria:**

- ✅ Minimum 52px row height on mobile
- ✅ All touch targets ≥44px (iOS HIG compliance)
- ✅ Clean tap boundaries between rows
- ✅ No horizontal scroll required for interaction

#### Test Case 3.2: Accessibility Tools

**Test Tools:**

- VoiceOver (iOS): Screen reader navigation
- TalkBack (Android): Touch exploration
- Chrome DevTools: Lighthouse accessibility audit

**Success Criteria:**

- ✅ Proper table semantics maintained
- ✅ Movement indicators announced correctly
- ✅ Keyboard navigation functional

### Milestone 3: Tablet/Desktop Polish (Task 4)

#### Test Case 4.1: Tablet Experience (701-1024px)

**Test Widths:** 768px, 900px, 1024px **Objective:** Enhanced readability without mobile constraints

**Test Steps:**

1. Verify increased column spacing
2. Test hover states on rows
3. Check numeric column right-alignment
4. Validate tabular-nums font rendering

**Success Criteria:**

- ✅ Improved visual hierarchy
- ✅ Hover feedback functional
- ✅ Numeric alignment consistent
- ✅ No regression from current design

#### Test Case 4.2: Desktop Experience (≥1025px)

**Test Widths:** 1280px, 1440px, 1920px **Objective:** Professional FPL-style presentation

**Test Steps:**

1. Test zebra striping (if implemented)
2. Verify column width consistency
3. Test hover state performance
4. Check layout stability during data updates

**Success Criteria:**

- ✅ Enhanced visual polish
- ✅ Stable column widths
- ✅ Smooth hover transitions
- ✅ No layout jitter during updates

## Performance Testing

### Cumulative Layout Shift (CLS) Measurement

**Target:** CLS < 0.01 during leaderboard render

**Test Procedure:**

1. Use Chrome DevTools Performance tab
2. Measure CLS during initial page load
3. Measure CLS during pagination/sorting
4. Test with slow network conditions

**Monitoring Points:**

- Initial table render
- Data update/refresh
- Page size changes
- Sort order changes

### Loading Performance

**Metrics to Track:**

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)

## Edge Case Testing

### Content Stress Tests

1. **Very Long Player Names:** 50+ character names with special characters
2. **Extreme Scores:** 5-6 digit point totals
3. **Large Deficits:** 3-4 digit point differences
4. **Empty States:** No data or loading states

### Network Conditions

1. **Slow 3G:** Test responsiveness during slow loads
2. **Offline:** Ensure graceful degradation
3. **Intermittent:** Test during connection drops

### Orientation Changes

1. **Portrait to Landscape:** Test layout stability
2. **Dynamic Viewport:** Test on iOS Safari with changing viewport height

## Automated Testing Integration

### Visual Regression Testing

**Tool:** Screenshot comparison across test matrix **Trigger:** Each milestone commit **Coverage:**
All 5 primary device widths

### Lighthouse CI

**Metrics:** Performance, Accessibility, Best Practices **Threshold:** All scores ≥90
**Mobile/Desktop:** Separate test runs

## Sign-off Criteria

### Per-Milestone Sign-off

Each milestone requires:

1. ✅ All test cases passing
2. ✅ Visual verification on primary devices
3. ✅ No regressions in existing functionality
4. ✅ Performance metrics within targets
5. ✅ User approval before proceeding

### Final Release Sign-off

Before merge to main:

1. ✅ Complete device matrix testing
2. ✅ Accessibility audit passes
3. ✅ Performance benchmarks met
4. ✅ Visual regression tests pass
5. ✅ Code review approval
6. ✅ Product manager approval

## Testing Tools

### Browser DevTools

- **Chrome DevTools:** Primary development tool
- **Safari Web Inspector:** iOS-specific testing
- **Firefox Developer Tools:** Cross-browser validation

### Mobile Testing

- **BrowserStack:** Real device testing
- **Chrome DevTools Device Mode:** Quick iteration
- **Local Devices:** iOS/Android physical testing

### Accessibility Testing

- **axe DevTools:** Automated accessibility scanning
- **WAVE:** Web accessibility evaluation
- **Screen Readers:** VoiceOver, NVDA, JAWS testing
