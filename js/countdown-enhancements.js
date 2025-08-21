/**
 * Enhanced Countdown System for Deadline Urgency
 * Automatically applies visual enhancements based on time remaining
 */

window.CountdownEnhancements = (function () {
  'use strict';

  // Time thresholds in milliseconds
  const THRESHOLDS = {
    CRITICAL: 2 * 60 * 60 * 1000, // 2 hours
    WARNING: 6 * 60 * 60 * 1000, // 6 hours
    ALERT: 24 * 60 * 60 * 1000, // 24 hours
    ENHANCED: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  /**
   * Determine urgency level based on time remaining
   */
  function getUrgencyLevel(timeRemaining) {
    if (timeRemaining <= THRESHOLDS.CRITICAL) return 'critical';
    if (timeRemaining <= THRESHOLDS.WARNING) return 'warning';
    if (timeRemaining <= THRESHOLDS.ALERT) return 'alert';
    if (timeRemaining <= THRESHOLDS.ENHANCED) return 'enhanced';
    return 'normal';
  }

  /**
   * Apply urgency styling to countdown and header
   */
  function applyUrgencyStyle(urgencyLevel, timeRemaining) {
    const header = document.querySelector('header');
    const countdownClock = document.getElementById('countdown-clock');
    const countdownLabel = document.getElementById('countdown-label');

    if (!header || !countdownClock) return;

    // Remove existing urgency classes
    header.classList.remove('countdown-hero-mode');
    countdownClock.classList.remove(
      'countdown-mega',
      'countdown-enhanced',
      'countdown-critical',
      'countdown-warning',
      'countdown-alert'
    );

    // Remove existing urgent message
    const existingMessage = document.getElementById('countdown-urgent-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    switch (urgencyLevel) {
      case 'critical':
        applyHeroMode(
          header,
          countdownClock,
          timeRemaining,
          'CRITICAL: DEADLINE IN LESS THAN 2 HOURS!',
          '🚨 Make your transfers NOW!'
        );
        countdownClock.classList.add('countdown-mega', 'countdown-critical');
        break;

      case 'warning':
        applyHeroMode(
          header,
          countdownClock,
          timeRemaining,
          'WARNING: DEADLINE APPROACHING!',
          '⚠️ Less than 6 hours remaining to make transfers'
        );
        countdownClock.classList.add('countdown-mega', 'countdown-warning');
        break;

      case 'alert':
        applyHeroMode(
          header,
          countdownClock,
          timeRemaining,
          'DEADLINE REMINDER',
          '⏰ Less than 24 hours to make your transfers'
        );
        countdownClock.classList.add('countdown-mega', 'countdown-alert');
        break;

      case 'enhanced':
        countdownClock.classList.add('countdown-enhanced');
        break;

      default:
        // Normal styling - no changes needed
        break;
    }
  }

  /**
   * Apply hero mode transformation
   */
  function applyHeroMode(header, countdownClock, timeRemaining, title, message) {
    header.classList.add('countdown-hero-mode');

    // Hide other header content temporarily
    const headerMain = header.querySelector('.header-main');
    if (headerMain) {
      headerMain.style.display = 'none';
    }

    // Add urgent message
    const urgentMessage = document.createElement('div');
    urgentMessage.id = 'countdown-urgent-message';
    urgentMessage.className = 'countdown-urgent-message';
    urgentMessage.innerHTML = `
      <h3>${title}</h3>
      <p>${message}</p>
    `;

    // Insert after countdown clock
    countdownClock.parentNode.insertBefore(urgentMessage, countdownClock.nextSibling);
  }

  /**
   * Update countdown with urgency awareness
   */
  function updateCountdownWithUrgency(deadlineTime, gameweek = null) {
    const timeRemaining = deadlineTime - FPLUtils.now();
    const urgencyLevel = getUrgencyLevel(timeRemaining);

    // Apply urgency styling
    applyUrgencyStyle(urgencyLevel, timeRemaining);

    // Update countdown display with enhanced formatting
    updateEnhancedCountdownDisplay(deadlineTime, urgencyLevel);

    // Log urgency level for debugging
    if (FPLUtils.isAdminMode()) {
      console.log(
        `Countdown urgency: ${urgencyLevel} (${Math.round(timeRemaining / (60 * 60 * 1000))} hours remaining)`
      );
    }
  }

  /**
   * Enhanced countdown display with urgency formatting
   */
  function updateEnhancedCountdownDisplay(deadlineTime, urgencyLevel) {
    const currentDate = FPLUtils.now();
    const timeDifference = deadlineTime - currentDate;

    if (timeDifference <= 0) {
      // Deadline passed
      const countdownClock = document.getElementById('countdown-clock');
      if (countdownClock) {
        countdownClock.innerHTML = `
          <div class="countdown-label">DEADLINE PASSED</div>
          <div class="countdown-time">TRANSFERS LOCKED</div>
        `;
      }
      return;
    }

    // Calculate time components
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    // Update elements
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');

    if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');

    // Update separators based on urgency
    const separators = document.querySelectorAll('.countdown-separator');
    separators.forEach((sep) => {
      if (urgencyLevel === 'critical' || urgencyLevel === 'warning') {
        sep.style.animation = 'separatorBlink 1s infinite';
      } else {
        sep.style.animation = 'pulse 1s infinite';
      }
    });
  }

  /**
   * Create enhanced countdown HTML structure for hero mode
   */
  function createMegaCountdownHTML() {
    return `
      <div class="countdown-label" id="countdown-label">GW Deadline</div>
      <div class="countdown-time">
        <span class="countdown-unit">
          <span id="countdown-days">00</span>
          <span class="countdown-unit-label">DAYS</span>
        </span>
        <span class="countdown-separator">:</span>
        <span class="countdown-unit">
          <span id="countdown-hours">00</span>
          <span class="countdown-unit-label">HRS</span>
        </span>
        <span class="countdown-separator">:</span>
        <span class="countdown-unit">
          <span id="countdown-minutes">00</span>
          <span class="countdown-unit-label">MIN</span>
        </span>
      </div>
    `;
  }

  /**
   * Reset header to normal state
   */
  function resetHeaderToNormal() {
    const header = document.querySelector('header');
    const headerMain = header?.querySelector('.header-main');
    const urgentMessage = document.getElementById('countdown-urgent-message');

    if (header) {
      header.classList.remove('countdown-hero-mode');
    }

    if (headerMain) {
      headerMain.style.display = '';
    }

    if (urgentMessage) {
      urgentMessage.remove();
    }
  }

  /**
   * Initialize enhanced countdown system
   */
  function initialize() {
    // Listen for countdown updates from the main system
    document.addEventListener('countdownUpdate', function (event) {
      const { deadlineTime, gameweek } = event.detail;
      updateCountdownWithUrgency(deadlineTime, gameweek);
    });

    console.log('CountdownEnhancements initialized');
  }

  // Public API
  return {
    initialize,
    updateCountdownWithUrgency,
    getUrgencyLevel,
    resetHeaderToNormal,
    THRESHOLDS,
  };
})();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  CountdownEnhancements.initialize();
});
