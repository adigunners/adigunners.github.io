# Technical Specification

This is the technical specification for the spec detailed in
@.agent-os/specs/2025-09-11-leaderboard-enhancement/spec.md

> Created: 2025-09-11 Version: 1.0.0

## Technical Requirements

### HTML Structure Changes

**Current Structure (line ~2138 in index.html):**

```html
<table
  class="leaderboard-table table-density-compact table-align-rank table-align-player table-align-prize table-align-points"
>
  <colgroup>
    <col style="width:4.75ch" />
    <!-- Rank -->
    <col style="width:auto" />
    <!-- Player name -->
    <col style="width:8ch" />
    <!-- Prize -->
    <col style="width:6ch" />
    <!-- Points -->
  </colgroup>
</table>
```

**New Enhanced Structure:**

```html
<table
  class="leaderboard-table table-density-compact table-align-rank table-align-player table-align-gw-points table-align-total-points table-align-deficit"
>
  <colgroup>
    <col style="width:6ch" />
    <!-- Rank + Arrow -->
    <col style="width:auto" />
    <!-- Player name -->
    <col style="width:7ch" />
    <!-- Current GW Points -->
    <col style="width:8ch" />
    <!-- Total Points -->
    <col style="width:8ch" />
    <!-- Deficit from Leader -->
  </colgroup>
</table>
```

### Column Implementation Details

1. **Rank Column Enhancement:**
   - Add movement arrow icons (▲ ▼ ─) next to rank numbers
   - Implement color coding: green for up, red for down, gray for no change
   - Increase column width from 4.75ch to 6ch to accommodate arrows

2. **Current GW Points Column:**
   - Display latest gameweek points for each player
   - Format: "45 pts" or just "45" based on space constraints
   - Source from player data object: `player.highlights.currentGWPoints`

3. **Deficit from Leader Column:**
   - Calculate: Leader's total points - Player's total points
   - Display format: "-25" for deficit, "Leader" for #1 position
   - Color coding: neutral/muted text color

### Responsive Design Requirements

**Desktop (≥768px):**

- Display all 5 columns
- Full column headers: "RANK", "PLAYER", "GW PTS", "TOTAL", "DEFICIT"
- Standard font sizes and spacing

**Mobile (<768px):**

- Priority columns: Rank, Player, Total Points
- Hide: Current GW Points and Deficit columns
- Abbreviated headers: "#", "PLAYER", "PTS"
- Reduced font sizes and compact spacing

### CSS Class Structure

**New CSS Classes Required:**

```css
.col-gw-points {
  /* Current GW Points column styling */
}
.col-total-points {
  /* Total Points column styling */
}
.col-deficit {
  /* Deficit column styling */
}
.rank-movement {
  /* Movement arrow container */
}
.rank-movement-up {
  /* Green up arrow */
}
.rank-movement-down {
  /* Red down arrow */
}
.rank-movement-same {
  /* Gray no-change indicator */
}
```

**Responsive Utilities:**

```css
@media (max-width: 767px) {
  .col-gw-points,
  .col-deficit {
    display: none;
  }
  .leaderboard-table {
    font-size: 0.9em;
  }
}
```

## Approach

### Phase 1: Data Layer Updates

1. Extend player data objects to include `currentGWPoints` field
2. Implement deficit calculation logic in leaderboard generation function
3. Add mock rank movement data structure for initial implementation

### Phase 2: HTML/Template Updates

1. Update table structure in the `tableHTML` template (around line 2137)
2. Modify `currentPageData.map()` function to include new columns
3. Update column group and header definitions

### Phase 3: CSS Implementation

1. Add responsive column classes
2. Implement movement arrow styling
3. Update mobile breakpoint styles
4. Test across different screen sizes

### Phase 4: JavaScript Logic

1. Implement rank movement calculation (comparing current vs previous rankings)
2. Add deficit calculation logic
3. Update existing sorting and pagination to handle new columns

## External Dependencies

### Required Data Fields

- `player.highlights.currentGWPoints` - Current gameweek points
- `player.highlights.previousRank` - Previous rank for movement calculation (mock initially)
- Leader's total points for deficit calculation

### CSS Framework Integration

- Maintain compatibility with existing table utility classes
- Preserve current responsive breakpoint system
- Integrate with existing color scheme and typography

### No Additional Libraries Required

- Implementation uses existing vanilla JavaScript
- Utilizes current CSS framework/utility classes
- Maintains existing accessibility patterns
