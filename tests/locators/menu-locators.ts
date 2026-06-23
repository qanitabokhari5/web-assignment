// This file stores selectors for the hamburger side menu, the SauceLabs About page,
// the Contact Sales form, and the footer social links.

// Selectors for the ☰ hamburger menu on Sauce Demo pages
export const MENU_LOCATORS = {
  // The ☰ button in the top-left corner that opens the side menu
  openMenuButton: '#react-burger-menu-btn',

  // The ✕ button inside the menu that closes it
  closeMenuButton: '#react-burger-cross-btn',

  // All the links listed inside the open menu
  menuItems: '.bm-item',

  // The "About" link inside the menu — clicking it goes to the SauceLabs website
  aboutLink: '#about_sidebar_link',
};

// Selectors for the SauceLabs About page
export const ABOUT_PAGE_LOCATORS = {
  // The "Contact Sales" button on the About page
  // The comma means: try the first selector, or if not found, try the second one
  contactSalesLink: 'a[href*="contact"]:visible, a:has-text("Contact Sales"):visible',
};

// Labels used to find fields on the Contact Sales form
// These are the visible text labels next to each input, not CSS selectors
export const CONTACT_SALES_FORM_LOCATORS = {
  emailInput: '* Business Email:',         // Label for the business email field
  companyInput: '* Company:',              // Label for the company name field
  interestLabel: '*Interest:',             // Label for the interest dropdown
  interestOption: 'Scalable Test Automation', // The option we select in that dropdown
  commentsInput: 'Comments',              // Label for the comments text area
};

// Selectors for the footer at the bottom of Sauce Demo pages
export const FOOTER_LOCATORS = {
  // The Facebook icon link in the footer — opens facebook.com in a new tab
  facebookLink: '.social_facebook a, a[href*="facebook"]',
};
