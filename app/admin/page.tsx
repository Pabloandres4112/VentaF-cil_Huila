import { redirect } from "next/navigation";

// /admin a secas no tiene contenido propio — manda a la primera pestaña del
// panel (Tiendas) para que escribir solo "/admin" también funcione.
export default function AdminIndexPage() {
  redirect("/admin/tiendas");
}
