// Constantes del plan gratis, compartidas entre services/products.ts (donde
// se aplica el límite de verdad) y el dashboard (donde solo se muestra).
// Viven aparte de services/products.ts a propósito: un archivo "use server"
// solo puede exportar funciones async — una constante ahí invalida todo el
// módulo de Server Actions.
export const LIMITE_PRODUCTOS_GRATIS = 10;
export const MENSAJE_LIMITE_PRODUCTOS_GRATIS = "LIMITE_PRODUCTOS_GRATIS";
