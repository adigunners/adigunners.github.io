# Visual Regression Screenshots

> Captured: 2025-10-04 Branch: feature/responsive-breakpoint-standard

## Baseline Screenshots

Captured **14 screenshots** at all standard breakpoints for both main pages:

### Leaderboard Page (index.html)

- ✅ `leaderboard_360px.png` (60 KB) - Extra small mobile
- ✅ `leaderboard_375px.png` (65 KB) - Mobile portrait (XS)
- ✅ `leaderboard_480px.png` (66 KB) - Mobile landscape (SM)
- ✅ `leaderboard_768px.png` (113 KB) - Tablet portrait (MD)
- ✅ `leaderboard_1024px.png` (90 KB) - Tablet landscape (LG)
- ✅ `leaderboard_1200px.png` (98 KB) - Desktop (XL)
- ✅ `leaderboard_1440px.png` (105 KB) - Large desktop (2XL)

### Winners Page (winners.html)

- ✅ `winners_360px.png` (64 KB) - Extra small mobile
- ✅ `winners_375px.png` (66 KB) - Mobile portrait (XS)
- ✅ `winners_480px.png` (71 KB) - Mobile landscape (SM)
- ✅ `winners_768px.png` (92 KB) - Tablet portrait (MD)
- ✅ `winners_1024px.png` (97 KB) - Tablet landscape (LG)
- ✅ `winners_1200px.png` (99 KB) - Desktop (XL)
- ✅ `winners_1440px.png` (112 KB) - Large desktop (2XL)

## Purpose

These baseline screenshots capture the visual state of the site **after** implementing the
responsive breakpoint standard. They document:

1. **Standard Breakpoints**: Only using defined tokens (480px, 768px, 1024px, 1200px, 1440px)
2. **Zero Fractional Values**: No .01px hacks
3. **Responsive Tables**: Sticky headers, horizontal scroll, numeric alignment
4. **Fluid Typography**: Scales from 14px to 18px

## Screenshot Tool

Screenshots were captured using `take-screenshots.py`:

- Automated Selenium/Chrome headless browser
- Captures both pages at all breakpoints
- Saves to `baseline/` directory
- Total file size: ~1.2 MB

## Usage

To capture updated screenshots after changes:

```bash
# Start local server
python3 -m http.server 8000

# Run screenshot tool
cd .agent-os/specs/2025-10-04-responsive-breakpoint-standard
python3 take-screenshots.py
```

## Visual Verification Checklist

When reviewing screenshots, verify:

- [ ] Sticky table headers visible at all breakpoints
- [ ] Horizontal scroll available on mobile for tables
- [ ] Numeric columns aligned with tabular-nums
- [ ] Card grids adapt smoothly: 1-col → 2-col → 3-col
- [ ] Typography scales appropriately
- [ ] No layout breaks at exact breakpoint boundaries
- [ ] Touch targets ≥ 44×44px on mobile
- [ ] Consistent spacing across breakpoints
