/**
 * Purpose: verifies that the inventory list changes order after applying
 * the selected product-sort dropdown value.
 */
import { test, expect } from '@playwright/test';
import { getAllItems, setListOrder } from '../flows/orderFlow';

test('Items are sorted properly', async ({ page }) => {
  await page.goto('/inventory.html');

  const sortOrder: 'Name (A to Z)' | 'Name (Z to A)' = 'Name (Z to A)';
  const sortDirection: 1 | -1 = -1;  // 1 ascending, -1 descending

  const beforeSorting = await getAllItems(page);
  expect(beforeSorting.length, 'At least one product should be available').toBeGreaterThan(0);

  await setListOrder(page, sortOrder);

  const afterSorting = await getAllItems(page);
  expect(beforeSorting, 'The items order before sorting is different from after sorting').not.toEqual(afterSorting);
  sortDirection === -1 ?
    expect(beforeSorting.sort().reverse()).toEqual(afterSorting) : expect(beforeSorting.sort(), 'Sorting the initial items should be equal to the sorted items').toEqual(afterSorting);
});