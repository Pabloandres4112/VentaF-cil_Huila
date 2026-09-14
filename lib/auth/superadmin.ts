// Sistema de Licencias (multi-producto): verificación de superadmin.
//
// Consulta la tabla `superadmins` con la service role key (la tabla tiene
// RLS "FOR ALL USING (false)" — ni siquiera el propio usuario logueado
// puede leerla vía el cliente normal). RLS en `licencias` ya bloquea el
// acceso a nivel de base de datos aunque esta función fallara; esta capa es
// una segunda barrera para no renderizar el panel a quien no debería verlo.
//
// app/admin/layout.tsx la llama una vez por navegación, y cada Server
// Action de admin-tiendas.ts la vuelve a llamar por su cuenta (no confía en
// que solo se invoque desde una página ya protegida) — sin cache(), eso son
// dos consultas idénticas a `superadmins` en la misma petición. cache() de
// React memoiza por petición: mismo request, misma respuesta, una sola
// consulta real; la protección en cada capa sigue intacta.

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export const isSuperadmin = cache(async (): Promise<boolean> => {
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
});
