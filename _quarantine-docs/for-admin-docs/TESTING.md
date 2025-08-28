# Testing Guide

This guide covers comprehensive testing procedures for the FPL website, including countdown system behavior and header display system verification.

## Branch & Safety

- Branch: `feature/countdown-rollover-backend-only-after-deadline`
- Safety tag: `pre-countdown-rollover-YYYYMMDD-HHMMSS`
- No changes to `main` until you explicitly merge.

## Local Run

1. Checkout the branch: `git checkout feature/countdown-rollover-backend-only-after-deadline`
2. Serve locally: `python3 -m http.server`
3. Open the site: `http://localhost:8000/`

## Pages To Test

- `index.html` — main site (countdown, winners preview, QA panel)
- `winners.html` — complete winners page (now uses shared countdown)
- `tools/testing/countdown-stress.html` — test harness that generates `?clockOffset` links and supports manual overrides.

## Core Behaviors

1. Pre‑deadline (countdown mode)

- Expected: Label `GWx Deadline`; D/H/M update each second.
- Verify on both pages: `index.html?test=true` and `winners.html?test=true`.

2. Post‑deadline before backend updates (LIVE mode)

- Expected: Both pages show `GWx LIVE`.
  - Days field shows `LIVE`; hours/minutes cleared; LIVE styling applied.
  - Only `data/next_deadline.json` is polled every ~10 minutes (no proxies).

3. After backend updates (next morning)

- Simulate by editing `data/next_deadline.json` locally: bump `nextGameweek.id` and set a later `deadline_time`.
- Expected: Countdown switches from LIVE → `GW(x+1) Deadline` automatically after a poll or after reload.

## Using the Stress Harness

1. Open `tools/testing/countdown-stress.html`
2. Click "Fetch Backend JSON" (or set your own deadline via "Manual Deadline").
3. (Optional) Click "Use Manual Deadline" with a future date and a GW id to enable overrides (`dl`, `gw`).
4. Click a scenario button to generate links with computed `?clockOffset`:
   - T-7d, T-1d, T-6h, T-2h, T-5m, T+5m, T+2h, T+12h
5. Open the generated links to `index.html` and `winners.html` in new tabs.

### Manual Override Parameters (Test/Admin only)

When `?test=true` or `?admin=true` is present, you can force the next deadline and gameweek via URL params:

- `dl` or `deadline`: ISO timestamp for the next deadline (e.g., `2025-08-29T17:30:00.000Z`)
- `gw` or `gameweek`: numeric gameweek id (e.g., `3`)

Example:

```
index.html?test=true&dl=2025-08-29T17:30:00.000Z&gw=3&clockOffset=...
```

The stress harness includes these automatically when "override active" is set via the manual controls.

## Acceptance Criteria

- Parity: Both pages show the same state (countdown or LIVE), same label format.
- Post‑deadline window: Remains `GWx LIVE` until backend JSON updates; no premature switch.
- Rollover: Once backend updates, countdown moves to the next GW.
- Accessibility: No missing asset errors; index countdown has `aria-live="polite"`.
- Scoped UI: LIVE styling only affects the countdown container.

## Debug / Tips

- Clear cache in DevTools Console:
  ```js
  localStorage.removeItem('fpl_next_deadline');
  localStorage.removeItem('fpl_cached_gw');
  ```
- Use `?test=true` to reveal QA/test UI on `index.html`.
- Network tab: Filter `next_deadline.json` to observe backend polling after deadline.

## Known Notes

- If backend JSON is unreachable, the system will keep polling at the defined interval (10 minutes) and stay in LIVE mode instead of switching via proxies.
- Fallback dates exist in the proxy loader as a last resort for pre‑deadline display; these are not used post‑deadline.

---

## Header Display System Testing

### System Contract

**CONTRACT: Headers update only from winners data; season/countdown writes are blocked.**

The header display system (`updateHeaderGW`) follows a strict single-source-of-truth pattern:

- **✅ ALLOWED**: Updates from `completedGameweeks` in `winner_stats.json` (source = 'winners')
- **❌ BLOCKED**: Updates from `nextGameweek.id - 1` calculations (source = 'season' or 'countdown')

This prevents race conditions and ensures consistent display of the last processed gameweek.

### Manual Test Procedures

#### Test 1: Basic Header Display

1. **Hard refresh** both pages (index.html, winners.html)
2. **Verify**: Headers show "Loading…" → "After GW1" (single transition, no flash)
3. **Verify**: No intermediate "After GW2" display

#### Test 2: Network Throttling

1. **DevTools** → Network → Throttle to "Slow 3G"
2. **Hard refresh** both pages 5 times each
3. **Verify**: Exactly one successful header write from winners data per page load
4. **Console**: No "season/countdown header write blocked" warnings (blocks are silent)

#### Test 3: Mobile Testing

1. **Safari iOS** + **Chrome Android**: Repeat Test 1
2. **Portrait/Landscape**: Headers display correctly in both orientations
3. **Touch interaction**: No unexpected header changes

#### Test 4: Rollover Simulation

1. **Browser console**: Run `FPLUIManager.testHeaderUpdate(2, 60000)` (1-minute test)
2. **Verify**: Single DOM update after delay, no flickering
3. **Verify**: Second call is idempotent (no duplicate updates)

### Expected Console Patterns

**Normal Load (Success)**:

```
[DEBUG] Set _lastProcessedGW from winner data: 1
[DEBUG] UI Manager set _lastProcessedGW: 1
Headers: "Loading…" → "After GW1"
```

**Blocked Season/Countdown Calls**:

```
(Silent blocks - no console output for blocked calls)
```

### Data Validation

- **completedGameweeks = 0**: Header remains "Loading…" (no update)
- **completedGameweeks > 0**: Header updates to "After GW{value}"
- **Invalid values**: Header remains "Loading…" with debug log

### Dev Utilities

**Test Command**: `FPLUIManager.testHeaderUpdate(mockGW, delayMs)`

- Simulates gameweek rollover with timing control
- Verifies idempotent behavior
- Logs detailed state changes

**Usage**: Open browser console on any page:

```javascript
// Test immediate update to GW2
FPLUIManager.testHeaderUpdate(2, 0);

// Test 30-second rollover to GW3
FPLUIManager.testHeaderUpdate(3, 30000);
```

### Troubleshooting

**Headers stuck on "Loading…"**:

- Check `completedGameweeks` value in `winner_stats.json`
- Verify value is number > 0
- Check console for "Invalid completedGameweeks" debug logs

**Multiple header updates**:

- System is idempotent - multiple calls with same value are safe
- Check for race conditions between data sources

**Browser compatibility**:

- System uses modern JavaScript (ES6+)
- Requires `Number.isFinite()` and `performance.now()` support
- Tested on Chrome 90+, Firefox 88+, Safari 14+
