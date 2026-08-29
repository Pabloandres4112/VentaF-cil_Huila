import { redirect } from "next/navigation";
import { DashboardProfile } from "@/components/dashboard-profile";
import { createClient } from "@/lib/supabase/server";
import { crearTienda, getTiendaByUserId } from "@/services/store";

// Fase 4 (PLAN_EJECUCION.md): configuración de tienda (nombre, store_code, WhatsApp).
export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let tienda = await getTiendaByUserId(user.id);
  if (!tienda) {
    tienda = await crearTienda(user.id, user.email?.split("@")[0] ?? "Mi tienda");
  }

  return (
    <div>
      <h1 className="font-display mb-6 text-xl">Perfil de la tienda</h1>
      <DashboardProfile tienda={tienda} />
    </div>
  );
}
