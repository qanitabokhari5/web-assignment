// This file stores all test data used across the test suite.
// Credentials are read from the .env file so they are never hardcoded in source code.

// A User must always have a username and a password — TypeScript will warn you if either is missing
export interface User {
  username: string;
  password: string;
}

// Valid Sauce Demo login — read from .env so credentials are not exposed in code
export const standardUserCredentials: User = {
  username: process.env.SAUCE_USERNAME ?? 'standard_user',
  password: process.env.SAUCE_PASSWORD ?? 'secret_sauce',
};

// Invalid Sauce Demo login — used to test that the login error message appears
export const invalidUserCredentials: User = {
  username: process.env.SAUCE_INVALID_USERNAME ?? 'invalid_user',
  password: process.env.SAUCE_INVALID_PASSWORD ?? 'invalid_password',
};

// Data used to fill the Contact Sales form on the SauceLabs About page
export const contactSalesFormData = {
  email: 'testuser@example.com',
  company: 'Test Company',
  comment: 'Testing comment',
};

// Automation Test Store settings — URL and credentials read from .env
export const automationStoreData = {
  url: process.env.AUTOMATION_STORE_URL ?? 'https://automationteststore.com/',
  username: process.env.AUTOMATION_STORE_USERNAME ?? 'Qanita12',
  password: process.env.AUTOMATION_STORE_PASSWORD ?? 'Qanita123',
  // The display name shown in the welcome message after login (e.g. "Welcome back Qanita")
  usernameDisplay: process.env.AUTOMATION_STORE_USERNAME_DISPLAY ?? 'Qanita',
  // Cart total limit — items are removed from the cart if the total goes above this amount
  cartTotalLimit: 200,
  // Target number of items the cart should have after the top-up logic runs
  targetCartItemCount: 15,
};
