#!/usr/bin/env python3
"""
Screenshot utility for visual regression testing
Takes screenshots at specified breakpoints for all HTML pages
"""

import os
import sys
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import time

# Breakpoints to test
BREAKPOINTS = [
    (360, 800, '360px'),
    (375, 812, '375px'),
    (480, 854, '480px'),
    (768, 1024, '768px'),
    (1024, 768, '1024px'),
    (1200, 800, '1200px'),
    (1440, 900, '1440px'),
]

# Pages to screenshot
PAGES = [
    ('index.html', 'leaderboard'),
    ('winners.html', 'winners'),
]

def take_screenshots(output_dir, base_url='http://localhost:8000'):
    """Take screenshots at all breakpoints for all pages"""

    # Setup Chrome options
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')

    # Initialize driver
    driver = webdriver.Chrome(options=chrome_options)

    try:
        for page, name in PAGES:
            url = f"{base_url}/{page}"
            print(f"\n📸 Capturing {name} at {url}")

            driver.get(url)
            time.sleep(2)  # Wait for page load and JS

            for width, height, label in BREAKPOINTS:
                driver.set_window_size(width, height)
                time.sleep(0.5)  # Wait for responsive changes

                filename = f"{name}_{label}.png"
                filepath = os.path.join(output_dir, filename)

                driver.save_screenshot(filepath)
                print(f"  ✓ {label}: {filename}")

        print(f"\n✅ Screenshots saved to: {output_dir}")

    finally:
        driver.quit()

if __name__ == '__main__':
    script_dir = Path(__file__).parent
    output_dir = script_dir / 'screenshots' / 'baseline'
    output_dir.mkdir(parents=True, exist_ok=True)

    print("Visual Regression Screenshot Tool")
    print("=" * 50)

    # Check if server is running
    import urllib.request
    try:
        urllib.request.urlopen('http://localhost:8000')
        print("✓ Server detected at http://localhost:8000")
    except:
        print("❌ Error: No server found at http://localhost:8000")
        print("   Please run: python3 -m http.server 8000")
        sys.exit(1)

    take_screenshots(str(output_dir))
