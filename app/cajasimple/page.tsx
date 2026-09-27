import { Download, HardDrive, RefreshCw, ScanBarcode, WifiOff } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { AvisoWindows } from "@/components/cajasimple/aviso-windows";
import {
  Galeria,
  Instalacion,
  Licencia,
  PreguntasFrecuentes,
  PrimerDia,
  QueHace,
  Requisitos,
  Seccion,
} from "@/components/cajasimple/secciones";
import { WhatsappIcon } from "@/components/icons";
import { VitrinaMark } from "@/components/vitrina-mark";
import { obtenerDescargaCajaSimple } from "@/lib/cajasimple";

// Página de descarga y presentación de CajaSimple para los usuarios piloto.
// No se enlaza desde la portada y va con noindex mientras dure el piloto.
// Nunca muestra claves de licencia ni datos de clientes, ni precios ni planes.
export const metadata: Metadata = {
  title: "CajaSimple para Windows — Vitrina Digital",
  description: "Descarga CajaSimple: caja registradora e inventario para tiendas pequeñas.",
  robots: { index: false, follow: false },
};

// La versión publicada puede cambiar sin redesplegar: se vuelve a leer cada 60 s.
export const revalidate = 60;

const NUMERO_SOPORTE = process.env.NEXT_PUBLIC_SOPORTE_WHATSAPP;

function whatsappHref(mensaje: string): string | null {
  if (!NUMERO_SOPORTE) return null;
  return `https://wa.me/${NUMERO_SOPORTE}?text=${encodeURIComponent(mensaje)}`;
}

function formatearFecha(iso: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

const DATOS_RAPIDOS = [
  { icono: WifiOff, texto: "Funciona sin internet" },
  { icono: HardDrive, texto: "Tus datos quedan en tu computador" },
  { icono: ScanBarcode, texto: "Escáner de códigos de barras" },
  { icono: RefreshCw, texto: "Actualizaciones automáticas" },
];

export default async function CajaSimplePage() {
  const descarga = await obtenerDescargaCajaSimple();
  const probar = whatsappHref("Hola, quiero probar CajaSimple.");
  const ayuda = whatsappHref("Hola, necesito ayuda con CajaSimple.");
  const sinDescarga = whatsappHref("Hola, no me aparece la descarga de CajaSimple.");

  return (
    <main className="flex-1 bg-ground">
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        <Link href="/" className="mb-8 inline-flex items-center gap-2.5">
          <VitrinaMark size={28} />
          <span className="font-display text-lg">Vitrina Digital</span>
        </Link>

        <AvisoWindows />

        <header className="mb-10">
          <h1 className="font-display mb-3 text-3xl sm:text-5xl">CajaSimple para Windows</h1>
          <p className="mb-6 max-w-2xl text-lg text-ink-soft">
            Caja registradora e inventario para tiendas pequeñas. Cobra tus ventas y lleva tu
            inventario desde tu computador, incluso sin internet.
          </p>

          <div className="mb-8 flex flex-col gap-3 sm:flex-row">
            {descarga && (
              <a
                href={descarga.url}
                download
                rel="noopener"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-4 text-base font-bold text-accent-ink transition-colors hover:bg-accent/90"
              >
                <Download aria-hidden="true" className="h-5 w-5" />
                Descargar para Windows
              </a>
            )}
            {probar && <BotonWhatsapp href={probar} texto="Escríbenos por WhatsApp" secundario />}
          </div>

          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {DATOS_RAPIDOS.map(({ icono: Icono, texto }) => (
              <li
                key={texto}
                className="flex flex-col items-start gap-2 rounded-xl border border-line bg-surface p-4"
              >
                <Icono aria-hidden="true" className="h-5 w-5 text-accent" />
                <span className="text-sm font-semibold text-ink">{texto}</span>
              </li>
            ))}
          </ul>
        </header>

        <section
          aria-labelledby="descarga"
          className="mb-14 rounded-xl border border-line bg-surface p-6"
        >
          <h2 id="descarga" className="font-display mb-1 text-xl">
            Descarga
          </h2>

          {descarga ? (
            <>
              <p className="mb-4 text-sm text-ink-soft">
                Versión <strong className="text-ink">{descarga.version}</strong>
                {descarga.fecha && <> · publicada el {formatearFecha(descarga.fecha)}</>} · tamaño
                aproximado: 3 MB
              </p>
              <a
                href={descarga.url}
                download
                rel="noopener"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90 sm:w-auto"
              >
                <Download aria-hidden="true" className="h-4.5 w-4.5" />
                Descargar para Windows
              </a>
              <p className="mt-4 text-sm text-ink-soft">
                Incluye una versión de prueba con límites. Para usarlo sin límites necesitas una
                licencia.
              </p>
              {descarga.notas && (
                <div className="mt-5 border-t border-line pt-4">
                  <p className="mb-1 text-sm font-semibold text-ink">Novedades de esta versión</p>
                  <p className="whitespace-pre-line text-sm text-ink-soft">{descarga.notas}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="mb-4 text-sm text-ink-soft">
                La descarga no está disponible en este momento. Escríbenos por WhatsApp y te la
                enviamos.
              </p>
              {sinDescarga && <BotonWhatsapp href={sinDescarga} texto="Escríbenos por WhatsApp" />}
            </>
          )}
        </section>

        <QueHace />
        <Galeria />
        <Requisitos />
        <Instalacion />
        <PrimerDia />
        <Licencia />
        <PreguntasFrecuentes />

        <Seccion id="contacto" titulo="¿Necesitas ayuda?">
          <p className="mb-4 text-sm text-ink-soft">
            Si tienes cualquier duda, o algo no funciona en la instalación, escríbenos por WhatsApp y
            con gusto te ayudamos.
          </p>
          {ayuda && <BotonWhatsapp href={ayuda} texto="Escríbenos por WhatsApp" />}
        </Seccion>

        <nav
          aria-label="Legal"
          className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-6 text-sm text-ink-soft"
        >
          <Link href="/terminos" className="underline underline-offset-2 hover:text-ink">
            Términos y Condiciones
          </Link>
          <Link href="/privacidad" className="underline underline-offset-2 hover:text-ink">
            Política de privacidad
          </Link>
        </nav>
      </div>
    </main>
  );
}

function BotonWhatsapp({
  href,
  texto,
  secundario = false,
}: {
  href: string;
  texto: string;
  secundario?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        secundario
          ? "inline-flex items-center justify-center gap-2 rounded-md border border-line-strong px-6 py-4 text-base font-bold text-wa-deep transition-colors hover:bg-ink/5"
          : "inline-flex items-center justify-center gap-2 rounded-md bg-wa px-5 py-3 text-sm font-bold text-wa-ink transition-colors hover:bg-wa/90"
      }
    >
      <WhatsappIcon width={18} height={18} />
      {texto}
    </a>
  );
}
