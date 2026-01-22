import { test, expect } from "@playwright/test";
import * as dotenv from "dotenv";
import { fakerPT_BR as faker } from "@faker-js/faker";

// Carregamento das variáveis de ambiente
dotenv.config();

// Modo serial para garantir a ordem lógica do CRUD
test.describe.configure({ mode: "serial" });

test.describe("API Tests - GoRest (Testes Positivos e Negativos)", () => {
  // Tratamento da URL base para evitar erros de barra (causa comum de 405)
  const rawBaseURL = process.env.API_BASE_URL || 'https://gorest.co.in/public/v2';
  const API_BASE_URL = rawBaseURL.endsWith('/') ? rawBaseURL.slice(0, -1) : rawBaseURL;
  
  const TOKEN = process.env.GOREST_TOKEN;

  // Cabeçalhos robustos para evitar 403 (Forbidden) no GitHub Actions
  const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
  };

  let userId: number;

  // Massa de dados dinâmica
  const fakeName = faker.person.fullName();
  const fakeEmail = faker.internet.email({ firstName: fakeName.split(" ")[0] }).toLowerCase();
  const uniqueEmail = `${Date.now()}_${fakeEmail}`;

  test.beforeAll(() => {
    if (!TOKEN) {
      throw new Error("ERRO: GOREST_TOKEN não encontrado. Verifique as Secrets do GitHub.");
    }
    console.log(`[DEBUG] API_BASE_URL: ${API_BASE_URL}`);
    console.log(`[DEBUG] Token Length: ${TOKEN?.length}`);
  });

  // ==========================================
  // CENÁRIOS POSITIVOS
  // ==========================================
  test.describe("Fluxo Principal (CRUD)", () => {
    test("POST /users - Criar usuário com dados válidos", async ({ request }) => {
      console.log(`[INFO] Criando usuário: ${fakeName} | ${uniqueEmail}`);

      const response = await request.post(`${API_BASE_URL}/users`, {
        headers,
        data: {
          name: fakeName,
          gender: "male",
          email: uniqueEmail,
          status: "active",
        },
      });

      // Se der erro, logamos o corpo para depuração rápida no CI
      if (response.status() !== 201) {
        console.error(`[ERRO ${response.status()}] Resposta do servidor:`, await response.text());
      }

      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body.email).toBe(uniqueEmail);
      expect(body).toHaveProperty("id");

      userId = body.id;
    });

    test("GET /users/{id} - Consultar usuário existente", async ({ request }) => {
      test.skip(!userId, "Pulei o teste porque o userId não foi gerado");

      const response = await request.get(`${API_BASE_URL}/users/${userId}`, { headers });
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      expect(body.id).toBe(userId);
      expect(body.name).toBe(fakeName);
    });

    test("PUT /users/{id} - Atualizar dados do usuário", async ({ request }) => {
      test.skip(!userId, "Pulei o teste porque o userId não foi gerado");

      const newStatus = "inactive";
      const response = await request.put(`${API_BASE_URL}/users/${userId}`, {
        headers,
        data: { status: newStatus },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.status).toBe(newStatus);
    });

    test("DELETE /users/{id} - Remover usuário", async ({ request }) => {
      test.skip(!userId, "Pulei o teste porque o userId não foi gerado");

      const response = await request.delete(`${API_BASE_URL}/users/${userId}`, { headers });
      expect(response.status()).toBe(204);
    });
  });

  // ==========================================
  // CENÁRIOS NEGATIVOS
  // ==========================================
  test.describe("Cenários de Exceção (Negativos)", () => {
    test("POST /users - Falha por Campos Ausentes (422)", async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/users`, {
        headers,
        data: { name: "Teste Sem Email", status: "active" },
      });

      expect(response.status()).toBe(422);
      const body = await response.json();
      expect(Array.isArray(body)).toBeTruthy(); // GoRest retorna array de erros no 422
    });

    test("GET /users - Falha de Autenticação (401)", async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/users`, {
        headers: { ...headers, Authorization: "Bearer token_invalido" },
      });
      expect(response.status()).toBe(401);
    });

    test("GET /users/{id} - Falha por ID Inexistente (404)", async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/users/000000`, { headers });
      expect(response.status()).toBe(404);
    });

    test("POST /users - Falha por Payload Malformado", async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/users`, {
        headers,
        data: "{ payload_quebrado: ", 
      });
      // Aceita qualquer erro de cliente (400 ou 422) mas não 201
      expect(response.status()).toBeGreaterThanOrEqual(400);
    });
  });
});