import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Next.js 16 renombró "Middleware" a "Proxy" (mismo mecanismo, mismo
// archivo en la raíz, solo cambia el nombre de la convención y del export).
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

// Solo /dashboard necesita sesión — el resto del sitio (Home, /store/[code],
// /login, /registro, /admin/*) es público o valida su propio acceso, así que
// no tiene sentido pagar una llamada de red a Supabase Auth en cada request
// a esas rutas.
export const config = {
  matcher: ["/dashboard/:path*"],
};
