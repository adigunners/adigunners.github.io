// Test/Admin wrappers loaded only when ?test=true or ?admin=true
(function () {
  'use strict';

  function safe(fn, fallback) {
    try {
      return fn();
    } catch (e) {
      if (fallback) return fallback(e);
      return undefined;
    }
  }

  // Expose minimal globals used by inline event handlers in test/admin modes
  window.toggleSeasonMode = function () {
    return safe(() => window.FPLUIManager && FPLUIManager.toggleSeasonMode());
  };

  window.updatePhaseToggleButtons = function () {
    return safe(() => window.FPLUIManager && FPLUIManager.updatePhaseToggleButtons());
  };

  window.openWinnersWithToggledPhase = function () {
    return safe(() => {
      // Force phase=season on Winners and preserve test/data/clockOffset
      var keys = ['test', 'data', 'phase', 'clockOffset'];
      var qp = new URLSearchParams(location.search);
      var out = new URLSearchParams();
      keys.forEach(function (k) {
        if (qp.has(k)) out.set(k, qp.get(k));
      });
      out.set('phase', 'season');
      var qs = out.toString();
      location.href = 'winners.html' + (qs ? '?' + qs : '');
    });
  };

  // Optional: expose checkTestMode for console use in test/admin
  window.checkTestMode = function () {
    return safe(() => window.FPLUIManager && FPLUIManager.checkTestMode());
  };
})();
