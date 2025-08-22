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
   * Start countdown timer with proper cleanup
   */
  function startCountdown(deadlineTime, gameweek = null) {
    // Clear any existing timer to avoid duplicate intervals
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }

    // Ensure the clock is visible immediately once we know a deadline
    const countdownClock = document.getElementById('countdown-clock');
    if (countdownClock) {
      FPLUtils.show(countdownClock);
    }

    // Initial paint
    if (gameweek) {
      updateGameweekCountdown(gameweek);
    } else {
      updateCountdownDisplay(deadlineTime);
    }

    // Schedule updates every second
    countdownInterval = setInterval(() => {
      if (gameweek) {
        updateGameweekCountdown(gameweek);
      } else {
        updateCountdownDisplay(deadlineTime);
      }
    }, 1000);

    markCountdownShown();
  }

  /**
   * Update countdown display for general deadlines
   */
  function updateCountdownDisplay(deadlineTime) {
    const currentDate = FPLUtils.now();
    const timeDifference = deadlineTime - currentDate;

    if (timeDifference <= 0) {
      // Season has started
      const headerP = document.querySelector('header p');
      const countdownClock = document.getElementById('countdown-clock');

      if (headerP) {
        headerP.textContent = 'Season 2025-26 - Live Updates';
      }

      if (countdownClock) {
        FPLUtils.hide(countdownClock);
      }
      return;
    }

    // Update label per requirement
    const labelEl = document.getElementById('countdown-label');
    if (labelEl) {
      // Pre-season message
      labelEl.textContent = 'GW1 Deadline';
      FPLUIManager.attachAdminBadge();
    }

    // Use enhanced countdown system if available
    if (window.CountdownEnhancements) {
      CountdownEnhancements.updateCountdownWithUrgency(deadlineTime);
      // Dispatch event for other systems
      document.dispatchEvent(
        new CustomEvent('countdownUpdate', {
          detail: { deadlineTime, gameweek: null },
        })
      );
      return;
    }

    // Fallback: Calculate time components
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    // Update digital clock
    const countdownClock = document.getElementById('countdown-clock');
    if (countdownClock) {
      countdownClock.style.display = 'block';

      const daysEl = document.getElementById('countdown-days');
      const hoursEl = document.getElementById('countdown-hours');
      const minutesEl = document.getElementById('countdown-minutes');

      if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
      if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
      if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    }
  }

  /**
   * Update countdown for specific gameweek
   */
  function updateGameweekCountdown(gameweek) {
    const countdownClock = document.getElementById('countdown-clock');
    const countdownLabel = document.getElementById('countdown-label');

    if (countdownClock && countdownLabel) {
      FPLUtils.show(countdownClock);
      countdownLabel.textContent = `GW${gameweek.id} Deadline`;

      // Update winners header to indicate this GW has been used for the preview
      try {
        FPLUIManager.updateWinnersHeaderGW();
        FPLUIManager.updateLeaderboardHeaderGW();
      } catch (e) {
        // non-fatal
      }
      FPLUIManager.attachAdminBadge();

      // Update the countdown display with gameweek deadline
      const deadlineTime = new Date(gameweek.deadline_time);

      // Use enhanced countdown system if available
      if (window.CountdownEnhancements) {
        CountdownEnhancements.updateCountdownWithUrgency(deadlineTime, gameweek);
        // Dispatch event for other systems
        document.dispatchEvent(
          new CustomEvent('countdownUpdate', {
            detail: { deadlineTime, gameweek },
          })
        );
        return;
      }

      // Fallback to basic countdown
      const currentDate = FPLUtils.now();
      const timeDifference = deadlineTime - currentDate;

      if (timeDifference <= 0) {
        // Deadline passed, show "Live" status
        const daysEl = document.getElementById('countdown-days');
        const hoursEl = document.getElementById('countdown-hours');
        const minutesEl = document.getElementById('countdown-minutes');
        const countdownTime = document.querySelector('.countdown-time');

        if (daysEl) daysEl.textContent = 'LIVE';
        if (hoursEl) hoursEl.textContent = '';
        if (minutesEl) minutesEl.textContent = '';

        // Add live-mode class to countdown-time for CSS styling
        if (countdownTime) {
          countdownTime.classList.add('live-mode');
        }

        // Hide separators and labels
        document
          .querySelectorAll('.countdown-separator')
          .forEach((sep) => sep.classList.add('is-hidden'));
        document
          .querySelectorAll('.countdown-unit-label')
          .forEach((label) => label.classList.add('is-hidden'));
      } else {
        // Show countdown to deadline
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

        const daysEl = document.getElementById('countdown-days');
        const hoursEl = document.getElementById('countdown-hours');
        const minutesEl = document.getElementById('countdown-minutes');
        const countdownTime = document.querySelector('.countdown-time');

        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');

        // Remove live-mode class when showing normal countdown
        if (countdownTime) {
          countdownTime.classList.remove('live-mode');
        }

        // Show separators and labels
        document
          .querySelectorAll('.countdown-separator')
          .forEach((sep) => sep.classList.remove('is-hidden'));
        document
          .querySelectorAll('.countdown-unit-label')
          .forEach((label) => label.classList.remove('is-hidden'));
      }
    }
  }

  /**
   * Schedule rollover check after deadline
   */
  function scheduleRolloverCheck(deadline) {
    const ms = deadline - FPLUtils.now();
    if (ms > 0 && ms < 1000 * 60 * 60 * 24 * 7) {
      setTimeout(() => {
        // Re-fetch backend to advance to next GW after deadline passes
        fetch('data/next_deadline.json?cache=' + Date.now())
          .then((r) => (r.ok ? r.json() : Promise.reject()))
          .then((data) => {
            if (data && data.nextGameweek && data.nextGameweek.deadline_time) {
              const gw = data.nextGameweek;
              const dl = new Date(gw.deadline_time);

              FPLDataLoader.setCachedDeadline(dl.toISOString());
              FPLDataLoader.setCachedGameweek({ id: gw.id, deadline_time: gw.deadline_time });
              FPLDataLoader.setLastSyncInfo(gw.id, data.lastUpdated || new Date().toISOString());

              // Reflect latest GW in winners + leaderboard headers
              FPLUIManager.updateWinnersHeaderGW();
              FPLUIManager.updateLeaderboardHeaderGW();

              updateGameweekCountdown(gw);
              startCountdown(dl, gw);
              FPLUIManager.attachAdminBadge();
              FPLUIManager.updateQAPanel();
            } else {
              // Fallback to proxy if backend fails
              FPLDataLoader.loadFPLSeasonDataViaProxy()
                .then(({ deadline, gameweek }) => {
                  FPLUIManager.handleSeasonDisplay(deadline, gameweek);
                  startCountdown(deadline, gameweek);
                })
                .catch(console.error);
            }
          })
          .catch(() => {
            FPLDataLoader.loadFPLSeasonDataViaProxy()
              .then(({ deadline, gameweek }) => {
                FPLUIManager.handleSeasonDisplay(deadline, gameweek);
                startCountdown(deadline, gameweek);
              })
              .catch(console.error);
          });
      }, ms + 15000); // 15s after deadline
    }
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
