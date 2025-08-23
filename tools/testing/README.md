# Testing Tools

This folder contains manual testing utilities that should not ship to production users.

- `countdown-stress.html` — Generates links with `?clockOffset` and optional override params
  (`dl`, `gw`) to simulate pre/post-deadline behavior and next-GW rollovers in test/admin mode.

Usage:

1. Run a local server at the repo root: `python3 -m http.server 8000`
2. Open `http://localhost:8000/tools/testing/countdown-stress.html`
3. Use “Fetch Backend JSON” or set a Manual Deadline + GW id, then choose a scenario
4. Open generated links for `index.html` and `winners.html`

Notes:

- These tools rely on the shared modules under `js/` and will not function if served outside the repo root.
- The override parameters (`dl`, `gw`) are only honored in `?test=true` or `?admin=true` mode.
