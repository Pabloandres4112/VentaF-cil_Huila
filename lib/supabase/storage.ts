import { createClient } from "@/lib/supabase/client";

const BUCKET = "productos";

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/data:(.*?);base64/)?.[1] ?? "image/jpeg";
  const binario = atob(base64);
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

// Sube una imagen ya comprimida (data URL JPEG, ver image-upload.tsx) al
// bucket `productos` y devuelve su URL pública. El nombre del archivo es
// aleatorio, no el nombre original — evita colisiones y no expone nombres de
// archivo del dispositivo del usuario.
export async function subirImagenProducto(tiendaId: string, dataUrl: string): Promise<string> {
  const supabase = createClient();
  const blob = dataUrlToBlob(dataUrl);
  const nombreArchivo = `${tiendaId}/${crypto.randomUUID()}.jpg`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(nombreArchivo, blob, { contentType: "image/jpeg", upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(nombreArchivo);
  return data.publicUrl;
}

// El logo usa un nombre fijo por tienda (a diferencia de las fotos de
// producto) — cada vez que se sube uno nuevo reemplaza al anterior en el
// mismo archivo, así no se acumulan logos viejos huérfanos en el bucket.
// Se le agrega un parámetro de caché al final de la URL porque, al ser
// siempre el mismo nombre de archivo, el navegador podría seguir mostrando
// la imagen vieja en caché después de reemplazarla.
//
// No usamos upload({ upsert: true }): Supabase Storage necesita una política
// RLS de SELECT sobre storage.objects para resolver ese chequeo de "¿ya
// existe?", y a propósito no hay ninguna (solo INSERT/UPDATE/DELETE) — eso
// producía un 403 "new row violates row-level security policy" en cada
// subida. En vez de agregar una política nueva, borramos el archivo viejo
// (si existe) y subimos uno nuevo sin upsert, reutilizando permisos ya
// probados.
export async function subirLogoTienda(tiendaId: string, dataUrl: string): Promise<string> {
  const supabase = createClient();
  const blob = dataUrlToBlob(dataUrl);
  const nombreArchivo = `${tiendaId}/logo.jpg`;

  await supabase.storage.from(BUCKET).remove([nombreArchivo]);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(nombreArchivo, blob, { contentType: "image/jpeg", upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(nombreArchivo);
  return `${data.publicUrl}?v=${Date.now()}`;
}
