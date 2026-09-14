import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

// Helpers de setup/cleanup para las pruebas E2E — usan la service role key
// para crear datos de prueba directo en la base de datos (más rápido y
// confiable que pasar por la UI para el setup) y siempre limpian lo que
// crean. Nunca corren contra producción: apuntan al mismo Supabase de QA
// que usa `pnpm dev` (.env), que es donde también corre este test.
function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY — corre las pruebas con las mismas variables de entorno que `pnpm dev` (ver .env).",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export interface TiendaDePrueba {
  userId: string;
  email: string;
  password: string;
  tiendaId: string;
  storeCode: string;
}

// Crea un usuario + tienda completos para una prueba, sin pasar por
// /registro (más rápido y no depende de que el correo de confirmación esté
// desactivado en el proyecto de QA).
export async function crearTiendaDePrueba(prefijo: string): Promise<TiendaDePrueba> {
  const admin = adminClient();
  const email = `qa-${prefijo}-${Date.now()}@ventafacil.test`;
  const password = "TestPlaywright123!";

  const { data: userData, error: userError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (userError || !userData.user) throw userError ?? new Error("No se pudo crear el usuario");

  const { data: tienda, error: tiendaError } = await admin
    .from("tiendas")
    .insert({
      user_id: userData.user.id,
      nombre: `Tienda de prueba ${prefijo}`,
      telefono_whatsapp: "573000000000",
    })
    .select()
    .single();
  if (tiendaError) throw tiendaError;

  return {
    userId: userData.user.id,
    email,
    password,
    tiendaId: tienda.id,
    storeCode: tienda.store_code,
  };
}

// Borra el usuario de prueba — tiendas.user_id tiene ON DELETE CASCADE, así
// que esto también se lleva la tienda, sus productos y sus pedidos.
export async function borrarTiendaDePrueba(userId: string): Promise<void> {
  const admin = adminClient();
  await admin.auth.admin.deleteUser(userId);
}

export async function crearProductoDePrueba(
  tiendaId: string,
  datos: { nombre: string; precio: number; stock: number },
): Promise<string> {
  const admin = adminClient();
  const { data, error } = await admin
    .from("productos")
    .insert({
      tienda_id: tiendaId,
      nombre: datos.nombre,
      precio: datos.precio,
      stock: datos.stock,
      disponible: true,
      descripcion: null,
      imagen_url: null,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export function nombreUnico(prefijo: string): string {
  return `${prefijo}-${randomUUID().slice(0, 8)}`;
}
