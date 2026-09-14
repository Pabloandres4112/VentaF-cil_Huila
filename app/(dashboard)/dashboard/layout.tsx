import type { ReactNode } from "react";
import { DashboardChrome } from "@/components/dashboard-chrome";
import { requireTienda } from "@/lib/auth/session";

// Server Component a propósito: trae la tienda una sola vez (cache() en
// requireTienda evita que la página de abajo la vuelva a consultar) para
// poder mostrar el aviso de vencimiento del plan Pro en cualquier pestaña
// del dashboard, no solo en la que ya la pedía.
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const tienda = await requireTienda();

  return <DashboardChrome tienda={tienda}>{children}</DashboardChrome>;
}
