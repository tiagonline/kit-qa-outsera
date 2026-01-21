Feature: Fluxo de Compra SAUCE LABS

  Background:
    Given que estou na página de login do Sauce Labs

  Scenario: Cenário Negativo - Deve falhar ao tentar logar com credenciais inválidas
    When tento logar com credenciais inválidas geradas dinamicamente
    Then devo ver uma mensagem de erro de login

  Scenario: Cenário E2E Principal - Deve realizar a compra de um item com sucesso
    Given que faço login com credenciais válidas
    When adiciono a mochila ao carrinho e prossigo para o checkout
    And preencho os dados de entrega com informações dinâmicas
    Then finalizo o pedido e vejo a confirmação de compra

  Scenario: Cenário Exceção - Deve falhar o checkout com campos de entrega incompletos
    Given que faço login com credenciais válidas
    When adiciono um item ao carrinho e tento continuar sem o CEP
    Then devo ver uma mensagem de erro de CEP obrigatório