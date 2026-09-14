/**
 * Purpose: wraps the SauceDemo checkout form (customer info step) and the
 * order-confirmation step. Owns the related locators and exposes atomic
 * actions only.
 */
import { Page, Locator } from '@playwright/test';

export default class CheckoutPage {
    constructor(private readonly page: Page) { }

    get firstNameInput(): Locator { return this.page.getByRole('textbox', { name: 'First Name' }); }
    get lastNameInput(): Locator { return this.page.getByRole('textbox', { name: 'Last Name' }); }
    get postalCodeInput(): Locator { return this.page.getByRole('textbox', { name: 'Postal Code' }); }
    get continueButton(): Locator { return this.page.getByRole('button', { name: 'Continue' }); }
    get finishButton(): Locator { return this.page.getByRole('button', { name: 'Finish' }); }
    get confirmationHeader(): Locator { return this.page.getByRole('heading', { name: 'Thank you for your order!' }); }
    get confirmationTitle(): Locator { return this.page.getByText('Checkout: Complete!'); }

    async fillCustomerData(firstName: string, lastName: string, postalCode: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
    }

    async finishOrder() {
        await this.finishButton.click();
    }
}
