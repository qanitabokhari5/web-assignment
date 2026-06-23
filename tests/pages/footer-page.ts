// ─────────────────────────────────────────────────────────────────────────────
// FILE: tests/pages/footer-page.ts
// PURPOSE: Page Object class for the FOOTER section at the bottom of the Sauce
//          Demo products page.  The footer contains social media icons that
//          link to Twitter, Facebook, and LinkedIn.
//
//          This class handles:
//            • Scrolling to the bottom of the page to reveal the footer.
//            • Clicking the Facebook icon and verifying the URL of the new tab
//              that opens confirms we reached facebook.com.
// ─────────────────────────────────────────────────────────────────────────────

// Import our custom 'expect' from the fixtures file so that assertion failures
// are correctly attributed in the Playwright HTML test report.
import { expect } from '@fixturesetup';

// getLocator — utility wrapper for Playwright's page.locator().
//   Returns a Locator object that can be used to find and interact with elements.
//
// getPage — returns the current Playwright Page object (the browser tab) that
//   was stored by setPage() in page-setup.ts. 
import { getLocator, getPage } from 'vasu-playwright-utils';

// Import the CSS selectors for footer elements.
import { FOOTER_LOCATORS } from '../locators/menu-locators';

// ─────────────────────────────────────────────────────────────────────────────
// CLASS: FooterPage
// ─────────────────────────────────────────────────────────────────────────────
export class FooterPage {

  // ── scrollToFooter ─────────────────────────────────────────────────────────
  // Scrolls the page all the way to the bottom so the footer becomes visible.
  //
  // Why we need this:
  // Playwright can click elements that are off-screen, but social media link
  // icons are sometimes inside containers that are lazily rendered or have
  // scroll-dependent animations. Scrolling to the bottom first ensures the
  // footer is fully in view and any lazy-loaded content has rendered.
  public async scrollToFooter(): Promise<void> {
    // page.evaluate() runs a JavaScript snippet INSIDE the browser tab (not in
    // Node.js). This is how we call browser-native APIs that Playwright doesn't
    // expose directly.
    //
    // window.scrollTo(x, y) scrolls the window to a given X/Y position.
    //   x = 0 — don't move horizontally
    //   y = document.body.scrollHeight — scroll to the very bottom of the page
    //     (scrollHeight is the full height of the page content including parts
    //      not currently visible in the viewport).
    await getPage().evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  // ── clickFacebookAndVerifyUrl ──────────────────────────────────────────────
  // Clicks the Facebook social icon in the footer and verifies that the link
  // opens facebook.com in a NEW browser tab.
  //
  // Why a new tab matters:
  // Most "share on social media" and external links open target="_blank", which
  // creates a new browser tab instead of navigating the current one. Playwright
  // handles this through the 'page' event on the browser context. We must
  // LISTEN for the new tab event BEFORE clicking, otherwise the event fires
  // before we attach the listener and we miss it.
  public async clickFacebookAndVerifyUrl(): Promise<void> {
    // Get the current page (browser tab) so we can access its browser context.
    const page = getPage();

    // Use Promise.all to run TWO things simultaneously:
    //   1. Start listening for a new browser tab to open (waitForEvent('page')).
    //   2. Click the Facebook link which will CAUSE a new tab to open.
    //
    // If we did these sequentially (click first, then wait) we might miss the
    // 'page' event because it fires immediately when the tab opens. Running them
    // together guarantees the listener is already active when the click happens.
    //
    // Destructuring: the array returned by Promise.all has two values, but we
    // only care about the first one (the new Page object) — the click result is
    // discarded. We name the new tab 'newPage' for clarity.
    const [newPage] = await Promise.all([
      // Listen on the browser context for the next new tab ('page' event) and
      // return a Promise that resolves with the new Page object when it fires.
      page.context().waitForEvent('page'),

      // Click the Facebook icon/link. Because this is a target="_blank" link,
      // clicking it opens a new tab instead of navigating the current tab.
      getLocator(FOOTER_LOCATORS.facebookLink).click(),
    ]);

    // Wait for the new tab to finish its initial HTML load ('domcontentloaded').
    // This is faster than waiting for 'load' (which also waits for images/scripts)
    // and sufficient to read the URL, which is what we care about.
    await newPage.waitForLoadState('domcontentloaded');

    // Assert that the new tab's URL contains 'facebook.com'.
    // newPage.url() returns the current full URL string of the new tab.
    // .toContain('facebook.com') checks that the string includes 'facebook.com'
    // anywhere — this handles variations like https://www.facebook.com/saucelabs.
    expect(newPage.url()).toContain('facebook.com');
  }
}
