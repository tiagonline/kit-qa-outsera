# 🚀 Kit QA Outsera - Automação Full Stack

> Projeto de automação de testes "End-to-End" simulando um ambiente real de produção. O projeto abrange testes de API, Interface Web (BDD), Mobile (Emulação) e Performance (Carga).

[![CI Status](https://github.com/tiagonline/kit-qa-outsera/actions/workflows/main_pipeline.yml/badge.svg)](https://github.com/tiagonline/kit-qa-outsera/actions/workflows/main_pipeline.yml)
![Playwright](https://img.shields.io/badge/Playwright-1.40+-green?logo=playwright&logoColor=white)
![Cucumber](https://img.shields.io/badge/Cucumber-BDD-23d160?logo=cucumber&logoColor=white)
![K6](https://img.shields.io/badge/K6-Performance-purple?logo=k6&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)

---

## 🏗️ Arquitetura e Estrutura

O projeto utiliza uma arquitetura modular baseada em **TypeScript**, focada em escalabilidade e facilidade de manutenção.

### Tecnologias e Versões
* **Linguagem:** TypeScript / JavaScript (Node.js v18+)
* **E2E & Mobile:** [Playwright v1.40+](https://playwright.dev/)
* **BDD:** [CucumberJS v10+](https://github.com/cucumber/cucumber-js)
* **Performance:** [K6](https://k6.io/) com InfluxDB e Grafana via Docker.
* **CI/CD:** GitHub Actions.

### 📂 Estrutura de Pastas
```text
kit-qa-outsera/
├── .github/workflows/   # Pipeline de CI/CD (GitHub Actions)
├── pages/               # Page Objects (Mapeamento de elementos e ações)
├── tests/
│   ├── api/             # Testes de Integração de API
│   ├── e2e/             # Testes Web com Cucumber (Features & Steps)
│   ├── mobile/          # Testes de Emulação Mobile
│   ├── k6-load/         # Testes de Carga e Performance (K6)
│   └── support/         # Hooks, Fixtures e Configurações Globais
└── playwright.config.ts # Configuração centralizada do Playwright
```

---

## 🧩 Instalação e Dependências

Para executar este projeto localmente, necessitas de:

1. **Node.js** (v18 ou superior)
2. **Docker** (para os testes de carga com monitorização)

### Instalação

#### 1. Clonar o repositório:

```bash
git clone [https://github.com/tiagonline/kit-qa-outsera.git](https://github.com/tiagonline/kit-qa-outsera.git)
cd kit-qa-outsera
```

#### 2. Instalar dependências:

```bash
npm install
npx playwright install --with-deps
```

#### 3. Variáveis de Ambiente:
Configura o ficheiro `.env` baseado no `.env.example` com o teu `GOREST_TOKEN`.

---

## 🧪 Como Executar os Testes

| Cenário              | Comando              |
|----------------------|----------------------|
| Executar Tudo (CI)   | `npm run test:all`   |
| Testes de API        | `npm run test:api`   |
| Testes Web (BDD)     | `npm run test:e2e`   |
| Testes Mobile        | `npm run test:mobile`|
| Teste de Performance | `npm run k6:run`     |

---

## 📈 Relatórios e Evidências

### **Playwright Report**

Após os testes funcionais, o relatório HTML detalhado é gerado automaticamente.  
Para visualizar:

```bash
npx playwright show-report
```

---

### 📊 Análise de Performance (Tarefa 2)

O teste foi configurado para simular **500 utilizadores simultâneos** durante **5 minutos**, cumprindo os requisitos técnicos.

#### **Resultados Obtidos:**

- **Estabilidade:** A infraestrutura suportou a carga máxima de 500 VUs sem falhas críticas de sistema.  
- **Identificação de Gargalo:** Observou-se que a API pública de mock apresenta degradação de performance (latência > 2s) quando a carga ultrapassa os 350 utilizadores simultâneos.  
- **Métricas:** Foram monitorizadas métricas de duração de pedido (Trend), taxa de sucesso (Rate) e falhas, enviadas em tempo real para o **Grafana**.

---

## 🧭 Produção e Boas Práticas

Este projeto foi desenvolvido seguindo padrões de mercado para **produção**:

- **Page Object Model (POM):** Separação clara entre lógica de teste e seletores.  
- **Continuous Integration:** Pipeline automatizado que valida cada alteração.  
- **Observabilidade:** Monitorização de performance com dashboards profissionais.  
- **Segurança:** Uso de **Secrets** para gestão de tokens e dados sensíveis.

---

**Autor:** Tiago Silva
