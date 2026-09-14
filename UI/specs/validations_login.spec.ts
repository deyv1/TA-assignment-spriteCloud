/**
 * Purpose: validates the expected UI error messages for invalid login
 * credentials, locked users, and empty or malformed input cases.
 */
import { test, expect } from '@playwright/test';
import { loginUser } from '../flows/orderFlow';
import { ENV } from '../support/env';

test('test invalid logins', async ({ page }) => {
  const { faker } = await import('@faker-js/faker');

  await page.goto('/');

  const invalidInputs = [
    {
      username: ENV.lockedOutUser.username,
      password: ENV.lockedOutUser.password,
      expectedError: 'Epic sadface: Sorry, this user has been locked out.'
    },
    {
      username: faker.internet.username(),
      password: ENV.standardUser.password,
      expectedError: 'Epic sadface: Username and password do not match any user in this service'
    },
    {
      username: ENV.standardUser.username,
      password: faker.internet.password(),
      expectedError: 'Epic sadface: Username and password do not match any user in this service'
    },
    {
      username: '',
      password: ENV.standardUser.password,
      expectedError: 'Epic sadface: Username is required'
    },
    {
      username: ENV.standardUser.username,
      password: '',
      expectedError: 'Epic sadface: Password is required'
    },
    {
      username: '',
      password: '',
      expectedError: 'Epic sadface: Username is required'
    },
    {
      username: '\' OR \'a\'=\'a',
      password: '\' OR \'a\'=\'a',
      expectedError: 'Epic sadface: Username and password do not match any user in this service'
    }
  ];

  for (const { username, password, expectedError } of invalidInputs) {
    await loginUser(page, username, password);
    await expect(page.locator('[data-test="error"]')).toContainText(expectedError);
  }
});
