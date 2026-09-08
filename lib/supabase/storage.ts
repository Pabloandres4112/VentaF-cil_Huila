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
