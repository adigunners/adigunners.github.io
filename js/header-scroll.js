// Progressive auto-hide sticky header on scroll
// Hides header as you scroll down; reveals as you scroll up.
// Applies to the first element with class `.site-header`.
(function () {
  'use strict';

  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  function init() {
    // Respect user preference to reduce motion
    var mql = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mql && mql.matches) {
      return; // Do not apply auto-hide for reduced motion users
    }
    var siteHeader = document.querySelector('.site-header');
    if (!siteHeader) return;

    var lastY = window.scrollY || 0;
    var hidden = 0; // pixels hidden (0..headerHeight)
    var headerHeight = 0;
    var ticking = false;

    function recalc() {
      // Use offsetHeight to include padding/borders; guard for 0 during layout
      headerHeight = Math.max(0, siteHeader.offsetHeight || 0);
      // Clamp the current hidden amount to the new height
      hidden = Math.min(hidden, headerHeight);
      // Expose height for potential future use
      document.documentElement.style.setProperty('--header-height', headerHeight + 'px');
      // Ensure CSS variables reflect current state after recalculation
      updateVars();
    }

    function updateVars() {
      var progress = headerHeight > 0 ? hidden / headerHeight : 0;
      // Translate the sticky wrapper up by `hidden` pixels
      siteHeader.style.setProperty('--header-offset', hidden + 'px');
      // Optionally fade the inner content as it hides
      siteHeader.style.setProperty('--header-opacity', String(1 - progress));
    }

    function onScroll() {
      var y = window.scrollY || 0;
      var delta = y - lastY;
      lastY = y;

      // Ignore tiny jitters
      if (delta === 0) return;

      // Clamp delta to avoid large jumps due to momentum
      if (delta > 64) delta = 64;
      else if (delta < -64) delta = -64;

      hidden += delta;
      if (hidden < 0) hidden = 0;
      if (hidden > headerHeight) hidden = headerHeight;

      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () {
          updateVars();
          ticking = false;
        });
      }
    }

    // Recalculate on resize/orientation changes
    window.addEventListener('resize', recalc, { passive: true });
    window.addEventListener('orientationchange', function () {
      // Delay to allow viewport to settle
      setTimeout(recalc, 100);
    });

    // Scroll handler
    window.addEventListener('scroll', onScroll, { passive: true });

    // Initialize once DOM is ready to measure height accurately
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', recalc, { once: true });
    } else {
      recalc();
    }
  }

  try {
    init();
  } catch (e) {
    // Fail silently to avoid breaking the page if anything goes wrong
    console && console.warn && console.warn('header auto-hide init failed:', e);
  }
})();
