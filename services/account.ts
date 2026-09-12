"use server";

// Derecho de habeas data (Ley 1581 de 2012, Colombia): el dueño de una
// tienda debe poder pedir sus datos o borrar su cuenta él mismo, sin
// depender de que alguien del equipo de VentaFácil lo haga a mano en
// Supabase. Ver components/eliminar-cuenta-modal.tsx (UI) y
// components/dashboard-profile.tsx (dónde se usa).

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getProductosByTiendaId } from "@/services/products";
import { getTiendaByUserId } from "@/services/store";
import type { Producto, Tienda } from "@/types";

const BUCKET = "productos";

export interface DatosCuentaExportados {
  exportado_en: string;
  cuenta: { email: string | null };
  tienda: Tienda | null;
  productos: Producto[];
}

// Todo lo que la app guarda sobre el dueño y su tienda, en un solo objeto
// para que el dashboard lo descargue como JSON. Siempre lee la sesión del
// propio servidor (nunca un id que mande el cliente) para que nadie pueda
// pedir los datos de otra tienda cambiando un parámetro.
export async function exportarDatosCuenta(): Promise<DatosCuentaExportados> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const tienda = await getTiendaByUserId(user.id);
  const productos = tienda ? await getProductosByTiendaId(tienda.id) : [];

  return {
    exportado_en: new Date().toISOString(),
    cuenta: { email: user.email ?? null },
    tienda,
    productos,
  };
}

// Borra la cuenta del dueño logueado: sus fotos/logo en Storage, su tienda,
// sus productos y su usuario de Supabase Auth. Irreversible.
//
// La limpieza de Storage usa la service role key, no la sesión del dueño:
// storage.objects solo tiene políticas de INSERT/UPDATE/DELETE (a propósito,
// ver lib/supabase/storage.ts), sin una de SELECT — y list() la necesita
// para poder enumerar los archivos de la carpeta, así que con la sesión
// normal siempre devolvía la carpeta vacía y nada se borraba de verdad. Acá
// es seguro saltarse esa RLS porque el prefijo (tienda.id) ya salió de
// getTiendaByUserId(user.id) — nunca de un valor que mande el cliente.
//
// tiendas.user_id tiene ON DELETE CASCADE hacia auth.users (y
// productos.tienda_id hacia tiendas), así que borrar el usuario de Auth ya
// se lleva la tienda y sus productos solos — esta función nunca borra esas
// filas por su cuenta.
export async function eliminarCuenta(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const tienda = await getTiendaByUserId(user.id);
  const service = createServiceClient();

  if (tienda) {
    const { data: archivos } = await service.storage.from(BUCKET).list(tienda.id);
    if (archivos && archivos.length > 0) {
      await service.storage
        .from(BUCKET)
        .remove(archivos.map((archivo) => `${tienda.id}/${archivo.name}`));
    }
  }

  const { error } = await service.auth.admin.deleteUser(user.id);
  if (error) throw error;
}
