import type { Metadata } from "next";
import { AvisoWindows } from "@/components/cajasimple/aviso-windows";
import {
  BeneficiosPrincipales,
  ComoEmpezar,
  CtaFinal,
  FaqPremium,
  FooterPremium,
  FuncionesPorCategoria,
  HeroPremium,
  NavbarPremium,
  ProductoEnAccion,
  SeguridadYCompatibilidad,
  SinDescarga,
  TemaPremium,
} from "@/components/cajasimple/rediseno-premium";
import {
  formatearFechaPublicacion,
  obtenerDescargaCajaSimple,
  parsearNovedades,
} from "@/lib/cajasimple";

// SEGUNDO intento de rediseño de prueba (rediseño_CajaSimple.md, versión
// "premium y minimalista") — ver components/cajasimple/rediseno-premium.tsx.
// El primer intento (estilo SaaS) sigue en components/cajasimple/rediseno.tsx,
// por si Pablo prefiere volver a él:
//   git show fix/cajasimple-fecha-y-novedades:app/cajasimple/page.tsx > ...  (versión original, sin rediseño)
//   o usar components/cajasimple/rediseno.tsx en vez de rediseno-premium.tsx
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
  const ayuda = whatsappHref("Hola, necesito ayuda con CajaSimple.");
  const sinDescarga = whatsappHref("Hola, no me aparece la descarga de CajaSimple.");
  const novedades = descarga?.notas ? parsearNovedades(descarga.notas) : [];
  const fechaFormateada = descarga?.fecha ? formatearFechaPublicacion(descarga.fecha) : null;

  return (
    <TemaPremium>
      <main>
        <NavbarPremium descargaUrl={descarga?.url ?? null} />

        <div className="mx-auto max-w-300 px-5 pt-5 sm:px-8">
          <AvisoWindows />
        </div>

        <HeroPremium version={descarga?.version ?? null} descargaUrl={descarga?.url ?? null} />

        {!descarga && <SinDescarga whatsappHref={sinDescarga} />}

        <BeneficiosPrincipales />
        <ProductoEnAccion />
        <FuncionesPorCategoria />
        <ComoEmpezar />
        <SeguridadYCompatibilidad />
        <FaqPremium />
        <CtaFinal
          version={descarga?.version ?? null}
          fechaFormateada={fechaFormateada}
          novedades={novedades}
          descargaUrl={descarga?.url ?? null}
        />

        <FooterPremium whatsappAyuda={ayuda} />
      </main>
    </TemaPremium>
  );
}
