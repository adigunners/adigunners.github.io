#!/usr/bin/env node

/**
 * Website Consistency Checker
 * Ensures design system compliance across all pages
 */

const fs = require('fs');
const path = require('path');

const DESIGN_SYSTEM_FILES = [
  'css/variables.css',
  'css/base.css',
  'css/components.css',
  'css/header.css',
  'js/utils.js',
  'js/data-loader.js',
  'js/error-handler.js',
  'js/countdown.js',
];

const HTML_PAGES = ['index.html', 'winners.html'];

const REQUIRED_CSS_IMPORTS = [
  'css/variables.css',
  'css/base.css',
  'css/components.css',
  'css/header.css',
  'css/responsive.css',
];

const REQUIRED_JS_IMPORTS = [
  'js/utils.js',
  'js/data-loader.js',
  'js/error-handler.js',
  'js/countdown.js',
];

function checkFileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function analyzeHTMLFile(filePath) {
  if (!checkFileExists(filePath)) {
    return { error: `File not found: ${filePath}` };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // Check for embedded CSS
  const embeddedCSS = content.includes('<style>');
  const embeddedCSSLines = embeddedCSS
    ? (content.match(/<style>[\s\S]*?<\/style>/g) || []).join('').split('\n').length
    : 0;

  // Check for embedded JS
  const embeddedJS = content.includes('<script>') && !content.match(/<script[^>]*src=/);
  const embeddedJSLines = embeddedJS
    ? (content.match(/<script>[\s\S]*?<\/script>/g) || []).join('').split('\n').length
    : 0;

  // Check for required CSS imports
  const missingCSS = REQUIRED_CSS_IMPORTS.filter((css) => !content.includes(`href="${css}"`));

  // Check for required JS imports
  const missingJS = REQUIRED_JS_IMPORTS.filter((js) => !content.includes(`src="${js}"`));

  // Check for duplicate functions
  const duplicateFunctions = [];
  ['escapeHTML', 'showElement', 'hideElement'].forEach((func) => {
    const matches = content.match(new RegExp(`function ${func}`, 'g')) || [];
    if (matches.length > 0) {
      duplicateFunctions.push(`${func} (${matches.length} times)`);
    }
  });

  return {
    file: filePath,
    totalLines: lines.length,
    embeddedCSS: {
      present: embeddedCSS,
      lines: embeddedCSSLines,
    },
    embeddedJS: {
      present: embeddedJS,
      lines: embeddedJSLines,
    },
    missingCSS,
    missingJS,
    duplicateFunctions,
    isModular: !embeddedCSS && !embeddedJS && missingCSS.length === 0 && missingJS.length === 0,
  };
}

function generateReport() {
  console.log('🔍 Website Consistency Check Report');
  console.log('===================================\n');

  // Check design system files exist
  console.log('📁 Design System Files:');
  DESIGN_SYSTEM_FILES.forEach((file) => {
    const exists = checkFileExists(file);
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  });
  console.log();

  // Analyze each HTML page
  console.log('📄 Page Analysis:');
  HTML_PAGES.forEach((page) => {
    const analysis = analyzeHTMLFile(page);

    if (analysis.error) {
      console.log(`❌ ${page}: ${analysis.error}`);
      return;
    }

    console.log(`\n📊 ${page}:`);
    console.log(`  Total lines: ${analysis.totalLines}`);
    console.log(`  Modular: ${analysis.isModular ? '✅' : '❌'}`);

    if (analysis.embeddedCSS.present) {
      console.log(`  ❌ Embedded CSS: ${analysis.embeddedCSS.lines} lines`);
    }

    if (analysis.embeddedJS.present) {
      console.log(`  ❌ Embedded JS: ${analysis.embeddedJS.lines} lines`);
    }

    if (analysis.missingCSS.length > 0) {
      console.log(`  ❌ Missing CSS imports: ${analysis.missingCSS.join(', ')}`);
    }

    if (analysis.missingJS.length > 0) {
      console.log(`  ❌ Missing JS imports: ${analysis.missingJS.join(', ')}`);
    }

    if (analysis.duplicateFunctions.length > 0) {
      console.log(`  ❌ Duplicate functions: ${analysis.duplicateFunctions.join(', ')}`);
    }

    if (analysis.isModular) {
      console.log(`  ✅ Follows design system architecture`);
    }
  });

  // Generate recommendations
  console.log('\n💡 Recommendations:');
  HTML_PAGES.forEach((page) => {
    const analysis = analyzeHTMLFile(page);
    if (analysis.error) return;

    if (!analysis.isModular) {
      console.log(`\n🔧 ${page} needs refactoring:`);

      if (analysis.embeddedCSS.present) {
        console.log(`  • Extract ${analysis.embeddedCSS.lines} lines of CSS to external files`);
      }

      if (analysis.embeddedJS.present) {
        console.log(`  • Extract ${analysis.embeddedJS.lines} lines of JS to external files`);
      }

      if (analysis.missingCSS.length > 0) {
        console.log(`  • Add missing CSS imports: ${analysis.missingCSS.join(', ')}`);
      }

      if (analysis.missingJS.length > 0) {
        console.log(`  • Add missing JS imports: ${analysis.missingJS.join(', ')}`);
      }
    }
  });

  console.log('\n📚 Next Steps:');
  console.log('  1. See docs/WINNERS_REFACTOR_PLAN.md for detailed refactoring steps');
  console.log('  2. Follow docs/DESIGN_SYSTEM_GUIDE.md for consistent development');
  console.log('  3. Run this checker after changes to verify compliance');
  console.log('\n✨ Goal: All pages should show "✅ Follows design system architecture"');
}

// Run the report
generateReport();
