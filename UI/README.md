# UI Playwright Test Documentation

This folder contains the SauceDemo UI automation suite written with Playwright.

## Scope

The UI project exercises:
- authentication setup and storage-state reuse
- login validation error messages
- product ordering and sorting
- order checkout and completion flow

## Architecture

The suite is split into four layers so that each file has a single
responsibility:

```
pages/     -> Page Objects: locators + atomic UI actions for one page. No assertions, no orchestration.
flows/     -> Business layer: composes Page Objects into reusable, multi-step journeys (login, checkout...).
specs/     -> Test logic: test intent, test data and assertions. Calls into flows/, never touches locators directly.
support/   -> Cross-cutting infrastructure: environment config and shared constants.
```

- `pages/LoginPage.ts`, `pages/InventoryPage.ts`, `pages/CartPage.ts`, `pages/CheckoutPage.ts`
  each own the locators for one SauceDemo page and expose small, atomic methods
  (`fillUsername`, `addItemToCartByIndex`, `getSubtotal`...). This is the only
  place a `data-test` selector or `getByRole` call should appear.
- `flows/orderFlow.ts` is the business layer. It composes the page objects into
  the journeys the specs need (`loginUser`, `addItemsAndCalculatePrice`,
  `checkoutOrder`, `completeOrder`...) without hardcoding selectors of its own.
- `specs/` contains the Playwright test cases. They read as a sequence of
  business steps plus assertions, not as raw locator soup.
- `specs/auth/auth.setup.ts` creates the authentication file used by later tests.
- `support/env.ts` centralizes environment-driven configuration (base URL,
  demo user credentials) so nothing is hardcoded in the tests themselves.
- `support/constants.ts` holds shared values.
- `playwright.config.ts` contains the runner configuration and browser project
  definitions.

## Test entry points

The test runner collects tests from `./specs` and uses the following structure:

1. `authorization-setup` project runs `auth.setup.ts` and logs in through the UI.
2. `source-tests` project runs the order specification files and reuses `storageState` from the auth setup.
3. `input-validation-tests` project runs the login validation spec without the stored browser context.



## Important flow contracts (`flows/orderFlow.ts`)

- `loginUser(page, username, password)` opens the SauceDemo home page and logs in using the `LoginPage` object.
- `setListOrder(page, order)` changes the product dropdown and waits for the active sort option to reflect it.
- `getAllItems(page)` returns inventory item names from the product list.
- `fillPersonData(page)` generates a first name, last name, and postal code through Faker and continues checkout.
- `getOrderSubtotal(page)` extracts the cart subtotal from the visible label and parses it numerically.
- `addItemsAndCalculatePrice(page)` counts visible product cards, adds roughly half of them to the cart, and calculates an in-memory price total.
- `checkoutOrder(page)` visits the cart, continues the checkout, and fills customer data.
- `completeOrder(page)` clicks Finish and asserts that both confirmation elements are visible.


## File-level documentation notes

Each UI test, page object, or flow file starts with a short header comment
explaining what it does and which layer it belongs to, e.g.:

```ts
/**
 * Purpose: covers the product sorting flow for the SauceDemo inventory page.
 * Scope: uses Playwright page locators and helper functions from the support layer.
 * Dependency: shared auth state is loaded from the setup project.
 */
```
## Notes

- AI (Claude) was used for general checks like variables consistency, verify naming conventions, to generate documentation (description inside the collection) and to validate that current structure complies to requirements and other issues solving suggestions.