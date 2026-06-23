// This is the Page Object for the full Cart page.
// It verifies that the right products, quantities, and prices appear in the cart.

// Import expect for making assertions
import { expect } from '@fixturesetup';

// getLocator = find elements on the page using a CSS selector
import { getLocator } from 'vasu-playwright-utils';

// CSS selectors for elements on the cart page
import { CART_PAGE_LOCATORS } from '../locators/cart-locators';

export class CartPage {

  // Checks that the cart contains exactly [count] items
  async verifyItemCount(count: number): Promise<void> {
    await expect(getLocator(CART_PAGE_LOCATORS.cartItems)).toHaveCount(count);
  }

  // Checks that every item in the cart shows the expected quantity text (e.g. "1")
  async verifyItemQuantities(quantity: string): Promise<void> {
    // Get all quantity cells as an array and check each one
    const quantities = await getLocator(CART_PAGE_LOCATORS.itemQuantity).all();
    for (const locator of quantities) {
      await expect(locator).toHaveText(quantity);
    }
  }

  // Checks that the prices in the cart match the expected prices
  // Both lists are sorted before comparing so order doesn't matter
  async verifyItemPrices(prices: number[]): Promise<void> {
    // Read all price texts from the cart (e.g. ["$9.99", "$14.99"])
    const cartPrices = await getLocator(CART_PAGE_LOCATORS.itemPrice).allTextContents();

    // Remove the "$", convert to numbers, and sort from low to high
    const actualPrices = cartPrices.map(p => parseFloat(p.replace('$', ''))).sort((a, b) => a - b);

    // Sort the expected prices the same way so the comparison is fair
    const expectedPrices = [...prices].sort((a, b) => a - b);

    // Both arrays must contain the same values
    expect(actualPrices).toEqual(expectedPrices);
  }

  // Runs all three checks at once: item count, quantities, and prices
  async verifyCartDetails(itemCount: number, prices: number[]): Promise<void> {
    // Check the number of items in the cart
    await this.verifyItemCount(itemCount);

    // Check that each item shows quantity "1" (Sauce Demo only allows 1 per item)
    await this.verifyItemQuantities('1');

    // Check that the prices match what was seen on the products page
    await this.verifyItemPrices(prices);
  }
}
