# Kit QA Outsera - Automação Full Stack

> Projeto de automação de testes "End-to-End" simulando um ambiente real de produção. O projeto abrange testes de API, Interface Web (BDD), Mobile (Emulação) e Performance (Carga).

[![CI Status](https://github.com/tiagonline/kit-qa-outsera/actions/workflows/workflow-pipeline.yml/badge.svg)](https://github.com/tiagonline/kit-qa-outsera/actions/workflows/workflow-pipeline.yml)
![Playwright](https://img.shields.io/badge/Playwright-1.40+-green?logo=playwright&logoColor=white)
![Cucumber](https://img.shields.io/badge/Cucumber-BDD-23d160?logo=cucumber&logoColor=white)
![K6](https://img.shields.io/badge/K6-Performance-purple?logo=k6&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)

---

## 1. Arquitetura e Estrutura

O projeto utiliza uma arquitetura modular baseada em **TypeScript**, focada em escalabilidade e facilidade de manutenção.

### 1.1 Tecnologias e Versões
* **Linguagem:** TypeScript / JavaScript (Node.js v18+)
* **E2E & Mobile:** [Playwright v1.40+](https://playwright.dev/)
* **BDD:** [CucumberJS v10+](https://github.com/cucumber/cucumber-js)
* **Performance:** [K6](https://k6.io/) com InfluxDB e Grafana via Docker.
* **CI/CD:** GitHub Actions.

### 1.2 Estrutura de Pastas
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

## 2. Instalação e Dependências

Para executar este projeto localmente, necessitas de:

1. **Node.js** (v18 ou superior)  
2. **Docker** (para os testes de carga com monitorização)

### 2.1 Instalação

#### 2.1.1 Clonar o repositório:
```bash
git clone https://github.com/tiagonline/kit-qa-outsera.git
cd kit-qa-outsera
```

#### 2.1.2 Instalar dependências:
```bash
npm install
npx playwright install --with-deps
```

---

## 3. Segurança e Variáveis de Ambiente

O projeto utiliza o ficheiro **.env** para gerir dados sensíveis e configurações de ambiente, garantindo que informações como credenciais de acesso não sejam versionadas.

### 3.1 Configuração Local

1. Crie um ficheiro **.env** na raiz do projeto baseado no **.env.example**.  
2. Configure os seguintes parâmetros:
   - `API_BASE_URL`: Define o endpoint da API (atualmente configurado para `https://jsonplaceholder.typicode.com`).  
   - `SAUCE_USERNAME`: Usuário para os testes E2E (ex: `standard_user`).  
   - `SAUCE_PASSWORD`: Senha para os testes E2E (ex: `secret_sauce`).  

### 3.2 Segurança no CI/CD (GitHub Actions)

Por boas práticas de segurança, o ficheiro **.env** não é enviado para o repositório (está no **.gitignore**).  
Nas execuções do **GitHub Actions**, estas variáveis foram configuradas como **Secrets** do repositório, permitindo que a pipeline rode de forma segura sem expor dados sensíveis em logs públicos.

---

## 4. Como Executar os Testes

| Cenário              | Comando              |
|----------------------|----------------------|
| Executar Tudo (CI)   | `npm run test:all`   |
| Testes de API        | `npm run test:api`   |
| Testes Web (BDD)     | `npm run test:e2e`   |
| Testes Mobile        | `npm run test:mobile`|
| Teste de Performance | `npm run k6:run`     |

### 4.1 🛠️ Como visualizar os relatórios:
1. Vá até a aba **Actions** no GitHub.  
2. Selecione a última execução bem-sucedida.  
3. No final da página, descarregue os **Artifacts**.  
4. Extraia os arquivos e abra o `index.html` (Playwright) ou `cucumber-report.html` (E2E) no seu navegador preferido.

---

## 5. Relatórios e Evidências

### 5.1 Playwright Report

Após os testes funcionais, o relatório HTML detalhado é gerado automaticamente.  
Para visualizar:
```bash
npx playwright show-report
```

---

## 6. Análise de Performance (Tarefa 2 – k6)

O teste de carga foi executado utilizando **k6** e conteinerização com **Docker**, simulando um cenário de alta disponibilidade com **500 usuários simultâneos (VUs)**.

### 6.1 Resumo da Execução

| Métrica                 | Resultado Obtido | Status                       |
|--------------------------|------------------|------------------------------|
| Usuários Simultâneos     | 500 VUs          | ✅ Sucesso                   |
| Taxa de Sucesso (Checks) | 99.79%           | ✅ Sucesso                   |
| Tempo de Resposta (P95)  | 990ms            | ✅ Dentro do Limite (< 2s)   |
| Requisições Falhas       | 0.41%            | ✅ Dentro do Limite (< 5%)   |
| Total de Requisições     | 207.186          | ⚡ Alta Vazão                |

### 6.2 Infraestrutura de Monitoramento

A solução foi implementada com uma stack de observabilidade completa:

- **k6:** Motor de execução dos testes.  
- **InfluxDB:** Armazenamento de métricas em tempo real.  
- **Grafana:** Dashboard para visualização de tendências e gargalos.  

### 6.3 Insights Técnicos e Identificação de Gargalos

1. **Conformidade de Thresholds:** Todos os critérios de aceitação (SLA) foram atingidos.  
   O tempo de resposta para 95% dos usuários (P95) ficou em **990ms**, bem abaixo do limite crítico de **2000ms**.

2. **Estabilidade Sob Pressão:** O sistema manteve uma vazão média de **486 requisições por segundo (RPS)**, demonstrando resiliência.

3. **Ponto de Atenção:** Embora a taxa de erro seja baixa (**0.41%**), observou-se um aumento pontual na latência máxima (**6.35s**).  
   Isso indica que, apesar da média ser excelente, em picos extremos acima de **450 VUs**, alguns usuários podem experimentar lentidão momentânea devido ao limite da API de Mock.

---

## 7. Produção e Boas Práticas

Este projeto foi desenvolvido seguindo padrões de mercado para **produção**:

- **Page Object Model (POM):** Separação clara entre lógica de teste e seletores.  
- **Continuous Integration:** Pipeline automatizado que valida cada alteração.  
- **Observabilidade:** Monitorização de performance com dashboards profissionais com **Grafana**.  
- **Segurança:** Uso de **Secrets** para gestão de tokens e dados sensíveis.

---

**Autor:** Tiago Silva
