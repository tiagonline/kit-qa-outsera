import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';

let loginPage: LoginPage;

Given('que estou na página de login', async function () {
  loginPage = new LoginPage(this.page);
  await loginPage.goto();
});

When('preencho as credenciais válidas', async function () {
  //Priorizo variáveis de ambiente, mantém fallback para desenvolvimento local
  const username = process.env.SAUCE_USERNAME || "standard_user";
  const password = process.env.SAUCE_PASSWORD || "secret_sauce";
  
  await loginPage.login(username, password);
});

When('tento logar com usuario {string} e senha {string}', async function (usuario, senha) {
  await loginPage.login(usuario, senha);
});

Then('devo ver a mensagem de erro {string}', async function (mensagem) {
  await loginPage.validateErrorMessage(mensagem);
});

Then('devo ser redirecionado para a vitrine de produtos', async function () {
  await expect(this.page).toHaveURL(/inventory.html/);
});