import Link from "next/link";
import type { ReactNode } from "react";
import { LEGAL } from "@/lib/legal";

// Estructura común de las páginas legales (privacidad, cookies, reembolsos):
// encabezado, fecha y enlaces cruzados entre ellas.
const ENLACES = [
  { href: "/terminos", label: "Términos y Condiciones" },
  { href: "/privacidad", label: "Política de privacidad" },
  { href: "/cookies", label: "Política de cookies" },
  { href: "/reembolsos", label: "Reembolsos" },
];

export function LegalPage({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <main className="flex-1 bg-ground">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <Link href="/" className="font-display mb-8 inline-block text-lg">
          Vitrina Digital
        </Link>
        <h1 className="font-display mb-2 text-3xl">{titulo}</h1>
        <p className="mb-8 text-sm text-ink-soft">Última actualización: {LEGAL.actualizado}</p>
        <div className="flex flex-col gap-6 text-sm leading-relaxed text-ink-soft">{children}</div>
        <nav
          aria-label="Otros documentos legales"
          className="mt-12 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-6 text-sm"
        >
          {ENLACES.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              className="underline underline-offset-2 hover:text-ink"
            >
              {enlace.label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display mb-2 text-lg text-ink">{title}</h2>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-1.5 pl-5" style={{ listStyleType: "disc" }}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function CorreoLegal() {
  return (
    <a
      href={`mailto:${LEGAL.email}`}
      className="font-semibold text-accent underline underline-offset-2"
    >
      {LEGAL.email}
    </a>
  );
}
