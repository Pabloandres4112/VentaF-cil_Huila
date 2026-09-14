import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { crearTienda, getTiendaByUserId } from "@/services/store";
import type { Tienda } from "@/types";

// Server-only: obtiene la tienda del usuario logueado, creándola si es su
// primer ingreso. Compartido por las páginas de /dashboard para no repetir
// la misma secuencia getUser -> getTiendaByUserId -> crearTienda en cada una.
// cache(): ahora también la llama el layout (para el aviso de vencimiento
// del plan Pro) además de cada página — sin esto sería una consulta extra
// por cada navegación.
export const requireTienda = cache(async (): Promise<Tienda> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const tienda = await getTiendaByUserId(user.id);
  if (tienda) return tienda;

  const telefonoWhatsapp =
    typeof user.user_metadata?.telefono_whatsapp === "string"
      ? user.user_metadata.telefono_whatsapp
      : "";

  return crearTienda(user.id, user.email?.split("@")[0] ?? "Mi tienda", telefonoWhatsapp);
});
