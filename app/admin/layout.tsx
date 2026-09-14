import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin-nav";
import { isSuperadmin } from "@/lib/auth/superadmin";

// Layout compartido por todo /admin/* (Tiendas y Licencias) — centraliza acá
// la verificación de superadmin (antes cada page.tsx la repetía por su
// cuenta) y agrega un nav para moverse entre las dos vistas sin escribir la
// URL a mano.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const autorizado = await isSuperadmin();
  if (!autorizado) redirect("/");

  return (
    <div className="flex min-h-full flex-1 flex-col bg-ground">
      <AdminNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
