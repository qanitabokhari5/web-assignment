// This file does one simple job:
// Before every test runs, it saves the current browser tab into a shared place
// so all the helper functions (click, fill, type etc.) know which tab to work on.

// Playwright's default test runner and the assertion helper
import { test as baseTest, expect } from '@playwright/test';

// This function saves the browser tab so helper functions can find and use it
import { setPage } from 'vasu-playwright-utils';

// We add our own automatic step on top of Playwright's default test runner
export const test = baseTest.extend<{ testHook: void }>({

  // This step runs automatically before every single test — no manual setup needed
  testHook: [
    async ({ page }, use) => {
      // Save the browser tab so every helper function knows which tab to act on
      setPage(page);

      // Now run the actual test
      await use();
    },

    // auto: true = runs for every test automatically without needing to be listed
    { auto: true },
  ],
});

// Make "expect" available for other files to import from here
export { expect };
