import { expect, type Locator, type Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // Seletores estáveis usando data-test conforme requisitos da Tarefa 3
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    // Acessa a URL base configurada no projeto
    await this.page.goto("/");
  }

  /**
   * Método de Ação: Login
   * Gerencia o preenchimento, clique e aguarda a transição de página
   */
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    // Sincronismo inteligente:
    // Se não houver erro imediato, aguarda o redirecionamento para a vitrine.
    // O catch evita que o teste trave em cenários de login inválido.
    const hasError = await this.errorMessage.isVisible({ timeout: 500 }).catch(() => false);
    
    if (!hasError) {
      await this.page.waitForURL(/.*inventory.html/, { timeout: 5000 }).catch(() => {
        // Log silencioso caso seja um cenário de teste negativo
      });
    }
  }

  /**
   * Método de Validação: Verifica a mensagem de erro
   */
  async validateErrorMessage(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }
}