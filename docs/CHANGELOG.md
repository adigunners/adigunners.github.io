# 📝 Changelog - IIM Mumbai FPL League

**All notable changes to the fantasy league management system will be documented in this file.**

## [1.1.0] - 2025-08-21 - Mobile-First Optimization & UI Enhancement

### 🎨 UI/UX Improvements

- **Mobile-First Architecture**: Complete website audit and optimization for mobile devices
- **Container Consistency**: Applied uniform `winner-scorecard` styling to all major sections
- **Enhanced Countdown Display**: Redesigned countdown with larger, more prominent styling for better visibility
- **FPL Brand Consistency**: Updated 6-hour urgency styling to use official FPL teal accent color
- **Simplified Architecture**: Removed complex countdown enhancement system in favor of clean, integrated approach
- **Space Optimization**: Reduced excessive white space by 50% on mobile while maintaining readability
- **Sticky Header Enhancement**: Added proper spacing and professional positioning
- **Table Improvements**: Implemented uniform row heights and restored appealing purple header design

### 📱 Mobile Optimizations

- **Created**: `css/mobile-optimizations.css` for basic compact layouts
- **Created**: `css/advanced-mobile.css` for ultra-sleek mobile experience
- **Progressive Space Reduction**: 30px → 16px → 8px → 6px across breakpoints
- **Typography Density**: Optimized font sizes and spacing for mobile readability
- **Responsive Headers**: Proper mobile header design with purple gradient background

### ⏰ Countdown System Overhaul

- **Removed**: `css/countdown-enhancements.css` and `js/countdown-enhancements.js` (complex system)
- **Enhanced**: Integrated prominent countdown styling directly into `css/header.css`
- **Sizing**: Increased container from 300px to 450px (500px desktop) for better visibility
- **Typography**: Label: 1rem→1.4rem, Time: 0.85rem→1.3rem, Numbers: enhanced to 1.6rem
- **Urgency**: 6-hour threshold with official FPL teal accent color (--accent-color)
- **Responsive**: Optimized scaling across mobile (380px), tablet, and desktop breakpoints

### 🔧 Technical Improvements

- **CSS Architecture**: Organized mobile-first responsive design patterns
- **Cross-Device Consistency**: Uniform styling across desktop, tablet, and mobile
- **Performance**: Optimized CSS cascade and specificity management
- **Accessibility**: Maintained WCAG compliance while improving compactness

### 📋 Files Modified

- `index.html` - Added mobile CSS includes and consistent container classes
- `css/responsive.css` - Restored purple header design, added uniform row heights
- `css/leaderboard.css` - Added desktop table row height consistency
- `css/mobile-optimizations.css` - Created basic mobile compactness
- `css/advanced-mobile.css` - Created ultra-compact mobile experience

---

## [1.0.9] - 2025-08-18 - Config-first backend + safer operations (no UI change)

### 🔧 Backend & Ops

- Introduced normalized Config and Prize tables in Google Sheets with a central `Config.js` access layer.
- Added preflight checks and a visible `SYSTEM` banner indicating mode (TEST/LIVE, DRY_RUN status).
- Safe TEST/LIVE routing via Script Properties; one-click admin menu actions for dry-run, test-writes, and live runs.
- JSON publishing now respects `TEST_MODE`: publishes to `data/test_winner_stats.json` when testing; live continues at `data/winner_stats.json`.
- Demo helpers: run a full 38-GW or 4-GW simulated season and publish test JSON for website previews.

### 📣 Notes

- No visual changes to the site. Changes improve reliability and operator safety behind the scenes.
- Admin docs updated with new workflows; see private `fml-admin-docs` for runbooks.

---

## [1.0.6] - 2025-08-16 - Winners Header Parity + Floating Back Button

### 🎨 UI/UX Improvements

- Winners page header now mirrors the home page exactly. Title remains perfectly centered on desktop regardless of side content width.
- Introduced a floating “Back to Home” button (bottom-right). This keeps layout clean across desktop and mobile and prevents header overlap issues.
- Improved mobile wrapping for header title/subtitle to avoid clipping on small screens.

### 🔧 Implementation Notes

- Header implemented with CSS Grid (1fr auto 1fr) to lock center alignment; countdown sits in the right column.
- The Back button is no longer part of the header flow; it’s a fixed-position control with safe-area support and an accessible focus state.
- Navigation preserves query params (test/data/phase/clockOffset) when returning to Home.

### ✅ QA & Verification

- Desktop: Title centered, countdown on right, no visual shift when content widths change.
- Mobile: Stacked header, no overlap, floating Back button visible and tap-friendly.

---

## [1.0.7] - 2025-08-17 - Dynamic "After GWx" subtitles for Winners & Leaderboard

### 🎨 UI Consistency & Accessibility

- Added dynamic "After GWx" subtitle to the Winners and Leaderboard headings so both pages use the same cached gameweek source as the countdown widget.
- Mobile-first stacked subtitle (stacks under title on small screens, inline on wider screens). Subtitle is accessible and respects prefers-reduced-motion.

### 🔧 Implementation Notes

- `winners.html`: Added `.winners-heading` rules, `#winners-page-after-gw` span, and `updateWinnersPageHeaderGW()` to read `_lastGwId` / `fpl_cached_gw` and update the subtitle.
- `index.html`: Ensured winners/leaderboard headings use the same heading structure and updater functions.

### ✅ QA

- Verified subtitle shows "After GW{n}" when `fpl_cached_gw` is present in localStorage or when `_lastGwId` is set.
- Responsive behavior: stacked on mobile, inline on desktop; animation disabled when `prefers-reduced-motion: reduce`.

---

## [1.0.8] - 2025-08-17 - Winners / Leaderboard refinements: mobile card layout + data updates

### 🎨 UI/UX & Mobile Fixes

- Restored wide-screen winners layout to the original table while switching to index-style winner cards on small screens (prevents mobile distortion caused by table-row flex rules).
- Floating phase/back toggle now matches the home page visually and by markup/IDs for consistent behaviour across pages.
- Rank column is centered on mobile, and the #1 card keeps the left gold highlight border in the card layout.

### 🧩 Data & Standings

- Added a "Points" (Overall Score) column to the League Standings preview and populated demo/test data with `totalPoints` so preview and generators show consistent overall scores.

### 🛠 Implementation Notes

- File: `winners.html` — fixed malformed CSS, removed problematic row-level flex rules, added card-based mobile renderer and viewport-branching in `displayWinnerTable()` (table on wide screens, cards on mobile).
- File: `index.html` — winner card styles used as canonical mobile card markup.
- Data: `data/test_winner_stats.json` and Apps Script generators updated to include `totalPoints` for demo/test runs.
- Added `escapeHTML()` helper and limited `optimizeTableColumnWidths()` to run only when a table is rendered.

### ✅ QA

- Desktop: winners table unchanged from previous wide-screen design.
- Mobile: winners render as consistent cards (same visual style as index), no horizontal distortion.
- Demo/test data now shows Overall Score values in previews.

## [1.0.5] - 2025-08-15 - Test Mode Standings Fix + Docs

### 🐛 Bug Fixes

- Fixed "League Standings" showing as empty in test mode when `data/winner_stats.json` is empty (pre-season).
- Implemented safe fallback in `loadTestLeaderboardData()` to use `data/test_winner_stats.json` directly when live data has no winners.
- Improved merge logic when live data exists: overlays test ranks on matching names and safely pushes unranked players to the bottom.

### 🔧 Technical Notes

- Leaderboard sorting uses `winners[].highlights.overallRank` (ascending).
- Test mode begins in pre-season view; use the on-page toggle to preview in-season sections, or open `index.html?test=true` and click the toggle.
- Cache-busting retained on JSON fetches via `?cache=timestamp`.

### 📚 Documentation Updates

- Documented website test mode and leaderboard data fallback in Technical Documentation.
- Consolidated troubleshooting into the private admin repository (fml-admin-docs); removed public troubleshooting doc.

---

## [1.0.10] - 2025-08-18 - Hide "After GW0" subtitle when no finished GW

### 🐛 Bug Fix

- Fixed issue where Winners and League Standings subtitles displayed "After GW0" during pre-season (when no finished gameweek has been processed). The UI now hides the subtitle unless a positive (>=1) finished GW is known.

### 🔧 Implementation Notes

- Files updated: `index.html`, `winners.html` — new helper `getLastFinishedGW()` and stricter display condition (only show subtitle when finished GW &gt; 0).

### ✅ QA

- Verified that when `data/winner_stats.json` contains `summary.lastProcessedGW: 0` the subtitle is hidden; subtitle appears correctly once `lastProcessedGW` becomes 1.

---

## [1.0.4] - 2025-08-10 - Countdown Email System Enhancements

### 📧 Major Email System Improvements

- **Day 0 Countdown Enhancement** - Final day now displays "6 HOURS REMAINING" instead of "0 DAYS REMAINING" with urgent blinking animation
- **Smart Name Personalization** - If first name is less than 3 characters, uses full name for personalized greetings
- **Center-Aligned Messaging** - Hook messages and main content now properly center-aligned for better visual presentation
- **Mobile-Optimized Countdown** - Responsive design with appropriate font scaling and button stacking for mobile devices
- **British English Consistency** - All email content uses British spellings ("analysing," "strategising," etc.)

### 🚨 Urgency Features for Final Hours

- **Blinking Animation** - Day 0 countdown number pulses with CSS animation to create urgency
- **Updated Subject Lines** - Final email uses "6 HOURS LEFT - Final call! 🚨" for maximum impact
- **Enhanced Visual Hierarchy** - Countdown display optimized for different screen sizes while maintaining urgency

### 🎯 Technical Improvements

- **Conditional Display Logic** - Smart countdown switching between days/hours based on remaining time
- **CSS Animation Optimization** - Lightweight blinking animation using keyframes for better performance
- **Template Flexibility** - Modular countdown display system for easy future customization
- **Test Function Addition** - New `testDay0WithBlinking()` function for specific Day 0 testing

### 📱 Mobile Responsiveness Enhancements

- **Dynamic Font Scaling** - Countdown numbers scale appropriately on mobile devices (80px on small screens)
- **Button Stacking** - Call-to-action buttons stack vertically on mobile for better usability
- **Optimized Padding** - Mobile-specific padding adjustments for better content flow
- **Center Alignment** - All message content centers properly across all device sizes

### 🧪 Enhanced Testing Capabilities

- **Dedicated Test Functions** - Individual test functions for each day (0-4) of the countdown
- **Day 0 Specific Testing** - `testDay0WithBlinking()` function to verify 6-hour display and animation
- **Quick Setup Function** - `quickSetupCountdownCampaign()` for complete campaign setup with testing
- **Comprehensive Email Preview** - Test all 5 countdown emails in sequence before live deployment

---

## [1.0.3] - 2025-08-10 - UI/UX Consistency & Performance Improvements

### 🎨 Major Visual Consistency Updates

- **Unified Top 3 Winner Styling** - Rolled back shimmering border animations to solid gradient backgrounds across both index.html and winners.html
- **Performance Optimization** - Removed resource-intensive CSS animations in favor of elegant static styling
- **Cross-Platform Consistency** - Ensured identical visual treatment of top 3 winners on all screen sizes (desktop, tablet, mobile)

### 🏆 Enhanced Winner Card Design

- **Gold Winner (1st Place)**: Warm gradient background (#fffbf0 to #fff8e1) with gold border (#f9a825)
- **Silver Winner (2nd Place)**: Cool gradient background (#f8f9fa to #f1f3f4) with silver border (#9e9e9e)
- **Bronze Winner (3rd Place)**: Warm gradient background (#fef7e0 to #fff3cd) with bronze border (#d4b106)
- **Subtle Shadow Effects**: Professional depth with rgba-based box shadows
- **Hover Enhancements**: Interactive hover states maintaining visual hierarchy

### 🔧 Technical Improvements

- **Reduced Animation Overhead**: Eliminated complex CSS animations that could impact performance on lower-end devices
- **Better Battery Life**: Reduced CPU usage on mobile devices by removing continuous animations
- **Faster Page Load**: Simplified CSS reduces parsing time and improves Core Web Vitals
- **Accessibility**: Removed motion that could trigger vestibular disorders for sensitive users

### 📱 Mobile Experience Enhancements

- **Consistent Mobile Cards**: Top 3 winner cards on mobile now match desktop styling approach
- **Touch-Friendly Design**: Maintained card-based layout while ensuring visual consistency
- **Performance**: Improved scrolling performance by eliminating animation overhead

### 🧪 Test Data & Badge System

- **GM Badge Logic**: Confirmed proper implementation of gameMonth badges (displays when `highlights.gameMonths > 0`)
- **Dynamic Badge System**: Green GW badges for gameweek wins, red GM badges for monthly wins
- **Test Data Integrity**: Maintained clean test data structure for proper JSON ingestion pipeline

---

## [1.0.2] - 2025-01-09 - Winners Page Pagination Implementation

### 🚀 Major Features Added

- **Complete Pagination System for Winners Page** - Implemented comprehensive pagination with 10 winners per page
- **Navigation Controls** - Added Previous/Next buttons with proper state management
- **Page Information Display** - Shows current page and total pages (e.g., "Page 1 of 5")
- **Auto Show/Hide Controls** - Pagination controls automatically appear only when needed

### 🎨 Enhanced User Experience

- **Global Rank Calculation** - Maintains correct ranking across all pages (1, 2, 3... regardless of current page)
- **Smooth Page Transitions** - Seamless navigation between pages with state preservation
- **Dynamic Table Optimization** - Column widths optimized for each page's content
- **Performance Optimization** - Only renders current page data, improving performance with large datasets

### 📱 Mobile Responsiveness Fixes

- **Fixed Subtitle Text Wrapping** - Resolved text cutoff issues on mobile devices
- **Improved Text Flow** - Section descriptions now wrap naturally instead of showing ellipsis (...)
- **Enhanced Readability** - Added proper line-height for wrapped text on small screens
- **Maintained Responsive Design** - Preserved existing mobile card layout while fixing text issues

### 🔧 Technical Implementation

- **Enhanced JavaScript Functions**:
  - `displayWinnerTable()` - Now supports full pagination with proper data slicing
  - `previousWinnerPage()` - New navigation function for going to previous page
  - `nextWinnerPage()` - New navigation function for going to next page
  - `updateWinnerNavigation()` - Helper function for navigation state management
- **CSS Improvements**:
  - Modified mobile section paragraph rules for proper text wrapping
  - Added navigation button styling with hover effects
  - Enhanced responsive behavior for pagination controls
- **Performance Enhancements**:
  - Efficient pagination reduces DOM complexity for large winner lists
  - Maintains smooth user experience regardless of dataset size

### 🐛 Bug Fixes

- **Mobile Text Display** - Fixed subtitle "All players ranked by total prize money won this season" being cut off
- **Table Styling Consistency** - Removed conflicting gold/silver/bronze rank number styling on desktop
- **Navigation State Management** - Proper enabling/disabling of navigation buttons based on current position

---

## [1.0.1] - 2025-08-07 - UI Improvements & Bug Fixes

### 🐛 Critical Bug Fixes

- **Fixed Winner Table Ranking Display** - Resolved template literal parsing issue causing "#{index + 1}" to display instead of actual rank numbers (1, 2, 3, etc.)
- **Enhanced Mobile Title Display** - Fixed header title wrapping on small screens with responsive font scaling
- **Improved Browser Compatibility** - Replaced complex template literals with explicit string concatenation for better cross-browser support

### 🎨 UI/UX Enhancements

- **Updated Winner Page Icon** - Changed from trophy 🏆 to bullseye 🎯 emoji for cleaner visual design
- **Enhanced Mobile Responsiveness** - Added progressive font scaling for extra small and ultra narrow screens
- **Improved Visual Hierarchy** - Better contrast and styling for rank badges (gold/silver/bronze)
- **Cache-Busting Improvements** - Enhanced browser cache management for faster updates

### 🔧 Technical Improvements

- **Optimized JavaScript Rendering** - More efficient table generation with explicit string building
- **Better Error Handling** - Enhanced fallback mechanisms for template rendering failures
- **Improved Code Maintainability** - Cleaner separation of logic and presentation layers
- **Git Workflow Enhancements** - Better handling of remote changes with stash/pull/push cycles

### 🚀 Production Deployment

- **Live Site Updates** - All improvements successfully deployed to GitHub Pages
- **Cross-Platform Testing** - Verified functionality across different browsers and devices
- **Performance Optimization** - Reduced rendering time and improved page load speeds

---

## [1.0.0] - 2025-08-07 - Initial Production Release

### 🚀 Major Features Added

- **Complete League Management System** - Automated FPL data processing with winner calculations
- **Email Automation** - Weekly and monthly personalized email updates to all players
- **Live Website Integration** - Real-time winner leaderboards with GitHub Pages hosting
- **Prize Tracking System** - Complete prize distribution management with payment status
- **Admin Dashboard** - Google Sheets-based management interface

### 🔧 Core Components Implemented

#### **Registration System**

- Google Form integration with FPL team ID validation
- Automated confirmation emails with HTML templates
- Duplicate prevention and data validation
- Payment status tracking

#### **Data Processing Engine**

- Daily automated processing of FPL scores via official API
- Weekly winner calculations with proper tie-handling
- Monthly winner calculations (every 4 gameweeks)
- Overall standings with ranking system
- Rate limiting and error handling for API calls

#### **Email System**

- **Weekly Emails**: Personalized updates with player performance, winners, league standings
- **Monthly Emails**: Enhanced reports with monthly journey, spotlight features, awards
- HTML templates with responsive design
- Personalized content for each player

#### **Website Integration**

- Automated JSON file updates via GitHub API
- Real-time league statistics (player count, prize pool)
- Winner leaderboards with prize money tracking
- Mobile-responsive design with modern UI

#### **Prize Management**

- Automated prize calculations with tie-handling
- Complete tracking of all prize distributions
- Payment status management (Paid/Pending)
- Prize breakdown by weekly/monthly categories

### 🧪 Testing & Demo System

- **Complete Test Framework** - Generate 4 gameweeks of realistic test data
- **Safe Testing Environment** - Separate test JSON files, admin-only emails
- **Demo Capabilities** - Professional demo mode for presentations
- **Easy Cleanup** - Functions to reset test data without affecting live system

### 📊 Current Configuration

- **26 Active Players** from IIM Mumbai alumni network
- **₹78,000 Total Prize Pool** (₹3,000 entry fee per player)
- **Weekly Prizes**: ₹500 (1st), ₹300 (2nd)
- **Monthly Prizes**: ₹1000 (1st), ₹700 (2nd)
- **38 Gameweeks** full season support

### 🔐 Security & Monitoring

- GitHub token-based authentication for website updates
- FPL API validation against official endpoints
- Admin notification system for errors and important events
- Comprehensive logging for debugging and monitoring

### 📚 Documentation

- Complete technical documentation with system architecture
- Step-by-step setup guide for deployment
- Comprehensive API reference with all functions
- Troubleshooting guide for common issues

---

## [0.9.0] - 2025-08-05 - Beta Testing Phase

### 🧪 Testing Implementation

- **Test Data Generation** - Created realistic test scenarios for 4 gameweeks
- **Email Testing** - Implemented admin-only email testing system
- **Website Test Mode** - Added `?test=true` parameter for demo functionality
- **Demo Preparation** - Complete system ready for co-founder presentations

### 🔧 System Refinements

- **Month Display Fix** - Resolved "December 1899" issue in Monthly Winners sheet
- **Tie Handling** - Enhanced winner calculations to properly split prizes for ties
- **Error Handling** - Improved error messages and admin notifications
- **Performance Optimization** - Added delays for API rate limiting

### 📧 Email Template Enhancements

- **Weekly Template** - Added monthly standings, improved layout
- **Monthly Template** - Added personal monthly journey table, spotlight features
- **Responsive Design** - Optimized for mobile email clients
- **Personalization** - Dynamic content based on player performance

---

## [0.9.1] - 2025-08-17 - Phase-based monthly detection

### 🛰 Data Source and Monthly Winners

- **Authoritative months** — Monthly winner calculation now prefers the FPL
  `bootstrap-static.phases` block to determine month boundaries and phase names.
  A legacy 4-GW partitioning is retained as a fallback when phases[] are
  unavailable.

- **Parity** — Test harness and production fetcher now share the same
  phase-aware logic to ensure consistent monthly winner detection and labels
  (GM1..GMn mapping where applicable).

## [0.8.0] - 2025-08-01 - Core System Complete

### 🏗 System Architecture Finalized

- **Google Sheets Database** - Complete sheet structure with all required tabs
- **Apps Script Backend** - All core processing functions implemented
- **GitHub Integration** - Automated website updates via API
- **Trigger System** - Daily, hourly, and form-based automation

### 📊 Data Processing Implementation

- **FPL API Integration** - Live score fetching with validation
- **Winner Calculations** - Weekly and monthly winner algorithms
- **Overall Standings** - Ranking system with tie-handling
- **Prize Distribution** - Automated prize calculation and tracking

### 🌐 Website Development

- **Landing Page** - Professional homepage with league information
- **Winner Leaderboard** - Complete winner rankings with prize details
- **Real-time Updates** - JSON-driven data display
- **Mobile Responsive** - Optimized for all device sizes

---

## [0.7.0] - 2025-07-25 - Registration System

### 🔐 Player Registration

- **Google Form Integration** - Automated processing of registration responses
- **FPL Validation** - Real-time validation against FPL official API
- **Confirmation Emails** - HTML email templates with league information
- **Payment Tracking** - Status management for entry fees

### 📋 Data Management

- **Sheet Structure** - Defined all required tabs and data formats
- **Data Validation** - Duplicate prevention and error handling
- **Admin Interface** - Google Sheets-based management dashboard

---

## [0.6.0] - 2025-07-20 - Initial Development

### 🎯 Project Planning

- **Requirements Analysis** - Defined all system requirements
- **Technology Selection** - Chose Google Apps Script + GitHub Pages architecture
- **Data Flow Design** - Planned integration between components
- **Prize Structure** - Established weekly/monthly prize framework

### 🛠 Development Setup

- **Google Apps Script Project** - Initial project structure
- **GitHub Repository** - Set up repository for website hosting
- **Development Environment** - Local development workflow established

---

## 🔮 Planned Features (Future Releases)

### [1.1.0] - Enhanced Analytics (Planned)

- **Advanced Statistics** - Player performance trends, head-to-head comparisons
- **Data Visualizations** - Charts and graphs for league insights
- **Performance Metrics** - Detailed analytics for each player
- **Export Capabilities** - CSV exports for external analysis

### [1.2.0] - Mobile App Integration (Planned)

- **API Endpoints** - REST API for mobile app consumption
- **Real-time Notifications** - Push notifications for winners and updates
- **Mobile Dashboard** - Native mobile interface for league management

### [1.3.0] - Payment Integration (Planned)

- **UPI Integration** - Direct payment processing for entry fees and prizes
- **Payment Tracking** - Automated payment status updates
- **Financial Reporting** - Complete financial dashboard for league management

### [1.4.0] - Multi-League Support (Planned)

- **League Templates** - Support for different league configurations
- **Season Management** - Multi-season support with historical data
- **Cross-League Analytics** - Comparison between different leagues

### [1.5.0] - Enterprise Features (Planned)

- **User Management** - Role-based access control for admins
- **Audit Trails** - Complete logging of all system changes
- **Backup & Recovery** - Automated backup systems
- **Performance Monitoring** - System health monitoring and alerts

---

## 🐛 Known Issues

### Current Limitations

- **Email Quota**: Limited to 100 emails per day via Gmail API
- **FPL API Rate Limits**: Occasional delays during high-traffic periods
- **Manual Payment Tracking**: Prize payments currently tracked manually
- **Single League**: System designed for one league at a time

### Workarounds

- **Email Limits**: Monitor daily usage, implement batching if needed
- **API Limits**: Built-in delays and retry logic implemented
- **Payment Tracking**: Manual updates via Google Sheets interface
- **Multi-League**: Clone system for additional leagues

---

## 🤝 Contributors

### Development Team

- **Lead Developer**: Aditya Garg (aditya.garg.2006@gmail.com)
- **System Architecture**: Aditya Garg
- **Frontend Development**: Aditya Garg
- **Testing & QA**: Aditya Garg

### Special Thanks

- **IIM Mumbai Alumni Network** - For participation and feedback
- **FPL Community** - For inspiring the automated league management concept
- **Google Apps Script Community** - For technical guidance and best practices

---

## 📊 Release Statistics

### Development Timeline

- **Total Development Time**: 3 weeks (July-August 2025)
- **Lines of Code**: ~2,500 lines (JavaScript + HTML)
- **Functions Implemented**: 45+ core functions
- **Documentation Pages**: 5 comprehensive guides
- **Test Scenarios**: 4 gameweeks + 1 month of test data

### System Scale

- **Current Capacity**: 26 active players
- **Supported Scale**: Up to 50 players with current architecture
- **Processing Time**: <5 minutes for full gameweek processing
- **Email Delivery**: <2 minutes for all player notifications
- **Website Updates**: <30 seconds for JSON file updates

---

## 📋 Version Numbering

This project uses [Semantic Versioning](https://semver.org/):

- **MAJOR.MINOR.PATCH** (e.g., 1.2.3)
- **MAJOR**: Incompatible API changes or major system redesigns
- **MINOR**: New functionality added in a backwards compatible manner
- **PATCH**: Backwards compatible bug fixes and minor improvements

---

## 📞 Support & Feedback

For questions about this changelog or the system:

- **Email**: aditya.garg.2006@gmail.com
- **Documentation**: [Technical Docs](TECHNICAL_DOCUMENTATION.md)
- **Issues**: Report via email with detailed description
- **Feature Requests**: Send suggestions for future versions

---

_This changelog follows the [Keep a Changelog](https://keepachangelog.com/) format._
_Last Updated: August 2025_
