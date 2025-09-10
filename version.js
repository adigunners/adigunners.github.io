// Shared version constant for both window (pages) and worker scope
(function(global){
  var v = '1.0.6';
  try {
    // In window context
    if (typeof window !== 'undefined') window.SITE_VERSION = v;
    // In worker context
    if (typeof global !== 'undefined') global.SITE_VERSION = v;
  } catch (_) {}
})(typeof self !== 'undefined' ? self : this);

