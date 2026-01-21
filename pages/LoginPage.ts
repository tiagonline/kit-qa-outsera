import { expect, type Locator, type Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // Localizadores
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    // Elemento de Validação
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto("/");
  }

  // Método de Ação: Login
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // Método de Validação: Verifica se a mensagem de erro contém o texto esperado.
  async validateErrorMessage(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }
}
