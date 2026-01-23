import { test, expect } from '@playwright/test';

test('Mobile - Validar Responsividade da Home (Swag Labs)', async ({ page }) => {
  // 1. Acessa o site usando a baseURL configurada no ambiente
  // O Playwright usa o "/" para concatenar com a baseURL do seu .env
  await page.goto('/'); 

  // 2. Valida se o elemento de login está visível
  const loginInput = page.locator('[data-test="username"]');
  await expect(loginInput).toBeVisible();

  // 3. Valida se o logo de login está visível (confirmação visual do mobile)
  await expect(page.locator('.login_logo')).toBeVisible();
});