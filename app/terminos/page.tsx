import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Términos y Condiciones — VentaFácil Huila",
  description: "Términos y condiciones de uso de VentaFácil Huila.",
};

export default function TerminosPage() {
  return (
    <main className="flex-1 bg-ground">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <Link href="/" className="font-display mb-8 inline-block text-lg">
          VentaFácil
        </Link>

        <h1 className="font-display mb-2 text-3xl">Términos y Condiciones</h1>
        <p className="mb-8 text-sm text-ink-faint">Última actualización: 17 de agosto de 2026</p>

        <div className="mb-8 rounded-xl border border-line-strong bg-surface-2 p-4 text-sm text-ink-soft">
          <strong className="text-ink">Aviso: </strong>
          este documento es un borrador base pensado para acompañar el lanzamiento inicial de
          VentaFácil Huila. Antes de considerarlo legalmente vinculante, se recomienda que sea
          revisado por un abogado, en particular en lo relacionado con protección de datos
          personales (Ley 1581 de 2012) y protección al consumidor (Ley 1480 de 2012) en Colombia.
        </div>

        <div className="flex flex-col gap-8 text-sm leading-relaxed text-ink-soft">
          <Section title="1. Objeto del servicio">
            <p>
              VentaFácil Huila (&quot;VentaFácil&quot;, &quot;nosotros&quot;) es un servicio que
              permite a comerciantes (&quot;el Comercio&quot;, &quot;tú&quot;) crear un catálogo
              digital de productos y recibir pedidos organizados a través de WhatsApp. VentaFácil
              no vende directamente los productos publicados: es una herramienta de catálogo y
              comunicación entre el Comercio y sus clientes.
            </p>
          </Section>

          <Section title="2. Registro y responsabilidad de la cuenta">
            <p>
              Para usar el panel administrativo debes registrarte con un correo y contraseña. Eres
              responsable de mantener la confidencialidad de tus credenciales y de toda la
              actividad que ocurra en tu cuenta. A cada cuenta le corresponde una tienda
              identificada con un código único (<em>store code</em>) que no puede cambiarse una
              vez creado.
            </p>
          </Section>

          <Section title="3. Contenido publicado por el Comercio">
            <p>
              Eres el único responsable de la veracidad de los productos, precios, descripciones,
              fotos y disponibilidad que publiques en tu catálogo. VentaFácil no revisa ni
              garantiza la exactitud de esta información — la relación comercial (venta, entrega,
              garantía) ocurre directamente entre el Comercio y su cliente final.
            </p>
          </Section>

          <Section title="4. Planes y pagos">
            <p>
              VentaFácil ofrece distintos planes, incluido uno gratuito. Los pagos de los planes
              pagos se realizan de forma manual, por los medios que se indiquen al momento de la
              contratación (ej. Nequi, Daviplata, transferencia). VentaFácil no almacena ni
              procesa datos de tarjetas ni información financiera sensible.
            </p>
          </Section>

          <Section title="5. Suspensión del servicio">
            <p>
              Si un plan pago no se renueva a tiempo, el catálogo público de la tienda puede
              quedar temporalmente inactivo hasta que se regularice el pago. Esto no implica
              pérdida de información: los productos y la configuración de la tienda se conservan.
            </p>
          </Section>

          <Section title="6. Integración con WhatsApp">
            <p>
              VentaFácil genera enlaces públicos de WhatsApp (wa.me) para que los pedidos lleguen
              directamente al número de WhatsApp que configures. VentaFácil no está afiliado,
              patrocinado ni respaldado por WhatsApp Inc. ni por Meta Platforms, Inc.
            </p>
          </Section>

          <Section title="7. Datos personales">
            <p>
              Al usar el catálogo público, el cliente final puede compartir su nombre, dirección y
              otros datos como parte del mensaje de pedido enviado por WhatsApp — esa información
              viaja directamente al WhatsApp del Comercio y no queda almacenada en los servidores
              de VentaFácil. Los datos de la cuenta del Comercio (correo, nombre de tienda, número
              de WhatsApp) se almacenan de forma segura únicamente para el funcionamiento del
              servicio.
            </p>
          </Section>

          <Section title="8. Propiedad intelectual">
            <p>
              El nombre &quot;VentaFácil&quot;, su diseño y su código son propiedad de VentaFácil
              Huila. El contenido que subas a tu catálogo (fotos, descripciones, nombre de tu
              negocio) sigue siendo de tu propiedad.
            </p>
          </Section>

          <Section title="9. Limitación de responsabilidad">
            <p>
              VentaFácil se ofrece &quot;tal cual&quot;. No garantizamos que el servicio esté
              libre de interrupciones o errores. VentaFácil no es responsable por disputas,
              pérdidas o daños derivados de la relación comercial entre el Comercio y sus clientes.
            </p>
          </Section>

          <Section title="10. Modificaciones a estos términos">
            <p>
              Estos términos pueden actualizarse. Los cambios importantes se comunicarán a través
              del correo registrado o dentro del panel administrativo.
            </p>
          </Section>

          <Section title="11. Ley aplicable">
            <p>Estos términos se rigen por las leyes de la República de Colombia.</p>
          </Section>

          <Section title="12. Contacto">
            <p>
              Para preguntas sobre estos términos, escríbenos por el WhatsApp de contacto
              disponible en la página principal.
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display mb-2 text-lg text-ink">{title}</h2>
      {children}
    </section>
  );
}
