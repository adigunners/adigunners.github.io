Media capture guide for 1.4.4 (Header Autohide + Winners UX)

Goal: Provide quick visual verification for the PR.

Recommended tools
- Any browser devtools device emulation (Chrome/Safari/Firefox)
- Screen recorder (built-in OS capture) or a GIF tool (e.g., Kap)

Viewports
- Small mobile: 375×812 (iPhone X/11/12)
- Large mobile: 414×896 (iPhone 11 Pro Max)
- Optional: 480–700px width to show 2‑column stat boxes

Pages
1) index.html
   - Section: Header (autohide)
     - Action: Scroll down slowly to hide header, then up to reveal
     - Capture: Short GIF (~4–6s)
   - Section: Mini‑League Snapshot (stats)
     - Capture: Screenshot (mobile, centered single‑column)
   - Section: Winners preview
     - Capture: Screenshot showing the 6 cards (no inner nested box)
   - Section: Overall Leaderboard (title updated)
     - Capture: Screenshot of the heading
   - Section: Prize Breakdown / Missed Registration
     - Capture: Screenshot of headings

2) winners.html
   - Section: Season Summary (stats)
     - Capture: Screenshot (mobile, centered single‑column)
   - Section: Season Earnings (All Winners)
     - Mobile cards: Screenshot (show right‑aligned highlights; name clamps to 2 lines)
     - Desktop/tablet table: Screenshot (optional)

Two‑column stat boxes (larger mobile)
- Use width between 480–700px to show 2‑column grid
- Capture: Screenshot on either page’s stats section

File naming (drag/drop to PR or save under this folder)
- index-header-autohide.gif
- index-stats-mobile.png
- index-winners-preview.png
- index-leaderboard-heading.png
- index-prize-missed-headings.png
- winners-stats-mobile.png
- winners-cards-mobile.png
- stats-two-column-500w.png

Notes
- Header autohide respects prefers-reduced-motion; disable that setting to demo movement.
- Twemoji renders locally; no network required.

