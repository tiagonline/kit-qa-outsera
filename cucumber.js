//Configuração central do Cucumber.js para testes E2E.

module.exports = {
  default: {
    // Define o caminho para os arquivos de especificação (Gherkin)
    paths: ["tests/e2e/features/**/*.feature"],
    
    // Utiliza o ts-node para permitir a execução direta de arquivos TypeScript
    requireModule: ["ts-node/register"],
    
    // Mapeia a implementação dos passos (steps) e hooks de suporte
    require: ["tests/e2e/steps/**/*.ts", "tests/e2e/support/**/*.ts"],
    
    // Define o formato de saída: barra de progresso no console e relatório visual em HTML
    format: ["progress-bar", "html:cucumber-report.html"]
  },
};