# Quality Assurance Guide

## Header Update System Contract

**CONTRACT: Headers update only from winners data; season/countdown writes are blocked.**

### System Design

The header display system (`updateHeaderGW`) follows a strict single-source-of-truth pattern:

- **✅ ALLOWED**: Updates from `completedGameweeks` in `winner_stats.json` (source = 'winners')
- **❌ BLOCKED**: Updates from `nextGameweek.id - 1` calculations (source = 'season' or 'countdown')

This prevents race conditions and ensures consistent display of the last processed gameweek.

### Manual Test Steps

#### Test 1: Basic Header Display

1. **Hard refresh** both pages (index.html, winners.html)
2. **Verify**: Headers show "Loading…" → "After GW1" (single transition, no flash)
3. **Verify**: No intermediate "After GW2" display

#### Test 2: Network Throttling

1. **DevTools** → Network → Throttle to "Slow 3G"
2. **Hard refresh** both pages 5 times each
3. **Verify**: Exactly one successful header write from winners data per page load
4. **Console**: No "season/countdown header write blocked" warnings

#### Test 3: Mobile Testing

1. **Safari iOS** + **Chrome Android**: Repeat Test 1
2. **Portrait/Landscape**: Headers display correctly in both orientations
3. **Touch interaction**: No unexpected header changes

#### Test 4: Rollover Simulation

1. **Browser console**: Run `FPLUIManager.testHeaderUpdate(2, 60000)` (1-minute test)
2. **Verify**: Single DOM update after delay, no flickering
3. **Verify**: Second call is idempotent (no duplicate updates)

### Expected Console Patterns

**Normal Load (Success)**:

```
[DEBUG] Set _lastProcessedGW from winner data: 1
[DEBUG] UI Manager set _lastProcessedGW: 1
Headers: "Loading…" → "After GW1"
```

**Blocked Season/Countdown Calls**:

```
(Silent blocks - no console output for blocked calls)
```

### Data Validation

- **completedGameweeks = 0**: Header remains "Loading…" (no update)
- **completedGameweeks > 0**: Header updates to "After GW{value}"
- **Invalid values**: Header remains "Loading…" with debug log

### Dev Utilities

**Test Command**: `FPLUIManager.testHeaderUpdate(mockGW, delayMs)`

- Simulates gameweek rollover with timing control
- Verifies idempotent behavior
- Logs detailed state changes

**Usage**: Open browser console on any page:

```javascript
// Test immediate update to GW2
FPLUIManager.testHeaderUpdate(2, 0);

// Test 30-second rollover to GW3
FPLUIManager.testHeaderUpdate(3, 30000);
```

### Troubleshooting

**Headers stuck on "Loading…"**:

- Check `completedGameweeks` value in `winner_stats.json`
- Verify value is number > 0
- Check console for "Invalid completedGameweeks" debug logs

**Multiple header updates**:

- System is idempotent - multiple calls with same value are safe
- Check for race conditions between data sources

**Browser compatibility**:

- System uses modern JavaScript (ES6+)
- Requires `Number.isFinite()` and `performance.now()` support
- Tested on Chrome 90+, Firefox 88+, Safari 14+
