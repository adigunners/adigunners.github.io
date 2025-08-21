# 📡 API Reference - IIM Mumbai FPL League

**Public API endpoints and data structures for the fantasy league management system.**

---

## 🌐 Public Data Endpoints

### Live Data URLs

All data is served as JSON from GitHub Pages:

#### **League Statistics**

```
GET https://adigunners.github.io/data/league_stats.json
```

**Response Format:**

```json
{
  "playerCount": 54,
  "potAmount": 162000,
  "lastUpdated": "2025-08-21T10:30:00Z",
  "status": "live"
}
```

#### **Winner Statistics**

```
GET https://adigunners.github.io/data/winner_stats.json
```

**Response Format:**

```json
{
  "summary": {
    "completedGameweeks": 38,
    "completedMonths": 10,
    "totalWinners": 54,
    "totalPrizeDistributed": 57986
  },
  "winners": [
    {
      "playerName": "Player Name",
      "totalPrizeWon": 7112,
      "highlights": {
        "gameWeeks": 10,
        "gameMonths": 3,
        "overallRank": 2,
        "totalPoints": 2773
      }
    }
  ]
}
```

#### **Next Deadline**

```
GET https://adigunners.github.io/data/next_deadline.json
```

**Response Format:**

```json
{
  "deadline": "2025-08-30T18:30:00Z",
  "gameweek": 2,
  "timeRemaining": {
    "days": 9,
    "hours": 8,
    "minutes": 30,
    "seconds": 15
  }
}
```

#### **Test Data** (for development)

```
GET https://adigunners.github.io/data/test_winner_stats.json
```

---

## 🔧 URL Parameters

### Query Parameters

The website supports these URL parameters for testing and customization:

| Parameter     | Values                  | Description                       |
| ------------- | ----------------------- | --------------------------------- |
| `test`        | `true`, `false`         | Enable demo mode with test data   |
| `data`        | `test`, `live`, `auto`  | Force specific data source        |
| `phase`       | `pre`, `season`, `auto` | Control UI state display          |
| `clockOffset` | `number` (ms)           | Time offset for countdown testing |
| `debug`       | `1`, `0`                | Enable console logging            |

**Examples:**

```
https://adigunners.github.io/?test=true
https://adigunners.github.io/?data=test&phase=season
https://adigunners.github.io/winners.html?debug=1
```

---

## 📊 Data Structures

### Player Object

```typescript
interface Player {
  playerName: string;
  totalPrizeWon: number;
  highlights: {
    gameWeeks: number;
    gameMonths: number;
    overallRank: number;
    totalPoints: number;
  };
}
```

### League Statistics

```typescript
interface LeagueStats {
  playerCount: number;
  potAmount: number;
  lastUpdated: string; // ISO 8601 format
  status: 'live' | 'test' | 'offline';
}
```

### Winner Summary

```typescript
interface WinnerSummary {
  completedGameweeks: number;
  completedMonths: number;
  totalWinners: number;
  totalPrizeDistributed: number;
}
```

---

## 🔄 Update Frequency

### Automatic Updates

- **League Statistics**: Updated every hour
- **Winner Data**: Updated daily at 2:00 AM UTC
- **Countdown Data**: Updated every hour
- **Test Data**: Updated manually for development

### Cache Headers

All JSON endpoints return proper cache headers:

- `Cache-Control: public, max-age=3600` (1 hour)
- `Last-Modified`: File modification timestamp
- `ETag`: Content hash for efficient caching

---

## 🧪 Testing Integration

### Test Mode

When `?test=true` is used:

- Loads `test_winner_stats.json` instead of live data
- Displays admin badges and debug information
- Preserves countdown functionality with test data
- Safe for development without affecting live users

### CORS Support

All endpoints support Cross-Origin Resource Sharing (CORS):

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
Access-Control-Allow-Headers: Content-Type
```

---

## 📱 Responsive Breakpoints

### CSS Media Queries

The website adapts to different screen sizes:

- **Desktop**: `≥1025px` - Full table layouts
- **Tablet**: `701px - 1024px` - 2-column card grids
- **Mobile**: `≤700px` - Single-column cards
- **Compact Mobile**: `≤600px` - Ultra-compact layouts
- **Tiny Screens**: `≤360px` - Minimal spacing

---

## 🔐 Rate Limiting

### GitHub Pages Limits

- **Bandwidth**: 100GB per month
- **Build Time**: 10 minutes per build
- **File Size**: 100MB maximum per file
- **Repository Size**: 1GB maximum

### Best Practices

- Cache responses locally when possible
- Use appropriate `If-Modified-Since` headers
- Implement exponential backoff for failed requests
- Respect GitHub's rate limiting guidelines

---

## 📞 Support

For API issues or integration support:

- **Documentation**: [Technical Documentation](TECHNICAL_DOCUMENTATION.md)
- **Repository**: [GitHub Issues](https://github.com/adigunners/adigunners.github.io/issues)
- **Live Site**: [https://adigunners.github.io/](https://adigunners.github.io/)

---

_This API is read-only and designed for public consumption of league statistics and winner data._
