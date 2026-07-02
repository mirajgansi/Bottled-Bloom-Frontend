import { test, expect } from "@playwright/test";

test.describe("LoginForm E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Next.js pages can hang on "load", use domcontentloaded
    await page.goto("http://localhost:3000/login", {
      waitUntil: "domcontentloaded",
    });

    // Assert the form is present by finding the submit button
    await expect(page.getByRole("button", { name: /log in/i })).toBeVisible();
  });

  test("renders email, password, and submit button", async ({ page }) => {
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    await expect(page.getByPlaceholder("••••••")).toBeVisible();
    await expect(page.getByRole("button", { name: /log in/i })).toBeVisible();
  });

  test("allows typing email", async ({ page }) => {
    const email = page.getByPlaceholder("you@example.com");
    await email.fill("user@example.com");
    await expect(email).toHaveValue("user@example.com");
  });

  test("allows typing password", async ({ page }) => {
    const pass = page.getByPlaceholder("••••••");
    await pass.fill("secret123");
    await expect(pass).toHaveValue("secret123");
  });

  test("forgot password and signup links navigate correctly", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/login", {
      waitUntil: "domcontentloaded",
    });

    const forgot = page.getByRole("link", { name: /forgot password\?/i });
    await expect(forgot).toBeVisible();

    await Promise.all([
      page.waitForURL("**/request-reset-password", { timeout: 15000 }),
      forgot.click(),
    ]);

    await page.goto("http://localhost:3000/login", {
      waitUntil: "domcontentloaded",
    });

    const signup = page.getByRole("link", { name: /sign up/i });
    await expect(signup).toBeVisible();

    await Promise.all([
      page.waitForURL("**/register", { timeout: 15000 }),
      signup.click(),
    ]);
  });
});
