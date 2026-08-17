"use client";

// Subida de foto de producto: arrastrar o seleccionar un archivo, se
// comprime en el navegador (máx. 900px, JPEG) y queda lista como imagen
// incrustada. Cuando exista el proyecto de Supabase (Fase 1), este mismo
// componente sube el archivo comprimido a Supabase Storage en vez de
// incrustarlo — el resto del formulario no cambia.

import { useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from "react";
import { CloseIcon, ImagePlaceholderIcon } from "@/components/icons";

const MAX_DIMENSION = 900;
const JPEG_QUALITY = 0.8;

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
  if (!ctx) return original;

  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

export function ImageUpload({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (imagenUrl: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Solo se aceptan imágenes (JPG, PNG, WebP).");
      return;
    }
    setError(null);
    setProcessing(true);
    try {
      const compressed = await compressImage(file);
      onChange(compressed);
    } catch {
      setError("No se pudo procesar la imagen. Intenta con otra.");
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
          {/* eslint-disable-next-line @next/next/no-img-element -- imagen incrustada (data URL) o remota */}
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
          <ImagePlaceholderIcon width={22} height={22} className="text-ink-faint" />
          <p className="text-xs font-semibold text-ink-soft">
            {processing ? (
              "Procesando imagen…"
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
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
