/**
 * UI Module - Shared DOM helpers and rendering utilities
 * Provides safe text handling, DOM manipulation, and accessibility features
 */

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} str - The string to escape
 * @returns {string} Escaped HTML string
 */
export function escapeHTML(str) {
  if (!str && str !== 0) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Clear all content from a DOM element
 * @param {HTMLElement|string} target - Element or selector
 */
export function clear(target) {
  const element = typeof target === 'string' ? document.getElementById(target) : target;
  if (element) {
    element.innerHTML = '';
  }
}

/**
 * Show loading spinner in target element
 * @param {HTMLElement|string} target - Element or ID to show spinner in
 * @param {string} message - Loading message
 */
export function renderSpinner(target, message = 'Loading...') {
  const element = typeof target === 'string' ? document.getElementById(target) : target;
  if (element) {
    element.innerHTML = `
      <div class="loading-state">
        <div class="spinner" aria-hidden="true"></div>
        <div class="loading-text">${escapeHTML(message)}</div>
      </div>
    `;
  }
}

/**
 * Render error message in target element
 * @param {HTMLElement|string} target - Element or ID to show error in
 * @param {string} text - Error message
 */
export function renderError(target, text) {
  const element = typeof target === 'string' ? document.getElementById(target) : target;
  if (element) {
    element.innerHTML = `
      <div class="error-state" role="alert">
        <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
        <div class="error-message">${escapeHTML(text)}</div>
      </div>
    `;
  }
}

/**
 * Announce message to screen readers via aria-live region
 * @param {string} text - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export function announce(text, priority = 'polite') {
  let liveRegion = document.getElementById('aria-live-region');

  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'visually-hidden';
    document.body.appendChild(liveRegion);
  }

  liveRegion.textContent = text;
}

/**
 * Create semantic table with proper accessibility
 * @param {Object} options - Table configuration
 * @param {string} options.caption - Table caption (visually hidden)
 * @param {Array} options.headers - Column headers
 * @param {Array} options.rows - Table row data
 * @param {string} options.className - CSS class for table
 * @returns {HTMLTableElement} Configured table element
 */
export function createTable({ caption, headers, rows, className }) {
  const table = document.createElement('table');
  if (className) table.className = className;

  // Add visually hidden caption
  if (caption) {
    const captionEl = document.createElement('caption');
    captionEl.className = 'visually-hidden';
    captionEl.textContent = caption;
    table.appendChild(captionEl);
  }

  // Create header
  if (headers && headers.length) {
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    headers.forEach((header) => {
      const th = document.createElement('th');
      th.setAttribute('scope', 'col');
      th.textContent = header;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);
  }

  // Create body
  if (rows && rows.length) {
    const tbody = document.createElement('tbody');

    rows.forEach((row) => {
      const tr = document.createElement('tr');

      row.forEach((cellData, cellIndex) => {
        const cell = cellIndex === 0 ? document.createElement('th') : document.createElement('td');

        if (cellIndex === 0) {
          cell.setAttribute('scope', 'row');
        }

        if (typeof cellData === 'object' && cellData.html) {
          cell.innerHTML = cellData.html;
        } else {
          cell.textContent = cellData;
        }

        if (cellData.className) {
          cell.className = cellData.className;
        }

        tr.appendChild(cell);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
  }

  return table;
}

/**
 * Create responsive card element
 * @param {Object} data - Card data
 * @param {number} rank - Card rank (1-based)
 * @param {number} maxRank - Total number of winners (for dynamic padding)
 * @returns {HTMLElement} Card element
 */
export function createCard(data, rank, maxRank = 100) {
  const card = document.createElement('div');
  card.className = `winner__card${rank <= 3 ? ` winner__card--rank-${rank}` : ''}`;

  const rankEl = document.createElement('div');
  rankEl.className = 'winner__rank';
  rankEl.textContent = `#${rank}`;
  card.appendChild(rankEl);

  const nameEl = document.createElement('div');
  nameEl.className = 'winner__name';
  nameEl.textContent = data.playerName;
  card.appendChild(nameEl);

  const prizeEl = document.createElement('div');
  prizeEl.className = 'winner__prize';
  prizeEl.textContent = `₹${data.totalPrizeWon.toLocaleString('en-IN')}`;
  card.appendChild(prizeEl);

  if (data.highlights) {
    const highlightsEl = document.createElement('div');
    highlightsEl.className = 'winner__highlights';

    const badges = [];
    const achievements = data.achievements || {};

    // GW badge with tooltip - count from achievements.gameweeks array
    if (data.highlights.gameWeeks > 0) {
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
      badges.push(`<span class="pill pill-gw">${data.highlights.gameWeeks} GW${tooltip}</span>`);
    }

    // GM badge with tooltip - count from achievements.months array
    if (data.highlights.gameMonths > 0) {
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
      badges.push(`<span class="pill pill-gm">${data.highlights.gameMonths} GM${tooltip}</span>`);
    }

    // Dynamic rank with right-aligned number in fixed-width span
    if (data.highlights.overallRank) {
      const rankWidth = String(maxRank).length;
      badges.push(
        `<span class="rank-text">League Rank <span class="rank-number" style="min-width: ${rankWidth}ch;">${data.highlights.overallRank}</span></span>`
      );
    }

    highlightsEl.innerHTML = badges.join(' ');
    card.appendChild(highlightsEl);
  }

  return card;
}

/**
 * Format Indian Rupees with proper locale formatting
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatINR(amount) {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
}

/**
 * Show or hide elements with accessibility considerations
 */
export function show(element) {
  if (element) {
    element.classList.remove('is-hidden');
    element.removeAttribute('aria-hidden');
  }
}

export function hide(element) {
  if (element) {
    element.classList.add('is-hidden');
    element.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Update element text content safely
 * @param {string} elementId - Element ID
 * @param {string} text - Text content
 * @param {boolean} escape - Whether to escape HTML (default: true)
 */
export function updateText(elementId, text, escape = true) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = escape ? text : '';
    if (!escape) {
      element.innerHTML = text;
    }
  }
}
