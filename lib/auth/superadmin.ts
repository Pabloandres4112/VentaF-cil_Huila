// Sistema de Licencias (multi-producto): verificación de superadmin.
//
// TODO Fase 2: reemplazar por la verificación real una vez exista el
// proyecto de Supabase — obtener la sesión con lib/supabase/server.ts y
// consultar `SELECT 1 FROM superadmins WHERE user_id = auth.uid()`. RLS en
// la tabla `licencias` (supabase/schema.sql) ya bloquea el acceso a nivel
// de base de datos aunque esta función fallara; esta capa es una segunda
// barrera para no renderizar el panel a quien no debería verlo.
//
// Por ahora retorna un valor fijo para poder construir y probar el panel
// mientras la Fase 1 está en pausa.
export async function isSuperadmin(): Promise<boolean> {
  return true;
}
