// This is the Page Object for the Login page.
// It contains all the actions a user can do on the login page.
// Tests call these methods instead of interacting with the browser directly.

// Helper functions: fill = type into a field, gotoURL = open a URL, clickAndNavigate = click and wait for next page
import { clickAndNavigate, fill, gotoURL } from 'vasu-playwright-utils';

// Default credentials to use when none are provided
import { standardUserCredentials } from '@testdata/sauce-demo-test-data';

// Checks that an element exists in the page HTML (used to confirm login worked)
import { expectElementToBeAttached } from 'vasu-playwright-utils';

// The CSS selectors for elements on this page
import { LOGIN_PAGE_LOCATORS } from '../locators/login-locators';

export class LoginPage {

  // Opens the Sauce Demo login page — URL is read from .env (URL variable)
  public async navigateToSauceDemoLoginPage(): Promise<void> {
    await gotoURL(process.env.URL ?? 'https://www.saucedemo.com');
  }

  // Types the username and password, clicks Login, then checks the login succeeded
  // If no credentials are passed in, it uses standard_user by default
  public async loginWithValidCredentials(validCredentials = standardUserCredentials): Promise<void> {
    // Type the username into the username box
    await fill(LOGIN_PAGE_LOCATORS.usernameInput, validCredentials.username);

    // Type the password into the password box
    await fill(LOGIN_PAGE_LOCATORS.passwordInput, validCredentials.password);

    // Click the Login button and wait for the next page to load
    await clickAndNavigate(LOGIN_PAGE_LOCATORS.loginButton);

    // Confirm the login was successful
    await this.verifyUserIsLoggedin();
  }

  // Checks that the logout link is present on the page — it only appears when logged in
  public async verifyUserIsLoggedin(): Promise<void> {
    await expectElementToBeAttached(LOGIN_PAGE_LOCATORS.logoutLink, 'User should be Logged in successfully');
  }
}
