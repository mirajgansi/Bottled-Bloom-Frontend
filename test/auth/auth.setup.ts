import { test as setup, expect } from "@playwright/test";

setup("login as user", async ({ page }) => {
  await page.goto("http://localhost:3000/login", {
    waitUntil: "domcontentloaded",
  });

  await page.getByPlaceholder("you@example.com").fill("testuser@example.com");
  await page.getByPlaceholder("••••••").fill("Secret123!");

  await page.getByRole("button", { name: /log in/i }).click();

  await page.waitForURL("**/user/dashboard", {
    timeout: 30000,
    waitUntil: "domcontentloaded",
  });
  await expect(page).toHaveURL(/\/user\/dashboard/);

  await page.context().storageState({ path: "playwright/.auth/user.json" });
});
