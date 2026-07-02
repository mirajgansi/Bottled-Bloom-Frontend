import { test, expect, Page } from "@playwright/test";

const DASHBOARD_URL = "http://localhost:3000/user/dashboard";

test.describe("User HomePage E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(DASHBOARD_URL, { waitUntil: "domcontentloaded" });

    // If your dashboard is protected, you may get redirected to login.
    // This will make it obvious:
    await expect(page).not.toHaveURL(/\/login/);
  });

  test("shows hero heading + description", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /all your daily needs/i }),
    ).toBeVisible();

    await expect(
      page.getByText(/enjoy the convenience of shopping/i),
    ).toBeVisible();
  });

  test("shows categories (desktop sidebar)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.reload({ waitUntil: "domcontentloaded" });

    await openCategoriesIfCollapsed(page);

    const meat = page.getByRole("link", { name: "Meat & Fish" }).first();
    const snacks = page.getByRole("link", { name: "Snacks" }).first();

    await expect(meat).toBeVisible();
    await expect(snacks).toBeVisible();
  });

  test("shows categories (mobile horizontal row)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: "domcontentloaded" });

    await openCategoriesIfCollapsed(page);

    await expect(
      page.getByRole("link", { name: "Beverages" }).first(),
    ).toBeVisible();
  });

  test("clicking a category navigates to category page", async ({ page }) => {
    await openCategoriesIfCollapsed(page);

    const meat = page.getByRole("link", { name: "Meat & Fish" }).first();
    await expect(meat).toBeVisible();

    await Promise.all([
      page.waitForURL("**/user/category/meat", { timeout: 15000 }),
      meat.click(),
    ]);

    await expect(page).toHaveURL(/\/user\/category\/meat/);
  });
});

async function openCategoriesIfCollapsed(page: any) {
  // If there is a Categories toggle button/menu, click it
  const toggle = page.getByRole("button", { name: /categories/i }).first();
  if (await toggle.count()) {
    // Only click if links are not visible yet
    const meatLink = page.getByRole("link", { name: "Meat & Fish" }).first();
    if (!(await meatLink.isVisible().catch(() => false))) {
      await toggle.click({ force: true });
    }
  }
}
