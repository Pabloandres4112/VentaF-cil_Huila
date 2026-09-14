import { DashboardInventory } from "@/components/dashboard-inventory";
import { requireTienda } from "@/lib/auth/session";
import { getProductosByTiendaId } from "@/services/products";

// Fase 4 (PLAN_EJECUCION.md): panel de inventario, CRUD de productos.
export default async function DashboardPage() {
  const tienda = await requireTienda();
  const productosIniciales = await getProductosByTiendaId(tienda.id);

  return <DashboardInventory tienda={tienda} productosIniciales={productosIniciales} />;
}
