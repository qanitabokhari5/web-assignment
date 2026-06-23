import { After, Before, Given, Then, When, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, firefox, webkit, Browser, BrowserContext, Page } from 'playwright';
import { expect } from '@playwright/test';
import { automationStoreData } from '@testdata/sauce-demo-test-data';

// Each step gets up to 5 minutes — the site is slow and has many cart operations
setDefaultTimeout(300 * 1000);

// Timeout used on every individual action — 30s to handle the slow external site
const T = 30000;

// World holds shared state across steps in the same scenario
type World = {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  cartTotalBeforeTopUp?: number; // total recorded before non-sale top-up
  addedItemsAmount?: number;     // combined price of items added during top-up
};

// Returns the correct Playwright browser launcher from the BROWSER env variable
function normalizeBrowser(name: string) {
  const n = name.toLowerCase();
  if (n === 'chrome') return chromium;
  if (n === 'firefox') return firefox;
  if (n === 'webkit') return webkit;
  return chromium;
}

// Strips currency symbols and converts a price string to a number
// Handles "$12.50", "738.03€", "12,50", "-738.03€ " etc.
function parseMoney(text: string): number {
  return Number.parseFloat(text.replace(/[^\d,.-]/g, '').replace(',', '.'));
}

// Scrolls to top, hovers the menu, then clicks the subcategory link
async function openSubcategory(page: Page, menuName: string, categoryName: string, exact = false) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('#categorymenu').getByRole('link', { name: menuName }).hover({ timeout: T });
  // Wait for the subcategory dropdown to appear before clicking
  await page.locator('#categorymenu .subcategories').waitFor({ state: 'visible', timeout: T });
  await page.locator('#categorymenu .subcategories').getByRole('link', { name: categoryName, exact }).click({ timeout: T });
  // Wait for the category page to load
  await page.waitForLoadState('domcontentloaded', { timeout: T });
}

// Adds every sale-tagged product on the current page to the cart one by one
// Re-queries after each click to avoid stale element errors
async function addAllSaleItemsToCart(page: Page) {
  // Count sale items first
  const saleCount = await page.locator('.thumbnails .col-md-3').filter({ has: page.locator('span.sale') }).count();

  for (let i = 0; i < saleCount; i += 1) {
    // Re-query each time because the DOM may update after each add-to-cart click
    const saleProducts = page.locator('.thumbnails .col-md-3').filter({ has: page.locator('span.sale') });
    const btn = saleProducts.nth(i).locator('a.productcart');
    // Only click if the button exists (some sale items may not have an add-to-cart button)
    if (await btn.count()) {
      await btn.click({ timeout: T });
      // Wait briefly for the cart update before moving to the next item
      await page.waitForTimeout(500);
    }
  }
}

// Adds non-sale, in-stock, orderable products up to remainingItems count
// Returns the number of items added and their combined price
async function addNonSaleItemsToCart(page: Page, remainingItems: number) {
  let addedItemsAmount = 0;
  let addedItemsCount = 0;
  const products = page.locator('.thumbnails .col-md-3');
  const total = await products.count();

  for (let i = 0; i < total && addedItemsCount < remainingItems; i += 1) {
    const product = products.nth(i);
    // Skip sale items — the top-up should only use non-sale items
    if (await product.locator('span.sale').count()) continue;
    // Skip out-of-stock items
    if (await product.locator('span.nostock').count()) continue;
    // Skip call-to-order items (no add-to-cart button)
    if (await product.locator('a.call_to_order').count()) continue;
    // Skip if there is no add-to-cart button
    if (!(await product.locator('a.productcart').count())) continue;

    await product.scrollIntoViewIfNeeded();
    const priceText = await product.locator('.price .oneprice').first().innerText({ timeout: T });
    addedItemsAmount += parseMoney(priceText);
    await product.locator('a.productcart').click({ timeout: T });
    await page.waitForTimeout(500);
    addedItemsCount += 1;
  }

  return { addedItemsAmount, addedItemsCount };
}

// Clicks the Cart link and waits for the Shopping Cart page to be fully visible
async function goToCartPage(page: Page) {
  await page.locator('#main_menu_top').getByRole('link', { name: 'Cart' }).click({ timeout: T });
  await expect(page).toHaveURL(/rt=checkout\/cart/, { timeout: T });
  await expect(page.getByText('Shopping Cart')).toBeVisible({ timeout: T });
  // Wait for the cart table to fully render before reading totals
  await page.waitForLoadState('networkidle', { timeout: T });
}

// Returns all product row locators in the cart table (one row per product)
function getCartItemRows(page: Page) {
  return page
    .locator('.cart-info table tbody tr')
    .filter({ has: page.locator('td.align_left a[href*="product/product"]') });
}

// Reads the cart total from the page as a number
// Tries the "Total:" summary row in the cart table first, then the header badge
async function getCartTotal(page: Page): Promise<number> {
  // Primary: the Total row at the bottom of the cart table
  const summaryRows = await page.locator('.cart-info tr:has-text("Total:") td').allInnerTexts();
  for (const text of summaryRows) {
    const parsed = parseMoney(text);
    if (!Number.isNaN(parsed) && parsed > 0) return parsed;
  }
  // Fallback: the header badge (e.g. "18 ITEMS -738.03€")
  const badge = page.locator('ul.topcart .cart_total').first();
  if (await badge.count()) {
    const parsed = Math.abs(parseMoney((await badge.innerText({ timeout: T })).trim()));
    if (!Number.isNaN(parsed) && parsed > 0) return parsed;
  }
  throw new Error('Unable to parse cart total from the page.');
}

// Changes the store currency and waits for the page to reload
async function setCurrency(page: Page, currencyName: string) {
  await page.locator('ul.nav.language').scrollIntoViewIfNeeded();
  await page.locator('ul.nav.language li.dropdown').hover({ timeout: T });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: T }),
    page.locator('ul.nav.language').getByRole('link', { name: currencyName }).click({ timeout: T }),
  ]);
  // Wait for the cart totals to update after currency change
  await page.waitForLoadState('networkidle', { timeout: T });
}

// Removes the last cart item repeatedly until the total is at or below the limit
async function trimCartToLimit(page: Page, limit: number) {
  let total = await getCartTotal(page);
  while (total > limit) {
    const removeBtn = getCartItemRows(page).last().locator('a.btn.btn-sm.btn-default');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: T }),
      removeBtn.click({ timeout: T }),
    ]);
    await page.waitForLoadState('networkidle', { timeout: T });
    total = await getCartTotal(page);
  }
}

// ── Cucumber Hooks ─────────────────────────────────────────────────────────────

Before(async function (this: World) {
  const launcher = normalizeBrowser(process.env.BROWSER || 'chromium');
  this.browser = await launcher.launch({ headless: true });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  this.cartTotalBeforeTopUp = 0;
  this.addedItemsAmount = 0;
});

After(async function (this: World) {
  await this.context?.close();
  await this.browser?.close();
});

// ── Step Definitions ───────────────────────────────────────────────────────────

// Opens the Automation Test Store home page
Given('I open the automation test store', async function (this: World) {
  await this.page!.goto(automationStoreData.url, { waitUntil: 'domcontentloaded', timeout: T });
});

// Logs in — credentials come from .env via automationStoreData (feature file values are ignored)
Given('I log in with username {string} and password {string}', async function (this: World, _u: string, _p: string) {
  const page = this.page!;
  await page.getByRole('link', { name: 'Login or register' }).click({ timeout: T });
  await expect(page.getByRole('heading', { name: 'Returning Customer', exact: true })).toBeVisible({ timeout: T });
  await page.locator('#loginFrm_loginname').fill(automationStoreData.username, { timeout: T });
  await page.locator('#loginFrm_password').fill(automationStoreData.password, { timeout: T });
  await page.getByRole('button', { name: ' Login' }).click({ timeout: T });
  // Confirm login was successful
  await expect(page.getByRole('link', { name: `Welcome back ${automationStoreData.usernameDisplay}` })).toBeVisible({ timeout: T });
});

// Changes the currency (e.g. "€ Euro")
Given('I set the currency to {string}', async function (this: World, currencyName: string) {
  await setCurrency(this.page!, currencyName);
});

// Adds every sale item from all Men subcategories to the cart
When('I add all sale items from Men categories', async function (this: World) {
  await openSubcategory(this.page!, 'Men', 'Body & Shower');
  await addAllSaleItemsToCart(this.page!);
  await openSubcategory(this.page!, 'Men', 'Fragrance Sets');
  await addAllSaleItemsToCart(this.page!);
  await openSubcategory(this.page!, 'Men', 'Pre-Shave & Shaving');
  await addAllSaleItemsToCart(this.page!);
  await openSubcategory(this.page!, 'Men', 'Skincare', true);
  await addAllSaleItemsToCart(this.page!);
});

// Adds every sale item from all Makeup subcategories to the cart
When('I add all sale items from Makeup categories', async function (this: World) {
  await openSubcategory(this.page!, 'Makeup', 'Cheeks');
  await addAllSaleItemsToCart(this.page!);
  await openSubcategory(this.page!, 'Makeup', 'Eyes');
  await addAllSaleItemsToCart(this.page!);
  await openSubcategory(this.page!, 'Makeup', 'Face', true);
  await addAllSaleItemsToCart(this.page!);
  await openSubcategory(this.page!, 'Makeup', 'Lips');
  await addAllSaleItemsToCart(this.page!);
  await openSubcategory(this.page!, 'Makeup', 'Nails');
  await addAllSaleItemsToCart(this.page!);
  await openSubcategory(this.page!, 'Makeup', 'Value Sets');
  await addAllSaleItemsToCart(this.page!);
});

// Navigates to the cart page
When('I open the cart page', async function (this: World) {
  await goToCartPage(this.page!);
});

// Assert: cart has at least 1 item AND total > 0
Then('the cart should contain items and a total greater than 0', async function (this: World) {
  const count = await getCartItemRows(this.page!).count();
  const total = await getCartTotal(this.page!);
  expect(count).toBeGreaterThan(0);
  expect(total).toBeGreaterThan(0);
});

// If Euro total > 200 remove items one by one until total <= 200
// Assert: total <= 200 and cart still has items
When('I trim the cart total to at most {int}', async function (this: World, limit: number) {
  await trimCartToLimit(this.page!, limit);
  expect(await getCartTotal(this.page!)).toBeLessThanOrEqual(limit);
  expect(await getCartItemRows(this.page!).count()).toBeGreaterThan(0);
});

// Switch currency then if total > 200 remove items until total <= 200
// Assert: total <= 200 and cart still has items
When('I set the currency to {string} and trim the cart total to at most {int}', async function (this: World, currencyName: string, limit: number) {
  await setCurrency(this.page!, currencyName);
  await trimCartToLimit(this.page!, limit);
  expect(await getCartTotal(this.page!)).toBeLessThanOrEqual(limit);
  expect(await getCartItemRows(this.page!).count()).toBeGreaterThan(0);
});

// Assert: cart still has at least 1 item after all three currency trims
Then('the cart should still contain items', async function (this: World) {
  expect(await getCartItemRows(this.page!).count()).toBeGreaterThan(0);
});

// If item count < 15, go to Makeup non-sale sections and add only the missing items
// Records total and added amount so the final assertion can check the sum
When('I add non-sale Makeup items until there are {int} items if needed', async function (this: World, targetCount: number) {
  await goToCartPage(this.page!);

  const currentCount = await getCartItemRows(this.page!).count();

  // Record the cart state before adding any top-up items
  this.cartTotalBeforeTopUp = await getCartTotal(this.page!);
  this.addedItemsAmount = 0;

  // Nothing to do if we already have enough items
  if (currentCount >= targetCount) return;

  let remainingItems = targetCount - currentCount;

  const makeupCategories = [
    { name: 'Cheeks', exact: false },
    { name: 'Eyes', exact: false },
    { name: 'Face', exact: true },
    { name: 'Lips', exact: false },
    { name: 'Nails', exact: false },
    { name: 'Value Sets', exact: false },
  ];

  for (const category of makeupCategories) {
    if (remainingItems === 0) break;
    await openSubcategory(this.page!, 'Makeup', category.name, category.exact);
    const result = await addNonSaleItemsToCart(this.page!, remainingItems);
    remainingItems -= result.addedItemsCount;
    // Keep a running total of the price of items added during top-up
    this.addedItemsAmount! += result.addedItemsAmount;
  }

  await goToCartPage(this.page!);
});

// Assert: cart has exactly 15 items AND final total = total before top-up + price of added items
Then('the cart should contain {int} items', async function (this: World, expectedCount: number) {
  const finalCount = await getCartItemRows(this.page!).count();
  const finalTotal = await getCartTotal(this.page!);

  // Cart must have exactly the target number of items
  expect(finalCount).toBe(expectedCount);

  // Final total must equal the previous total plus the price of the newly added items
  // toBeCloseTo with 2 decimal places handles minor floating point differences
  expect(finalTotal).toBeCloseTo(this.cartTotalBeforeTopUp! + this.addedItemsAmount!, 2);
});
