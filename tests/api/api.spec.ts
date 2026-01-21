import { test, expect } from "@playwright/test";

test.skip("GET /api/endpoint", async ({ request }) => {
  const response = await request.get("https://httpbin.org/get");
  expect(response.status()).toBe(200);
});

test.skip("POST /api/endpoint", async ({ request }) => {
  const response = await request.post("https://httpbin.org/post", {
    data: { message: "test" },
  });
  expect(response.status()).toBe(200);
});
