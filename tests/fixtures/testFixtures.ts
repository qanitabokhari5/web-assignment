// This file sets up all the page objects as "fixtures".
// A fixture is just a page object that Playwright creates automatically and
// hands to a test when the test asks for it by name — no manual setup needed.
//
// Example: a test just says async ({ loginPage, productsPage }) => { ... }
// and Playwright automatically creates and passes both objects in.

// Our custom test runner that already has the browser tab setup included
import { test as baseTest } from '@pagesetup';

// Every page object — each one handles actions for one page or section of the app
import { LoginPage } from '@pages/login-page';                       // Sauce Demo login page
import { ProductsPage } from '@pages/products-page';                 // Products listing page
import { MiniCart } from '@pages/mini-cart';                         // Cart icon and item count badge
import { CartPage } from '@pages/cart-page';                         // Full cart page
import { MenuPage } from '@pages/menu-page';                         // Hamburger side menu
import { AboutPage } from '@pages/about-page';                       // SauceLabs about + contact form
import { FooterPage } from '@pages/footer-page';                     // Footer social media links
import { AutomationStorePage } from '@pages/automation-store-page';  // Automation Test Store

// Tells TypeScript what fixtures exist and what type each one is
// This gives you auto-complete when writing tests
type TestFixtures = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  miniCartPage: MiniCart;
  cartPage: CartPage;
  menuPage: MenuPage;
  aboutPage: AboutPage;
  footerPage: FooterPage;
  automationStorePage: AutomationStorePage;
};

// Register all fixtures — each one creates a fresh page object and gives it to the test
export const test = baseTest.extend<TestFixtures>({

  // Handles login page actions — navigating, filling credentials, verifying login
  loginPage: async ({ page: _page }, use) => {
    await use(new LoginPage());
  },

  // Handles the products page — sorting, reading prices, adding items to cart
  productsPage: async ({ page: _page }, use) => {
    await use(new ProductsPage());
  },

  // Handles the small cart icon in the top-right — checking the item count badge
  miniCartPage: async ({ page: _page }, use) => {
    await use(new MiniCart());
  },

  // Handles the full cart page — verifying items, quantities and prices
  cartPage: async ({ page: _page }, use) => {
    await use(new CartPage());
  },

  // Handles the hamburger side menu — opening it and clicking links inside
  menuPage: async ({ page: _page }, use) => {
    await use(new MenuPage());
  },

  // Handles the SauceLabs about page — clicking Contact Sales and filling the form
  aboutPage: async ({ page: _page }, use) => {
    await use(new AboutPage());
  },

  // Handles the Sauce Demo footer — scrolling to it and clicking social links
  footerPage: async ({ page: _page }, use) => {
    await use(new FooterPage());
  },

  // Handles the Automation Test Store — login, adding items, currency, cart checks
  automationStorePage: async ({ page: _page }, use) => {
    await use(new AutomationStorePage());
  },
});

// Export expect so test files can get both "test" and "expect" from this one file
export const expect = test.expect;
