/**
 * Countdown Timer and Time Management
 * Handles countdown display, timers, and time-related functions
 */

window.FPLCountdown = (function () {
  'use strict';

  let countdownInterval = null;
  let countdownShown = false;

  /**
   * Mark countdown as shown to prevent multiple timers
   */
  function markCountdownShown() {
    countdownShown = true;
  }

  /**
   * Check if countdown has been shown
   */
  function isCountdownShown() {
    return countdownShown;
  }

  /**
   * Start countdown timer with proper cleanup and error boundaries
   */
  function startCountdown(deadlineTime, gameweek = null) {
    try {
      // Validate inputs first
      if (!deadlineTime) {
        console.error('[Countdown] Invalid deadline time provided');
        return false;
      }

      const deadline = new Date(deadlineTime);
      if (isNaN(deadline.getTime())) {
        console.error('[Countdown] Invalid date format:', deadlineTime);
        return false;
      }

      // Clear any existing timer to avoid duplicate intervals
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        console.debug('[Countdown] Cleared existing countdown interval');
      }

      // Validate required DOM elements exist
      const countdownClock = document.getElementById('countdown-clock');
      if (!countdownClock) {
        console.error('[Countdown] Countdown clock element not found');
        return false;
      }

      // Ensure FPLUtils is available for DOM manipulation
      if (!window.FPLUtils || typeof window.FPLUtils.show !== 'function') {
        console.warn('[Countdown] FPLUtils not available, using fallback DOM methods');
        countdownClock.classList.remove('is-hidden');
        countdownClock.style.display = 'block';
      } else {
        FPLUtils.show(countdownClock);
      }

      // Initial paint with error handling
      try {
        if (gameweek) {
          updateGameweekCountdown(gameweek);
        } else {
          updateCountdownDisplay(deadline);
        }
      } catch (error) {
        console.error('[Countdown] Error in initial countdown update:', error);
        // Try basic fallback display
        displayFallbackCountdown(deadline);
      }

      // Schedule updates every second with error recovery
      countdownInterval = setInterval(() => {
        try {
          if (gameweek) {
            updateGameweekCountdown(gameweek);
          } else {
            updateCountdownDisplay(deadline);
          }
        } catch (error) {
          console.error('[Countdown] Error in countdown update interval:', error);
          // Try fallback display
          try {
            displayFallbackCountdown(deadline);
          } catch (fallbackError) {
            console.error('[Countdown] Fallback display also failed:', fallbackError);
            // Clear the broken interval
            clearCountdown();
          }
        }
      }, 1000);

      markCountdownShown();
      console.debug('[Countdown] Successfully started countdown timer');
      return true;
    } catch (error) {
      console.error('[Countdown] Critical error in startCountdown:', error);
      // Ensure we don't leave broken timers running
      clearCountdown();
      return false;
    }
  }

  /**
   * Basic fallback countdown display when main functions fail
   */
  function displayFallbackCountdown(deadlineTime) {
    try {
      const now = new Date();
      const timeDifference = new Date(deadlineTime) - now;

      const countdownClock = document.getElementById('countdown-clock');
      const labelEl = document.getElementById('countdown-label');

      if (!countdownClock) return;

      // Make countdown visible
      countdownClock.style.display = 'block';
      countdownClock.classList.remove('is-hidden');

      if (timeDifference <= 0) {
        // Show LIVE status
        if (labelEl) labelEl.textContent = 'Season LIVE';
        const daysEl = document.getElementById('countdown-days');
        if (daysEl) daysEl.textContent = 'LIVE';
        return;
      }

      // Calculate basic time components
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

      // Update elements if they exist
      if (labelEl) labelEl.textContent = 'Next Deadline';

      const daysEl = document.getElementById('countdown-days');
      const hoursEl = document.getElementById('countdown-hours');
      const minutesEl = document.getElementById('countdown-minutes');

      if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
      if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
      if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    } catch (error) {
      console.error('[Countdown] Fallback display failed:', error);
    }
  }

  /**
   * Update countdown display for general deadlines
   */
  function updateCountdownDisplay(deadlineTime) {
    try {
      // Validate FPLUtils availability
      const currentDate =
        window.FPLUtils && typeof window.FPLUtils.now === 'function' ? FPLUtils.now() : new Date();

      const timeDifference = deadlineTime - currentDate;

      if (timeDifference <= 0) {
        // Season has started
        const headerP = document.querySelector('header p');
        const countdownClock = document.getElementById('countdown-clock');

        if (headerP) {
          headerP.textContent = 'Season 2025-26 - Live Updates';
        }

        if (countdownClock) {
          // Use FPLUtils if available, otherwise fallback to direct DOM manipulation
          if (window.FPLUtils && typeof window.FPLUtils.hide === 'function') {
            FPLUtils.hide(countdownClock);
          } else {
            countdownClock.classList.add('is-hidden');
            countdownClock.style.display = 'none';
          }
        }
        return;
      }

      // Update label per requirement
      const labelEl = document.getElementById('countdown-label');
      if (labelEl) {
        // Pre-season message
        labelEl.textContent = 'GW1 Deadline';

        // Safe call to attach admin badge
        try {
          if (window.FPLUIManager && typeof window.FPLUIManager.attachAdminBadge === 'function') {
            FPLUIManager.attachAdminBadge();
          }
        } catch (badgeError) {
          console.warn('[Countdown] Admin badge attachment failed:', badgeError);
        }
      }

      // Use enhanced countdown system if available
      if (
        window.CountdownEnhancements &&
        typeof window.CountdownEnhancements.updateCountdownWithUrgency === 'function'
      ) {
        try {
          CountdownEnhancements.updateCountdownWithUrgency(deadlineTime);
          // Dispatch event for other systems
          document.dispatchEvent(
            new CustomEvent('countdownUpdate', {
              detail: { deadlineTime, gameweek: null },
            })
          );
          return;
        } catch (enhancementError) {
          console.warn(
            '[Countdown] Enhancement system failed, falling back to basic countdown:',
            enhancementError
          );
        }
      }

      // Fallback: Calculate time components
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

      // Update digital clock
      const countdownClock = document.getElementById('countdown-clock');
      if (countdownClock) {
        countdownClock.style.display = 'block';
        countdownClock.classList.remove('is-hidden');

        const daysEl = document.getElementById('countdown-days');
        const hoursEl = document.getElementById('countdown-hours');
        const minutesEl = document.getElementById('countdown-minutes');

        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
      }
    } catch (error) {
      console.error('[Countdown] Error in updateCountdownDisplay:', error);
      // Try fallback display
      displayFallbackCountdown(deadlineTime);
    }
  }

  /**
   * Update countdown for specific gameweek
   */
  function updateGameweekCountdown(gameweek) {
    try {
      // Validate gameweek data
      if (!gameweek || !gameweek.id || !gameweek.deadline_time) {
        console.error('[Countdown] Invalid gameweek data provided:', gameweek);
        return;
      }

      const countdownClock = document.getElementById('countdown-clock');
      const countdownLabel = document.getElementById('countdown-label');

      if (!countdownClock || !countdownLabel) {
        console.error('[Countdown] Required countdown elements not found');
        return;
      }

      // Show countdown clock with fallback DOM methods
      if (window.FPLUtils && typeof window.FPLUtils.show === 'function') {
        FPLUtils.show(countdownClock);
      } else {
        countdownClock.classList.remove('is-hidden');
        countdownClock.style.display = 'block';
      }

      countdownLabel.textContent = `GW${gameweek.id} Deadline`;

      // Update winners header to indicate this GW has been used for the preview
      try {
        if (window.FPLUIManager) {
          if (typeof FPLUIManager.updateWinnersHeaderGW === 'function') {
            FPLUIManager.updateWinnersHeaderGW();
          }
          if (typeof FPLUIManager.updateLeaderboardHeaderGW === 'function') {
            FPLUIManager.updateLeaderboardHeaderGW();
          }
          if (typeof FPLUIManager.attachAdminBadge === 'function') {
            FPLUIManager.attachAdminBadge();
          }
        }
      } catch (e) {
        console.warn('[Countdown] Header/badge update failed:', e);
      }

      // Update the countdown display with gameweek deadline
      const deadlineTime = new Date(gameweek.deadline_time);
      if (isNaN(deadlineTime.getTime())) {
        console.error('[Countdown] Invalid deadline_time in gameweek:', gameweek.deadline_time);
        return;
      }

      // Use enhanced countdown system if available
      if (
        window.CountdownEnhancements &&
        typeof window.CountdownEnhancements.updateCountdownWithUrgency === 'function'
      ) {
        try {
          CountdownEnhancements.updateCountdownWithUrgency(deadlineTime, gameweek);
          // Dispatch event for other systems
          document.dispatchEvent(
            new CustomEvent('countdownUpdate', {
              detail: { deadlineTime, gameweek },
            })
          );
          return;
        } catch (enhancementError) {
          console.warn(
            '[Countdown] Enhancement system failed, falling back to basic countdown:',
            enhancementError
          );
        }
      }

      // Fallback to basic countdown
      const currentDate =
        window.FPLUtils && typeof window.FPLUtils.now === 'function' ? FPLUtils.now() : new Date();

      const timeDifference = deadlineTime - currentDate;

      if (timeDifference <= 0) {
        // Deadline passed, show "Live" status
        const daysEl = countdownClock.querySelector('#countdown-days');
        const hoursEl = countdownClock.querySelector('#countdown-hours');
        const minutesEl = countdownClock.querySelector('#countdown-minutes');
        const countdownTime = countdownClock.querySelector('.countdown-time');

        if (daysEl) daysEl.textContent = 'LIVE';
        if (hoursEl) hoursEl.textContent = '';
        if (minutesEl) minutesEl.textContent = '';

        // Add live-mode class to countdown-time for CSS styling
        if (countdownTime) {
          countdownTime.classList.add('live-mode');
        }

        // Hide separators and labels
        countdownClock
          .querySelectorAll('.countdown-separator')
          .forEach((sep) => sep.classList.add('is-hidden'));
        countdownClock
          .querySelectorAll('.countdown-unit-label')
          .forEach((label) => label.classList.add('is-hidden'));

        // Update label to reflect LIVE for current GW
        if (countdownLabel) {
          countdownLabel.textContent = `GW${gameweek.id} LIVE`;
          try {
            FPLUIManager.attachAdminBadge();
          } catch (e) {}
        }
      } else {
        // Show countdown to deadline
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

        const daysEl = countdownClock.querySelector('#countdown-days');
        const hoursEl = countdownClock.querySelector('#countdown-hours');
        const minutesEl = countdownClock.querySelector('#countdown-minutes');
        const countdownTime = countdownClock.querySelector('.countdown-time');

        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');

        // Remove live-mode class when showing normal countdown
        if (countdownTime) {
          countdownTime.classList.remove('live-mode');
        }

        // Show separators and labels
        countdownClock
          .querySelectorAll('.countdown-separator')
          .forEach((sep) => sep.classList.remove('is-hidden'));
        countdownClock
          .querySelectorAll('.countdown-unit-label')
          .forEach((label) => label.classList.remove('is-hidden'));
      }
    } catch (error) {
      console.error('[Countdown] Error in updateGameweekCountdown:', error);
      // Try fallback display using the basic countdown
      try {
        displayFallbackCountdown(new Date(gameweek.deadline_time));
      } catch (fallbackError) {
        console.error('[Countdown] Fallback gameweek display also failed:', fallbackError);
      }
    }
  }

  /**
   * Schedule rollover check after deadline
   */
  function scheduleRolloverCheck(deadline) {
    const ms = deadline - FPLUtils.now();
    if (!(ms > 0 && ms < 1000 * 60 * 60 * 24 * 7)) return;

    // After deadline passes, show LIVE (handled by update loop) and poll ONLY backend JSON
    // until it publishes the next gameweek. Do not use proxies during this window.
    const POLL_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
    let stopped = false;
    const previousGw = (function () {
      try {
        const gw = FPLDataLoader.getCachedGameweek();
        return gw && typeof gw.id === 'number' ? gw.id : null;
      } catch (e) {
        return null;
      }
    })();

    function pollBackendOnce() {
      if (stopped) return;
      fetch('data/next_deadline.json?cache=' + Date.now())
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => {
          if (data && data.nextGameweek && data.nextGameweek.deadline_time) {
            const gw = data.nextGameweek;
            const dl = new Date(gw.deadline_time);
            const isNewGw = typeof previousGw === 'number' ? gw.id > previousGw : true;

            if (isNewGw) {
              // Cache and switch to next GW countdown
              FPLDataLoader.setCachedDeadline(dl.toISOString());
              FPLDataLoader.setCachedGameweek({ id: gw.id, deadline_time: gw.deadline_time });
              FPLDataLoader.setLastSyncInfo(gw.id, data.lastUpdated || new Date().toISOString());

              try {
                FPLUIManager.updateWinnersHeaderGW();
                FPLUIManager.updateLeaderboardHeaderGW();
              } catch (e) {}

              updateGameweekCountdown(gw);
              startCountdown(dl, gw);
              try {
                FPLUIManager.attachAdminBadge();
                FPLUIManager.updateQAPanel();
              } catch (e) {}

              stopped = true; // stop polling
            } else {
              // Not yet rolled over according to backend; poll again later
              setTimeout(pollBackendOnce, POLL_INTERVAL_MS);
            }
          } else {
            // Backend not ready; poll again later
            setTimeout(pollBackendOnce, POLL_INTERVAL_MS);
          }
        })
        .catch(() => {
          // Network/backend temporarily unavailable; try again later
          setTimeout(pollBackendOnce, POLL_INTERVAL_MS);
        });
    }

    setTimeout(() => {
      if (!stopped) pollBackendOnce();
    }, ms + 15000); // start ~15s after deadline
  }

  /**
   * Get countdown state
   */
  function getCountdownState() {
    return {
      isShown: countdownShown,
      hasInterval: countdownInterval !== null,
    };
  }

  /**
   * Clear countdown timer
   */
  function clearCountdown() {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }

  // Public API
  return {
    startCountdown,
    updateCountdownDisplay,
    updateGameweekCountdown,
    scheduleRolloverCheck,
    markCountdownShown,
    isCountdownShown,
    getCountdownState,
    clearCountdown,
  };
})();
