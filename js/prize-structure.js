/**
 * Prize Structure Management
 * Handles prize calculations, display, and summary generation
 */

window.FPLPrizeStructure = (function () {
  'use strict';

  let prizeData = null;
  let prizeSummaryCache = null;

  /**
   * Load prize structure data
   */
  async function loadPrizeData() {
    try {
      const response = await fetch('data/prizes.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      prizeData = await response.json();
      return prizeData;
    } catch (error) {
      console.error('Error loading prize data:', error);
      return null;
    }
  }

  /**
   * Get prize structure data (cached or fresh)
   */
  async function getPrizeData() {
    if (!prizeData) {
      await loadPrizeData();
    }
    return prizeData;
  }

  /**
   * Calculate total prize pool
   */
  function calculateTotalPrizePool() {
    if (!prizeData) return 0;

    const weeklyTotal = prizeData.weeklyPrizes.reduce((sum, prize) => sum + prize.amount, 0);
    const monthlyTotal = prizeData.monthlyPrizes.reduce((sum, prize) => sum + prize.amount, 0);
    const annualTotal = prizeData.annualPrizes.reduce((sum, prize) => sum + prize.amount, 0);

    // Assume 38 gameweeks and 10 months in a season
    const estimatedWeeklyTotal = weeklyTotal * 38;
    const estimatedMonthlyTotal = monthlyTotal * 10;

    return estimatedWeeklyTotal + estimatedMonthlyTotal + annualTotal;
  }

  /**
   * Get prize for specific rank and type
   */
  function getPrizeForRank(rank, type = 'weekly') {
    if (!prizeData) return 0;

    let prizes;
    switch (type.toLowerCase()) {
      case 'weekly':
        prizes = prizeData.weeklyPrizes;
        break;
      case 'monthly':
        prizes = prizeData.monthlyPrizes;
        break;
      case 'annual':
        prizes = prizeData.annualPrizes;
        break;
      default:
        return 0;
    }

    const prizeEntry = prizes.find((p) => p.rank === rank);
    return prizeEntry ? prizeEntry.amount : 0;
  }

  /**
   * Generate prize summary for display
   */
  function generatePrizeSummary() {
    if (!prizeData) return null;

    const totalPool = calculateTotalPrizePool();

    return {
      totalPool,
      weekly: {
        prizes: prizeData.weeklyPrizes.length,
        totalPerWeek: prizeData.weeklyPrizes.reduce((sum, p) => sum + p.amount, 0),
        topPrize: Math.max(...prizeData.weeklyPrizes.map((p) => p.amount)),
      },
      monthly: {
        prizes: prizeData.monthlyPrizes.length,
        totalPerMonth: prizeData.monthlyPrizes.reduce((sum, p) => sum + p.amount, 0),
        topPrize: Math.max(...prizeData.monthlyPrizes.map((p) => p.amount)),
      },
      annual: {
        prizes: prizeData.annualPrizes.length,
        total: prizeData.annualPrizes.reduce((sum, p) => sum + p.amount, 0),
        topPrize: Math.max(...prizeData.annualPrizes.map((p) => p.amount)),
      },
    };
  }

  /**
   * Load and cache prize summary
   */
  async function loadPrizeSummary() {
    try {
      if (!prizeData) {
        await loadPrizeData();
      }

      if (prizeData) {
        prizeSummaryCache = generatePrizeSummary();
        displayPrizeSummary();
        return prizeSummaryCache;
      }
    } catch (error) {
      console.error('Error loading prize summary:', error);
    }
    return null;
  }

  /**
   * Display prize summary in the UI
   */
  function displayPrizeSummary() {
    if (!prizeSummaryCache) return;

    const prizePanel = document.querySelector('.prize-structure-panel');
    if (!prizePanel) return;

    const summary = prizeSummaryCache;

    prizePanel.innerHTML = `
      <div class="prize-summary">
        <h3>Prize Structure</h3>
        <div class="prize-breakdown">
          <div class="prize-category">
            <h4>Weekly Prizes</h4>
            <p>${FPLUtils.formatINR(summary.weekly.topPrize)} for 1st place</p>
            <p>${summary.weekly.prizes} positions paid per week</p>
          </div>
          <div class="prize-category">
            <h4>Monthly Prizes</h4>
            <p>${FPLUtils.formatINR(summary.monthly.topPrize)} for 1st place</p>
            <p>${summary.monthly.prizes} positions paid per month</p>
          </div>
          <div class="prize-category">
            <h4>Season Prizes</h4>
            <p>${FPLUtils.formatINR(summary.annual.topPrize)} for champion</p>
            <p>Top ${summary.annual.prizes} finish in the money</p>
          </div>
        </div>
        <div class="total-pool">
          <strong>Total Prize Pool: ${FPLUtils.formatINR(summary.totalPool)}</strong>
        </div>
      </div>
    `;
  }

  /**
   * Format prize structure for leaderboard display
   */
  function formatPrizeStructureForLeaderboard() {
    if (!prizeData) return '';

    const weeklyFirst = getPrizeForRank(1, 'weekly');
    const monthlyFirst = getPrizeForRank(1, 'monthly');
    const annualFirst = getPrizeForRank(1, 'annual');

    return `
      <div class="prize-info-compact">
        <span class="prize-highlight">Weekly: ${FPLUtils.formatINR(weeklyFirst)}</span>
        <span class="prize-separator">•</span>
        <span class="prize-highlight">Monthly: ${FPLUtils.formatINR(monthlyFirst)}</span>
        <span class="prize-separator">•</span>
        <span class="prize-highlight">Season: ${FPLUtils.formatINR(annualFirst)}</span>
      </div>
    `;
  }

  /**
   * Get cached prize summary
   */
  function getCachedPrizeSummary() {
    return prizeSummaryCache;
  }

  /**
   * Refresh prize data
   */
  async function refreshPrizeData() {
    prizeData = null;
    prizeSummaryCache = null;
    return await loadPrizeData();
  }

  /**
   * Calculate estimated weekly prize distribution
   */
  function calculateWeeklyDistribution(gameweeksPlayed = 38) {
    if (!prizeData) return 0;

    const weeklyTotal = prizeData.weeklyPrizes.reduce((sum, prize) => sum + prize.amount, 0);
    return weeklyTotal * gameweeksPlayed;
  }

  /**
   * Calculate estimated monthly prize distribution
   */
  function calculateMonthlyDistribution(monthsPlayed = 10) {
    if (!prizeData) return 0;

    const monthlyTotal = prizeData.monthlyPrizes.reduce((sum, prize) => sum + prize.amount, 0);
    return monthlyTotal * monthsPlayed;
  }

  /**
   * Get rank-based prize tiers
   */
  function getPrizeTiers() {
    if (!prizeData) return null;

    return {
      weekly: prizeData.weeklyPrizes.map((p) => ({ rank: p.rank, amount: p.amount })),
      monthly: prizeData.monthlyPrizes.map((p) => ({ rank: p.rank, amount: p.amount })),
      annual: prizeData.annualPrizes.map((p) => ({ rank: p.rank, amount: p.amount })),
    };
  }

  // Public API
  return {
    loadPrizeData,
    getPrizeData,
    calculateTotalPrizePool,
    getPrizeForRank,
    generatePrizeSummary,
    loadPrizeSummary,
    displayPrizeSummary,
    formatPrizeStructureForLeaderboard,
    getCachedPrizeSummary,
    refreshPrizeData,
    calculateWeeklyDistribution,
    calculateMonthlyDistribution,
    getPrizeTiers,
  };
})();
