/**
 * Leaderboard Enhancement Module
 * Handles rank tracking, movement indicators, and deficit calculations for the enhanced 5-column leaderboard
 */

window.LeaderboardEnhancement = (function () {
  'use strict';

  // Store previous rankings in localStorage for persistence across page loads
  const STORAGE_KEY = 'fpl_previous_rankings';

  /**
   * Store the current rankings as previous rankings for next comparison
   * @param {Array} currentRankings - Current leaderboard data
   */
  function storePreviousRankings(currentRankings) {
    try {
      const rankingData = currentRankings.map((player) => ({
        playerName: player.playerName,
        overallRank: player.highlights?.overallRank,
        totalPoints: player.highlights?.totalPoints || 0,
        timestamp: Date.now(),
      }));

      localStorage.setItem(STORAGE_KEY, JSON.stringify(rankingData));
    } catch (error) {
      console.warn('Failed to store previous rankings:', error);
    }
  }

  /**
   * Retrieve the previous rankings from storage
   * @returns {Array} Previous ranking data or empty array if none found
   */
  function getPreviousRankings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to retrieve previous rankings:', error);
      return [];
    }
  }

  /**
   * Calculate rank movement for a specific player
   * @param {string} playerName - Name of the player
   * @param {Array} currentRanking - Current leaderboard data
   * @param {Array} previousRanking - Previous leaderboard data (optional, can use enhanced JSON data)
   * @returns {Object} Movement data with direction, change, and icon
   */
  function calculateRankMovement(playerName, currentRanking, previousRanking) {
    const currentPlayer = currentRanking.find((p) => p.playerName === playerName);

    if (!currentPlayer) {
      return { direction: 'unknown', change: 0, icon: '?' };
    }

    // Check if enhanced JSON already has movement data
    if (currentPlayer.movement && currentPlayer.movement.direction) {
      return {
        direction: currentPlayer.movement.direction,
        change: currentPlayer.movement.change || 0,
        icon: currentPlayer.movement.icon || getIconForDirection(currentPlayer.movement.direction),
      };
    }

    // Fallback to manual calculation if needed
    const previousPlayer = previousRanking
      ? previousRanking.find((p) => p.playerName === playerName)
      : null;

    if (!previousPlayer) {
      return { direction: 'new', change: 0, icon: '●' };
    }

    const currentRank = currentPlayer.highlights?.overallRank || 0;
    const previousRank = previousPlayer.overallRank || previousPlayer.rank || 0;

    if (currentRank === previousRank) {
      return { direction: 'same', change: 0, icon: '⚬' };
    }

    // Note: Lower rank number means better position, so movement logic is inverted
    if (currentRank < previousRank) {
      const change = previousRank - currentRank;
      return { direction: 'up', change, icon: '⬆' };
    } else {
      const change = currentRank - previousRank;
      return { direction: 'down', change, icon: '⬇' };
    }
  }

  /**
   * Get icon for movement direction
   * @param {string} direction - Movement direction
   * @returns {string} Icon for direction
   */
  function getIconForDirection(direction) {
    const icons = {
      up: '⬆',
      down: '⬇',
      same: '⚬',
      new: '●',
      unknown: '?',
    };
    return icons[direction] || '⚬';
  }

  /**
   * Get the appropriate icon for rank movement
   * @param {Object} movement - Movement data with direction and change
   * @returns {string} Icon to display
   */
  function getRankMovementIcon(movement) {
    return movement.icon || '⚬';
  }

  /**
   * Calculate deficit from the leader
   * @param {Object} player - Player data
   * @param {Array} allPlayers - All players in current ranking
   * @returns {number} Points behind leader (0 if player is leader)
   */
  function calculateDeficitFromLeader(player, allPlayers) {
    // Check if enhanced JSON already has deficit data
    if (player.highlights?.deficitFromLeader !== undefined) {
      return player.highlights.deficitFromLeader;
    }

    const totalPoints = player.highlights?.totalPoints || player.totalPoints || 0;
    if (!totalPoints) {
      return 0;
    }

    // Find the leader (rank 1)
    const leader = allPlayers.find((p) => p.highlights?.overallRank === 1);
    if (!leader) {
      return 0;
    }

    const leaderPoints = leader.highlights?.totalPoints || leader.totalPoints || 0;
    if (!leaderPoints) {
      return 0;
    }

    // If this player is the leader, deficit is 0
    if (player.highlights?.overallRank === 1) {
      return 0;
    }

    const deficit = leaderPoints - totalPoints;
    return Math.max(0, deficit); // Ensure non-negative
  }

  /**
   * Enhance leaderboard data with movement indicators and deficit calculations
   * @param {Array} currentData - Current leaderboard data (may already be enhanced from JSON)
   * @param {Array} previousData - Previous leaderboard data (optional)
   * @returns {Array} Enhanced leaderboard data
   */
  function enhanceLeaderboardData(currentData, previousData = null) {
    if (!Array.isArray(currentData)) {
      return [];
    }

    const previousRankings = previousData || getPreviousRankings();

    return currentData.map((player) => {
      // Calculate movement (will use enhanced JSON data if available)
      const movement = calculateRankMovement(player.playerName, currentData, previousRankings);

      // Calculate deficit (will use enhanced JSON data if available)
      const deficit = calculateDeficitFromLeader(player, currentData);

      // Get current GW points (prefer enhanced JSON data)
      const currentGWPoints =
        player.highlights?.currentGWPoints || getCurrentGWPointsFromPlayer(player) || 0;

      return {
        ...player,
        movement: {
          direction: movement.direction,
          change: movement.change,
          icon: movement.icon,
        },
        deficitFromLeader: deficit,
        currentGWPoints: currentGWPoints,
        currentGWDisplay: formatCurrentGWPoints(currentGWPoints),
        // Enhanced highlights with all data
        enhancedHighlights: {
          ...player.highlights,
          currentGWPoints: currentGWPoints,
          deficitFromLeader: deficit,
          movementIcon: movement.icon,
          movementChange: movement.change,
          movementDirection: movement.direction,
        },
      };
    });
  }

  /**
   * Get current GW points from player data (legacy support)
   * @param {Object} player - Player data
   * @returns {number} Current GW points
   */
  function getCurrentGWPointsFromPlayer(player) {
    // Try to get from achievements if not in highlights
    if (player.achievements?.gameweeks && Array.isArray(player.achievements.gameweeks)) {
      const latestGW = player.achievements.gameweeks
        .filter((gw) => gw.points && gw.points > 0)
        .sort((a, b) => b.week - a.week)[0];

      if (latestGW && latestGW.points) {
        return latestGW.points;
      }
    }

    return 0;
  }

  /**
   * Mock current gameweek points generation for testing
   * In production, this would come from the FPL API
   * @param {Array} players - Player data
   * @returns {Array} Players with mock current GW points
   */
  function addMockCurrentGWPoints(players) {
    return players.map((player) => {
      // Generate realistic mock GW points (20-80 range)
      const mockGWPoints = Math.floor(Math.random() * 61) + 20;

      return {
        ...player,
        highlights: {
          ...player.highlights,
          currentGWPoints: mockGWPoints,
        },
      };
    });
  }

  /**
   * Generate mock data with rank movements for testing
   * @returns {Object} Mock data with current and previous rankings
   */
  function generateMockDataWithMovement() {
    const baseData = [
      {
        playerName: 'Weekend Blues',
        highlights: { overallRank: 1, totalPoints: 1879 },
        totalPrizeWon: 7500,
      },
      {
        playerName: 'El Nino',
        highlights: { overallRank: 2, totalPoints: 1879 },
        totalPrizeWon: 5200,
      },
      {
        playerName: 'Hot Shot XI',
        highlights: { overallRank: 3, totalPoints: 1879 },
        totalPrizeWon: 4100,
      },
      {
        playerName: 'Ankur Prasad',
        highlights: { overallRank: 4, totalPoints: 1874 },
        totalPrizeWon: 3800,
      },
      {
        playerName: "Ashu's Blue 11",
        highlights: { overallRank: 5, totalPoints: 1869 },
        totalPrizeWon: 2900,
      },
      {
        playerName: 'VickedredsXI',
        highlights: { overallRank: 6, totalPoints: 1867 },
        totalPrizeWon: 2100,
      },
      {
        playerName: 'The Reds',
        highlights: { overallRank: 7, totalPoints: 1866 },
        totalPrizeWon: 1800,
      },
    ];

    // Generate previous rankings with some movements
    const previousData = [
      { playerName: 'Weekend Blues', overallRank: 2, totalPoints: 1817 },
      { playerName: 'El Nino', overallRank: 1, totalPoints: 1816 },
      { playerName: 'Hot Shot XI', overallRank: 2, totalPoints: 1817 }, // Tied at 2nd
      { playerName: 'Ankur Prasad', overallRank: 4, totalPoints: 1813 },
      { playerName: "Ashu's Blue 11", overallRank: 6, totalPoints: 1815 },
      { playerName: 'VickedredsXI', overallRank: 5, totalPoints: 1809 },
      { playerName: 'The Reds', overallRank: 7, totalPoints: 1807 },
    ];

    return {
      current: addMockCurrentGWPoints(baseData),
      previous: previousData,
    };
  }

  // Public API
  return {
    storePreviousRankings,
    getPreviousRankings,
    calculateRankMovement,
    getRankMovementIcon,
    calculateDeficitFromLeader,
    enhanceLeaderboardData,
    addMockCurrentGWPoints,
    generateMockDataWithMovement,
  };
})();

// Export functions for testing (if running in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateRankMovement: window.LeaderboardEnhancement.calculateRankMovement,
    getRankMovementIcon: window.LeaderboardEnhancement.getRankMovementIcon,
    enhanceLeaderboardData: window.LeaderboardEnhancement.enhanceLeaderboardData,
    calculateDeficitFromLeader: window.LeaderboardEnhancement.calculateDeficitFromLeader,
  };
}
