import type { Metadata } from "next";
import { CorreoLegal, LegalList, LegalPage, LegalSection } from "@/components/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de reembolsos y cancelación — Vitrina Digital",
  description: "Cómo cancelar tu plan de pago y pedir la devolución de tu dinero.",
};

export default function ReembolsosPage() {
  return (
    <LegalPage titulo="Política de reembolsos y cancelación">
      <LegalSection title="Qué cubre esta política">
        <p>
          Aplica a los planes de pago de Vitrina Digital (por ejemplo, el plan Pro). El plan
          gratuito no tiene costo, así que no hay nada que reembolsar.
        </p>
      </LegalSection>

      <LegalSection title="Nunca te cobramos sin que tú pagues">
        <p>
          Los pagos se hacen de forma manual (por ejemplo Nequi, Daviplata o transferencia). No
          hay cobros automáticos ni renovaciones que se carguen solas: el precio que acuerdas
          es el que pagas por el periodo que pagas.
        </p>
      </LegalSection>

      <LegalSection title="Cómo cancelar y pedir tu reembolso">
        <LegalList
          items={[
            <span key="1">
              Escríbenos a <CorreoLegal /> o por el WhatsApp de soporte indicando el nombre de tu
              tienda y que quieres cancelar tu plan.
            </span>,
            "Cancelamos tu suscripción.",
            `Te devolvemos el valor pagado del periodo por el mismo medio con el que pagaste, en un máximo de ${LEGAL.plazoReembolsoDias} días hábiles desde que confirmamos tu solicitud.`,
          ]}
        />
      </LegalSection>

      <LegalSection title="Qué pasa con tu tienda al cancelar">
        <p>
          Tus datos se conservan. Tu tienda vuelve al plan gratuito y pueden aplicarse sus
          límites (por ejemplo, la cantidad de productos). Si prefieres que borremos todo, puedes
          eliminar tu cuenta desde tu Perfil o pedírnoslo por correo.
        </p>
      </LegalSection>

      <LegalSection title="Compras que hagas en el catálogo de una tienda">
        <p>
          Vitrina Digital no vende los productos, no cobra las compras ni hace las entregas: eso
          ocurre directamente entre tú y el comercio. Las devoluciones, cambios, garantías y, cuando
          aplique, el derecho de retracto de las ventas a distancia (Ley 1480 de 2011) los
          resuelve el comercio con el que compraste. Los datos de contacto del comercio están en
          su catálogo y en el mensaje de WhatsApp de tu pedido.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
