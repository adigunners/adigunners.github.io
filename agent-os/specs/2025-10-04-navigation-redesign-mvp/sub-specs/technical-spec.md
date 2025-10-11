# Technical Specification

This is the technical specification for the spec detailed in
@.agent-os/specs/2025-10-04-navigation-redesign-mvp/spec.md

## Technical Requirements

### Navigation System

- **Config-Driven Nav**: Create `assets/nav.json` or inline JS array defining tab structure:
  `{ id, label, href, count?, icon? }[]`. Feed both ribbon and hamburger from same source.
- **Ribbon Component**: Horizontal scrollable `<nav>` with CSS `overflow-x: auto`,
  `-webkit-overflow-scrolling: touch`, edge gradients via `::before`/`::after` pseudo-elements with
  `linear-gradient`, left/right arrow buttons (hidden on desktop).
- **Active State**: Set `aria-current="page"` on active `<a>`, match via `window.location.pathname`,
  apply CSS underline + bold weight.
- **Keyboard Nav**: Arrow keys scroll the ribbon container
  (`scrollBy({ left: ±120, behavior: 'smooth' })`), Tab key navigates links naturally.
- **Responsive Behavior**: Desktop shows all tabs inline; mobile shows 3-4 visible with scroll, edge
  fade hints at more content.

### Page Structure

- **Common Layout**: All pages use same `<header>` (logo + ribbon + hamburger), `<main>`, `<footer>`
  structure; extract shared HTML into template comments or JS include pattern.
- **Lazy Data Loading**: Each page fetches only its required data (e.g., `winners.html` fetches
  winners.json, not full leaderboard).
- **URL Params**: Parse `?view=month&search=John` to persist filter state; use `URLSearchParams`
  API, update on filter change without page reload (client-side re-render).

### Component Library

- **Chip Component** (`.c-chip`): `<span class="c-chip c-chip--gw">GW7</span>` with variants:
  `--gw`, `--gm`, `--season`, `--rank`.
- **Filter Chip** (`.c-filter-chip`):
  `<button class="c-filter-chip c-filter-chip--active">Season</button>` with toggle state,
  aria-pressed.
- **List Card** (`.c-card`): Responsive card for mobile views of tables, includes header, body,
  footer slots.
- **Data Table** (`.c-table`): Sticky header (`position: sticky; top: 0`), responsive (hide columns
  on mobile), sortable columns (optional JS).
- **Empty State** (`.c-empty`): Icon + message + optional CTA for no results.
- **Section Subtitle** (`.c-subtitle`): "After GW7" + "Updated 14:32" inline pattern.

### Personalization (localStorage)

- **FPL ID Capture**: Modal/banner on first visit: "Enter your FPL ID to see your rank" →
  `localStorage.setItem('fplId', id)`.
- **Your Rank Widget**: Fetch leaderboard JSON, filter by stored ID, display rank + delta from last
  GW.
- **Rivals System**: `localStorage.setItem('rivals', JSON.stringify([id1, id2, id3]))` → show
  mini-table on Dashboard.
- **Clear/Edit ID**: Settings icon in header → modal to view/edit stored data, "Clear all data"
  button.

### Data Handling

- **Existing APIs**: Continue using Google Sheets JSON exports + FPL API via existing AppScript
  endpoints.
- **New Endpoints** (if needed):
  - `/api/fixtures?gw=7` → current GW fixtures (can parse from FPL API)
  - `/api/price-changes` → top 5 risers/fallers (cache daily, parse from external source or FPL)
  - `/api/captain-poll` → return local vote counts (localStorage aggregated client-side for MVP, no
    backend)
- **Caching**: Use `Cache-Control` headers on JSON files; client-side cache in `sessionStorage` for
  repeated page visits.

### UI/UX Specifications

- **Breakpoints**: Mobile `< 640px`, Tablet `640-1024px`, Desktop `> 1024px` (align with existing
  Tailwind-style breakpoints if using utility classes).
- **Colors**: Reuse existing CSS custom properties (`--color-primary`, `--color-success`, etc.);
  ensure WCAG AA contrast for all text.
- **Typography**: System font stack, scale (14px base → 16px body → 20px h3 → 24px h2 → 32px h1).
- **Spacing**: 4px base unit (`--space-1: 4px`, `--space-2: 8px`, ..., `--space-6: 24px`).
- **Animations**: Subtle transitions (200ms ease-in-out) for tab underline, filter chip active
  state, card hover.

### Performance Targets

- **First Contentful Paint**: < 1.5s on 3G.
- **Time to Interactive**: < 3s on 3G.
- **Lighthouse Score**: 90+ Performance, 100 Accessibility, 90+ Best Practices.
- **Bundle Size**: Keep total JS < 50KB gzipped, CSS < 20KB gzipped (no frameworks).

### Accessibility (a11y)

- **Keyboard**: All interactive elements focusable and operable via keyboard; visible focus rings.
- **Screen Readers**: Proper heading hierarchy (h1 → h2 → h3), `aria-label` on icon buttons,
  `aria-live="polite"` for dynamic updates (e.g., countdown).
- **Color Contrast**: All text meets WCAG AA (4.5:1 for normal, 3:1 for large).
- **Responsive Text**: Allow zoom to 200% without horizontal scroll or content loss.

### Testing Requirements

- **Browser Support**: Latest Chrome, Safari, Firefox, Edge; iOS Safari 15+, Chrome Android.
- **Device Testing**: iPhone SE (small), iPhone 14 Pro (notch), iPad Air (tablet), Desktop
  1920x1080.
- **Manual Tests**: Ribbon scroll on mobile, filter chips toggle, search input, localStorage
  persistence across pages, clear data button.
- **Automated**: Lighthouse CI in GitHub Actions, validate HTML/CSS, check broken links.

## External Dependencies

None required. This spec uses only vanilla HTML, CSS, and JavaScript with existing Google Sheets +
FPL API data sources.
