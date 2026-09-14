import { WhatsappIcon } from "@/components/icons";

// Canal de soporte visible para el dueño de la tienda dentro del dashboard
// — antes no había ninguno: si algo le fallaba a un cliente pagando, no
// tenía a dónde escribir desde la propia app. Si NEXT_PUBLIC_SOPORTE_WHATSAPP
// no está configurado, no se muestra nada (no queremos un botón roto).
const NUMERO_SOPORTE = process.env.NEXT_PUBLIC_SOPORTE_WHATSAPP;

export function SoporteLink() {
  if (!NUMERO_SOPORTE) return null;

  const mensaje = encodeURIComponent("Hola, necesito ayuda con mi tienda en Vitrina Digital.");

  return (
    <a
      href={`https://wa.me/${NUMERO_SOPORTE}?text=${mensaje}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="¿Necesitas ayuda? Escríbenos por WhatsApp"
      title="¿Necesitas ayuda? Escríbenos"
      className="flex h-9 w-9 items-center justify-center rounded-md border border-line-strong text-wa-deep transition-colors hover:bg-ink/5"
    >
      <WhatsappIcon width={16} height={16} />
    </a>
  );
}
