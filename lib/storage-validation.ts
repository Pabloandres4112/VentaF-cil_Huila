// Defensa en profundidad compartida por services/products.ts y
// services/store.ts: bloquea que alguien llame a un Server Action
// directamente con una URL externa, un `javascript:` o cualquier otra cosa
// que no sea una imagen de nuestro propio bucket `productos` en Storage.
const PREFIJO_PUBLICO = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos/`;

export function esUrlImagenValida(url: string): boolean {
  return url.startsWith(PREFIJO_PUBLICO);
}

// Convierte la URL pública guardada en `imagen_url`/`logo_url` de vuelta al
// path interno del bucket (ej. "tienda-id/archivo.jpg") para poder borrarlo
// de Storage — usado al eliminar o reemplazar la foto de un producto, para
// no dejar archivos huérfanos acumulándose (ver services/products.ts).
export function extraerPathStorage(url: string): string | null {
  if (!esUrlImagenValida(url)) return null;
  const sinPrefijo = url.slice(PREFIJO_PUBLICO.length);
  // El logo lleva un `?v=timestamp` de cache-busting (ver
  // lib/supabase/storage.ts) que no es parte del path real del archivo.
  return sinPrefijo.split("?")[0] || null;
}
