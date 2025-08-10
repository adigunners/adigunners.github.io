# 📖 API Reference - IIM Mumbai FPL League

**Complete reference for all functions, endpoints, and configurations in the fantasy league management system.**

---

## 🔧 Core Configuration Objects

### FPL_CONFIG

```javascript
const FPL_CONFIG = {
  SHEET_NAME: 'IIM Mumbai FPL Master Database',
  PLAYERS_TAB: 'Players',
  WEEKLY_SCORES_TAB: 'Weekly Scores',
  WEEKLY_WINNERS_TAB: 'Weekly Winners',
  MONTHLY_WINNERS_TAB: 'Monthly Winners',
  PRIZE_TRACKING_TAB: 'Prize Tracking',
  SETTINGS_TAB: 'Settings',
  // ADMIN_EMAIL is now loaded from Script Properties for security and flexibility
  ADMIN_EMAIL: PropertiesService.getScriptProperties().getProperty('ADMIN_EMAIL'),
  LAST_PROCESSED_GW_CELL: 'B49',
  FPL_BASE_URL: 'https://fantasy.premierleague.com/api/',
  // BOOTSTRAP_URL derived from FPL_BASE_URL to prevent URL drift
  get BOOTSTRAP_URL() {
    return this.FPL_BASE_URL + 'bootstrap-static/';
  },
  CURRENT_SEASON: '2025-26',
  TOTAL_GAMEWEEKS: 38,
};
```

---

const GITHUB_CONFIG = {
TOKEN: (() => {
// Throw-if-missing pattern for robust config
const t = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
if (!t) {
throw new Error('Missing GITHUB_TOKEN in Script Properties. Please set this property in Project Settings > Script Properties.');
}
return t;
})(),
REPO_OWNER: 'adigunners',
REPO_NAME: 'adigunners.github.io',
FILE_PATH: 'winner_stats.json',
BRANCH: 'main',
};

**How to add Script Properties:**

1. In the Apps Script editor, go to `Project Settings` > `Script Properties`.
2. Add a new property with key `ADMIN_EMAIL` and your admin email as the value.
3. Save changes.

This ensures your email is not hardcoded in the codebase and can be changed without code edits.

````

---

## 🏢 Core System Functions

### Registration System (`FPL Registration Automation Script.js`)

#### `processNewRegistrations()`

**Purpose**: Main function to process new form responses and validate FPL team IDs
**Trigger**: Hourly or manual
**Returns**: `void`
**Side Effects**: Updates Players sheet, sends confirmation emails

```javascript
function processNewRegistrations()
// Usage: Run manually or via hourly trigger
// Processes all new form responses since last run
````

#### `validateFPLTeam(teamId, teamName)`

**Purpose**: Validates FPL team ID against official API
**Parameters**:

- `teamId` (string): FPL team ID to validate
- `teamName` (string): Expected team name for verification
  **Returns**: `{valid: boolean, teamName: string, playerName: string, nameMatch: boolean, message: string}`

```javascript
const validation = validateFPLTeam('123456', 'My Team Name');
// Returns validation object with API response data
```

#### `sendConfirmationEmail(playerData, fplValidation, paymentStatus)`

**Purpose**: Sends HTML confirmation email to new registrants
**Parameters**:

- `playerData` (object): Player registration information
- `fplValidation` (object): FPL team validation results
- `paymentStatus` (string): "Paid" or "Pending"
  **Returns**: `void`

---

### Data Processing System (`FPL_Data_Fetcher.js`)

#### `dailyMasterProcess()` ⭐

**Purpose**: Main daily processing function - handles all automation
**Trigger**: Daily at 9 AM
**Returns**: `void`
**Process Flow**:

1. Check for completed gameweeks
2. Update player scores from FPL API
3. Calculate weekly winners with tie-handling
4. Calculate monthly winners (every 4 GWs)
5. Update overall standings with ranking
6. Generate winner stats JSON
7. Trigger email system

```javascript
function dailyMasterProcess()
// The heart of the system - run this daily for full automation
```

#### `getCurrentGameweek()`

**Purpose**: Fetches current gameweek from FPL API
**Returns**: `number` - Current gameweek ID
**Fallback**: Uses Settings sheet if API fails

```javascript
const currentGW = getCurrentGameweek(); // Returns: 15
```

#### `updateAllPlayerScores(gameweekToFetch)`

**Purpose**: Updates scores for all active players for specified gameweek
**Parameters**: `gameweekToFetch` (number): Gameweek number to process
**Returns**: `void`
**Side Effects**: Updates Weekly Scores sheet

#### `calculateWeeklyWinners(gameweek)`

**Purpose**: Calculates weekly winners with proper tie-handling
**Parameters**: `gameweek` (number): Gameweek to calculate winners for
**Returns**: `void`
**Side Effects**: Updates Weekly Winners and Prize Tracking sheets
**Logic**: Handles ties by splitting prizes equally

#### `calculateMonthlyWinners(period)`

**Purpose**: Calculates monthly winners for 4-gameweek periods
**Parameters**: `period` (object): `{month: number, start: number, end: number}`
**Returns**: `void`
**Monthly Periods**:

```javascript
const monthlyPeriods = [
  { month: 1, start: 1, end: 4 },
  { month: 2, start: 5, end: 8 },
  // ... continues for 10 months
];
```

#### `updateOverallStandings()`

**Purpose**: Updates total points, averages, and rankings with tie-handling
**Returns**: `void`
**Side Effects**: Updates Total Points, Average, and Current Rank columns

#### `updateWinnerStats()` ⭐

**Purpose**: Generates comprehensive winner statistics JSON for website
**Returns**: `void`
**Side Effects**: Updates `winner_stats.json` on GitHub via API
**Output Structure**:

```javascript
{
  "lastUpdated": "2025-08-07T...",
  "summary": {
    "totalPrizeDistributed": 5400,
    "totalPaid": 2000,
    "totalPending": 3400,
    "gameweekPrizes": 3200,
    "monthlyPrizes": 2200,
    "completedGameweeks": 4,
    "completedMonths": 1,
    "totalWinners": 6,
    "lastProcessedGW": 4
  },
  "winners": [...]
}
```

---

### Email System (`New_Email_System.js`)

#### `sendLeagueUpdateEmails()` ⭐

**Purpose**: Master email function - determines weekly vs monthly emails
**Trigger**: Called by `dailyMasterProcess()`
**Returns**: `void`
**Logic**: Sends monthly emails for GWs 4,8,12,16,20,24,28,32,36,38; weekly emails otherwise

#### `sendWeeklyEmails(gameweek)`

**Purpose**: Sends personalized weekly update emails to all players
**Parameters**: `gameweek` (number): Gameweek to report on
**Template**: `WeeklyEmailTemplate.html`
**Content Includes**:

- Player's GW performance
- Weekly winners announcement
- Overall league standings (top 10)
- Monthly standings (top 5)
- League statistics and prize structure

#### `sendMonthlyEmails(gameweek)`

**Purpose**: Sends enhanced monthly summary emails
**Parameters**: `gameweek` (number): Final gameweek of the month
**Template**: `MonthlyEmailTemplate.html`
**Content Includes**:

- Player's monthly journey (GW-by-GW performance)
- Manager of the Month spotlight
- Monthly awards and highlights
- Complete monthly standings

#### `calculateMonthlyAwards(period, scoresData, headers)`

**Purpose**: Calculates special awards for monthly emails
**Returns**: `{highRoller: {name: string, score: number}}`
**Awards**:

- High Roller: Highest single GW score in the month

---

### Website Integration (`UpdateWebsiteCounter.js`)

#### `updateLeagueStatsOnGitHub()` ⭐

**Purpose**: Updates league statistics on website via GitHub API
**Trigger**: Every 15 minutes
**Returns**: `void`
**Updates**: `league_stats.json` with player count, pot amount, timestamp

**Output Format**:

```javascript
{
  "playerCount": 26,
  "potAmount": 78000,
  "lastUpdated": "2025-08-07T..."
}
```

---

## 🧪 Testing System (`FPL_Test_System.js`)

#### `setupCompleteTestDemo()` ⭐

**Purpose**: Creates comprehensive test data for 4 gameweeks + 1 month
**Returns**: `void`
**Creates**:

- Realistic player scores (40-90 point range)
- Weekly winners for GW1-4
- Monthly winner for Month 1
- Complete prize tracking
- Test JSON files

#### `testEmailSending()`

**Purpose**: Sends test emails (weekly + monthly) to admin only
**Safety**: Only sends to admin email, never to real players
**Returns**: `void`

#### `cleanupTestDataDirect()`

**Purpose**: Removes all test data safely
**Returns**: `void`
**Clears**: All test data from sheets, preserves live data

---

## 🌐 External API Endpoints

### FPL Official API

#### Bootstrap Static

```
GET https://fantasy.premierleague.com/api/bootstrap-static/
```

**Purpose**: Get current gameweek info, player data, fixtures
**Response**: Complete FPL static data
**Usage**: `getCurrentGameweek()`, season status checks

#### Player Gameweek Data

```
GET https://fantasy.premierleague.com/api/entry/{team_id}/event/{gw}/picks/
```

**Purpose**: Get player's points for specific gameweek
**Parameters**:

- `team_id`: FPL team ID (e.g., 123456)
- `gw`: Gameweek number (1-38)
  **Response**: `{entry_history: {points: number}, ...}`

#### Team Validation

```
GET https://fantasy.premierleague.com/api/entry/{team_id}/
```

**Purpose**: Validate team exists and get team info
**Response**: `{name: string, player_first_name: string, player_last_name: string, ...}`

### GitHub API

#### Get File

```
GET https://api.github.com/repos/{owner}/{repo}/contents/{path}
```

**Headers**: `Authorization: token {GITHUB_TOKEN}`
**Purpose**: Get current file info (for SHA)

#### Update File

```
PUT https://api.github.com/repos/{owner}/{repo}/contents/{path}
```

**Headers**: `Authorization: token {GITHUB_TOKEN}`, `Content-Type: application/json`
**Body**:

```javascript
{
  "message": "Update message",
  "content": "base64_encoded_content",
  "sha": "current_file_sha",
  "branch": "main"
}
```

---

## 📊 Data Structures

### Player Record

```javascript
{
  name: "Player Name",
  email: "email@example.com",
  phone: "WhatsApp number",
  fplTeamName: "FPL Team Name",
  fplTeamId: "123456",
  paymentStatus: "Paid" | "Pending",
  paymentDate: Date | "",
  registrationDate: Date,
  status: "Active" | "Pending Validation",
  notes: ""
}
```

### Winner Record

```javascript
{
  playerName: "Player Name",
  totalPrizeWon: 1500,
  totalPaid: 500,
  totalPending: 1000,
  prizeBreakdown: {
    gameweek: 800,
    monthly: 700
  },
  highlights: {
    gameWeeks: 2,        // Number of weekly wins
    gameMonths: 1,       // Number of monthly wins
    overallRank: 3       // Current league position
  },
  achievements: {
    gameweeks: [{week: 1, position: "1st", prize: 500, status: "Paid"}],
    months: [{month: 1, position: "1st", prize: 1000, status: "Pending"}]
  },
  positions: {
    first: 2,           // Number of 1st place finishes
    second: 1           // Number of 2nd place finishes
  }
}
```

### Prize Tracking Record

```javascript
{
  prizeType: "Weekly" | "Monthly",
  identifier: "GW1" | "Month 1",
  playerName: "Player Name",
  position: "1st" | "2nd",
  prizeAmount: 500,
  status: "Paid" | "Pending",
  payoutDate: Date | ""
}
```

---

## 🔐 Authentication & Security

### Script Properties (Required)

```javascript
// Set via: Apps Script → Project Settings → Script Properties
GITHUB_TOKEN: 'ghp_xxxxxxxxxxxxx';
```

### GitHub Token Permissions (Required)

- `repo` - Full repository access
- `user:email` - Access to email (for commits)

### API Rate Limits

- **FPL API**: ~100 requests/minute (built-in delays in code)
- **GitHub API**: 5000 requests/hour (more than sufficient)
- **Gmail API**: 100 emails/day (via Apps Script)

---

## 🔄 Trigger Configuration

### Daily Master Trigger

```javascript
ScriptApp.newTrigger('dailyMasterProcess').timeBased().everyDays(1).atHour(9).create();
```

### Website Update Trigger

```javascript
ScriptApp.newTrigger('updateLeagueStatsOnGitHub').timeBased().everyMinutes(15).create();
```

### Registration Processing Trigger

```javascript
ScriptApp.newTrigger('processNewRegistrations').timeBased().everyHours(1).create();
```

---

## 🛠 Utility Functions

### Validation & Setup

- `validateSheetStructure()` - Check all required sheets exist
- `testGitHubToken()` - Verify GitHub API access
- `initializePrizeTrackingSheet()` - Set up prize tracking headers
- `checkTriggers()` - List all active triggers

### Data Management

- `manual
