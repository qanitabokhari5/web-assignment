// This file tests the navigation flow on Sauce Demo — going through the menu,
// visiting the About page, filling a form, going back, and clicking a social media link.

// Import our custom test with all page objects ready to use
import { test } from '@fixturesetup';

// Import login credentials
import { standardUserCredentials } from '@testdata/sauce-demo-test-data';

// Allow tests in this group to run at the same time (faster)
test.describe.configure({ mode: 'parallel' });

test.describe('Sauce Demo Navigation Tests @smoke', () => {

  // This runs before every test — logs in and confirms we're on the products page
  test.beforeEach('Login and navigate to products page', async ({ loginPage, productsPage }) => {
    await loginPage.navigateToSauceDemoLoginPage();
    await loginPage.loginWithValidCredentials(standardUserCredentials);
    await productsPage.verifyProductsPageIsDisplayed();
  });

  // Test: Full navigation flow through menu, about page, contact form, and footer
  test('Open menu, navigate to About, fill Contact Sales form, go back, scroll down, click Facebook and verify URL', async ({
    menuPage,
    aboutPage,
    footerPage,
  }) => {
    // Step 1: Products page confirmed in beforeEach above

    // Step 2: Click the ☰ hamburger button to open the side menu
    await menuPage.openMenu();

    // Step 3: Click "About" in the menu — this opens the SauceLabs website
    await menuPage.clickAbout();

    // Step 4: Click the "Contact Sales" button on the SauceLabs page
    await aboutPage.clickContactSales();

    // Step 5: Fill in the Contact Sales form fields (without submitting)
    await aboutPage.fillContactSalesForm();

    // Step 6: Click the browser Back button to return to the previous page
    await aboutPage.goBack();

    // Step 7: Scroll down to reveal the footer at the bottom of the page
    await footerPage.scrollToFooter();

    // Step 8: Click the Facebook link and confirm it opens facebook.com in a new tab
    await footerPage.clickFacebookAndVerifyUrl();
  });
});
