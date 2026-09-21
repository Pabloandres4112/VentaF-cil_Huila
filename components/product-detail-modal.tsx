"use client";

// Detalle expandido de un producto del catálogo público: se abre al tocar
// una tarjeta (ver ProductCard.tsx) para no sobrecargar la tarjeta básica
// con descripciones largas o varias fotos (ej. medidas y materiales de un
// mueble). Muestra la portada + hasta 2 fotos adicionales y la descripción
// completa, sin truncar.

import { useState } from "react";
import { ArrowLeftIcon, CloseIcon, ImagePlaceholderIcon, PlusIcon } from "@/components/icons";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { formatCOP } from "@/lib/utils";
import type { Producto } from "@/types";

export function ProductDetailModal({
  producto,
  cantidadEnCarrito = 0,
  onClose,
  onAdd,
}: {
  producto: Producto | null;
  cantidadEnCarrito?: number;
  onClose: () => void;
  onAdd: (producto: Producto) => void;
}) {
  const [indiceImagen, setIndiceImagen] = useState(0);
  useBodyScrollLock(Boolean(producto));

  if (!producto) return null;

  const imagenes = [producto.imagen_url, ...producto.imagenes_adicionales].filter(
    (url): url is string => Boolean(url),
  );
  const agotado = producto.stock <= 0;
  const sinMasStock = cantidadEnCarrito >= producto.stock;
  const imagenActual = imagenes[indiceImagen] ?? null;

  function irA(indice: number) {
    setIndiceImagen((indice + imagenes.length) % imagenes.length);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Detalle de ${producto.nombre}`}
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-4"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-line bg-surface sm:rounded-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-ink-faint shadow-sm transition-colors hover:bg-surface hover:text-ink"
        >
          <CloseIcon width={16} height={16} />
        </button>

        <div className="flex flex-col overflow-y-auto">
          <div className="relative aspect-square flex-none bg-surface-2">
            {imagenActual ? (
              // eslint-disable-next-line @next/next/no-img-element -- imagen remota de Supabase Storage, sin dominio configurado aún
              <img
                src={imagenActual}
                alt={producto.nombre}
                className="absolute inset-0 h-full w-full object-contain p-4"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-ink-faint">
                <ImagePlaceholderIcon width={40} height={40} />
              </div>
            )}

            {imagenes.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => irA(indiceImagen - 1)}
                  aria-label="Foto anterior"
                  className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink shadow-sm transition-colors hover:bg-surface"
                >
                  <ArrowLeftIcon width={16} height={16} />
                </button>
                <button
                  type="button"
                  onClick={() => irA(indiceImagen + 1)}
                  aria-label="Foto siguiente"
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink shadow-sm transition-colors hover:bg-surface"
                >
                  <ArrowLeftIcon width={16} height={16} className="rotate-180" />
                </button>
                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {imagenes.map((url, i) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setIndiceImagen(i)}
                      aria-label={`Ver foto ${i + 1}`}
                      className={`h-1.5 w-1.5 rounded-full transition-colors ${
                        i === indiceImagen ? "bg-accent" : "bg-ink/20"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3 p-5">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-display text-lg leading-snug">{producto.nombre}</h2>
              {agotado && (
                <span className="flex-none whitespace-nowrap rounded bg-surface-2 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-ink-faint">
                  Sin stock
                </span>
              )}
            </div>

            {producto.descripcion && (
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                {producto.descripcion}
              </p>
            )}

            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="font-display text-xl tabular-nums">
                {formatCOP(producto.precio)}
              </span>
              <button
                type="button"
                onClick={() => onAdd(producto)}
                disabled={agotado || sinMasStock}
                className="flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-faint"
              >
                <PlusIcon width={16} height={16} />
                {sinMasStock && !agotado ? "Ya agregaste todo el stock" : "Agregar al carrito"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
