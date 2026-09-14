/**
 * Purpose: business layer for the SauceDemo order journey. Composes the
 * page objects (pages/) into flows that specs call directly, keeping specs
 * focused on test intent and assertions instead of raw locators.
 *
 * Note on assertions: this layer intentionally uses Playwright's `expect`
 * in two spots (setListOrder, addItemsAndCalculatePrice) purely as a
 * *synchronization* mechanism - polling until the UI reflects a state
 * change (the active sort label, the cart badge count) before the next
 * step runs. Outcome assertions that represent test intent (e.g. "the
 * order was completed") live in the spec files, not here.
 */
import { Page, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import { MIN_ITEMS_FOR_CHECKOUT } from '../support/constants';

export async function loginUser(page: Page, username: string, password: string) {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.fillUsername(username);
    await loginPage.fillPassword(password);
    await loginPage.clickLogin();
}

export async function setListOrder(page: Page, order: string) {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.selectSortOption(order);
    await expect(inventoryPage.activeSortOption, `Sort control should reflect "${order}" after selection`)
        .toHaveText(order);
}

export async function getAllItems(page: Page) {
    return new InventoryPage(page).getItemNames();
}

export async function fillPersonData(page: Page) {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.fillCustomerData(
        faker.person.firstName(),
        faker.person.lastName(),
        faker.location.zipCode(),
    );
}

export async function getOrderSubtotal(page: Page) {
    return new CartPage(page).getSubtotal();
}

export async function addItemsAndCalculatePrice(page: Page) {
    const inventoryPage = new InventoryPage(page);
    const totalItems = await inventoryPage.getItemCount();

    if (totalItems < MIN_ITEMS_FOR_CHECKOUT) {
        throw new Error(
            `Checkout flow requires at least ${MIN_ITEMS_FOR_CHECKOUT} products, but only ${totalItems} were found.`,
        );
    }

    const itemsToAdd = Math.max(MIN_ITEMS_FOR_CHECKOUT, Math.floor(totalItems / 2));
    let totalPrice = 0;

    for (let i = 0; i < itemsToAdd; i++) {
        totalPrice += await inventoryPage.getItemPriceByIndex(i);
        await inventoryPage.addItemToCartByIndex(i);
        await expect(inventoryPage.cartBadge, 'Cart badge should reflect the running item count')
            .toHaveText(String(i + 1));
    }

    return totalPrice;
}

export async function checkoutOrder(page: Page) {
    const cartPage = new CartPage(page);

    await cartPage.open();
    await cartPage.proceedToCheckout();
    await fillPersonData(page);

    return cartPage.getSubtotal();
}

export async function completeOrder(page: Page) {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.finishOrder();
    await expect(checkoutPage.confirmationHeader, 'Order confirmation heading should be visible').toBeVisible();
    await expect(checkoutPage.confirmationTitle, 'Checkout: Complete! title should be visible').toBeVisible();
}
