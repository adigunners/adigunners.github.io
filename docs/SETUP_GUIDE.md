# ⚙️ Setup Guide - IIM Mumbai FPL League

**Basic deployment instructions for setting up the fantasy league management system.**

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ Google Account with access to Google Sheets and Apps Script
- ✅ GitHub account for website hosting
- ✅ Basic understanding of Google Apps Script and GitHub
- ✅ Admin access to the league's Google Form and responses

---

## 🏗 Basic Setup Overview

This is an automated Fantasy Premier League management system with the following components:

### Core Architecture

- **Google Sheets**: Database for players, scores, winners, and settings
- **Google Apps Script**: Backend automation and data processing
- **GitHub Pages**: Static website hosting
- **FPL API**: Official data source for player scores

### Website Features

- Live countdown to registration deadline
- Real-time leaderboard and winner displays
- Responsive design (desktop, tablet, mobile)
- Test mode for development and demos

---

## 🌐 GitHub Pages Setup

### Step 1: Create Repository

1. Create repository named: `{yourusername}.github.io`
2. Make it **public** (required for free GitHub Pages)
3. Initialize with README

### Step 2: Upload Website Files

Upload these files to your repository:

```
├── index.html (Main landing page)
├── winners.html (Winner leaderboard page)
├── css/ (Styling files)
├── js/ (JavaScript functionality)
├── data/ (JSON data files - auto-generated)
└── docs/ (Documentation)
```

### Step 3: Enable GitHub Pages

1. Go to Settings → Pages
2. Source: Deploy from branch
3. Branch: main / (root)
4. Save and verify deployment

---

## 📱 Website Features

### Responsive Design

- **Desktop (≥1025px)**: Full table layouts
- **Tablet (701-1024px)**: 2-column card layouts
- **Mobile (≤700px)**: Single-column cards

### URL Parameters

- `?test=true` - Demo mode with test data
- `?data=test|live|auto` - Force specific data source
- `?phase=pre|season|auto` - Control UI state
- `?clockOffset=ms` - Time offset for testing
- `?debug=1` - Console logging

### Data Integration

- `data/league_stats.json` - Player counts and prize pool
- `data/winner_stats.json` - Complete winner rankings
- `data/next_deadline.json` - Countdown deadline data

---

## 🔧 Basic Configuration

### Google Sheets Setup

Create a Google Sheet with these tabs:

- **Players** - Registration data
- **Weekly Scores** - Game week scores
- **Weekly Winners** - Prize winners
- **Settings** - Configuration values

### Apps Script Integration

1. Create Apps Script project from Google Sheets
2. Add the provided script files
3. Configure with your repository details
4. Set up automated triggers for daily processing

### GitHub Integration

- Generate Personal Access Token
- Configure in Script Properties as `GITHUB_TOKEN`
- Enable automatic JSON file updates

---

## ✅ Testing & Validation

### Test Mode

- Use `?test=true` URL parameter
- Displays demo data while preserving live functionality
- Safe testing environment for development

### Local Testing

```bash
# Serve the site locally
python3 -m http.server 8000
# Then visit: http://localhost:8000
```

---

## 🔧 Maintenance

### Daily Tasks

- Monitor automated processing logs
- Check website JSON updates
- Verify email delivery reports

### Weekly Tasks

- Review winner calculations
- Monitor system performance
- Check data accuracy

---

## 📞 Support

For detailed setup instructions and troubleshooting:

- **Documentation**: [Complete Tech Docs](TECHNICAL_DOCUMENTATION.md)
- **Collaboration**: [Git Workflow Guide](COLLABORATION_GUIDE.md)
- **Changes**: [Version History](CHANGELOG.md)
- **Repository**: [GitHub Pages Site](https://adigunners.github.io/)

---

## 🔒 Advanced Configuration

For detailed implementation guides, security configurations, and SaaS deployment instructions, please refer to the private administrator documentation.

---

_This system automatically processes Fantasy Premier League data and manages prize calculations for your league._
