/**
 * Data Loading and API Management
 * Handles all data fetching, caching, and API interactions
 */

window.FPLDataLoader = (function () {
  'use strict';

  // State tracking
  let seasonDataSource = 'unknown'; // backend | proxy | fallback | unknown
  let lastWinnersDataMode = 'auto';
  let lastLeaderboardDataMode = 'auto';
  let lastWinnersDataFile = '';
  let lastLeaderboardDataFile = '';
  let lastWinnersUpdatedIso = null;
  let lastLeaderboardUpdatedIso = null;
  let _lastSyncIso = null;
  let _lastGwId = null;
  let _lastProcessedGW = null;

  // Centralized timestamp tracking for all data sources
  let allDataTimestamps = {
    leagueStats: null,
    winners: null,
    leaderboard: null,
    prizes: null,
    countdown: null,
  };

  /**
   * Enhanced fetch with comprehensive error handling
   */
  function fetchWithRetry(url, maxRetries = 3, delay = 1000) {
    // Use the new error handling system if available, otherwise fallback to basic retry
    if (window.ErrorHandler) {
      return ErrorHandler.withRetry(() => ErrorHandler.safeFetch(url), maxRetries);
    }

    // Fallback implementation for backwards compatibility
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .catch((error) => {
        if (maxRetries > 1) {
          console.log(`Retrying fetch in ${delay}ms... (${maxRetries - 1} attempts left)`);
          return new Promise((resolve) => {
            setTimeout(() => resolve(fetchWithRetry(url, maxRetries - 1, delay * 1.5)), delay);
          });
        }
        throw error;
      });
  }

  /**
   * Load league statistics with error handling
   */
  function loadLeagueStats() {
    const playerCountEl = document.getElementById('player-count');
    const potAmountEl = document.getElementById('pot-amount');
    const lastUpdatedEl = document.getElementById('stats-last-updated');

    // Show loading state in the last updated section
    if (lastUpdatedEl) {
      lastUpdatedEl.textContent = 'Fetching latest data...';
    }

    // Load stats data
    return ErrorHandler.safeFetch('data/league_stats.json?cache=' + Date.now())
      .then((data) => {
        console.log('League stats loaded:', data);

        // Update player count
        if (playerCountEl) {
          playerCountEl.textContent = data.playerCount || '54';
        }

        // Update pot amount
        if (potAmountEl) {
          potAmountEl.textContent = `₹${data.potAmount ? data.potAmount.toLocaleString('en-IN') : '1,62,000'}`;
        }

        // Update centralized timestamp system
        if (data.lastUpdated) {
          updateDataTimestamp('leagueStats', data.lastUpdated);
        }
      })
      .catch((error) => {
        console.warn('Failed to load league stats:', error);

        // Set fallback values
        if (playerCountEl) {
          playerCountEl.textContent = '54';
        }
        if (potAmountEl) {
          potAmountEl.textContent = '₹1,62,000';
        }
        if (lastUpdatedEl) {
          lastUpdatedEl.textContent = 'Unable to fetch latest data';
        }
      });
  }

  /**
   * Load FPL season data from backend or proxies
   */
  function loadFPLSeasonData() {
    // Test/admin override: allow forcing deadline + gameweek via URL when in test/admin
    try {
      const url = new URLSearchParams(window.location.search);
      const isTestOrAdmin = url.get('test') === 'true' || url.get('admin') === 'true';
      const dlOverride = url.get('dl') || url.get('deadline') || null; // ISO string
      const gwOverrideRaw = url.get('gw') || url.get('gameweek') || null; // number
      if (isTestOrAdmin && dlOverride) {
        const deadline = new Date(dlOverride);
        if (!isNaN(deadline.getTime())) {
          const gwId = gwOverrideRaw ? parseInt(gwOverrideRaw, 10) : null;
          const gw =
            gwId && Number.isFinite(gwId)
              ? { id: gwId, deadline_time: deadline.toISOString() }
              : null;

          // Cache the override so the rest of the app is consistent
          FPLDataLoader.setCachedDeadline(deadline.toISOString());
          if (gw) FPLDataLoader.setCachedGameweek(gw);
          FPLDataLoader.setLastSyncInfo(gw && gw.id, new Date().toISOString());
          updateDataTimestamp('countdown', new Date().toISOString());
          seasonDataSource = 'override';

          return Promise.resolve({ deadline, gameweek: gw });
        }
      }
    } catch (e) {
      console.warn('Deadline override parse failed:', e);
    }

    // First try backend-synced JSON published by Apps Script
    const backendUrl = 'data/next_deadline.json?cache=' + Date.now();
    return fetch(backendUrl)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('backend 404'))))
      .then((data) => {
        if (data && data.nextGameweek && data.nextGameweek.deadline_time) {
          const gw = data.nextGameweek;
          const deadline = new Date(gw.deadline_time);

          // Cache the data
          FPLDataLoader.setCachedDeadline(deadline.toISOString());
          FPLDataLoader.setCachedGameweek({ id: gw.id, deadline_time: gw.deadline_time });
          FPLDataLoader.setLastSyncInfo(gw.id, data.lastUpdated || new Date().toISOString());
          updateDataTimestamp('countdown', data.lastUpdated || new Date().toISOString());
          seasonDataSource = 'backend';

          return { deadline, gameweek: gw };
        }
        throw new Error('backend payload invalid');
      })
      .catch(() => {
        // Fallback to public FPL API via CORS proxies
        return loadFPLSeasonDataViaProxy();
      });
  }

  /**
   * Load FPL data via CORS proxies as fallback
   */
  function loadFPLSeasonDataViaProxy() {
    const corsProxies = [
      'https://api.allorigins.win/raw?url=' +
        encodeURIComponent('https://fantasy.premierleague.com/api/bootstrap-static/'),
      'https://corsproxy.io/?' +
        encodeURIComponent('https://fantasy.premierleague.com/api/bootstrap-static/'),
      'https://api.codetabs.com/v1/proxy?quest=' +
        encodeURIComponent('https://fantasy.premierleague.com/api/bootstrap-static/'),
    ];

    let currentProxyIndex = 0;

    function tryNextProxy() {
      if (currentProxyIndex >= corsProxies.length) {
        console.error('All CORS proxies failed, using fallback date');
        // GW1 deadline: 15/08/2025 at 19:30 CET = 17:30 UTC
        const fallbackDate = new Date('2025-08-15T17:30:00Z');
        FPLDataLoader.setCachedDeadline(fallbackDate.toISOString());
        seasonDataSource = 'fallback';

        return Promise.resolve({ deadline: fallbackDate, gameweek: null });
      }

      const fplApiUrl = corsProxies[currentProxyIndex];
      console.log(`Trying CORS proxy ${currentProxyIndex + 1}:`, fplApiUrl);

      return fetch(fplApiUrl)
        .then((response) => {
          console.log(`Proxy ${currentProxyIndex + 1} response:`, response);
          if (!response.ok) {
            throw new Error(`Proxy ${currentProxyIndex + 1} failed with status ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('✅ FPL API data successfully fetched via proxy:', data);

          // Find the next gameweek (is_next: true)
          const nextGameweek = data.events.find((event) => event.is_next === true);

          if (nextGameweek) {
            console.log('Next gameweek found:', nextGameweek);
            const deadlineTime = new Date(nextGameweek.deadline_time);

            FPLDataLoader.setCachedDeadline(deadlineTime.toISOString());
            FPLDataLoader.setCachedGameweek({
              id: nextGameweek.id,
              deadline_time: nextGameweek.deadline_time,
            });
            FPLDataLoader.setLastSyncInfo(nextGameweek.id, new Date().toISOString());

            seasonDataSource = 'proxy';

            // Store gameweek data for later use
            window.currentGameweek = nextGameweek;

            return { deadline: deadlineTime, gameweek: nextGameweek };
          } else {
            console.log('No next gameweek found, using fallback date');
            const fallbackDate = new Date('2025-08-15T17:30:00Z');
            FPLDataLoader.setCachedDeadline(fallbackDate.toISOString());
            seasonDataSource = 'fallback';

            return { deadline: fallbackDate, gameweek: null };
          }
        })
        .catch((error) => {
          console.error(`❌ Proxy ${currentProxyIndex + 1} failed:`, error);
          currentProxyIndex++;
          return tryNextProxy();
        });
    }

    return tryNextProxy();
  }

  /**
   * Load winner preview data for header sync and display
   * This function loads winner data specifically for syncing gameweek information
   * between data loader and UI manager modules
   */
  function loadWinnerPreview() {
    console.debug('[loadWinnerPreview] Loading winner data for preview and GW sync');

    try {
      // Determine data source (test vs live)
      const urlParams = new URLSearchParams(window.location.search);
      const isTestMode = urlParams.get('test') === 'true';
      const dataOverride = window.FPLUtils ? FPLUtils.getDataOverride() : 'auto';

      let useTestData = isTestMode;
      if (dataOverride === 'test') useTestData = true;
      if (dataOverride === 'live') useTestData = false;

      const winnersFile = useTestData ? 'data/test_winner_stats.json' : 'data/winner_stats.json';
      const winnerUrl = winnersFile + '?cache=' + new Date().getTime();

      console.debug(
        `[loadWinnerPreview] Using ${useTestData ? 'test' : 'live'} data: ${winnersFile}`
      );

      return fetchWithRetry(winnerUrl, 3)
        .then((data) => {
          console.debug('[loadWinnerPreview] Winner preview data loaded:', data);

          // Capture completed gameweeks from winners summary for header sync
          if (data.summary && data.summary.completedGameweeks !== undefined) {
            const parsed = Number(data.summary.completedGameweeks);
            if (!Number.isNaN(parsed) && Number.isFinite(parsed) && parsed > 0) {
              _lastProcessedGW = parsed;
              console.debug(
                '[loadWinnerPreview] Set _lastProcessedGW from winner data:',
                _lastProcessedGW
              );

              // Sync with UI Manager if available
              if (window.FPLUIManager && typeof FPLUIManager.setLastProcessedGW === 'function') {
                FPLUIManager.setLastProcessedGW(_lastProcessedGW);
                console.debug('[loadWinnerPreview] Synced _lastProcessedGW with UI Manager');
              }

              // Validate against next GW if available (Issue #37 prevention)
              if (typeof _lastGwId === 'number' && _lastGwId > 0) {
                const expectedMax = _lastGwId - 1;
                if (_lastProcessedGW > expectedMax) {
                  console.warn(
                    '[loadWinnerPreview] Issue #37 Prevention: completedGameweeks (',
                    _lastProcessedGW,
                    ') exceeds expected max (',
                    expectedMax,
                    ') based on nextGW (',
                    _lastGwId,
                    ')'
                  );
                }
              }
            } else {
              console.debug('[loadWinnerPreview] Invalid completedGameweeks value:', parsed);
            }
          } else {
            console.debug('[loadWinnerPreview] No completedGameweeks found in summary');
          }

          // Update data timestamps
          if (data.lastUpdated) {
            lastWinnersUpdatedIso = data.lastUpdated;
            updateDataTimestamp('winners', data.lastUpdated);
          }

          return data;
        })
        .catch((error) => {
          console.error('[loadWinnerPreview] Failed to load winner preview data:', error);
          throw error;
        });
    } catch (error) {
      console.error('[loadWinnerPreview] Error in loadWinnerPreview:', error);
      return Promise.reject(error);
    }
  }

  /**
   * Load winner data (both test and live)
   */
  function loadWinnerData(
    containerId = 'winner-preview-container',
    summaryId = 'winner-summary',
    isTestSection = false,
    dataOverride = FPLUtils.getDataOverride()
  ) {
    const urlParams = new URLSearchParams(window.location.search);
    const testContext = urlParams.get('test') === 'true' || isTestSection;
    let useTestData = testContext;
    if (dataOverride === 'test') useTestData = true;
    if (dataOverride === 'live') useTestData = false;

    const winnersFile = useTestData ? 'data/test_winner_stats.json' : 'data/winner_stats.json';
    const winnerUrl = winnersFile + '?cache=' + new Date().getTime();

    lastWinnersDataMode = useTestData ? 'test' : 'live';
    lastWinnersDataFile = winnersFile;

    console.log(useTestData ? '🧪 Loading TEST winner data' : '📊 Loading LIVE winner data');

    return fetchWithRetry(winnerUrl, 3)
      .then((data) => {
        console.log(`${useTestData ? '🧪 Loaded TEST' : '📊 Loaded LIVE'} winner data:`, data);

        // Add test mode indicator if needed
        if (useTestData && data.testMode) {
          const headerP = document.querySelector('header p');
          if (headerP && !headerP.textContent.includes('[TEST MODE]')) {
            headerP.textContent = headerP.textContent + ' [TEST MODE - Demo Data]';
            headerP.style.color = '#ff6b6b';
          }
        }

        // Capture completed gameweeks from winners summary if available
        if (data.summary && data.summary.completedGameweeks !== undefined) {
          const parsed = Number(data.summary.completedGameweeks);
          if (!Number.isNaN(parsed) && Number.isFinite(parsed) && parsed > 0) {
            _lastProcessedGW = parsed;
            console.debug('[GW] Set _lastProcessedGW from winner data:', _lastProcessedGW);

            // TRIGGER: Notify UI Manager to update headers when valid winner data is available
            if (window.FPLUIManager && typeof FPLUIManager.setLastProcessedGW === 'function') {
              FPLUIManager.setLastProcessedGW(_lastProcessedGW);
            }

            // Issue #37 Prevention: Validate against next GW if available
            if (typeof _lastGwId === 'number' && _lastGwId > 0) {
              const expectedMax = _lastGwId - 1;
              if (_lastProcessedGW > expectedMax) {
                console.warn(
                  '[GW] Issue #37 Prevention: completedGameweeks (',
                  _lastProcessedGW,
                  ') exceeds expected max (',
                  expectedMax,
                  ') based on nextGW (',
                  _lastGwId,
                  ')'
                );
              }
            }
          } else {
            console.debug('[GW] Invalid completedGameweeks value, keeping Loading state:', parsed);
          }
        }

        // Track for QA panel
        try {
          lastWinnersUpdatedIso = data.lastUpdated;
        } catch {}

        return data;
      })
      .catch((error) => {
        console.error(`Winner fetch error (${useTestData ? 'test' : 'live'}):`, error);
        throw error;
      });
  }

  /**
   * Caching utilities
   */
  function getCachedDeadline() {
    try {
      const iso = localStorage.getItem('fpl_next_deadline');
      if (!iso) return null;
      const d = new Date(iso);
      return isNaN(d.getTime()) ? null : d;
    } catch (e) {
      return null;
    }
  }

  function setCachedDeadline(isoStr) {
    try {
      localStorage.setItem('fpl_next_deadline', isoStr);
    } catch (e) {
      // ignore quota / privacy errors
    }
  }

  function getCachedGameweek() {
    try {
      const raw = localStorage.getItem('fpl_cached_gw');
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || typeof obj.id === 'undefined' || !obj.deadline_time) return null;
      const d = new Date(obj.deadline_time);
      if (isNaN(d.getTime())) return null;
      return { id: obj.id, deadline_time: obj.deadline_time };
    } catch (e) {
      return null;
    }
  }

  function setCachedGameweek(gw) {
    try {
      if (gw && typeof gw.id !== 'undefined' && gw.deadline_time) {
        const payload = { id: gw.id, deadline_time: gw.deadline_time };
        localStorage.setItem('fpl_cached_gw', JSON.stringify(payload));
      }
    } catch (e) {
      // ignore quota / privacy errors
    }
  }

  function setLastSyncInfo(gwId, iso) {
    _lastGwId = gwId || _lastGwId;
    _lastSyncIso = iso || _lastSyncIso;
  }

  function getLastFinishedGW() {
    // Prioritize completedGameweeks from winner data (most reliable)
    if (typeof _lastProcessedGW === 'number') {
      if (!Number.isFinite(_lastProcessedGW) || _lastProcessedGW < 0 || _lastProcessedGW > 1000) {
        return null;
      }
      console.debug('[GW] Using completedGameweeks from winner data:', _lastProcessedGW);
      return _lastProcessedGW;
    }

    // Fallback to next GW calculation (with validation)
    if (typeof _lastGwId === 'number' && _lastGwId > 0) {
      const calculatedFinished = _lastGwId - 1;
      console.debug('[GW] Using next GW calculation:', _lastGwId, '- 1 =', calculatedFinished);

      // Validation: Don't show "After GW0" or negative values
      if (calculatedFinished < 1) {
        console.warn('[GW] Calculated finished GW is < 1, hiding subtitle:', calculatedFinished);
        return null;
      }

      return calculatedFinished;
    }

    // Final fallback to cached gameweek data
    const gwFromCache = getCachedGameweek();
    if (gwFromCache && typeof gwFromCache.id === 'number') {
      const calculatedFromCache = gwFromCache.id - 1;
      console.debug(
        '[GW] Using cached gameweek calculation:',
        gwFromCache.id,
        '- 1 =',
        calculatedFromCache
      );

      // Validation: Don't show "After GW0" or negative values
      if (calculatedFromCache < 1) {
        console.warn('[GW] Cached finished GW is < 1, hiding subtitle:', calculatedFromCache);
        return null;
      }

      return calculatedFromCache;
    }

    console.debug('[GW] No reliable gameweek data available');
    return null;
  }

  /**
   * Load test leaderboard data
   */
  function loadTestLeaderboardData() {
    lastLeaderboardDataMode = 'test';
    const winnerUrl = 'data/test_winner_stats.json?cache=' + new Date().getTime();
    lastLeaderboardDataFile = 'data/test_winner_stats.json';
    console.log('🧪 Loading TEST leaderboard data');

    return fetchWithRetry(winnerUrl, 3)
      .then((data) => {
        console.log('🧪 Loaded TEST leaderboard data:', data);
        return data;
      })
      .catch((error) => {
        console.error('Test leaderboard fetch error:', error);
        throw error;
      });
  }

  /**
   * Load leaderboard data from winner stats
   */
  function loadLeaderboardData() {
    const urlParams = new URLSearchParams(window.location.search);
    const isTestParam = urlParams.get('test') === 'true';
    const dataOverride = FPLUtils.getDataOverride();
    let useTestData = isTestParam;
    if (dataOverride === 'test') useTestData = true;
    if (dataOverride === 'live') useTestData = false;

    const lbFile = useTestData ? 'data/test_winner_stats.json' : 'data/winner_stats.json';
    const winnerUrl = lbFile + '?cache=' + new Date().getTime();

    lastLeaderboardDataMode = useTestData ? 'test' : 'live';
    lastLeaderboardDataFile = lbFile;

    console.log(
      useTestData ? '🧪 Loading TEST leaderboard data' : '📊 Loading LIVE leaderboard data'
    );

    return fetchWithRetry(winnerUrl, 3)
      .then((data) => {
        console.log(`${useTestData ? '🧪 Loaded TEST' : '📊 Loaded LIVE'} leaderboard data:`, data);

        // Track last updated time
        try {
          lastLeaderboardUpdatedIso = data.lastUpdated || new Date().toISOString();
        } catch {}

        return data;
      })
      .catch((error) => {
        console.error(`Leaderboard fetch error (${useTestData ? 'test' : 'live'}):`, error);
        throw error;
      });
  }

  /**
   * Update timestamp for a specific data source
   */
  function updateDataTimestamp(source, timestamp) {
    if (allDataTimestamps.hasOwnProperty(source)) {
      allDataTimestamps[source] = timestamp;
      updateSiteTimestamp();
    }
  }

  /**
   * Get the latest timestamp across all data sources
   */
  function getLatestTimestamp() {
    const timestamps = Object.values(allDataTimestamps).filter((ts) => ts !== null);
    if (timestamps.length === 0) return null;

    // Find the most recent timestamp
    return timestamps.reduce((latest, current) => {
      return new Date(current) > new Date(latest) ? current : latest;
    });
  }

  /**
   * Update the site-wide timestamp display
   */
  function updateSiteTimestamp() {
    const latestTimestamp = getLatestTimestamp();
    const timestampElement = document.getElementById('site-last-updated');

    if (timestampElement && latestTimestamp) {
      try {
        const date = new Date(latestTimestamp);
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const formattedDate = date.toLocaleString('en-GB', {
          dateStyle: 'medium',
          timeStyle: 'short',
          timeZone: userTimeZone,
        });

        // Check if we're in test mode
        const urlParams = new URLSearchParams(window.location.search);
        const isTestMode = urlParams.get('test') === 'true';
        const testSuffix = isTestMode ? ' (test data)' : '';

        timestampElement.textContent = `Data updated: ${formattedDate}${testSuffix}`;
      } catch (error) {
        timestampElement.textContent = 'Data updated: Recently';
      }
    }
  }

  // Public API
  return {
    fetchWithRetry,
    loadLeagueStats,
    loadFPLSeasonData,
    loadFPLSeasonDataViaProxy,
    loadWinnerData,
    loadWinnerPreview,
    loadTestLeaderboardData,
    loadLeaderboardData,
    getCachedDeadline,
    setCachedDeadline,
    getCachedGameweek,
    setCachedGameweek,
    setLastSyncInfo,
    getLastFinishedGW,
    // State getters
    getSeasonDataSource: () => seasonDataSource,
    getLastWinnersDataMode: () => lastWinnersDataMode,
    getLastLeaderboardDataMode: () => lastLeaderboardDataMode,
    getLastWinnersDataFile: () => lastWinnersDataFile,
    getLastLeaderboardDataFile: () => lastLeaderboardDataFile,
    getLastWinnersUpdatedIso: () => lastWinnersUpdatedIso,
    getLastLeaderboardUpdatedIso: () => lastLeaderboardUpdatedIso,
    getLastSyncIso: () => _lastSyncIso,
    getLastGwId: () => _lastGwId,

    // Centralized timestamp management
    updateDataTimestamp,
    getLatestTimestamp,
    updateSiteTimestamp,
  };
})();
