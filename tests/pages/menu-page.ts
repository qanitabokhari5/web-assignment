// This is the Page Object for the hamburger side menu (the ☰ button on the top-left).
// It handles opening the menu and clicking the "About" link inside it.

// click = click an element, clickAndNavigate = click and wait for the new page to load
// expectElementToBeVisible = check that an element is shown on screen
import { click, clickAndNavigate, expectElementToBeVisible } from 'vasu-playwright-utils';

// CSS selectors for the menu elements
import { MENU_LOCATORS } from '../locators/menu-locators';

export class MenuPage {

  // Clicks the ☰ button to open the side menu, then confirms the menu opened
  // by checking that the "About" link inside it is now visible
  public async openMenu(): Promise<void> {
    await click(MENU_LOCATORS.openMenuButton);
    await expectElementToBeVisible(MENU_LOCATORS.aboutLink, 'Menu should be open and About link visible');
  }

  // Clicks the "About" link in the menu — this takes the user to the SauceLabs website
  // clickAndNavigate is used because this opens a completely new page
  public async clickAbout(): Promise<void> {
    await clickAndNavigate(MENU_LOCATORS.aboutLink);
  }
}
