/**
 * Tests for Missing JavaScript Functions
 * Tests for FPLDataLoader.loadWinnerPreview and updateQAPanel functions
 */

describe('Missing JavaScript Functions', () => {
  let mockFetch;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';

    // Mock fetch for testing
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    // Mock localStorage
    const mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    // Reset console methods to avoid noise
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'debug').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('FPLDataLoader.loadWinnerPreview', () => {
    beforeEach(() => {
      // Ensure FPLDataLoader is available
      if (!window.FPLDataLoader) {
        window.FPLDataLoader = {
          loadWinnerData: jest.fn().mockResolvedValue({
            winners: [],
            summary: { completedGameweeks: 5 },
            lastUpdated: new Date().toISOString(),
          }),
          getLastFinishedGW: jest.fn().mockReturnValue(5),
        };
      }
    });

    test('should exist as a function', () => {
      expect(typeof window.FPLDataLoader.loadWinnerPreview).toBe('function');
    });

    test('should return a Promise', async () => {
      const result = window.FPLDataLoader.loadWinnerPreview();
      expect(result).toBeInstanceOf(Promise);
      await result; // Ensure it resolves
    });

    test('should load winner data for preview', async () => {
      // Mock the loadWinnerData function
      const mockWinnerData = {
        winners: [{ playerName: 'Test Player', totalPrizeWon: 1000 }],
        summary: { completedGameweeks: 3 },
        lastUpdated: new Date().toISOString(),
      };

      window.FPLDataLoader.loadWinnerData = jest.fn().mockResolvedValue(mockWinnerData);

      const result = await window.FPLDataLoader.loadWinnerPreview();

      expect(window.FPLDataLoader.loadWinnerData).toHaveBeenCalled();
      expect(result).toEqual(mockWinnerData);
    });

    test('should handle errors gracefully', async () => {
      // Mock loadWinnerData to throw an error
      window.FPLDataLoader.loadWinnerData = jest.fn().mockRejectedValue(new Error('Network error'));

      try {
        await window.FPLDataLoader.loadWinnerPreview();
        fail('Expected function to throw an error');
      } catch (error) {
        expect(error.message).toBe('Network error');
      }
    });

    test('should update last processed gameweek when winner data is loaded', async () => {
      const mockWinnerData = {
        winners: [],
        summary: { completedGameweeks: 7 },
        lastUpdated: new Date().toISOString(),
      };

      window.FPLDataLoader.loadWinnerData = jest.fn().mockResolvedValue(mockWinnerData);

      // Mock UI Manager
      window.FPLUIManager = {
        setLastProcessedGW: jest.fn(),
      };

      await window.FPLDataLoader.loadWinnerPreview();

      expect(window.FPLUIManager.setLastProcessedGW).toHaveBeenCalledWith(7);
    });

    test('should work with both test and live data modes', async () => {
      const mockTestData = {
        winners: [],
        testMode: true,
        summary: { completedGameweeks: 2 },
        lastUpdated: new Date().toISOString(),
      };

      window.FPLDataLoader.loadWinnerData = jest.fn().mockResolvedValue(mockTestData);

      // Test with test data
      await window.FPLDataLoader.loadWinnerPreview();

      expect(window.FPLDataLoader.loadWinnerData).toHaveBeenCalled();
    });
  });

  describe('updateQAPanel function', () => {
    beforeEach(() => {
      // Mock FPLUtils
      window.FPLUtils = {
        isAdminMode: jest.fn().mockReturnValue(true),
      };

      // Create QA panel elements
      document.body.innerHTML = `
        <div id="qa-panel">
          <div id="qa-phase"></div>
          <div id="qa-gw"></div>
          <div id="qa-deadline"></div>
          <div id="qa-source"></div>
          <div id="qa-data-mode"></div>
          <div id="qa-winners-updated"></div>
          <div id="qa-leaderboard-updated"></div>
          <div id="qa-time"></div>
        </div>
        <div class="during-season"></div>
      `;

      // Mock FPLDataLoader
      window.FPLDataLoader = {
        getCachedGameweek: jest.fn().mockReturnValue({
          id: 3,
          deadline_time: '2025-08-30T10:00:00Z',
        }),
        getSeasonDataSource: jest.fn().mockReturnValue('backend'),
        getLastWinnersDataMode: jest.fn().mockReturnValue('live'),
        getLastLeaderboardDataMode: jest.fn().mockReturnValue('live'),
        getLastWinnersDataFile: jest.fn().mockReturnValue('data/winner_stats.json'),
        getLastLeaderboardDataFile: jest.fn().mockReturnValue('data/winner_stats.json'),
        getLastWinnersUpdatedIso: jest.fn().mockReturnValue('2025-08-29T12:00:00Z'),
        getLastLeaderboardUpdatedIso: jest.fn().mockReturnValue('2025-08-29T12:00:00Z'),
      };
    });

    test('should exist in FPLUIManager', () => {
      expect(typeof window.FPLUIManager.updateQAPanel).toBe('function');
    });

    test('should update QA panel elements when in admin mode', () => {
      window.FPLUIManager.updateQAPanel();

      const phaseEl = document.getElementById('qa-phase');
      const gwEl = document.getElementById('qa-gw');
      const dlEl = document.getElementById('qa-deadline');
      const srcEl = document.getElementById('qa-source');

      expect(phaseEl.textContent).toContain('Phase:');
      expect(gwEl.textContent).toContain('Next GW: GW3');
      expect(dlEl.textContent).toContain('Deadline:');
      expect(srcEl.textContent).toContain('Season data source: backend');
    });

    test('should not update panel when not in admin mode', () => {
      window.FPLUtils.isAdminMode.mockReturnValue(false);

      const phaseEl = document.getElementById('qa-phase');
      const originalContent = phaseEl.textContent;

      window.FPLUIManager.updateQAPanel();

      expect(phaseEl.textContent).toBe(originalContent);
    });

    test('should handle missing QA panel gracefully', () => {
      document.getElementById('qa-panel').remove();

      expect(() => {
        window.FPLUIManager.updateQAPanel();
      }).not.toThrow();
    });

    test('should display current time with timezone', () => {
      window.FPLUIManager.updateQAPanel();

      const timeEl = document.getElementById('qa-time');
      expect(timeEl.textContent).toContain('Now (offset):');
    });

    test('should show phase correctly based on UI state', () => {
      // Test pre-season phase
      document.querySelector('.during-season').classList.add('is-hidden');

      window.FPLUIManager.updateQAPanel();

      const phaseEl = document.getElementById('qa-phase');
      expect(phaseEl.textContent).toContain('pre-season');

      // Test in-season phase
      document.querySelector('.during-season').classList.remove('is-hidden');

      window.FPLUIManager.updateQAPanel();

      expect(phaseEl.textContent).toContain('in-season');
    });

    test('should handle missing gameweek data', () => {
      window.FPLDataLoader.getCachedGameweek.mockReturnValue(null);

      window.FPLUIManager.updateQAPanel();

      const gwEl = document.getElementById('qa-gw');
      const dlEl = document.getElementById('qa-deadline');

      expect(gwEl.textContent).toBe('Next GW: —');
      expect(dlEl.textContent).toBe('Deadline: —');
    });
  });

  describe('Function Existence Checks', () => {
    test('should safely check if functions exist before calling', () => {
      // Test safe function calling pattern
      const safeFunctionCall = (obj, methodName, ...args) => {
        if (obj && typeof obj[methodName] === 'function') {
          return obj[methodName](...args);
        }
        console.warn(`Function ${methodName} not found on object`);
        return null;
      };

      // Test with existing function
      const mockObj = { testMethod: jest.fn().mockReturnValue('success') };
      const result1 = safeFunctionCall(mockObj, 'testMethod', 'arg1');
      expect(result1).toBe('success');
      expect(mockObj.testMethod).toHaveBeenCalledWith('arg1');

      // Test with non-existing function
      const result2 = safeFunctionCall(mockObj, 'nonExistentMethod', 'arg1');
      expect(result2).toBeNull();
    });

    test('should provide fallback behavior when functions are missing', () => {
      // Test fallback pattern
      const callWithFallback = (obj, methodName, fallback, ...args) => {
        try {
          if (obj && typeof obj[methodName] === 'function') {
            return obj[methodName](...args);
          }
          return fallback();
        } catch (error) {
          console.warn(`Error calling ${methodName}:`, error);
          return fallback();
        }
      };

      const mockObj = {};
      const fallbackFn = jest.fn().mockReturnValue('fallback result');

      const result = callWithFallback(mockObj, 'missingMethod', fallbackFn, 'arg1');

      expect(result).toBe('fallback result');
      expect(fallbackFn).toHaveBeenCalled();
    });
  });

  describe('Error Prevention', () => {
    test('should not throw errors when modules are not loaded', () => {
      // Remove modules to simulate loading issues
      delete window.FPLDataLoader;
      delete window.FPLUIManager;

      expect(() => {
        // This should not throw
        if (window.FPLDataLoader && typeof window.FPLDataLoader.loadWinnerPreview === 'function') {
          window.FPLDataLoader.loadWinnerPreview();
        }
      }).not.toThrow();

      expect(() => {
        // This should not throw
        if (window.FPLUIManager && typeof window.FPLUIManager.updateQAPanel === 'function') {
          window.FPLUIManager.updateQAPanel();
        }
      }).not.toThrow();
    });

    test('should handle undefined function calls gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Simulate the actual error scenario from console
      expect(() => {
        if (typeof updateQAPanel !== 'undefined') {
          updateQAPanel();
        } else {
          console.warn('updateQAPanel is not defined');
        }
      }).not.toThrow();

      expect(consoleWarnSpy).toHaveBeenCalledWith('updateQAPanel is not defined');
    });
  });
});

// Manual testing utilities
window.testMissingFunctions = function () {
  console.log('🧪 Testing missing function implementations...');

  // Test FPLDataLoader.loadWinnerPreview
  if (window.FPLDataLoader && typeof window.FPLDataLoader.loadWinnerPreview === 'function') {
    console.log('✅ FPLDataLoader.loadWinnerPreview exists');
    window.FPLDataLoader.loadWinnerPreview()
      .then(() => console.log('✅ FPLDataLoader.loadWinnerPreview executed successfully'))
      .catch((e) => console.error('❌ FPLDataLoader.loadWinnerPreview failed:', e));
  } else {
    console.error('❌ FPLDataLoader.loadWinnerPreview is missing');
  }

  // Test updateQAPanel
  if (window.FPLUIManager && typeof window.FPLUIManager.updateQAPanel === 'function') {
    console.log('✅ FPLUIManager.updateQAPanel exists');
    try {
      window.FPLUIManager.updateQAPanel();
      console.log('✅ FPLUIManager.updateQAPanel executed successfully');
    } catch (e) {
      console.error('❌ FPLUIManager.updateQAPanel failed:', e);
    }
  } else {
    console.error('❌ FPLUIManager.updateQAPanel is missing');
  }

  console.log('🧪 Missing function tests completed');
};
