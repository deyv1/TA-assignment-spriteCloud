/**
 * Purpose: signs in with the standard SauceDemo UI user and stores the
 * authenticated browser state to the Playwright storage file.
 */
import { test as setup, expect } from '@playwright/test';
import { loginUser } from '../../flows/orderFlow';
import { ENV } from '../../support/env';
import { AUTH_STORAGE_PATH } from '../../support/constants';

setup('authenticate in UI', async ({ page }) => {
    await loginUser(page, ENV.standardUser.username, ENV.standardUser.password);
    await expect(page).toHaveURL('/inventory.html');
    await expect(page.getByText('Swag Labs')).toBeVisible();

    // save signed-in state to disk
    await page.context().storageState({ path: AUTH_STORAGE_PATH });
});
