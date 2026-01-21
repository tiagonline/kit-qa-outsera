import GetAnything from "../requests/getAnything.request";
import { group, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 500 }, // Ramp-up agressivo
    { duration: "4m", target: 500 }, // Carga constante (Sustentação)
    { duration: "30s", target: 0 }, // Ramp-down
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // SLA de 500ms
    http_req_failed: ["rate<0.01"], // Erro < 1%
  },
};

export default function () {
  group("Fluxo Crítico - Desafio Outsera", () => {
    let request = new GetAnything();
    request.get();
    sleep(1);
  });
}
