import { type Locator, type Page } from "@playwright/test";
export class InventoryPage {
  readonly page: Page;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async addItemToCart(itemName: string) {
    const itemSlug = itemName.toLowerCase().replace(/\s/g, "-");
    const itemButtonLocator = this.page.locator(
      `[data-test="add-to-cart-${itemSlug}"]`,
    );
    await itemButtonLocator.click();
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
