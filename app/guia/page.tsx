import Link from "next/link";
import type { Metadata } from "next";
import { GuiaContenido } from "@/components/guia-contenido";

export const metadata: Metadata = {
  title: "Guía de uso — Vitrina Digital",
  description: "Cómo crear tu catálogo, recibir pedidos y controlar tu tienda en Vitrina Digital.",
};

export default function GuiaPage() {
  return (
    <main className="flex-1 bg-ground">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <Link href="/" className="font-display mb-8 inline-block text-lg">
          Vitrina Digital
        </Link>
        <h1 className="font-display mb-2 text-3xl">Guía de uso</h1>
        <p className="mb-8 text-sm text-ink-faint">
          Todo lo que necesitas para dejar tu tienda lista y vendiendo.
        </p>
        <GuiaContenido />
      </div>
    </main>
  );
}
