import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./test",

  projects: [
    {
      name: "setup",
      testMatch: /.*auth\.setup\.ts/,
    },

    // ✅ Guest tests (login/register)
    {
      name: "guest",
      testMatch: /test\/auth\/.*\.spec\.ts/,
      use: {
        baseURL: "http://localhost:3000",
      },
    },

    {
      name: "e2e",
      dependencies: ["setup"],
      testMatch: /test\/user\/.*\.spec\.ts/,
      use: {
        baseURL: "http://localhost:3000",
        storageState: "playwright/.auth/user.json",
      },
    },
  ],
});
