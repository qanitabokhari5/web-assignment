// This file stores CSS selectors for elements on the Products page
// (the page shown after a successful login).

export const PRODUCTS_PAGE_LOCATORS = {
  // The "Products" heading at the top of the page
  header: '.title',

  // The big container that wraps all product cards — we check this to confirm the page loaded
  inventoryContainer: '[data-test="inventory-container"]',

  // Each individual product card on the page (.inventory_item matches all of them)
  productItems: '.inventory_item',

  // The sort dropdown at the top — lets you sort by name or price
  sortDropdown: 'select.product_sort_container',

  // The "Add to cart" button on a product card
  // id^="add-to-cart-" means any button whose id starts with "add-to-cart-"
  addToCartButton: 'button[id^="add-to-cart-"]',

  // The "Remove" button that appears after an item is added to the cart
  removeButton: 'button[id^="remove-"]',

  // The price shown on each product card (e.g. "$9.99")
  itemPrice: '.inventory_item_price',

  // The name shown on each product card (e.g. "Sauce Labs Backpack")
  itemName: '.inventory_item_name',
};
