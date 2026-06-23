// This file contains tests for the Shopping Cart feature of Sauce Demo.
// It tests sorting products, adding items to the cart, and verifying what's in the cart.

// Import our custom test with all page objects ready to use
import { test } from '@fixturesetup';

// Import login credentials so we know which account to use
import { standardUserCredentials } from '@testdata/sauce-demo-test-data';

// Allow tests inside this group to run at the same time (faster)
test.describe.configure({ mode: 'parallel' });

test.describe('Sauce Demo Cart Tests @smoke', () => {

  // This runs before every test — logs in and confirms the products page is visible
  test.beforeEach('Login and navigate to products page', async ({ loginPage, productsPage }) => {
    // Open the login page
    await loginPage.navigateToSauceDemoLoginPage();

    // Log in with the standard user account
    await loginPage.loginWithValidCredentials(standardUserCredentials);

    // Confirm the products page loaded successfully
    await productsPage.verifyProductsPageIsDisplayed();
  });

  // Test: Sort products by price, add the 2 cheapest items, and verify the cart is correct
  test('Sort products, add lowest 2 to cart, and verify cart', async ({
    productsPage,
    miniCartPage,
    cartPage,
  }) => {
    // Sort the product list from cheapest to most expensive
    await productsPage.sortProductsBy('lohi');

    // Confirm the products are actually sorted low to high on screen
    await productsPage.verifyItemsSortedByPriceLowToHigh();

    // Save the prices of the first 2 products (the cheapest ones) to check later in the cart
    const lowestPrices = await productsPage.getPricesOnProductPage(2);

    // Add the cheapest product (position 0) to the cart
    await productsPage.addProductToCartByIndex(0);

    // Add the second cheapest product (position 1) to the cart
    await productsPage.addProductToCartByIndex(1);

    // Check that the cart badge now shows "2"
    await miniCartPage.verifyMiniCartCount('2');

    // Click the cart icon to go to the full cart page
    await miniCartPage.navigateToMiniCart();

    // Check that the cart has 2 items, each with quantity "1", and the prices match
    await cartPage.verifyCartDetails(2, lowestPrices);
  });
});
