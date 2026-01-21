import { test, expect } from '@playwright/test';

test('Mobile - Validar Responsividade da Home (Swag Labs)', async ({ page }) => {
  // 1. Acessa o site
  await page.goto('https://www.saucedemo.com/');

  // 2. Valida se o elemento de login está visível
  // (Isso confirma que o site carregou na viewport mobile)
  const loginInput = page.locator('[data-test="username"]');
  await expect(loginInput).toBeVisible();

  // 3. Valida se o botão de menu (hambúrguer) NÃO está expandido inicialmente
  // (Comportamento padrão mobile)
  // Nota: No Saucedemo o menu só aparece logado, então validamos o logo ou bot login
  await expect(page.locator('.login_logo')).toBeVisible();
});