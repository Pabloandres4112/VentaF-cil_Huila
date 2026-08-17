import { DashboardInventory } from "@/components/dashboard-inventory";
import { MOCK_TIENDA } from "@/lib/mock-data";

// Fase 4 (PLAN_EJECUCION.md): panel de inventario, CRUD de productos.
// Sin autenticación real todavía (Fase 1/2 de Supabase en pausa a propósito)
// — usa la tienda de ejemplo directamente.
export default function DashboardPage() {
  return <DashboardInventory tienda={MOCK_TIENDA} />;
}
