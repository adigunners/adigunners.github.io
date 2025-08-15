# 🔍 Troubleshooting - Website & Data

## League Standings empty in test mode (fixed 2025-08-15)

### Symptoms

- "League Standings" shows "No league standings available yet." while using test data
- "Last updated: … (test data)" appears

### Root cause

- In test previews we attempted to merge `data/test_winner_stats.json` with live `data/winner_stats.json`.
- When live data is empty (pre-season), the merge iterated over an empty list so no rows rendered.

### Resolution implemented

- If live winners list is empty, the site now falls back to using `test_winner_stats.json` directly for standings.
- When live data exists, test ranks overlay matching players; others are kept with safe fallback ranks.

### How to validate

1. Open `index.html?test=true`.
2. Click "📊 Preview In-season View" to reveal during-season sections.
3. Confirm the table shows players sorted by `highlights.overallRank` (ascending).

### Still not seeing data?

- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+F5 (Windows).
- Ensure the file `data/test_winner_stats.json` exists and contains `winners[]` with `highlights.overallRank` set.
- Check the Network tab that requests include `?cache=<timestamp>` and are HTTP 200.
- Verify console has no JavaScript errors.

---

## Countdown clock not appearing (proxy fallback)

If all CORS proxies fail, the site uses a hardcoded GW1 fallback deadline. Update the fallback date each season in `index.html`.

---

## Winner preview empty

Confirm `winners[]` exists and `totalPrizeWon` > 0 for those you expect to appear. The preview shows top 6 by `totalPrizeWon`.
