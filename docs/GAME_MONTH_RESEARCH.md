# Game Month Definition Research

## Current Implementation Analysis

### How IIM Mumbai FPL Currently Defines "Game Month"

**Fixed 4-Gameweek Periods:**

- Month 1: Gameweeks 1-4
- Month 2: Gameweeks 5-8
- Month 3: Gameweeks 9-12
- Month 4: Gameweeks 13-16
- Month 5: Gameweeks 17-20
- Month 6: Gameweeks 21-24
- Month 7: Gameweeks 25-28
- Month 8: Gameweeks 29-32
- Month 9: Gameweeks 33-36
- Month 10: Gameweeks 37-38 (shortened final period)

**Implementation Details:**

- Monthly emails sent after GWs 4,8,12,16,20,24,28,32,36,38
- Monthly prizes awarded for 1st and 2nd place in each period
- "GM" badges displayed for monthly wins
- Monthly winners calculated based on cumulative points across the period

## Official FPL Parlance Research

### Research Methodology

Since direct access to Fantasy Premier League API and documentation is limited, this research is based on:

1. Common fantasy football practices
2. Premier League season structure
3. Industry standards for mini-league management
4. Analysis of FPL-related terminology

### Findings

#### 1. Official FPL Does Not Use "Game Month" Terminology

The official Fantasy Premier League does not appear to use the term "Game Month" in their official documentation or API. The term appears to be specific to mini-league management systems.

#### 2. FPL Uses Calendar-Based Periods

The official FPL typically references:

- **Gameweeks** (GW1-GW38)
- **Calendar months** (August, September, October, etc.)
- **Seasonal phases** (Early season, Christmas period, etc.)

#### 3. Manager of the Month Awards

While the Premier League has official "Manager of the Month" awards for real managers, the FPL system doesn't have an equivalent official monthly award system for fantasy managers.

### Industry Best Practices

#### Fantasy Football Monthly Periods

Most fantasy football mini-leagues use one of these approaches:

1. **Calendar Months** (Recommended)
   - August: GW1-3/4 (depending on season start)
   - September: GW4/5-7/8
   - October: GW8/9-12
   - November: GW13-16
   - December: GW17-20
   - January: GW21-24
   - February: GW25-28
   - March: GW29-32
   - April: GW33-36
   - May: GW37-38

2. **Fixed 4-Gameweek Periods** (Current Implementation)
   - Pros: Equal periods, predictable
   - Cons: Doesn't align with calendar months

3. **Variable Periods Based on Fixtures**
   - Adjusts for international breaks
   - More complex to implement

## Recommendations

### Option 1: Keep Current System (Recommended)

**Rationale:**

- Current system is working well
- Fixed periods ensure fairness
- Easy to understand and implement
- Avoids complications from calendar month variations

**Minor Enhancement:**

- Update terminology from "Game Month" to "Monthly Period" or "Prize Period"
- Clarify in documentation that these are 4-gameweek prize periods

### Option 2: Switch to Calendar Months

**Pros:**

- More intuitive for users
- Aligns with real-world months

**Cons:**

- Unequal periods (some months have 3-5 gameweeks)
- More complex to implement
- May create unfair advantages

### Option 3: Hybrid Approach

- Keep 4-gameweek periods
- Name them after the calendar month they primarily fall in
- Example: "August Period (GW1-4)", "September Period (GW5-8)"

## Proposed Documentation Updates

### Terminology Clarification

Instead of "Game Month", use:

- **"Monthly Period"** - A 4-gameweek prize period
- **"Prize Period"** - More generic term for the same concept
- **"Month X Period"** - Specific period identifier

### Updated Descriptions

**Current:**

> Calculates monthly winners for 4-gameweek periods

**Proposed:**

> Calculates monthly period winners for fixed 4-gameweek prize periods. These periods ensure fair competition with equal gameweek counts, unlike calendar months which vary in length.

## Implementation Status

- [x] Research completed
- [x] Recommendations documented
- [ ] Documentation updates pending
- [ ] Code terminology updates pending (if approved)

## Conclusion

The current implementation using fixed 4-gameweek periods is actually superior to trying to align with official FPL "parlance" since:

1. Official FPL doesn't use "Game Month" terminology
2. Fixed periods ensure fairness
3. Current system is already well-implemented and tested
4. Only minor documentation updates needed for clarity

The main recommendation is to update documentation to clarify the terminology and rationale rather than changing the underlying system.
