# CSS Style Guide

> **Status**: ✅ Complete  
> **Version**: 1.0.0  
> **Date**: 2025-09-13  
> **Project**: adigunners.github.io

This guide establishes the CSS architecture, naming conventions, and best practices for the
adigunners Fantasy Premier League (FPL) website following the comprehensive CSS audit and
refactoring project.

## Table of Contents

1. [CSS Architecture Overview](#css-architecture-overview)
2. [Naming Conventions](#naming-conventions)
3. [BEM Methodology](#bem-methodology)
4. [CSS Cascade Layers](#css-cascade-layers)
5. [Utility Classes](#utility-classes)
6. [Component Structure](#component-structure)
7. [Responsive Design](#responsive-design)
8. [Code Organization](#code-organization)
9. [Best Practices](#best-practices)
10. [Code Review Checklist](#code-review-checklist)
11. [Implementation Results](#implementation-results)
12. [Lessons Learned](#lessons-learned)

## CSS Architecture Overview

Our CSS architecture is built on four foundational principles:

### 1. **Systematic Layer-Based Cascade**

```css
@layer base, components, utilities, overrides;
```

### 2. **BEM Component Methodology**

- Block: Independent, reusable components
- Element: Parts of blocks that have no standalone meaning
- Modifier: Flags that change appearance or behavior

### 3. **Utility-First Approach**

- Prefixed utility classes (`.u-*`) for common styling patterns
- No `!important` declarations needed due to layer-based specificity

### 4. **Mobile-First Responsive Design**

- Base styles target mobile devices
- Progressive enhancement for larger screens
- Consistent breakpoint system

## Naming Conventions

### Component Classes (BEM)

#### Block Naming

```css
/* ✅ Good */
.leaderboard {
}
.winner {
}
.navigation {
}
.stats {
}

/* ❌ Avoid */
.leaderboard-table {
} /* Use BEM elements instead */
.winner_card {
} /* Use double underscores */
```

#### Element Naming

```css
/* ✅ Good */
.leaderboard__table {
}
.leaderboard__header {
}
.leaderboard__cell {
}
.winner__card {
}
.winner__rank {
}

/* ❌ Avoid */
.leaderboard-table {
} /* Missing BEM structure */
.leaderboard_header {
} /* Wrong separator */
```

#### Modifier Naming

```css
/* ✅ Good */
.leaderboard__table--compact {
}
.winner__card--rank-1 {
}
.stats__box--primary {
}

/* ❌ Avoid */
.leaderboard__table-compact {
} /* Missing double dashes */
.winner__card_rank1 {
} /* Wrong separator */
```

### Utility Classes

#### Prefix Convention

All utility classes use the `.u-` prefix:

```css
/* ✅ Good */
.u-text-center {
}
.u-flex {
}
.u-hidden {
}
.u-margin-lg {
}

/* ❌ Avoid */
.text-center {
} /* No prefix */
.flex {
} /* Too generic */
.hidden {
} /* Conflicts possible */
```

#### Responsive Utilities

```css
/* ✅ Good */
.u-md-text-center {
} /* Medium screens and up */
.u-lg-flex {
} /* Large screens and up */

/* ❌ Avoid */
.u-text-center-md {
} /* Wrong order */
.u-medium-flex {
} /* Verbose */
```

### State Classes

#### Standard State Patterns

```css
/* ✅ Good */
.is-hidden {
}
.is-loading {
}
.has-error {
}

/* ❌ Avoid */
.hidden {
} /* Too generic */
.loading {
} /* No semantic prefix */
```

## BEM Methodology

### Component Structure

Each major component follows this BEM pattern:

```css
/* BLOCK: Main component container */
.component {
  /* Base component styles */
}

/* ELEMENT: Parts of the component */
.component__element {
  /* Element-specific styles */
}

/* MODIFIER: Variations of blocks or elements */
.component--modifier {
  /* Modifier styles for blocks */
}

.component__element--modifier {
  /* Modifier styles for elements */
}
```

### Real Examples

#### Leaderboard Component

```css
/* BLOCK */
.leaderboard {
  position: relative;
}

/* ELEMENTS */
.leaderboard__table {
  width: 100%;
  border-collapse: collapse;
}

.leaderboard__header {
  background: linear-gradient(135deg, var(--primary-color), var(--heading-color));
}

.leaderboard__cell {
  padding: var(--spacing-sm) var(--spacing-md);
}

/* MODIFIERS */
.leaderboard__table--compact {
  font-size: 0.85rem;
}

.leaderboard__cell--rank {
  font-weight: 600;
  min-width: 3ch;
}
```

#### Winner Component

```css
/* BLOCK */
.winner {
  display: flex;
  flex-direction: column;
}

/* ELEMENTS */
.winner__card {
  background: #fff;
  border-radius: var(--radius-lg);
}

.winner__rank {
  font-size: 1.2rem;
  font-weight: 700;
}

/* MODIFIERS */
.winner__card--rank-1 {
  background: linear-gradient(145deg, #fff9e6, #ffecb3);
  border: 2px solid #f57c00;
}
```

### BEM Guidelines

1. **One Block Per Component**: Each major UI component should have its own block
2. **Elements Are Optional**: Simple components might only need the block
3. **Modifiers Change Appearance**: Use modifiers for variations, not new functionality
4. **Avoid Deep Nesting**: Keep BEM structure flat (max 1 element level)

```css
/* ✅ Good */
.card__header {
}
.card__title {
}
.card__content {
}

/* ❌ Avoid */
.card__header__title {
} /* Too deep */
```

## CSS Cascade Layers

### Layer Hierarchy

Our CSS uses a systematic layer approach to control specificity:

```css
@layer base, components, utilities, overrides;
```

#### 1. Base Layer

```css
@layer base {
  /* Reset, normalize, base element styles */
  * {
    box-sizing: border-box;
  }

  body {
    font-family: var(--font-family-primary);
  }
}
```

#### 2. Components Layer

```css
@layer components {
  /* All BEM component styles */
  .leaderboard__table {
    width: 100%;
  }

  .winner__card {
    background: #fff;
  }
}
```

#### 3. Utilities Layer

```css
@layer utilities {
  /* All utility classes */
  .u-text-center {
    text-align: center;
  }

  .u-flex {
    display: flex;
  }
}
```

#### 4. Overrides Layer

```css
@layer overrides {
  /* Emergency overrides only */
  .force-hidden {
    display: none !important;
  }
}
```

### Layer Benefits

1. **Predictable Cascade**: Utilities always override components
2. **No !important Needed**: Layer order controls specificity
3. **Better Performance**: Reduces specificity wars
4. **Maintainable**: Clear separation of concerns

## Utility Classes

### Text Utilities

```css
/* Alignment */
.u-text-left     /* text-align: left */
.u-text-center   /* text-align: center */
.u-text-right    /* text-align: right */
.u-text-justify  /* text-align: justify */

/* Weight */
.u-font-light    /* font-weight: 300 */
.u-font-normal   /* font-weight: 400 */
.u-font-medium   /* font-weight: 500 */
.u-font-semibold /* font-weight: 600 */
.u-font-bold     /* font-weight: 700 */
.u-font-black    /* font-weight: 900 */
```

### Display Utilities

```css
.u-block        /* display: block */
.u-inline       /* display: inline */
.u-inline-block /* display: inline-block */
.u-flex         /* display: flex */
.u-inline-flex  /* display: inline-flex */
.u-grid         /* display: grid */
.u-hidden       /* display: none */
```

### Flexbox Utilities

```css
/* Direction */
.u-flex-row     /* flex-direction: row */
.u-flex-col     /* flex-direction: column */

/* Justify Content */
.u-justify-start   /* justify-content: flex-start */
.u-justify-center  /* justify-content: center */
.u-justify-end     /* justify-content: flex-end */
.u-justify-between /* justify-content: space-between */

/* Align Items */
.u-items-start   /* align-items: flex-start */
.u-items-center  /* align-items: center */
.u-items-end     /* align-items: flex-end */
.u-items-stretch /* align-items: stretch */
```

### Spacing Utilities

```css
/* Margin - All Sides */
.u-margin-xs  /* margin: 4px */
.u-margin-sm  /* margin: 8px */
.u-margin-md  /* margin: 16px */
.u-margin-lg  /* margin: 24px */
.u-margin-xl  /* margin: 32px */

/* Margin - Directional */
.u-margin-top-sm    /* margin-top: 8px */
.u-margin-right-md  /* margin-right: 16px */
.u-margin-bottom-lg /* margin-bottom: 24px */
.u-margin-left-xl   /* margin-left: 32px */

/* Margin - Axis */
.u-margin-x-auto /* margin-left: auto; margin-right: auto */
.u-margin-y-0    /* margin-top: 0; margin-bottom: 0 */

/* Padding follows same pattern */
.u-padding-xs  /* padding: 4px */
.u-padding-sm  /* padding: 8px */
/* etc... */
```

### Project-Specific Utilities

```css
/* Leaderboard Ranks */
.u-rank-gold   /* color: var(--gold-1) */
.u-rank-silver /* color: var(--silver-1) */
.u-rank-bronze /* color: var(--bronze-1) */

/* Movement Indicators */
.u-movement-up   /* color: var(--movement-up-color) */
.u-movement-down /* color: var(--movement-down-color) */
.u-movement-same /* color: var(--movement-same-color) */
.u-movement-new  /* color: var(--movement-new-color) */

/* Typography */
.u-tabular-nums /* font-variant-numeric: tabular-nums */
```

## Component Structure

### Component Organization

Each major component follows this structure:

```css
/* ==========================================================================
   COMPONENT NAME - BEM Structure
   ========================================================================== */

@layer components {
  /* BLOCK: Main component */
  .component {
    /* Base component styles */
  }

  /* ELEMENT: Component parts */
  .component__element {
    /* Element styles */
  }

  /* MODIFIER: Variations */
  .component--modifier {
    /* Modifier styles */
  }

  .component__element--modifier {
    /* Element modifier styles */
  }
}

/* ==========================================================================
   COMPONENT RESPONSIVE STYLES
   ========================================================================== */

/* Mobile styles */
@media (max-width: 768px) {
  .component__element {
    /* Mobile-specific adjustments */
  }
}

/* Tablet styles */
@media (min-width: 768.01px) and (max-width: 1024px) {
  .component__element {
    /* Tablet-specific adjustments */
  }
}

/* Desktop styles */
@media (min-width: 1024.01px) {
  .component__element {
    /* Desktop-specific styles */
  }
}
```

### Current Components

1. **Leaderboard** (`.leaderboard__*`)
   - Table display with enhanced 5-column layout
   - Rank highlighting, movement indicators
   - Mobile-responsive design

2. **Winner** (`.winner__*`)
   - Prize card display
   - Rank-specific styling (gold, silver, bronze)
   - Hover states and animations

3. **Navigation** (`.nav__*`)
   - Leaderboard pagination controls
   - Button states and responsive behavior

4. **Stats** (`.stats__*`)
   - Statistical data boxes
   - Icon integration and grid layouts

5. **Section** (`.section__*`)
   - Content section containers
   - Heading systems and card layouts

## Responsive Design

### Breakpoint System

**Standard Breakpoint Tokens** (Updated 2025-10-04):

```css
/* Mobile First Approach - Standard Breakpoints Only */

/* Base: Mobile (up to 480px) */
.component {
}

/* Small screens and up (480px+) */
@media (min-width: 480px) {
  .u-sm-* {
  }
}

/* Medium screens and up (768px+) - Tablets */
@media (min-width: 768px) {
  .u-md-* {
  }
}

/* Large screens and up (1024px+) - Desktop */
@media (min-width: 1024px) {
  .u-lg-* {
  }
}

/* Extra large screens (1200px+) */
@media (min-width: 1200px) {
  .u-xl-* {
  }
}

/* Ultra-wide screens (1440px+) */
@media (min-width: 1440px) {
  .u-2xl-* {
  }
}
```

**JavaScript Constants** (`js/state-module.js`):

```javascript
export const BREAKPOINTS = {
  XS: 375, // Extra small (reference only)
  SM: 480, // Small
  MD: 768, // Medium (tablets)
  LG: 1024, // Large (desktop)
  XL: 1200, // Extra large
  XXL: 1440, // Ultra-wide
};
```

**Important Rules**:

- ❌ No fractional breakpoints (.01px) - Use exact standard values
- ✅ Mobile-first only - Use `min-width` queries exclusively
- ✅ Standard tokens only - 480px, 768px, 1024px, 1200px, 1440px
- ✅ Consistent with JavaScript constants

### Responsive Patterns

#### Mobile-First Components

```css
/* Base mobile styles */
.component__element {
  padding: var(--spacing-sm);
  font-size: 0.9rem;
}

/* Enhanced for larger screens */
@media (min-width: 768px) {
  .component__element {
    padding: var(--spacing-md);
    font-size: 1rem;
  }
}
```

#### Container Queries (Future)

```css
/* Prepared for container query support */
.component {
  container-type: inline-size;
}

@container (min-width: 300px) {
  .component__element {
    /* Container-based responsive styles */
  }
}
```

## Code Organization

### File Structure

```
css/
├── styles.css              # Main compiled stylesheet
├── styles.css.backup       # Backup during refactoring
└── fallbacks.css           # Browser fallbacks

docs/development/
├── css-style-guide.md      # This document
├── bem-implementation.md   # BEM-specific guidelines
├── utility-class-system.md # Utility documentation
└── css-architecture.md     # Architecture overview
```

### CSS Section Order

```css
/* 1. CSS Variables */
:root {
}

/* 2. Fonts */
@font-face {
}

/* 3. Reset & Base */
@layer base {
}

/* 4. Container & Layout */
.container {
}

/* 5. Utilities */
@layer utilities {
}

/* 6. Components */
@layer components {
}

/* 7. Responsive Overrides */
@media {
}
```

## Best Practices

### General Guidelines

1. **Use CSS Layers**: Wrap all new styles in appropriate layers
2. **Avoid !important**: Layer hierarchy should eliminate the need
3. **Follow BEM**: Use consistent Block\_\_Element--Modifier naming
4. **Mobile First**: Base styles for mobile, enhance for larger screens
5. **Use Utilities**: Prefer utility classes for common patterns

### Performance Optimization

```css
/* ✅ Good: Efficient selectors */
.leaderboard__cell {
  padding: var(--spacing-sm);
}

.u-text-center {
  text-align: center;
}

/* ❌ Avoid: High specificity */
.leaderboard table tr td:nth-child(1) {
  padding: var(--spacing-sm);
}

#content .section .card .title {
  text-align: center;
}
```

### CSS Custom Properties

```css
/* ✅ Good: Semantic naming */
:root {
  --primary-color: #37003c;
  --spacing-md: 16px;
  --radius-lg: 12px;
}

.component {
  color: var(--primary-color);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
}

/* ❌ Avoid: Generic naming */
:root {
  --color1: #37003c;
  --size2: 16px;
}
```

### Accessibility Considerations

```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  .component {
    transition: none;
    transform: none;
    animation: none;
  }
}

/* Ensure sufficient contrast */
.component {
  background: var(--background-color);
  color: var(--text-color);
}

/* Support high contrast mode */
@media (prefers-contrast: high) {
  .component {
    border: 2px solid;
  }
}
```

### Code Comments

```css
/* ==========================================================================
   COMPONENT NAME - Brief Description
   ========================================================================== */

/* BLOCK: Component purpose */
.component {
  /* Property explanation when non-obvious */
}

/* ELEMENT: Element purpose */
.component__element {
  /* Key property explanations */
}

/* MODIFIER: Modifier purpose */
.component--modifier {
  /* Why this variation exists */
}
```

## Implementation Results

### Refactoring Success Metrics

The CSS architecture refactoring (September 2025) achieved the following measurable improvements:

#### BEM Implementation

- **142 BEM Classes**: Implemented across 5 major components
  - Leaderboard: 33 classes (`.leaderboard__table`, `.leaderboard__cell--rank`)
  - Winner: 28 classes (`.winner__card--rank-1`, `.winner__prize`)
  - Navigation: 17 classes (`.nav__button`, `.nav__page-info`)
  - Stats: 30 classes (`.stats__box--primary`, `.stats__summary-card`)
  - Section: 34 classes (`.section__card--season`, `.section__emoji`)

#### Specificity Management

- **48+ !important Removals**: Reduced from 170+ to 122 instances (28% reduction)
- **CSS Layers**: 7 layer implementations providing systematic cascade control
- **Utility Classes**: 114 standardized classes with `.u-` prefix convention

#### Performance Impact

- **Bundle Size**: 125.8KB raw, 22KB gzipped (82% compression ratio)
- **Selector Count**: 1,048 total selectors with good complexity ratio
- **Performance Score**: 85/100 estimated render performance

#### Quality Assurance Results

- **Zero Visual Regressions**: Confirmed across all components and breakpoints
- **97 Media Queries**: Complete responsive coverage from 360px to 1440px+
- **Accessibility Maintained**: 22 focus styles, reduced motion support
- **Cross-Browser Compatible**: Chrome 88+, Firefox 97+, Safari 15.4+

### Documentation Deliverables

The refactoring project produced comprehensive documentation:

1. **CSS Style Guide** (760+ lines): Architecture principles and conventions
2. **BEM Implementation Guide** (930+ lines): Complete component documentation
3. **Utility Class Reference** (780+ lines): Systematic utility documentation
4. **CSS Testing Checklist** (308 items): Comprehensive validation procedures
5. **Rollback Plan**: Complete emergency response strategy

## Lessons Learned

### Technical Insights

#### BEM Methodology Implementation

- **Dual Class Strategy**: Maintaining backward compatibility during transition was crucial
- **Component Boundaries**: Clear component definitions prevented BEM naming conflicts
- **Modifier Scope**: Specific modifiers (e.g., `--rank-1`) more maintainable than generic ones

#### CSS Layers Adoption

- **Layer Hierarchy**: `@layer base, components, utilities, overrides` structure eliminated
  specificity wars
- **Browser Support**: CSS Layers require modern browsers but provide excellent specificity control
- **Migration Strategy**: Gradual layer adoption allowed testing without breaking changes

#### Utility Class System

- **Prefix Convention**: `.u-` prefix clearly identifies utility classes
- **Responsive Utilities**: Breakpoint-specific utilities needed careful planning
- **Utility vs Component**: Clear boundaries prevent utility class overuse

### Process Improvements

#### Testing Strategy

- **Visual Regression Prevention**: Comprehensive before/after validation crucial
- **Automated Validation**: Python scripts for systematic CSS analysis effective
- **Cross-Browser Testing**: Early browser compatibility checks saved time

#### Documentation Approach

- **Living Documentation**: Documentation updated during implementation, not after
- **Practical Examples**: Code examples in documentation more valuable than theory
- **Migration Guides**: Step-by-step transformation examples essential for team adoption

#### Project Management

- **Phase-by-Phase Approach**: Breaking refactoring into phases enabled incremental validation
- **Task Tracking**: Detailed task documentation crucial for large refactoring projects
- **Stakeholder Communication**: Regular progress updates maintained project confidence

### Recommendations for Future Projects

#### Architecture Decisions

1. **Start with CSS Layers**: Begin new projects with layer-based architecture
2. **BEM from Day One**: Implement BEM methodology from project inception
3. **Utility-First Consideration**: Evaluate utility-first frameworks for new projects
4. **Component Boundaries**: Establish clear component ownership early

#### Implementation Strategy

1. **Gradual Migration**: Phased approach reduces risk and enables validation
2. **Backward Compatibility**: Dual class strategy during transitions
3. **Documentation-Driven**: Write documentation during implementation
4. **Automated Testing**: Invest in automated visual regression testing

#### Team Practices

1. **Code Review Focus**: Establish CSS-specific review criteria
2. **Performance Monitoring**: Regular performance audits catch regressions early
3. **Browser Testing**: Systematic cross-browser validation processes
4. **Emergency Planning**: Prepare rollback procedures before deployment

### Challenges Overcome

#### Technical Challenges

- **Specificity Conflicts**: Resolved through systematic CSS layer implementation
- **Legacy Code Integration**: Dual class strategy maintained backward compatibility
- **Performance Optimization**: Balanced architectural improvements with bundle size
- **Browser Compatibility**: Modern CSS features with graceful degradation

#### Process Challenges

- **Scope Management**: Large refactoring broken into manageable phases
- **Quality Assurance**: Comprehensive testing strategy prevented regressions
- **Documentation Overhead**: Systematic documentation approach manageable
- **Change Management**: Gradual implementation reduced disruption

### Future Maintenance Guidelines

#### Ongoing Responsibilities

1. **Performance Monitoring**: Regular Core Web Vitals auditing
2. **Browser Testing**: Quarterly cross-browser compatibility checks
3. **Code Quality**: Monthly CSS architecture compliance reviews
4. **Documentation Updates**: Keep guides current with implementation changes

#### Evolution Strategy

1. **Modern CSS Adoption**: Evaluate new CSS features for architectural improvements
2. **Framework Evaluation**: Consider modern CSS frameworks for future projects
3. **Tooling Enhancement**: Invest in automated CSS analysis and testing tools
4. **Team Training**: Regular CSS architecture and best practices workshops

---

**Last Updated**: September 2025  
**Next Review**: October 2025 or after major CSS changes

## Code Review Checklist

### Naming Conventions

- [ ] BEM naming used for components (Block\_\_Element--Modifier)
- [ ] Utility classes use `.u-` prefix
- [ ] State classes use semantic prefixes (`.is-`, `.has-`)
- [ ] Names are descriptive and follow established patterns

### CSS Architecture

- [ ] Styles wrapped in appropriate CSS layers
- [ ] No unnecessary `!important` declarations
- [ ] Proper cascade hierarchy maintained
- [ ] Component styles don't leak outside their scope

### Performance

- [ ] Efficient selectors used (avoid deep nesting)
- [ ] CSS custom properties used for repeated values
- [ ] No redundant or duplicate styles
- [ ] Minimal specificity conflicts

### Responsive Design

- [ ] Mobile-first approach followed
- [ ] Consistent breakpoint system used
- [ ] Responsive utility classes where appropriate
- [ ] Proper container and spacing at all breakpoints

### Accessibility

- [ ] Sufficient color contrast maintained
- [ ] Motion preferences respected
- [ ] Focus states clearly defined
- [ ] Screen reader considerations addressed

### Documentation

- [ ] Clear section headers and comments
- [ ] Component purpose documented
- [ ] Complex styles explained
- [ ] Related files and dependencies noted

### Testing

- [ ] Visual regression testing completed
- [ ] Cross-browser compatibility verified
- [ ] Responsive behavior tested
- [ ] Accessibility features validated

---

## Migration Notes

This style guide was created following a comprehensive CSS audit and refactoring project that:

- Implemented BEM methodology across 5 major components
- Reduced `!important` usage by 29% (170+ → 122 instances)
- Established CSS layer-based architecture
- Consolidated 66+ duplicate utility classes
- Created systematic naming conventions

For detailed migration information, see [CSS Migration Guide](css-migration-guide.md).

---

**Last Updated**: 2025-09-13  
**Version**: 1.0.0  
**Maintained By**: Development Team
