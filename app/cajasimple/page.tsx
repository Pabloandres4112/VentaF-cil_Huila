import Link from "next/link";
import type { Metadata } from "next";
import { AvisoWindows } from "@/components/cajasimple/aviso-windows";
import {
  CaracteristicasBento,
  CasosDeUso,
  GaleriaTabs,
  HeroRediseno,
  InstalacionRediseno,
  LicenciaDestacada,
  NavbarRediseno,
} from "@/components/cajasimple/rediseno";
import { PreguntasFrecuentes, PrimerDia, Requisitos, Seccion } from "@/components/cajasimple/secciones";
import { WhatsappIcon } from "@/components/icons";
import {
  formatearFechaPublicacion,
  obtenerDescargaCajaSimple,
  parsearNovedades,
} from "@/lib/cajasimple";

// REDISEÑO DE PRUEBA (rediseño_CajaSimple.md) — ver components/cajasimple/rediseno.tsx.
// Si Pablo no lo aprueba, se revierte a la versión anterior con:
//   git checkout fix/cajasimple-fecha-y-novedades -- app/cajasimple/page.tsx
//   rm components/cajasimple/rediseno.tsx
//
// No cambia: lógica/validaciones de descarga (lib/cajasimple.ts), noindex,
// endpoint de licencias ni sus variables. Sin precios, planes, claves de
// licencia ni datos de clientes.
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

export default async function CajaSimplePage() {
  const descarga = await obtenerDescargaCajaSimple();
  const probar = whatsappHref("Hola, quiero probar CajaSimple.");
  const ayuda = whatsappHref("Hola, necesito ayuda con CajaSimple.");
  const sinDescarga = whatsappHref("Hola, no me aparece la descarga de CajaSimple.");
  const novedades = descarga?.notas ? parsearNovedades(descarga.notas) : [];

  return (
    <main className="flex-1 bg-ground">
      <NavbarRediseno descargaUrl={descarga?.url ?? null} />

      <div className="mx-auto max-w-5xl px-5 pt-5 sm:px-8">
        <AvisoWindows />
      </div>

      <HeroRediseno
        version={descarga?.version ?? null}
        fechaFormateada={descarga?.fecha ? formatearFechaPublicacion(descarga.fecha) : null}
        novedades={novedades}
        descargaUrl={descarga?.url ?? null}
        whatsappProbar={probar}
      />

      {!descarga && (
        <div className="mx-auto max-w-3xl px-5 pb-8 sm:px-8">
          <div className="rounded-xl border border-line bg-surface p-6">
            <p className="mb-4 text-sm text-ink-soft">
              La descarga no está disponible en este momento. Escríbenos por WhatsApp y te la
              enviamos.
            </p>
            {sinDescarga && <BotonWhatsapp href={sinDescarga} texto="Escríbenos por WhatsApp" />}
          </div>
        </div>
      )}

      {descarga && (
        <div className="mx-auto max-w-3xl px-5 pb-4 sm:px-8">
          <p className="text-center text-sm text-ink-soft">
            Incluye una versión de prueba con límites. Para usarlo sin límites necesitas una
            licencia. Tamaño aproximado: 3 MB.
          </p>
        </div>
      )}

      <CasosDeUso />
      <GaleriaTabs />
      <CaracteristicasBento />

      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <Requisitos />
      </div>

      <InstalacionRediseno />

      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <PrimerDia />
      </div>

      <LicenciaDestacada />

      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div id="faq">
          <PreguntasFrecuentes />
        </div>

        <Seccion id="contacto" titulo="¿Necesitas ayuda?">
          <p className="mb-4 text-sm text-ink-soft">
            Si tienes cualquier duda, o algo no funciona en la instalación, escríbenos por WhatsApp y
            con gusto te ayudamos.
          </p>
          {ayuda && <BotonWhatsapp href={ayuda} texto="Escríbenos por WhatsApp" />}
        </Seccion>

        <nav
          aria-label="Legal"
          className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line pb-10 pt-6 text-sm text-ink-soft"
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
      className="inline-flex items-center justify-center gap-2 rounded-md bg-wa px-5 py-3 text-sm font-bold text-wa-ink transition-colors hover:bg-wa/90"
    >
      <WhatsappIcon width={18} height={18} />
      {texto}
    </a>
  );
}
