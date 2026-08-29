"use client";

// Fase 4 (PLAN_EJECUCION.md): panel de inventario — listar, crear, editar,
// eliminar productos, toggle de disponibilidad, link del catálogo.

import { useState, useTransition } from "react";
import {
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  ImagePlaceholderIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/icons";
import { ProductForm } from "@/components/ProductForm";
import { ToggleSwitch } from "@/components/toggle-switch";
import { formatCOP } from "@/lib/utils";
import {
  actualizarProducto,
  alternarDisponibleProducto,
  crearProducto,
  eliminarProducto,
  type NuevoProducto,
} from "@/services/products";
import type { Producto, Tienda } from "@/types";

export function DashboardInventory({
  tienda,
  productosIniciales,
}: {
  tienda: Tienda;
  productosIniciales: Producto[];
}) {
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Producto | undefined>(undefined);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const storeUrl = `/store/${tienda.store_code}`;

  function openCreate() {
    setEditing(undefined);
    setFormOpen(true);
  }

  function openEdit(producto: Producto) {
    setEditing(producto);
    setFormOpen(true);
  }

  function handleSubmit(values: NuevoProducto) {
    setFormOpen(false);
    if (editing) {
      const id = editing.id;
      const anterior = productos;
      setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, ...values } : p)));
      startTransition(async () => {
        try {
          await actualizarProducto(id, values);
          setError(null);
        } catch {
          setProductos(anterior);
          setError("No se pudo guardar el producto. Intenta de nuevo.");
        }
      });
    } else {
      startTransition(async () => {
        try {
          const nuevo = await crearProducto(tienda.id, values);
          setProductos((prev) => [nuevo, ...prev]);
          setError(null);
        } catch {
          setError("No se pudo crear el producto. Intenta de nuevo.");
        }
      });
    }
  }

  function handleDelete(id: string) {
    const anterior = productos;
    setProductos((prev) => prev.filter((p) => p.id !== id));
    setConfirmDeleteId(null);
    startTransition(async () => {
      try {
        await eliminarProducto(id);
        setError(null);
      } catch {
        setProductos(anterior);
        setError("No se pudo eliminar el producto. Intenta de nuevo.");
      }
    });
  }

  function handleToggleDisponible(producto: Producto) {
    const anterior = productos;
    const nuevoValor = !producto.disponible;
    setProductos((prev) =>
      prev.map((p) => (p.id === producto.id ? { ...p, disponible: nuevoValor } : p)),
    );
    startTransition(async () => {
      try {
        await alternarDisponibleProducto(producto.id, nuevoValor);
        setError(null);
      } catch {
        setProductos(anterior);
        setError("No se pudo actualizar. Intenta de nuevo.");
      }
    });
  }

  async function handleCopy() {
    const fullUrl = `${window.location.origin}${storeUrl}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-faint">
            Tu catálogo público
          </p>
          <p className="truncate text-sm font-medium">
            ventafacil.com{storeUrl}
          </p>
        </div>
        <div className="flex flex-none gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md border border-line-strong px-3.5 py-2 text-sm font-bold text-ink-soft transition-colors hover:bg-ink/5"
          >
            {copied ? (
              <CheckIcon width={16} height={16} className="text-wa-deep" />
            ) : (
              <CopyIcon width={16} height={16} />
            )}
            {copied ? "Copiado" : "Copiar link"}
          </button>
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90"
          >
            <ExternalLinkIcon width={16} height={16} />
            Ver catálogo
          </a>
        </div>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-xl">
          Mis productos <span className="text-ink-faint">· {productos.length}</span>
        </h1>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2.5 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90"
        >
          <PlusIcon width={16} height={16} />
          <span className="hidden sm:inline">Agregar producto</span>
          <span className="sm:hidden">Agregar</span>
        </button>
      </div>

      {productos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line-strong py-12 text-center text-sm text-ink-soft">
          Todavía no tienes productos. Crea el primero para que aparezca en tu catálogo.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface"
            >
              <div className="relative aspect-square bg-surface-2">
                {producto.imagen_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- imagen remota, sin dominio configurado aún
                  <img
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    className="absolute inset-0 h-full w-full object-contain p-3"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-ink-faint">
                    <ImagePlaceholderIcon width={28} height={28} />
                  </div>
                )}
                {!producto.disponible && (
                  <span className="absolute left-2 top-2 rounded bg-surface px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-ink-faint">
                    Oculto
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2 p-3.5">
                <h3 className="line-clamp-2 min-h-[2.4rem] text-sm font-semibold leading-snug">
                  {producto.nombre}
                </h3>
                <div className="flex items-center justify-between text-xs text-ink-faint">
                  <span className="font-display text-base text-ink">
                    {formatCOP(producto.precio)}
                  </span>
                  <span>Stock: {producto.stock}</span>
                </div>

                <label className="flex items-center justify-between pt-1">
                  <span className="text-xs font-semibold text-ink-soft">Visible</span>
                  <ToggleSwitch
                    checked={producto.disponible}
                    onChange={() => handleToggleDisponible(producto)}
                    label={`Visible en el catálogo: ${producto.nombre}`}
                  />
                </label>

                <div className="mt-auto flex gap-2 pt-2">
                  {confirmDeleteId === producto.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="flex-1 rounded-md border border-line-strong py-2 text-xs font-bold text-ink-soft transition-colors hover:bg-ink/5"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(producto.id)}
                        className="flex-1 rounded-md bg-danger py-2 text-xs font-bold text-danger-ink transition-colors hover:bg-danger/90"
                      >
                        Confirmar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => openEdit(producto)}
                        aria-label={`Editar ${producto.nombre}`}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-line-strong py-2 text-xs font-bold text-ink-soft transition-colors hover:bg-ink/5"
                      >
                        <PencilIcon width={14} height={14} />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(producto.id)}
                        aria-label={`Eliminar ${producto.nombre}`}
                        className="flex h-8 w-8 flex-none items-center justify-center rounded-md border border-line-strong text-ink-faint transition-colors hover:border-danger hover:text-danger"
                      >
                        <TrashIcon width={14} height={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <ProductForm
          producto={editing}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
