// This file stores the CSS selectors for elements on the Login page.
// A CSS selector is like an address that tells Playwright where to find an element on the page.
// Keeping selectors here means if the page changes, you fix it in one place only.

export const LOGIN_PAGE_LOCATORS = {
  // The username text box — #user-name means the element with id="user-name"
  usernameInput: '#user-name',

  // The password text box — #password means the element with id="password"
  passwordInput: '#password',

  // The Login button — #login-button means the element with id="login-button"
  loginButton: '#login-button',

  // The red error message shown when login fails (wrong username or password)
  errorMessage: '[data-test="error"]',

  // The Logout link inside the side menu — only visible when the user is logged in
  // We check for this to confirm a successful login
  logoutLink: '#logout_sidebar_link',
};
