import { test } from "@playwright/test";
import { LoginPage } from "../../../pages/LoginPage";
import { InventoryPage } from "../../../pages/InventoryPage";
import { CartPage } from "../../../pages/CartPage";
import { CheckoutPage } from "../../../pages/CheckoutPage";
import * as data from "../support/fixtures.json";
import * as dotenv from "dotenv";
import { faker } from "@faker-js/faker";

dotenv.config();

test.describe("E2E | Fluxo de Compra SAUCE LABS", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  // Credenciais via variáveis de ambiente para segurança
  const VALID_USERNAME = process.env.SAUCE_USERNAME || "standard_user";
  const VALID_PASSWORD = process.env.SAUCE_PASSWORD || "secret_sauce";

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    await loginPage.goto();
  });

  test("Cenário Negativo - Deve falhar ao tentar logar com credenciais inválidas", async () => {
    // Geração dinâmica de dados inválidos
    const invalidPassword = faker.internet.password();
    const invalidUsername = faker.internet.userName();

    await test.step("Quando: Tenta logar com credenciais inválidas (geradas dinamicamente)", async () => {
      await loginPage.login(invalidUsername, invalidPassword);
    });

    await test.step("Então: Deve mostrar mensagem de erro", async () => {
      await loginPage.validateErrorMessage(data.messages.loginError);
    });
  });

  test("Cenário E2E Principal - Deve realizar a compra de um item com sucesso", async () => {
    // DADOS DINÂMICOS: Garante que cada execução use um perfil único
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const postalCode = faker.location.zipCode();

    await test.step("Dado: Que o login é feito com sucesso", async () => {
      await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    });

    await test.step("Quando: Adiciono a mochila e prossigo para o checkout", async () => {
      await inventoryPage.addItemToCart("Sauce Labs Backpack");
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
    });

    await test.step("E: Preencho os dados de entrega dinâmicos", async () => {
      // Preenchimento com dados gerados pelo faker
      await checkoutPage.fillInformation(firstName, lastName, postalCode);
    });

    await test.step("Então: Finalizo o pedido e vejo a confirmação", async () => {
      await checkoutPage.finishCheckout();
      await checkoutPage.validateOrderComplete();
    });
  });

  test("Cenário Exceção - Deve falhar o checkout com campos de entrega incompletos", async () => {
    await test.step("Dado: Que o login é feito com sucesso", async () => {
      await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    });

    await test.step("Quando: Adiciono item e tento continuar sem o CEP", async () => {
      await inventoryPage.addItemToCart("Sauce Labs Backpack");
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();

      // Simulação de erro (CEP vazio).
      // Nota: Aqui usei dados estáticos pois o foco é validar o campo vazio,
      // mas poderia usar faker também se preferisse.
      await checkoutPage.fillInformation(
        data.checkout.firstName,
        data.checkout.lastName,
        "",
      );
    });

    await test.step("Então: Deve exibir a mensagem de erro de CEP obrigatório", async () => {
      await checkoutPage.validateErrorMessage(data.messages.postalCodeError);
    });
  });
});
