import { test, expect } from '@fixturesetup';
import { automationStoreData } from '@testdata/sauce-demo-test-data';

// This test has many steps across multiple categories — 5 minutes covers all browsers including WebKit
test.setTimeout(300000);

test.describe('Automation Test Store - Cart Tests', () => {
  test.beforeEach('Login to Automation Test Store', async ({ automationStorePage }) => {
    await automationStorePage.navigateToStore();
    await automationStorePage.login();
  });

  test('Validate Cart Item Count and Total Amount Across Multiple Currency Conversions with Dynamic Item Addition and Removal', async ({ automationStorePage }) => {
    // Switch currency to Euro before adding items
    await automationStorePage.switchToEuro();

    // Add all sale items from every relevant category to the cart
    await automationStorePage.openSubcategory('Men', 'Body & Shower');
    await automationStorePage.addAllSaleItemsToCart();

    await automationStorePage.openSubcategory('Men', 'Fragrance Sets');
    await automationStorePage.addAllSaleItemsToCart();

    await automationStorePage.openSubcategory('Men', 'Pre-Shave & Shaving');
    await automationStorePage.addAllSaleItemsToCart();

    await automationStorePage.openSubcategory('Men', 'Skincare', true);
    await automationStorePage.addAllSaleItemsToCart();

    await automationStorePage.openSubcategory('Makeup', 'Cheeks');
    await automationStorePage.addAllSaleItemsToCart();

    await automationStorePage.openSubcategory('Makeup', 'Eyes');
    await automationStorePage.addAllSaleItemsToCart();

    await automationStorePage.openSubcategory('Makeup', 'Face', true);
    await automationStorePage.addAllSaleItemsToCart();

    await automationStorePage.openSubcategory('Makeup', 'Lips');
    await automationStorePage.addAllSaleItemsToCart();

    await automationStorePage.openSubcategory('Makeup', 'Nails');
    await automationStorePage.addAllSaleItemsToCart();

    await automationStorePage.openSubcategory('Makeup', 'Value Sets');
    await automationStorePage.addAllSaleItemsToCart();

    // Go to cart and confirm items were added
    await automationStorePage.goToCartPage();
    const cartItemCount = await automationStorePage.getCartItemRows().count();
    expect(cartItemCount).toBeGreaterThan(0);

    // Trim the cart to the configured total limit in US Dollar then Pound Sterling
    await automationStorePage.setCurrency('$ US Dollar');
    await automationStorePage.trimCartToLimit(automationStoreData.cartTotalLimit);

    await automationStorePage.setCurrency('£ Pound Sterling');
    await automationStorePage.trimCartToLimit(automationStoreData.cartTotalLimit);

    // Record the cart state before top-up
    const cartTotalBeforeTopUp = await automationStorePage.getCartTotal();
    const cartItemCountBeforeTopUp = await automationStorePage.getCartItemRows().count();

    // If the cart has fewer than the target count, add more items to reach it
    await automationStorePage.topUpCartToTargetCount(cartTotalBeforeTopUp, cartItemCountBeforeTopUp);
  });
});
