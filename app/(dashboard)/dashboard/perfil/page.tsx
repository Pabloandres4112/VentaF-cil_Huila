import { DashboardProfile } from "@/components/dashboard-profile";
import { requireTienda } from "@/lib/auth/session";

// Fase 4 (PLAN_EJECUCION.md): configuración de tienda (nombre, store_code, WhatsApp).
export default async function PerfilPage() {
  const tienda = await requireTienda();

  return (
    <div>
      <h1 className="font-display mb-6 text-xl">Perfil de la tienda</h1>
      <DashboardProfile tienda={tienda} />
    </div>
  );
}
