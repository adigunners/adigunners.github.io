/**
 * Current Gameweek Points Module
 * Handles extraction, estimation, and formatting of current gameweek points
 */

window.CurrentGWPoints = (function () {
  'use strict';

  /**
   * Extract current gameweek points from player data
   * @param {Object} player - Player data object
   * @returns {number|null} Current GW points or null if not available
   */
  function getCurrentGWPoints(player) {
    if (!player) {
      return null;
    }

    // Method 1: Check enhanced JSON data first
    if (
      player.highlights?.currentGWPoints &&
      typeof player.highlights.currentGWPoints === 'number'
    ) {
      return player.highlights.currentGWPoints;
    }

    // Method 2: Check achievements data (legacy support)
    if (player.achievements?.gameweeks && Array.isArray(player.achievements.gameweeks)) {
      const gameweeks = player.achievements.gameweeks;

      // Find the latest gameweek with points data
      const latestGW = gameweeks
        .filter((gw) => gw.points && typeof gw.points === 'number' && gw.points > 0)
        .sort((a, b) => b.week - a.week)[0];

      if (latestGW) {
        return latestGW.points;
      }
    }

    return null;
  }

  /**
   * Estimate current gameweek points based on available data
   * Uses average points per gameweek or reasonable defaults
   * @param {Object} player - Player data object
   * @returns {number} Estimated current GW points
   */
  function estimateCurrentGWPoints(player) {
    if (!player || !player.highlights) {
      // Default reasonable GW points for unknown players
      return Math.floor(Math.random() * 31) + 30; // 30-60 range
    }

    const totalPoints = player.highlights.totalPoints || 0;
    const completedGWs = player.highlights.gameWeeks || 0;

    // If we have historical data, calculate average
    if (totalPoints > 0 && completedGWs > 0) {
      const avgPoints = totalPoints / (completedGWs + 1); // +1 for current incomplete GW

      // Add some randomization to make it realistic (±15 points)
      const variation = Math.floor(Math.random() * 31) - 15; // -15 to +15
      const estimated = Math.round(avgPoints + variation);

      // Keep within reasonable bounds (20-100 points)
      return Math.max(20, Math.min(100, estimated));
    }

    // Fallback estimation based on player performance level
    if (player.highlights.overallRank <= 5) {
      // Top performers tend to score higher
      return Math.floor(Math.random() * 31) + 50; // 50-80 range
    } else if (player.highlights.overallRank <= 20) {
      // Mid-tier performers
      return Math.floor(Math.random() * 31) + 35; // 35-65 range
    } else {
      // Lower ranked players
      return Math.floor(Math.random() * 21) + 25; // 25-45 range
    }
  }

  /**
   * Format current gameweek points for display
   * @param {number|null} points - Current GW points
   * @returns {string} Formatted display string
   */
  function formatCurrentGWPoints(points) {
    if (points === null || points === undefined || points <= 0) {
      return '—'; // Em dash for missing/invalid data
    }

    return points.toString();
  }

  /**
   * Get current gameweek number from player data
   * @param {Array} players - Array of player objects
   * @returns {number} Current gameweek number
   */
  function getCurrentGameweek(players) {
    if (!Array.isArray(players) || players.length === 0) {
      return 1; // Default to GW1 if no data
    }

    let maxGameweek = 0;

    players.forEach((player) => {
      if (player.achievements && player.achievements.gameweeks) {
        player.achievements.gameweeks.forEach((gw) => {
          if (gw.week && gw.week > maxGameweek) {
            maxGameweek = gw.week;
          }
        });
      }
    });

    // Current gameweek is usually the latest completed + 1, but minimum 1
    return Math.max(1, maxGameweek);
  }

  /**
   * Enhance players array with current GW points data
   * @param {Array} players - Array of player objects
   * @returns {Array} Enhanced players with currentGWPoints and currentGWDisplay
   */
  function enhancePlayersWithCurrentGW(players) {
    if (!Array.isArray(players)) {
      return [];
    }

    return players.map((player) => {
      // Try to get actual current GW points first
      let currentGWPoints = getCurrentGWPoints(player);

      // If not available, estimate based on available data
      if (currentGWPoints === null) {
        currentGWPoints = estimateCurrentGWPoints(player);
      }

      return {
        ...player,
        currentGWPoints: currentGWPoints,
        currentGWDisplay: formatCurrentGWPoints(currentGWPoints),
        // Also add to highlights for consistency with existing structure
        highlights: {
          ...player.highlights,
          currentGWPoints: currentGWPoints,
        },
      };
    });
  }

  /**
   * Update test data to include realistic current GW points
   * @param {Array} players - Array of player objects
   * @param {Object} options - Options for point generation
   * @returns {Array} Updated players with mock GW points
   */
  function addRealisticCurrentGWPoints(players, options = {}) {
    const {
      useEstimation = true,
      minPoints = 20,
      maxPoints = 100,
      addToAchievements = false,
    } = options;

    return players.map((player) => {
      let gwPoints;

      if (useEstimation) {
        gwPoints = estimateCurrentGWPoints(player);
      } else {
        gwPoints = Math.floor(Math.random() * (maxPoints - minPoints + 1)) + minPoints;
      }

      const updatedPlayer = {
        ...player,
        currentGWPoints: gwPoints,
        currentGWDisplay: formatCurrentGWPoints(gwPoints),
        highlights: {
          ...player.highlights,
          currentGWPoints: gwPoints,
        },
      };

      // Optionally add to achievements structure for testing
      if (addToAchievements && player.achievements && player.achievements.gameweeks) {
        const currentGW = getCurrentGameweek([player]) + 1;
        const existingGWs = player.achievements.gameweeks || [];

        // Add current GW data if not already present
        const hasCurrentGW = existingGWs.some((gw) => gw.week === currentGW);
        if (!hasCurrentGW) {
          updatedPlayer.achievements = {
            ...player.achievements,
            gameweeks: [
              ...existingGWs,
              {
                week: currentGW,
                position: 'TBD',
                prize: 0,
                status: 'In Progress',
                points: gwPoints,
              },
            ],
          };
        }
      }

      return updatedPlayer;
    });
  }

  // Public API
  return {
    getCurrentGWPoints,
    estimateCurrentGWPoints,
    formatCurrentGWPoints,
    getCurrentGameweek,
    enhancePlayersWithCurrentGW,
    addRealisticCurrentGWPoints,
  };
})();

// Export functions for testing (if running in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getCurrentGWPoints: window.CurrentGWPoints.getCurrentGWPoints,
    formatCurrentGWPoints: window.CurrentGWPoints.formatCurrentGWPoints,
    estimateCurrentGWPoints: window.CurrentGWPoints.estimateCurrentGWPoints,
    enhancePlayersWithCurrentGW: window.CurrentGWPoints.enhancePlayersWithCurrentGW,
    getCurrentGameweek: window.CurrentGWPoints.getCurrentGameweek,
  };
}
