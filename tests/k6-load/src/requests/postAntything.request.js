import http from "k6/http";
import { check, fail, sleep } from "k6";
import { Trend, Rate } from "k6/metrics";

export let postDuration = new Trend("_1_duration_post");
export let postReqs = new Rate("_2_reqs_post");
export let postSuccessRate = new Rate("_3_success_rate_post");
export let postFailRate = new Rate("_4_fail_rate_post");

export default class PostAnything {
  post() {
    let params = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer xpto",
      },
    };

    let body = JSON.stringify({
      consumerId: "123",
      profileId: "456",
      customProperties: {
        login: "k6_user",
        data: "teste_carga",
      },
    });

    let res = http.post(`https://httpbin.org/post`, body, params);

    check(res, {
      "status is 200": (r) => r.status === 200, 
    });

    // Atualiza as métricas
    postDuration.add(res.timings.duration);
    postReqs.add(1);
    postSuccessRate.add(res.status < 399);
    postFailRate.add(res.status == 0 || res.status > 399);

    let durationMsg = "Max Duration 10s";
    if (
      !check(res, {
        "max duration": (r) => r.timings.duration < 10000,
      })
    ) {
      fail(durationMsg);
    }

    sleep(1);
  }
}