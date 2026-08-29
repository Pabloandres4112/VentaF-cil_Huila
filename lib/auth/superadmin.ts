// Sistema de Licencias (multi-producto): verificación de superadmin.
//
// Consulta la tabla `superadmins` con la service role key (la tabla tiene
// RLS "FOR ALL USING (false)" — ni siquiera el propio usuario logueado
// puede leerla vía el cliente normal). RLS en `licencias` ya bloquea el
// acceso a nivel de base de datos aunque esta función fallara; esta capa es
// una segunda barrera para no renderizar el panel a quien no debería verlo.

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function isSuperadmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const service = createServiceClient();
  const { data } = await service
    .from("superadmins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return data !== null;
}
