/**
 * UI Management and Display Functions
 * Handles UI state changes, display updates, and user interactions
 */

window.FPLUIManager = (function () {
  'use strict';

  // SINGLE SOURCE OF TRUTH: Central header state store
  const headerState = {
    finalGW: null,
    ready: false,
    lastUpdate: null,
  };

  let seasonActiveLock = false;
  let usedCachedOnLoad = false;
  const SYNC_BADGE_ENABLED = true;

  /**
   * SINGLE SOURCE: Idempotent header updater - only accepts winner data
   * @param {number} finalGW - The completed gameweek from winners data
   * @param {string} source - Source of the update (for logging)
   */
  function updateHeaderGW(finalGW, source = 'unknown') {
    const t = () => performance.now().toFixed(1);

    // Guard: Only accept numbers >= 1
    if (typeof finalGW !== 'number' || finalGW < 1) {
      console.log(
        `[${t()}] updateHeaderGW BLOCKED: invalid finalGW=${finalGW} from source=${source}`
      );
      return;
    }

    // Guard: Idempotent - no DOM write if same value
    if (headerState.finalGW === finalGW) {
      console.log(
        `[${t()}] updateHeaderGW SKIPPED: finalGW=${finalGW} unchanged from source=${source}`
      );
      return;
    }

    // HARD BLOCK: Only winners data allowed
    if (source !== 'winners') {
      console.warn(
        `[${t()}] season/countdown header write blocked; winners is source of truth (attempted: source=${source}, gw=${finalGW})`
      );
      return;
    }

    // Update central state
    headerState.finalGW = finalGW;
    headerState.ready = true;
    headerState.lastUpdate = Date.now();

    // Update DOM elements
    const elements = [
      document.getElementById('winners-after-gw'),
      document.getElementById('winners-page-after-gw'),
      document.getElementById('leaderboard-after-gw'),
    ];

    elements.forEach((el) => {
      if (el) {
        el.textContent = `After GW${finalGW}`;
        el.style.display = 'inline';
        el.classList.add('show');
      }
    });

    console.log(`[${t()}] updateHeaderGW SUCCESS: finalGW=${finalGW} from source=${source}`);
  }

  /**
   * Show during-season UI
   */
  function showDuringSeasonUI() {
    FPLUtils.hideGroup('.pre-season');
    FPLUtils.showGroup('.during-season');
    const headerP = document.querySelector('header p');
    if (headerP) headerP.textContent = 'Season 2025-26 - Live Updates';

    // Load concise prize payouts when season UI is active
    try {
      FPLPrizeStructure.loadPrizeSummary();
    } catch (e) {
      console.warn('Prize summary load failed (init):', e);
    }
  }

  /**
   * Handle season display logic
   */
  function handleSeasonDisplay(seasonStartDate, gameweek = null) {
    const currentDate = FPLUtils.now();
    const urlParams = new URLSearchParams(window.location.search);
    const isTestMode = urlParams.get('test') === 'true';
    const phaseOverride = (urlParams.get('phase') || 'auto').toLowerCase();

    console.log('Season baseline date:', seasonStartDate);
    console.log('Current date:', currentDate);
    console.log('Gameweek:', gameweek);
    console.log('Test mode:', isTestMode, 'phaseOverride:', phaseOverride);

    // If in TEST mode and a hard phase override is provided, honor it and exit early
    if (isTestMode && (phaseOverride === 'pre' || phaseOverride === 'season')) {
      const wantSeason = phaseOverride === 'season';
      const headerP = document.querySelector('header p');
      if (wantSeason) {
        showDuringSeasonUI();
        if (headerP) {
          headerP.textContent = 'Season 2025-26 - Live Updates [TEST MODE]';
          headerP.style.color = '#ff6b6b';
        }
        // Load test data sources when forcing in-season
        FPLDataLoader.loadWinnerData('winner-preview-container', 'winner-summary', true)
          .then((data) =>
            displayWinnerPreview(data.winners, 'winner-preview-container', 'winner-summary')
          )
          .catch(console.error);

        // Load leaderboard data for League Standings in test mode as well
        FPLDataLoader.loadLeaderboardData()
          .then((data) => {
            if (data && data.winners) {
              // Populate the global leaderboardData variable that displayLeaderboard expects
              window.leaderboardData = data.winners
                .filter(
                  (winner) =>
                    winner.highlights &&
                    winner.highlights.overallRank !== null &&
                    winner.highlights.overallRank !== undefined
                )
                .sort((a, b) => a.highlights.overallRank - b.highlights.overallRank);

              if (typeof window.displayLeaderboard === 'function') {
                window.displayLeaderboard();
              }

              try {
                FPLDataLoader.updateDataTimestamp('leaderboard', data.lastUpdated);
              } catch {}
            }
          })
          .catch(console.error);

        if (gameweek) {
          FPLCountdown.updateGameweekCountdown(gameweek);
        } else {
          FPLCountdown.updateCountdownDisplay(seasonStartDate);
        }
      } else {
        // Force pre-season UI
        FPLUtils.showGroup('.pre-season');
        FPLUtils.hideGroup('.during-season');
        if (headerP) {
          headerP.textContent = 'Season 2025-26 - Registration Open [TEST MODE]';
          headerP.style.color = '#ff6b6b';
        }
        FPLCountdown.updateCountdownDisplay(seasonStartDate);
      }
      attachAdminBadge();
      updatePhaseToggleButtons();
      updateQAPanel();
      return;
    }

    // Determine if the season is active
    let isActiveSeason;
    if (gameweek && typeof gameweek.id === 'number') {
      if (gameweek.id > 1) {
        isActiveSeason = true;
      } else {
        // GW1
        const gwDeadline = new Date(gameweek.deadline_time);
        isActiveSeason = currentDate >= gwDeadline;
      }
    } else {
      isActiveSeason = currentDate >= seasonStartDate;
    }
    console.log('Is active season:', isActiveSeason);

    // Once active, keep it active for this session to avoid flicker
    if (isActiveSeason) seasonActiveLock = true;
    if (seasonActiveLock) isActiveSeason = true;

    // TEST MODE: reflect the real season phase by default
    if (isTestMode) {
      const headerP = document.querySelector('header p');
      if (isActiveSeason) {
        console.log('🧪 TEST MODE: Season active → default to during-season UI with TEST data');
        showDuringSeasonUI();
        if (headerP) {
          headerP.textContent = 'Season 2025-26 - Live Updates [TEST MODE]';
          headerP.style.color = '#ff6b6b';
        }
        // Load test data sources
        FPLDataLoader.loadWinnerData('winner-preview-container', 'winner-summary', true)
          .then((data) =>
            displayWinnerPreview(data.winners, 'winner-preview-container', 'winner-summary')
          )
          .catch(console.error);

        // Load leaderboard data for League Standings in test mode as well
        FPLDataLoader.loadLeaderboardData()
          .then((data) => {
            if (data && data.winners) {
              // Populate the global leaderboardData variable that displayLeaderboard expects
              window.leaderboardData = data.winners
                .filter(
                  (winner) =>
                    winner.highlights &&
                    winner.highlights.overallRank !== null &&
                    winner.highlights.overallRank !== undefined
                )
                .sort((a, b) => a.highlights.overallRank - b.highlights.overallRank);

              if (typeof window.displayLeaderboard === 'function') {
                window.displayLeaderboard();
              }

              try {
                FPLDataLoader.updateDataTimestamp('leaderboard', data.lastUpdated);
              } catch {}
            }
          })
          .catch(console.error);

        if (gameweek) {
          FPLCountdown.updateGameweekCountdown(gameweek);
        } else {
          FPLCountdown.updateCountdownDisplay(seasonStartDate);
        }
      } else {
        console.log('🧪 TEST MODE: Pre-season → default to pre-season UI');
        FPLUtils.showGroup('.pre-season');
        FPLUtils.hideGroup('.during-season');
        if (headerP) {
          headerP.textContent = 'Season 2025-26 - Registration Open [TEST MODE]';
          headerP.style.color = '#ff6b6b';
        }
        FPLCountdown.updateCountdownDisplay(seasonStartDate);
      }
      attachAdminBadge();
      updatePhaseToggleButtons();
      return;
    }

    // Normal logic for live mode
    if (isActiveSeason) {
      // Season is active - show leaderboard and winners, hide registration
      console.log('🎯 LIVE MODE: Showing during-season UI (season started)');
      showDuringSeasonUI();
      loadMainWinnerData();

      // Load leaderboard data for League Standings - use modular function and populate global variable
      console.log('🎯 Loading leaderboard data for League Standings');
      FPLDataLoader.loadLeaderboardData()
        .then((data) => {
          if (data && data.winners) {
            // Populate the global leaderboardData variable that displayLeaderboard expects
            window.leaderboardData = data.winners
              .filter(
                (winner) =>
                  winner.highlights &&
                  winner.highlights.overallRank !== null &&
                  winner.highlights.overallRank !== undefined
              )
              .sort((a, b) => a.highlights.overallRank - b.highlights.overallRank);

            console.log(
              '📊 Leaderboard data loaded and processed:',
              window.leaderboardData.length,
              'players'
            );
            console.log('📊 Sample leaderboard entry:', window.leaderboardData[0]);

            // Call the sophisticated display function
            if (typeof window.displayLeaderboard === 'function') {
              console.log('📊 Calling window.displayLeaderboard()');
              window.displayLeaderboard();
              console.log('📊 window.displayLeaderboard() completed');

              // Update centralized timestamp system
              if (data.lastUpdated) {
                FPLDataLoader.updateDataTimestamp('leaderboard', data.lastUpdated);
              }
            } else {
              console.error(
                '❌ window.displayLeaderboard is not a function:',
                typeof window.displayLeaderboard
              );
            }
          } else {
            console.warn('No winners data found in leaderboard response');
          }
        })
        .catch((error) => {
          console.error('Failed to load leaderboard data:', error);
          // Set empty array so displayLeaderboard shows "No league standings available yet"
          window.leaderboardData = [];
          if (typeof window.displayLeaderboard === 'function') {
            console.log('📊 Calling window.displayLeaderboard() for error case');
            window.displayLeaderboard();
          } else {
            console.error(
              '❌ window.displayLeaderboard is not available for error case:',
              typeof window.displayLeaderboard
            );
          }
        });

      // Load prize structure using sophisticated function
      console.log('🎯 Loading prize structure');
      if (typeof window.loadPrizeSummary === 'function') {
        window
          .loadPrizeSummary()
          .catch((error) => console.error('Failed to load prize structure:', error));
      } else {
        console.warn('window.loadPrizeSummary not available, falling back to modular');
        FPLPrizeStructure.loadPrizeSummary().catch((error) =>
          console.error('Failed to load prize structure:', error)
        );
      }

      if (gameweek) {
        FPLCountdown.updateGameweekCountdown(gameweek);
      } else {
        // No nextGameweek yet (backend/proxy still loading). Keep clock visible with placeholder
        const clock = document.getElementById('countdown-clock');
        const label = document.getElementById('countdown-label');
        if (clock) FPLUtils.show(clock);
        if (label) label.textContent = 'Fetching next deadline…';
        attachAdminBadge();
        updatePhaseToggleButtons();
        updateQAPanel();
      }
    } else {
      // Pre-season - show registration prominently, hide leaderboards
      console.log('📝 LIVE MODE: Showing pre-season UI (registration phase)');
      FPLUtils.showGroup('.pre-season');
      FPLUtils.hideGroup('.during-season');

      // Set header message for pre-season
      const headerP = document.querySelector('header p');
      if (headerP) {
        headerP.textContent = 'Season 2025-26 - Registration Open';
      }
      // Update only the digital countdown clock for season start (GW1)
      FPLCountdown.updateCountdownDisplay(seasonStartDate);
      updatePhaseToggleButtons();
      updateQAPanel();
    }
  }

  /**
   * Display winner preview with proper HTML structure
   */
  function displayWinnerPreview(
    winners,
    containerId = 'winner-preview-container',
    summaryId = 'winner-summary'
  ) {
    const container = document.getElementById(containerId);
    const summaryContainer = document.getElementById(summaryId);

    if (!container) {
      console.error('Winner preview container not found:', containerId);
      return;
    }

    if (!winners || !Array.isArray(winners) || winners.length === 0) {
      container.innerHTML =
        '<section class="winner-loading">No winner data available yet.</section>';
      return;
    }

    // Sort winners by total prize won (descending) - only show players who have won prizes
    const sortedWinners = winners
      .filter(
        (w) => w && w.playerName && typeof w.totalPrizeWon === 'number' && w.totalPrizeWon > 0
      )
      .sort((a, b) => b.totalPrizeWon - a.totalPrizeWon);

    // Show top 6 winners in preview
    const topWinners = sortedWinners.slice(0, 6);

    const previewHTML = `
      <section class="winner-preview" aria-label="Top prize winners">
        ${topWinners
          .map(
            (winner, index) => `
          <article class="winner-card${
            index < 3 ? ` rank-${index + 1}` : ''
          }" aria-labelledby="winner-name-${index}">
            <div class="winner-rank" aria-label="Position">#${index + 1}</div>
            <h4 id="winner-name-${index}" class="winner-name" title="${FPLUtils.escapeHTML(winner.playerName)}">${FPLUtils.escapeHTML(winner.playerName)}</h4>
            <div class="winner-prize" title="Total prize won: ₹${winner.totalPrizeWon.toLocaleString(
              'en-IN'
            )}" aria-label="Total prize won">
              ₹${winner.totalPrizeWon.toLocaleString('en-IN')}
            </div>
            <div class="winner-highlights" aria-label="Achievements">
              ${
                winner.highlights.gameWeeks > 0
                  ? `<span class="highlight-badge gw" title="${FPLUtils.escapeHTML(winner.highlights.gameWeeks + ' gameweek wins')}">${FPLUtils.escapeHTML(winner.highlights.gameWeeks + 'GW')}</span>`
                  : ''
              }
              ${
                winner.highlights.gameMonths > 0
                  ? `<span class="highlight-badge gm" title="${FPLUtils.escapeHTML(winner.highlights.gameMonths + ' monthly wins')}">${FPLUtils.escapeHTML(winner.highlights.gameMonths + 'GM')}</span>`
                  : ''
              }
              ${
                winner.highlights.overallRank
                  ? `<span class="highlight-badge" title="Current league position">League Rank ${FPLUtils.escapeHTML(winner.highlights.overallRank)}</span>`
                  : ''
              }
            </div>
          </article>
        `
          )
          .join('')}
      </section>
    `;

    container.innerHTML = previewHTML;

    // Show summary if summary container exists
    if (summaryContainer) {
      const totalPrizes = sortedWinners.reduce((sum, w) => sum + w.totalPrizeWon, 0);
      const uniqueWinners = new Set(sortedWinners.map((w) => w.playerName)).size;

      summaryContainer.innerHTML = `
        <p><strong>${FPLUtils.formatINR(totalPrizes)}</strong> distributed to <strong>${uniqueWinners}</strong> winners so far</p>
      `;
    }
  }

  /**
   * Load main winner data for live display
   */
  function loadMainWinnerData() {
    const dataOverride = FPLUtils.getDataOverride();

    FPLDataLoader.loadWinnerData('winner-preview-container', 'winner-summary', false, dataOverride)
      .then((data) => {
        if (data) {
          displayWinnerPreview(data.winners, 'winner-preview-container', 'winner-summary');

          // Update centralized timestamp system
          if (data.lastUpdated) {
            FPLDataLoader.updateDataTimestamp('winners', data.lastUpdated);
          }

          updateQAPanel();
        }
      })
      .catch((error) => {
        console.error('Failed to load main winner data:', error);
        const container = document.getElementById('winner-preview-container');
        if (container) {
          container.innerHTML = `
            <div class="winner-error">
              <h3>Unable to load winner data</h3>
              <p>There was a problem loading the winner statistics. Please try again.</p>
              <button onclick="FPLUIManager.loadMainWinnerData()" 
                      style="background: var(--primary-color); color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                <i class="fas fa-redo"></i> Retry
              </button>
            </div>
          `;
        }
      });
  }

  /**
   * Update winners header with GW information
   */
  function updateWinnersHeaderGW() {
    const t = () => performance.now().toFixed(1);

    // DELEGATE to single source header updater
    const gwId = FPLDataLoader.getLastFinishedGW();
    const hasWinnerData = FPLDataLoader._lastProcessedGW !== undefined;
    const hasSeasonData = FPLDataLoader._lastGwId !== undefined;
    const source = hasWinnerData ? 'winners' : hasSeasonData ? 'season' : 'unknown';

    console.log(
      `[${t()}] updateWinnersHeaderGW LEGACY: delegating to updateHeaderGW(gw=${gwId}, source=${source})`
    );
    updateHeaderGW(gwId, source);
  }

  /**
   * Update leaderboard header with GW information
   */
  function updateLeaderboardHeaderGW() {
    const t = () => performance.now().toFixed(1);

    // DELEGATE to single source header updater
    const gwId = FPLDataLoader.getLastFinishedGW();
    const hasWinnerData = FPLDataLoader._lastProcessedGW !== undefined;
    const hasSeasonData = FPLDataLoader._lastGwId !== undefined;
    const source = hasWinnerData ? 'winners' : hasSeasonData ? 'season' : 'unknown';

    console.log(
      `[${t()}] updateLeaderboardHeaderGW LEGACY: delegating to updateHeaderGW(gw=${gwId}, source=${source})`
    );
    updateHeaderGW(gwId, source);
  }

  /**
   * Attach admin badge for test mode
   */
  function attachAdminBadge() {
    if (!FPLUtils.isAdminMode()) return;
    const label = document.getElementById('countdown-label');
    if (!label) return;

    // If a badge exists, update; else create
    let badge = label.querySelector('.admin-badge');
    const parts = [];
    const lastGwId = FPLDataLoader.getLastGwId();
    const lastSyncIso = FPLDataLoader.getLastSyncIso();

    if (typeof lastGwId === 'number') parts.push(`GW${lastGwId}`);
    if (lastSyncIso) {
      try {
        const d = new Date(lastSyncIso);
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const nice = d.toLocaleString('en-GB', {
          dateStyle: 'medium',
          timeStyle: 'short',
          timeZone: tz,
        });
        parts.push(`synced ${nice}`);
      } catch (e) {
        // ignore formatting issues
      }
    }

    const text = parts.length ? parts.join(' • ') : 'admin';
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'admin-badge';
      badge.textContent = text;
      label.appendChild(badge);
    } else {
      badge.textContent = text;
    }
  }

  /**
   * Show sync badge
   */
  function showSyncedJustNow() {
    if (!SYNC_BADGE_ENABLED) return;
    const label = document.getElementById('countdown-label');
    if (!label) return;

    // Remove old badge if any
    const old = label.querySelector('.sync-badge');
    if (old) old.remove();

    const badge = document.createElement('span');
    badge.className = 'sync-badge';
    badge.textContent = 'Synced just now';
    label.appendChild(badge);

    // force reflow to trigger transition
    void badge.offsetWidth;
    badge.classList.add('show');

    // auto fade out after 2s
    setTimeout(() => {
      badge.classList.remove('show');
      setTimeout(() => badge.remove(), 350);
    }, 2000);
  }

  /**
   * Remove cached label
   */
  function removeCachedLabel() {
    const label = document.getElementById('countdown-label');
    if (!label) return;
    label.textContent = label.textContent.replace(/\\s*\\(cached\\)$/i, '');
  }

  /**
   * Update QA panel with current state
   */
  function updateQAPanel() {
    if (!FPLUtils.isAdminMode()) return;
    const panel = document.getElementById('qa-panel');
    if (!panel) return;

    const phaseEl = document.getElementById('qa-phase');
    const gwEl = document.getElementById('qa-gw');
    const dlEl = document.getElementById('qa-deadline');
    const srcEl = document.getElementById('qa-source');
    const dmEl = document.getElementById('qa-data-mode');
    const wuEl = document.getElementById('qa-winners-updated');
    const luEl = document.getElementById('qa-leaderboard-updated');
    const timeEl = document.getElementById('qa-time');

    const duringVisible = !document.querySelector('.during-season').classList.contains('is-hidden');
    phaseEl.textContent = 'Phase: ' + (duringVisible ? 'in-season' : 'pre-season');

    const gw = FPLDataLoader.getCachedGameweek();
    if (gw) {
      gwEl.textContent = `Next GW: GW${gw.id}`;
      try {
        const d = new Date(gw.deadline_time);
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        dlEl.textContent =
          'Deadline: ' +
          d.toLocaleString('en-GB', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: tz,
          });
      } catch {
        dlEl.textContent = 'Deadline: —';
      }
    } else {
      gwEl.textContent = 'Next GW: —';
      dlEl.textContent = 'Deadline: —';
    }

    srcEl.textContent = 'Season data source: ' + FPLDataLoader.getSeasonDataSource();

    const winnersBase = FPLDataLoader.getLastWinnersDataFile()
      ? ` (${FPLDataLoader.getLastWinnersDataFile().replace(/\\?.*$/, '')})`
      : '';
    const leaderboardBase = FPLDataLoader.getLastLeaderboardDataFile()
      ? ` (${FPLDataLoader.getLastLeaderboardDataFile().replace(/\\?.*$/, '')})`
      : '';
    dmEl.textContent = `Data sources — winners: ${FPLDataLoader.getLastWinnersDataMode()}${winnersBase} • leaderboard: ${FPLDataLoader.getLastLeaderboardDataMode()}${leaderboardBase}`;

    const n = FPLUtils.now();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const sign =
      FPLUtils.timeOffsetMs === 0
        ? ''
        : ` (${FPLUtils.timeOffsetMs > 0 ? '+' : ''}${Math.round(FPLUtils.timeOffsetMs / 60000)}m)`;
    timeEl.textContent =
      'Now (offset): ' +
      n.toLocaleString('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: tz,
      }) +
      sign;

    // Per-dataset last updated
    try {
      if (wuEl) {
        const winnersUpdated = FPLDataLoader.getLastWinnersUpdatedIso();
        wuEl.textContent =
          'Winners updated: ' +
          (winnersUpdated
            ? new Date(winnersUpdated).toLocaleString('en-GB', {
                dateStyle: 'medium',
                timeStyle: 'short',
                timeZone: tz,
              })
            : '—');
      }
      if (luEl) {
        const leaderboardUpdated = FPLDataLoader.getLastLeaderboardUpdatedIso();
        luEl.textContent =
          'Leaderboard updated: ' +
          (leaderboardUpdated
            ? new Date(leaderboardUpdated).toLocaleString('en-GB', {
                dateStyle: 'medium',
                timeStyle: 'short',
                timeZone: tz,
              })
            : '—');
      }
    } catch {}

    // Wire up action buttons if not already done
    const clearBtn = document.getElementById('qa-clear-cache');
    const refetchBtn = document.getElementById('qa-refetch');
    const copyBtn = document.getElementById('qa-copy');

    if (!clearBtn._wired) {
      clearBtn._wired = true;
      clearBtn.addEventListener('click', () => {
        try {
          localStorage.removeItem('fpl_next_deadline');
          localStorage.removeItem('fpl_cached_gw');
        } catch {}
        location.reload();
      });
    }

    if (!refetchBtn._wired) {
      refetchBtn._wired = true;
      refetchBtn.addEventListener('click', () => {
        FPLDataLoader.loadFPLSeasonData()
          .then(({ deadline, gameweek }) => {
            handleSeasonDisplay(deadline, gameweek);
            FPLCountdown.startCountdown(deadline, gameweek);
            updateQAPanel();
          })
          .catch(console.error);
      });
    }

    if (!copyBtn._wired) {
      copyBtn._wired = true;
      copyBtn.addEventListener('click', async () => {
        const payload = {
          phase: duringVisible ? 'in-season' : 'pre-season',
          nextGw: gw || null,
          seasonDataSource: FPLDataLoader.getSeasonDataSource(),
          winnersDataMode: FPLDataLoader.getLastWinnersDataMode(),
          leaderboardDataMode: FPLDataLoader.getLastLeaderboardDataMode(),
          clockOffsetMs: FPLUtils.timeOffsetMs,
          now: FPLUtils.now().toISOString(),
        };
        try {
          await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
        } catch {}
      });
    }
  }

  /**
   * Display leaderboard data in League Standings section
   */
  function displayLeaderboardData(data) {
    if (!data || !data.winners) {
      console.warn('No leaderboard data to display');
      return;
    }

    const leaderboardContainer = document.getElementById('leaderboard-container');
    if (!leaderboardContainer) {
      console.warn('Leaderboard container not found');
      return;
    }

    // Display top players as a simple list
    const topPlayers = data.winners.slice(0, 10); // Show top 10
    const leaderboardHTML = topPlayers
      .map(
        (player, index) => `
      <div class="leaderboard-row">
        <span class="rank">#${index + 1}</span>
        <span class="player-name">${FPLUtils.escapeHTML(player.playerName)}</span>
        <span class="total-prize">₹${player.totalPrizeWon.toLocaleString('en-IN')}</span>
        <span class="total-points">${player.highlights?.totalPoints || 0} pts</span>
      </div>
    `
      )
      .join('');

    leaderboardContainer.innerHTML = `
      <div class="leaderboard-header">
        <h3>League Standings</h3>
        <p>Top performers this season</p>
      </div>
      <div class="leaderboard-list">
        ${leaderboardHTML}
      </div>
    `;
  }

  /**
   * Check if we're in test mode and update UI accordingly
   */
  function checkTestMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const testMode = urlParams.get('test') === 'true';

    if (testMode) {
      // Show ALL test-only elements
      FPLUtils.showGroup('.test-only');
      console.log('🧪 Test mode: Showing test-only elements including toggle button');

      // Prefer floating toggle; hide inline toggle section to avoid duplication
      const inlineToggle = document.getElementById('season-toggle');
      if (inlineToggle) FPLUtils.hide(inlineToggle);

      // Ensure header shows test badge
      const headerPTest = document.querySelector('header p');
      if (headerPTest && !headerPTest.textContent.includes('[TEST MODE]')) {
        headerPTest.textContent = headerPTest.textContent + ' [TEST MODE]';
        headerPTest.style.color = '#ff6b6b';
      }

      // Update winners link to include test parameter
      const winnersLink = document.getElementById('winners-link');
      if (winnersLink) {
        winnersLink.href = 'winners.html' + FPLUtils.buildNavQuery();
      }

      // Initialize toggle button labels based on current UI
      updatePhaseToggleButtons();

      console.log('🧪 Test mode activated!');
      updateQAPanel();
    } else {
      // Live mode: FORCE HIDE all test-only elements
      FPLUtils.hideGroup('.test-only');

      const winnersLink = document.getElementById('winners-link');
      if (winnersLink) {
        winnersLink.href = 'winners.html' + FPLUtils.buildNavQuery();
      }

      console.log('🌐 Live mode: All test-only elements hidden');
    }
  }

  /**
   * Toggle season mode for testing
   */
  function toggleSeasonMode() {
    const preSeasonElements = document.querySelectorAll('.pre-season');
    const duringSeasonElements = document.querySelectorAll('.during-season');
    const headerP = document.querySelector('header p');

    // Toggle visibility
    preSeasonElements.forEach((el) => {
      el.classList.contains('is-hidden') ? FPLUtils.show(el) : FPLUtils.hide(el);
    });
    duringSeasonElements.forEach((el) => {
      el.classList.contains('is-hidden') ? FPLUtils.show(el) : FPLUtils.hide(el);
    });

    // Toggle header text
    if (headerP) {
      if (headerP.textContent.includes('Registration Open')) {
        headerP.textContent = 'Season 2025-26 - Live Updates (Testing Mode)';

        // Load data when switching to season mode
        console.log('🔄 Toggle: Loading data for season mode...');
        FPLDataLoader.loadWinnerData('winner-preview-container', 'winner-summary', true)
          .then((data) =>
            displayWinnerPreview(data.winners, 'winner-preview-container', 'winner-summary')
          )
          .catch(console.error);

        // Load prize summary for in-season view
        console.log('🔄 Toggle: Loading prize summary...');
        FPLPrizeStructure.loadPrizeSummary();

        // Update winners link to test version when in season mode
        const winnersLink = document.getElementById('winners-link');
        if (winnersLink) {
          winnersLink.href = 'winners.html' + FPLUtils.buildNavQuery();
        }
        updatePhaseToggleButtons();
      } else {
        headerP.textContent = 'Season 2025-26 - Registration Open (Testing Mode)';
        headerP.style.color = '';
        updatePhaseToggleButtons();
      }
    }
  }

  /**
   * Update phase toggle button labels
   */
  function updatePhaseToggleButtons() {
    const duringEl = document.querySelector('.during-season');
    if (!duringEl) return;

    const inSeasonVisible = !duringEl.classList.contains('is-hidden');
    const inlineBtn = document.getElementById('phase-toggle-btn');
    const floatBtn = document.getElementById('phase-toggle-btn-float');
    const openWinnersBtn = document.getElementById('phase-toggle-open-winners');

    const preText = '📝 Preview Pre-season View';
    const inText = '📊 Preview In-season View';
    const label = inSeasonVisible ? preText : inText;

    if (inlineBtn) inlineBtn.textContent = label;
    if (floatBtn) floatBtn.textContent = label;
    if (openWinnersBtn) openWinnersBtn.textContent = 'Open Winners (In-season)';
  }

  /**
   * Open winners page in in-season mode
   */
  function openWinnersWithToggledPhase() {
    try {
      const qs = FPLUtils.buildNavQuery(['test', 'data', 'phase', 'clockOffset']);
      const qp = new URLSearchParams(qs.replace(/^\\?/, '') || '');
      qp.set('phase', 'season');
      const finalQs = qp.toString();
      window.location.href = 'winners.html' + (finalQs ? '?' + finalQs : '');
    } catch (e) {
      console.error('Failed to navigate to winners page:', e);
    }
  }

  // Track last sync information
  let _lastSyncIso = null;
  let _lastGwId = null;
  let _lastProcessedGW = null;

  /**
   * Set last sync info
   */
  function setLastSyncInfo(gwId, iso) {
    _lastGwId = gwId || _lastGwId;
    _lastSyncIso = iso || _lastSyncIso;
  }

  /**
   * Attach admin badge to countdown label
   */
  function attachAdminBadge() {
    if (!FPLUtils.isAdminMode()) return;
    const label = document.getElementById('countdown-label');
    if (!label) return;

    let badge = label.querySelector('.admin-badge');
    const parts = [];

    if (typeof _lastGwId === 'number') parts.push(`GW${_lastGwId}`);
    if (_lastSyncIso) {
      try {
        const d = new Date(_lastSyncIso);
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const nice = d.toLocaleString('en-GB', {
          dateStyle: 'medium',
          timeStyle: 'short',
          timeZone: tz,
        });
        parts.push(`synced ${nice}`);
      } catch (e) {
        // ignore formatting issues
      }
    }

    const text = parts.length ? parts.join(' • ') : 'admin';

    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'admin-badge';
      badge.textContent = text;
      label.appendChild(badge);
    } else {
      badge.textContent = text;
    }
  }

  // Public API
  return {
    showDuringSeasonUI,
    handleSeasonDisplay,
    displayWinnerPreview,
    displayLeaderboardData,
    loadMainWinnerData,
    updateWinnersHeaderGW,
    updateLeaderboardHeaderGW,
    attachAdminBadge,
    setLastSyncInfo,
    showSyncedJustNow,
    removeCachedLabel,
    updateQAPanel,
    checkTestMode,
    toggleSeasonMode,
    updatePhaseToggleButtons,
    openWinnersWithToggledPhase,
    updateHeaderGW, // NEW: Single source header updater
    setUsedCachedOnLoad: (value) => (usedCachedOnLoad = value),
    getUsedCachedOnLoad: () => usedCachedOnLoad,
    setLastProcessedGW: (gw) => {
      if (typeof gw === 'number' && Number.isFinite(gw)) {
        _lastProcessedGW = gw;
        console.debug('[GW] UI Manager set _lastProcessedGW:', gw);

        // SINGLE SOURCE TRIGGER: Update headers immediately when winner data is available
        updateHeaderGW(gw, 'winners');

        // Issue #37 Prevention: Validate against next GW if available
        if (typeof _lastGwId === 'number' && _lastGwId > 0) {
          const expectedMax = _lastGwId - 1;
          if (gw > expectedMax) {
            console.warn(
              '[GW] Issue #37 Prevention in UI Manager: completedGameweeks (',
              gw,
              ') exceeds expected max (',
              expectedMax,
              ') based on nextGW (',
              _lastGwId,
              ')'
            );
          }
        }
      }
    },
  };
})();
