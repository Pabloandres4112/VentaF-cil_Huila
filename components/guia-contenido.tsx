import type { ReactNode } from "react";

// Guía de uso para el dueño de una tienda — pensada para que cualquiera
// pueda resolver solo, sin escribirle a soporte, las dudas de "¿y ahora
// qué hago?" de los primeros días. Ver app/guia/page.tsx.
export function GuiaContenido() {
  return (
    <div className="flex flex-col gap-8 text-sm leading-relaxed text-ink-soft">
      <Section title="¿Qué es Vitrina Digital?">
        <p>
          Es tu catálogo digital. Subes tus productos (foto, precio, existencias) y obtienes un
          link propio para compartir. Tus clientes entran, arman su pedido como en cualquier
          tienda en línea, y al final el pedido te llega organizado directo a tu WhatsApp — sin
          que tengas que instalar nada ni pagar comisión por venta.
        </p>
      </Section>

      <Section title="1. Crea tu cuenta">
        <p>
          Entra a <Code>/registro</Code>, pon tu correo, tu número de WhatsApp y una contraseña.
          Te llega un correo para confirmar tu cuenta — ábrelo y ya puedes entrar a tu panel.
        </p>
      </Section>

      <Section title="2. Deja tu tienda lista">
        <p>Apenas entras la primera vez, tu panel te muestra una lista de &quot;Primeros pasos&quot;:</p>
        <ul className="mt-2 flex flex-col gap-1.5 pl-5" style={{ listStyleType: "disc" }}>
          <li>Agrega tu primer producto (foto, nombre, precio y cuántas unidades tienes).</li>
          <li>Confirma tu número de WhatsApp — ahí es donde te van a llegar los pedidos.</li>
          <li>Sube el logo de tu negocio, si tienes uno (opcional).</li>
          <li>Copia tu link y compártelo — en el estado de WhatsApp, Instagram, TikTok, donde sea.</li>
        </ul>
        <p className="mt-2">
          Desde <Code>Perfil</Code> también puedes personalizar los colores de tu catálogo y ver
          tu código de tienda (el que identifica tu link, no se puede cambiar después).
        </p>
      </Section>

      <Section title="3. Así te llega un pedido">
        <p>
          Tu cliente entra a tu link, arma su carrito, y al confirmar le pide su nombre, dirección
          y método de pago. Ahí mismo se descuenta el stock de lo que compró (para que no se te
          venda de más), y le abre WhatsApp con un mensaje ya armado con todo el detalle del
          pedido — tú solo tienes que responder para cerrar el trato.
        </p>
      </Section>

      <Section title="4. Controla tus pedidos">
        <p>
          En la pestaña <Code>Pedidos</Code> queda guardado cada pedido que se hace desde tu
          catálogo, con su estado:
        </p>
        <ul className="mt-2 flex flex-col gap-1.5 pl-5" style={{ listStyleType: "disc" }}>
          <li>
            <strong className="text-ink">Pendiente</strong> — recién llegó, todavía no se cierra
            el trato.
          </li>
          <li>
            <strong className="text-ink">Completado</strong> — ya se vendió de verdad.
          </li>
          <li>
            <strong className="text-ink">Cancelado</strong> — el cliente no llegó a un acuerdo
            contigo por WhatsApp. Al marcarlo así, <strong className="text-ink">
              el stock que se había descontado vuelve solo a tu inventario
            </strong> — no tienes que corregirlo a mano.
          </li>
        </ul>
      </Section>

      <Section title="5. Tu plan">
        <p>
          El plan <strong className="text-ink">Gratis</strong> te deja tener hasta 10 productos.
          El plan <strong className="text-ink">Pro</strong> no tiene límite. Si tienes Pro, en tu
          Perfil ves hasta cuándo está pagado tu plan — y unos días antes de vencerse, te
          aparece un aviso en tu panel con un botón directo para renovar por WhatsApp.
        </p>
      </Section>

      <Section title="Preguntas frecuentes">
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-semibold text-ink">¿Por qué no solo uso el catálogo de WhatsApp?</p>
            <p>
              El catálogo de WhatsApp no arma carrito (tu cliente tiene que preguntar uno por
              uno), no controla tu stock, y no te deja historial de pedidos. Vitrina Digital hace
              las tres cosas, gratis para empezar, y con tu propia identidad (logo, colores, link
              limpio para compartir).
            </p>
          </div>
          <div>
            <p className="font-semibold text-ink">¿Qué pasa si se me acaba un producto?</p>
            <p>
              Apenas el stock llega a cero, ese producto se marca &quot;Sin stock&quot; en tu catálogo y tus
              clientes no lo pueden agregar al carrito — no tienes que estar pendiente de
              quitarlo a mano.
            </p>
          </div>
          <div>
            <p className="font-semibold text-ink">¿Puedo cambiar mi código de tienda?</p>
            <p>
              No — el código (el que aparece en tu link) queda fijo desde que se crea tu tienda,
              para que el link que ya compartiste nunca se rompa.
            </p>
          </div>
          <div>
            <p className="font-semibold text-ink">¿Cómo borro mi cuenta?</p>
            <p>
              En <Code>Perfil</Code>, abajo del todo, en &quot;Zona de peligro&quot; — ahí también puedes
              descargar toda tu información antes de borrarla.
            </p>
          </div>
        </div>
      </Section>

      <Section title="¿Necesitas ayuda?">
        <p>
          Escríbenos por WhatsApp con el botón de soporte que aparece arriba en tu panel — con
          gusto te ayudamos.
        </p>
      </Section>
    </div>
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

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-surface-2 px-1.5 py-0.5 font-display text-xs text-ink">
      {children}
    </code>
  );
}
