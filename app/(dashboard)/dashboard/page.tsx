import { redirect } from "next/navigation";
import { DashboardInventory } from "@/components/dashboard-inventory";
import { createClient } from "@/lib/supabase/server";
import { getProductosByTiendaId } from "@/services/products";
import { crearTienda, getTiendaByUserId } from "@/services/store";

// Fase 4 (PLAN_EJECUCION.md): panel de inventario, CRUD de productos.
// Si el usuario logueado todavía no tiene tienda (primer ingreso), se le
// crea una automáticamente para que pueda empezar a cargar productos.
export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let tienda = await getTiendaByUserId(user.id);
  if (!tienda) {
    tienda = await crearTienda(user.id, user.email?.split("@")[0] ?? "Mi tienda");
  }

  const productosIniciales = await getProductosByTiendaId(tienda.id);

  return <DashboardInventory tienda={tienda} productosIniciales={productosIniciales} />;
}
