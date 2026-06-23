// This is the Page Object for the Products page — the page shown after login.
// It handles sorting products, reading prices/names, and adding items to the cart.

// expectElementToBeVisible = wait until an element is shown on screen
// getLocator = find elements on the page using a CSS selector
import { expectElementToBeVisible, getLocator } from 'vasu-playwright-utils';

// Import expect for making assertions (checking things are correct)
import { expect } from '@fixturesetup';

// CSS selectors for elements on this page
import { PRODUCTS_PAGE_LOCATORS } from '../locators/products-locators';

export class ProductsPage {

  // Checks that the products page is visible (confirms we landed on the right page after login)
  public async verifyProductsPageIsDisplayed(): Promise<void> {
    await expectElementToBeVisible(PRODUCTS_PAGE_LOCATORS.inventoryContainer, 'Products page should be displayed');
  }

  // Clicks "Add to cart" for the product at a given position in the list
  // index 0 = first product, index 1 = second product, and so on
  public async addProductToCartByIndex(index: number): Promise<void> {
    await getLocator(PRODUCTS_PAGE_LOCATORS.productItems) // Find all product cards
      .nth(index)                                          // Pick the one at position [index]
      .locator(PRODUCTS_PAGE_LOCATORS.addToCartButton)    // Find the "Add to cart" button inside it
      .click();                                            // Click it
  }

  // Changes the sort order of products using the dropdown
  // 'lohi' = price low to high, 'hilo' = price high to low, 'az' = A-Z, 'za' = Z-A
  public async sortProductsBy(order: 'lohi' | 'hilo' | 'az' | 'za'): Promise<void> {
    await getLocator(PRODUCTS_PAGE_LOCATORS.sortDropdown).selectOption(order);
  }

  // Reads the price of every product on the page and returns them as a list of numbers
  // e.g. ["$9.99", "$14.99"] becomes [9.99, 14.99]
  public async getAllItemPrices(): Promise<number[]> {
    const prices = await getLocator(PRODUCTS_PAGE_LOCATORS.itemPrice).allTextContents();
    // Remove the "$" sign from each price text and convert the string to a number
    return prices.map(p => parseFloat(p.replace('$', '')));
  }

  // Reads the name of every product on the page and returns them as a list of strings
  getAllItemNames(): Promise<string[]> {
    return getLocator(PRODUCTS_PAGE_LOCATORS.itemName).allTextContents();
  }

  // Sorts products cheapest first, adds the first [count] products to the cart,
  // and returns their prices so the test can verify them later in the cart
  public async addLowestPricedItemsToCart(count: number): Promise<number[]> {
    // Sort products so the cheapest ones appear first
    await this.sortProductsBy('lohi');
    const prices = await this.getAllItemPrices();
    // Grab only the first [count] prices (the cheapest ones)
    const lowestPrices = prices.slice(0, count);
    // Add each of those products to the cart
    for (let i = 0; i < count; i++) {
      await this.addProductToCartByIndex(i);
    }
    return lowestPrices;
  }

  // Returns the prices of the first [count] products currently shown on the page
  async getPricesOnProductPage(count: number) {
    const prices = await this.getAllItemPrices();
    return prices.slice(0, count);
  }

  // Returns the names of the first [count] products currently shown on the page
  async getNamesOnProductPage(count: number) {
    const names = await this.getAllItemNames();
    return names.slice(0, count);
  }

  // Checks that all products on the page are sorted cheapest to most expensive
  async verifyItemsSortedByPriceLowToHigh() {
    // Read the prices in the order they currently appear
    const actualPrices = await this.getAllItemPrices();
    // Create a sorted copy (lowest to highest) to compare against
    // [...actualPrices] makes a copy so we don't change the original array
    const expectedSortedPrices = [...actualPrices].sort((a, b) => a - b);
    // If the page is sorted correctly, both arrays should be identical
    expect(actualPrices).toEqual(expectedSortedPrices);
  }
}
