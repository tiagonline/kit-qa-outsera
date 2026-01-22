import { test, expect } from "@playwright/test";
import * as dotenv from "dotenv";
import { fakerPT_BR as faker } from "@faker-js/faker";

// Configurei o carregamento seguro das variáveis de ambiente
dotenv.config();

// Configurei o modo serial para garantir a ordem de execução (POST -> GET -> DELETE)
test.describe.configure({ mode: "serial" });

test.describe("API Tests - GoRest (Testes Positivos e Negativos)", () => {
  // Limpa a URL base para evitar barras duplas ou falta delas
  const rawBaseURL = process.env.API_BASE_URL || 'https://gorest.co.in/public/v2';
  const API_BASE_URL = rawBaseURL.endsWith('/') ? rawBaseURL.slice(0, -1) : rawBaseURL;
  
  const TOKEN = process.env.GOREST_TOKEN;

  if (!TOKEN) {
    throw new Error("ERRO: Token não encontrado. Verifique seu arquivo .env");
  }

  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  };

  let userId: number;

  // Massa de Dados Dinâmica para o Teste
  const fakeName = faker.person.fullName();
  const fakeEmail = faker.internet
    .email({ firstName: fakeName.split(" ")[0] })
    .toLowerCase();
  // GoRest valida emails, então adicionei timestamp pra garantir:
  const uniqueEmail = `${Date.now()}_${fakeEmail}`;

  // ==========================================
  // CENÁRIOS POSITIVOS
  // ==========================================
  test.describe("Fluxo Principal (CRUD)", () => {
    test("POST /users - Criar usuário com dados válidos", async ({
      request,
    }) => {
      console.log(`[INFO] Criando usuário: ${fakeName} | ${uniqueEmail}`);

      const response = await request.post(`${API_BASE_URL}/users`, {
        headers: headers,
        data: {
          name: fakeName,
          gender: "male",
          email: uniqueEmail,
          status: "active",
        },
      });

      expect(response.status()).toBe(201);

      // Valido os Headers obrigatórios
      const resHeaders = response.headers();
      expect(resHeaders["content-type"]).toContain("application/json");
      expect(resHeaders).toHaveProperty("x-ratelimit-limit");

      // Valido o corpo da resposta
      const body = await response.json();
      expect(body.email).toBe(uniqueEmail);
      expect(body.name).toBe(fakeName); // Valido que salvou o nome do Faker
      expect(body).toHaveProperty("id");

      // Guardo o ID para os testes subsequentes
      userId = body.id;
    });

    test("GET /users/{id} - Consultar usuário existente", async ({
      request,
    }) => {
      test.skip(!userId, "Pulei o teste porque a criação anterior falhou");

      const response = await request.get(`${API_BASE_URL}/users/${userId}`, {
        headers,
      });
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.id).toBe(userId);
      expect(body.name).toBe(fakeName); // Garanto persistência do dado
    });

    test("PUT /users/{id} - Atualizar dados do usuário", async ({
      request,
    }) => {
      test.skip(!userId, "Pulei o teste porque a criação anterior falhou");

      // Gero um novo status aleatório apenas para variar
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
      test.skip(!userId, "Pulei o teste porque a criação anterior falhou");

      const response = await request.delete(`${API_BASE_URL}/users/${userId}`, {
        headers,
      });
      expect(response.status()).toBe(204);
    });
  });

  // ==========================================
  // CENÁRIOS NEGATIVOS
  // ==========================================
  test.describe("Cenários de Exceção (Negativos)", () => {
    test("POST /users - Falha por Campos Ausentes (422)", async ({
      request,
    }) => {
      const response = await request.post(`${API_BASE_URL}/users`, {
        headers,
        data: {
          name: faker.person.fullName(), // Nome válido
          status: "active",
          // Faltou email e gender propositalmente
        },
      });

      expect(response.status()).toBe(422);

      const body = await response.json();
      expect(JSON.stringify(body)).toContain("field");
      expect(JSON.stringify(body)).toContain("message");
    });

    test("GET /users - Falha de Autenticação (401)", async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: "Bearer token_invalido_123",
          "Content-Type": "application/json",
        },
      });
      expect(response.status()).toBe(401);
    });

    test("GET /users/{id} - Falha por ID Inexistente (404)", async ({
      request,
    }) => {
      const response = await request.get(`${API_BASE_URL}/users/99999999`, {
        headers,
      });
      expect(response.status()).toBe(404);
    });

    test("POST /users - Falha por Payload JSON quebrado (Bad Request)", async ({
      request,
    }) => {
      const response = await request.post(`${API_BASE_URL}/users`, {
        headers,
        data: "isso não é um json",
      });
      expect(response.status()).not.toBe(201);
    });
  });
});
