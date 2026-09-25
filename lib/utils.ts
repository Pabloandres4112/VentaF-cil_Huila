const COP_FORMATTER = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function formatCOP(value: number): string {
  return COP_FORMATTER.format(value);
}

// "YYYY-MM-DD" en hora local (el formato que usa DateField).
export function aFechaISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Suma meses de calendario sin desbordar: 31 de enero + 1 mes = 28/29 de
// febrero, no el 3 de marzo (que es lo que da Date.setMonth a secas).
export function sumarMeses(base: Date, meses: number): Date {
  const destino = new Date(base.getFullYear(), base.getMonth() + meses, 1);
  const ultimoDia = new Date(destino.getFullYear(), destino.getMonth() + 1, 0).getDate();
  destino.setDate(Math.min(base.getDate(), ultimoDia));
  return destino;
}

interface ProductoConPrecio {
  precio: number;
  precio_descuento: number | null;
}

// El precio que de verdad se cobra: si hay oferta, es ese; si no, el normal.
// Se usa en todo lugar que calcule totales (carrito, checkout, mensaje de
// WhatsApp) para no cobrar el precio de lista cuando hay un descuento activo.
export function precioEfectivo(producto: ProductoConPrecio): number {
  return producto.precio_descuento ?? producto.precio;
}

export function porcentajeDescuento(producto: ProductoConPrecio): number {
  if (!producto.precio_descuento) return 0;
  return Math.round((1 - producto.precio_descuento / producto.precio) * 100);
}

// Personalización de marca (PLAN_EJECUCION.md): el dueño elige un color
// libremente (puede ser amarillo, blanco, lo que sea), así que el texto/ícono
// que va encima no puede quedar fijo en blanco — con un color claro se vuelve
// ilegible. Se calcula la luminancia relativa (fórmula WCAG) y se elige tinta
// oscura o clara según el color de fondo real, no según el tema claro/oscuro.
export function pickContrastingInk(hex: string): string {
  const match = hex.replace("#", "").match(/.{1,2}/g);
  if (!match || match.length < 3) return "#ffffff";

  const [r, g, b] = match.slice(0, 3).map((part) => {
    const channel = parseInt(part, 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.5 ? "#10131a" : "#ffffff";
}

// Búsqueda de texto (usada por SearchBox tanto en /admin/tiendas como en el
// catálogo público): ignora mayúsculas y tildes para que "jabon" encuentre
// "Jabón" — normalize("NFD") separa cada tilde de su letra en un carácter
// aparte (marca diacrítica combinante, rango Unicode U+0300–U+036F) para
// poder quitarla con el regex.
function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function coincideBusqueda(
  query: string,
  ...campos: (string | null | undefined)[]
): boolean {
  const queryNormalizada = normalizarTexto(query.trim());
  if (!queryNormalizada) return true;
  return campos.some((campo) => campo && normalizarTexto(campo).includes(queryNormalizada));
}
