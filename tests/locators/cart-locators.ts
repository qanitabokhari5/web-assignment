// This file stores CSS selectors for elements on the full Cart page
// (the page you see after clicking the cart icon).

export const CART_PAGE_LOCATORS = {
  // Each product row in the cart list
  cartItems: '.cart_item',

  // The "Continue Shopping" button — takes you back to the products page
  continueShoppingButton: '#continue-shopping',

  // The "Checkout" button — starts the checkout process
  checkoutButton: '#checkout',

  // The product name shown inside each cart row
  itemName: '.inventory_item_name',

  // The quantity column for each cart item (always "1" on Sauce Demo)
  itemQuantity: '[data-test="item-quantity"]',

  // The price shown for each item in the cart (e.g. "$29.99")
  itemPrice: '.inventory_item_price',
};
