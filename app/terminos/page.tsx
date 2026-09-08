import Link from "next/link";
import type { Metadata } from "next";
import { TerminosContenido } from "@/components/terminos-contenido";

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
        <h1 className="font-display mb-6 text-3xl">Términos y Condiciones</h1>
        <TerminosContenido />
      </div>
    </main>
  );
}
