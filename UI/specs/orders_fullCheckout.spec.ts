/**
 * Purpose: verifies that a user can open the inventory page, add items,
 * compare the calculated cart subtotal with the checkout subtotal,
 * and complete the order.
 */
import { test, expect } from '@playwright/test';
import { addItemsAndCalculatePrice, checkoutOrder, completeOrder, getOrderSubtotal, } from '../flows/orderFlow';

test('User can checkout ', async ({ page }) => {
  await page.goto('/inventory.html');

  const itemsPrice = await addItemsAndCalculatePrice(page);
  expect(itemsPrice, 'Items have been added to the cart successfully').toBeGreaterThan(0);

  await checkoutOrder(page);

  const bagPrice = await getOrderSubtotal(page);
  expect(bagPrice, 'The items price in the Cart should match the sum of the prices of the added items.').toEqual(itemsPrice);

  await completeOrder(page);
});