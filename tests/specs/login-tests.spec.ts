// This file contains tests for the Login feature of the Sauce Demo website.
// The @smoke tag means these are quick important tests — run them with: npm run test:smoke

// Import our custom test which comes with all page objects ready to use
import { test } from '@fixturesetup';

// Allow the tests inside this group to run at the same time (faster)
test.describe.configure({ mode: 'parallel' });

// Group all login tests together under one label
test.describe('Sauce Demo Login Tests @smoke', () => {

  // This runs before every test — opens the login page so each test starts in the right place
  test.beforeEach('Navigating to sauce demo page', async ({ loginPage }) => {
    await loginPage.navigateToSauceDemoLoginPage();
  });

  // Test: Check that logging in with correct credentials shows the products page
  test('Successful login displays Products Page', async ({ loginPage, productsPage }) => {
    // Fill in username and password and click Login
    await loginPage.loginWithValidCredentials();

    // Confirm we landed on the products page after login
    await productsPage.verifyProductsPageIsDisplayed();
  });
});
