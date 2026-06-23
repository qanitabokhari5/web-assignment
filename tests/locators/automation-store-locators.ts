// This file stores all CSS selectors for the Automation Test Store website

export const AUTOMATION_STORE_LOCATORS = {
  // Login page
  loginOrRegisterLink: 'a:has-text("Login or register")',
  loginNameInput: '#loginFrm_loginname',
  loginPasswordInput: '#loginFrm_password',
  loginButton: 'button[name=" Login"]',

  // Welcome link shown after login (e.g. "Welcome back Qanita")
  welcomeLink: (name: string) => `a:has-text("Welcome back ${name}")`,

  // Currency switcher in the top nav
  currencyDropdown: 'ul.nav.language li.dropdown',
  currencyList: 'ul.nav.language',
  usDollarOption: 'a:has-text("$ US Dollar")',

  // Category navigation menu
  categoryMenu: '#categorymenu',
  subcategories: '#categorymenu .subcategories',

  // Product grid on category pages
  productCards: '.thumbnails .col-md-3',
  saleTag: 'span.sale',
  noStockTag: 'span.nostock',
  callToOrderLink: 'a.call_to_order',
  addToCartLink: 'a.productcart',
  productPrice: '.price .oneprice',

  // Top navigation cart link
  cartNavLink: '#main_menu_top',

  // Cart page
  cartTable: '.cart-info table tbody tr',
  cartProductLink: 'td.align_left a[href*="product/product"]',
  cartTotalSummary: '.cart-info tr:has-text("Total:") td',
  cartTotalHeader: 'ul.topcart .cart_total',
  cartTotalCell: 'cell:has-text("Total:")',
  removeItemButton: 'a.btn.btn-sm.btn-default',
};
