# Spec Requirements Document

> Spec: Navigation Redesign MVP Created: 2025-10-04

## Overview

Redesign the Fantasy League website navigation to be mobile-first with a streamlined 5-6 tab ribbon
structure that consolidates features into focused hubs (Dashboard, Winners & Payouts, Leaderboard,
Gameweek Hub, Awards & Records). This enhancement will improve daily usability, introduce
personalization via FPL ID stored in localStorage, and create a scalable foundation for future
features while maintaining the current static HTML + vanilla JS architecture.

## User Stories

### Daily League Manager

As a league participant, I want a dedicated "Gameweek Hub" where I can see the upcoming deadline,
this week's fixtures, a captain poll, and price changes in one place, so that I can make informed
transfer and captaincy decisions without visiting multiple sites.

**Workflow:** User visits the site mid-week, clicks "Gameweek Hub" tab, sees deadline countdown
ticking, reviews the fixture list showing difficulty ratings, checks the community captain poll
results, notes 2-3 players rising in price, and clicks a quick link to make transfers on the
official FPL site—all in under 60 seconds.

### Winner Tracking Player

As a player who has won prizes, I want to filter the winners page by Season/Month/Week and search
for my name, so that I can quickly verify my winnings and payout status without scrolling through
long lists.

**Workflow:** User navigates to "Winners & Payouts", clicks the "Month" filter chip, types their
name in the search box, sees their 2 monthly wins highlighted with prize amounts and "Paid" badges,
and screenshots the result to share with friends.

### Mobile-First Participant

As a mobile user (60%+ of traffic), I want a horizontally scrollable tab ribbon with clear active
states and a hamburger menu backup, so that I can navigate the entire site easily on my phone
without tiny tap targets or hidden features.

**Workflow:** User opens site on iPhone, sees 5 tabs in the ribbon with the active tab underlined,
swipes left to reveal "Awards & Records", taps it, and the page loads instantly with the same
navigation pattern—no confusion, no dead ends.

## Spec Scope

1. **Ribbon Navigation Component** - Implement a responsive horizontal tab ribbon (5-6 tabs max)
   with scroll hints, keyboard navigation, and `aria-current="page"` for accessibility, backed by a
   config-driven data structure.

2. **Dashboard (formerly Overview)** - Consolidate "By the Numbers" tiles, GW deadline clock, Top 6
   Earners, Top 10 leaderboard preview, and latest announcement into a single at-a-glance landing
   page.

3. **Winners & Payouts (enhanced)** - Add filter chips (Season/Month/Week), player search,
   responsive table-to-cards switch, and highlight chips for 1GW/1GM wins and League Rank
   achievements.

4. **Leaderboard Page** - Create standalone page with overall standings table (sticky header,
   pagination), "Risers & Fallers" section showing rank changes, and optional Team of the Week
   display.

5. **Gameweek Hub (new)** - Build new page aggregating next deadline, current GW fixtures, simple
   local captain poll (no auth), top 5 price movers, and quick links to FPL transfers/picks.

6. **Awards & Records Page** - Introduce fun awards (biggest green arrow, highest GW score, most
   bench points, worst captain) with clear formulas, plus season records list (best GW, biggest
   monthly prize).

7. **Personalization Layer** - Add localStorage-based FPL ID capture to show "Your rank & delta",
   rival comparison (3-5 pinned IDs), and chip/captain history without requiring authentication.

8. **Reusable UI Components** - Extract shared components (chips, filter-chips, list cards, tables,
   empty states, subtitles "After GWx", timestamps) into a component library pattern for
   consistency.

## Out of Scope

- Backend authentication or database-stored user preferences (localStorage only for MVP)
- Real-time price feed integration (manual or cached data acceptable for MVP)
- Single Page Application (SPA) framework; keeping plain `<a>` links for simplicity and crawlability
- Progressive Web App (PWA) features like offline support or install prompts (Phase 3)
- Player detail drawer with full prize history (Deluxe/Phase 2)
- Automated email reminder opt-in form (can use existing email infra later)
- Multi-season Hall of Fame (requires historical data not yet available)

## Expected Deliverable

1. **Mobile-First Navigation**: Ribbon scrolls smoothly on mobile with edge gradients and arrow
   hints; hamburger menu mirrors the same tabs; active state is visually clear and
   keyboard-accessible.

2. **Five Core Pages Live**: Dashboard, Winners & Payouts (with filters + search), Leaderboard (with
   risers/fallers), Gameweek Hub (deadline + fixtures + poll + price watch stub), Awards & Records
   (3-5 awards defined) all render correctly on mobile and desktop.

3. **Personalization Without Login**: Prompt for FPL ID once, store in localStorage, display "Your
   rank" badge on Dashboard, and persist across page navigations; clear mechanism to edit/remove
   stored ID.
