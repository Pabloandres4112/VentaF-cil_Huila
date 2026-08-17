import { DashboardProfile } from "@/components/dashboard-profile";

// Fase 4 (PLAN_EJECUCION.md): configuración de tienda (nombre, store_code, WhatsApp).
export default function PerfilPage() {
  return (
    <div>
      <h1 className="font-display mb-6 text-xl">Perfil de la tienda</h1>
      <DashboardProfile />
    </div>
  );
}
