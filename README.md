# Fantasy Mini-League Management (FML)

**Automated fantasy football mini-league management system for any private or public group**

<a href="https://adigunners.github.io/" target="_blank" rel="noopener noreferrer">
  <img src="https://img.shields.io/badge/Live-Website-success?style=for-the-badge" alt="Live Website" />
</a>
<a href="https://adigunners.github.io/?test=true" target="_blank" rel="noopener noreferrer">
  <img src="https://img.shields.io/badge/Test-Demo-orange?style=for-the-badge" alt="Test Demo" />
</a>

---

## 🎯 What This Project Does

This system automatically manages a complete fantasy football mini-league for any group, club, or organization (scalable to multiple leagues):

- **🔄 Automated Data Processing** - Fetches live FPL scores and calculates winners
- **💰 Prize Management** - Tracks weekly/monthly period prizes and payments
- **📧 Email Notifications** - Sends personalized league updates and countdown campaigns to all players
- **🌐 Live Website** - Real-time leaderboards and winner statistics
- **📊 Admin Dashboard** - Complete league management in Google Sheets

## 🚀 Live Features

### For Players

- Automatic score tracking from official FPL API
- Weekly and monthly period prize calculations
- Personalized email updates with league standings
- Live website with winner leaderboards and paginated rankings

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

- **~60 Active Players** from IIM Mumbai alumni network
- **Prize Pool** (₹3,000 entry fee per player)
- **Automated Processing** of 38 gameweeks per season
- **Weekly & Monthly Period Prizes** with automated calculations

## 🎮 Try the Demo

Experience the system with realistic test data:

**[📱 Live Demo](https://adigunners.github.io/?test=true)** - See the system in action with test winner data  
_💡 Tip: Right-click links to open in new tab_

## 📚 Documentation

| Document                                                      | Purpose                                                 |
| ------------------------------------------------------------- | ------------------------------------------------------- |
| [🔧 Technical Documentation](docs/TECHNICAL_DOCUMENTATION.md) | Complete system architecture and implementation details |
| [⚙️ Setup Guide](docs/SETUP_GUIDE.md)                         | Step-by-step deployment instructions                    |
| [📖 API Reference](docs/API_REFERENCE.md)                     | All functions, endpoints, and configurations            |
| 🆘 Troubleshooting (Admin Only)                               | Maintained in the private fml-admin-docs repository     |
| [📝 Changelog](docs/CHANGELOG.md)                             | Version history and updates                             |
| [🔬 Game Month Research](docs/GAME_MONTH_RESEARCH.md)         | Research on monthly period definitions and terminology  |

## 🚀 Quick Start

### For Admins

```javascript
// Daily league processing (run once per day)
dailyMasterProcess();

// Manual winner stats update
manualUpdateWinnerStats();

// Send test emails
testEmailSending();
```

### For Developers

```javascript
// Set up test environment
setupCompleteTestDemo();

// Check system status
checkTestDataStatus();

// Clean up test data
cleanupTestDataDirect();
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

### 📧 Countdown Email System

- **5-day countdown campaign** for registration deadlines with escalating urgency
- **Smart personalization** with intelligent name handling for greetings
- **Day 0 enhancement** shows "6 HOURS REMAINING" with blinking animation
- **Mobile-responsive design** with optimized layouts for all devices
- **Professional FPL branding** with official colors and styling

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

- **Weekly Prizes**: 1st and 2nd prizes
- **Monthly Period Prizes**: 1st and 2nd prizes (awarded every 4 gameweeks)
- **Season Prizes**: Top 10 players share remaining prize pool
- **Entry Fee**: ₹3,000 per player

## 🤝 Contributing

This project is currently in private development for IIM Mumbai alumni. For technical discussions or collaboration opportunities, please reach out via the contact information below.

## 📧 Contact

**Project Admin**: Aditya Garg

- Email: aditya.garg.2006@gmail.com
- Based in: Amsterdam, NL
- Role: Chief Mini-League Manager (CML)

## 🏗 Project Status

**Current Phase**: Active Season Management (2025-26) | **Version**: 1.0.4

- ✅ Player registration completed (registration closes on 15th Aug)
- ✅ Automated processing live
- ✅ Email system operational
- ✅ Website deployment successful
- ✅ UI/UX consistency improvements deployed
- ✅ Performance optimizations implemented
- 🔄 Weekly/monthly period winner calculations ongoing

---

## 📱 Quick Links

> 💡 **Tip:** Right-click any link below and select "Open in new tab" to keep this README open

- **[🌐 Live Website](https://adigunners.github.io/)** - Current league standings
- **[🧪 Test Demo](https://adigunners.github.io/?test=true)** - Experience with sample data
- **[🏆 Winner Leaderboard](https://adigunners.github.io/winners.html)** - Complete winner rankings (paginated)
- **[📖 Technical Docs](docs/TECHNICAL_DOCUMENTATION.md)** - Full implementation details

---

_Built with ❤️ for the FPL mini-league managers community_

Note: Troubleshooting content is maintained exclusively in the private admin repository (fml-admin-docs) and not in this public repo.
