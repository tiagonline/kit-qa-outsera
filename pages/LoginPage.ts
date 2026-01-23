import { expect, type Locator, type Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto("/");
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    
    // Clica e espera a URL mudar.
    // Se for um teste negativo, o Playwright vai esperar, mas o Step de erro 
    // vai agir logo em seguida, então não trava o fluxo.
    await this.loginButton.click();
    
    // Aguarda a URL de sucesso de forma simples
    await this.page.waitForURL(/.*inventory.html/, { timeout: 3000 }).catch(() => {
      // Silenciei apenas para não quebrar os testes de "Login Inválido", ou seja, 
      // se em 3 segundos a URL não mudar para inventory, tudo bem, não dê erro, 
      // apenas siga para o próximo passo
    });
  }

  async validateErrorMessage(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }
}