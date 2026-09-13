import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

// Playwright no carga .env solo (a diferencia de Next.js) — las pruebas lo
// necesitan para poder crear/borrar datos de prueba con la service role key
// (ver tests/helpers/db.ts).
if (existsSync(".env")) process.loadEnvFile(".env");

// Pruebas automatizadas end-to-end contra un servidor real (no mocks) —
// mismo enfoque que se usó a mano toda la sesión de desarrollo, ahora
// guardado en el repo para que corran solas en vez de repetirlas cada vez.
// Requiere las mismas variables de .env (Supabase real de QA) — nunca
// correr esto contra producción.
//
// La primera vez hay que descargar el navegador de Playwright:
//   pnpm exec playwright install chromium
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
