import { test, expect } from "@playwright/test";

test("Mobile - Validar Responsividade da Home", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  // Verifica se o input de login está visível na tela pequena
  await expect(page.locator('[data-test="username"]')).toBeVisible();
});
