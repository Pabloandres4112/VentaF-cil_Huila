import type { Metadata } from "next";
import { CorreoLegal, LegalList, LegalPage, LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Política de cookies — Vitrina Digital",
  description: "Qué cookies y almacenamiento local usa Vitrina Digital.",
};

const FILAS = [
  {
    nombre: "Sesión (cookie de Supabase, empieza por sb-)",
    para: "Mantenerte conectado al panel de tu tienda.",
    quien: "Comercios con sesión iniciada",
  },
  {
    nombre: "Carrito (almacenamiento local, ventafacil_cart_…)",
    para: "Recordar los productos que agregaste al carrito en el catálogo de una tienda.",
    quien: "Compradores",
  },
  {
    nombre: "Tema (almacenamiento local, ventafacil-theme)",
    para: "Recordar si prefieres el tema claro u oscuro.",
    quien: "Todos",
  },
  {
    nombre: "Avisos cerrados (almacenamiento local)",
    para: "No volver a mostrarte la lista de primeros pasos o el aviso de plan que ya cerraste.",
    quien: "Comercios",
  },
];

export default function CookiesPage() {
  return (
    <LegalPage titulo="Política de cookies">
      <p>
        Las cookies son pequeños archivos que un sitio guarda en tu navegador. Vitrina Digital
        también usa el almacenamiento local del navegador, que cumple una función parecida. Esta
        página explica cuáles usamos.
      </p>

      <LegalSection title="Lo que usamos">
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="border-b border-line text-ink">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-semibold">
                  Qué es
                </th>
                <th scope="col" className="px-4 py-2.5 font-semibold">
                  Para qué
                </th>
                <th scope="col" className="px-4 py-2.5 font-semibold">
                  A quién
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {FILAS.map((fila) => (
                <tr key={fila.nombre}>
                  <td className="px-4 py-2.5 align-top text-ink">{fila.nombre}</td>
                  <td className="px-4 py-2.5 align-top">{fila.para}</td>
                  <td className="px-4 py-2.5 align-top">{fila.quien}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection title="Lo que NO usamos">
        <LegalList
          items={[
            "Cookies de publicidad o de seguimiento entre sitios.",
            "Herramientas de analítica de terceros (como Google Analytics) ni píxeles de redes sociales.",
            "Scripts de terceros que rastreen tu navegación.",
          ]}
        />
      </LegalSection>

      <LegalSection title="¿Necesito dar mi consentimiento?">
        <p>
          Todo lo anterior es estrictamente necesario para que el servicio funcione o guarda una
          preferencia que tú elegiste, por eso no te mostramos un aviso para aceptarlo. Si algún
          día agregamos analítica o publicidad, te pediremos tu consentimiento antes de activarla
          y actualizaremos esta página.
        </p>
      </LegalSection>

      <LegalSection title="Cómo borrarlas o bloquearlas">
        <p>
          Puedes borrar las cookies y el almacenamiento local desde la configuración de tu
          navegador. Si lo haces, se cerrará tu sesión, se vaciará tu carrito y se olvidarán tus
          preferencias. Las fuentes de letra se sirven desde nuestro propio dominio, sin
          consultar a terceros en cada visita.
        </p>
      </LegalSection>

      <LegalSection title="Contacto">
        <p>
          Si tienes dudas sobre esta política escríbenos a <CorreoLegal />.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
