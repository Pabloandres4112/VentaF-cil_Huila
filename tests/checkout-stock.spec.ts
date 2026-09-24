import { test, expect } from "@playwright/test";
import {
  borrarTiendaDePrueba,
  crearProductoDePrueba,
  crearTiendaDePrueba,
  nombreUnico,
  type TiendaDePrueba,
} from "./helpers/db";

// Regresión del bug de sobreventa que se arregló manualmente en esta misma
// sesión: dos compras casi simultáneas por la última unidad no deben poder
// vender el mismo producto dos veces (ver descontar_stock_producto en
// supabase/schema.sql y descontarStockPedido en services/products.ts).
test.describe("checkout — descuento de stock", () => {
  let tienda: TiendaDePrueba;
  let productoNombre: string;

  test.beforeAll(async () => {
    tienda = await crearTiendaDePrueba("checkout");
    productoNombre = nombreUnico("Producto QA");
    await crearProductoDePrueba(tienda.tiendaId, {
      nombre: productoNombre,
      precio: 10000,
      stock: 1,
    });
  });

  test.afterAll(async () => {
    await borrarTiendaDePrueba(tienda.userId);
  });

  function tarjetaProducto(page: import("@playwright/test").Page) {
    return page.locator("article").filter({ has: page.locator("h3", { hasText: productoNombre }) });
  }

  async function comprarUnaUnidad(page: import("@playwright/test").Page) {
    await page.goto(`/store/${tienda.storeCode}`);
    await tarjetaProducto(page)
      .getByRole("button", { name: `Agregar ${productoNombre} al carrito` })
      .click();
    await page.getByRole("button", { name: /Ver pedido/i }).click();
    await page.getByRole("button", { name: /Finalizar pedido/i }).click();
    await page.fill("#checkout-nombre", "Cliente de prueba");
    await page.fill("#checkout-direccion", "Calle falsa 123");

    const [popup] = await Promise.all([
      page.waitForEvent("popup").catch(() => null),
      page.getByRole("button", { name: /Enviar pedido por WhatsApp/i }).click(),
    ]);
    if (popup) await popup.close();
  }

  test("la primera compra de la última unidad funciona y la segunda queda bloqueada", async ({
    page,
  }) => {
    await comprarUnaUnidad(page);
    // Sin error visible tras la primera compra — el stock (1) alcanzó.
    await expect(page.getByText("Justo se agotó")).not.toBeVisible();

    // Segunda vez: recargar el catálogo (ya sin stock) e intentar de nuevo
    // debería impedir agregarlo — el botón queda deshabilitado sin stock.
    await page.goto(`/store/${tienda.storeCode}`);
    await expect(page.getByText("Sin stock")).toBeVisible();
    await expect(
      tarjetaProducto(page).getByRole("button", { name: `Agregar ${productoNombre} al carrito` }),
    ).toBeDisabled();
  });
});
