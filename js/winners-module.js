/**
 * winners-module.js
 * Winners page controller (desktop table + mobile cards)
 * ------------------------------------------------------
 * - Loads stats from API
 * - Renders responsive table/cards
 * - Provides pagination + resilient error/fallback UX
 * - Plays nicely with existing countdown/UI modules if present
 */

import { fetchJSON, endpoints } from './api-module.js';
import {
  renderSpinner,
  renderError,
  announce,
  createCard,
  formatINR,
  show,
  hide,
  updateText,
} from './ui-module.js';
import {
  PAGINATION,
  FEATURE_FLAGS,
  ERROR_MESSAGES,
  LOADING_MESSAGES,
  isDesktopViewport,
  buildNavQuery,
  RANK_CLASSES,
} from './state-module.js';

// ------------------ State ------------------
let allWinners = [];
let winnersWithPrizes = [];
let currentWinnerPage = 1;
let initialized = false;

// ------------------ Constants ------------------
const SEL = {
  CONTAINER: 'winner-table-container',
  NAV: 'winner-navigation',
  PREV: 'winner-prev-page',
  NEXT: 'winner-next-page',
  PAGEINFO: 'winner-page-info',
  SUBTITLE: 'winners-page-after-gw',
  FOOTER_TS: 'site-last-updated',
};

const IDS = {
  COUNTDOWN: 'countdown-clock',
};

// ------------------ Init ------------------
export async function init() {
  if (initialized) return;
  try {
    await renderSkeleton();
    await loadWinners();
    setupEventListeners();
    setupPageNavigation();
    initialized = true;
  } catch (err) {
    console.error('Winners init failed:', err);
    renderError(`#${SEL.CONTAINER}`, ERROR_MESSAGES.GENERIC_ERROR);
  }
}

// Render initial skeleton/loader and boot countdown (if available)
async function renderSkeleton() {
  renderSpinner(SEL.CONTAINER, LOADING_MESSAGES.WINNERS);
  initCountdown();
}

// Countdown bootstrapping (backwards compatible with existing globals)
function initCountdown() {
  const showStaticClock = () => {
    const clock = document.getElementById(IDS.COUNTDOWN);
    if (clock) clock.classList.remove('is-hidden');
  };

  try {
    if (window.FPLDataLoader && window.FPLCountdown && window.FPLUIManager) {
      window.FPLDataLoader.loadFPLSeasonData()
        .then(({ deadline, gameweek }) => {
          try {
            window.FPLUIManager?.handleSeasonDisplay?.(deadline, gameweek);
            window.FPLCountdown?.startCountdown?.(deadline, gameweek);
            window.FPLCountdown?.scheduleRolloverCheck?.(deadline);
          } catch (e) {
            console.warn('Countdown module error:', e);
            showStaticClock();
          }
        })
        .catch((e) => {
          console.warn('Season data load failed:', e);
          showStaticClock();
        });
    } else {
      showStaticClock();
    }
  } catch (e) {
    console.warn('Countdown init failed:', e);
  }
}

// ------------------ Data load ------------------
async function loadWinners() {
  try {
    const url = endpoints.winnerStats(
      FEATURE_FLAGS.isTestMode || FEATURE_FLAGS.dataOverride === 'test'
    );
    const data = await fetchJSON(url);

    allWinners = (data.winners || []).sort((a, b) => b.totalPrizeWon - a.totalPrizeWon);
    winnersWithPrizes = allWinners.filter((w) => (w.totalPrizeWon || 0) > 0);

    updateStatistics(data);
    updateFooterTimestamp(data.lastUpdated);
    await renderWinnersTable();
    updatePageSubtitle(data.summary?.completedGameweeks);

    announce('Results updated');
  } catch (err) {
    console.error('Failed to load winners:', err);
    renderError(`#${SEL.CONTAINER}`, ERROR_MESSAGES.WINNERS_UNAVAILABLE);
  }
}

function updateStatistics(data) {
  const summary = data.summary || {};
  updateText('completed-gameweeks', summary.completedGameweeks ?? '1');
  updateText('completed-gamemonths', summary.completedMonths ?? '0');
  updateText('total-winners', winnersWithPrizes.length);

  const totalPrize = winnersWithPrizes.reduce((s, w) => s + (w.totalPrizeWon || 0), 0);
  updateText('total-prize-money', formatINR(totalPrize), false);
}

function updateFooterTimestamp(lastUpdated) {
  const el = document.getElementById(SEL.FOOTER_TS);
  if (!el || !lastUpdated) return;
  try {
    const d = new Date(lastUpdated);
    const suffix = FEATURE_FLAGS.isTestMode ? ' (test data)' : ' (your local time)';
    el.textContent = `Data updated: ${d.toLocaleString()}${suffix}`;
  } catch {
    el.textContent = 'Data updated: Recently';
  }
}

function updatePageSubtitle(completedGameweeks) {
  try {
    if (window.FPLUIManager?.setLastProcessedGW) {
      window.FPLUIManager.setLastProcessedGW(completedGameweeks);
      window.FPLUIManager.updateWinnersHeaderGW?.();
    } else {
      const el = document.getElementById(SEL.SUBTITLE);
      if (el && completedGameweeks > 0) el.textContent = `After GW${completedGameweeks}`;
    }
  } catch (e) {
    console.warn('Subtitle update failed:', e);
  }
}

// ------------------ Renderers ------------------
async function renderWinnersTable() {
  const container = document.getElementById(SEL.CONTAINER);
  const nav = document.getElementById(SEL.NAV);

  if (!winnersWithPrizes.length) {
    container.innerHTML = '<div class="winner-loading">No prize winners yet.</div>';
    hide(nav);
    return;
  }

  const isDesktop = isDesktopViewport();
  const totalPages = Math.ceil(winnersWithPrizes.length / PAGINATION.WINNERS_PER_PAGE);
  const start = (currentWinnerPage - 1) * PAGINATION.WINNERS_PER_PAGE;
  const pageData = winnersWithPrizes.slice(start, start + PAGINATION.WINNERS_PER_PAGE);

  container.innerHTML = '';
  if (isDesktop) renderDesktopTable(container, pageData, start);
  else renderMobileCards(container, pageData, start);

  if (totalPages > 1) {
    show(nav);
    updateNavigation(totalPages);
  } else {
    hide(nav);
  }
}

// Desktop: one semantic table, fixed four columns, robust to CSS overrides
function renderDesktopTable(container, pageData, startIndex) {
  // Calculate max rank width dynamically based on total winners
  const maxRank = winnersWithPrizes.length;
  const rankWidth = String(maxRank).length;

  let html = `
  <div class=\"c-table-wrap\">
    <table class=\"c-table c-table--winners\" role=\"table\">
      <colgroup>
        <col style=\"width:8%\" />
        <col style=\"width:42%\" />
        <col style=\"width:15%\" />
        <col style=\"width:35%\" />
      </colgroup>
      <thead class=\"c-table__head\">
        <tr>
          <th scope=\"col\" class=\"col-rank\">#</th>
          <th scope=\"col\" class=\"col-player\">PLAYER</th>
          <th scope=\"col\" class=\"col-total\">PRIZE WON</th>
          <th scope=\"col\" class=\"col-highlights\">HIGHLIGHTS</th>
        </tr>
      </thead>
      <tbody class=\"c-table__body\" id=\"winners-tbody\">`;

  pageData.forEach((w, i) => {
    const rank = startIndex + i + 1;
    const h = w.highlights || {};
    const achievements = w.achievements || {};

    // Build GW badge with tooltip - count from achievements.gameweeks array
    let gwBadge = '<span></span>';
    if (h.gameWeeks > 0) {
      const gameweeks = achievements.gameweeks || [];
      const gwFirst = gameweeks.filter((gw) => gw.position === '1st').length;
      const gwSecond = gameweeks.filter((gw) => gw.position === '2nd').length;

      let tooltipContent = '';
      if (gwFirst > 0) {
        tooltipContent += `<div class="tooltip-row"><span class="tooltip-label">🥇 1st:</span><span class="tooltip-value">${gwFirst} win${gwFirst > 1 ? 's' : ''}</span></div>`;
      }
      if (gwSecond > 0) {
        tooltipContent += `<div class="tooltip-row"><span class="tooltip-label">🥈 2nd:</span><span class="tooltip-value">${gwSecond} win${gwSecond > 1 ? 's' : ''}</span></div>`;
      }
      // Only add tooltip if there's content
      const tooltip = tooltipContent ? `<span class="tooltip">${tooltipContent}</span>` : '';
      gwBadge = `<span class="pill pill-gw">${h.gameWeeks} GW${tooltip}</span>`;
    }

    // Build GM badge with tooltip - count from achievements.months array
    let gmBadge = '<span></span>';
    if (h.gameMonths > 0) {
      const months = achievements.months || [];
      const gmFirst = months.filter((m) => m.position === '1st').length;
      const gmSecond = months.filter((m) => m.position === '2nd').length;

      let tooltipContent = '';
      if (gmFirst > 0) {
        tooltipContent += `<div class="tooltip-row"><span class="tooltip-label">🥇 1st:</span><span class="tooltip-value">${gmFirst} win${gmFirst > 1 ? 's' : ''}</span></div>`;
      }
      if (gmSecond > 0) {
        tooltipContent += `<div class="tooltip-row"><span class="tooltip-label">🥈 2nd:</span><span class="tooltip-value">${gmSecond} win${gmSecond > 1 ? 's' : ''}</span></div>`;
      }
      // Only add tooltip if there's content
      const tooltip = tooltipContent ? `<span class="tooltip">${tooltipContent}</span>` : '';
      gmBadge = `<span class="pill pill-gm">${h.gameMonths} GM${tooltip}</span>`;
    }

    // Dynamic rank with right-aligned number in fixed-width span
    const rankText = h.overallRank
      ? `<span class=\"rank-text\">League Rank <span class=\"rank-number\" style=\"min-width: ${rankWidth}ch;\">${h.overallRank}</span></span>`
      : '<span></span>';

    const topClass = RANK_CLASSES && RANK_CLASSES[rank] ? ` ${RANK_CLASSES[rank]}` : '';
    html += `
      <tr class="${topClass.trim()}">
        <td class="col-rank">${rank}</td>
        <td class="col-player">${w.playerName}</td>
        <td class="col-total">₹${(w.totalPrizeWon || 0).toLocaleString('en-IN')}</td>
        <td class="col-highlights">${gwBadge}${gmBadge}${rankText}</td>
      </tr>`;
  });

  html += `</tbody></table></div>`;
  container.innerHTML = html;
}

// Mobile/Tablet: cards (reuse shared createCard)
function renderMobileCards(container, pageData, startIndex) {
  const root = document.createElement('div');
  root.className = 'winner';

  const wrap = document.createElement('div');
  wrap.className = 'winner__preview';
  const maxRank = winnersWithPrizes.length; // Pass max rank for dynamic padding
  pageData.forEach((w, i) => {
    const rank = startIndex + i + 1;
    wrap.appendChild(createCard(w, rank, maxRank));
  });
  root.appendChild(wrap);
  container.appendChild(root);
}

// ------------------ Pagination ------------------
function previousWinnerPage() {
  if (currentWinnerPage > 1) {
    currentWinnerPage--;
    renderWinnersTable();
  }
}

function nextWinnerPage() {
  const totalPages = Math.ceil(winnersWithPrizes.length / PAGINATION.WINNERS_PER_PAGE);
  if (currentWinnerPage < totalPages) {
    currentWinnerPage++;
    renderWinnersTable();
  }
}

function updateNavigation(totalPages) {
  const prev = document.getElementById(SEL.PREV);
  const next = document.getElementById(SEL.NEXT);
  const info = document.getElementById(SEL.PAGEINFO);

  if (prev) prev.disabled = currentWinnerPage === 1;
  if (next) next.disabled = currentWinnerPage === totalPages;
  if (info) info.textContent = `Page ${currentWinnerPage} of ${totalPages}`;
}

// Preserve URL params for “Back to Home”
function setupPageNavigation() {
  const q = buildNavQuery();
  if (!q) return;
  document.querySelectorAll('.nav-back').forEach((a) => {
    a.href = `index.html${q}`;
  });
}

// Events: pagination + resize (debounced)
function setupEventListeners() {
  const prev = document.getElementById(SEL.PREV);
  const next = document.getElementById(SEL.NEXT);

  if (prev) {
    prev.removeAttribute('onclick');
    prev.addEventListener('click', previousWinnerPage);
  }
  if (next) {
    next.removeAttribute('onclick');
    next.addEventListener('click', nextWinnerPage);
  }

  let rAF = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(() => renderWinnersTable());
  });
}

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
