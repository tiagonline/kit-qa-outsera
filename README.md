# playwright-clean-architecture

[![Playwright Tests (CI/CD)](https://github.com/tiagonline/playwright-clean-architecture/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/tiagonline/playwright-clean-architecture/actions/workflows/e2e-tests.yml)
[![API Tests (Postman/Newman)](https://github.com/tiagonline/playwright-clean-architecture/actions/workflows/api-tests.yml/badge.svg)](https://github.com/tiagonline/playwright-clean-architecture/actions/workflows/api-tests.yml)

**Proof of Concept (POC) demonstrando uma arquitetura escalável utilizando o SwagLabs (E-commerce) como sandbox para simular fluxos transacionais complexos, aplicando boas práticas de Engenharia de Qualidade.**

---

## Sobre o Projeto (Qualidade de Engenharia)

Este teste técnico foi estruturado com foco em **Qualidade de Engenharia, Segurança e Escalabilidade**, pilares de um QA Sênior/Lead.

- Uso do **Page Object Model (POM)** com métodos e localizadores **genéricos** para alta escalabilidade.  
- Implementação de **Governança de Código** (`lint`, `format`) para garantir padrões de qualidade em equipe.
- Segurança reforçada através do uso de **variáveis de ambiente** e secrets para todas as credenciais sensíveis.
- O projeto já inclui pipelines de **CI/CD** (Web e API), provando que a solução é robusta e pronta para ser integrada ao processo de entrega contínua.

---

## Decisões de Arquitetura

1. **Segurança & Ambiente (Zero Hardcoding):**
   - Credenciais sensíveis (login válido) são injetadas via **`process.env`**, lidas de um arquivo `.env` (local) ou GitHub Secrets (CI/CD). Nenhum dado sensível é versionado no repositório.

2. **Robustez de Dados (Data Fuzzing com Faker):**
   - A dependência de massas de dados estáticas (`fixtures.json`) foi eliminada para dados de teste.
   - Utilizei a biblioteca **`@faker-js/faker`** para gerar dinamicamente:
     - Credenciais inválidas (usuário/senha) para testes de segurança/negativos.
     - Dados cadastrais (Nome, Sobrenome, CEP) para o fluxo de checkout, garantindo que cada execução utilize um perfil de comprador único e isolado.

3. **Page Object Model (POM) Escalável:**
   - A arquitetura de páginas foi desenhada para ser agnóstica ao conteúdo específico.
   - Exemplo: O método `addItemToCart(itemName)` na `InventoryPage` é **genérico**, construindo seletores dinamicamente. Isso permite adicionar novos produtos ao teste sem precisar alterar uma única linha de código na página.

4. **Maturidade Técnica & Governança:**
   - Implementação de **ESLint** e **Prettier** (`npm run lint` / `npm run format`) para garantir que todo o código siga um padrão estrito de qualidade e formatação, facilitando a revisão de código e manutenção em equipe.

5. **Estratégia Full Stack QA:**
   - **Web (Playwright):** Foco na validação da jornada crítica do usuário (E2E).
   - **API (Postman/Newman):** Foco na validação de contratos, regras de negócio e CRUD de forma rápida e isolada.

6. **CI/CD (GitHub Actions):**
   - Pipelines configurados para execução automática em cada *push* ou *pull request*.
   - Geração e armazenamento de artefatos de teste (Relatórios HTML e Traces) para depuração rápida de falhas no pipeline.

7. **Monitoramento Sintético (Shift-Right):**
   - Agendamento de testes de API (Cron Job) para execução diária, permitindo a detecção proativa de degradação de serviço antes que afete o usuário final.

---

## Como Executar

### Pré-requisitos

- Node.js (v18+)
- Playwright Browsers (instalado via `npm init playwright`)
- Crie um arquivo `.env` na raiz do projeto contendo:
   - SAUCE_USERNAME=standard_user SAUCE_PASSWORD=secret_sauce

---

### 1. Instalação

Clone o repositório e instale as dependências:

```bash
git clone [https://github.com/tiagonline/playwright-on-flight.git](https://github.com/tiagonline/playwright-on-flight.git)
cd playwright-on-flight
npm install
```

### 2. Governança de Código
Execute os comandos abaixo para garantir que seu código está formatado e limpo antes do commit:
```bash
npm run format # Formata o código (Prettier)
npm run lint   # Verifica a qualidade do código (ESLint)
```

### 3. Rodar Testes Web (Playwright)
- O script npm run test agora carregará automaticamente as variáveis do .env:

Executar testes (Headless)
```bash
npm run test
```
Visualizar relatório (Trace Viewer)
```bash
npx playwright show-report
```

### 4. Rodar Testes de API (Newman)
Para validar o CRUD de Usuários (GoRest):

Nota: O token de autenticação não deve ser versionado. Por segurança, nas execuções do Github Actions o token foi embedado como secret.

```bash
npm run test:api -- --env-var "token=SEU_TOKEN_AQUI"
```

**Nota sobre CI/CD da API**: Os testes de API automatizados via Cron Job podem apresentar instabilidade (falso-negativo) devido ao bloqueio de segurança (WAF/Cloudflare) da API pública GoRest contra os IPs dos runners do GitHub Actions, ainda mais que coloquei o monitoramento sintético todo dia as 9h. Em um ambiente real corporativo, isso seria resolvido com Whitelist de IPs.

---
### **Próximos Passos (Visão de Futuro)**
Para evoluir este projeto em um ambiente de produção:

- **Integração com Xray/Jira**: Conectar o relatório de testes para visibilidade total do time de gestão.

- **Contract Testing (Pact)**: Implementar testes de contrato nas APIs críticas para garantir que mudanças no Backend não quebrem o Frontend ou Mobile.

- **Performance no Pipeline**: Integrar testes de carga com K6 diretamente no CI para validar a performance de endpoints críticos (ex: busca de passagens).

- **IA & Self-Healing**: Explorar recursos de IA para "auto-correção" de seletores (self-healing), visando reduzir o custo de manutenção dos scripts a longo prazo.

- **Regressão Visual (Percy.io)**: Comparação de pixels (snapshots) garante que o CSS não quebrou e que a marca/UX está intacta.

- **Cross-browser em Nuvem (BrowserStack/SauceLabs)**: Rodar os testes do Playwright em grids na nuvem (Safari, Edge, Mobile Real Devices). Como a Onfly é acessada de diversos dispositivos, eu conectaria o pipeline ao BrowserStack para garantir a compatibilidade com Safari (iOS) e dispositivos móveis, sem precisar gerenciar infraestrutura interna.
