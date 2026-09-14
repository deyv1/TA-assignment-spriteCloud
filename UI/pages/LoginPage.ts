/**
 * Purpose: wraps the SauceDemo login form in a Playwright page object and
 * exposes reusable fill and click actions for the business/flow layer.
 */
import { Page } from '@playwright/test';

export default class LoginPage {
    constructor(private page: Page) { }

    async goto() {
        await this.page.goto('/');
    }

    async fillUsername(username: string) {
        await this.page.getByPlaceholder('Username').fill(username);
    }

    async fillPassword(password: string) {
        await this.page.getByPlaceholder('Password').fill(password);
    }

    async clickLogin() {
        await this.page.getByRole('button', { name: 'Login' }).click();
    }
}