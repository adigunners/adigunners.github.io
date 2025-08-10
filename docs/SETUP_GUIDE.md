# ⚙️ Setup Guide - IIM Mumbai FPL League

**Complete step-by-step deployment instructions for setting up the fantasy league management system from scratch.**

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ Google Account with access to Google Sheets and Apps Script
- ✅ GitHub account for website hosting
- ✅ Basic understanding of Google Apps Script and GitHub
- ✅ Admin access to the league's Google Form and responses

---

## 🏗 Phase 1: Google Sheets Setup

### Step 1: Create Master Database Spreadsheet

1. **Create New Spreadsheet**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create new spreadsheet: "IIM Mumbai FPL Master Database"

2. **Create Required Tabs**
   Create these tabs in exact order:
   ```
   ├── Players
   ├── Weekly Scores
   ├── Weekly Winners
   ├── Monthly Winners
   ├── Prize Tracking
   ├── Settings
   └── Form Responses
   ```

### Step 2: Configure Each Tab

#### **Players Tab**

Headers (Row 1):

```
A: Name | B: Email | C: Phone | D: FPL Team Name | E: FPL Team ID | F: Payment Status | G: Payment Date | H: Registration Date | I: Status | J: Notes
```

#### **Weekly Scores Tab**

Headers (Row 1):

```
A: Player Name | B: FPL Team ID | C: GW1 | D: GW2 | ... | AO: GW38 | AP: Total Points | AQ: Average | AR: Current Rank
```

#### **Weekly Winners Tab**

Headers (Row 1):

```
A: Gameweek | B: Player Name | C: Points | D: Prize Amount | E: Position | F: Timestamp
```

#### **Monthly Winners Tab**

Headers (Row 1):

```
A: Month | B: Period (e.g., GW1-GW4) | C: Player Name | D: Points | E: Prize Amount | F: Position | G: Timestamp
```

#### **Prize Tracking Tab**

Headers (Row 1):

```
A: Prize Type | B: Identifier | C: Player Name | D: Position | E: Prize Amount | F: Status | G: Payout Date
```

#### **Settings Tab**

Configure these key settings:

```
A1: Setting | B1: Value
A2: League Name | B2: IIM Mumbai Fantasy League
A3: Player Count | B3: =COUNTA(Players!A:A)-1
A4: Pot Amount | B4: =B3*3000
A5: Current Gameweek | B5: 1
A18: Weekly Prize 1st | B18: 500
A19: Weekly Prize 2nd | B19: 300
A26: Monthly Prize 1st | B26: 1000
A27: Monthly Prize 2nd | B27: 700
A49: Last Processed GW | B49: 0
```

---

## 🔧 Phase 2: Google Apps Script Setup

### Step 1: Create Apps Script Project

1. **Open Apps Script**
   - From your Google Sheet: Extensions → Apps Script
   - Or go to [script.google.com](https://script.google.com)

2. **Project Configuration**
   - Name: "IIM Mumbai FPL League Management"
   - Delete default `Code.gs` file

### Step 2: Add Script Files

Create these files and copy the corresponding code:

#### **File 1: FPL Registration Automation Script.js**

- Copy code from the registration automation script
- Configure `CONFIG` object with your sheet name and admin email

#### **File 2: FPL_Data_Fetcher.js**

- Copy the main data processing script
- Update `FPL_CONFIG` with your settings
- Configure `GITHUB_CONFIG` with your repository details

#### **File 3: New_Email_System.js**

- Copy the email system code
- Update `EMAIL_CONFIG` with your league name

#### **File 4: UpdateWebsiteCounter.js**

- Copy the GitHub integration script
- Configure with your GitHub username and repository

#### **File 5: WeeklyEmailTemplate.html**

- Create HTML file for weekly email template
- Copy the weekly email template code

#### **File 6: MonthlyEmailTemplate.html**

- Create HTML file for monthly email template
- Copy the monthly email template code

### Step 3: Configure Script Properties

1. **Add GitHub Token**
   - Go to Project Settings → Script Properties
   - Add property: `GITHUB_TOKEN` with your GitHub Personal Access Token
   - Generate token at: GitHub Settings → Developer Settings → Personal Access Tokens

2. **Test Configuration**
   ```javascript
   // Run this function to verify setup
   testGitHubToken();
   ```

---

## 🌐 Phase 3: GitHub Pages Setup

### Step 1: Create Repository

1. **Create Repository**
   - Repository name: `{yourusername}.github.io`
   - Make it **public** (required for free GitHub Pages)
   - Initialize with README

### Step 2: Upload Website Files

Upload these files to your repository:

```
├── index.html (Main landing page)
├── winners.html (Winner leaderboard page)
├── league_stats.json (Will be auto-generated)
├── winner_stats.json (Will be auto-generated)
└── test_winner_stats.json (For testing)
```

### Step 3: Enable GitHub Pages

1. **Repository Settings**
   - Go to Settings → Pages
   - Source: Deploy from branch
   - Branch: main / (root)
   - Save

2. **Verify Deployment**
   - Visit: `https://{yourusername}.github.io`
   - Should see your league website

---

## 🔄 Phase 4: Automation Setup

### Step 1: Set Up Triggers

Run these functions once to create automated triggers:

```javascript
// Set up daily processing trigger
setupDailyMasterTrigger();

// Set up website update trigger
setupHourlyCounterTrigger();

// Set up registration processing trigger
setupAutomaticTrigger();
```

### Step 2: Initialize System

```javascript
// Initialize prize tracking sheet
initializePrizeTrackingSheet();

// Validate sheet structure
validateSheetStructure();

// Test email system
testEmailSending();
```

### Step 3: Verify Automation

1. **Check Triggers**

   ```javascript
   checkTriggers(); // Should show 3 active triggers
   ```

2. **Test Website Updates**
   ```javascript
   updateLeagueStatsOnGitHub(); // Should update JSON files
   ```

---

## ✅ Phase 5: Testing & Validation

### Step 1: Set Up Test Environment

```javascript
// Create comprehensive test data
setupCompleteTestDemo();

// Check test data status
checkTestDataStatus();
```

### Step 2: Test All Systems

1. **Email System**

   ```javascript
   testEmailSending(); // Sends test emails to admin only
   ```

2. **Website Integration**
   - Visit: `https://{yourusername}.github.io/?test=true`
   - Should show test winner data

3. **Winner Calculations**
   ```javascript
   showTestWinners(); // Display calculated winners
   ```

### Step 3: Clean Up Test Data

```javascript
cleanupTestDataDirect(); // Remove all test data
```

---

## 🚀 Phase 6: Go Live

### Step 1: Load Real Player Data

1. **Import Form Responses**
   - Copy form responses to "Form Responses" tab
   - Run: `processNewRegistrations()`

2. **Validate Player Data**
   - Check "Players" tab for successful imports
   - Verify FPL team ID validations

### Step 2: Initialize Live System

```javascript
// Reset to clean state
resetToFreshState();

// Process any pending registrations
processNewRegistrations();

// Update website with live data
updateLeagueStatsOnGitHub();
```

### Step 3: Monitor First Run

1. **Check Daily Processing**
   - Wait for gameweek to complete
   - Monitor `dailyMasterProcess()` execution
   - Verify email delivery

2. **Website Updates**
   - Confirm JSON files update automatically
   - Test both live and winner data

---

## 🔧 Maintenance & Monitoring

### Daily Tasks

- Monitor `dailyMasterProcess()` execution logs
- Check email delivery reports
- Verify website JSON updates

### Weekly Tasks

- Review winner calculations for accuracy
- Check prize tracking sheet
- Monitor system performance

### Monthly Tasks

- Validate FPL API data accuracy
- Review and update documentation
- Check GitHub repository health

---

## 🏢 SaaS Deployment Considerations

### Multi-Tenant Architecture Preparation

When scaling this system for multiple leagues:

#### **Environment Separation**

```javascript
// Environment-specific configurations
const ENVIRONMENT_CONFIG = {
  development: {
    GITHUB_REPO: 'test-league.github.io',
    EMAIL_DOMAIN: 'test.example.com',
    API_RATE_LIMITS: 'relaxed',
  },
  staging: {
    GITHUB_REPO: 'staging-league.github.io',
    EMAIL_DOMAIN: 'staging.example.com',
    API_RATE_LIMITS: 'normal',
  },
  production: {
    GITHUB_REPO: 'league.example.com',
    EMAIL_DOMAIN: 'league.example.com',
    API_RATE_LIMITS: 'strict',
  },
};
```

#### **League Template System**

```javascript
// Standardized league configuration template
const LEAGUE_TEMPLATE = {
  basic: {
    maxPlayers: 20,
    entryFee: 2000,
    weeklyPrizes: [300, 200],
    monthlyPrizes: [800, 500],
  },
  premium: {
    maxPlayers: 50,
    entryFee: 5000,
    weeklyPrizes: [500, 300],
    monthlyPrizes: [1200, 800],
  },
  enterprise: {
    maxPlayers: 100,
    entryFee: 10000,
    weeklyPrizes: [1000, 600],
    monthlyPrizes: [2500, 1500],
  },
};
```

### White-Label Customization

#### **Branding Configuration**

```javascript
// Client-specific branding settings
const BRANDING_CONFIG = {
  organizationName: 'Your Organization Name',
  primaryColor: '#37003c',
  secondaryColor: '#00ff85',
  logoUrl: 'https://your-domain.com/logo.png',
  customDomain: 'league.your-domain.com',
  emailSignature: 'Your League Management Team',
};
```

#### **Feature Toggles**

```javascript
// Configurable features for different subscription tiers
const FEATURE_FLAGS = {
  advancedAnalytics: true,
  customEmailTemplates: true,
  paymentIntegration: false,
  mobileApp: true,
  apiAccess: false,
};
```

## 🔧 Production Hardening

### Security Best Practices

#### **API Key Rotation**

```javascript
// Implement automatic token rotation
function rotateGitHubToken() {
  const oldToken = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  const newToken = generateNewGitHubToken(); // Implement via GitHub API

  // Test new token
  if (testTokenValidity(newToken)) {
    PropertiesService.getScriptProperties().setProperty('GITHUB_TOKEN', newToken);
    revokeGitHubToken(oldToken);
    sendAdminAlert('Token Rotated', 'GitHub token successfully rotated');
  }
}
```

#### **Environment Variables**

```javascript
// Secure configuration management
const CONFIG = {
  FPL_API_KEY: PropertiesService.getScriptProperties().getProperty('FPL_API_KEY'),
  GITHUB_TOKEN: PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN'),
  ADMIN_EMAIL: PropertiesService.getScriptProperties().getProperty('ADMIN_EMAIL'),
  ENCRYPTION_KEY: PropertiesService.getScriptProperties().getProperty('ENCRYPTION_KEY'),
};
```

### Performance Optimization

#### **Caching Strategy**

```javascript
// Multi-layer caching implementation
class CacheManager {
  static getWithFallback(key, fetchFunction, cacheTime = 3600) {
    // Try script cache first (fastest)
    let data = CacheService.getScriptCache().get(key);
    if (data) return JSON.parse(data);

    // Try document cache (medium speed)
    data = CacheService.getDocumentCache().get(key);
    if (data) {
      CacheService.getScriptCache().put(key, data, cacheTime);
      return JSON.parse(data);
    }

    // Fetch fresh data (slowest)
    data = fetchFunction();
    const serialized = JSON.stringify(data);
    CacheService.getScriptCache().put(key, serialized, cacheTime);
    CacheService.getDocumentCache().put(key, serialized, cacheTime * 24);

    return data;
  }
}
```

#### **Rate Limiting**

```javascript
// Advanced rate limiting with exponential backoff
class RateLimiter {
  static async makeAPICall(apiFunction, maxRetries = 3) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await apiFunction();
      } catch (error) {
        if (error.toString().includes('rate limit')) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          Utilities.sleep(delay);
          continue;
        }
        throw error;
      }
    }
    throw new Error(`Max retries (${maxRetries}) exceeded`);
  }
}
```

### Monitoring & Observability

#### **Health Check Endpoints**

```javascript
// System health monitoring
function getSystemHealth() {
  return {
    timestamp: new Date().toISOString(),
    version: '1.0.1',
    services: {
      sheets: checkSheetsAccess(),
      github: testGitHubToken(),
      email: testEmailConnectivity(),
      fpl_api: testFPLAPIAccess(),
    },
    metrics: {
      playersCount: getActivePlayersCount(),
      lastProcessedGW: getLastProcessedGameweek(),
      emailsSentToday: getEmailsSentCount(),
      apiCallsToday: getAPICallsCount(),
    },
  };
}
```

#### **Error Reporting**

```javascript
// Enhanced error reporting with context
function reportError(error, context = {}) {
  const errorReport = {
    timestamp: new Date().toISOString(),
    error: error.toString(),
    stack: error.stack,
    context: context,
    systemHealth: getSystemHealth(),
    userAgent: navigator.userAgent || 'Apps Script',
  };

  // Log to multiple destinations
  console.error(JSON.stringify(errorReport, null, 2));
  sendAdminAlert('System Error', JSON.stringify(errorReport, null, 2));

  // Optional: Send to external monitoring service
  // sendToExternalMonitoring(errorReport);
}
```

## 🆘 Troubleshooting Quick Fixes

### Critical Issues (v1.0.1 Updates)

**Ranking Display Bug** (FIXED)

```javascript
// If you encounter "#{index + 1}" display issue:
// 1. Clear browser cache completely
// 2. Force refresh with Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
// 3. Use incognito mode to test
// 4. Verify latest code is deployed on GitHub
```

**Mobile Display Issues** (FIXED)

```css
/* Enhanced mobile responsiveness now included */
/* Headers now scale properly on screens <400px */
/* Text wrapping issues resolved */
```

**Trigger Not Running**

```javascript
// Delete and recreate triggers
ScriptApp.getProjectTriggers().forEach((trigger) => ScriptApp.deleteTrigger(trigger));
setupDailyMasterTrigger();
```

**GitHub Integration Failing**

```javascript
// Test GitHub connection
testGitHubToken();
// Check repository permissions
// Ensure token has 'repo' scope
```

**Email System Issues**

```javascript
// Test with admin email only
testEmailSending();
// Check Gmail API quotas in Google Cloud Console
```

**Browser Compatibility**

```javascript
// v1.0.1 improvements:
// - Replaced complex template literals with string concatenation
// - Enhanced cross-browser compatibility
// - Better error handling for template rendering
```

### Support Resources

- [Complete Troubleshooting Guide](TROUBLESHOOTING.md) - Updated with v1.0.1 fixes
- [API Reference](API_REFERENCE.md)
- [Technical Documentation](TECHNICAL_DOCUMENTATION.md) - Enhanced with SaaS roadmap

---

## 📞 Support

For setup assistance or technical issues:

- **Admin**: aditya.garg.2006@gmail.com
- **Documentation**: [Complete Tech Docs](TECHNICAL_DOCUMENTATION.md)
- **Repository**: [GitHub Repo](https://github.com/adigunners/adigunners.github.io)

---

_Setup completed? Try running `dailyMasterProcess()` to test the full system!_
