import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    headless: true,
    baseURL: "https://www.saucedemo.com/",
    video: "on",
    trace: "on",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Pra funcionar no WSL do Windows
        launchOptions: {
          args: ["--disable-gpu", "--no-sandbox", "--disable-setuid-sandbox"],
        },
      },
    },
  ],
});
