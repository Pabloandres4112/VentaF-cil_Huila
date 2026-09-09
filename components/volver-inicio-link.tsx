import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";

// Botón de "volver" fijo arriba a la izquierda en las pantallas de
// login/registro — para que en mobile quede claro cómo regresar al Home sin
// depender de que el usuario reconozca el logo como un link o use el gesto
// de atrás del navegador.
export function VolverInicioLink() {
  return (
    <Link
      href="/"
      aria-label="Volver al inicio"
      className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-ink-soft transition-colors hover:bg-ink/5 sm:left-6 sm:top-6"
    >
      <ArrowLeftIcon width={16} height={16} />
    </Link>
  );
}
