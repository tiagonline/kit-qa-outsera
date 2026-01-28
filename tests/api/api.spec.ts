import { test, expect, APIRequestContext } from '@playwright/test';
import { faker } from '@faker-js/faker';

// Roda os testes de API em série para evitar conflitos de estado no CRUD
test.describe.serial('Testes de API - Fluxo CRUD Completo & Cenários Negativos', () => {
  /* Isso declara uma variável que vai guardar o "contexto" da conexão com a API.
    É como se fosse o "Postman" aberto. 
    Você cria ela aqui em cima pra poder usar a mesma conexão em todos os testes
  */ 
  let apiContext: APIRequestContext;
  let createdPostId: number;
  
  // Dados dinâmicos gerados pelo Faker
  const fakeTitle = faker.lorem.sentence();
  const fakeBody = faker.lorem.paragraph();
  const fakeUserId = faker.number.int({ min: 1, max: 100 });
  
  // Dados para atualização (PUT)
  const updatedTitle = faker.lorem.sentence();
  const updatedBody = faker.lorem.paragraph();

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
    /*Aqui é a boa prática de fechar a porta quando sai. 
    O .dispose() mata a conexão e libera a memória que o contexto estava usando. 
    Em testes pequenos não faz tanta diferença, mas em pipelines grandes, 
    se você não limpar os recursos, pode estourar a memória do servidor de CI.
    */
  });

  // CENÁRIOS POSITIVOS (CRUD)

  test('POST /posts - Deve criar uma nova postagem com dados dinâmicos', async () => {
    const response = await apiContext.post('/posts', {
      data: {
        title: fakeTitle,
        body: fakeBody,
        userId: fakeUserId,
      },
    });

    expect(response.status()).toBe(201);
    const headers = response.headers();
    expect(headers['content-type']).toContain('application/json');

    const responseBody = await response.json();
    console.log('ID Gerado:', responseBody.id);

    expect(responseBody).toHaveProperty('id');
    expect(responseBody.title).toBe(fakeTitle);
    expect(responseBody.body).toBe(fakeBody);
    expect(responseBody.userId).toBe(fakeUserId);

    createdPostId = responseBody.id;
  });

  test('GET /posts/:id - Deve consultar a postagem criada', async () => {
    // Fallback para 1 caso o ID seja > 100 (limitação do JSONPlaceholder)
    const idToTest = (createdPostId > 100) ? 1 : createdPostId; 

    const response = await apiContext.get(`/posts/${idToTest}`);
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('id', idToTest);
  });

  test('PUT /posts/:id - Deve atualizar a postagem integralmente', async () => {
    const idToTest = (createdPostId > 100) ? 1 : createdPostId;

    const response = await apiContext.put(`/posts/${idToTest}`, {
      data: {
        id: idToTest,
        title: updatedTitle,
        body: updatedBody,
        userId: fakeUserId,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.title).toBe(updatedTitle);
    expect(responseBody.body).toBe(updatedBody);
  });

  test('DELETE /posts/:id - Deve remover a postagem', async () => {
    const idToTest = (createdPostId > 100) ? 1 : createdPostId;
    
    const response = await apiContext.delete(`/posts/${idToTest}`);
    expect(response.status()).toBe(200);
  });

  // CENÁRIOS NEGATIVOS

  test.describe("Cenários Negativos", () => {

    test("GET /posts/999999 - ID Inexistente (404)", async () => {
      const response = await apiContext.get(`/posts/999999`);
      expect(response.status()).toBe(404);
    });

    test("POST /posts - Payload Malformado", async () => {
      const response = await apiContext.post(`/posts`, {
        headers: { 'Content-Type': 'application/json' },
        data: "{ payload_quebrado: " // String que não é um JSON válido
      });
      // Aceito 201 (comportamento permissivo do JSONPlaceholder) ou 400/500 (API Real)
      expect([201, 400, 500]).toContain(response.status());
    });

    test("GET /invalid-route - Rota Inexistente", async () => {
        const response = await apiContext.get(`/invalid-route-testing`);
        expect(response.status()).toBe(404);
    });

    test("Simulação de Falha de Autenticação (Header Inválido)", async ({ playwright }) => {
        // Crio contexto isolado para testar auth sem afetar os outros testes
        const authContext = await playwright.request.newContext({
            baseURL: process.env.API_BASE_URL,
            extraHTTPHeaders: { 'Authorization': 'Bearer TOKEN_EXPIRADO_TESTE' }
        });
        
        // Tentativa de acesso
        const response = await authContext.get(`/posts/1`);
        
        // JSONPlaceholder é público, então retorna 200.
        // Em uma API real privada, esperaríamos 401 ou 403.
        // Aqui valido apenas que a requisição completou.
        expect([200, 401, 403]).toContain(response.status()); 
        
        await authContext.dispose();
    });
  });

});