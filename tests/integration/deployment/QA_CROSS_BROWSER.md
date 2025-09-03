# Cross‑Browser QA – Unified Stat Boxes & Headings

Use this checklist to validate visual layout, accessibility, and caching across major browsers.

## How to Run

- Start local server: `python3 -m http.server 8000`
- Pages:
  - Home: `http://localhost:8000/`
  - Winners: `http://localhost:8000/winners.html`
  - Visual: `http://localhost:8000/tools/testing/stat-box-visual.html`

## Service Worker Hygiene

- Chrome: Application → Service Workers → Unregister; Hard Reload.
- Safari: Develop → Empty Caches; disable caches while testing.
- Firefox: about:debugging#/runtime/this-firefox → Service Workers → Unregister; Reload.

## Test Matrix

- Browsers: Chrome, Firefox, Safari, Edge
- Viewports: 360, 390, 414, 768, 820, 1000, 1025, 1200, 1440
- Modes: First load (no SW), With SW, `?test=true`, Reduced motion

## Checklist (per browser)

### Layout – Stat Boxes

- [ ] Index: 2 boxes side‑by‑side (tablet/desktop); stacked on mobile
- [ ] Winners: 4 boxes in a row (desktop); 2×2 on tablet; stacked on mobile
- [ ] Equal heights; spacing matches cards; no overflow/wrapping glitches

### Headings & Subtitles

- [ ] `.section-heading` used everywhere; emoji size consistent
- [ ] Subtitle shows “After GWx” only from winners data; no flashing/“After GW0”

### Pagination & Buttons

- [ ] Leaderboard Prev/Next enable/disable correctly; labels match behavior
- [ ] Winners navigation buttons behave; page info updates

### Tooltip Accessibility

- [ ] Tooltip button focusable; Space/Enter toggles visibility
- [ ] `aria-expanded` updates; content readable; closes on blur

### Fonts & Icons

- [ ] Poppins WOFF2 preloads; swap ok; no FOIT/404s
- [ ] SVG sprite icons crisp on retina

### Service Worker

- [ ] Second load faster; static assets served from cache
- [ ] HTML network‑first (no stale page). No SW console errors

### Accessibility

- [ ] Tab order logical; focus ring visible on controls
- [ ] Contrast of muted text ok; disabled buttons readable
- [ ] Screen reader announces headings, subtitles, pagination

### Performance sanity

- [ ] No layout shift on headers/subtitles; stat boxes stable across breakpoints
- [ ] No long tasks introduced by changes

## Issues Log

Use this template for any findings:

```
Title: [Browser/Device] [Page/Section] concise issue
Steps: viewport size, URL, actions
Expected: …
Actual: …
Notes: console/network, screenshots
Repro: always/sometimes/rare
```
