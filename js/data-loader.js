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

        // Update last updated text
        if (lastUpdatedEl) {
          if (data.lastUpdated) {
            try {
              const lastUpdated = new Date(data.lastUpdated);
              const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
              const formattedDate = lastUpdated.toLocaleString('en-GB', {
                dateStyle: 'medium',
                timeStyle: 'short',
                timeZone: userTimeZone,
              });
              lastUpdatedEl.textContent = `Last updated: ${formattedDate}`;
            } catch {
              lastUpdatedEl.textContent = 'Data updated recently';
            }
          } else {
            lastUpdatedEl.textContent = 'Data updated recently';
          }
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
          if (!Number.isNaN(parsed)) {
            _lastProcessedGW = parsed;
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
    if (typeof _lastProcessedGW === 'number') {
      if (!Number.isFinite(_lastProcessedGW) || _lastProcessedGW < 0 || _lastProcessedGW > 1000) {
        return null;
      }
      return _lastProcessedGW;
    }

    if (typeof _lastGwId === 'number' && _lastGwId > 0) return _lastGwId - 1;
    const gwFromCache = getCachedGameweek();
    if (gwFromCache && typeof gwFromCache.id === 'number') return gwFromCache.id - 1;
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

  // Public API
  return {
    fetchWithRetry,
    loadLeagueStats,
    loadFPLSeasonData,
    loadFPLSeasonDataViaProxy,
    loadWinnerData,
    fetchWithRetry,
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
  };
})();
