# IIM Mumbai Fantasy Premier League - Technical Documentation

## Project Overview

Automated FPL (Fantasy Premier League) league management system for IIM Mumbai alumni, handling player registration, weekly/monthly winner calculations, prize distribution tracking, email notifications, and live website updates.

## Tech Stack

- **Backend**: Google Apps Script (JavaScript)
- **Database**: Google Sheets
- **Frontend**: Static HTML/CSS/JavaScript website
- **Hosting**: GitHub Pages
- **Email**: Gmail API via Google Apps Script
- **Data Source**: Official FPL API
- **Version Control**: GitHub

## System Architecture

### Core Components

#### 1. **Google Sheets Database Structure**

```
Main Spreadsheet: "IIM Mumbai FPL Master Database"
├── Players Tab - Player registration data
├── Weekly Scores Tab - GW-by-GW player scores
├── Weekly Winners Tab - Weekly prize winners
├── Monthly Winners Tab - Monthly prize winners
├── Prize Tracking Tab - All prize distribution records
├── Settings Tab - Configuration and league parameters
└── Form Responses Tab - Raw registration form data
```

#### 2. **Google Apps Script Files**

```
Project Structure:
├── FPL Registration Automation Script.js - Registration processing
├── FPL_Data_Fetcher.js - Main data processing engine
├── New_Email_System.js - Email template system
├── UpdateWebsiteCounter.js - GitHub integration
├── WeeklyEmailTemplate.html - Weekly email template
├── MonthlyEmailTemplate.html - Monthly email template
└── FPL_Test_System.js - Testing framework (optional)
```

#### 3. **Website Structure**

```
GitHub Pages Repository:
├── index.html - Main landing page
├── winners.html - Winner leaderboard page
├── league_stats.json - Live player/pot stats
├── winner_stats.json - Live winner data
└── test_winner_stats.json - Test data for demos
```

## Data Flow

### 1. **Player Registration Flow**

```
Google Form → Form Responses Sheet → FPL API Validation → Players Sheet → Confirmation Email
```

### 2. **Weekly Processing Flow**

```
FPL API → Player Scores Update → Winner Calculation → Prize Tracking → Email System → Website JSON Update
```

### 3. **Website Update Flow**

```
Google Sheets Data → Apps Script Processing → GitHub API → JSON Files → Live Website Display
```

## Key Configuration

### Google Apps Script Properties

```javascript
// Required in Script Properties:
GITHUB_TOKEN: 'ghp_xxxxx'; // GitHub Personal Access Token (PLACEHOLDER ONLY)
```

> **WARNING:**

> - **Never paste real Personal Access Tokens (PATs) in documentation, logs, screenshots, or code comments.**
> - Always use placeholders (e.g., `ghp_xxxxx`) in all public or shared materials.
> - Regularly rotate your tokens and immediately revoke any that may have been exposed.
> - Mask tokens in any debug output or error logs before sharing.
> - Prefer fine-grained PATs with only the required repo scope (e.g., contents:write on a single repo) and set an expiration date.
> - Restrict editor access on the Apps Script project; Script Properties are readable by project editors.
> - For higher security, consider storing tokens in Google Cloud Secret Manager and fetching them at runtime instead of Script Properties.

#### Scanning for Accidental Token Leaks

To scan your repository for accidentally committed GitHub tokens or authorization headers, you can use the following script:

````sh
# Scan for GitHub PATs and Authorization headers in your repo
# Covers classic/fine-grained prefixes and common Authorization forms
git grep -InE \
  '(gh[pousr]_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{82}|Authorization: (Bearer|token) [A-Za-z0-9_]+)' .

# Optional: use gitleaks for broader secret patterns
# brew install gitleaks  # or see https://github.com/gitleaks/gitleaks
gitleaks detect --no-git -v || true

If any matches are found, **immediately revoke the exposed token** in your GitHub account settings and remove the sensitive data from your repository history.

### Main Configuration Objects

```javascript
// FPL_Data_Fetcher.js
const FPL_CONFIG = {
  SHEET_NAME: 'IIM Mumbai FPL Master Database',
  ADMIN_EMAIL: 'aditya.garg.2006@gmail.com',
  FPL_BASE_URL: 'https://fantasy.premierleague.com/api/',
  TOTAL_GAMEWEEKS: 38,
};

// GitHub Integration
const GITHUB_CONFIG = {
  REPO_OWNER: 'adigunners',
  REPO_NAME: 'adigunners.github.io',
  FILE_PATH: 'winner_stats.json',
  BRANCH: 'main',
};
````

## Core Functions & Workflows

### 1. **Registration System**

- **File**: `FPL Registration Automation Script.js`
- **Trigger**: Hourly or form submission
- **Key Function**: `processNewRegistrations()`
- **Process**: Validates FPL team IDs, prevents duplicates, sends confirmation emails

### 2. **Daily Data Processing**

- **File**: `FPL_Data_Fetcher.js`
- **Trigger**: Daily at 9 AM
- **Key Function**: `dailyMasterProcess()`
- **Process**:
  1. Check for completed gameweeks
  2. Update player scores from FPL API
  3. Calculate weekly winners (handles ties)
  4. Calculate monthly winners (every 4 gameweeks)
  5. Update overall standings with ranking
  6. Generate winner stats JSON
  7. Trigger email system

### 3. **Email System**

- **File**: `New_Email_System.js`
- **Templates**: `WeeklyEmailTemplate.html`, `MonthlyEmailTemplate.html`
- **Key Functions**: `sendWeeklyEmails()`, `sendMonthlyEmails()`
- **Features**: Personalized content, league standings, winner announcements

### 4. **Website Integration**

- **File**: `UpdateWebsiteCounter.js`
- **Trigger**: Every 15 minutes
- **Key Function**: `updateLeagueStatsOnGitHub()`
- **Updates**: Player count, prize pool, winner statistics

## Data Models

### Player Record

```javascript
{
  name: "Player Name",
  email: "email@example.com",
  phone: "WhatsApp number",
  fplTeamName: "FPL Team Name",
  fplTeamId: "123456",
  paymentStatus: "Paid/Pending",
  registrationDate: Date,
  status: "Active/Pending"
}
```

### Winner Record

```javascript
{
  playerName: "Player Name",
  totalPrizeWon: 1500,
  totalPaid: 500,
  totalPending: 1000,
  highlights: {
    gameWeeks: 2,      // Number of weekly wins
    gameMonths: 1,     // Number of monthly wins
    overallRank: 3
  },
  prizeBreakdown: {
    gameweek: 800,     // Weekly prize money
    monthly: 700       // Monthly prize money
  }
}
```

## Prize Structure

### Current Settings (in Settings Sheet)

- **Weekly Prizes**: ₹500 (1st), ₹300 (2nd)
- **Monthly Prizes**: ₹1000 (1st), ₹700 (2nd)
- **Entry Fee**: ₹3,000 per player
- **Monthly Periods**: Every 4 gameweeks (GW1-4, GW5-8, etc.)

## API Integrations

### 1. **FPL API Endpoints**

```javascript
// Main data
'https://fantasy.premierleague.com/api/bootstrap-static/';

// Player scores
'https://fantasy.premierleague.com/api/entry/{team_id}/event/{gw}/picks/';

// Team validation
'https://fantasy.premierleague.com/api/entry/{team_id}/';
```

### 2. **GitHub API Integration**

```javascript
// File update endpoint
"https://api.github.com/repos/{owner}/{repo}/contents/{path}"

// Authentication via Personal Access Token
Headers: { "Authorization": "token {GITHUB_TOKEN}" }
```

## Error Handling & Monitoring

### Admin Notifications

- **Function**: `sendAdminAlert(subject, message)`
- **Triggers**: API failures, data processing errors, email failures
- **Recipient**: `aditya.garg.2006@gmail.com`

### Data Validation

- FPL team ID validation against official API
- Duplicate registration prevention
- Prize calculation verification
- Tie-handling in winner calculations

## Testing System

### Test Framework

- **File**: `FPL_Test_System.js`
- **Purpose**: Generate realistic demo data for presentations
- **Key Function**: `setupCompleteTestDemo()`
- **Safety**: Uses separate test JSON files, sends emails only to admin

### Test Data Generation

- Creates 4 gameweeks of realistic player scores (40-90 point range)
- Generates weekly winners with prize distribution
- Calculates monthly winners (Month 1 = GW1-4)
- Updates test website JSON files
- Sends test emails to admin only

## Deployment Instructions

### Initial Setup

1. **Create Google Sheets** with required tab structure
2. **Set up Google Apps Script** project with all .js files
3. **Configure Script Properties** with GitHub token
4. **Set up GitHub Pages** repository with HTML files
5. **Configure email templates** in Apps Script
6. **Set up triggers** for automated processing

### Configuration Steps

```javascript
// 1. Set GitHub token in Script Properties
PropertiesService.getScriptProperties().setProperty('GITHUB_TOKEN', 'ghp_xxxxx');

// 2. Set up daily trigger
setupDailyMasterTrigger();

// 3. Set up website update trigger
setupHourlyCounterTrigger();

// 4. Initialize prize tracking sheet
initializePrizeTrackingSheet();
```

## Monitoring & Maintenance

### Daily Checks

- Verify `dailyMasterProcess()` executed successfully
- Check winner calculation accuracy
- Monitor email delivery
- Verify website JSON updates

### Monthly Tasks

- Review prize distribution
- Validate FPL API data accuracy
- Check GitHub Pages functionality
- Update league statistics

## Security Considerations

### Data Protection

- Email addresses secured in Google Sheets
- GitHub token stored in Script Properties
- Prize information access-controlled
- FPL team IDs validated against official API

### Access Control

- Google Sheets: Editor access for admin only
- Apps Script: Admin access only
- GitHub repository: Admin push access
- Email templates: No external dependencies

## Troubleshooting Guide

### Common Issues

1. **FPL API Rate Limiting**: Built-in delays between requests
2. **GitHub API Failures**: Error handling with fallback logging
3. **Email Delivery Issues**: Individual error catching per recipient
4. **Data Sync Issues**: Manual validation functions available

### Debug Functions

```javascript
// Check current gameweek
getCurrentGameweek();

// Validate sheet structure
validateSheetStructure();

// Test GitHub integration
testGitHubToken();

// Manual winner stats update
manualUpdateWinnerStats();
```

## Performance Optimizations

### Efficiency Measures

- Batch API calls with delays to avoid rate limiting
- Incremental data updates (only new gameweeks)
- Cached JSON files with timestamp validation
- Optimized email template rendering

### Scalability

- Current capacity: ~50 players (tested with 26)
- API rate limits: Built-in protection
- Storage: Google Sheets limits sufficient
- Email: Gmail API daily limits adequate

## Recent Technical Improvements

### UI/UX Consistency Overhaul (v1.0.3)

#### Visual Design Standardization

- **Eliminated Shimmering Animations**: Replaced resource-intensive CSS animations with elegant solid gradient backgrounds
- **Unified Winner Card Design**: Consistent styling across index.html and winners.html for top 3 positions
- **Performance Optimization**: Reduced CPU usage and improved battery life on mobile devices

```css
/* New solid gradient approach for winner cards */
.winner-card.rank-1,
.winner-table tbody tr.winner-gold {
  background: linear-gradient(145deg, #fffbf0, #fff8e1);
  border-left: 4px solid #f9a825;
  box-shadow: 0 2px 10px rgba(249, 168, 37, 0.15);
}

.winner-card.rank-2,
.winner-table tbody tr.winner-silver {
  background: linear-gradient(145deg, #f8f9fa, #f1f3f4);
  border-left: 4px solid #9e9e9e;
  box-shadow: 0 2px 10px rgba(158, 158, 158, 0.15);
}

.winner-card.rank-3,
.winner-table tbody tr.winner-bronze {
  background: linear-gradient(145deg, #fef7e0, #fff3cd);
  border-left: 4px solid #d4b106;
  box-shadow: 0 2px 10px rgba(212, 177, 6, 0.15);
}
```

#### Benefits of the New Approach

1. **Performance**: Eliminated continuous CSS animations that consumed CPU resources
2. **Accessibility**: Removed motion that could trigger vestibular disorders
3. **Battery Life**: Reduced power consumption on mobile devices
4. **Visual Consistency**: Unified design language across all pages and screen sizes
5. **Professional Appearance**: Clean, modern look that emphasizes content over effects

### Frontend Optimization (v1.0.1)

### Frontend Optimization

- **JavaScript Rendering Engine**: Replaced complex template literals with explicit string concatenation for better browser compatibility
- **Mobile Responsive Design**: Enhanced progressive font scaling for ultra-narrow screens (320px and below)
- **Cache Management**: Improved browser cache busting mechanisms for faster updates
- **Cross-Browser Compatibility**: Eliminated template literal parsing issues that caused display errors

### UI/UX Engineering

```javascript
// New optimized table rendering approach
function displayWinnerTable(winners) {
  let tableHTML = '<table class="winner-table">';
  tableHTML +=
    '<thead><tr><th>Rank</th><th>Player</th><th>Total Prize Won</th><th>Highlights</th></tr></thead>';
  tableHTML += '<tbody>';

  sortedWinners.forEach((winner, index) => {
    const rank = index + 1;
    const rankClass = index < 3 ? ` rank-${rank}` : '';
    // Build table row with explicit string construction
    tableHTML += `<tr>`;
    tableHTML += `<td class="winner-rank${rankClass}">${rank}</td>`;
    // ... rest of row construction
  });

  tableHTML += '</tbody></table>';
  document.getElementById('winner-table-container').innerHTML = tableHTML;
}
```

### Performance Optimizations

- **Reduced DOM Manipulation**: Single innerHTML update instead of multiple append operations
- **Efficient String Building**: Eliminated nested template literal complexity
- **Better Memory Management**: Reduced object creation in rendering loops
- **Faster Mobile Rendering**: Optimized CSS media queries with progressive enhancement

### Winners Page Pagination System (v1.0.2)

```javascript
// Global pagination variables
let allWinners = []; // Stores all winner data
let currentWinnerPage = 1; // Current page number (1-indexed)
const winnerItemsPerPage = 10; // Winners per page

// Enhanced displayWinnerTable with pagination support
function displayWinnerTable() {
  // Calculate pagination
  const totalPages = Math.ceil(allWinners.length / winnerItemsPerPage);
  const startIndex = (currentWinnerPage - 1) * winnerItemsPerPage;
  const endIndex = startIndex + winnerItemsPerPage;
  const currentPageData = allWinners.slice(startIndex, endIndex);

  // Show/hide pagination controls based on total pages
  const navigation = document.getElementById('winner-navigation');
  if (!navigation) return;
  if (totalPages > 1) {
    navigation.style.display = 'flex';
    updateWinnerNavigation(totalPages);
  } else {
    navigation.style.display = 'none';
  }
    navigation.style.display = 'flex';
    updateWinnerNavigation(totalPages);
  } else {
    navigation.style.display = 'none';
  }
}

// Navigation helper functions
function previousWinnerPage() {
  if (currentWinnerPage > 1) {
    currentWinnerPage--;
    displayWinnerTable();
  }
}

function nextWinnerPage() {
  const totalPages = Math.ceil(allWinners.length / winnerItemsPerPage);
  if (currentWinnerPage < totalPages) {
    currentWinnerPage++;
    displayWinnerTable();
  }
}
```

### Pagination Features

- **Performance Optimization**: Only renders 10 winners per page
- **Global Ranking**: Maintains correct ranks (1, 2, 3...) across all pages
- **Responsive Navigation**: Previous/Next buttons with proper state management
- **Page Information**: Displays "Page X of Y" with current position
- **Auto Show/Hide**: Pagination controls only appear when needed
- **Mobile Optimized**: Maintains compact card layout on mobile devices

### Git Workflow Improvements

```bash
# Enhanced deployment workflow
git stash            # Save local changes
git pull --rebase    # Get remote updates
git push            # Deploy changes
git stash pop       # Restore local work
```

## Future Enhancement Opportunities

### Immediate Priorities (v1.1.x)

1. **Progressive Web App (PWA)** - Service workers for offline functionality
2. **Real-time WebSocket Updates** - Live leaderboard without page refresh
3. **Advanced Caching Strategy** - Smart cache invalidation and preloading
4. **Performance Monitoring** - Core Web Vitals tracking and optimization

### SaaS Product Roadmap

1. **Multi-Tenant Architecture** - Support multiple leagues with isolated data
2. **White-label Solution** - Customizable branding for different organizations
3. **API-First Design** - RESTful APIs for third-party integrations
4. **Advanced Analytics Dashboard** - Data visualization and business intelligence
5. **Payment Integration** - Automated payment processing with multiple providers
6. **Mobile App** - Native iOS/Android apps with push notifications

### Technical Debt & Infrastructure

- **Database Migration**: Move from Google Sheets to PostgreSQL/MongoDB for >100 players
- **Microservices Architecture**: Split monolithic Apps Script into distributed services
- **CI/CD Pipeline**: Automated testing and deployment workflows
- **Security Hardening**: API key rotation, OAuth2, and audit logging
- **Monitoring & Alerting**: Application performance monitoring (APM) integration

---

## Quick Reference Commands

### Essential Functions

```javascript
// Daily processing
dailyMasterProcess();

// Manual winner update
manualUpdateWinnerStats();

// Test email system
testEmailSending();

// Clean up test data
cleanupTestDataDirect();

// Website test mode
// Visit: https://adigunners.github.io/?test=true
```

### Contact & Support

- **Admin**: Aditya Garg (aditya.garg.2006@gmail.com)
- **Repository**: https://github.com/adigunners/adigunners.github.io
- **Website**: https://adigunners.github.io/

---

_Last Updated: August 2025_
