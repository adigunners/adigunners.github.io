/**
 * State Module - Shared constants and feature flags
 * Centralized configuration and state management
 */

// Responsive breakpoints - aligned with CSS tokens
export const BREAKPOINTS = {
  XS: 375, // Extra Small - Mobile portrait (optional)
  SM: 480, // Small - Mobile landscape
  MD: 768, // Medium - Tablet portrait
  LG: 1024, // Large - Tablet landscape / Small desktop
  XL: 1200, // Extra Large - Desktop
  XXL: 1440, // 2X Large - Large desktop

  // Legacy (deprecated - use tokens above)
  DESKTOP_MIN_PX: 1025,
  TABLET_MIN_PX: 701,
  MOBILE_MAX_PX: 700,
};

// Pagination configuration
export const PAGINATION = {
  WINNERS_PER_PAGE: 10,
  LEADERBOARD_PER_PAGE: 10,
};

// URL parameter handling
export const URL_PARAMS = new URLSearchParams(window.location.search);

// Feature flags and test mode detection
export const FEATURE_FLAGS = {
  isTestMode: URL_PARAMS.get('test') === 'true',
  isAdminMode: URL_PARAMS.get('admin') === 'true',
  debugMode: URL_PARAMS.get('debug') === '1',
  dataOverride: URL_PARAMS.get('data') || 'auto',
  clockOffset: parseInt(URL_PARAMS.get('clockOffset') || '0', 10) || 0,
};

// Data source configuration
export const DATA_SOURCES = {
  WINNERS_LIVE: 'data/winner_stats.json',
  WINNERS_TEST: 'data/test_winner_stats.json',
  LEAGUE_STATS: 'data/league_stats.json',
  NEXT_DEADLINE: 'data/next_deadline.json',
  PRIZES: 'data/prizes.json',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to load data. Please check your connection and try again.',
  WINNERS_UNAVAILABLE: 'Winners are unavailable. Please try again soon.',
  STATS_UNAVAILABLE: 'Statistics are temporarily unavailable.',
  GENERIC_ERROR: 'Something went wrong. Please refresh the page and try again.',
};

// Loading messages
export const LOADING_MESSAGES = {
  WINNERS: 'Loading complete winner data...',
  STATS: 'Loading league statistics...',
  COUNTDOWN: 'Loading countdown data...',
  GENERIC: 'Loading...',
};

// Winner rank classes
export const RANK_CLASSES = {
  1: 'winner-gold',
  2: 'winner-silver',
  3: 'winner-bronze',
};

/**
 * Get data source based on test mode and overrides
 * @param {string} type - Data type ('winners', 'stats', 'deadline')
 * @returns {string} Data source URL
 */
export function getDataSource(type) {
  const isTest = FEATURE_FLAGS.isTestMode || FEATURE_FLAGS.dataOverride === 'test';
  const isLive = FEATURE_FLAGS.dataOverride === 'live';

  switch (type) {
    case 'winners':
      if (isLive) return DATA_SOURCES.WINNERS_LIVE;
      if (isTest) return DATA_SOURCES.WINNERS_TEST;
      return FEATURE_FLAGS.isTestMode ? DATA_SOURCES.WINNERS_TEST : DATA_SOURCES.WINNERS_LIVE;

    case 'stats':
      return DATA_SOURCES.LEAGUE_STATS;

    case 'deadline':
      return DATA_SOURCES.NEXT_DEADLINE;

    case 'prizes':
      return DATA_SOURCES.PRIZES;

    default:
      throw new Error(`Unknown data source type: ${type}`);
  }
}

/**
 * Check if current viewport is mobile (below MD breakpoint)
 * @returns {boolean} True if mobile viewport
 */
export function isMobile() {
  return window.matchMedia(`(max-width: ${BREAKPOINTS.MD - 1}px)`).matches;
}

/**
 * Check if current viewport is tablet (MD to LG)
 * @returns {boolean} True if tablet viewport
 */
export function isTablet() {
  return window.matchMedia(
    `(min-width: ${BREAKPOINTS.MD}px) and (max-width: ${BREAKPOINTS.LG - 1}px)`
  ).matches;
}

/**
 * Check if current viewport is desktop (LG and above)
 * @returns {boolean} True if desktop viewport
 */
export function isDesktop() {
  return window.matchMedia(`(min-width: ${BREAKPOINTS.LG}px)`).matches;
}

/**
 * Check if current viewport is large desktop (XL and above)
 * @returns {boolean} True if large desktop viewport
 */
export function isLargeDesktop() {
  return window.matchMedia(`(min-width: ${BREAKPOINTS.XL}px)`).matches;
}

// Legacy functions (deprecated - use new functions above)
export function isDesktopViewport() {
  return window.matchMedia(`(min-width: ${BREAKPOINTS.DESKTOP_MIN_PX}px)`).matches;
}

export function isTabletViewport() {
  return window.matchMedia(
    `(min-width: ${BREAKPOINTS.TABLET_MIN_PX}px) and (max-width: ${BREAKPOINTS.DESKTOP_MIN_PX - 1}px)`
  ).matches;
}

export function isMobileViewport() {
  return window.matchMedia(`(max-width: ${BREAKPOINTS.MOBILE_MAX_PX}px)`).matches;
}

/**
 * Build navigation query string preserving selected parameters
 * @param {string[]} keys - Parameter keys to preserve
 * @returns {string} Query string with parameters
 */
export function buildNavQuery(keys = ['test', 'data', 'phase', 'clockOffset']) {
  try {
    const params = new URLSearchParams();
    keys.forEach((k) => {
      const v = URL_PARAMS.get(k);
      if (v !== null && v !== undefined && v !== '') {
        params.set(k, v);
      }
    });
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  } catch {
    return '';
  }
}
