# High-Risk Classes Analysis

> **Status**: Active  
> **Last Updated**: 2025-09-13  
> **Project**: adigunners.github.io

## Overview

This document identifies CSS classes that require careful refactoring due to high usage, complex
dependencies, or critical functionality. These classes need extensive testing and gradual migration
strategies.

## Risk Classification

### 🔴 CRITICAL RISK - Immediate Attention Required

#### 1. `.leaderboard-table` Class

**File**: `css/styles.css` (Multiple definitions)  
**Usage**: `index.html:2218` (Main leaderboard)

**Risk Factors**:

- **Core functionality** - Main leaderboard display
- **Multiple CSS definitions** - Scattered across different media queries
- **Complex HTML structure** - Table with multiple utility classes
- **User-facing** - Primary feature of the application

**Current Usage**:

```html
<table
  class="leaderboard-table table-density-compact table-align-rank table-align-player table-align-gw table-align-total table-align-deficit"
></table>
```

**Migration Impact**: HIGH

- Affects main user interface
- Complex table layout dependencies
- Multiple utility class interactions
- Responsive design considerations

**Testing Requirements**:

- ✅ Visual regression testing required
- ✅ Cross-browser compatibility testing
- ✅ Mobile/tablet/desktop responsive testing
- ✅ Accessibility testing (screen readers)
- ✅ Performance impact assessment

---

#### 2. `.table-align-*` Utility Classes

**Files**: `css/styles.css` (Lines 318, 323, 344, 349, 354)  
**Usage**: Applied to main leaderboard table

**Risk Factors**:

- **Specificity conflicts** - Overriding component styles (CRITICAL BUG)
- **Multiple class dependency** - 5 classes applied together
- **Complex selectors** - `td:nth-child()` patterns
- **Production bug** - Currently causing visual alignment issues

**Conflicting Classes**:

```css
/* HIGH SPECIFICITY - PROBLEM */
.table-align-gw td:nth-child(3) {
  text-align: center;
} /* 0-2-1 */
.table-align-total td:nth-child(4) {
  text-align: right;
} /* 0-2-1 */
.table-align-deficit td:nth-child(5) {
  text-align: center;
} /* 0-2-1 */

/* LOW SPECIFICITY - OVERRIDDEN */
.leaderboard-gw {
  text-align: right;
} /* 0-1-0 */
.leaderboard-deficit {
  text-align: right;
} /* 0-1-0 */
```

**Migration Impact**: CRITICAL

- **Phase 2 Priority** - Must be fixed immediately
- Replace with single utility classes (`.u-text-center`, `.u-text-right`)
- Remove complex nth-child selectors
- Test alignment on all columns

---

### 🟡 MEDIUM RISK - Requires Careful Testing

#### 3. `.winner-card` Class

**File**: `css/styles.css` (Multiple definitions including rank variants)  
**Usage**: `index.html` (Dynamic winner cards generation)

**Risk Factors**:

- **Dynamic generation** - Created via JavaScript
- **Multiple modifiers** - `.rank-1`, `.rank-2`, `.rank-3` variants
- **Animation states** - Hover effects and transitions
- **Responsive variations** - Different layouts per device

**Current Structure**:

```css
.winner-card {
}
.winner-card.rank-1 {
} /* Gold styling */
.winner-card.rank-2 {
} /* Silver styling */
.winner-card.rank-3 {
} /* Bronze styling */
```

**Migration Strategy**:

- Convert to BEM: `.winner-card`, `.winner-card--gold`, etc.
- Test JavaScript card generation
- Verify rank highlighting still works
- Check hover animations

---

#### 4. Movement Indicator Classes

**Files**: `css/styles.css` (Lines 2358+)  
**Usage**: Leaderboard rank movement indicators

**Risk Factors**:

- **Visual feedback system** - Critical user experience feature
- **Multiple state classes** - `.movement-up`, `.movement-down`, `.movement-same`, `.movement-new`
- **Color theming** - Uses CSS variables that could conflict
- **Animation timing** - Transition effects for smooth UX

**Current Structure**:

```css
.rank-movement {
}
.movement-up {
  color: #28a745;
} /* Green */
.movement-down {
  color: #dc3545;
} /* Red */
.movement-same {
  color: #6c757d;
} /* Gray */
.movement-new {
  color: #007bff;
} /* Blue */
```

**Migration Strategy**:

- Convert to BEM: `.movement`, `.movement--up`, etc.
- Preserve color consistency
- Test all movement states
- Verify animations work correctly

---

#### 5. Navigation Button Classes

**Files**: `css/styles.css`  
**Usage**: `index.html` (Leaderboard pagination)

**Risk Factors**:

- **Interactive functionality** - Pagination controls
- **State management** - Disabled/active states via JavaScript
- **Accessibility** - ARIA attributes and keyboard navigation
- **Multiple contexts** - Could be used elsewhere in future

**Current Structure**:

```css
.leaderboard-nav-btn {
}
.leaderboard-nav-btn:hover:not(:disabled) {
}
.leaderboard-nav-btn:disabled {
}
```

**Migration Strategy**:

- Convert to generic `.button` component
- Add modifiers for context (`.button--nav`)
- Test JavaScript state changes
- Verify accessibility compliance

---

### 🟢 LOW RISK - Standard Migration

#### 6. Generic Layout Classes

**Examples**: `.container`, `.grid`, `.flex`  
**Risk Level**: Low - Standard utility classes

#### 7. Color/Typography Utilities

**Examples**: Font weights, colors, basic spacing  
**Risk Level**: Low - Simple property changes

---

## Migration Priority Matrix

| Class                  | Risk Level  | User Impact | Technical Complexity | Migration Priority   |
| ---------------------- | ----------- | ----------- | -------------------- | -------------------- |
| `.table-align-*`       | 🔴 Critical | High        | Medium               | **Phase 2 - Week 1** |
| `.leaderboard-table`   | 🔴 Critical | High        | High                 | **Phase 3 - Week 2** |
| `.winner-card`         | 🟡 Medium   | Medium      | Medium               | **Phase 3 - Week 3** |
| `.movement-*`          | 🟡 Medium   | Medium      | Low                  | **Phase 4 - Week 4** |
| `.leaderboard-nav-btn` | 🟡 Medium   | Low         | Low                  | **Phase 4 - Week 4** |

## Testing Strategy by Risk Level

### Critical Risk Classes (🔴)

**Testing Requirements**:

1. **Manual Testing**:
   - Test on real devices (mobile/tablet/desktop)
   - Cross-browser testing (Chrome, Firefox, Safari, Edge)
   - Accessibility testing with screen readers
   - Visual comparison with screenshots

2. **Automated Testing**:
   - Visual regression tests with Playwright/Cypress
   - Unit tests for CSS utility functions
   - Integration tests for table rendering
   - Performance benchmarks

3. **Rollback Preparation**:
   - Feature flags for old/new CSS
   - Database backups before deployment
   - Monitoring and error tracking setup

### Medium Risk Classes (🟡)

**Testing Requirements**:

1. **Component Testing**:
   - Isolated component testing in Storybook/equivalent
   - State change testing (hover, active, disabled)
   - Responsive breakpoint testing

2. **Integration Testing**:
   - Test within full page context
   - JavaScript interaction testing
   - API data integration testing

### Low Risk Classes (🟢)

**Testing Requirements**:

1. **Basic Testing**:
   - Visual spot checks
   - Basic functionality verification
   - Single browser testing acceptable

## Implementation Safeguards

### Code Review Checklist

For each high-risk class migration:

- [ ] ✅ **Before/After Screenshots**: Visual proof of consistency
- [ ] ✅ **Cross-Browser Testing**: Chrome, Firefox, Safari, Edge
- [ ] ✅ **Device Testing**: Mobile (iOS/Android), Tablet, Desktop
- [ ] ✅ **Accessibility Testing**: Screen reader compatibility
- [ ] ✅ **JavaScript Integration**: All interactive features work
- [ ] ✅ **Performance Check**: No regression in load times
- [ ] ✅ **Rollback Plan**: Can revert safely if issues arise

### Monitoring and Validation

**Post-Deployment Monitoring** (First 48 hours):

- Error tracking for CSS-related JavaScript errors
- User feedback monitoring
- Performance metrics comparison
- Mobile usability metrics

**Success Metrics**:

- Zero increase in user-reported issues
- No performance regression (>5% slower)
- All automated tests passing
- Accessibility compliance maintained

## Emergency Procedures

### If Critical Issues Arise

1. **Immediate Rollback**:

   ```bash
   git revert <migration-commit-hash>
   git push origin feature/enhanced-leaderboard-5-column
   ```

2. **Partial Rollback** (Feature Flags):

   ```css
   /* Emergency fallback styles */
   .legacy-mode .table-align-gw td:nth-child(3) {
     text-align: center;
   }
   ```

3. **Communication Plan**:
   - Notify stakeholders immediately
   - Document issue and resolution steps
   - Post-mortem analysis for prevention

### Risk Mitigation Strategies

1. **Gradual Rollout**: Deploy to staging environment first
2. **Progressive Enhancement**: New styles only for capable browsers
3. **Fallback Strategies**: Old CSS as backup until fully tested
4. **User Feedback Loop**: Easy reporting mechanism for issues

---

_This high-risk analysis ensures careful, systematic migration of critical CSS classes._
