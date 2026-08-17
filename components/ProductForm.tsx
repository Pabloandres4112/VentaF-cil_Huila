"use client";

// Fase 4 (PLAN_EJECUCION.md): formulario de creación/edición de producto (panel admin).

import { useState, type FormEvent, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";
import { ToggleSwitch } from "@/components/toggle-switch";
import type { NuevoProducto } from "@/hooks/useMockInventory";
import type { Producto } from "@/types";

const INPUT_CLASS =
  "rounded-md border border-line-strong bg-ground px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent";

export function ProductForm({
  producto,
  onClose,
  onSubmit,
}: {
  producto?: Producto;
  onClose: () => void;
  onSubmit: (values: NuevoProducto) => void;
}) {
  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(producto?.descripcion ?? "");
  const [precio, setPrecio] = useState(producto ? String(producto.precio) : "");
  const [stock, setStock] = useState(producto ? String(producto.stock) : "");
  const [imagenUrl, setImagenUrl] = useState(producto?.imagen_url ?? "");
  const [disponible, setDisponible] = useState(producto?.disponible ?? true);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || null,
      precio: Number(precio) || 0,
      stock: Number(stock) || 0,
      imagen_url: imagenUrl.trim() || null,
      disponible,
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={producto ? "Editar producto" : "Nuevo producto"}
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-4"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-line bg-surface sm:rounded-2xl">
        <div className="flex flex-none items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-lg">{producto ? "Editar producto" : "Nuevo producto"}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <CloseIcon width={16} height={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
          <Field label="Nombre">
            <input
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Arroz Diana 500g"
              className={INPUT_CLASS}
            />
          </Field>

          <Field label="Descripción">
            <input
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Una línea simple, opcional"
              className={INPUT_CLASS}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Precio (COP)">
              <input
                required
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="0"
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Stock">
              <input
                required
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                className={INPUT_CLASS}
              />
            </Field>
          </div>

          <Field label="URL de la foto" hint="Pega el link de la imagen — la subida directa llega con Supabase Storage.">
            <input
              type="url"
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              placeholder="https://..."
              className={INPUT_CLASS}
            />
          </Field>

          <label className="flex items-center justify-between rounded-md border border-line-strong px-3.5 py-2.5">
            <span className="text-sm font-semibold text-ink-soft">Visible en el catálogo</span>
            <ToggleSwitch
              checked={disponible}
              onChange={setDisponible}
              label="Visible en el catálogo"
            />
          </label>

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-line-strong px-4 py-3 text-sm font-bold text-ink-soft transition-colors hover:bg-ink/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-accent px-4 py-3 text-sm font-bold text-accent-ink transition-colors hover:bg-accent/90"
            >
              {producto ? "Guardar cambios" : "Crear producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-ink-soft">{label}</span>
      {children}
      {hint && <span className="text-xs text-ink-faint">{hint}</span>}
    </div>
  );
}
