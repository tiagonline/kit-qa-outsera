import { test as base } from "@playwright/test";
import { LoginPage } from "../../../pages/LoginPage";
import { InventoryPage } from "../../../pages/InventoryPage";
import { CartPage } from "../../../pages/CartPage";
import { CheckoutPage } from "../../../pages/CheckoutPage";

// Declara os tipos das fixtures personalizadas
type MyFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

// Estende o teste base do Playwright
export const test = base.extend<MyFixtures>({
  // Define como iniciar a LoginPage
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  // Define como iniciar a InventoryPage
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  // Define como iniciar a CartPage
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  // Define como iniciar a CheckoutPage
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect } from "@playwright/test";
