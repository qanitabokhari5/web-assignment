// This file stores CSS selectors for the mini cart — the small shopping cart
// icon and number badge in the top-right corner of every page after login.

export const MINI_CART_LOCATORS = {
  // The cart icon you click to go to the full cart page
  shoppingCartLink: '.shopping_cart_link',

  // The small circle badge on the cart icon showing how many items are in the cart (e.g. "2")
  // This badge only appears in the page when at least one item has been added
  shoppingCartBadge: '.shopping_cart_badge',

  // Individual item rows inside the cart (used on the full cart page)
  cartItems: '.cart_item',
};
