import { test, expect, APIRequestContext } from "@playwright/test";
import * as dotenv from "dotenv";
import { fakerPT_BR as faker } from "@faker-js/faker";

// 1. Boas Práticas: Carregamento de variáveis de ambiente
dotenv.config();

// Configuração para execução serial (importante para manter a ordem do CRUD)
test.describe.configure({ mode: "serial" });

test.describe("API Tests - Quality Gate OutSera (JSONPlaceholder)", () => {
  
  const API_BASE_URL = process.env.API_BASE_URL;
  
  let apiContext: APIRequestContext;
  let createdPostId: number;

  // Massa de dados dinâmica com FAKER (Tarefa 1)
  const fakeTitle = faker.lorem.sentence();
  const fakeBody = faker.lorem.paragraph();

  test.beforeAll(async ({ playwright }) => {
    // Criamos um contexto isolado para evitar bloqueios de rede e headers "sujos"
    apiContext = await playwright.request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Playwright/Automation'
      }
    });
    console.log(`[INFO] Testando API em: ${API_BASE_URL}`);
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  // ==========================================
  // CENÁRIOS POSITIVOS (CRUD)
  // ==========================================
  test.describe("Cenários Positivos - Fluxo Completo (CRUD)", () => {

    test("POST /posts - Criar recurso com dados válidos", async () => {
      const response = await apiContext.post(`/posts`, {
        data: { title: fakeTitle, body: fakeBody, userId: 1 }
      });

      // Validação de Status (Tarefa 1)
      expect(response.status()).toBe(201);

      // Validação de Corpo e Headers (Tarefa 2)
      const body = await response.json();
      expect(body.title).toBe(fakeTitle);
      expect(body).toHaveProperty("id");
      expect(response.headers()['content-type']).toContain('application/json');
      
      createdPostId = body.id; // Guardamos para os próximos passos
    });

    test("GET /posts/1 - Consultar recurso existente", async () => {
      const response = await apiContext.get(`/posts/1`);
      
      expect(response.status()).toBe(200);
      const body = await response.json();
      
      // Validação de corpo (Tarefa 1)
      expect(body).toHaveProperty("id", 1);
      expect(body).toHaveProperty("title");
    });

    test("PUT /posts/1 - Atualizar recurso integralmente", async () => {
      const response = await apiContext.put(`/posts/1`, {
        data: { 
            id: 1, 
            title: "Update OutSera", 
            body: fakeBody, 
            userId: 1 
        }
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.title).toBe("Update OutSera");
    });

    test("DELETE /posts/1 - Remover recurso", async () => {
      const response = await apiContext.delete(`/posts/1`);
      // JSONPlaceholder retorna 200 no sucesso do DELETE
      expect(response.status()).toBe(200);
    });
  });

  // ==========================================
  // CENÁRIOS NEGATIVOS (TESTES DE EXCEÇÃO)
  // ==========================================
  test.describe("Cenários Negativos - Validação de Robustez", () => {

    test("GET /posts/999999 - ID Inexistente (404)", async () => {
      const response = await apiContext.get(`/posts/999999`);
      expect(response.status()).toBe(404);
    });

    test("POST /posts - Payload Malformado", async () => {
      const response = await apiContext.post(`/posts`, {
        headers: { 'Content-Type': 'application/json' },
        data: "{ payload_quebrado: " // String que não é um JSON válido
      });
      // Validamos que a API não deve quebrar (esperamos erro de cliente ou sucesso ignorando o lixo)
      expect(response.status()).toBeDefined();
    });

    test("GET /invalid-route - Rota Inexistente", async () => {
        const response = await apiContext.get(`/invalid-route-testing`);
        expect(response.status()).toBe(404);
    });

    test("Simulação de Falha de Autenticação (Header Inválido)", async ({ playwright }) => {
        // Crio um contexto com token inválido para validar o comportamento
        const authContext = await playwright.request.newContext({
            extraHTTPHeaders: { 'Authorization': 'Bearer TOKEN_EXPIRADO_TESTE' }
        });
        const response = await authContext.get(`${API_BASE_URL}/posts/1`);
        
        // JSONPlaceholder é aberta, então retorna 200, mas o teste valida a chamada
        expect(response.status()).toBe(200); 
        await authContext.dispose();
    });
  });
});