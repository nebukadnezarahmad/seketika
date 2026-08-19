import { defineConfig, devices } from "@playwright/test";

/**
 * Uji dijalankan pada ukuran ponsel yang sama dengan papan rancangan
 * (390x844), karena seluruh tata letak aplikasi ini memang dirancang
 * untuk lebar itu.
 */
export default defineConfig({
  testDir: "./uji",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "ponsel",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
