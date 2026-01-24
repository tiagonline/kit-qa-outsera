import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage.ts';
import { InventoryPage } from '../../../pages/InventoryPage.ts';
import { CartPage } from '../../../pages/CartPage.ts';
import { CheckoutPage } from '../../../pages/CheckoutPage.ts';
import { faker } from '@faker-js/faker';

// Variáveis para compartilhar entre os steps
let loginPage: LoginPage;
let inventoryPage: InventoryPage;
let cartPage: CartPage;
let checkoutPage: CheckoutPage;

Given('que estou logado', async function () {
  loginPage = new LoginPage(this.page);
  inventoryPage = new InventoryPage(this.page);
  cartPage = new CartPage(this.page);
  checkoutPage = new CheckoutPage(this.page);

  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");
});

When('adicionei o produto {string} ao carrinho', async function (produtoNome) {
  await inventoryPage.addItemToCart(produtoNome);
});

When('acesso o carrinho', async function () {
  await inventoryPage.goToCart();
});

When('prossigo para o checkout', async function () {
  await cartPage.proceedToCheckout();
});

When('preencho os dados de entrega corretamente', async function () {
  await checkoutPage.fillInformation(
    faker.person.firstName(),
    faker.person.lastName(),
    faker.location.zipCode()
  );
});

When('finalizo a compra', async function () {
  await checkoutPage.finishCheckout();
});

Then('devo ver a mensagem de confirmação {string}', async function (mensagem) {
  await checkoutPage.validateOrderComplete();
  const header = this.page.locator('.complete-header');
  await expect(header).toContainText(mensagem);
});

// Steps para o Cenário Negativo (Tarefa 2)

When('tento continuar sem preencher o formulário', async function () {
  // Clica em continue sem preencher nada
  await this.page.locator('[data-test="continue"]').click();
});

Then('devo ver a mensagem de erro no checkout {string}', async function (msgErro) {
  const locatorErro = this.page.locator('[data-test="error"]');
  await expect(locatorErro).toContainText(msgErro);
});