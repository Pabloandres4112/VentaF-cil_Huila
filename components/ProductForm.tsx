"use client";

// Fase 4 (PLAN_EJECUCION.md): formulario de creación/edición de producto (panel admin).

import { useState, type FormEvent, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";
import { ImageUpload } from "@/components/image-upload";
import { ToggleSwitch } from "@/components/toggle-switch";
import type { NuevoProducto } from "@/services/products";
import type { Producto } from "@/types";

const INPUT_CLASS =
  "rounded-md border bg-ground px-3.5 py-2.5 text-sm text-ink outline-none focus:border-accent";

interface ProductFormErrors {
  nombre?: string;
  precio?: string;
  stock?: string;
}

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
  const [imagenUrl, setImagenUrl] = useState<string | null>(producto?.imagen_url ?? null);
  const [disponible, setDisponible] = useState(producto?.disponible ?? true);
  const [errors, setErrors] = useState<ProductFormErrors>({});

  function validate(): boolean {
    const nextErrors: ProductFormErrors = {};

    if (nombre.trim().length < 2) {
      nextErrors.nombre = "Ingresa un nombre (mínimo 2 caracteres).";
    }

    const precioNum = Number(precio);
    if (precio.trim() === "" || Number.isNaN(precioNum) || precioNum <= 0) {
      nextErrors.precio = "Ingresa un precio mayor a $0.";
    }

    const stockNum = Number(stock);
    if (stock.trim() === "" || Number.isNaN(stockNum) || stockNum < 0) {
      nextErrors.stock = "Ingresa un stock válido (0 o más).";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || null,
      precio: Number(precio),
      stock: Number(stock),
      imagen_url: imagenUrl,
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
          <Field label="Nombre" error={errors.nombre}>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Arroz Diana 500g"
              aria-invalid={Boolean(errors.nombre)}
              className={`${INPUT_CLASS} ${errors.nombre ? "border-danger" : "border-line-strong"}`}
            />
          </Field>

          <Field label="Descripción">
            <input
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Una línea simple, opcional"
              className={`${INPUT_CLASS} border-line-strong`}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Precio (COP)" error={errors.precio}>
              <input
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="0"
                aria-invalid={Boolean(errors.precio)}
                className={`${INPUT_CLASS} ${errors.precio ? "border-danger" : "border-line-strong"}`}
              />
            </Field>
            <Field label="Stock" error={errors.stock}>
              <input
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                aria-invalid={Boolean(errors.stock)}
                className={`${INPUT_CLASS} ${errors.stock ? "border-danger" : "border-line-strong"}`}
              />
            </Field>
          </div>

          <ImageUpload value={imagenUrl} onChange={setImagenUrl} />

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

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-ink-soft">{label}</span>
      {children}
      {error ? (
        <span className="text-xs text-danger">{error}</span>
      ) : (
        hint && <span className="text-xs text-ink-faint">{hint}</span>
      )}
    </div>
  );
}
