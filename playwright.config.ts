// This is the main settings file for Playwright. It controls how tests run.

// Brings in the function that helps us write the config with proper hints in the editor
import { defineConfig, devices } from '@playwright/test';

// Used to read values from the .env file (like website URL or browser name)
import dotenv from 'dotenv';

// Helps build file paths that work on Windows, Mac, and Linux
import path from 'path';

// These are shared time limits imported from a helper library
// ACTION_TIMEOUT     = max wait time for a single step like a click
// EXPECT_TIMEOUT     = max wait time for a check (e.g. is this button visible?)
// NAVIGATION_TIMEOUT = max wait time for a page to fully load
// TEST_TIMEOUT       = max time one full test is allowed to take
import { ACTION_TIMEOUT, EXPECT_TIMEOUT, NAVIGATION_TIMEOUT, TEST_TIMEOUT } from 'vasu-playwright-utils';

// Read the .env file and make its values available via process.env
dotenv.config({ path: '.env' });

// The website URL to test. Reads from .env if set, otherwise defaults to Sauce Demo
export const BASE_URL = process.env.URL || 'https://www.saucedemo.com';

// Folder path where saved login sessions (cookies) are stored so tests don't re-login every time
export const STORAGE_STATE_PATH = path.join(__dirname, 'playwright/.auth');

// Export the full Playwright configuration
export default defineConfig({
  // Folder where Playwright looks for test files
  testDir: './tests',

  // true = all tests across all projects run in parallel at the same time
  fullyParallel: true,

  // In CI (like GitHub Actions), block any test marked with .only so no tests are skipped by accident
  forbidOnly: !!process.env.CI,

  // How many times to retry a failing test. 2 retries on CI, none locally
  retries: process.env.CI ? 2 : 0,

  // Number of parallel workers — one per browser project so all 3 browsers run at the same time
  workers: 3,

  // html = saves a nice test report in the playwright-report folder (won't auto-open)
  // dot  = shows a small dot in the terminal per test (clean output)
  reporter: [['html', { open: 'never' }], ['dot']],

  // Max time (in ms) one test can run before it's killed as timed-out
  timeout: TEST_TIMEOUT,

  expect: {
    // Max time to wait for an assertion (like "is this element visible?") to pass
    timeout: EXPECT_TIMEOUT,
  },

  // These settings apply to every test by default
  use: {
    // Run browser without showing a window (faster, works on CI servers)
    headless: true,

    // Don't fail the test if the website has an SSL/HTTPS certificate issue
    ignoreHTTPSErrors: true,

    // Allow the browser to download files without asking
    acceptDownloads: true,

    // The base website URL — page.goto('/login') becomes saucedemo.com/login
    baseURL: BASE_URL,

    // Save a detailed recording of what happened only when a test fails
    trace: 'retain-on-failure',

    // Take a screenshot only when a test fails, saved in test-results folder
    screenshot: 'only-on-failure',

    // Max time for one action step (click, type, etc.)
    actionTimeout: ACTION_TIMEOUT,

    // Max time for a page to finish loading after navigation
    navigationTimeout: NAVIGATION_TIMEOUT,
  },

  // Three browser projects — each one runs the tests independently at the same time
  projects: [
    {
      // ── Chromium (Google Chrome engine) ───────────────────────────────────
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        viewport: { width: 1600, height: 1000 },
        launchOptions: {
          // Disable web security on Chromium so cross-origin requests work in tests
          args: ['--disable-web-security'],
          headless: true,
          slowMo: 0,
        },
      },
    },
    {
      // ── Firefox (Mozilla Firefox engine) ──────────────────────────────────
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        browserName: 'firefox',
        viewport: { width: 1600, height: 1000 },
        launchOptions: {
          headless: true,
          slowMo: 0,
        },
      },
    },
    {
      // ── WebKit (Safari engine) ────────────────────────────────────────────
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        browserName: 'webkit',
        viewport: { width: 1600, height: 1000 },
        launchOptions: {
          headless: true,
          slowMo: 0,
        },
      },
    },
  ],
});
