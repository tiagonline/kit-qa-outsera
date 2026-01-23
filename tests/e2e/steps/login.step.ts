import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../../../pages/LoginPage';

let loginPage: LoginPage;

Given('que estou na página de login', async function () {
  loginPage = new LoginPage(this.page);
  await loginPage.goto();
});

When('preencho as credenciais válidas', async function () {
  /**
   * TAREFA 3: Gestão de Massa de Dados e Variáveis de Ambiente.
   * Prioriza as variáveis do .env/GitHub Secrets. 
   * Se estiverem vazias ou apenas com espaços, o fallback garante o "standard_user".
   */
  const username = (process.env.SAUCE_USERNAME && process.env.SAUCE_USERNAME.trim()) || "standard_user";
  const password = (process.env.SAUCE_PASSWORD && process.env.SAUCE_PASSWORD.trim()) || "secret_sauce";
  
  await loginPage.login(username, password);
});

When('tento logar com usuario {string} e senha {string}', async function (usuario, senha) {
  await loginPage.login(usuario, senha);
});

Then('devo ver a mensagem de erro {string}', async function (mensagem) {
  await loginPage.validateErrorMessage(mensagem);
});

Then('devo ser redirecionado para a vitrine de produtos', async function () {
  /**
   * Validação de redirecionamento com Regex.
   * Aumentamos o timeout para 10 segundos para suportar variações de performance no CI/CD.
   */
  await expect(this.page).toHaveURL(/.*inventory\.html/, { timeout: 10000 });
});