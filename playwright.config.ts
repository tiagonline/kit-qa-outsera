import { defineConfig, devices } from "@playwright/test";
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],

  use: {
    headless: true,
    // Esta baseURL serve como "Padrão" para testes de UI (Web/Mobile).
    // Assim, nos testes visuais fiz apenas page.goto('/').
    // Nos testes de API, nós sobrescrevemos isso usando a URL completa do GoRest.
    baseURL: "https://www.saucedemo.com/",
    
    video: "on",
    trace: "on",
    screenshot: "only-on-failure",
  },

projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      // Ignora os testes mobile (assim não roda duplicado nem tenta rodar mobile em desktop)
      testIgnore: '**/mobile/**', 
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
      testMatch: '**/mobile/*.spec.ts',
    },
  ],
});