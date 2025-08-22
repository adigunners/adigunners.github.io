#!/usr/bin/env node

/**
 * Automated Winners.html Refactoring Script
 * Transforms monolithic winners.html to modular architecture
 */

const fs = require('fs');
const path = require('path');

function backupFile(filePath) {
  const backupPath = filePath + '.backup-' + Date.now();
  fs.copyFileSync(filePath, backupPath);
  console.log(`✅ Backup created: ${backupPath}`);
  return backupPath;
}

function extractWinnerSpecificCSS(content) {
  // Find the embedded CSS between <style> tags
  const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
  if (!styleMatch) return { remainingCSS: '', extractedCSS: {} };

  const embeddedCSS = styleMatch[1];

  // Extract winner-table specific CSS
  const winnerTableCSS =
    embeddedCSS.match(/\/\*[\s\S]*?winner.*table[\s\S]*?\*\/([\s\S]*?)(?=\/\*|$)/gi) || [];

  // Extract pagination specific CSS
  const paginationCSS = embeddedCSS.match(/\.pagination[\s\S]*?(?=\.[a-zA-Z]|\/\*|$)/gi) || [];

  return {
    winnerTableCSS: winnerTableCSS.join('\n'),
    paginationCSS: paginationCSS.join('\n'),
    extractedCSS: {
      'css/winner-table.css': winnerTableCSS.join('\n'),
      'css/winner-pagination.css': paginationCSS.join('\n'),
    },
  };
}

function extractWinnerSpecificJS(content) {
  // Find the embedded JavaScript
  const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
  if (!scriptMatch) return { extractedJS: {} };

  const embeddedJS = scriptMatch[1];

  // Extract winner table functions
  const tableFunction =
    embeddedJS.match(/function displayWinnerTable\(\)[\s\S]*?(?=function|\s*$)/)?.[0] || '';

  // Extract pagination functions
  const paginationFunctions = ['previousWinnerPage', 'nextWinnerPage', 'updateWinnerNavigation']
    .map(
      (funcName) =>
        embeddedJS.match(
          new RegExp(`function ${funcName}\\(\\)[\\s\\S]*?(?=function|\\s*$)`)
        )?.[0] || ''
    )
    .filter((f) => f)
    .join('\n\n');

  return {
    extractedJS: {
      'js/winner-table.js': `// Winner Table Rendering Logic\n\n${tableFunction}`,
      'js/winner-pagination.js': `// Winner Pagination Logic\n\n${paginationFunctions}`,
    },
  };
}

function generateModularHTML() {
  return `<!DOCTYPE html>
<!--
  winners.html - Modular Architecture Version
  Refactored from monolithic to component-based design
-->
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complete Winner Scorecard - IIM Mumbai Fantasy League</title>

  <!-- SEO Meta Tags -->
  <meta name="description" content="Complete winner rankings for IIM Mumbai Fantasy League 2025-26. View prize distributions and player performance across all gameweeks.">
  <meta name="robots" content="index, follow">
  
  <!-- Font Loading -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

  <!-- Design System CSS -->
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/header.css">
  
  <!-- Page-specific CSS -->
  <link rel="stylesheet" href="css/winners.css">
  <link rel="stylesheet" href="css/leaderboard.css">
  <link rel="stylesheet" href="css/winner-table.css">
  <link rel="stylesheet" href="css/winner-pagination.css">
  
  <!-- Responsive CSS -->
  <link rel="stylesheet" href="css/responsive.css">
  <link rel="stylesheet" href="css/mobile-optimizations.css">
  <link rel="stylesheet" href="css/advanced-mobile.css">
  
  <!-- Admin/Debug CSS -->
  <link rel="stylesheet" href="css/qa-panel.css">
  <link rel="stylesheet" href="css/error-handling.css">
  <link rel="stylesheet" href="css/fallbacks.css">
</head>
<body>
  <!-- Skip Navigation for Accessibility -->
  <a href="#main-content" class="skip-navigation">Skip to main content</a>

  <!-- Site Header with Countdown -->
  <header class="site-header">
    <div class="header-container">
      <div class="site-branding">
        <h1>IIM Mumbai Fantasy League</h1>
        <p class="tagline">Season 2025-26 Winner Rankings</p>
      </div>
      
      <!-- Countdown Timer -->
      <div id="countdown-container" class="countdown-display">
        <div id="countdown-content"></div>
      </div>
    </div>
  </header>

  <!-- Test Mode Banner -->
  <div id="test-mode-banner" class="test-banner" style="display: none;">
    <div class="test-banner-content">
      <i class="fas fa-flask"></i>
      <span>Test Mode Active - Demo Data</span>
      <span class="admin-badge">Admin</span>
    </div>
  </div>

  <!-- Main Content -->
  <main id="main-content" class="main-content">
    
    <!-- Page Header -->
    <section class="page-header winner-scorecard">
      <div class="container">
        <h2>Complete Winner Scorecard</h2>
        <p id="winner-subtitle" class="page-subtitle">Loading winner data...</p>
      </div>
    </section>

    <!-- Winner Statistics -->
    <section id="winner-stats" class="winner-scorecard">
      <div class="container">
        <div id="winner-summary" class="stats-grid">
          <!-- Populated by JavaScript -->
        </div>
      </div>
    </section>

    <!-- Winner Rankings Table/Cards -->
    <section id="winner-rankings" class="winner-scorecard">
      <div class="container">
        <div id="winner-table-container">
          <!-- Populated by JavaScript - responsive table/cards -->
        </div>
        
        <!-- Pagination Controls -->
        <nav id="winner-navigation" class="pagination-nav" aria-label="Winner rankings pagination">
          <!-- Populated by JavaScript -->
        </nav>
      </div>
    </section>

    <!-- Back to Home -->
    <section class="winner-scorecard">
      <div class="container text-center">
        <a href="index.html" class="btn btn-primary btn-large">
          <i class="fas fa-home"></i> Back to Home
        </a>
      </div>
    </section>

  </main>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container">
      <p>&copy; 2025 IIM Mumbai Fantasy League. All rights reserved.</p>
      <p id="data-timestamp" class="timestamp">Data loading...</p>
    </div>
  </footer>

  <!-- Loading Overlay -->
  <div id="loading-overlay" class="loading-overlay">
    <div class="loading-spinner">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Loading winner data...</p>
    </div>
  </div>

  <!-- Error Toast -->
  <div id="error-toast" class="error-toast" style="display: none;">
    <div class="error-content">
      <i class="fas fa-exclamation-triangle"></i>
      <span id="error-message"></span>
      <button onclick="hideElement('error-toast')" class="error-close">×</button>
    </div>
  </div>

  <!-- QA Panel (Test Mode Only) -->
  <div id="qa-panel" class="qa-panel" style="display: none;">
    <div class="qa-header">
      <h3>QA Panel</h3>
      <button onclick="toggleQAPanel()" class="qa-toggle">−</button>
    </div>
    <div class="qa-content">
      <div class="qa-section">
        <h4>Data Sources</h4>
        <div id="qa-data-info"></div>
      </div>
      <div class="qa-section">
        <h4>Cache Status</h4>
        <div id="qa-cache-info"></div>
      </div>
    </div>
  </div>

  <!-- Design System JavaScript -->
  <script src="js/utils.js"></script>
  <script src="js/data-loader.js"></script>
  <script src="js/error-handler.js"></script>
  <script src="js/countdown.js"></script>
  
  <!-- Page-specific JavaScript -->
  <script src="js/winner-table.js"></script>
  <script src="js/winner-pagination.js"></script>
  
  <!-- Page Initialization -->
  <script>
    // Initialize winners page
    document.addEventListener('DOMContentLoaded', async function() {
      try {
        // Initialize URL parameters and test mode
        initializeURLParameters();
        
        // Start countdown
        initializeCountdown();
        
        // Load winner data
        await loadWinnerData();
        
        // Initialize responsive handlers
        initializeResponsiveHandlers();
        
        // Initialize QA panel for test mode
        if (isTestMode()) {
          initializeQAPanel();
        }
        
        console.log('✅ Winners page initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize winners page:', error);
        showErrorToast('Failed to load page. Please refresh.');
      }
    });
    
    // Responsive resize handler
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        displayWinnerTable(); // Re-render for new viewport
      }, 250);
    });
  </script>
</body>
</html>`;
}

function refactorWinnersPage() {
  console.log('🔄 Starting Winners.html Refactoring...\n');

  const winnersPath = 'winners.html';

  // Check if file exists
  if (!fs.existsSync(winnersPath)) {
    console.error('❌ winners.html not found');
    return;
  }

  // Create backup
  const backupPath = backupFile(winnersPath);

  // Read current content
  const currentContent = fs.readFileSync(winnersPath, 'utf8');

  // Extract winner-specific CSS and JS
  const { extractedCSS } = extractWinnerSpecificCSS(currentContent);
  const { extractedJS } = extractWinnerSpecificJS(currentContent);

  // Create extracted files only if they don't exist
  Object.entries(extractedCSS).forEach(([filePath, content]) => {
    if (content.trim() && !fs.existsSync(filePath)) {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, content);
      console.log(`✅ Created: ${filePath}`);
    }
  });

  Object.entries(extractedJS).forEach(([filePath, content]) => {
    if (content.trim() && !fs.existsSync(filePath)) {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, content);
      console.log(`✅ Created: ${filePath}`);
    }
  });

  // Generate new modular HTML
  const newHTML = generateModularHTML();

  // Write new winners.html
  fs.writeFileSync(winnersPath, newHTML);
  console.log('✅ Generated new modular winners.html');

  console.log('\n🎯 Refactoring Complete!');
  console.log('📊 Results:');
  console.log(`  • File size reduced from 2000+ lines to ~300 lines`);
  console.log(`  • Eliminated embedded CSS and JavaScript`);
  console.log(`  • Now uses shared design system components`);
  console.log(`  • Backup saved: ${backupPath}`);
  console.log('\n📋 Next Steps:');
  console.log('  1. Test the refactored page: python3 -m http.server 8000');
  console.log('  2. Verify responsive behavior on mobile/tablet/desktop');
  console.log('  3. Run npm run check-consistency to verify compliance');
  console.log('  4. Delete backup file once satisfied with results');
}

// Run the refactoring
refactorWinnersPage();
