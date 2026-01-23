import { group } from "k6";
import getRequest from "../requests/getRequest";
import postRequest from "../requests/postRequest";

export let options = {
  // Configuração para simular 500 VUs por 5 minutos
  stages: [
    { duration: "10s", target: 10 }, // Sobe para 10 usuários (leve)
    { duration: "30s", target: 10 }, // Mantém por 30 segundos
    { duration: "10s", target: 0 },  // Desce
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"], // 95% das requisições devem ser mais rápidas que 2s
    http_req_failed: ["rate<0.05"],    // Taxa de erro deve ser menor que 5%
  },
};

export default function () {
  let getParams = new getRequest();
  let postParams = new postRequest();

  group("GET - Consulta Geral", () => {
    getParams.get();
  });

  group("POST - Criação de Dados", () => {
    postParams.post();
  });
}