# Countdown System Testing Guide

This guide explains how to test the updated countdown behavior safely on the feature branch before any production push.

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
- `tools/testing/countdown-stress.html` — test harness that generates `?clockOffset` and override links

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
3. Click a scenario button to generate links with computed `?clockOffset`:
   - T-7d, T-1d, T-6h, T-2h, T-5m, T+5m, T+2h, T+12h
4. Open the generated links to `index.html` and `winners.html` in new tabs.

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
