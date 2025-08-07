# 🏆 IIM Mumbai Fantasy Premier League

**Automated fantasy football league management system for IIM Mumbai alumni**

[![Live Website](https://img.shields.io/badge/Live-Website-success?style=for-the-badge)](https://adigunners.github.io/)
[![Test Demo](https://img.shields.io/badge/Test-Demo-orange?style=for-the-badge)](https://adigunners.github.io/?test=true)

---

## 🎯 What This Project Does

This system automatically manages a complete fantasy football league for 26+ IIM Mumbai alumni:

- **🔄 Automated Data Processing** - Fetches live FPL scores and calculates winners
- **💰 Prize Management** - Tracks weekly/monthly prizes and payments
- **📧 Email Notifications** - Sends personalized league updates to all players
- **🌐 Live Website** - Real-time leaderboards and winner statistics
- **📊 Admin Dashboard** - Complete league management in Google Sheets

## 🚀 Live Features

### For Players
- Automatic score tracking from official FPL API
- Weekly and monthly prize calculations
- Personalized email updates with league standings
- Live website with winner leaderboards

### For Admins
- One-click league processing with `dailyMasterProcess()`
- Automated winner calculations with tie-handling
- Prize tracking with payment status management
- Email system with beautiful HTML templates

## 🛠 Tech Stack

- **Backend**: Google Apps Script (JavaScript)
- **Database**: Google Sheets
- **Frontend**: Static HTML/CSS/JavaScript
- **Hosting**: GitHub Pages
- **Email**: Gmail API
- **Data Source**: Official FPL API

## 📈 Current Scale

- **26 Active Players** from IIM Mumbai alumni network
- **₹78,000 Prize Pool** (₹3,000 entry fee per player)
- **Automated Processing** of 38 gameweeks per season
- **Weekly & Monthly Prizes** with automated calculations

## 🎮 Try the Demo

Experience the system with realistic test data:

**[📱 Live Demo](https://adigunners.github.io/?test=true)** - See the system in action with test winner data

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [🔧 Technical Documentation](docs/TECHNICAL_DOCUMENTATION.md) | Complete system architecture and implementation details |
| [⚙️ Setup Guide](docs/SETUP_GUIDE.md) | Step-by-step deployment instructions |
| [📖 API Reference](docs/API_REFERENCE.md) | All functions, endpoints, and configurations |
| [🔍 Troubleshooting](docs/TROUBLESHOOTING.md) | Common issues and solutions |
| [📝 Changelog](docs/CHANGELOG.md) | Version history and updates |

## 🚀 Quick Start

### For Admins
```javascript
// Daily league processing (run once per day)
dailyMasterProcess()

// Manual winner stats update
manualUpdateWinnerStats()

// Send test emails
testEmailSending()
```

### For Developers
```javascript
// Set up test environment
setupCompleteTestDemo()

// Check system status
checkTestDataStatus()

// Clean up test data
cleanupTestDataDirect()
```

## 🎯 Key Features

### ⚡ Automated Workflows
- **Daily processing** of FPL scores and winner calculations
- **Tie-handling** for multiple winners with prize splitting
- **Email automation** with personalized content for each player
- **Website updates** via GitHub API integration

### 💎 Professional Features
- **Prize tracking** with payment status management
- **Admin notifications** for errors and important events
- **Data validation** against official FPL API
- **Comprehensive logging** for debugging and monitoring

### 🧪 Testing & Demo System
- **Test mode** with realistic demo data for presentations
- **Safe testing environment** that doesn't affect live data
- **Email testing** with admin-only delivery
- **Easy cleanup** functions for resetting test state

## 🔗 System Integration

### External APIs
- **FPL Official API** - Live player scores and gameweek data
- **GitHub API** - Automated website updates
- **Gmail API** - Email delivery system

### Data Flow
```
FPL API → Google Sheets → Winner Calculations → Email System → Website Updates
```

## 📊 Prize Structure

- **Weekly Prizes**: ₹500 (1st place), ₹300 (2nd place)
- **Monthly Prizes**: ₹1000 (1st place), ₹700 (2nd place)  
- **Season Prizes**: Top 10 players share remaining prize pool
- **Entry Fee**: ₹3,000 per player

## 🤝 Contributing

This project is currently in private development for IIM Mumbai alumni. For technical discussions or collaboration opportunities, please reach out via the contact information below.

## 📧 Contact

**Project Admin**: Aditya Garg
- Email: aditya.garg.2006@gmail.com
- Based in: Amsterdam, NL
- Role: Principal Pricing Manager at Just Eat Takeaway.com

## 🏗 Project Status

**Current Phase**: Active Season Management (2025-26)
- ✅ Player registration completed (26 players)
- ✅ Automated processing live
- ✅ Email system operational
- ✅ Website deployment successful
- 🔄 Weekly/monthly winner calculations ongoing

---

## 📱 Quick Links

- **[Live Website](https://adigunners.github.io/)** - Current league standings
- **[Test Demo](https://adigunners.github.io/?test=true)** - Experience with sample data
- **[Winner Leaderboard](https://adigunners.github.io/winners.html)** - Complete winner rankings
- **[Technical Docs](docs/TECHNICAL_DOCUMENTATION.md)** - Full implementation details

---

*Built with ❤️ for the IIM Mumbai alumni community*