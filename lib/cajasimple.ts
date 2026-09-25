// Descarga de CajaSimple (app de escritorio para Windows). El instalador y su
// latest.json viven en una carpeta pública (bucket `cajasimple` de Supabase
// Storage), no en este repo: así una versión nueva no exige redesplegar
// Vitrina Digital. La app de escritorio lee ese MISMO latest.json para
// actualizarse, por eso aquí solo se lee — nunca se cambia su formato.
//
// No usa la service role ni toca el endpoint de licencias: es lectura pública.

const PLATAFORMA = "windows-x86_64";

export interface DescargaCajaSimple {
  version: string;
  // ISO 8601, o null si el latest.json no trae una fecha válida.
  fecha: string | null;
  notas: string | null;
  url: string;
}

// Dirección base de la carpeta pública, sin barra final.
export function baseDescargasCajaSimple(): string | null {
  const base = process.env.NEXT_PUBLIC_CAJASIMPLE_DESCARGAS_URL?.trim().replace(/\/+$/, "");
  if (!base) return null;
  try {
    const url = new URL(base);
    const seguro = url.protocol === "https:" || url.hostname === "localhost";
    return seguro ? base : null;
  } catch {
    return null;
  }
}

function texto(valor: unknown, maximo: number): string | null {
  if (typeof valor !== "string") return null;
  const limpio = valor.trim().slice(0, maximo);
  return limpio || null;
}

// Devuelve null ante cualquier problema (sin variable, sin red, JSON roto,
// falta la plataforma o el enlace apunta fuera de la carpeta pública): la
// página entonces muestra "descarga no disponible" en vez de un botón roto.
export async function obtenerDescargaCajaSimple(): Promise<DescargaCajaSimple | null> {
  const base = baseDescargasCajaSimple();
  if (!base) return null;

  try {
    const respuesta = await fetch(`${base}/latest.json`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });
    if (!respuesta.ok) return null;

    const datos: unknown = await respuesta.json();
    if (!datos || typeof datos !== "object") return null;
    const { version, notes, pub_date, platforms } = datos as {
      version?: unknown;
      notes?: unknown;
      pub_date?: unknown;
      platforms?: Record<string, { url?: unknown } | undefined>;
    };

    const versionLimpia = texto(version, 30);
    const urlDescarga = texto(platforms?.[PLATAFORMA]?.url, 500);
    if (!versionLimpia || !urlDescarga) return null;

    // El instalador debe estar en la misma carpeta pública: un latest.json
    // alterado no debería poder mandar a los usuarios a otro sitio.
    if (!urlDescarga.startsWith(`${base}/`)) return null;

    const ms = typeof pub_date === "string" ? Date.parse(pub_date) : NaN;

    return {
      version: versionLimpia,
      fecha: Number.isNaN(ms) ? null : new Date(ms).toISOString(),
      notas: texto(notes, 800),
      url: urlDescarga,
    };
  } catch {
    return null;
  }
}
