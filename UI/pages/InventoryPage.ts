/**
 * Purpose: wraps the SauceDemo inventory (product list) page. Owns every
 * locator that belongs to this page and exposes atomic actions only -
 * no assertions and no multi-step business logic live here.
 */
import { Page, Locator } from '@playwright/test';

export default class InventoryPage {
    constructor(private readonly page: Page) { }

    get sortDropdown(): Locator { return this.page.getByRole('combobox', { name: 'Sort products' }); }
    get activeSortOption(): Locator { return this.page.locator('[data-test="active-option"]'); }
    get itemNames(): Locator { return this.page.locator('[data-test="inventory-item-name"]'); }
    get cartBadge(): Locator { return this.page.locator('[data-test="shopping-cart-badge"]'); }
    get inventoryItems(): Locator { return this.page.locator('[data-test="inventory-list"] > div'); }


    async goto() {
        await this.page.goto('/inventory.html');
    }

    async selectSortOption(order: string) {
        await this.sortDropdown.selectOption(order);
    }

    async getItemNames(): Promise<string[]> {
        return this.itemNames.allTextContents();
    }

    async getItemCount(): Promise<number> {
        return this.inventoryItems.count();
    }

    /** Returns the row locator for a given product index, scoped for further queries/actions. */
    itemRow(index: number): Locator {
        return this.inventoryItems.nth(index);
    }

    async getItemPriceByIndex(index: number): Promise<number> {
        const priceText = await this.itemRow(index).locator('[data-test="inventory-item-price"]').innerText();
        return parseFloat(priceText.replace('$', ''));
    }

    async addItemToCartByIndex(index: number) {
        await this.itemRow(index).locator('[data-test^="add-to-cart"]').click();
    }
}
