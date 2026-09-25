import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { DownloadIcon, WhatsappIcon } from "@/components/icons";
import { VitrinaMark } from "@/components/vitrina-mark";
import { obtenerDescargaCajaSimple } from "@/lib/cajasimple";

// Página de descarga para los usuarios piloto de CajaSimple. No se enlaza
// desde la portada y va con noindex mientras dure el piloto. Nunca muestra
// claves de licencia ni datos de clientes.
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

const PASOS = [
  {
    titulo: "Descarga el instalador",
    detalle: "Pulsa «Descargar para Windows». Se guarda un archivo que termina en «-setup.exe».",
  },
  {
    titulo: "Ábrelo",
    detalle:
      "Haz doble clic en el archivo descargado. Si Windows muestra una pantalla azul que dice «Windows protegió su PC», es normal: el instalador todavía no tiene certificado de firma de Microsoft.",
    aviso:
      "Pulsa «Más información» y luego «Ejecutar de todas formas». Hazlo solo si descargaste el archivo desde esta página.",
    imagenes: [
      {
        src: "/cajasimple/paso-2a-mas-informacion.png",
        ancho: 564,
        alto: 535,
        titulo: "Primero: pulsa «Más información»",
        alt: "Pantalla azul «Windows protegió su PC». Debajo del texto hay un enlace «Más información» y abajo a la derecha un botón «No ejecutar».",
      },
      {
        src: "/cajasimple/paso-2b-ejecutar-de-todas-formas.png",
        ancho: 551,
        alto: 509,
        titulo: "Después: pulsa «Ejecutar de todas formas»",
        alt: "La misma pantalla azul ahora muestra la aplicación CajaSimple_0.1.0_x64-setup.exe y dos botones abajo: «Ejecutar de todas formas» a la izquierda y «No ejecutar» a la derecha.",
      },
    ],
  },
  {
    titulo: "Sigue el asistente",
    detalle: "Pulsa «Siguiente» y «Instalar», y al terminar «Finalizar».",
  },
  {
    titulo: "Abre CajaSimple",
    detalle:
      "Búscalo en el menú Inicio y ábrelo. Escribe el código de licencia que te enviamos para activarlo.",
  },
];

export default async function CajaSimplePage() {
  const descarga = await obtenerDescargaCajaSimple();
  const ayuda = whatsappHref("Hola, necesito ayuda con CajaSimple.");
  const sinDescarga = whatsappHref("Hola, no me aparece la descarga de CajaSimple.");

  return (
    <main className="flex-1 bg-ground">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <Link href="/" className="mb-8 inline-flex items-center gap-2.5">
          <VitrinaMark size={28} />
          <span className="font-display text-lg">Vitrina Digital</span>
        </Link>

        <h1 className="font-display mb-3 text-3xl sm:text-4xl">CajaSimple para Windows</h1>
        <p className="mb-8 text-lg text-ink-soft">
          Caja registradora e inventario para tiendas pequeñas. Cobra tus ventas y lleva tu
          inventario desde tu computador, incluso sin internet.
        </p>

        <section
          aria-labelledby="descarga"
          className="mb-10 rounded-xl border border-line bg-surface p-6"
        >
          <h2 id="descarga" className="font-display mb-1 text-xl">
            Descarga
          </h2>

          {descarga ? (
            <>
              <p className="mb-4 text-sm text-ink-soft">
                Versión <strong className="text-ink">{descarga.version}</strong>
                {descarga.fecha && <> · publicada el {formatearFecha(descarga.fecha)}</>}
              </p>
              <a
                href={descarga.url}
                download
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90"
              >
                <DownloadIcon width={18} height={18} />
                Descargar para Windows
              </a>
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

        <section aria-labelledby="requisitos" className="mb-10">
          <h2 id="requisitos" className="font-display mb-3 text-xl">
            Requisitos
          </h2>
          <ul className="flex flex-col gap-1.5 pl-5 text-sm text-ink-soft" style={{ listStyleType: "disc" }}>
            <li>Windows 10 o Windows 11, de 64 bits.</li>
            <li>Una licencia de CajaSimple (te la enviamos por WhatsApp).</li>
          </ul>
        </section>

        <section aria-labelledby="instalacion" className="mb-10">
          <h2 id="instalacion" className="font-display mb-4 text-xl">
            Instalación en 4 pasos
          </h2>
          <ol className="flex flex-col gap-4">
            {PASOS.map((paso, i) => (
              <li key={paso.titulo} className="flex gap-3.5">
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-ink"
                >
                  {i + 1}
                </span>
                <div className="text-sm text-ink-soft">
                  <p className="font-semibold text-ink">{paso.titulo}</p>
                  <p>{paso.detalle}</p>
                  {paso.aviso && (
                    <p className="mt-2 rounded-lg bg-accent-soft px-3 py-2 font-semibold text-accent">
                      {paso.aviso}
                    </p>
                  )}
                  {paso.imagenes && (
                    <div className="mt-4 flex flex-col gap-5">
                      {paso.imagenes.map((imagen) => (
                        <figure key={imagen.src} className="flex flex-col gap-2">
                          <figcaption className="font-semibold text-ink">{imagen.titulo}</figcaption>
                          <Image
                            src={imagen.src}
                            alt={imagen.alt}
                            width={imagen.ancho}
                            height={imagen.alto}
                            className="h-auto w-full max-w-md rounded-lg border border-line"
                          />
                        </figure>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {ayuda && (
          <section aria-labelledby="ayuda" className="mb-10">
            <h2 id="ayuda" className="font-display mb-2 text-xl">
              ¿Necesitas ayuda?
            </h2>
            <p className="mb-4 text-sm text-ink-soft">
              Si algo no funciona en la instalación, escríbenos y te ayudamos.
            </p>
            <BotonWhatsapp href={ayuda} texto="Escríbenos por WhatsApp" />
          </section>
        )}

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

function BotonWhatsapp({ href, texto }: { href: string; texto: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-md bg-wa px-5 py-3 text-sm font-bold text-wa-ink transition-colors hover:bg-wa/90"
    >
      <WhatsappIcon width={18} height={18} />
      {texto}
    </a>
  );
}
