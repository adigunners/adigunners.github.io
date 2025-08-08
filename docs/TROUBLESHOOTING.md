# 🔍 Troubleshooting Guide - IIM Mumbai FPL League

**Solutions to common issues and debugging procedures for the fantasy league management system.**

---

## 🚨 Critical Issues (Immediate Action Required)

### 1. Daily Processing Not Running

**Symptoms:**
- No new winner data for completed gameweeks
- Players complaining about missing emails
- Website shows outdated information

**Diagnosis:**
```javascript
// Check trigger status
checkTriggers()

// Check last processed gameweek
const ss = SpreadsheetApp.getActiveSpreadsheet()
const settingsSheet = ss.getSheetByName("Settings")
const lastProcessed = settingsSheet.getRange("B49").getValue()
console.log("Last processed GW:", lastProcessed)

// Check current gameweek
const currentGW = getCurrentGameweek()
console.log("Current GW:", currentGW)
```

**Solutions:**

#### **Option A: Trigger Missing/Broken**
```javascript
// Delete all triggers and recreate
ScriptApp.getProjectTriggers().forEach(trigger => 
  ScriptApp.deleteTrigger(trigger))

// Recreate daily trigger
setupDailyMasterTrigger()

// Verify trigger created
checkTriggers()
```

#### **Option B: Manual Processing**
```javascript
// Run processing manually for missed gameweeks
// Example: if last processed was GW3 and current is GW5
dailyMasterProcess() // This will process GW4
// Wait for completion, then run again for GW5
dailyMasterProcess() // This will process GW5
```

#### **Option C: Script Quota Exceeded**
- **Check**: Apps Script dashboard for quota usage
- **Solution**: Wait for quota reset (next day) or upgrade to paid plan
- **Prevention**: Optimize code to reduce API calls

---

### 2. GitHub Integration Failure

**Symptoms:**
- Website shows old winner data
- JSON files not updating
- "GitHub integration not configured" errors

**Diagnosis:**
```javascript
testGitHubToken() // Should show token found
```

**Solutions:**

#### **Token Issues**
```javascript
// 1. Check if token exists
const token = PropertiesService.getScriptProperties().getProperty("GITHUB_TOKEN")
console.log("Token exists:", token ? "Yes" : "No")

// 2. If missing, add new token
PropertiesService.getScriptProperties().setProperty("GITHUB_TOKEN", "ghp_your_new_token_here")

// 3. Test again
testGitHubToken()
```

#### **Repository Access Issues**
- **Check**: Repository is public or token has correct permissions
- **Fix**: Go to GitHub Settings → Developer Settings → Personal Access Tokens
- **Permissions needed**: `repo` (full repository access)

#### **Manual Website Update**
```javascript
// Force update league stats
updateLeagueStatsOnGitHub()

// Force update winner data
manualUpdateWinnerStats()
```

---

### 3. Email System Failure

**Symptoms:**
- Players not receiving weekly/monthly emails
- Admin not getting processing confirmations
- Email-related error messages in logs

**Diagnosis:**
```javascript
// Test email system
testEmailSending() // Should send test emails to admin
```

**Solutions:**

#### **Gmail Quota Exceeded**
- **Daily Limit**: 100 emails per day via Apps Script
- **Solution**: Wait for next day or upgrade to Google Workspace
- **Prevention**: Monitor email volume, batch processing

#### **Template Issues**
```javascript
// Test with simple email first
MailApp.sendEmail({
  to: "aditya.garg.2006@gmail.com",
  subject: "Test Email",
  body: "This is a test email to verify email functionality."
})
```

#### **Player Data Issues**
```javascript
// Check for invalid email addresses in Players sheet
const ss = SpreadsheetApp.getActiveSpreadsheet()
const playersSheet = ss.getSheetByName("Players")
const players = playersSheet.getDataRange().getValues().slice(1)

players.forEach((player, index) => {
  const email = player[1]
  if (!email || !email.includes("@")) {
    console.log(`Invalid email at row ${index + 2}: ${email}`)
  }
})
```

---

## ⚠️ Moderate Issues (Plan for Fix)

### 4. CORS Proxy Failures (New Aug 2024)

**Symptoms:**
- Countdown clock not appearing on website
- Console shows "All CORS proxies failed, using fallback date"
- Fallback date appears to be in the past, hiding countdown

**Diagnosis:**
```javascript
// Check browser console for these error messages:
// "❌ Proxy 1 failed: ..."
// "❌ Proxy 2 failed: ..."
// "All CORS proxies failed, using fallback date"
```

**Root Cause:**
Third-party CORS proxies used to fetch FPL API data become unreliable or change their policies.

**Solutions:**

#### **Option A: Update Fallback Date (Quick Fix)**
```javascript
// In index.html, update both fallback dates:
const fallbackDate = new Date("2025-08-15T17:30:00Z"); // Update to current season's GW1
```

#### **Option B: Add New CORS Proxy**
```javascript
// In loadFPLSeasonData(), add new proxy to array:
const corsProxies = [
  "https://api.allorigins.win/raw?url=" + encodeURIComponent("https://fantasy.premierleague.com/api/bootstrap-static/"),
  "https://corsproxy.io/?" + encodeURIComponent("https://fantasy.premierleague.com/api/bootstrap-static/"),
  "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent("https://fantasy.premierleague.com/api/bootstrap-static/"),
  "https://new-proxy.com/api?url=" + encodeURIComponent("https://fantasy.premierleague.com/api/bootstrap-static/") // Add new proxy
];
```

#### **Option C: Server-Side Solution (Long-term)**
- Set up your own CORS proxy server
- Use backend service to fetch FPL data
- Update API endpoints to point to your server

**Prevention:**
- Monitor CORS proxy uptime
- Keep fallback dates updated each season
- Test countdown functionality regularly

---

### 5. FPL API Rate Limiting

**Symptoms:**
- Some player scores showing as 0 or null
- "Unable to fetch gameweek data" errors
- Inconsistent score updates

**Solutions:**

#### **Increase Delays**
```javascript
// In fetchGameweekScores function, increase delay
Utilities.sleep(500) // Increase from 200ms to 500ms
```

#### **Batch Processing**
```javascript
// Process players in smaller batches
const batchSize = 10
for (let i = 0; i < activePlayers.length; i += batchSize) {
  const batch = activePlayers.slice(i, i + batchSize)
  // Process batch
  Utilities.sleep(2000) // Longer delay between batches
}
```

#### **Manual Score Entry**
- **Temporary Fix**: Manually enter scores in Weekly Scores sheet
- **Then run**: `updateOverallStandings()` and `calculateWeeklyWinners(gameweek)`

---

### 5. Winner Calculation Errors

**Symptoms:**
- Wrong players showing as winners
- Incorrect prize amounts
- Duplicate winner entries

**Diagnosis:**
```javascript
// Check winner calculations for specific gameweek
const ss = SpreadsheetApp.getActiveSpreadsheet()
const winnersSheet = ss.getSheetByName("Weekly Winners")
const data = winnersSheet.getDataRange().getValues()
console.log("Winners data:", data)
```

**Solutions:**

#### **Duplicate Winners**
```javascript
// Clear duplicate entries
const winnersSheet = ss.getSheetByName("Weekly Winners")
// Manually delete duplicate rows, then:
calculateWeeklyWinners(gameweek) // Recalculate
```

#### **Incorrect Scores**
```javascript
// Verify scores in Weekly Scores sheet match FPL
// If incorrect, update manually then:
updateOverallStandings()
calculateWeeklyWinners(gameweek)
```

#### **Prize Calculation Issues**
```javascript
// Check prize settings
const settingsSheet = ss.getSheetByName("Settings")
const prize1 = settingsSheet.getRange("B18").getValue()
const prize2 = settingsSheet.getRange("B19").getValue()
console.log("Weekly prizes:", prize1, prize2)
```

---

### 6. Website Display Issues

**Symptoms:**
- Website showing "Loading..." indefinitely
- Test mode not working
- Winner data not displaying correctly
- Ranking showing as "#{index + 1}" instead of numbers
- Mobile title wrapping issues

**Solutions:**

#### **Ranking Display Fix (CRITICAL - Fixed in v1.0.1)**
**Problem**: Winner table showing "#{index + 1}" instead of actual rank numbers (1, 2, 3, etc.)

**Root Cause**: Template literal parsing issues in certain browsers

**Solution Applied**:
```javascript
// OLD (Problematic) - Template literal approach
const tableHTML = `
  <td class="winner-rank">${index + 1}</td>
`;

// NEW (Fixed) - Explicit string concatenation
let tableHTML = '<table class="winner-table">';
tableHTML += '<thead><tr><th>Rank</th>...</tr></thead>';
sortedWinners.forEach((winner, index) => {
  const rank = index + 1;
  tableHTML += `<td class="winner-rank">${rank}</td>`;
});
tableHTML += '</table>';
```

**If Issue Persists**:
1. **Force Browser Refresh**: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
2. **Clear Browser Cache**: Chrome → Settings → Privacy → Clear browsing data
3. **Use Incognito Mode**: Test if issue is cache-related
4. **Check GitHub Deployment**: Ensure latest code is pushed to repository

#### **Mobile Display Issues**
**Problem**: Title text wrapping on small screens, poor mobile experience

**Solutions Applied (v1.0.1)**:
```css
/* Enhanced mobile responsiveness */
@media (max-width: 500px) {
  header h1 {
    font-size: 1.6rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (max-width: 400px) {
  header h1 {
    font-size: 1.4rem;
    letter-spacing: -0.5px;
  }
}

@media (max-width: 350px) {
  header h1 {
    font-size: 1.2rem;
    letter-spacing: -1px;
  }
}
```

#### **Browser Compatibility Issues**
**Problem**: Different browsers rendering templates inconsistently

**Prevention Strategy**:
- Use explicit string concatenation over complex template literals
- Test across Chrome, Safari, Firefox, and mobile browsers
- Implement progressive enhancement for CSS features

#### **JSON File Issues**
```javascript
// Regenerate JSON files
manualUpdateWinnerStats()
updateLeagueStatsOnGitHub()

// Check files exist on GitHub:
// https://raw.githubusercontent.com/adigunners/adigunners.github.io/main/winner_stats.json
// https://raw.githubusercontent.com/adigunners/adigunners.github.io/main/league_stats.json
```

#### **Test Mode Not Working**
- **Check URL**: Must include `?test=true` parameter
- **Check File**: Ensure `test_winner_stats.json` exists on GitHub
- **Browser Cache**: Hard refresh (Ctrl+F5 or Cmd+Shift+R)
- **Console Errors**: Check browser developer tools for JavaScript errors

#### **Cache-Related Issues**
**Advanced Cache Busting**:
```javascript
// Add timestamp to JSON requests
const winnerUrl = isTestMode
  ? `test_winner_stats.json?cache=${new Date().getTime()}`
  : `winner_stats.json?cache=${new Date().getTime()}`;
```

**Manual Cache Clear**:
1. **Chrome**: F12 → Network Tab → Disable cache checkbox
2. **Safari**: Develop → Empty Caches
3. **Firefox**: Ctrl+Shift+Delete → Clear cache

#### **CORS Issues**
- **Problem**: Browser blocking JSON requests
- **Solution**: GitHub Pages should handle CORS correctly
- **Test**: Open browser developer tools and check Network tab for errors
- **Fallback**: Use CORS proxy if needed (already implemented for FPL API)

---

## 🔧 Minor Issues (Low Priority)

### 7. Sheet Formatting Issues

**Symptoms:**
- Dates showing as numbers
- Currency not displaying correctly
- Month showing as "December 1899"

**Solutions:**

#### **Date Formatting**
```javascript
// Fix date columns
const sheet = ss.getSheetByName("Prize Tracking")
const dateColumn = sheet.getRange("G:G") // Payout Date column
dateColumn.setNumberFormat("dd/mm/yyyy")
```

#### **Currency Formatting**
```javascript
// Fix prize amount columns
const prizeColumn = sheet.getRange("E:E") // Prize Amount column
prizeColumn.setNumberFormat("₹#,##0")
```

#### **Month Display Fix**
```javascript
// Run this to fix month display in Monthly Winners
fixMonthlyWinnersSheetFormatting()
```

---

### 8. Performance Issues

**Symptoms:**
- Scripts running slowly
- Timeout errors
- High execution time

**Solutions:**

#### **Optimize Data Access**
```javascript
// Instead of multiple getRange() calls:
const data = sheet.getDataRange().getValues() // Get all data once
// Then work with the array in memory

// Instead of multiple setValue() calls:
const updates = []
// Build array of updates, then:
sheet.getRange(1, 1, updates.length, updates[0].length).setValues(updates)
```

#### **Reduce API Calls**
```javascript
// Cache API responses
const cachedData = CacheService.getScriptCache()
const cacheKey = `fpl_gw_${gameweek}`
let data = cachedData.get(cacheKey)
if (!data) {
  data = fetchFromAPI()
  cachedData.put(cacheKey, JSON.stringify(data), 3600) // Cache for 1 hour
}
```

---

## 🧪 Testing & Development Issues

### 9. Test Data Problems

**Symptoms:**
- Test data not generating correctly
- Test emails going to real players
- Test data interfering with live data

**Solutions:**

#### **Test Data Generation Issues**
```javascript
// Clear and regenerate test data
cleanupTestDataDirect()
setupCompleteTestDemo()
checkTestDataStatus()
```

#### **Test Emails Safety**
```javascript
// Verify test mode
console.log("Test mode email recipient:", TEST_CONFIG.ADMIN_EMAIL)
// Should only be: aditya.garg.2006@gmail.com
```

#### **Data Separation Issues**
```javascript
// Ensure test uses separate files
console.log("Test JSON file:", TEST_GITHUB_CONFIG.FILE_PATH)
// Should be: test_winner_stats.json (not winner_stats.json)
```

---

### 10. Development Environment Issues

**Symptoms:**
- Code not saving in Apps Script
- Functions not appearing in execution log
- Permissions errors

**Solutions:**

#### **Apps Script Permissions**
- **Problem**: Script needs authorization
- **Fix**: Run any function manually to trigger authorization flow
- **Grant**: All requested permissions

#### **Code Deployment Issues**
```javascript
// Ensure all code is saved
// Check for syntax errors in each file
// Test basic functions first:
testGitHubToken()
getCurrentGameweek()
```

---

## 📊 Monitoring & Prevention

### Daily Health Checks

#### **Morning Checklist**
```javascript
// 1. Check triggers are active
checkTriggers()

// 2. Verify last processing
getCurrentGameweek()
// Check Settings B49 for last processed GW

// 3. Check GitHub integration
testGitHubToken()

// 4. Verify website updates
// Visit: https://adigunners.github.io/
```

#### **Weekly Health Checks**
```javascript
// 1. Review winner calculations
createWinnerSummarySheet()

// 2. Check payment status
getPaymentSummary()

// 3. Validate data integrity
validateSheetStructure()

// 4. Test email system
testEmailSending()
```

### Preventive Measures

#### **Backup Strategy**
- **Google Sheets**: Automatic version history (File → Version History)
- **Apps Script**: Export code regularly to GitHub
- **Data Export**: Monthly CSV backups of key sheets

#### **Monitoring Setup**
```javascript
// Enhanced admin alerts
function sendHealthCheck() {
  const status = {
    triggers: checkTriggers().length,
    lastProcessed: settingsSheet.getRange("B49").getValue(),
    currentGW: getCurrentGameweek(),
    githubToken: testGitHubToken()
  }
  
  sendAdminAlert("Daily Health Check", JSON.stringify(status, null, 2))
}
```

---

## 🆘 Emergency Procedures

### System Down Scenarios

#### **Complete System Failure**
1. **Immediate**: Switch to manual operations
2. **Notify**: Send manual email to league participants
3. **Diagnose**: Follow troubleshooting steps above
4. **Restore**: Use backup data if needed

#### **Data Corruption**
```javascript
// Nuclear option - reset everything
resetToFreshState()

// Then restore from backups:
// 1. Import player data from Form Responses
processNewRegistrations()

// 2. Manually enter any scores that were processed
// 3. Recalculate winners
// 4. Update website
```

### Contact Information

#### **Primary Support**
- **Email**: aditya.garg.2006@gmail.com
- **Response Time**: 24-48 hours
- **Timezone**: Europe/Amsterdam (CET/CEST)

#### **Emergency Contact**
- **WhatsApp**: Available via IIM Mumbai FPL group
- **Response Time**: Same day during business hours

---

## 📋 Error Log Template

When reporting issues, please provide:

```
**Issue Description:**
[Brief description of the problem]

**When It Occurred:**
[Date and time]

**Functions Involved:**
[Which scripts/functions were running]

**Error Messages:**
[Copy exact error messages from execution logs]

**Diagnostic Information:**
Current GW: [from getCurrentGameweek()]
Last Processed: [from Settings B49]
Trigger Status: [from checkTriggers()]
GitHub Token: [from testGitHubToken()]

**Steps Already Tried:**
[List what you've already attempted]

**Urgency Level:**
Critical / Moderate / Low

**Additional Context:**
[Any other relevant information]
```

---

*For issues not covered in this guide, consult the [Technical Documentation](TECHNICAL_DOCUMENTATION.md) or [API Reference](API_REFERENCE.md).*