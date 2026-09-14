/**
 * Purpose: wraps the SauceDemo shopping cart page. Owns the cart locators
 * and exposes atomic actions/readers only - orchestration and assertions
 * belong to the flow and spec layers respectively.
 */
import { Page, Locator } from '@playwright/test';

export default class CartPage {
    constructor(private readonly page: Page) { }

    get cartLink(): Locator { return this.page.locator('[data-test="shopping-cart-link"]'); }
    get checkoutButton(): Locator { return this.page.locator('[data-test="checkout"]'); }
    get subtotalLabel(): Locator { return this.page.locator('[data-test="subtotal-label"]'); }

    async open() {
        await this.cartLink.click();
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
    }

    async getSubtotal(): Promise<number> {
        const subtotalText = await this.subtotalLabel.textContent();
        return parseFloat(subtotalText?.match(/\d+\.\d+/)?.[0] ?? '0');
    }
}
