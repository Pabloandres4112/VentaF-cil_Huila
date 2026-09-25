import type { Metadata } from "next";
import { CorreoLegal, LegalList, LegalPage, LegalSection } from "@/components/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de privacidad — Vitrina Digital",
  description: "Cómo Vitrina Digital trata tus datos personales.",
};

export default function PrivacidadPage() {
  return (
    <LegalPage titulo="Política de privacidad y tratamiento de datos personales">
      <p>
        Esta política explica qué datos personales trata Vitrina Digital, para qué, con quién los
        comparte y cómo puedes ejercer tus derechos, de acuerdo con la Ley 1581 de 2012 y sus
        decretos reglamentarios en Colombia.
      </p>

      <LegalSection title="1. Quién es el responsable">
        <p>
          {LEGAL.titular}. Ubicación: {LEGAL.ubicacion}. Correo para consultas, reclamos y
          solicitudes sobre tus datos: <CorreoLegal />.
        </p>
      </LegalSection>

      <LegalSection title="2. A quién aplica y qué papel tenemos">
        <LegalList
          items={[
            <span key="c">
              <strong className="text-ink">Comercios</strong> (quienes crean una tienda): somos
              responsables de los datos de tu cuenta.
            </span>,
            <span key="b">
              <strong className="text-ink">Compradores</strong> (quienes hacen un pedido en el
              catálogo de una tienda): el comercio al que le compras decide para qué usa tus
              datos de pedido. Vitrina Digital actúa como proveedor tecnológico que los guarda y
              los muestra a ese comercio.
            </span>,
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Qué datos tratamos">
        <p className="font-semibold text-ink">Del comercio:</p>
        <LegalList
          items={[
            "Correo electrónico y contraseña (la contraseña la gestiona el servicio de autenticación; nosotros no la vemos).",
            "Nombre de la tienda, número de WhatsApp, logo y colores.",
            "Productos, precios, descripciones y fotos que publicas.",
            "Plan contratado y fecha hasta la que está pagado.",
          ]}
        />
        <p className="font-semibold text-ink">Del comprador, al hacer un pedido:</p>
        <LegalList
          items={[
            "Nombre y dirección de entrega que escribes.",
            "Método de pago que elegiste (solo la opción, por ejemplo Nequi o contra entrega; no recibimos datos de tarjetas ni cuentas).",
            "Los productos, cantidades y el total del pedido, con su fecha y referencia.",
          ]}
        />
        <p className="font-semibold text-ink">Técnicos:</p>
        <LegalList
          items={[
            "Cookie de sesión y almacenamiento local del navegador (ver la Política de cookies).",
            "Dirección IP, solo de forma temporal, para limitar solicitudes abusivas.",
          ]}
        />
        <p>
          No pedimos datos sensibles ni datos de menores de edad, y el servicio está dirigido a
          mayores de 18 años.
        </p>
      </LegalSection>

      <LegalSection title="4. Para qué usamos los datos">
        <LegalList
          items={[
            "Prestar el servicio: mantener tu cuenta, mostrar tu catálogo y llevar el control de tus productos.",
            "Entregar al comercio el pedido del comprador y guardar su historial y el control de stock.",
            "Atender soporte, cobrar y administrar el plan de pago.",
            "Mantener la seguridad y prevenir abusos o fraudes.",
            "Cumplir obligaciones legales.",
          ]}
        />
        <p>No vendemos tus datos ni los usamos para publicidad de terceros.</p>
      </LegalSection>

      <LegalSection title="5. Autorización">
        <p>
          Al crear tu cuenta o al enviar un pedido nos autorizas, de forma previa, expresa e
          informada, a tratar tus datos para las finalidades de esta política. Puedes revocar la
          autorización o pedir que suprimamos tus datos cuando quieras, escribiendo al correo de
          contacto, salvo que exista un deber legal o contractual de conservarlos.
        </p>
      </LegalSection>

      <LegalSection title="6. Con quién los compartimos">
        <LegalList
          items={[
            "Supabase: base de datos, autenticación y almacenamiento de archivos.",
            "Vercel: alojamiento de la aplicación.",
            "WhatsApp (Meta): al enviar un pedido se abre WhatsApp con el mensaje ya armado hacia el comercio; desde ahí el tratamiento se rige por las políticas de WhatsApp.",
            "El comercio al que le haces un pedido, que ve tu nombre, dirección y productos.",
            "Autoridades, cuando la ley lo exija.",
          ]}
        />
        <p>
          Estos proveedores pueden tener sus servidores fuera de Colombia, por lo que tus datos
          pueden transmitirse o almacenarse en el exterior con las medidas de seguridad de cada
          proveedor.
        </p>
      </LegalSection>

      <LegalSection title="7. Tus derechos">
        <p>Como titular de los datos puedes:</p>
        <LegalList
          items={[
            "Conocer, actualizar y rectificar tus datos.",
            "Solicitar prueba de la autorización que diste.",
            "Ser informado del uso que se ha dado a tus datos.",
            "Revocar la autorización y solicitar la supresión de tus datos.",
            "Acceder gratuitamente a tus datos.",
            "Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).",
          ]}
        />
        <p>
          Para ejercerlos escribe a <CorreoLegal /> indicando qué necesitas y cómo identificarte.
          Atendemos las consultas en máximo {LEGAL.plazoConsultaDias} días hábiles y los
          reclamos en máximo {LEGAL.plazoReclamoDias} días hábiles, prorrogables en los
          términos de la ley.
        </p>
        <p>
          Si tienes una tienda, además puedes descargar tus datos y eliminar tu cuenta tú mismo
          desde tu Perfil, en la &quot;Zona de peligro&quot;.
        </p>
      </LegalSection>

      <LegalSection title="8. Cuánto tiempo los conservamos">
        <LegalList
          items={[
            "Los datos de la cuenta, los productos y los pedidos se conservan mientras la cuenta exista.",
            "Al eliminar la cuenta se borran la tienda, los productos, las fotos y los pedidos asociados.",
            "Si eres comprador y quieres que borremos tu pedido, escríbenos al correo de contacto.",
            "Lo que el comercio ya recibió por WhatsApp queda en su WhatsApp, fuera de nuestro control.",
          ]}
        />
      </LegalSection>

      <LegalSection title="9. Seguridad">
        <p>
          Usamos conexiones cifradas (HTTPS), reglas de acceso por fila en la base de datos para
          que cada comercio solo vea lo suyo y servicios de autenticación reconocidos. Ninguna
          medida es infalible; si detectamos un incidente que afecte tus datos te lo
          informaremos.
        </p>
      </LegalSection>

      <LegalSection title="10. Cambios a esta política">
        <p>
          Podemos actualizarla. Publicaremos la versión vigente en esta página con su fecha, y si
          el cambio es importante te avisaremos por correo o dentro del panel.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
