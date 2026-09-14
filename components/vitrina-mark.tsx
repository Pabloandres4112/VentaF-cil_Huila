import { StoreIcon } from "@/components/icons";

// Marca visual de "Vitrina Digital" — reutiliza el ícono de tienda que ya
// existe y ya se ve bien en la app (mismo que el botón "volver al panel" en
// el catálogo público) en vez de un logo nuevo sin probar, con los colores
// de marca fijos (no currentColor) para que se vea igual sin importar el
// tema claro/oscuro o los colores que una tienda haya personalizado.
export function VitrinaMark({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, backgroundColor: "#24405e" }}
      className={`inline-flex flex-none items-center justify-center rounded-lg ${className}`}
    >
      <StoreIcon width={size * 0.58} height={size * 0.58} style={{ color: "#ffffff" }} />
    </span>
  );
}
