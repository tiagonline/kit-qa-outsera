/kit-qa-outsera
│
├── /pages                     # [VEM DO REPO 1] Seus Page Objects (LoginPage, etc.)
│
├── /tests
│   ├── /api                   # [NOVO] Playwright API
│   │   └── api.spec.ts
│   │
│   ├── /e2e                   # [NOVO] Cucumber BDD (Lógica do Repo 1 adaptada)
│   │   ├── /features
│   │   │   └── checkout.feature
│   │   ├── /steps
│   │   │   └── checkout.steps.ts
│   │   └── /support
│   │       └── world.ts       # (Opcional, ou config no steps)
│   │
│   ├── /k6-load               # [VEM DO REPO 2] Sua estrutura Grafana/Docker
│   │   ├── /dashboards        # JSONs do Grafana
│   │   ├── /src
│   │   │   ├── /requests      # Seus objetos de request
│   │   │   └── /simulations   # Onde criaremos o teste da Outsera
│   │   ├── docker-compose.yml
│   │   ├── grafana-dashboard.yaml
│   │   ├── grafana-datasource.yaml
│   │   └── webpack.config.js  # Config adaptada
│   │
│   └── /mobile                # [NOVO] Placeholder ou Teste Simples
│       ├── README.md
│       └── mobile.spec.ts
│
├── cucumber.js                # [NOVO] Config Cucumber
├── package.json               # [FUSÃO] Dependências Unificadas
└── README.md                  # [VITAL] Documentação