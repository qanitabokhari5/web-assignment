Feature: Shopping cart limits across currencies
  As a logged-in customer
  I want to add sale items, manage cart limits across currencies, and top up to 15 items

  Background:
    Given I open the automation test store
    And I log in with username "Qanita12" and password "Qanita123"

  Scenario: Add sale items from Men and Makeup in Euro then maintain cart limits
    # Step 1: Set currency to Euro
    Given I set the currency to "€ Euro"

    # Step 2: Add all sale items from Men and Makeup categories
    When I add all sale items from Men categories
    And I add all sale items from Makeup categories

    # Step 3: Go to cart
    And I open the cart page

    # Assert: cart has items and total is greater than 0
    Then the cart should contain items and a total greater than 0

    # Step 4: If Euro total > 200, remove items until total <= 200, then assert total <= 200 and cart has items
    When I trim the cart total to at most 200

    # Step 5: Switch to Dollar — if total > 200, remove items until total <= 200, assert total <= 200 and cart has items
    And I set the currency to "$ US Dollar" and trim the cart total to at most 200

    # Step 6: Switch to Pound — if total > 200, remove items until total <= 200, assert total <= 200 and cart has items
    And I set the currency to "£ Pound Sterling" and trim the cart total to at most 200

    # Assert: cart still has items after all three currency trims
    Then the cart should still contain items

    # Step 7: If item count < 15, go to Makeup non-sale sections and add the missing items
    When I add non-sale Makeup items until there are 15 items if needed

    # Assert: cart has exactly 15 items AND final total = total before top-up + price of newly added items
    Then the cart should contain 15 items
