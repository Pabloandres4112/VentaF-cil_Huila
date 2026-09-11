// Defensa en profundidad compartida por services/products.ts y
// services/store.ts: bloquea que alguien llame a un Server Action
// directamente con una URL externa, un `javascript:` o cualquier otra cosa
// que no sea una imagen de nuestro propio bucket `productos` en Storage.
export function esUrlImagenValida(url: string): boolean {
  const prefijo = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/productos/`;
  return url.startsWith(prefijo);
}
