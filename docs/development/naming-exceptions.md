# Naming Exceptions and Legacy Considerations

> **Status**: Active  
> **Last Updated**: 2025-09-13  
> **Project**: adigunners.github.io

## Overview

This document outlines exceptions to the BEM naming convention and legacy considerations that must
be preserved during the CSS migration process.

## Naming Exceptions

### 1. Third-Party Integration Classes

#### CSS Framework Classes (Preserve As-Is)

```css
/* External library classes - DO NOT CHANGE */
.table-scroll {
} /* From existing component library */
.c-table {
} /* From assets/css/components/table.css */
.c-table--winners {
} /* BEM-style but external component */
.c-table-wrap {
} /* External table wrapper */
.c-chip {
} /* Badge/chip component from library */
```

**Rationale**: These classes are from external components or libraries and changing them would break
functionality.

**Action**: Preserve existing names, document as exceptions in code comments.

---

### 2. JavaScript Hook Classes

#### State Management Classes (Keep Current Pattern)

```css
/* JavaScript state classes - PRESERVE PATTERN */
.is-active {
} /* Standard state pattern */
.is-disabled {
} /* Standard state pattern */
.is-loading {
} /* Standard state pattern */
.is-hidden {
} /* Standard state pattern */
.is-visible {
} /* Standard state pattern */

/* Application-specific states */
.leaderboard.is-loading {
}
.leaderboard.is-error {
}
```

**Rationale**: The `is-` prefix is an established pattern for state classes that JavaScript
manipulates. Changing these would require updating all JavaScript files.

**Action**: Keep `is-` pattern for state classes, document as standard exception.

---

#### Feature Toggle Classes

```css
/* Feature flags - PRESERVE */
.legacy-mode {
} /* For fallback CSS during migration */
.modern-mode {
} /* For new CSS architecture */
.enhanced-json {
} /* For enhanced data features */
```

**Rationale**: These classes control feature behavior and are referenced in JavaScript logic.

---

### 3. Accessibility Classes

#### Screen Reader Classes (Standard Patterns)

```css
/* Accessibility classes - PRESERVE STANDARD NAMES */
.sr-only {
  /* Screen reader only - standard name */
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.skip-link {
} /* Skip navigation link - standard name */
.visually-hidden {
} /* Alternative to sr-only - standard */
```

**Rationale**: These are industry-standard accessibility class names. Changing them would reduce
code readability and break conventions.

---

### 4. CSS Custom Property Exceptions

#### Global Variables (Keep Current Names)

```css
/* CSS variables - PRESERVE CURRENT NAMES */
:root {
  --primary-color: #37003c; /* Keep established naming */
  --secondary-color: #00ff87; /* Keep established naming */
  --spacing-xs: 4px; /* Keep established naming */
  --spacing-sm: 8px; /* Keep established naming */
  --spacing-md: 16px; /* Keep established naming */
  --spacing-lg: 24px; /* Keep established naming */
}
```

**Rationale**: CSS variables are used throughout the codebase. Renaming would require massive
find/replace operations with high error risk.

---

## Legacy Considerations

### 1. Backward Compatibility Requirements

#### During Migration Period

```css
/* TEMPORARY - Legacy support during migration */
.table-align-gw,           /* Legacy class */
.leaderboard__cell--gw {
  /* New BEM class */
  /* Shared styles for transition period */
}

/* Deprecation comments */
.table-align-gw {
  /* 
   * DEPRECATED: Use .u-text-right utility instead
   * TODO: Remove after migration complete (Phase 3)
   * Last used: index.html line 2218
   */
  text-align: right;
}
```

**Strategy**: Support both old and new classes temporarily, with clear deprecation timeline.

---

### 2. Browser Compatibility Exceptions

#### Fallback Patterns

```css
/* Legacy browser support - PRESERVE */
.font-fallback {
  /* Fallback font stack */
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

.poppins-fallback {
  /* Google Fonts fallback */
  font-family: 'Poppins', 'Inter', 'SF Pro Display', sans-serif;
}
```

**Rationale**: These provide fallbacks for older browsers and should be preserved for compatibility.

---

### 3. Performance-Critical Classes

#### Above-the-Fold Styling (Preserve Names)

```css
/* Critical CSS classes - PRESERVE FOR PERFORMANCE */
.site-header {
} /* Above-the-fold header */
.countdown-clock {
} /* Critical countdown component */
.leaderboard-loading {
} /* Loading state for main content */
```

**Rationale**: These classes are likely inlined in critical CSS for performance. Renaming could
break optimization.

---

## Migration-Specific Exceptions

### 1. Temporary Bridging Classes

During migration, some classes will need to exist in both forms:

```css
/* MIGRATION PERIOD ONLY - Remove in Phase 4 */

/* Old naming (deprecated but functional) */
.leaderboard-table {
  /* Styles shared with new naming */
}

/* New BEM naming */
.leaderboard__table {
  /* Inherits from old naming during transition */
}

/* Utility bridge classes */
.table-align-gw,
.u-text-right {
  text-align: right !important;
}
```

**Timeline**: These bridging classes should be removed by end of Phase 4.

---

### 2. Component Library Integration

#### Existing BEM-Like Components

```css
/* From assets/css/components/table.css - PRESERVE */
.c-table {
} /* Already follows BEM-like pattern */
.c-table--winners {
} /* Keep existing modifier */
.c-table__head {
} /* Keep existing element */
.c-table__body {
} /* Keep existing element */
```

**Action**: Keep existing BEM-like components as-is. They already follow good patterns.

---

## Documentation Requirements

### 1. Exception Comments in CSS

All exceptions must be documented with standardized comments:

```css
/* 
 * NAMING EXCEPTION: Third-party component
 * Reason: External library class, cannot be changed
 * Alternative: Use .u-text-center utility for new code
 * Review Date: 2025-12-13
 */
.table-scroll {
  overflow-x: auto;
}

/* 
 * LEGACY SUPPORT: Deprecated class
 * Migration: Use .leaderboard__table instead
 * Remove After: Phase 3 completion (2025-10-13)
 * Last Usage: index.html:2218
 */
.leaderboard-table {
  /* ... */
}
```

### 2. Exception Registry

#### Master List of All Exceptions

| Class Name        | Type            | Reason             | Action         | Review Date |
| ----------------- | --------------- | ------------------ | -------------- | ----------- |
| `.c-table`        | Third-party     | External component | Preserve       | 2025-12-13  |
| `.is-active`      | JavaScript Hook | State management   | Preserve       | N/A         |
| `.sr-only`        | Accessibility   | Industry standard  | Preserve       | N/A         |
| `.table-align-gw` | Legacy          | Migration support  | Remove Phase 3 | 2025-10-13  |
| `.font-fallback`  | Performance     | Browser support    | Preserve       | 2025-12-13  |

---

## Code Review Guidelines

### Exception Approval Process

1. **New Exceptions Must Be Justified**:
   - Document technical reason
   - Provide alternative solution timeline
   - Get team approval before implementing

2. **Regular Exception Review**:
   - Monthly review of temporary exceptions
   - Remove expired legacy support
   - Update documentation as needed

3. **Exception Testing**:
   - All exceptions must have test coverage
   - Document expected behavior
   - Include in regression testing

---

## Future Maintenance

### 1. Exception Lifecycle Management

#### Quarterly Reviews

- Review all exceptions for continued necessity
- Remove expired legacy support classes
- Update documentation and comments
- Plan migration for remaining exceptions

#### Annual Architecture Review

- Assess if exception patterns have become standard
- Update naming conventions if needed
- Plan major cleanup initiatives

### 2. New Developer Onboarding

#### Exception Documentation

New developers should understand:

- Why exceptions exist
- When to use exceptions vs standard patterns
- How to request new exceptions
- Timeline for removing temporary exceptions

#### Training Materials

- Exception cheat sheet for quick reference
- Decision tree for naming new classes
- Migration timeline and current phase status

---

_This document ensures that necessary exceptions are properly managed while maintaining
architectural consistency._
