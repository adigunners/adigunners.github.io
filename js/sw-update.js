/* Service Worker registration + in-page update prompt */
(function () {
  if (!('serviceWorker' in navigator)) return;

  function createUpdateBanner(onReload) {
    var banner = document.createElement('div');
    banner.setAttribute('role', 'status');
    banner.setAttribute('aria-live', 'polite');
    banner.style.cssText = [
      'position:fixed',
      'left:50%',
      'bottom:16px',
      'transform:translateX(-50%)',
      'background:#37003c',
      'color:#fff',
      'padding:10px 16px',
      'border-radius:8px',
      'box-shadow:0 4px 16px rgba(0,0,0,.2)',
      'z-index:9999',
      'display:flex',
      'gap:12px',
      'align-items:center',
      'font:500 14px system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    ].join(';');
    banner.innerHTML = '<span>New version available.</span>';
    var btn = document.createElement('button');
    btn.textContent = 'Refresh';
    btn.style.cssText =
      'background:#fff;color:#37003c;border:none;border-radius:6px;padding:6px 10px;cursor:pointer;font-weight:600';
    btn.onclick = function () {
      onReload && onReload();
    };
    banner.appendChild(btn);
    document.body.appendChild(banner);
    return banner;
  }

  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(function (reg) {
        // Listen for updates
        if (reg.waiting) {
          // Already waiting — prompt immediately
          promptToRefresh(reg.waiting);
        }
        reg.addEventListener('updatefound', function () {
          var newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', function () {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              promptToRefresh(newWorker);
            }
          });
        });

        // If the controller changes, reload once to get the fresh page
        var refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', function () {
          if (refreshing) return;
          refreshing = true;
          window.location.reload();
        });
      })
      .catch(function (err) {
        console.log('SW registration failed:', err);
      });
  });

  function promptToRefresh(worker) {
    createUpdateBanner(function () {
      // Ask the waiting SW to activate immediately
      if (worker && worker.postMessage) {
        worker.postMessage({ type: 'SKIP_WAITING' });
      } else if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      }
    });
  }
})();
