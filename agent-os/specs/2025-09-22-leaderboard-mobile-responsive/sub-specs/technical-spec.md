# Technical Specification

This is the technical specification for the spec detailed in
@.agent-os/specs/2025-09-22-leaderboard-mobile-responsive/spec.md

> Created: 2025-09-22 Version: 1.0.0

## Technical Requirements

### Mobile Responsive Design (≤700px)

- Implement CSS-only responsive design using existing BREAKPOINTS constant (≤700px for mobile)
- Rank column (th:first-child, td:first-child) must use flexbox for centering:
  `display: flex; align-items: center; justify-content: center; width: 100%; text-align: center;`
- Minimum row height of 52px: `tr { min-height: 52px; }`
- Rank cell wrapper (.rank-cell) with flexbox gap:
  `display: flex; align-items: center; justify-content: center; gap: 4-6px;`
- Header alignment must mirror body cell styling for first column consistency
- Media query guard: `@media (max-width: 700px)` to protect tablet/desktop layouts

### Tablet Responsive Design (701-1024px)

- Preserve current table layout with slight column gap increases
- Ensure first column width consistency between header and body
- Right-align numeric columns (GW, Total, From #1) with tabular-nums font feature if available
- Maintain existing FPL-style 5-column layout structure

### Desktop Enhancements (≥1025px)

- Right-align all numeric columns; left-align player names
- Fixed minimum column widths to prevent layout jitter during data updates
- Row hover states: subtle background color change for improved readability
- Optional zebra striping with 3% tint for better visual separation
- Monospace tabular-nums font feature for numeric consistency

### Performance Requirements

- Cumulative Layout Shift (CLS) target: <0.01 during leaderboard render
- CSS-only implementation to avoid JavaScript layout thrash
- No horizontal scrolling on any device width ≤700px
- Maintain existing loading performance characteristics

### Accessibility Requirements

- Preserve semantic table structure: `<table>`, `<thead>`, `<th scope="col">`, `<th scope="row">`
- Touch targets minimum 44px height on mobile (iOS HIG compliance)
- Movement icons with `aria-hidden="true"` and descriptive aria-labels on rank cells
- Screen reader support: `aria-label="rank up 2"` format for rank change indicators
- WCAG AA color contrast compliance for all interactive elements

### Browser Compatibility

- Primary testing targets: iOS Safari, Chrome Android
- Test matrix: 360px, 390px, 430px (mobile), 768px (tablet), 1280px (desktop)
- Fallback support for browsers without CSS Grid/Flexbox via progressive enhancement

### BEM Methodology Integration

- Align with ongoing CSS architecture refactoring using BEM naming conventions
- Block: `.leaderboard-table`
- Elements: `.leaderboard-table__row`, `.leaderboard-table__cell`, `.leaderboard-table__rank-cell`
- Modifiers: `.leaderboard-table__cell--rank`, `.leaderboard-table__cell--numeric`

## Approach

### Implementation Approach

- Wrap rank number + movement icon in `.rank-cell` div within existing template
- Duplicate mobile flexbox rules for both `thead th:first-child` and `tbody td:first-child`
- Guard all mobile-specific styles under max-width media query
- Ensure no breaking changes to existing desktop/tablet functionality
- Add hover states and zebra striping as optional progressive enhancements

### CSS Implementation Strategy

1. **Mobile-First Responsive Breakpoints**: Utilize existing BREAKPOINTS constant for consistent
   viewport targeting
2. **Flexbox Layout for Rank Column**: Implement flexbox centering specifically for rank column on
   mobile devices
3. **Progressive Enhancement**: Start with mobile layout, enhance for larger screens
4. **BEM Architecture Integration**: Align new styles with ongoing CSS refactoring using BEM
   methodology

### Template Modifications

- Minimal HTML changes required: wrap rank content in `.rank-cell` container
- Preserve existing data attributes and semantic structure
- Maintain compatibility with existing JavaScript functionality

## External Dependencies

### CSS Framework Dependencies

- Existing BREAKPOINTS constant from current CSS architecture
- Current table styling as baseline for progressive enhancement
- BEM methodology conventions for class naming

### Browser Feature Dependencies

- CSS Flexbox support (universally supported in target browsers)
- CSS Media Queries (universally supported)
- CSS Grid as fallback option for complex layouts
- Font-feature-settings for tabular-nums (progressive enhancement)

### Performance Monitoring

- Core Web Vitals tracking for CLS measurement
- Cross-device testing framework for responsive validation
- Accessibility testing tools for WCAG compliance verification
