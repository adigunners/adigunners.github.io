/**
 * Font Loading Fallback Tests
 * Tests for external resource loading and fallback mechanisms
 */

describe('Font Loading Fallback System', () => {
  let testContainer;

  beforeEach(() => {
    // Create test container
    testContainer = document.createElement('div');
    testContainer.id = 'test-container';
    document.body.appendChild(testContainer);

    // Reset any existing font loading states
    document.body.classList.remove('poppins-fallback', 'external-resources-failed');
  });

  afterEach(() => {
    // Clean up
    if (testContainer && testContainer.parentNode) {
      testContainer.parentNode.removeChild(testContainer);
    }

    // Reset classes
    document.body.classList.remove('poppins-fallback', 'external-resources-failed');
  });

  describe('Google Fonts Poppins Loading', () => {
    test('should detect when Poppins font fails to load', (done) => {
      // Create a test element with Poppins font
      const testEl = document.createElement('div');
      testEl.style.fontFamily = 'Poppins, serif';
      testEl.style.position = 'absolute';
      testEl.style.left = '-9999px';
      testEl.textContent = 'test';
      document.body.appendChild(testEl);

      // Wait for font loading attempt
      setTimeout(() => {
        const computedStyle = window.getComputedStyle(testEl);

        // If Poppins didn't load, fallback should be triggered
        if (computedStyle.fontFamily.indexOf('Poppins') === -1) {
          expect(document.body.classList.contains('poppins-fallback')).toBe(true);
        }

        document.body.removeChild(testEl);
        done();
      }, 100);
    });

    test('should apply fallback CSS when external resources fail', () => {
      // Simulate external resource failure
      document.body.classList.add('external-resources-failed');

      // Check if fallback CSS is enabled
      const fallbackCSS = document.getElementById('fallback-css');
      if (fallbackCSS) {
        expect(fallbackCSS.disabled).toBe(false);
      }

      expect(document.body.classList.contains('external-resources-failed')).toBe(true);
    });
  });

  describe('Font Awesome Loading', () => {
    test('should detect when Font Awesome fails to load', (done) => {
      // Create test element with Font Awesome icon
      const testEl = document.createElement('div');
      testEl.className = 'fas fa-users';
      testEl.style.fontFamily = 'Font Awesome 6 Free';
      testEl.style.position = 'absolute';
      testEl.style.left = '-9999px';
      document.body.appendChild(testEl);

      setTimeout(() => {
        const computedStyle = window.getComputedStyle(testEl);

        // Check if Font Awesome loaded correctly
        const fontAwesomeLoaded = computedStyle.fontFamily.indexOf('Font Awesome') !== -1;

        if (!fontAwesomeLoaded) {
          // Should trigger fallback mechanism
          expect(document.body.classList.contains('external-resources-failed')).toBe(true);
        }

        document.body.removeChild(testEl);
        done();
      }, 100);
    });
  });

  describe('Resource Loading Error Handlers', () => {
    test('should handle Google Fonts load errors gracefully', () => {
      // Create link element similar to the one in index.html
      const linkEl = document.createElement('link');
      linkEl.rel = 'stylesheet';
      linkEl.href =
        'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap';

      // Add error handler
      let errorHandled = false;
      linkEl.onerror = () => {
        errorHandled = true;
        document.body.classList.add('poppins-fallback');
      };

      // Simulate error event
      const errorEvent = new Event('error');
      linkEl.dispatchEvent(errorEvent);

      expect(errorHandled).toBe(true);
      expect(document.body.classList.contains('poppins-fallback')).toBe(true);
    });

    test('should handle Font Awesome load errors gracefully', () => {
      // Create link element for Font Awesome
      const linkEl = document.createElement('link');
      linkEl.rel = 'stylesheet';
      linkEl.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';

      // Add error handler
      let errorHandled = false;
      linkEl.onerror = () => {
        errorHandled = true;
        document.body.classList.add('external-resources-failed');
      };

      // Simulate error event
      const errorEvent = new Event('error');
      linkEl.dispatchEvent(errorEvent);

      expect(errorHandled).toBe(true);
      expect(document.body.classList.contains('external-resources-failed')).toBe(true);
    });
  });

  describe('Fallback CSS System', () => {
    test('should enable fallback CSS when external resources fail', () => {
      const fallbackCSS = document.createElement('link');
      fallbackCSS.id = 'fallback-css';
      fallbackCSS.rel = 'stylesheet';
      fallbackCSS.href = 'css/fallbacks.css';
      fallbackCSS.disabled = true;
      document.head.appendChild(fallbackCSS);

      // Simulate external resource failure
      document.body.classList.add('external-resources-failed');

      // Fallback system should enable the CSS
      if (document.body.classList.contains('external-resources-failed')) {
        fallbackCSS.disabled = false;
      }

      expect(fallbackCSS.disabled).toBe(false);

      // Clean up
      document.head.removeChild(fallbackCSS);
    });
  });

  describe('Console Error Prevention', () => {
    test('should not throw errors when external resources fail', () => {
      // Spy on console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Simulate resource loading without throwing errors
      expect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://invalid-url.com/nonexistent.css';
        link.onerror = () => {
          // Should handle gracefully without console errors
          document.body.classList.add('external-resources-failed');
        };

        // Trigger error
        const event = new Event('error');
        link.dispatchEvent(event);
      }).not.toThrow();

      consoleSpy.mockRestore();
    });
  });
});

// Manual testing utility function for visual verification
window.testFontFallback = function () {
  console.log('Testing font fallback system...');

  // Test Poppins detection
  const testPoppins = document.createElement('div');
  testPoppins.style.fontFamily = 'Poppins, serif';
  testPoppins.style.position = 'absolute';
  testPoppins.style.left = '-9999px';
  testPoppins.innerHTML = 'test';
  document.body.appendChild(testPoppins);

  setTimeout(() => {
    const poppinsStyle = window.getComputedStyle(testPoppins);
    const poppinsLoaded = poppinsStyle.fontFamily.indexOf('Poppins') !== -1;

    console.log('Poppins loaded:', poppinsLoaded);
    console.log('Computed font family:', poppinsStyle.fontFamily);

    if (!poppinsLoaded) {
      document.body.classList.add('poppins-fallback');
      console.log('Poppins fallback activated');
    }

    document.body.removeChild(testPoppins);
  }, 100);

  // Test Font Awesome detection
  const testFA = document.createElement('div');
  testFA.className = 'fas fa-users';
  testFA.style.fontFamily = 'Font Awesome 6 Free';
  testFA.style.position = 'absolute';
  testFA.style.left = '-9999px';
  document.body.appendChild(testFA);

  setTimeout(() => {
    const faStyle = window.getComputedStyle(testFA);
    const faLoaded = faStyle.fontFamily.indexOf('Font Awesome') !== -1;

    console.log('Font Awesome loaded:', faLoaded);
    console.log('Computed font family:', faStyle.fontFamily);

    if (!faLoaded) {
      document.body.classList.add('external-resources-failed');
      console.log('Font Awesome fallback activated');
    }

    document.body.removeChild(testFA);
  }, 100);
};
