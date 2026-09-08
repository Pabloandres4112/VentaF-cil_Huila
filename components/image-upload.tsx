"use client";

// Subida de foto de producto: arrastrar o seleccionar un archivo, se valida
// tipo y peso, se comprime en el navegador (máx. 900px, siempre reexportada
// como JPEG — esto también neutraliza SVGs con scripts embebidos, porque se
// rasterizan a píxeles) y se sube al bucket `productos` de Supabase Storage.

import { useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from "react";
import { CloseIcon, ImagePlaceholderIcon, SpinnerIcon } from "@/components/icons";
import { subirImagenProducto } from "@/lib/supabase/storage";

const MAX_DIMENSION = 900;
const JPEG_QUALITY = 0.8;
const MAX_ARCHIVO_MB = 8; // antes de comprimir — el bucket ya limita a 5MB el archivo final.
const TIPOS_ACEPTADOS = ["image/jpeg", "image/png", "image/webp"];

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo leer la imagen"));
    img.src = src;
  });
}

async function compressImage(file: File): Promise<string> {
  const original = await readFileAsDataUrl(file);
  const img = await loadImage(original);

  let { width, height } = img;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen");

  // Fondo blanco antes de dibujar: si el original tenía transparencia (PNG),
  // el JPEG de salida no la soporta y quedaría negro sin esto.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

export function ImageUpload({
  tiendaId,
  value,
  onChange,
}: {
  tiendaId: string;
  value: string | null;
  onChange: (imagenUrl: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined | null) {
    if (!file) return;

    if (!TIPOS_ACEPTADOS.includes(file.type)) {
      setError("Solo se aceptan imágenes JPG, PNG o WebP.");
      return;
    }
    if (file.size > MAX_ARCHIVO_MB * 1024 * 1024) {
      setError(`La imagen pesa demasiado (máx. ${MAX_ARCHIVO_MB}MB).`);
      return;
    }

    setError(null);
    setProcessing(true);
    try {
      const comprimida = await compressImage(file);
      const url = await subirImagenProducto(tiendaId, comprimida);
      onChange(url);
    } catch {
      setError("No se pudo subir la imagen. Intenta de nuevo.");
    } finally {
      setProcessing(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    void handleFile(e.dataTransfer.files?.[0]);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    void handleFile(e.target.files?.[0]);
    e.target.value = "";
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-ink-soft">Foto del producto</span>

      {value ? (
        <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-line bg-surface-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- imagen remota de Supabase Storage, sin dominio configurado aún */}
          <img
            src={value}
            alt="Vista previa del producto"
            className="absolute inset-0 h-full w-full object-contain p-2"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Quitar foto"
            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-white transition-colors hover:bg-ink"
          >
            <CloseIcon width={12} height={12} />
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={handleKeyDown}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          aria-label="Subir foto del producto: arrastra un archivo o haz clic para seleccionar"
          className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-4 py-7 text-center transition-colors ${
            dragOver ? "border-accent bg-accent-soft" : "border-line-strong hover:border-accent"
          }`}
        >
          {processing ? (
            <SpinnerIcon width={22} height={22} className="text-ink-faint" />
          ) : (
            <ImagePlaceholderIcon width={22} height={22} className="text-ink-faint" />
          )}
          <p className="text-xs font-semibold text-ink-soft">
            {processing ? (
              "Subiendo imagen…"
            ) : (
              <>
                Arrastra una foto o <span className="text-accent">selecciona un archivo</span>
              </>
            )}
          </p>
          <p className="text-[0.7rem] text-ink-faint">JPG, PNG o WebP — la comprimimos automáticamente</p>
        </div>
      )}

      {error && <p className="text-xs text-danger">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
