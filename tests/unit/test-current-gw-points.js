/**
 * Unit Tests for Current Gameweek Points Data Integration
 * Tests for extracting, calculating, and displaying current GW points
 */

describe('Current Gameweek Points Integration', () => {
  // Sample player data structures for testing (based on actual winner_stats.json format)
  const mockPlayerWithGWData = {
    playerName: 'Test Player 1',
    totalPrizeWon: 1316,
    highlights: {
      gameWeeks: 2,
      gameMonths: 1,
      overallRank: 1,
      totalPoints: 179,
    },
    achievements: {
      gameweeks: [
        { week: 1, position: '2nd', prize: 400, status: 'Paid', points: 65 },
        { week: 2, position: '1st', prize: 650, status: 'Paid', points: 72 },
      ],
      months: [{ month: 1, position: '1st', prize: 666, status: 'Pending', points: 137 }],
    },
  };

  const mockPlayerWithoutGWData = {
    playerName: 'Test Player 2',
    totalPrizeWon: 500,
    highlights: {
      gameWeeks: 0,
      gameMonths: 0,
      overallRank: 15,
      totalPoints: 145,
    },
    achievements: {
      gameweeks: [],
      months: [],
    },
  };

  const mockPlayerWithPartialData = {
    playerName: 'Test Player 3',
    totalPrizeWon: 800,
    highlights: {
      gameWeeks: 1,
      gameMonths: 0,
      overallRank: 8,
      totalPoints: 160,
    },
    achievements: {
      gameweeks: [
        { week: 1, position: '3rd', prize: 300, status: 'Paid' }, // Missing points field
      ],
      months: [],
    },
  };

  describe('getCurrentGWPoints', () => {
    it('should extract current GW points from latest gameweek achievement', () => {
      const points = getCurrentGWPoints(mockPlayerWithGWData);
      expect(points).toBe(72); // Latest gameweek points
    });

    it('should return null for players with no gameweek data', () => {
      const points = getCurrentGWPoints(mockPlayerWithoutGWData);
      expect(points).toBe(null);
    });

    it('should handle missing points field in achievements', () => {
      const points = getCurrentGWPoints(mockPlayerWithPartialData);
      expect(points).toBe(null); // Points field missing
    });

    it('should return null for undefined player', () => {
      const points = getCurrentGWPoints(undefined);
      expect(points).toBe(null);
    });

    it('should return null for player without achievements', () => {
      const playerNoAchievements = { ...mockPlayerWithGWData };
      delete playerNoAchievements.achievements;
      const points = getCurrentGWPoints(playerNoAchievements);
      expect(points).toBe(null);
    });
  });

  describe('formatCurrentGWPoints', () => {
    it('should format valid points as string', () => {
      const formatted = formatCurrentGWPoints(72);
      expect(formatted).toBe('72');
    });

    it('should return dash for null points', () => {
      const formatted = formatCurrentGWPoints(null);
      expect(formatted).toBe('—');
    });

    it('should return dash for undefined points', () => {
      const formatted = formatCurrentGWPoints(undefined);
      expect(formatted).toBe('—');
    });

    it('should return dash for zero points', () => {
      const formatted = formatCurrentGWPoints(0);
      expect(formatted).toBe('—');
    });

    it('should handle negative points (edge case)', () => {
      const formatted = formatCurrentGWPoints(-5);
      expect(formatted).toBe('—'); // Negative points should be treated as invalid
    });
  });

  describe('estimateCurrentGWPoints', () => {
    it('should estimate points from total points and number of gameweeks', () => {
      // For a player with 179 total points over multiple weeks, estimate current GW
      const estimated = estimateCurrentGWPoints(mockPlayerWithGWData);
      expect(estimated).toBeGreaterThan(0);
      expect(estimated).toBeLessThan(100); // Reasonable GW points range
    });

    it('should return realistic range for regular player', () => {
      const estimated = estimateCurrentGWPoints({
        highlights: { totalPoints: 150, gameWeeks: 3 },
      });
      expect(estimated).toBeGreaterThanOrEqual(30);
      expect(estimated).toBeLessThanOrEqual(80);
    });

    it('should handle players with no gameweek data', () => {
      const estimated = estimateCurrentGWPoints(mockPlayerWithoutGWData);
      expect(estimated).toBeGreaterThanOrEqual(20);
      expect(estimated).toBeLessThanOrEqual(60);
    });
  });

  describe('enhancePlayersWithCurrentGW', () => {
    const mockPlayers = [mockPlayerWithGWData, mockPlayerWithoutGWData, mockPlayerWithPartialData];

    it('should enhance all players with current GW points', () => {
      const enhanced = enhancePlayersWithCurrentGW(mockPlayers);

      expect(enhanced).toHaveLength(3);
      enhanced.forEach((player) => {
        expect(player).toHaveProperty('currentGWPoints');
        expect(player).toHaveProperty('currentGWDisplay');
      });
    });

    it('should preserve original player data', () => {
      const enhanced = enhancePlayersWithCurrentGW(mockPlayers);

      expect(enhanced[0].playerName).toBe(mockPlayerWithGWData.playerName);
      expect(enhanced[0].totalPrizeWon).toBe(mockPlayerWithGWData.totalPrizeWon);
      expect(enhanced[0].highlights).toEqual(mockPlayerWithGWData.highlights);
    });

    it('should use actual points when available, estimation when not', () => {
      const enhanced = enhancePlayersWithCurrentGW(mockPlayers);

      // Player with GW data should have actual points
      expect(enhanced[0].currentGWPoints).toBe(72);
      expect(enhanced[0].currentGWDisplay).toBe('72');

      // Player without GW data should have estimated points
      expect(enhanced[1].currentGWPoints).toBeGreaterThan(0);
      expect(enhanced[1].currentGWDisplay).not.toBe('—');
    });

    it('should handle empty array', () => {
      const enhanced = enhancePlayersWithCurrentGW([]);
      expect(enhanced).toEqual([]);
    });
  });

  describe('getCurrentGameweek', () => {
    it('should determine current gameweek from data', () => {
      const gw = getCurrentGameweek([mockPlayerWithGWData, mockPlayerWithoutGWData]);
      expect(gw).toBe(2); // Based on latest gameweek in achievements
    });

    it('should return 1 for no data', () => {
      const gw = getCurrentGameweek([]);
      expect(gw).toBe(1);
    });

    it('should handle players without achievements', () => {
      const playersNoAchievements = [{ ...mockPlayerWithoutGWData }];
      const gw = getCurrentGameweek(playersNoAchievements);
      expect(gw).toBe(1);
    });
  });
});

// Import the functions from the current GW points module
let getCurrentGWPoints,
  formatCurrentGWPoints,
  estimateCurrentGWPoints,
  enhancePlayersWithCurrentGW,
  getCurrentGameweek;

if (typeof window !== 'undefined' && window.CurrentGWPoints) {
  // Browser environment
  getCurrentGWPoints = window.CurrentGWPoints.getCurrentGWPoints;
  formatCurrentGWPoints = window.CurrentGWPoints.formatCurrentGWPoints;
  estimateCurrentGWPoints = window.CurrentGWPoints.estimateCurrentGWPoints;
  enhancePlayersWithCurrentGW = window.CurrentGWPoints.enhancePlayersWithCurrentGW;
  getCurrentGameweek = window.CurrentGWPoints.getCurrentGameweek;
} else {
  // Node.js testing environment
  try {
    const gwPoints = require('../../js/current-gw-points.js');
    getCurrentGWPoints = gwPoints.getCurrentGWPoints;
    formatCurrentGWPoints = gwPoints.formatCurrentGWPoints;
    estimateCurrentGWPoints = gwPoints.estimateCurrentGWPoints;
    enhancePlayersWithCurrentGW = gwPoints.enhancePlayersWithCurrentGW;
    getCurrentGameweek = gwPoints.getCurrentGameweek;
  } catch (error) {
    console.warn('Could not import current GW points module:', error);
  }
}
