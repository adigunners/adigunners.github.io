/**
 * Core Utilities and Helper Functions
 * Provides common utility functions used throughout the application
 */

// Global utilities namespace
window.FPLUtils = (function () {
  'use strict';

  // URL parameters for the current page
  const urlParams = new URLSearchParams(window.location.search);
  const clockOffsetRaw = parseInt(urlParams.get('clockOffset') || '0', 10);
  const timeOffsetMs = isNaN(clockOffsetRaw) ? 0 : clockOffsetRaw;

  /**
   * Get current time with optional offset for debugging
   */
  function now() {
    return new Date(Date.now() + timeOffsetMs);
  }

  /**
   * Escape HTML special characters to prevent XSS
   */
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Get data source override from URL parameters
   */
  function getDataOverride() {
    const param = (urlParams.get('data') || 'auto').toLowerCase();
    return param === 'test' || param === 'live' ? param : 'auto';
  }

  /**
   * Check if we're in admin/test mode
   */
  function isAdminMode() {
    return urlParams.get('test') === 'true' || urlParams.get('admin') === 'true';
  }

  /**
   * Build navigation query string preserving selected parameters
   */
  function buildNavQuery(keys = ['test', 'data', 'phase', 'clockOffset']) {
    try {
      const params = new URLSearchParams();
      keys.forEach((k) => {
        const v = urlParams.get(k);
        if (v !== null && v !== undefined && v !== '') params.set(k, v);
      });
      const qs = params.toString();
      return qs ? `?${qs}` : '';
    } catch {
      return '';
    }
  }

  /**
   * DOM manipulation utilities
   */
  function show(el) {
    if (el) el.classList.remove('is-hidden');
  }

  function hide(el) {
    if (el) el.classList.add('is-hidden');
  }

  function showGroup(selector) {
    document.querySelectorAll(selector).forEach((el) => show(el));
  }

  function hideGroup(selector) {
    document.querySelectorAll(selector).forEach((el) => hide(el));
  }

  /**
   * Format Indian Rupees with proper locale formatting
   */
  function formatINR(n) {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(n);
    } catch {
      return `₹${n}`;
    }
  }

  /**
   * Convert number to ordinal (1st, 2nd, 3rd, etc.)
   */
  function ordinal(n) {
    return n === 1 ? '1st' : n === 2 ? '2nd' : n === 3 ? '3rd' : n + 'th';
  }

  /**
   * Sum amounts from a list of prize objects
   */
  function sumAmounts(list) {
    return (list || []).reduce((s, x) => s + (Number(x.amount) || 0), 0);
  }

  /**
   * Sleep utility for delays
   */
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Public API
  return {
    now,
    escapeHTML,
    getDataOverride,
    isAdminMode,
    buildNavQuery,
    show,
    hide,
    showGroup,
    hideGroup,
    formatINR,
    ordinal,
    sumAmounts,
    sleep,
    timeOffsetMs,
  };
})();
