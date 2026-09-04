const COP_FORMATTER = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function formatCOP(value: number): string {
  return COP_FORMATTER.format(value);
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
