/**
 * API Module - Shared fetch wrappers with timeout and retry
 * Provides consistent error handling and network resilience for all HTTP requests
 */

/**
 * Fetch JSON data with timeout and retry logic
 * @param {string} url - The URL to fetch
 * @param {Object} options - Configuration options
 * @param {number} options.timeoutMs - Request timeout in milliseconds (default: 8000)
 * @param {number} options.retries - Number of retry attempts (default: 1)
 * @returns {Promise<any>} Parsed JSON response
 */
export async function fetchJSON(url, { timeoutMs = 8000, retries = 1 } = {}) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      lastError = error;

      if (attempt < retries) {
        console.log(`API retry ${attempt + 1}/${retries} for ${url}: ${error.message}`);
        // Exponential backoff delay
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 500));
      }
    }
  }

  // Log only the final error to avoid console spam
  console.error(`API request failed after ${retries + 1} attempts for ${url}:`, lastError);
  throw lastError;
}

/**
 * Check if using V2 data source from URL params
 */
function isV2() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('data') === 'v2';
}

/**
 * Get the data path prefix based on version
 */
function getDataPrefix() {
  return isV2() ? 'data/v2/' : 'data/';
}

/**
 * Get API endpoints with cache busting
 * Supports both V1 (AppScript) and V2 (Supabase) data sources
 */
export const endpoints = {
  winnerStats: (isTest = false) => {
    // V2 doesn't have separate test data - uses same file
    if (isV2()) {
      return `data/v2/winner_stats.json?cache=${Date.now()}`;
    }
    const file = isTest ? 'data/test_winner_stats.json' : 'data/winner_stats.json';
    return `${file}?cache=${Date.now()}`;
  },

  leagueStats: () => `${getDataPrefix()}league_stats.json?cache=${Date.now()}`,

  nextDeadline: () => `${getDataPrefix()}next_deadline.json?cache=${Date.now()}`,

  prizes: () => `${getDataPrefix()}prizes.json?cache=${Date.now()}`,
};

/**
 * Get data source label for logging
 * @returns {string} 'supabase' | 'appscript' | 'testing'
 */
export function getDataSourceLabel() {
  if (isV2()) return 'supabase';
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('test') === 'true' || urlParams.get('data') === 'test') return 'testing';
  return 'appscript';
}
