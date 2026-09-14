import { ExternalLinkIcon } from "@/components/icons";

// Botón "Ver catálogo" reutilizado desde el panel de inventario y el de
// perfil — abre el catálogo público en una pestaña nueva, sin duplicar el
// mismo enlace en dos lugares.
export function VerCatalogoLink({ storeCode }: { storeCode: string }) {
  return (
    <a
      href={`/store/${storeCode}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-none items-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90"
    >
      <ExternalLinkIcon width={16} height={16} />
      Ver catálogo
    </a>
  );
}
