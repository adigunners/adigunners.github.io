/**
 * Winners Page Controller - Main page logic for winners.html
 * Handles data loading, rendering, pagination, and responsive behavior
 */

import { fetchJSON, endpoints } from './api.js';
import {
  escapeHTML,
  renderSpinner,
  renderError,
  announce,
  createTable,
  createCard,
  formatINR,
  show,
  hide,
  updateText,
} from './ui.js';
import {
  PAGINATION,
  FEATURE_FLAGS,
  ERROR_MESSAGES,
  LOADING_MESSAGES,
  RANK_CLASSES,
  isDesktopViewport,
  buildNavQuery,
} from './state.js';

// Page state
let allWinners = [];
let winnersWithPrizes = [];
let currentWinnerPage = 1;
let isInitialized = false;

/**
 * Initialize the winners page
 */
export async function init() {
  if (isInitialized) return;

  try {
    await renderSkeleton();
    await loadWinners();
    setupEventListeners();
    setupPageNavigation();
    isInitialized = true;
  } catch (error) {
    console.error('Winners page initialization failed:', error);
    renderError('#winner-table-container', ERROR_MESSAGES.GENERIC_ERROR);
  }
}

/**
 * Render initial page structure
 */
async function renderSkeleton() {
  // Show loading state
  renderSpinner('winner-table-container', LOADING_MESSAGES.WINNERS);

  // Initialize countdown if modules are available
  initCountdown();
}

/**
 * Initialize countdown functionality using existing modules
 */
function initCountdown() {
  // Use existing FPL modules if available (backwards compatibility)
  if (window.FPLDataLoader && window.FPLCountdown && window.FPLUIManager) {
    bootCountdownWithModules();
  } else {
    // Show static countdown as fallback
    const clock = document.getElementById('countdown-clock');
    if (clock) clock.classList.remove('is-hidden');
  }
}

/**
 * Bootstrap countdown with existing modular system
 */
function bootCountdownWithModules() {
  try {
    window.FPLDataLoader.loadFPLSeasonData()
      .then(({ deadline, gameweek }) => {
        if (window.FPLUIManager.handleSeasonDisplay) {
          window.FPLUIManager.handleSeasonDisplay(deadline, gameweek);
        }
        if (window.FPLCountdown.startCountdown) {
          window.FPLCountdown.startCountdown(deadline, gameweek);
        }
        if (window.FPLCountdown.scheduleRolloverCheck) {
          window.FPLCountdown.scheduleRolloverCheck(deadline);
        }
      })
      .catch((error) => {
        console.warn('Season data load failed:', error);
        // Show clock as fallback
        const clock = document.getElementById('countdown-clock');
        if (clock) clock.classList.remove('is-hidden');
      });
  } catch (error) {
    console.warn('Countdown initialization failed:', error);
  }
}

/**
 * Load winners data from API
 */
async function loadWinners() {
  try {
    const url = endpoints.winnerStats(
      FEATURE_FLAGS.isTestMode || FEATURE_FLAGS.dataOverride === 'test'
    );
    const data = await fetchJSON(url);

    // Process data
    allWinners = (data.winners || []).sort((a, b) => b.totalPrizeWon - a.totalPrizeWon);
    winnersWithPrizes = allWinners.filter((winner) => winner.totalPrizeWon > 0);

    // Update statistics
    updateStatistics(data);

    // Update footer timestamp
    updateFooterTimestamp(data.lastUpdated);

    // Render winners table
    await renderWinnersTable();

    // Update page subtitle
    updatePageSubtitle(data.summary?.completedGameweeks);

    announce('Results updated');
  } catch (error) {
    console.error('Failed to load winners:', error);
    renderError('#winner-table-container', ERROR_MESSAGES.WINNERS_UNAVAILABLE);
  }
}

/**
 * Update statistics display
 */
function updateStatistics(data) {
  const summary = data.summary || {};

  updateText('completed-gameweeks', summary.completedGameweeks || '1');
  updateText('completed-gamemonths', summary.completedMonths || '0');
  updateText('total-winners', winnersWithPrizes.length);

  const totalPrizeMoney = winnersWithPrizes.reduce((sum, w) => sum + w.totalPrizeWon, 0);
  updateText('total-prize-money', formatINR(totalPrizeMoney), false);
}

/**
 * Update footer timestamp
 */
function updateFooterTimestamp(lastUpdated) {
  const footerElement = document.getElementById('site-last-updated');
  if (footerElement && lastUpdated) {
    try {
      const date = new Date(lastUpdated);
      const testSuffix = FEATURE_FLAGS.isTestMode ? ' (test data)' : ' (your local time)';
      footerElement.textContent = `Data updated: ${date.toLocaleString()}${testSuffix}`;
    } catch (error) {
      footerElement.textContent = 'Data updated: Recently';
    }
  }
}

/**
 * Update page subtitle with gameweek info
 */
function updatePageSubtitle(completedGameweeks) {
  try {
    // Use existing UI manager if available
    if (window.FPLUIManager && window.FPLUIManager.setLastProcessedGW) {
      window.FPLUIManager.setLastProcessedGW(completedGameweeks);
      window.FPLUIManager.updateWinnersHeaderGW();
    } else {
      // Fallback subtitle update
      const subtitleElement = document.getElementById('winners-page-after-gw');
      if (subtitleElement && completedGameweeks && completedGameweeks > 0) {
        subtitleElement.textContent = `After GW${completedGameweeks}`;
      }
    }
  } catch (error) {
    console.warn('Failed to update page subtitle:', error);
  }
}

/**
 * Render winners table (responsive)
 */
async function renderWinnersTable() {
  const container = document.getElementById('winner-table-container');
  const navigation = document.getElementById('winner-navigation');

  if (!winnersWithPrizes.length) {
    container.innerHTML = '<div class="winner-loading">No prize winners yet.</div>';
    hide(navigation);
    return;
  }

  const isDesktop = isDesktopViewport();
  const totalPages = Math.ceil(winnersWithPrizes.length / PAGINATION.WINNERS_PER_PAGE);
  const startIndex = (currentWinnerPage - 1) * PAGINATION.WINNERS_PER_PAGE;
  const pageData = winnersWithPrizes.slice(startIndex, startIndex + PAGINATION.WINNERS_PER_PAGE);

  // Clear container
  container.innerHTML = '';

  if (isDesktop) {
    renderDesktopTable(container, pageData, startIndex);
  } else {
    renderMobileCards(container, pageData, startIndex);
  }

  // Update pagination
  if (totalPages > 1) {
    show(navigation);
    updateNavigation(totalPages);
  } else {
    hide(navigation);
  }
}

/**
 * Render desktop table view
 */
function renderDesktopTable(container, pageData, startIndex) {
  const headers = ['Rank', 'Player', 'Total Prize Won', 'Highlights'];

  const rows = pageData.map((winner, idx) => {
    const rank = startIndex + idx + 1;
    const h = winner.highlights || {};

    const highlights = [
      h.gameWeeks > 0 ? `<span class="highlight-badge gw">${h.gameWeeks}GW</span>` : '',
      h.gameMonths > 0 ? `<span class="highlight-badge gm">${h.gameMonths}GM</span>` : '',
      h.overallRank ? `<span class="highlight-badge">League Rank: ${h.overallRank}</span>` : '',
    ]
      .filter(Boolean)
      .join('');

    return [
      rank,
      { html: escapeHTML(winner.playerName), className: 'player-name' },
      { html: formatINR(winner.totalPrizeWon), className: 'prize-amount' },
      { html: `<div class="highlights">${highlights}</div>` },
    ];
  });

  const table = createTable({
    caption: 'Complete winner rankings by prize money won',
    headers,
    rows,
    className: 'winner-table',
  });

  // Apply rank classes to table rows
  pageData.forEach((_, idx) => {
    const rank = startIndex + idx + 1;
    const row = table.querySelector(`tbody tr:nth-child(${idx + 1})`);
    if (row && RANK_CLASSES[rank]) {
      row.classList.add(RANK_CLASSES[rank]);
    }
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'table-scroll';
  wrapper.appendChild(table);
  container.appendChild(wrapper);
}

/**
 * Render mobile cards view
 */
function renderMobileCards(container, pageData, startIndex) {
  const cardContainer = document.createElement('div');
  cardContainer.className = 'winner-preview';

  pageData.forEach((winner, idx) => {
    const rank = startIndex + idx + 1;
    const card = createCard(winner, rank);
    cardContainer.appendChild(card);
  });

  container.appendChild(cardContainer);
}

/**
 * Navigate to previous page
 */
function previousWinnerPage() {
  if (currentWinnerPage > 1) {
    currentWinnerPage--;
    renderWinnersTable();
  }
}

/**
 * Navigate to next page
 */
function nextWinnerPage() {
  const totalPages = Math.ceil(winnersWithPrizes.length / PAGINATION.WINNERS_PER_PAGE);
  if (currentWinnerPage < totalPages) {
    currentWinnerPage++;
    renderWinnersTable();
  }
}

/**
 * Update navigation controls
 */
function updateNavigation(totalPages) {
  const prevBtn = document.getElementById('winner-prev-page');
  const nextBtn = document.getElementById('winner-next-page');
  const pageInfo = document.getElementById('winner-page-info');

  if (prevBtn) prevBtn.disabled = currentWinnerPage === 1;
  if (nextBtn) nextBtn.disabled = currentWinnerPage === totalPages;
  if (pageInfo) pageInfo.textContent = `Page ${currentWinnerPage} of ${totalPages}`;
}

/**
 * Setup page navigation (preserve URL parameters)
 */
function setupPageNavigation() {
  const query = buildNavQuery();
  if (query) {
    const navigationButtons = document.querySelectorAll('.nav-back');
    navigationButtons.forEach((button) => {
      button.href = `index.html${query}`;
    });
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Pagination button handlers
  const prevBtn = document.getElementById('winner-prev-page');
  const nextBtn = document.getElementById('winner-next-page');

  if (prevBtn) {
    prevBtn.removeAttribute('onclick');
    prevBtn.addEventListener('click', previousWinnerPage);
  }

  if (nextBtn) {
    nextBtn.removeAttribute('onclick');
    nextBtn.addEventListener('click', nextWinnerPage);
  }

  // Responsive resize handler (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => renderWinnersTable(), 150);
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
