// This is the Page Object for the Automation Test Store website.
// All logic that was previously inside the spec file is now here as reusable methods.

import { expect } from '@fixturesetup';
import { getPage } from 'vasu-playwright-utils';
import { AUTOMATION_STORE_LOCATORS } from '../locators/automation-store-locators';
import { automationStoreData } from '@testdata/sauce-demo-test-data';

export class AutomationStorePage {

  // Converts a price string like "$12.50" or "12,50" into a plain number
  private parseMoney(amountText: string): number {
    return Number.parseFloat(amountText.replace(/[^\d,.-]/g, '').replace(',', '.'));
  }

  // Opens the Automation Test Store home page
  public async navigateToStore(): Promise<void> {
    await getPage().goto(automationStoreData.url);
  }

  // Logs in with the credentials stored in test data
  public async login(): Promise<void> {
    await getPage().getByRole('link', { name: 'Login or register' }).click();
    await expect(getPage().getByRole('heading', { name: 'Returning Customer', exact: true })).toBeVisible();
    await getPage().locator(AUTOMATION_STORE_LOCATORS.loginNameInput).fill(automationStoreData.username);
    await getPage().locator(AUTOMATION_STORE_LOCATORS.loginPasswordInput).fill(automationStoreData.password);
    await getPage().getByRole('button', { name: ' Login' }).click();
    // Confirm login succeeded by checking the welcome message
    await expect(getPage().getByRole('link', { name: `Welcome back ${automationStoreData.usernameDisplay}` })).toBeVisible();
  }

  // Changes the store currency to the given currency name (e.g. "€ Euro", "$ US Dollar")
  public async setCurrency(currencyName: string): Promise<void> {
    await getPage().locator(AUTOMATION_STORE_LOCATORS.currencyList).scrollIntoViewIfNeeded();
    await getPage().locator(AUTOMATION_STORE_LOCATORS.currencyDropdown).hover();
    await Promise.all([
      getPage().waitForNavigation({ waitUntil: 'domcontentloaded' }),
      getPage().locator(AUTOMATION_STORE_LOCATORS.currencyList).getByRole('link', { name: currencyName }).click(),
    ]);
  }

  // Switches the currency to Euro
  public async switchToEuro(): Promise<void> {
    await getPage().locator(AUTOMATION_STORE_LOCATORS.currencyList).scrollIntoViewIfNeeded();
    await getPage().locator(AUTOMATION_STORE_LOCATORS.usDollarOption).first().click();
    await getPage().getByRole('link', { name: '€ Euro' }).click();
  }

  // Scrolls to the top then hovers over a menu item and clicks the subcategory
  public async openSubcategory(menuName: string, categoryName: string, exact = false): Promise<void> {
    await getPage().evaluate(() => window.scrollTo(0, 0));
    await getPage().locator(AUTOMATION_STORE_LOCATORS.categoryMenu).getByRole('link', { name: menuName }).hover();
    await getPage().locator(AUTOMATION_STORE_LOCATORS.subcategories).getByRole('link', { name: categoryName, exact }).click();
  }

  // Clicks "Add to cart" for every product on the current page that has a sale tag
  public async addAllSaleItemsToCart(): Promise<void> {
    const products = getPage().locator(AUTOMATION_STORE_LOCATORS.productCards);
    const saleProducts = products.filter({ has: getPage().locator(AUTOMATION_STORE_LOCATORS.saleTag) });
    for (let i = 0; i < await saleProducts.count(); i += 1) {
      await saleProducts.nth(i).locator(AUTOMATION_STORE_LOCATORS.addToCartLink).click();
    }
  }

  // Clicks the Cart link in the top nav and confirms we are on the cart page
  public async goToCartPage(): Promise<void> {
    await getPage().locator(AUTOMATION_STORE_LOCATORS.cartNavLink).getByRole('link', { name: 'Cart' }).click();
    await expect(getPage()).toHaveURL(/rt=checkout\/cart/);
    await expect(getPage().getByText('Shopping Cart')).toBeVisible();
  }

  // Returns all product row locators in the cart table
  public getCartItemRows() {
    return getPage()
      .locator(AUTOMATION_STORE_LOCATORS.cartTable)
      .filter({ has: getPage().locator(AUTOMATION_STORE_LOCATORS.cartProductLink) });
  }

  // Reads the current cart total from the page and returns it as a number
  public async getCartTotal(): Promise<number> {
    const summaryTotal = getPage().locator(AUTOMATION_STORE_LOCATORS.cartTotalSummary).last();
    if (await summaryTotal.count()) {
      return this.parseMoney(await summaryTotal.first().innerText());
    }
    const headerTotal = getPage().locator(AUTOMATION_STORE_LOCATORS.cartTotalHeader).first();
    return this.parseMoney(await headerTotal.innerText());
  }

  // Removes items from the cart one by one until the total is at or below the given limit
  public async trimCartToLimit(limit: number): Promise<void> {
    let total = await this.getCartTotal();
    while (total > limit) {
      const removeButton = this.getCartItemRows().last().locator(AUTOMATION_STORE_LOCATORS.removeItemButton);
      await Promise.all([
        getPage().waitForNavigation({ waitUntil: 'domcontentloaded' }),
        removeButton.click(),
      ]);
      total = await this.getCartTotal();
    }
  }

  // Adds non-sale, in-stock products to the cart up to the given count
  // Returns the total price added and the number of items added
  public async addNonSaleItemsToCart(remainingItems: number): Promise<{ addedItemsAmount: number; addedItemsCount: number }> {
    const products = getPage().locator(AUTOMATION_STORE_LOCATORS.productCards);
    let addedItemsAmount = 0;
    let addedItemsCount = 0;

    for (let i = 0; i < await products.count() && addedItemsCount < remainingItems; i += 1) {
      const product = products.nth(i);
      if (await product.locator(AUTOMATION_STORE_LOCATORS.saleTag).count()) continue;
      if (await product.locator(AUTOMATION_STORE_LOCATORS.noStockTag).count()) continue;
      if (await product.locator(AUTOMATION_STORE_LOCATORS.callToOrderLink).count()) continue;
      if (!(await product.locator(AUTOMATION_STORE_LOCATORS.addToCartLink).count())) continue;

      await product.scrollIntoViewIfNeeded();
      const priceText = await product.locator(AUTOMATION_STORE_LOCATORS.productPrice).first().innerText();
      addedItemsAmount += this.parseMoney(priceText);
      await product.locator(AUTOMATION_STORE_LOCATORS.addToCartLink).click();
      addedItemsCount += 1;
    }

    return { addedItemsAmount, addedItemsCount };
  }

  // Adds any in-stock, orderable products to the cart up to the given count (sale or not)
  // Used as a fallback when non-sale items are not enough to reach the target count
  public async addAnyAvailableItemsToCart(remainingItems: number): Promise<{ addedItemsAmount: number; addedItemsCount: number }> {
    const products = getPage().locator(AUTOMATION_STORE_LOCATORS.productCards);
    let addedItemsAmount = 0;
    let addedItemsCount = 0;

    for (let i = 0; i < await products.count() && addedItemsCount < remainingItems; i += 1) {
      const product = products.nth(i);
      if (await product.locator(AUTOMATION_STORE_LOCATORS.noStockTag).count()) continue;
      if (await product.locator(AUTOMATION_STORE_LOCATORS.callToOrderLink).count()) continue;
      if (!(await product.locator(AUTOMATION_STORE_LOCATORS.addToCartLink).count())) continue;

      await product.scrollIntoViewIfNeeded();
      const priceText = await product.locator(AUTOMATION_STORE_LOCATORS.productPrice).first().innerText();
      addedItemsAmount += this.parseMoney(priceText);
      await product.locator(AUTOMATION_STORE_LOCATORS.addToCartLink).click();
      addedItemsCount += 1;
    }

    return { addedItemsAmount, addedItemsCount };
  }

  // Checks the cart total and item count, then adds more items if needed to reach the target count
  public async topUpCartToTargetCount(
    cartTotalBeforeTopUp: number,
    cartItemCountBeforeTopUp: number,
  ): Promise<void> {
    if (cartItemCountBeforeTopUp >= automationStoreData.targetCartItemCount) return;

    let remainingItems = automationStoreData.targetCartItemCount - cartItemCountBeforeTopUp;
    let addedItemsAmount = 0;

    const categories = [
      { menu: 'Men', name: 'Body & Shower', exact: false },
      { menu: 'Men', name: 'Fragrance Sets', exact: false },
      { menu: 'Men', name: 'Pre-Shave & Shaving', exact: false },
      { menu: 'Men', name: 'Skincare', exact: true },
      { menu: 'Makeup', name: 'Cheeks', exact: false },
      { menu: 'Makeup', name: 'Eyes', exact: false },
      { menu: 'Makeup', name: 'Face', exact: true },
      { menu: 'Makeup', name: 'Lips', exact: false },
      { menu: 'Makeup', name: 'Nails', exact: false },
      { menu: 'Makeup', name: 'Value Sets', exact: false },
    ];

    // First pass — try to add non-sale items from each category
    let addedThisPass = 0;
    do {
      addedThisPass = 0;
      for (const cat of categories) {
        if (remainingItems === 0) break;
        await this.openSubcategory(cat.menu, cat.name, cat.exact);
        const result = await this.addNonSaleItemsToCart(remainingItems);
        remainingItems -= result.addedItemsCount;
        addedItemsAmount += result.addedItemsAmount;
        addedThisPass += result.addedItemsCount;
      }
    } while (remainingItems > 0 && addedThisPass > 0);

    // Second pass — go to home page and try any available items
    if (remainingItems > 0) {
      await this.navigateToStore();
      const result = await this.addAnyAvailableItemsToCart(remainingItems);
      remainingItems -= result.addedItemsCount;
      addedItemsAmount += result.addedItemsAmount;
    }

    // Third pass — try any available items in each category
    if (remainingItems > 0) {
      for (const cat of categories) {
        if (remainingItems === 0) break;
        await this.openSubcategory(cat.menu, cat.name, cat.exact);
        const result = await this.addAnyAvailableItemsToCart(remainingItems);
        remainingItems -= result.addedItemsCount;
        addedItemsAmount += result.addedItemsAmount;
      }
    }

    await this.goToCartPage();

    const finalCount = await this.getCartItemRows().count();
    const finalTotal = await this.getCartTotal();

    if (finalCount === automationStoreData.targetCartItemCount) {
      await expect(finalTotal).toBeCloseTo(cartTotalBeforeTopUp + addedItemsAmount, 2);
    } else {
      await expect(finalCount).toBeGreaterThanOrEqual(cartItemCountBeforeTopUp);
    }
  }
}
