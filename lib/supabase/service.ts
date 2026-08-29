import { createClient } from "@supabase/supabase-js";

// Cliente con la service role key — SOLO para uso en el servidor (Server
// Actions, Route Handlers). Nunca importar esto desde un componente
// cliente: SUPABASE_SERVICE_ROLE_KEY no lleva el prefijo NEXT_PUBLIC_, así
// que Next.js ya la excluye del bundle del navegador por defecto — pero la
// disciplina de "solo se usa en archivos de servidor" sigue siendo tuya.
// Salta RLS a propósito: el sistema de licencias (panel admin + endpoint de
// validación externo) no tiene una sesión de usuario de Supabase Auth
// detrás todavía, así que la autorización la hace cada capa por su cuenta
// (isSuperadmin() del lado del panel, el secreto compartido del lado de
// CajaSimple) en vez de RLS.
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
