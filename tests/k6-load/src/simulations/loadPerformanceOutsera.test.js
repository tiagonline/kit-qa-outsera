import { group } from "k6";
import GetAnything from "../requests/getAnything.request";
import PostAnything from "../requests/postAntything.request";

export let options = {
  // Configuração para simular 500 VUs por 5 minutos
  stages: [
    { duration: "1m", target: 500 }, // 1. RAMP-UP: Sobe de 0 a 500 usuários em 1 minuto
    { duration: "5m", target: 500 }, // 2. Mantém 500 usuários simultâneos por 5 minutos
    { duration: "30s", target: 0 },  // 3. RAMP-DOWN: Desce suavemente para 0 em 30 segundos
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"], // 95% das requisições devem ser mais rápidas que 2s
    http_req_failed: ["rate<0.05"],    // Taxa de erro deve ser menor que 5%
  },
};

export default function () {
  let getParams = new GetAnything();
  let postParams = new PostAnything();

  group("GET - Consulta Geral", () => {
    getParams.get();
  });

  group("POST - Criação de Dados", () => {
    postParams.post();
  });
}