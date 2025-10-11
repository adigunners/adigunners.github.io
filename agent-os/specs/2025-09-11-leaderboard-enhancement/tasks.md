# Spec Tasks

These are the tasks to be completed for the spec detailed in
@.agent-os/specs/2025-09-11-leaderboard-enhancement/spec.md

> Created: 2025-09-11 Status: Ready for Implementation

## Tasks

- [x] 1. **Data Structure Enhancement for Previous Rank Tracking**
  - [x] 1.1 Write tests for previous rank data structure in winner_stats.json schema
  - [x] 1.2 Update data/winner_stats.json structure to include previousRank field for each player
  - [x] 1.3 Update data/test_winner_stats.json structure to include mock previousRank data
  - [x] 1.4 Modify data loading functions in js/data-loader.js to handle previousRank field
  - [x] 1.5 Add validation for previousRank data types (null for new players, number for existing)
  - [x] 1.6 Update data synchronization logic to preserve previousRank across data updates
  - [x] 1.7 Verify all data structure tests pass and mock data loads correctly

- [x] 2. **Current Gameweek Points Data Integration**
  - [x] 2.1 Write tests for current GW points data extraction from existing highlights structure
  - [x] 2.2 Analyze existing winner.highlights structure to identify current GW points source
  - [x] 2.3 Create utility function to extract current GW points from player data
  - [x] 2.4 Add fallback logic for missing or null current GW points (display as "-")
  - [x] 2.5 Update test data to include realistic current GW points values
  - [x] 2.6 Verify current GW points extraction tests pass with various data scenarios

- [x] 3. **Enhanced Leaderboard Table Structure (5-Column Layout)**
  - [x] 3.1 Write tests for new table column rendering and data binding
  - [x] 3.2 Update displayLeaderboard() function in index.html to render 5-column table
  - [x] 3.3 Modify table HTML structure: Rank | Movement | Player Name | Current GW Points | Total
        Points
  - [x] 3.4 Add proper ARIA labels and semantic markup for accessibility
  - [x] 3.5 Update CSS styling for 5-column layout in existing stylesheets
  - [x] 3.6 Ensure table pagination continues to work with new column structure
  - [x] 3.7 Add responsive design breakpoints for mobile/tablet viewing
  - [x] 3.8 Verify all table rendering tests pass and data displays correctly

- [x] 4. **Movement Indicator Implementation with Arrows**
  - [x] 4.1 Write tests for movement calculation logic (up/down/new/same)
  - [x] 4.2 Create calculateMovement() utility function comparing current vs previous rank
  - [x] 4.3 Design movement indicator UI: ↑ (green), ↓ (red), NEW (blue), - (gray)
  - [x] 4.4 Implement movement indicator rendering in table cells
  - [x] 4.5 Add CSS classes and styling for different movement states
  - [x] 4.6 Handle edge cases: new players, tied ranks, missing previous rank data
  - [x] 4.7 Add tooltips showing exact rank change (e.g., "Up 3 positions")
  - [x] 4.8 Verify movement indicator tests pass and display correctly

- [x] 5. **Deficit Calculation and Display Logic**
  - [x] 5.1 Write tests for deficit calculation relative to leader
  - [x] 5.2 Create calculateDeficit() function to compute points behind leader
  - [x] 5.3 Update Total Points column to show deficit for non-leaders (e.g., "1,247 (-25)")
  - [x] 5.4 Handle leader display (no deficit shown for rank 1)
  - [x] 5.5 Add proper formatting for large deficit numbers with commas
  - [x] 5.6 Style deficit text with muted color to distinguish from main score
  - [x] 5.7 Add tooltips explaining deficit calculation
  - [x] 5.8 Verify deficit calculation tests pass and values display accurately

- [x] 6. **Mobile Responsive Design Updates**
  - [x] 6.1 Write tests for mobile table layout and column visibility
  - [x] 6.2 Implement responsive column priority: hide Current GW Points on smallest screens
  - [x] 6.3 Ensure movement arrows remain visible and properly sized on mobile
  - [x] 6.4 Update table scrolling behavior for 5-column layout on small screens
  - [x] 6.5 Test touch interactions and pagination controls on mobile devices
  - [x] 6.6 Optimize table row height and spacing for mobile viewing
  - [x] 6.7 Verify mobile responsive tests pass and UX remains intuitive

- [x] 7. **Integration Testing and Performance Validation**
  - [x] 7.1 Write comprehensive integration tests for complete leaderboard flow
  - [x] 7.2 Test data loading performance with enhanced 5-column structure
  - [x] 7.3 Validate pagination performance with movement calculations
  - [x] 7.4 Test error handling for malformed data or missing previousRank values
  - [x] 7.5 Verify backward compatibility with existing winner data structure
  - [x] 7.6 Test cross-browser compatibility for table rendering and calculations
  - [x] 7.7 Perform accessibility audit for screen readers and keyboard navigation
  - [x] 7.8 Verify all integration tests pass and performance meets requirements
