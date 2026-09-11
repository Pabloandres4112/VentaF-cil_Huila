"use client";

// Subida del logo de la tienda — mismo mecanismo que image-upload.tsx
// (comprimir a JPEG, subir a Storage, validar tipo/peso) pero con nombre de
// archivo fijo por tienda (se reemplaza, no se acumula), vista previa
// circular (sustituye el círculo con la inicial del nombre) y guardado
// inmediato en la base de datos — no depende del botón "Guardar cambios"
// del resto del formulario de perfil (ver actualizarLogoTienda en
// services/store.ts).

import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { CloseIcon, ImagePlaceholderIcon, SpinnerIcon } from "@/components/icons";
import { compressImageToJpeg } from "@/lib/image-compress";
import { subirLogoTienda } from "@/lib/supabase/storage";
import { actualizarLogoTienda } from "@/services/store";

const MAX_DIMENSION = 400;
const MAX_ARCHIVO_MB = 8;
const TIPOS_ACEPTADOS = ["image/jpeg", "image/png", "image/webp"];

export function LogoUpload({
  tiendaId,
  value,
  onChange,
}: {
  tiendaId: string;
  value: string | null;
  onChange: (logoUrl: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
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
      const comprimida = await compressImageToJpeg(file, MAX_DIMENSION);
      const url = await subirLogoTienda(tiendaId, comprimida);
      await actualizarLogoTienda(tiendaId, url);
      onChange(url);
    } catch {
      setError("No se pudo subir el logo. Intenta de nuevo.");
    } finally {
      setProcessing(false);
    }
  }

  async function handleQuitar() {
    setError(null);
    setProcessing(true);
    try {
      await actualizarLogoTienda(tiendaId, null);
      onChange(null);
    } catch {
      setError("No se pudo quitar el logo. Intenta de nuevo.");
    } finally {
      setProcessing(false);
    }
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
      <span className="text-sm font-semibold text-ink-soft">Logo de tu tienda</span>
      <div className="flex items-center gap-3">
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={handleKeyDown}
          aria-label="Subir logo de la tienda: haz clic para seleccionar"
          className="relative flex h-16 w-16 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-line-strong bg-surface-2 transition-colors hover:border-accent"
        >
          {processing ? (
            <SpinnerIcon width={20} height={20} className="text-ink-faint" />
          ) : value ? (
            // eslint-disable-next-line @next/next/no-img-element -- imagen remota de Supabase Storage, sin dominio configurado aún
            <img src={value} alt="Logo de la tienda" className="h-full w-full object-cover" />
          ) : (
            <ImagePlaceholderIcon width={20} height={20} className="text-ink-faint" />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={processing}
            className="w-fit text-xs font-bold text-accent underline underline-offset-2 disabled:opacity-60"
          >
            {value ? "Cambiar logo" : "Subir logo"}
          </button>
          {value && (
            <button
              type="button"
              onClick={handleQuitar}
              disabled={processing}
              className="flex w-fit items-center gap-1 text-xs text-ink-faint transition-colors hover:text-danger disabled:opacity-60"
            >
              <CloseIcon width={10} height={10} />
              Quitar
            </button>
          )}
          <p className="text-[0.7rem] text-ink-faint">
            Opcional — si no subes uno, se usa la inicial del nombre. Se guarda al instante.
          </p>
        </div>
      </div>

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
