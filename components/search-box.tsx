"use client";

// Barra de búsqueda reutilizable — filtrado 100% en el cliente sobre una
// lista que ya está cargada (no pega a la base de datos por cada letra).
// Usada en /admin/tiendas (buscar tiendas) y en el catálogo público de cada
// tienda (buscar productos) — ver lib/utils.ts:coincideBusqueda.

import { CloseIcon, SearchIcon } from "@/components/icons";

export function SearchBox({
  value,
  onChange,
  placeholder = "Buscar...",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <SearchIcon
        width={16}
        height={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-md border border-line-strong bg-ground py-2.5 pl-9 pr-9 text-sm text-ink outline-none focus:border-accent [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpiar búsqueda"
          className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-ink-faint hover:bg-ink/5 hover:text-ink"
        >
          <CloseIcon width={11} height={11} />
        </button>
      )}
    </div>
  );
}
