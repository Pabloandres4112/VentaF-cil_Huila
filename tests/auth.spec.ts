import { test, expect } from "@playwright/test";
import { borrarTiendaDePrueba, crearTiendaDePrueba, type TiendaDePrueba } from "./helpers/db";

// Cubre el camino más básico y más usado de toda la app: si el login se
// rompe, nadie puede entrar a nada más.
test.describe("login", () => {
  let tienda: TiendaDePrueba;

  test.beforeAll(async () => {
    tienda = await crearTiendaDePrueba("login");
  });

  test.afterAll(async () => {
    await borrarTiendaDePrueba(tienda.userId);
  });

  test("con credenciales correctas entra al dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", tienda.email);
    await page.fill("#password", tienda.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole("heading", { name: "Mis productos" })).toBeVisible();
  });

  test("con contraseña incorrecta muestra error y no entra", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", tienda.email);
    await page.fill("#password", "ContraseñaIncorrecta123");
    await page.click('button[type="submit"]');

    await expect(page.getByText("Correo o contraseña incorrectos.")).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });
});
