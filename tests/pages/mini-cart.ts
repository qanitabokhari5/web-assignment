// This is the Page Object for the mini cart — the small cart icon and number
// badge in the top-right corner of the page. It handles checking the count
// and clicking the icon to go to the full cart page.

// click = click an element, expectElementToBeVisible = check an element is shown on screen
import { click, expectElementToBeVisible } from 'vasu-playwright-utils';

// CSS selectors for the mini cart elements
import { MINI_CART_LOCATORS } from '../locators/mini-cart-locators';

export class MiniCart {

  // Checks that the cart badge (the number on the cart icon) is visible on screen
  // The badge only appears when at least one item has been added to the cart
  public async verifyMiniCartCount(expectedCount: string): Promise<void> {
    await expectElementToBeVisible(
      MINI_CART_LOCATORS.shoppingCartBadge,
      `Mini cart count should be ${expectedCount}`,
    );
  }

  // Clicks the cart icon to open the full cart page
  public async navigateToMiniCart(): Promise<void> {
    await click(MINI_CART_LOCATORS.shoppingCartLink);
  }
}
