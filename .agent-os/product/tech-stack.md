# Technical Stack

> Last Updated: 2025-08-27
> Version: 1.0.0

## Architecture Overview

**Deployment Model**: Hybrid static frontend with serverless backend automation

**Core Philosophy**: Maximum reliability with minimal infrastructure complexity

## Frontend Stack

### Application Framework

- **Framework**: Static HTML/CSS/JavaScript (Vanilla)
- **Deployment**: GitHub Pages (99.9% uptime SLA)
- **Architecture**: Modular component system with 85% code deduplication

### CSS Architecture

- **Methodology**: Component-based modular CSS
- **File Structure**: 15 specialized CSS modules
  - `variables.css` - Design tokens and CSS custom properties
  - `base.css` - Base styles and typography
  - `header.css` - Navigation and countdown components
  - `responsive.css` - Responsive design patterns
  - `mobile-optimizations.css` - Mobile-first enhancements
  - `advanced-mobile.css` - Ultra-compact mobile experience
- **Responsive Strategy**: Mobile-first with progressive enhancement
- **Browser Support**: Modern browsers (2018+), ES6+ compatibility

### JavaScript Framework

- **Approach**: Vanilla JavaScript with ES6+ features
- **Modules**: 10+ specialized JavaScript modules
  - `utils.js` - Shared utility functions
  - `data-loader.js` - API integration and caching
  - `countdown.js` - Deadline countdown system
  - `winner-table.js` - Winner rankings display
  - `ui-manager.js` - User interface management
- **State Management**: URL parameters and localStorage for persistence
- **Performance**: Debounced event handlers, efficient DOM manipulation

## Backend Infrastructure

### Primary Backend

- **Platform**: Google Apps Script
- **Language**: JavaScript (V8 runtime)
- **Execution**: Cloud-based serverless functions
- **Advantages**:
  - Native Google Sheets integration
  - Built-in authentication and authorization
  - Generous free tier limits
  - Robust error handling and logging

### Database System

**Current**: Google Sheets (Production-proven)

- **Master Spreadsheet**: "IIM Mumbai FPL Master Database"
- **Structure**:
  - Players Tab - Registration and player data
  - Weekly Scores Tab - Gameweek-by-gameweek scoring
  - Weekly Winners Tab - Prize winner tracking
  - Monthly Winners Tab - Monthly prize calculations
  - Prize Tracking Tab - Payment and distribution status
  - Settings Tab - Configuration and parameters

**Future Migration Path**: PostgreSQL/MongoDB for multi-league scaling

### External APIs

#### FPL API Integration

- **Primary**: Official Fantasy Premier League API
- **Endpoints**:
  - Player data and statistics
  - Gameweek deadlines and fixtures
  - League standings and scores
- **Rate Limiting**: Respectful API usage with caching strategies
- **Fallbacks**: Cached data and graceful degradation

#### GitHub API Integration

- **Purpose**: Automated website data updates
- **Authentication**: Personal Access Tokens with repository scope
- **Operations**:
  - JSON file updates in `data/` directory
  - Automated commits with proper attribution
  - Branch protection and conflict resolution

## Development Tools

### Code Quality

- **Formatting**: Prettier for consistent code style
- **Git Hooks**: Husky for pre-commit formatting
- **Linting**: ESLint for JavaScript quality
- **Testing**: Manual testing with URL parameter system

### Local Development

- **Server**: Python HTTP server (`python3 -m http.server 8000`)
- **Hot Reload**: Manual refresh (static files)
- **Debugging**: Browser DevTools with comprehensive logging
- **Testing**: URL parameters for different modes and data sources

### Version Control

- **Repository**: Git with GitHub hosting
- **Branching**: Feature branches with pull request workflow
- **Documentation**: Comprehensive README and technical docs
- **Automation**: GitHub Actions for deployment pipeline

## Data Flow Architecture

### Primary Data Flow

```
FPL API → Google Apps Script → Google Sheets → GitHub API → JSON Files → Website
```

### Real-Time Updates

1. **Daily Automation**: Apps Script fetches FPL data at scheduled intervals
2. **Processing**: Calculate winners, update statistics, generate emails
3. **Database Update**: Update Google Sheets with new data
4. **Website Sync**: Push JSON updates to GitHub repository
5. **Live Website**: GitHub Pages serves updated data automatically

### Caching Strategy

- **Browser Caching**: Aggressive caching of CSS/JS assets
- **API Caching**: localStorage for countdown and deadline data
- **CDN**: GitHub Pages CDN for global content delivery
- **Fallbacks**: Graceful degradation when external APIs fail

## Security & Performance

### Security Measures

- **Input Sanitization**: `escapeHTML()` function prevents XSS attacks
- **API Keys**: Secured in Google Apps Script environment
- **Authentication**: Google OAuth for backend operations
- **HTTPS**: Enforced SSL/TLS via GitHub Pages

### Performance Optimizations

- **Asset Optimization**: Minified CSS/JS in production
- **Font Loading**: Preloaded fonts with fallback stacks
- **DNS Prefetching**: Early resolution of external domains
- **Lazy Loading**: Deferred loading of non-critical resources
- **Mobile-First**: Optimized for mobile performance

## Monitoring & Reliability

### Error Handling

- **Frontend**: Try-catch blocks with graceful fallbacks
- **Backend**: Comprehensive error logging in Apps Script
- **API Failures**: Multiple fallback strategies
- **User Feedback**: Clear error messages and retry mechanisms

### Monitoring

- **Uptime**: GitHub Pages 99.9% SLA
- **Performance**: Browser performance APIs for metrics
- **Error Tracking**: Console logging with debug modes
- **User Analytics**: Privacy-focused usage tracking

## Scalability Considerations

### Current Limitations

- **Single League**: Designed for one league (54 players)
- **Google Sheets**: Row limits (~100K rows per sheet)
- **Apps Script**: 6-minute execution time limits
- **Static Site**: No real-time server-side processing

### Scaling Strategy

**Phase 1 (Current)**: Optimize existing stack

- Better caching strategies
- Performance improvements
- Enhanced error handling

**Phase 2 (Multi-League)**: Database migration

- PostgreSQL/MongoDB for data persistence
- Node.js/Python backend for complex operations
- Redis for caching and session management

**Phase 3 (Enterprise)**: Full infrastructure

- Docker containerization
- Kubernetes orchestration
- CDN integration
- Advanced monitoring and alerting

## Cost Structure

### Current Costs (Production)

- **GitHub Pages**: Free tier (sufficient for current usage)
- **Google Apps Script**: Free tier (within limits)
- **Google Sheets**: Free tier (G Suite Basic sufficient)
- **Domain**: Optional custom domain (~$15/year)
- **Total Monthly Cost**: $0-5 USD

### Scaling Cost Projections

**Phase 2 (Multi-League)**:

- **Database Hosting**: $20-50/month (managed PostgreSQL)
- **Application Hosting**: $10-30/month (cloud hosting)
- **CDN**: $5-15/month (CloudFlare/AWS)
- **Total**: $35-95/month

**Phase 3 (Enterprise)**:

- **Infrastructure**: $200-1000/month (auto-scaling cloud)
- **Monitoring**: $50-200/month (comprehensive monitoring)
- **Support**: $100-500/month (24/7 support systems)
- **Total**: $350-1700/month

## Integration Capabilities

### Current Integrations

- **FPL API**: Live data synchronization
- **GitHub API**: Automated deployments
- **Google Services**: Sheets, Apps Script, Gmail
- **Browser APIs**: Local storage, responsive design APIs

### Future Integration Opportunities

- **Payment Processors**: Stripe, PayPal for automated fee collection
- **Communication**: Slack, Discord, WhatsApp for notifications
- **Social Media**: Twitter, Facebook for winner announcements
- **Analytics**: Google Analytics, Mixpanel for user insights
- **Mobile**: PWA capabilities, push notifications
