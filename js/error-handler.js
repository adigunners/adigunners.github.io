/**
 * Comprehensive Error Handling System
 * Provides robust error boundaries, retry mechanisms, and user-friendly messages
 */

window.ErrorHandler = (function () {
  'use strict';

  // Error types for categorization
  const ErrorTypes = {
    NETWORK: 'network',
    TIMEOUT: 'timeout',
    PARSE: 'parse',
    NOT_FOUND: 'not_found',
    SERVER: 'server',
    OFFLINE: 'offline',
    UNKNOWN: 'unknown',
  };

  // Configuration
  const config = {
    maxRetries: 3,
    baseDelay: 1000,
    timeoutMs: 10000,
    retryableErrors: [ErrorTypes.NETWORK, ErrorTypes.TIMEOUT, ErrorTypes.SERVER],
  };

  // Error state tracking
  const errorState = {
    isOffline: !navigator.onLine,
    failedResources: new Set(),
    retryCount: new Map(),
    lastErrors: [],
  };

  /**
   * Enhanced fetch with comprehensive error handling
   */
  async function safeFetch(url, options = {}) {
    const startTime = Date.now();
    const resourceKey = url.split('?')[0]; // Remove cache busters for tracking

    try {
      // Check if we're offline
      if (!navigator.onLine) {
        throw new ErrorWithType('Network offline', ErrorTypes.OFFLINE);
      }

      // Set timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs);

      const fetchOptions = {
        ...options,
        signal: controller.signal,
      };

      console.log(`🔄 Fetching: ${url}`);
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      // Check response status
      if (!response.ok) {
        let errorType = ErrorTypes.SERVER;
        if (response.status === 404) errorType = ErrorTypes.NOT_FOUND;
        else if (response.status >= 500) errorType = ErrorTypes.SERVER;
        else if (response.status >= 400) errorType = ErrorTypes.NETWORK;

        throw new ErrorWithType(`HTTP ${response.status}: ${response.statusText}`, errorType, {
          status: response.status,
          url,
        });
      }

      // Parse JSON with error handling
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new ErrorWithType('Invalid JSON response', ErrorTypes.PARSE, { url });
      }

      // Success - reset error tracking
      errorState.failedResources.delete(resourceKey);
      errorState.retryCount.delete(resourceKey);

      const duration = Date.now() - startTime;
      console.log(`✅ Loaded ${url} in ${duration}ms`);

      return data;
    } catch (error) {
      const duration = Date.now() - startTime;

      // Categorize error if not already categorized
      let errorType = error.type || ErrorTypes.UNKNOWN;
      if (error.name === 'AbortError') errorType = ErrorTypes.TIMEOUT;
      if (error.name === 'TypeError') errorType = ErrorTypes.NETWORK;

      console.error(`❌ Failed to fetch ${url} after ${duration}ms:`, error);

      // Track failed resource
      errorState.failedResources.add(resourceKey);
      logError(error, { url, duration, type: errorType });

      throw new ErrorWithType(error.message, errorType, { url, originalError: error });
    }
  }

  /**
   * Retry wrapper with exponential backoff
   */
  async function withRetry(fetchFn, maxRetries = config.maxRetries) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fetchFn();
      } catch (error) {
        lastError = error;

        // Don't retry certain error types
        if (!config.retryableErrors.includes(error.type)) {
          throw error;
        }

        // Don't retry on final attempt
        if (attempt === maxRetries) {
          throw error;
        }

        // Calculate backoff delay
        const delay = config.baseDelay * Math.pow(1.5, attempt - 1);
        console.warn(
          `🔄 Retry ${attempt}/${maxRetries} in ${delay}ms for ${error.url || 'unknown resource'}`
        );

        await sleep(delay);
      }
    }

    throw lastError;
  }

  /**
   * Error boundary for UI components
   */
  function withErrorBoundary(element, loadingFn, options = {}) {
    const {
      loadingText = 'Loading...',
      errorText = 'Unable to load data. Please try again.',
      retryButton = true,
      fallbackContent = null,
    } = options;

    // Show loading state
    showLoadingState(element, loadingText);

    // Execute the loading function with error handling
    return withRetry(loadingFn)
      .then((data) => {
        showSuccessState(element);
        return data;
      })
      .catch((error) => {
        showErrorState(element, error, {
          errorText,
          retryButton: retryButton ? () => withErrorBoundary(element, loadingFn, options) : null,
          fallbackContent,
        });
        throw error;
      });
  }

  /**
   * UI state management
   */
  function showLoadingState(element, text) {
    if (!element) return;
    element.innerHTML = `
      <div class="error-handler-loading">
        <div class="loading-spinner"></div>
        <span>${escapeHTML(text)}</span>
      </div>
    `;
  }

  function showErrorState(element, error, options = {}) {
    if (!element) return;

    const { errorText, retryButton, fallbackContent } = options;
    const isOfflineError = error.type === ErrorTypes.OFFLINE;

    let content = `
      <div class="error-handler-error">
        <div class="error-icon">⚠️</div>
        <div class="error-message">
          ${escapeHTML(errorText)}
          ${isOfflineError ? '<br><small>Check your internet connection</small>' : ''}
        </div>
    `;

    if (retryButton && typeof retryButton === 'function') {
      content += `
        <button class="error-retry-btn" onclick="this.disabled=true; arguments[0].target.textContent='Retrying...'; (() => { ${retryButton.toString()}(); })()">
          Try Again
        </button>
      `;
    }

    if (fallbackContent) {
      content += `<div class="error-fallback">${fallbackContent}</div>`;
    }

    content += '</div>';
    element.innerHTML = content;
  }

  function showSuccessState(element) {
    // Remove any error classes
    element.classList.remove('error-handler-error', 'error-handler-loading');
  }

  /**
   * Network status monitoring
   */
  function initNetworkMonitoring() {
    // Online/offline detection
    window.addEventListener('online', () => {
      errorState.isOffline = false;
      console.log('🌐 Connection restored');
      showNetworkStatus('online');

      // Retry failed resources
      retryFailedResources();
    });

    window.addEventListener('offline', () => {
      errorState.isOffline = true;
      console.log('📡 Connection lost');
      showNetworkStatus('offline');
    });

    // If we loaded while offline, reflect status immediately
    if (!navigator.onLine) {
      showNetworkStatus('offline');
    }

    // Initial and periodic connectivity checks
    // Run an immediate check so offline banner appears even if page loads while offline
    try {
      checkConnectivity();
    } catch (_) {}
    setInterval(checkConnectivity, 30000);
  }

  function showNetworkStatus(status) {
    const existing = document.getElementById('network-status');
    if (existing) existing.remove();

    if (status === 'offline') {
      const banner = document.createElement('div');
      banner.id = 'network-status';
      banner.className = 'network-banner offline';
      banner.innerHTML = "📡 You're offline. Some features may not work.";
      document.body.insertBefore(banner, document.body.firstChild);

      // Ensure critical UI placeholders are visible when offline
      try {
        ensureStaticCountdown();
      } catch (_) {}
    }
  }

  // Make countdown visible with static zeros when offline
  function ensureStaticCountdown() {
    try {
      const clock = document.getElementById('countdown-clock');
      if (!clock) return;
      clock.classList.remove('is-hidden');
      clock.style.display = 'block';
      const label = document.getElementById('countdown-label');
      if (label) label.textContent = 'GW Deadline (offline)';
      const d = document.getElementById('countdown-days');
      const h = document.getElementById('countdown-hours');
      const m = document.getElementById('countdown-minutes');
      if (d) d.textContent = '00';
      if (h) h.textContent = '00';
      if (m) m.textContent = '00';
    } catch (e) {
      // no-op
    }
  }

  async function checkConnectivity() {
    try {
      // Use different connectivity check endpoint on winners page
      // Use a guaranteed-local asset to avoid 404s in dev
      const checkUrl = '/css/styles.css?check=' + Date.now();

      await fetch(checkUrl, {
        method: 'HEAD',
        cache: 'no-store',
      });
      if (errorState.isOffline) {
        errorState.isOffline = false;
        window.dispatchEvent(new Event('online'));
      }
    } catch {
      // Always ensure banner is visible
      showNetworkStatus('offline');
      if (!errorState.isOffline) {
        errorState.isOffline = true;
        window.dispatchEvent(new Event('offline'));
      }
    }
  }

  function retryFailedResources() {
    // This would trigger re-fetching of failed resources
    // Implementation depends on your specific data loading patterns
    console.log('🔄 Retrying failed resources:', Array.from(errorState.failedResources));
  }

  /**
   * Error logging and reporting
   */
  function logError(error, context = {}) {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      message: error.message,
      type: error.type || 'unknown',
      url: context.url,
      userAgent: navigator.userAgent,
      context,
    };

    errorState.lastErrors.push(errorEntry);

    // Keep only last 50 errors
    if (errorState.lastErrors.length > 50) {
      errorState.lastErrors = errorState.lastErrors.slice(-50);
    }

    // In production, you might want to send errors to a logging service
    if (window.location.hostname !== 'localhost') {
      // Example: sendErrorToLoggingService(errorEntry);
    }
  }

  /**
   * Utility functions
   */
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Custom error class with type information
  class ErrorWithType extends Error {
    constructor(message, type, context = {}) {
      super(message);
      this.name = 'ErrorWithType';
      this.type = type;
      this.context = context;
      this.url = context.url;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNetworkMonitoring);
  } else {
    initNetworkMonitoring();
  }

  // Public API
  return {
    safeFetch,
    withRetry,
    withErrorBoundary,
    ErrorTypes,
    getErrorState: () => ({ ...errorState }),
    showLoadingState,
    showErrorState,
    showSuccessState,
  };
})();
