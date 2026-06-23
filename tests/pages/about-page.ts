// This is the Page Object for the SauceLabs About page — the page you land on
// after clicking "About" in the Sauce Demo side menu.
// It also covers the Contact Sales form reached from that page.

// clickAndNavigate = click a link and wait for the new page to load
// getPage = get the current browser tab so we can call browser actions directly
import { clickAndNavigate, getPage } from 'vasu-playwright-utils';

// Selectors and label names for elements on this page
import { ABOUT_PAGE_LOCATORS, CONTACT_SALES_FORM_LOCATORS } from '../locators/menu-locators';

// Form field values stored in test data — no hardcoded strings in page objects
import { contactSalesFormData } from '@testdata/sauce-demo-test-data';

export class AboutPage {

  // Clicks the "Contact Sales" button on the About page
  public async clickContactSales(): Promise<void> {
    await clickAndNavigate(ABOUT_PAGE_LOCATORS.contactSalesLink);
  }

  // Waits for the Contact Sales form to fully appear on screen before trying to fill it.
  // The form is built with JavaScript so it takes a moment to appear after the page loads.
  public async waitForContactFormReady(): Promise<void> {
    // Wait until all network requests have finished (page is fully loaded)
    await getPage().waitForLoadState('networkidle');

    // Then wait until the email input field is actually visible before continuing
    await getPage()
      .getByRole('textbox', { name: CONTACT_SALES_FORM_LOCATORS.emailInput })
      .waitFor({ state: 'visible' });
  }

  // Fills in the Contact Sales form fields without submitting it
  public async fillContactSalesForm(): Promise<void> {
    // Make sure the form is loaded and ready first
    await this.waitForContactFormReady();

    // Type the test email from test data into the Business Email field
    await getPage()
      .getByRole('textbox', { name: CONTACT_SALES_FORM_LOCATORS.emailInput })
      .fill(contactSalesFormData.email);

    // Type the test company name from test data into the Company field
    await getPage()
      .getByRole('textbox', { name: CONTACT_SALES_FORM_LOCATORS.companyInput })
      .fill(contactSalesFormData.company);

    // Select an option from the Interest dropdown
    await getPage()
      .getByLabel(CONTACT_SALES_FORM_LOCATORS.interestLabel)
      .selectOption(CONTACT_SALES_FORM_LOCATORS.interestOption);

    // Type the test comment from test data into the Comments field
    await getPage()
      .getByRole('textbox', { name: CONTACT_SALES_FORM_LOCATORS.commentsInput })
      .fill(contactSalesFormData.comment);
  }

  // Goes back to the previous page (same as clicking the browser's Back button)
  public async goBack(): Promise<void> {
    await getPage().goBack();
  }
}
