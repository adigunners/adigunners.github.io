/**
 * Unit Tests for Leaderboard Enhancement
 * Tests for rank comparison logic and movement indicators
 */

describe('Leaderboard Enhancement - Rank Comparison', () => {
  // Sample data structures for testing
  const mockCurrentRanking = [
    {
      playerName: 'Player A',
      highlights: { overallRank: 1, totalPoints: 1850 },
      totalPrizeWon: 5000,
    },
    {
      playerName: 'Player B',
      highlights: { overallRank: 2, totalPoints: 1820 },
      totalPrizeWon: 3000,
    },
    {
      playerName: 'Player C',
      highlights: { overallRank: 3, totalPoints: 1800 },
      totalPrizeWon: 2000,
    },
    {
      playerName: 'Player D',
      highlights: { overallRank: 4, totalPoints: 1780 },
      totalPrizeWon: 1000,
    },
  ];

  const mockPreviousRanking = [
    {
      playerName: 'Player A',
      highlights: { overallRank: 2, totalPoints: 1830 },
      totalPrizeWon: 4500,
    },
    {
      playerName: 'Player B',
      highlights: { overallRank: 1, totalPoints: 1835 },
      totalPrizeWon: 2800,
    },
    {
      playerName: 'Player C',
      highlights: { overallRank: 4, totalPoints: 1790 },
      totalPrizeWon: 1800,
    },
    {
      playerName: 'Player D',
      highlights: { overallRank: 3, totalPoints: 1795 },
      totalPrizeWon: 900,
    },
  ];

  describe('calculateRankMovement', () => {
    it('should detect upward movement', () => {
      // Player A moved from rank 2 to rank 1 (up by 1)
      const movement = calculateRankMovement('Player A', mockCurrentRanking, mockPreviousRanking);
      expect(movement.direction).toBe('up');
      expect(movement.change).toBe(1);
    });

    it('should detect downward movement', () => {
      // Player B moved from rank 1 to rank 2 (down by 1)
      const movement = calculateRankMovement('Player B', mockCurrentRanking, mockPreviousRanking);
      expect(movement.direction).toBe('down');
      expect(movement.change).toBe(1);
    });

    it('should detect no movement', () => {
      // Create a scenario where rank stays the same
      const sameRank = [...mockCurrentRanking];
      const movement = calculateRankMovement('Player A', sameRank, sameRank);
      expect(movement.direction).toBe('same');
      expect(movement.change).toBe(0);
    });

    it('should handle new players (no previous rank)', () => {
      const newPlayer = {
        playerName: 'New Player',
        highlights: { overallRank: 5, totalPoints: 1700 },
        totalPrizeWon: 500,
      };
      const currentWithNew = [...mockCurrentRanking, newPlayer];
      const movement = calculateRankMovement('New Player', currentWithNew, mockPreviousRanking);
      expect(movement.direction).toBe('new');
      expect(movement.change).toBe(0);
    });
  });

  describe('getRankMovementIcon', () => {
    it('should return up arrow for upward movement', () => {
      const icon = getRankMovementIcon({ direction: 'up', change: 2 });
      expect(icon).toContain('⬆'); // or whatever icon we decide to use
    });

    it('should return down arrow for downward movement', () => {
      const icon = getRankMovementIcon({ direction: 'down', change: 1 });
      expect(icon).toContain('⬇'); // or whatever icon we decide to use
    });

    it('should return neutral indicator for no movement', () => {
      const icon = getRankMovementIcon({ direction: 'same', change: 0 });
      expect(icon).toBe('⚬'); // or whatever neutral indicator
    });

    it('should return new indicator for new players', () => {
      const icon = getRankMovementIcon({ direction: 'new', change: 0 });
      expect(icon).toBe('●'); // or whatever new player indicator
    });
  });

  describe('enhanceLeaderboardData', () => {
    it('should add movement data to each player', () => {
      const enhanced = enhanceLeaderboardData(mockCurrentRanking, mockPreviousRanking);

      // Check that movement data is added
      expect(enhanced[0]).toHaveProperty('movement');
      expect(enhanced[0].movement).toHaveProperty('direction');
      expect(enhanced[0].movement).toHaveProperty('change');
      expect(enhanced[0].movement).toHaveProperty('icon');
    });

    it('should preserve original data while adding enhancements', () => {
      const enhanced = enhanceLeaderboardData(mockCurrentRanking, mockPreviousRanking);

      // Original data should be preserved
      expect(enhanced[0].playerName).toBe(mockCurrentRanking[0].playerName);
      expect(enhanced[0].highlights.overallRank).toBe(mockCurrentRanking[0].highlights.overallRank);
      expect(enhanced[0].totalPrizeWon).toBe(mockCurrentRanking[0].totalPrizeWon);
    });

    it('should handle empty previous ranking gracefully', () => {
      const enhanced = enhanceLeaderboardData(mockCurrentRanking, []);

      // All players should be marked as new
      enhanced.forEach((player) => {
        expect(player.movement.direction).toBe('new');
      });
    });
  });

  describe('calculateDeficitFromLeader', () => {
    it('should return 0 for the leader', () => {
      const deficit = calculateDeficitFromLeader(mockCurrentRanking[0], mockCurrentRanking);
      expect(deficit).toBe(0);
    });

    it('should calculate correct deficit for non-leaders', () => {
      const deficit = calculateDeficitFromLeader(mockCurrentRanking[1], mockCurrentRanking);
      expect(deficit).toBe(30); // 1850 - 1820 = 30
    });

    it('should handle missing totalPoints gracefully', () => {
      const playerWithoutPoints = { ...mockCurrentRanking[1] };
      delete playerWithoutPoints.highlights.totalPoints;

      const deficit = calculateDeficitFromLeader(playerWithoutPoints, mockCurrentRanking);
      expect(deficit).toBe(0); // Should default to 0 when points unavailable
    });
  });
});

// Import the functions from the leaderboard enhancement module
// In a browser environment, these would be available via window.LeaderboardEnhancement
let calculateRankMovement, getRankMovementIcon, enhanceLeaderboardData, calculateDeficitFromLeader;

if (typeof window !== 'undefined' && window.LeaderboardEnhancement) {
  // Browser environment
  calculateRankMovement = window.LeaderboardEnhancement.calculateRankMovement;
  getRankMovementIcon = window.LeaderboardEnhancement.getRankMovementIcon;
  enhanceLeaderboardData = window.LeaderboardEnhancement.enhanceLeaderboardData;
  calculateDeficitFromLeader = window.LeaderboardEnhancement.calculateDeficitFromLeader;
} else {
  // Node.js testing environment
  try {
    const enhancement = require('../../js/leaderboard-enhancement.js');
    calculateRankMovement = enhancement.calculateRankMovement;
    getRankMovementIcon = enhancement.getRankMovementIcon;
    enhanceLeaderboardData = enhancement.enhanceLeaderboardData;
    calculateDeficitFromLeader = enhancement.calculateDeficitFromLeader;
  } catch (error) {
    console.warn('Could not import leaderboard enhancement module:', error);
  }
}
